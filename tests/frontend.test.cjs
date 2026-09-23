const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../frontend');

function script(name, extra = {}) {
  const context = vm.createContext({ window: {}, URL, URLSearchParams, AbortController, setTimeout, clearTimeout, ...extra });
  vm.runInContext(fs.readFileSync(path.join(root, 'js', name), 'utf8'), context);
  return context.window;
}

test('negative proposal statuses never appear selected, including stale selected flags', () => {
  const { proposalStatus } = script('ui.js').SanaUI;
  for (const status of ['not_selected', 'не выбрано', 'Не выбрана', 'rejected']) {
    assert.equal(proposalStatus({ status, selected:true }), 'Не выбрано');
  }
  assert.equal(proposalStatus({ status:'selected' }), 'Выбрано');
  assert.equal(proposalStatus({ status:'pending' }), 'На рассмотрении');
});

test('prototype links accept HTTP URLs and reject executable schemes', () => {
  const { safeUrl } = script('ui.js').SanaUI;
  assert.equal(safeUrl('https://example.org/demo'), 'https://example.org/demo');
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('data:text/html,hello'), '');
});

test('rating levels follow score boundaries even if server label is stale', () => {
  const rating = script('ratings.js').SanaRating;
  for (const [score, expected] of [[0,'project'],[39,'project'],[40,'work'],[69,'work'],[70,'ready'],[89,'ready'],[90,'priority'],[100,'priority']]) {
    assert.equal(rating.level('priority', score).key, expected);
  }
});

test('API rejects HTML errors and unsuccessful JSON even with HTTP 200', async () => {
  for (const body of ['<html>PHP warning</html>', JSON.stringify({success:false,message:'Ошибка записи'})]) {
    const api = script('api.js', { fetch:async () => new Response(body, {status:200}) }).SanaAPI;
    await assert.rejects(api.publishCard(1));
  }
});

test('API sends exact confirmation payload and unwraps server data', async () => {
  const payload = {card_id:7,field:'context',value:'Описание задачи',confirmed:true};
  const api = script('api.js', { fetch:async (url, options) => {
    assert.equal(url, '/api/cards.php');
    assert.equal(options.method, 'PATCH');
    assert.deepEqual(JSON.parse(options.body), payload);
    return new Response(JSON.stringify({data:{rating:20}}));
  } }).SanaAPI;
  assert.equal((await api.updateCardField(payload)).rating, 20);
});

test('HTML navigation, styles and script references point to existing local files', () => {
  const files = fs.readdirSync(root, {recursive:true}).filter(name => name.endsWith('.html'));
  for (const file of files) {
    const source = fs.readFileSync(path.join(root,file), 'utf8');
    for (const [,reference] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|#)/.test(reference)) continue;
      const target = path.resolve(root,path.dirname(file),reference.split('?')[0]);
      assert.ok(fs.existsSync(target), `${file}: missing ${reference}`);
    }
  }
});

test('API timeout cancels a stalled request without retrying a mutation', async () => {
  let calls = 0;
  const api = script('api.js', { window:{API_TIMEOUT_MS:5}, fetch:async (url, options) => {
    calls++;
    return new Promise((resolve,reject) => options.signal.addEventListener('abort', () => reject(Object.assign(new Error('Aborted'), {name:'AbortError'}))));
  } }).SanaAPI;
  await assert.rejects(api.publishCard(1), /не ответил вовремя/);
  assert.equal(calls,1);
});

test('card keeps other edits and retries a failed refresh without repeating successful PATCH', async () => {
  const handlers = {};
  const host = {innerHTML:'', addEventListener:(name,fn) => { handlers[name] = fn; }};
  const publish = {dataset:{}, addEventListener:() => {}};
  const elements = {'#card-fields':host,'#publish-button':publish,'#publish-hint':{},'#rating-widget':{},'#notice':{}};
  let reads = 0, patches = 0;
  const storage = new Map();
  const context = vm.createContext({window:{SanaRating:{}}, URLSearchParams,
    location:{search:'?card_id=1',pathname:'/business/card.html'},
    document:{querySelector:s => elements[s]},
    sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    SanaRating:{render:() => {}},
    SanaAPI:{saveId:()=>{},getId:()=>null,
      getCard:async () => {
        if (++reads === 2) throw new Error('Refresh unavailable');
        return {rating:reads>1?20:0, fields:{context:{value:'Описание',confirmed:reads>1}}};
      },
      updateCardField:async () => { patches++; }
    }
  });
  vm.runInContext(fs.readFileSync(path.join(root,'js/business.js'),'utf8'),context);
  await new Promise(setImmediate);
  const draft = {value:'Несохранённые данные',matches:()=>true,closest:()=>({dataset:{fieldForm:'data_materials'}})};
  handlers.input({target:draft});
  const text = {value:'Описание'}, checkbox = {checked:true}, button = {dataset:{},innerHTML:'Подтвердить'}, error = {};
  const form = {dataset:{fieldForm:'context'},closest:()=>form,querySelector:s => s.startsWith('textarea')?text:s.startsWith('input')?checkbox:s.startsWith('button')?button:error};
  const event = {target:form,preventDefault:()=>{}};
  await handlers.submit(event);
  assert.equal(patches,1);
  assert.equal(button.textContent,'Обновить состояние');
  await handlers.submit(event);
  assert.equal(patches,1);
  assert.match(host.innerHTML,/Несохранённые данные/);
  assert.match(storage.get('aiSana.edits.1'),/Несохранённые данные/);
});
