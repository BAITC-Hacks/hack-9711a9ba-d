"""Integration tests; every database and server is isolated in a temporary directory."""
import json
from contextlib import closing
import os
from pathlib import Path
import shutil
import socket
import sqlite3
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

SOURCE = Path(__file__).resolve().parents[1]
PHP = [os.environ.get('PHP_BINARY', 'php'), '-d', 'display_errors=stderr']
TEST_ENV = dict(os.environ, AI_API_KEY='')

def copy_app(target):
    for name in ['api', 'data', 'lib', 'prompts', 'schema.sql', 'db.php', 'rating.php',
                 'ai_helper.php', 'config.php', 'migrate.php', 'seed.php']:
        source = SOURCE / name
        if source.is_dir():
            shutil.copytree(source, target / name)
        else:
            shutil.copy2(source, target / name)

def cli(root, file, expected=0):
    p = subprocess.run(PHP + [str(root/file)], capture_output=True, encoding='utf-8', timeout=30, env=TEST_ENV)
    assert p.returncode == expected, (file, p.stdout, p.stderr)
    return json.loads(p.stdout)

def migration_test():
    with tempfile.TemporaryDirectory(prefix='ai-sana-migration-') as temp:
        root = Path(temp)
        assert root.resolve().parent == Path(tempfile.gettempdir()).resolve()
        copy_app(root)
        with closing(sqlite3.connect(root/'database.sqlite')) as db:
            db.executescript((SOURCE/'tests/fixtures/schema_v0.sql').read_text(encoding='utf-8'))
            db.execute("INSERT INTO tasks(id, raw_description) VALUES (42, 'Legacy draft')")
            db.execute('INSERT INTO cards(id, task_id, context_confirmed, rating, published) VALUES(7,42,1,20,1)')
            db.execute("INSERT INTO teams(id, name) VALUES (9, 'Legacy team')")
            db.execute('INSERT INTO proposals(id,card_id,team_id,chosen) VALUES(12,7,9,1)')
            db.commit()
        cli(root, 'migrate.php')
        cli(root, 'migrate.php')
        assert cli(root, 'seed.php')['status'] == 'skipped'
        with closing(sqlite3.connect(root/'database.sqlite')) as db:
            assert db.execute('SELECT id,raw_description,status FROM tasks').fetchone() == (42,'Legacy draft','published')
            assert db.execute('SELECT id,rating,published FROM cards').fetchone() == (7,0,1)
            assert db.execute('SELECT id,chosen,status FROM proposals').fetchone() == (12,1,'accepted')
            assert db.execute('PRAGMA foreign_key_check').fetchall() == []
    with tempfile.TemporaryDirectory(prefix='ai-sana-bad-seed-') as temp:
        root = Path(temp)
        assert root.resolve().parent == Path(tempfile.gettempdir()).resolve()
        copy_app(root)
        (root/'data/proposals_seed.json').write_text('{bad-json', encoding='utf-8')
        cli(root, 'seed.php', 1)
        with closing(sqlite3.connect(root/'database.sqlite')) as db:
            assert all(db.execute(f'SELECT COUNT(*) FROM {t}').fetchone()[0] == 0
                       for t in ['tasks','cards','teams','proposals'])

def http_test():
    with tempfile.TemporaryDirectory(prefix='ai-sana-api-') as temp:
        root = Path(temp)
        assert root.resolve().parent == Path(tempfile.gettempdir()).resolve()
        copy_app(root)
        for file in root.rglob('*.php'):
            subprocess.run(PHP + ['-l', str(file)], check=True, capture_output=True, timeout=15)
        assert cli(root, 'seed.php')['status'] == 'created'
        assert cli(root, 'seed.php')['status'] == 'skipped'
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            port = sock.getsockname()[1]
        with (root/'server.log').open('w') as log:
            server = subprocess.Popen(PHP + ['-S', f'127.0.0.1:{port}', '-t', str(root)], stdout=log, stderr=log,
                                      env=TEST_ENV, creationflags=subprocess.CREATE_NO_WINDOW if os.name == 'nt' else 0)
            count = 0
            def request(path, method='GET', data=None, expected=200, raw=None, headers=None):
                nonlocal count
                payload = raw if raw is not None else (json.dumps(data).encode() if data is not None else None)
                request_headers = {'Content-Type':'application/json', **(headers or {})}
                request_headers = {key: value for key, value in request_headers.items() if value is not None}
                req = urllib.request.Request(f'http://127.0.0.1:{port}/api/'+path,
                    data=payload, method=method, headers=request_headers)
                try:
                    response = urllib.request.urlopen(req, timeout=10)
                except urllib.error.HTTPError as e:
                    response = e
                with response:
                    result = json.loads(response.read().decode())
                    assert response.status == expected, (path, response.status, result)
                    assert response.headers.get('Access-Control-Allow-Origin') is None
                    assert 'application/json' in response.headers['Content-Type']
                count += 1
                return result
            try:
                for _ in range(100):
                    try:
                        with socket.create_connection(('127.0.0.1', port), timeout=.2):
                            break
                    except OSError:
                        time.sleep(.05)
                else:
                    raise AssertionError('Server did not start')
                assert [c['rating'] for c in request('catalog.php')] == [100,90,70,40,20]
                request('cards.php', 'OPTIONS', headers={'Origin':'https://unrelated.example', 'Access-Control-Request-Method':'POST'})
                filtered = request('catalog.php?'+urllib.parse.urlencode({'topic':'ОБРАЗОВАНИЕ','level':'приоритет'}))
                assert [c['id'] for c in filtered] == [5]
                assert request('catalog.php?topic=%25_no_match') == []
                assert len(request('tasks.php')) == 5
                for content_type in ['text/plain', 'application/x-www-form-urlencoded', '']:
                    request('tasks.php','POST',{'raw_description':'Cross-origin injected task'},415,
                            headers={'Content-Type':content_type,'Origin':'https://unrelated.example'})
                request('tasks.php','POST',expected=415,headers={'Content-Type':None})
                assert len(request('tasks.php')) == 5
                t = request('tasks.php','POST',{'raw_description':'Нужен прогноз для кафе.'},201)['task_id']
                q = request('questions.php?task_id='+str(t))
                assert q['provider']=='local_stub' and len(q['questions'])>=3
                assert q['fallback_reason'] == 'not_configured'
                request('questions.php','POST',{'task_id':t,'card_id':1},400)
                built = request('generate.php','POST',{'task_id':t,'answers':{'title':'Прогноз кафе','topic':'HoReCa','data_materials':'CSV'}},201)
                c = built['card_id']
                card = built['card']
                assert built['provider'] == 'local_stub' and built['fallback_reason'] == 'not_configured'
                assert card['context']=='Нужен прогноз для кафе.' and card['rating']==0 and card['published']==0
                assert card['business_contact']=='' and len(card['rating_details']['missing_fields'])==7
                request('publish.php','PATCH',{'card_id':c,'published':1},400)
                proposal = {'card_id':c,'team_id':1,'solution_idea':'Идея','plan':'План','deadline':'2026-10-15','prototype_link':''}
                request('proposals.php','POST',proposal,409)
                assert request('publish.php','PATCH',{'card_id':c,'published':1,'confirmed':True})['rating']==0
                assert request('tasks.php?id='+str(t))['status']=='published'
                assert c in [r['id'] for r in request('catalog.php')]
                p1 = request('proposals.php','POST',proposal,201)['proposal_id']
                p2 = request('proposals.php','POST',dict(proposal,team_id=2),201)['proposal_id']
                team_proposals = request('proposals.php?team_id=1')
                assert any(p['id'] == p1 and p['card_title'] == 'Прогноз кафе' and p['team_name'] for p in team_proposals)
                assert all(isinstance(p[field], str) for p in team_proposals
                           for field in ['team_interests', 'team_skills', 'team_technologies'])
                assert all(p['team_id'] == 1 for p in team_proposals)
                assert [p['id'] for p in request(f'proposals.php?team_id=2&card_id={c}')] == [p2]
                assert all(p['chosen']==0 and p['status']=='pending' for p in request('proposals.php?card_id='+str(c)))
                request('choose.php','PATCH',{'proposal_id':p1})
                request('choose.php','PATCH',{'proposal_id':p2,'decision':'accepted'})
                assert sum(p['chosen'] for p in request('proposals.php?card_id='+str(c)))==2
                request('choose.php','PATCH',{'proposal_id':p1,'decision':'rejected'})
                assert [p['status'] for p in request('proposals.php?card_id='+str(c))]==['rejected','accepted']
                request('choose.php','PATCH',{'proposal_id':p2,'decision':'pending'})
                request('choose.php','PATCH',{'proposal_id':p1,'decision':'accepted'})
                for field, score in zip(['context','data_materials','expected_result','success_criteria','constraints','users','business_contact'],[20,40,55,70,80,90,100]):
                    updated = request('cards.php','PATCH',{'id':c,'field':field,'value':'Подтверждённый текст'})
                    assert updated['rating']==score and updated['published']==0
                assert request('tasks.php?id='+str(t))['status']=='draft'
                assert len(request(f'questions.php?task_id={t}&card_id={c}')['questions'])==3
                request('publish.php','PATCH',{'card_id':c,'published':1,'confirmed':1})
                assert request('cards.php','PATCH',{'id':c,'field':'context','value':'Подтверждённый текст'})['published']==1
                assert request('cards.php','PATCH',{'id':c,'field':'context','value':'','confirmed':0})['rating']==80
                request('cards.php','PATCH',{'id':c,'field':'context','value':'Новый контекст','confirmed':False})
                request('publish.php','PATCH',{'card_id':c,'published':1,'confirmed':1})
                c2 = request('cards.php','POST',{'task_id':t,'title':'Вторая','context':'Контекст'},201)['card_id']
                request('publish.php','PATCH',{'card_id':c2,'published':1,'confirmed':1})
                request('publish.php','PATCH',{'card_id':c,'published':0})
                assert request('tasks.php?id='+str(t))['status']=='published'
                request('publish.php','PATCH',{'card_id':c2,'published':0})
                assert request('tasks.php?id='+str(t))['status']=='draft'
                assert [p['chosen'] for p in request('proposals.php?card_id='+str(c))]==[1,0]
                assert request('proposals.php?card_id=1')==[]
                team = request('teams.php','POST',{'name':'New team','skills':'PHP'},201)['team_id']
                assert team>5 and len(request('teams.php'))==6
                assert request('teams.php?id='+str(team))['name'] == 'New team'
                updated_team = request('teams.php','PATCH',{'id':team,'name':'Updated team','technologies':'PHP, SQLite'})
                assert updated_team['id'] == team and updated_team['skills'] == 'PHP'
                request('teams.php','PATCH',{'id':team,'name':'Injected team'},415,headers={'Content-Type':'text/plain'})
                request('teams.php','PATCH',expected=415,headers={'Content-Type':None})
                assert request('teams.php?id='+str(team))['name'] == 'Updated team'
                assert request('teams.php?id='+str(team))['technologies'] == 'PHP, SQLite'
                request('teams.php?id='+str(team),'PATCH',{'interests':'Образование'},
                        headers={'Content-Type':'Application/JSON; charset=UTF-8'})
                assert len(request('teams.php')) == 6
                for path, method, data, status in [
                    ('tasks.php','POST',{},400),('tasks.php?id[]=1','GET',None,400),
                    ('tasks.php','POST',{'raw_description':'x' * 12001},400),
                    ('tasks.php','POST',{'raw_description':'text\x00hidden'},400),
                    ('tasks.php?id=99999','GET',None,404),('tasks.php','DELETE',None,405),
                    ('cards.php','POST',{'task_id':99999},404),
                    ('cards.php','PATCH',{'id':c,'field':'rating','value':'100'},400),
                    ('cards.php','PATCH',{'id':c,'field':'context','value':''},400),
                    ('cards.php','PATCH',{'id':c,'field':'context','value':'x','confirmed':None},400),
                    ('cards.php','PATCH',{'id':c,'field':'title','value':None},400),
                    ('cards.php','PATCH',{'id':c,'field':'title','value':'x','confirmed':1},400),
                    ('cards.php','PATCH',{'id':99999,'field':'context','value':'x'},404),
                    ('generate.php','POST',{'task_id':t,'answers':[]},400),
                    ('generate.php','POST',{'task_id':t,'answers':{'users':None}},400),
                    ('generate.php','POST',{'task_id':t,'answers':{'chosen':1}},400),
                    ('generate.php','POST',{'task_id':t,'answers':{'business_contact':'person@example.com'}},422),
                    ('generate.php','POST',{'task_id':99999},404),
                    ('questions.php?task_id=99999','GET',None,404),
                    ('publish.php','PATCH',{'card_id':c,'published':'1','confirmed':1},400),
                    ('publish.php','PATCH',{'card_id':99999,'published':1,'confirmed':1},404),
                    ('choose.php','PATCH',{'proposal_id':p1,'decision':None},400),
                    ('choose.php','PATCH',{'proposal_id':p1,'decision':'auto'},400),
                    ('choose.php','PATCH',{'proposal_id':99999},404),
                    ('choose.php','POST',{'proposal_id':p1},405),
                    ('catalog.php?sort=bad','GET',None,400),('catalog.php?level=bad','GET',None,400),
                    ('catalog.php?topic=%FF','GET',None,400),
                    ('teams.php?id=99999','GET',None,404),('teams.php?id[]=1','GET',None,400),
                    ('teams.php','PATCH',{'id':team,'name':''},400),
                    ('teams.php','PATCH',{'id':team},400),
                    ('teams.php','PATCH',{'id':team,'skills':[]},400),
                    ('teams.php','PATCH',{'id':team,'chosen':1},400),
                    ('teams.php','PATCH',{'id':99999,'name':'Missing team'},404),
                    ('proposals.php','GET',None,400),('proposals.php?team_id=99999','GET',None,404),
                    ('proposals.php?team_id[]=1','GET',None,400),
                    ('proposals.php','POST',dict(proposal,deadline='2026-02-30'),400),
                    ('proposals.php','POST',dict(proposal,deadline='2026-10-15\x00'),400),
                    ('proposals.php','POST',dict(proposal,prototype_link='javascript:alert(1)'),400),
                    ('proposals.php','POST',dict(proposal,chosen=1),400)]:
                    request(path,method,data,status)
                request('tasks.php','POST',expected=400,raw=b'{invalid')
                request('tasks.php','POST',expected=400,raw=b'[]')
                for file in ['tasks','cards','catalog','teams','proposals','choose','questions','generate','publish']:
                    request(file+'.php','OPTIONS')
                assert cli(root,'seed.php')['status']=='skipped'
                cli(root,'migrate.php')
                assert request('proposals.php?card_id='+str(c))[0]['chosen']==1
                with closing(sqlite3.connect(root/'database.sqlite')) as db:
                    assert db.execute('PRAGMA foreign_key_check').fetchall()==[]
                    assert db.execute('PRAGMA integrity_check').fetchone()==('ok',)
                (root/'.env').write_text('invalid-private-configuration\n', encoding='utf-8')
                for path, method, data in [
                    ('cards.php','POST',{'action':'questions','task_id':t}),
                    ('questions.php','POST',{'task_id':t}),
                    ('generate.php','POST',{'task_id':t}),
                ]:
                    error = request(path, method, data, expected=500)
                    assert 'error' in error and 'invalid-private-configuration' not in json.dumps(error)
                return count
            finally:
                server.terminate()
                server.wait(timeout=10)

if __name__ == '__main__':
    subprocess.run(PHP+[str(SOURCE/'tests/rating_test.php')], check=True, timeout=30)
    migration_test()
    count = http_test()
    print(f'PASS: migration preservation/repeatability, seed rollback, PHP lint, {count} HTTP requests')
