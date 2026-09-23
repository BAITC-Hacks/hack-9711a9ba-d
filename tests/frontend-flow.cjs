// Real browser + PHP + SQLite; runs in a disposable copy, never touches the project database.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const assert = require('node:assert/strict');
const {spawn, spawnSync} = require('node:child_process');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');
const php = process.env.PHP_BINARY || 'php';
const temp = fs.mkdtempSync(path.join(os.tmpdir(),'sana-browser-'));
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));

(async () => {
  for (const name of ['api','lib','data','prompts','frontend','index.html','db.php','rating.php','ai_helper.php','schema.sql','seed.php']) {
    fs.cpSync(path.join(root,name),path.join(temp,name),{recursive:true});
  }
  const env = {...process.env, AI_API_KEY:''};
  const seed = spawnSync(php,['seed.php'],{cwd:temp,env,encoding:'utf8',windowsHide:true});
  assert.equal(seed.status,0,seed.stderr);
  const port = await new Promise(resolve => {
    const probe = net.createServer(); probe.listen(0,'127.0.0.1',() => {const p=probe.address().port;probe.close(()=>resolve(p));});
  });
  const base = 'http://127.0.0.1:'+port;
  const server = spawn(php,['-S','127.0.0.1:'+port,'-t',temp],{cwd:temp,env,windowsHide:true,stdio:'ignore'});
  let browser;
  try {
    for (let n=0;n<50;n++) {try {if ((await fetch(base+'/api/teams.php')).ok) break;} catch {} await pause(100);}
    browser = await chromium.launch({headless:true, channel:process.env.BROWSER_CHANNEL || 'msedge'});
    const page = await browser.newPage({viewport:{width:1366,height:900}});
    page.setDefaultTimeout(15000);
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400) errors.push(response.status()+' '+response.url());});
    await page.goto(base);
    await page.locator('[data-role="business"]').click();
    await page.locator('#raw-description').fill('Нужен прогноз продаж кафе, хотим уменьшить списания выпечки.');
    await page.locator('#draft-form button').click();
    await page.waitForURL('**/questions.html?*');
    await page.locator('[data-answer-field]').first().waitFor();
    assert.ok(await page.locator('[data-answer-field]').count()>=3);
    for (const input of await page.locator('[data-answer-field]').all()) {
      await input.fill('Команда изучает продажи кафе и готовит понятный прототип для управляющего.');
    }
    await page.locator('#questions-form button').click();
    await page.waitForURL('**/card.html?*');
    const cardId = new URL(page.url()).searchParams.get('card_id');
    await page.locator('[data-field-form="title"]').waitFor();
    const save = async (field,text,confirm=false) => {
      const form=page.locator('[data-field-form="'+field+'"]');
      await form.locator('textarea').fill(text);
      if(confirm) await form.locator('input[type="checkbox"]').check();
      const response=page.waitForResponse(r=>r.url().endsWith('/api/cards.php') && r.request().method()==='PATCH');
      await form.locator('button[type="submit"]').click();
      assert.equal((await response).status(),200);
      await page.waitForFunction(() => !document.querySelector('#notice')?.textContent.includes('Ошибка'));
    };
    await save('title','Прогноз продаж — браузерный сценарий');
    await save('topic','HoReCa');
    await save('context','Кафе хочет уменьшить списания выпечки.',true);
    await page.waitForFunction(()=>document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')==='20');
    assert.equal(await page.locator('#publish-button').isDisabled(),true);
    await save('data_materials','CSV продаж кафе за шесть месяцев.',true);
    await page.waitForFunction(()=>document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')==='40');
    await page.locator('#publish-button').click();
    await page.waitForURL('**/proposals.html?*');
    const published = await (await fetch(base+'/api/cards.php?id='+cardId)).json();
    assert.equal(Number(published.published),1);
    console.log('PASS: draft → AI questions → AI card → field confirmations → rating 40 → publication');
    await page.goto(base+'/frontend/index.html');
    await page.locator('[data-role="team"]').click();
    await page.locator('#team-form [name="name"]').fill('Browser team');
    await page.locator('#team-form button').click();
    await page.waitForURL('**/catalog.html');
    await page.locator('#filter-level').selectOption('в работе');
    await page.locator('a.catalog-card').filter({hasText:'браузерный сценарий'}).click();
    await page.waitForURL('**/task-view.html?*');
    await page.locator('#proposal-form [name="solution_idea"]').fill('Прогноз спроса по продажам.');
    await page.locator('#proposal-form [name="plan"]').fill('Изучение данных, прототип, проверка.');
    await page.locator('#proposal-form [name="deadline"]').fill('2027-01-15');
    await page.locator('#proposal-form button').click();
    await page.waitForURL('**/my-proposals.html');
    await page.getByText('На рассмотрении',{exact:true}).waitFor();
    const own = await page.evaluate(()=>localStorage.getItem('aiSana.teamId'));
    const extra = await fetch(base+'/api/proposals.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      card_id:cardId,team_id:own,solution_idea:'Второе предложение',plan:'Другой план',prototype_link:'',deadline:'2027-01-16'
    })});
    assert.equal(extra.status,201);
    await page.goto(base+'/frontend/business/proposals.html?card_id='+cardId);
    await page.locator('[data-decision="accepted"]').first().click();
    await page.locator('.proposal-status.chosen').waitFor();
    await page.locator('[data-decision="accepted"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('.proposal-status.chosen').length===2);
    await page.locator('[data-decision="rejected"]').first().click();
    await page.waitForFunction(()=>document.querySelectorAll('.proposal-status.chosen').length===1);
    await page.goto(base+'/frontend/team/my-proposals.html');
    await page.getByText('Не выбрано',{exact:true}).waitFor();
    await page.getByText('Выбрано',{exact:true}).waitFor();
    console.log('PASS: team → filtered catalog → proposal → multiple manual choices → rejection → team statuses');
    await page.goto(base+'/frontend/team/profile.html');
    await page.locator('#use-team:not(:disabled)').waitFor();
    await page.locator('#use-team').click();
    await page.waitForURL('**/catalog.html');
    assert.equal((await (await fetch(base+'/api/teams.php')).json()).filter(t=>t.name==='Browser team').length,1);
    await page.goto(base+'/frontend/business/card.html?card_id='+cardId);
    await page.locator('[data-unlock="context"]').click();
    await page.locator('[data-field-form="context"] input[type="checkbox"]').waitFor();
    const edited=await (await fetch(base+'/api/cards.php?id='+cardId)).json();
    assert.equal(Number(edited.published),0);
    assert.equal(Number(edited.rating),20);
    await page.screenshot({path:path.join(temp,'card.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS: reuse team, edit confirmed field, unpublish on change; no browser/API errors');
    console.log('Artifacts: '+temp);
  } finally {
    if(browser) await browser.close();
    server.kill();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
