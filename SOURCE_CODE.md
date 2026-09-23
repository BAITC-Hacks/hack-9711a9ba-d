# AI Sana — полный исходный код

Файлы сохранены в frontend/. Для копирования используйте соответствующие имена и пути.

## frontend/business/card.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f6f7f2"><title>Карточка задачи — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div><a class="navitem active" href="card.html">▦ &nbsp; Карточка задачи</a><div class="sidebar-note"><span>✦</span><b>Вы подтверждаете<br>каждое поле.</b><small>Рейтинг обновится после подтверждения.</small></div></aside>
<main class="content"><header class="topbar"><div>Кабинет бизнеса <span>/</span> Карточка задачи</div><span class="top-pill">ШАГ 3 · ПРОВЕРКА</span></header><section class="page"><div class="step-line"><span>ШАГ 3 ИЗ 4</span><div><i class="active"></i><i class="active"></i><i class="active"></i><i></i></div></div><div class="eyebrow">ПРОВЕРЬТЕ И ПОДТВЕРДИТЕ</div><h1>Карточка задачи</h1><p class="intro">Отредактируйте формулировки и подтвердите поля, которые готовы к публикации. Только подтверждённые сведения учитываются в рейтинге.</p><div class="card-layout"><section id="card-fields" class="field-list"><div class="loading">Загружаю карточку…</div></section><aside class="rating-panel"><div class="eyebrow">РЕЙТИНГ ГОТОВНОСТИ</div><div id="rating-widget"></div><div class="rating-criteria"><b>Баллы за поля</b><span>Контекст и потребность <i>20</i></span><span>Данные и материалы <i>20</i></span><span>Ожидаемый результат <i>15</i></span><span>Критерии успеха <i>15</i></span><span>Ограничения <i>10</i></span><span>Пользователи <i>10</i></span><span>Связь с бизнесом <i>10</i></span></div><div class="rating-help">Рейтинг зависит от полноты подтверждённой карточки, а не от популярности компании.</div><button id="publish-button" class="btn primary publish-btn" type="button" hidden>Опубликовать задачу →</button><p id="publish-hint" class="publish-hint">Для публикации подтвердите поля и наберите минимум 40 баллов.</p></aside></div><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana <span>·</span> От задачи до результата</footer></main></div><script src="../js/api.js"></script><script src="../js/ratings.js"></script><script src="../js/business.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/business/new-task.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f6f7f2"><title>Новая задача — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div><a class="navitem active" href="new-task.html">＋ &nbsp; Новая задача</a><div class="sidebar-note"><span>✦</span><b>Хорошая задача<br>начинается с вопроса.</b><small>Расскажите о потребности простыми словами.</small></div></aside>
<main class="content"><header class="topbar"><div>Кабинет бизнеса <span>/</span> Новая задача</div><span class="top-pill">ДЕМО · AI SANA</span></header><section class="page narrow"><div class="step-line"><span>ШАГ 1 ИЗ 4</span><div><i class="active"></i><i></i><i></i><i></i></div></div><div class="eyebrow">РАССКАЖИТЕ О СВОЕЙ ЗАДАЧЕ</div><h1>С чего начнём?</h1><p class="intro">Опишите потребность, проблему или идею своими словами. Sana поможет превратить её в понятную задачу для студенческих команд.</p>
<form id="draft-form" class="panel"><label class="field-label" for="raw-description">Краткое описание задачи <em>обязательно</em></label><textarea id="raw-description" name="raw_description" rows="7" required minlength="10" placeholder="Например: в нашей кофейне каждый вечер остаётся много выпечки. Хотим точнее планировать закупки и сократить списания…"></textarea><div class="field-help">Не нужно писать идеально — добавьте то, что уже знаете. Уточнения можно внести позже.</div><div class="panel-actions"><span>Следующий шаг — несколько уточняющих вопросов</span><button class="btn primary" type="submit">Отправить <b>→</b></button></div></form><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana <span>·</span> От задачи до результата</footer></main></div><script src="../js/api.js"></script><script src="../js/business.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/business/proposals.html

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Предложения команд — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">БИЗНЕС</div><a class="navitem active" href="proposals.html">↗ &nbsp; Предложения команд</a></aside><main class="content"><header class="topbar"><div>Кабинет бизнеса <span>/</span> Отклики</div><span class="top-pill">ВАШЕ РЕШЕНИЕ</span></header><section class="page"><div class="eyebrow">ВЫБОР ЗА БИЗНЕСОМ</div><h1>Предложения команд</h1><p id="proposal-task-title" class="intro">Загружаю карточку задачи…</p><div id="chosen-banner" class="chosen-banner" hidden></div><div id="proposal-list" class="proposal-list"><div class="loading">Загружаю предложения…</div></div><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana · Бизнес вручную выбирает команду</footer></main></div><script src="../js/api.js"></script><script src="../js/ui.js"></script><script src="../js/proposals.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/business/questions.html

```html
<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f6f7f2"><title>Уточнение задачи — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div><a class="navitem active" href="new-task.html">✧ &nbsp; Уточнение задачи</a><div class="sidebar-note"><span>✦</span><b>Чем яснее задача,<br>тем точнее решения.</b><small>Ответы можно изменить в карточке до подтверждения.</small></div></aside>
<main class="content"><header class="topbar"><div>Кабинет бизнеса <span>/</span> Уточнение задачи</div><span class="top-pill">AI-ПОМОЩНИК</span></header><section class="page narrow"><div class="step-line"><span>ШАГ 2 ИЗ 4</span><div><i class="active"></i><i class="active"></i><i></i><i></i></div></div><div class="eyebrow">AI SANA ПОМОГАЕТ УТОЧНИТЬ</div><h1>Добавим важные детали</h1><p class="intro">Ответьте на вопросы, чтобы командам было проще понять задачу и предложить подходящее решение.</p><div class="ai-note"><span class="ai-spark">✦</span><div><b>Уточняющие вопросы</b><p>Вопросы должны прийти из AI-модуля backend вместе с черновиком задачи.</p></div></div><form id="questions-form"><div id="questions-list" class="question-list"><div class="loading">Загружаю вопросы…</div></div><div class="panel-actions"><span>Ответы сохранятся в карточке как неподтверждённые сведения</span><button class="btn primary" type="submit">Сформировать карточку <b>→</b></button></div></form><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana <span>·</span> От задачи до результата</footer></main></div><script src="../js/api.js"></script><script src="../js/business.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/css/style.css

```css
:root{--ink:#18221e;--muted:#7d8780;--line:#e8ebe5;--paper:#fff;--canvas:#f6f7f2;--green:#426c51;--green-dark:#294936;--lime:#d9ec8b;--soft:#eff3e9;--orange:#e4a06b;--sans:'DM Sans',Arial,sans-serif;--display:'Manrope','DM Sans',sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--canvas);color:var(--ink);font:14px var(--sans);-webkit-font-smoothing:antialiased}button,input,textarea,select{font:inherit;color:inherit}button{cursor:pointer}a{color:inherit}.shell{min-height:100vh}.sidebar{width:248px;position:fixed;inset:0 auto 0 0;padding:27px 18px 20px;background:#fbfcf8;border-right:1px solid #e9ece5;display:flex;flex-direction:column;z-index:5}.brand{text-decoration:none;display:flex;align-items:center;gap:11px;margin:0 0 46px 4px;font:800 20px var(--display);letter-spacing:-.7px}.brandmark{width:36px;height:36px;border-radius:12px;background:var(--green);color:#fff;display:grid;place-items:center;font:800 23px var(--display);position:relative}.brandmark:after{content:'';position:absolute;width:6px;height:6px;border-radius:50%;background:var(--lime);right:4px;top:4px}.brand small{display:block;margin-top:3px;color:#9ba39c;font:600 8px var(--sans);letter-spacing:1.05px}.side-label{font-size:9px;font-weight:700;letter-spacing:1.25px;color:#a0a8a1;margin:0 8px 10px}.side-label.spaced{margin-top:31px}.navitem{width:100%;height:41px;border:0;background:transparent;border-radius:8px;display:flex;align-items:center;gap:11px;padding:0 11px;text-align:left;color:#6d7870;font-size:12px;font-weight:600;margin:2px 0}.navitem>span{font-size:17px;width:18px;text-align:center}.navitem:hover,.navitem.selected{background:#f0f3ec;color:var(--green-dark)}.navitem.active{color:var(--green);background:#edf2e9}.navitem em{font-style:normal;margin-left:auto;background:#e9ede7;border-radius:12px;padding:2px 7px;font-size:10px}.sidebar-bottom{margin-top:auto}.side-help{background:#eff3e9;border-radius:10px;padding:14px 13px;display:flex;flex-direction:column;gap:8px}.side-help>span{font-size:17px;color:var(--green)}.side-help b{font:700 12px/1.5 var(--display)}.side-help small{color:#7d887f;font-size:10px;line-height:1.5}.reset-link{background:none;border:0;color:#a1aaa2;font-size:10px;margin:14px 4px 0}.content{margin-left:248px;min-height:100vh;display:flex;flex-direction:column}.topbar{height:66px;border-bottom:1px solid #e9ece5;background:rgba(255,255,255,.5);display:flex;align-items:center;justify-content:space-between;padding:0 5.4%;font-size:11px;color:#7d8780}.crumb span{padding:0 9px;color:#b5bdb6}.topright{display:flex;align-items:center;gap:17px}.demo-pill{background:#eff3e9;border-radius:20px;padding:7px 11px;color:#617368;font-size:10px}.demo-pill i,.readiness i{display:inline-block;width:6px;height:6px;border-radius:100%;background:#78a478;margin-right:5px}.avatar{width:31px;height:31px;border-radius:50%;background:#e6ebdf;display:grid;place-items:center;font-size:10px;color:var(--green);font-weight:700}.main{width:min(1100px,100%);padding:47px 5.4% 75px;margin:0 auto;flex:1}.main.narrow{width:min(820px,100%)}footer{text-align:center;color:#a3aaa4;font-size:10px;padding:20px 0 22px}footer span{padding:0 5px;color:#c6ccc5}.welcome{height:350px;background:#e8eee1;border-radius:14px;position:relative;overflow:hidden;padding:42px 46px}.welcome-copy{position:relative;z-index:2;width:57%}.eyebrow{font-size:9px;font-weight:700;letter-spacing:1.5px;color:#849187}.eyebrow span{color:#74956f;font-size:13px;margin-right:5px}.welcome h1,.page-intro h1{font:700 37px/1.17 var(--display);letter-spacing:-1.5px;margin:19px 0 12px}.welcome h1 i,.page-intro h1 i{color:var(--green);font-style:normal}.welcome-copy>p,.page-intro p{color:#748078;font-size:12px;line-height:1.75;max-width:420px;margin:0}.welcome-actions{display:flex;align-items:center;gap:10px;margin-top:24px}.btn{border:0;border-radius:7px;padding:12px 16px;font-size:11px;font-weight:700;transition:.16s ease}.btn:hover{transform:translateY(-1px);filter:brightness(.98)}.btn.primary{background:var(--green);color:white;box-shadow:0 3px 7px #31513a1c}.btn.primary span{margin-left:12px}.btn.quiet{background:transparent;color:#51675a;padding-left:10px}.btn.outline{border:1px solid #dbe1d9;background:#fff;color:#44534a}.welcome-art{position:absolute;right:4%;top:18px;width:42%;height:290px}.art-orbit{position:absolute;border:1px solid #bdcbb5;border-radius:50%;transform:rotate(-19deg)}.orbit-one{width:290px;height:210px;top:40px;left:60px}.orbit-two{width:225px;height:275px;top:14px;left:91px;transform:rotate(33deg)}.art-center{position:absolute;left:170px;top:112px;width:75px;height:75px;display:grid;place-items:center;border-radius:50%;background:#52775a;color:#e4edc7;font-size:43px;box-shadow:0 0 0 12px #dce7d5}.art-dot{position:absolute;width:16px;height:16px;border-radius:50%;background:#d9a47a;z-index:1}.dot-a{top:47px;left:104px}.dot-b{top:220px;left:295px;background:#d3e796;width:22px;height:22px}.art-note{position:absolute;background:#fff;padding:10px 13px;border-radius:7px;box-shadow:0 5px 20px #596e5014;font-size:10px;color:#7c877d;z-index:2}.art-note b{color:#405b46}.note-top{right:20px;top:52px}.note-bottom{left:15px;bottom:30px}.note-bottom span{color:#90a986;margin-right:5px}.welcome-foot{position:absolute;left:46px;right:46px;bottom:17px;border-top:1px solid #d4ddcf;padding-top:11px;display:flex;justify-content:space-between;color:#89958a;font-size:8px;letter-spacing:1px;font-weight:700}.section-head{display:flex;align-items:flex-end;justify-content:space-between;margin:43px 0 17px}.section-head h2{font:700 19px var(--display);letter-spacing:-.4px;margin:7px 0 0}.text-button{border:0;background:transparent;color:var(--green);font-size:10px;font-weight:700;padding:6px}.text-button span{font-size:15px;margin-left:7px}.task-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}.task-card{background:var(--paper);border:1px solid #e9ece7;border-radius:9px;padding:17px 17px 13px;min-height:216px;display:flex;flex-direction:column;transition:box-shadow .2s,transform .2s}.task-card:hover{box-shadow:0 10px 28px #293c2d0b;transform:translateY(-2px)}.card-top{display:flex;justify-content:space-between;align-items:center}.tag{background:#f0f3ed;color:#667b68;padding:5px 8px;border-radius:4px;font-size:9px;font-weight:600}.mini-score{color:var(--green);font-size:10px;font-weight:700}.mini-score small{color:#a1aaa3;font-size:9px;font-weight:500}.task-card h3{font:700 14px/1.4 var(--display);margin:13px 0 6px;letter-spacing:-.2px}.task-card>p{font-size:10px;line-height:1.6;color:#808a82;margin:0 0 14px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.task-meta{display:flex;gap:13px;color:#929a93;font-size:9px;flex-wrap:wrap}.card-bottom{margin-top:auto;border-top:1px solid #eff1ed;padding-top:10px;display:flex;align-items:center;justify-content:space-between}.readiness{font-size:9px;color:#68836a}.readiness.low{color:#a8825d}.readiness.low i{background:#d8a36f}.readiness.mid{color:#928458}.readiness.mid i{background:#cab36b}.page-intro{display:flex;align-items:flex-end;justify-content:space-between;margin:18px 0 27px}.page-intro h1{font-size:31px;margin:10px 0 8px}.page-intro p{font-size:11px}.backline{display:flex;justify-content:space-between;align-items:center;margin-bottom:17px}.back{border:0;background:transparent;color:#748078;font-size:10px;padding:0}.backline>span{font-size:9px;letter-spacing:1.2px;color:#9ca69d;font-weight:700}.form-panel,.edit-panel{background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:25px 27px}.field-label{display:block;font-weight:700;font-size:11px;margin-bottom:8px}.field-label>span{font-weight:500;color:#a5ada6;margin-left:8px;font-size:9px}.field-label i{color:#bd8059;font-style:normal}.form-panel textarea,.form-panel input,.form-panel select,.edit-panel textarea,.edit-panel input,.edit-panel select,.question textarea,.catalog-tools select{width:100%;border:1px solid #e2e7e0;border-radius:6px;background:#fcfdfa;padding:11px 12px;outline:none;font-size:11px;line-height:1.6;resize:vertical}.form-panel textarea:focus,.form-panel input:focus,.edit-panel textarea:focus,.edit-panel select:focus,.catalog-tools select:focus{border-color:#9eb39c;box-shadow:0 0 0 3px #edf3eb}.field-hint{font-size:9px;color:#9ca59e;margin-top:8px}.form-row{display:block;margin-top:20px}.form-row select{height:39px}.form-actions{border-top:1px solid #edf0eb;margin-top:22px;padding-top:17px;display:flex;align-items:center;justify-content:space-between;gap:10px}.form-actions>span{font-size:9px;color:#939c94}.privacy-note{color:#8f9990;font-size:10px;margin-top:18px}.ai-note{background:#edf3e9;border:1px solid #e0e9dc;border-radius:8px;padding:15px;display:flex;align-items:flex-start;gap:12px}.ai-icon{width:28px;height:28px;display:grid;place-items:center;color:#fff;border-radius:8px;background:var(--green);flex:none}.ai-note b{font-size:11px}.ai-note p{font-size:10px;color:#78847a;margin:5px 0 0;line-height:1.55}.local-chip{margin-left:auto;color:#7c917f;background:#dfe9da;padding:5px 7px;font-size:8px;letter-spacing:.7px;border-radius:4px;white-space:nowrap}.question-list{margin-top:11px;background:white;border:1px solid #e8ece6;border-radius:9px;padding:4px 21px}.question{display:flex;gap:15px;padding:17px 0;border-bottom:1px solid #eff1ed}.question:last-child{border:0}.q-num{font-size:10px;color:#97a397;font-weight:700;padding-top:2px}.q-body{flex:1}.q-body b{font-size:11px;display:block;margin-bottom:9px}.question textarea{background:#fcfdfa}.card-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(230px,.8fr);align-items:start;gap:16px}.panel-head{display:flex;align-items:center;justify-content:space-between;margin:0 0 9px}.panel-head h2{font:700 15px var(--display);margin:0}.panel-head p{color:#929b94;font-size:9px;margin:5px 0}.edit-label{font-size:8px;letter-spacing:.8px;color:#94a093;background:#f2f5f0;padding:6px;border-radius:4px}.edit-panel{padding:23px}.edit-panel .form-row{margin-top:13px}.edit-panel .field-label{margin-bottom:6px}.edit-panel textarea,.edit-panel select{padding:8px 10px;font-size:10px}.edit-panel .form-actions{margin-top:20px}.rating-panel,.detail-aside{background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:20px}.rating-title{text-align:center;border-bottom:1px solid #edf0eb;padding-bottom:16px}.rating-title .eyebrow{font-size:8px}.big-score{font:800 43px var(--display);letter-spacing:-2px;color:var(--green);margin:6px 0}.big-score small{font:500 12px var(--sans);letter-spacing:0;color:#9da69e}.level-chip{display:inline-block;color:#688267;background:#edf3e9;border-radius:20px;font-size:9px;padding:6px 10px}.score-breakdown{padding:13px 0}.break-row{display:flex;align-items:center;gap:7px;padding:7px 0;font-size:9px;color:#68746b}.break-row>b{margin-left:auto;color:#486c50;font-size:9px}.break-row>b small{color:#a2aaa3;font-size:8px;font-weight:400}.check{width:15px;height:15px;border:1px solid #dce2da;border-radius:50%;display:grid;place-items:center;color:#9aa49b;font-size:9px;flex:none}.check.done{background:#eaf1e7;border-color:#eaf1e7;color:#638464}.missing{border-top:1px solid #edf0eb;padding-top:13px;display:flex;flex-direction:column;gap:9px}.missing>b{font-size:10px}.missing>span{font-size:9px;color:#828d83}.missing i{font-style:normal;color:#86a074;float:right}.score-disclaimer{font-size:8px;line-height:1.55;color:#a0a8a0;background:#f8f9f6;border-radius:5px;margin-top:14px;padding:9px}.manage-card{background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:24px;display:grid;grid-template-columns:1fr 260px;gap:26px}.manage-main h2{font:700 17px var(--display);margin:12px 0 7px}.manage-main>p{font-size:11px;color:#7e8980;line-height:1.65}.manage-main .task-meta{margin-top:25px}.manage-score .scoreline{border-bottom:1px solid #edf0eb;padding-bottom:16px;margin-bottom:15px}.scoreline{display:flex;align-items:center;gap:13px}.score-ring{width:54px;height:54px;border-radius:50%;background:conic-gradient(var(--green) var(--score),#ebefe8 0);display:grid;place-items:center;position:relative;flex:none}.score-ring:before{content:'';position:absolute;inset:5px;border-radius:50%;background:#fff}.score-ring span{z-index:1;color:var(--green);font-size:14px;font-weight:700}.score-ring small{font-size:7px;color:#9ba49c;font-weight:500}.scorecopy{display:flex;flex-direction:column;gap:4px;flex:1}.scorecopy b{font-size:11px}.scorecopy>span{font-size:8px;color:#969f97}.progress{height:4px;border-radius:5px;background:#edf0eb;margin-top:4px;overflow:hidden}.progress i{display:block;height:100%;background:#83a17a;border-radius:5px}.manage-score>.btn{width:100%;margin:4px 0 5px}.manage-score>.text-button{margin-top:7px}.stat-box{min-width:120px;border-left:1px solid #e5eae2;padding-left:18px;display:flex;flex-direction:column}.stat-box b{font:700 27px var(--display);color:var(--green)}.stat-box span{font-size:9px;color:#879187}.catalog-tools{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid #e9ece6;border-radius:8px;padding:12px}.filter-label{font-size:8px;color:#99a29a;letter-spacing:.8px;font-weight:700;margin-right:auto}.catalog-tools select{width:auto;min-width:160px;padding:9px;font-size:9px;background:#fcfdfa}.catalog-explain{margin:14px 0 18px;background:#edf3e9;padding:10px 13px;border-radius:6px;color:#728171;font-size:9px}.catalog-explain span{color:#719068;margin-right:6px}.catalog-tools+.catalog-explain~.task-grid .task-card{min-height:205px}.detail-layout{display:grid;grid-template-columns:1fr 265px;gap:35px;margin-top:28px}.detail-main h1{font:700 32px/1.2 var(--display);letter-spacing:-1px;margin:14px 0}.detail-section{padding:17px 0;border-bottom:1px solid #e7ebe4}.detail-section h3{font:700 12px var(--display);margin:0 0 8px}.detail-section p{font-size:11px;line-height:1.7;color:#69766d;margin:0}.detail-aside{height:max-content;position:sticky;top:20px}.detail-aside .scoreline{margin-bottom:12px}.detail-aside .score-ring{width:48px;height:48px}.detail-aside .muted{font-size:9px;line-height:1.6;color:#909a91}.full{width:100%;margin-top:12px}.aside-small{font-size:8px;color:#9ba49c;text-align:center;line-height:1.5;margin-top:11px}.proposal-list{display:grid;gap:13px}.proposal-card{background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:19px 22px}.proposal-top{display:flex;align-items:center;gap:11px;padding-bottom:13px;border-bottom:1px solid #eef0ec}.team-avatar{width:34px;height:34px;border-radius:9px;background:#e9efe2;color:#56735b;display:grid;place-items:center;font:700 15px var(--display)}.proposal-team h3{font:700 12px var(--display);margin:0 0 4px}.proposal-team span{font-size:9px;color:#909990}.proposal-status{margin-left:auto;border-radius:20px;background:#f1f2ef;color:#858e86;font-size:8px;padding:6px 9px}.proposal-status.chosen{background:#eaf2e6;color:#5f845d}.proposal-content{display:grid;grid-template-columns:1fr 1fr;gap:15px;padding:14px 0}.proposal-content b{font-size:9px;color:#829084}.proposal-content p{font-size:10px;line-height:1.6;color:#505c53;margin:6px 0}.proposal-meta{grid-column:1/-1;display:flex;gap:17px;font-size:9px;color:#929b93}.proposal-meta a{color:#56765a;text-decoration:none}.proposal-actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #eef0ec;padding-top:12px}.proposal-actions .btn{padding:10px 13px}.mine-card{background:white;border:1px solid #e8ece6;border-radius:9px;padding:18px 20px;display:flex;justify-content:space-between;gap:16px;margin-bottom:11px}.mine-card h3{font:700 13px var(--display);margin:9px 0 5px}.mine-card p{color:#7f8981;font-size:10px;line-height:1.6;margin:0}.empty-state{padding:40px;text-align:center;border:1px dashed #d8dfd6;color:#89948b;border-radius:8px;font-size:11px}.toast{position:fixed;right:24px;bottom:24px;background:#294936;color:white;padding:13px 17px;border-radius:8px;box-shadow:0 8px 25px #172b1d2c;font-size:11px;z-index:9;animation:rise .2s ease}@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(max-width:1100px){.sidebar{width:210px}.content{margin-left:210px}.welcome{padding-left:32px}.welcome-foot{left:32px;right:32px}.welcome-art{right:0;transform:scale(.87);transform-origin:right center}.task-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.task-grid .task-card:last-child:nth-child(odd){display:none}.main{padding-left:4%;padding-right:4%}}
@media(max-width:760px){.sidebar{position:relative;width:100%;height:auto;inset:auto;padding:12px 14px;display:flex;flex-direction:row;align-items:center;border-right:0;border-bottom:1px solid #e8ece6;gap:6px;overflow-x:auto}.brand{margin:0 13px 0 0;flex:none;font-size:17px}.brandmark{width:32px;height:32px}.brand small,.side-label,.sidebar-bottom{display:none}.navitem{width:auto;flex:none;padding:0 10px;height:36px;font-size:10px;margin:0}.navitem>span{font-size:14px;width:auto}.navitem em{display:none}.content{margin-left:0}.topbar{height:51px;padding:0 16px}.main{padding:27px 16px 48px}.welcome{height:auto;min-height:355px;padding:28px 23px 51px}.welcome-copy{width:100%}.welcome h1{font-size:30px}.welcome-copy>p{max-width:330px}.welcome-art{opacity:.27;right:-48px;top:58px;transform:scale(.65);transform-origin:top right}.welcome-foot{left:23px;right:23px}.welcome-foot span:last-child{display:none}.section-head{margin:31px 0 14px}.section-head h2{font-size:16px}.task-grid{grid-template-columns:1fr}.task-grid .task-card:last-child:nth-child(odd){display:flex}.task-card{min-height:190px}.page-intro{align-items:flex-start;gap:14px;flex-direction:column;margin:16px 0 22px}.page-intro h1{font-size:27px}.form-panel{padding:20px 16px}.form-actions{align-items:flex-start;flex-direction:column}.form-actions .btn{width:100%}.ai-note{flex-wrap:wrap}.local-chip{margin-left:40px}.question-list{padding:4px 13px}.card-layout,.detail-layout{grid-template-columns:1fr}.rating-panel{order:-1}.edit-panel{padding:19px 14px}.edit-panel .form-actions{flex-direction:column}.manage-card{grid-template-columns:1fr;padding:18px;gap:14px}.manage-score .scoreline{border-top:1px solid #edf0eb;padding-top:14px}.catalog-tools{flex-wrap:wrap}.filter-label{width:100%}.catalog-tools select{flex:1;min-width:135px}.detail-layout{gap:20px}.detail-aside{position:static}.proposal-card{padding:15px}.proposal-content{grid-template-columns:1fr}.proposal-meta{grid-column:auto}.mine-card{padding:14px;flex-direction:column}.mine-card .proposal-status{margin:0;align-self:flex-start}.stat-box{min-width:75px;padding-left:12px}.stat-box b{font-size:22px}.backline{margin-bottom:13px}.crumb{font-size:9px}}
@media(max-width:390px){.navitem{padding:0 7px;font-size:9px;gap:5px}.brand{margin-right:4px}.brand small{display:none}.welcome-actions{align-items:flex-start;flex-direction:column;gap:4px}.welcome{min-height:390px}.welcome h1{font-size:27px}.topright{gap:8px}.catalog-tools select{min-width:100%}}

/* Four-step business flow */
.entry-page{min-height:100vh;background:radial-gradient(ellipse at 78% 18%,#e6eddf 0,transparent 40%),var(--canvas)}
.entry-shell{width:min(490px,calc(100% - 32px));margin:0 auto;padding:35px 0 55px}
.entry-shell>.brand{margin:0 0 29px 3px;width:max-content}
.entry-card{background:#fff;border:1px solid #e7ebe4;border-radius:14px;padding:39px 39px 22px;box-shadow:0 16px 55px #364a3610}
.entry-card h1,.page h1{font:700 35px/1.19 var(--display);letter-spacing:-1.3px;margin:12px 0 10px}
.entry-card h1 i{font-style:normal;color:var(--green)}
.entry-card>p{font-size:11px;line-height:1.7;color:#7d887f;margin:0}
.role-options{display:grid;gap:10px;margin:26px 0 24px}
.role-card{border:1px solid #e7ebe5;background:#fff;border-radius:8px;display:flex;align-items:center;text-align:left;gap:12px;padding:14px 13px;transition:.18s}
.role-card:hover{border-color:#aebda9;background:#fbfcf9;transform:translateY(-1px)}
.role-icon{width:35px;height:35px;display:grid;place-items:center;background:#edf3e9;color:#608264;border-radius:9px;font-size:18px;flex:none}
.role-icon.team-icon{background:#f2f0e7;color:#9b8f5f}
.role-card>span:nth-child(2){display:flex;flex-direction:column;gap:4px}
.role-card b{font-size:12px}.role-card small{font-size:9px;color:#8b958d}
.role-arrow{margin-left:auto;color:#658168;font-size:17px}
.entry-foot{border-top:1px solid #edf0eb;padding-top:14px;text-align:center;color:#a0a8a0;font-size:8px;font-weight:700;letter-spacing:1.1px}
.inline-btn{display:inline-block;margin-top:22px;text-decoration:none}
.app-shell{min-height:100vh}.app-shell .sidebar{background:#fbfcf8}.app-shell .content{min-height:100vh}
.app-shell .topbar{padding:0 5.2%;color:#758078;font-size:10px}
.topbar>div span{padding:0 9px;color:#b5bdb6}
.top-pill{font-size:8px;color:#71836f;background:#edf3e9;padding:7px 10px;border-radius:20px;letter-spacing:.7px}
.sidebar-note{margin-top:auto;background:#eff3e9;border-radius:9px;padding:14px;display:flex;flex-direction:column;gap:8px}
.sidebar-note>span{font-size:17px;color:#6b8b68}.sidebar-note b{font:700 12px/1.5 var(--display)}.sidebar-note small{font-size:9px;line-height:1.55;color:#879187}
.navitem{text-decoration:none}
.page{width:min(1080px,100%);padding:39px 5.2% 55px;margin:0 auto;flex:1}
.page.narrow{width:min(810px,100%)}
.page .eyebrow{margin-top:0}
.page h1{font-size:31px;margin:11px 0 8px}
.intro{max-width:650px;font-size:11px;line-height:1.75;color:#7b867e;margin:0 0 23px}
.step-line{display:flex;justify-content:space-between;align-items:center;margin:0 0 26px;color:#97a197;font-size:8px;font-weight:700;letter-spacing:1px}
.step-line>div{display:flex;gap:5px}.step-line i{display:block;width:23px;height:3px;border-radius:5px;background:#e5eae3}.step-line i.active{background:#719070}
.panel{background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:24px 25px}
.field-label{font-size:11px}.field-label em{font-style:normal;color:#a3aba4;font-size:9px;font-weight:500;margin-left:7px}
.panel textarea,.question-content textarea,.field-card textarea{width:100%;border:1px solid #e2e7e0;border-radius:6px;background:#fcfdfa;padding:11px 12px;outline:none;font:11px/1.65 var(--sans);resize:vertical;color:var(--ink)}
.panel textarea:focus,.question-content textarea:focus,.field-card textarea:focus{border-color:#9eb39c;box-shadow:0 0 0 3px #edf3eb}
.panel textarea::placeholder,.question-content textarea::placeholder,.field-card textarea::placeholder{color:#aeb6af}
.field-help{font-size:9px;color:#99a29a;margin-top:8px}
.panel-actions{border-top:1px solid #edf0eb;margin-top:20px;padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.panel-actions>span{font-size:9px;color:#939c94;line-height:1.5}
.panel-actions .btn{flex:none}.btn b{margin-left:12px}
.notice{min-height:0;margin-top:10px;font-size:10px;line-height:1.5}.notice:empty{display:none}.notice.is-error{color:#a55246}.notice.is-success{color:#58765a}
.ai-note{display:flex;gap:12px;align-items:flex-start;padding:14px 15px;background:#edf3e9;border:1px solid #e0e9dc;border-radius:8px;margin-bottom:12px}
.ai-spark{width:28px;height:28px;display:grid;place-items:center;background:#52775a;color:#eff5dd;border-radius:8px;flex:none}
.ai-note b{font-size:10px}.ai-note p{font-size:9px;line-height:1.5;color:#7c887d;margin:5px 0 0}
.question-list{background:white;border:1px solid #e8ece6;border-radius:9px;padding:0 19px}
.question-row{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #eef0ec}.question-row:last-child{border-bottom:0}
.question-number{padding-top:2px;color:#96a194;font-size:9px;font-weight:700}.question-content{display:block;flex:1;min-width:0}
.question-content>b{display:block;font-size:10px;line-height:1.5;margin-bottom:6px}.question-content small{display:block;color:#9aa39b;font-size:8px;margin-bottom:7px}
.question-content textarea{padding:8px 10px;font-size:10px}
.loading{padding:24px;color:#8e998f;font-size:10px}
.card-layout{display:grid;grid-template-columns:minmax(0,1fr) 254px;gap:16px;align-items:start}
.field-list{display:grid;gap:10px}
.field-card{background:#fff;border:1px solid #e8ece6;border-radius:9px;padding:16px 17px;margin:0}
.field-card.confirmed{background:#fbfcfa;border-color:#e2e9df}
.field-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
.field-weight{font-size:7px;letter-spacing:.8px;color:#81927f;font-weight:700}
.field-card h2{font:700 12px var(--display);margin:4px 0 0}
.field-state{font-size:8px;color:#a0a8a0;white-space:nowrap;padding-top:2px}
.confirmed .field-state{color:#638464}
.field-card textarea{font-size:10px;padding:9px 10px}.field-card textarea:disabled{background:#f7f9f5;color:#68746b;opacity:1;resize:none}
.confirm-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px}
.confirm-check{display:flex;align-items:center;gap:7px;color:#89948b;font-size:8px;line-height:1.4}
.confirm-check input{accent-color:#557a59;width:13px;height:13px;margin:0}
.confirm-btn{background:#edf3e9;color:#527354;border:1px solid #e3ebdf;padding:8px 12px;font-size:9px}
.confirm-btn:hover{background:#e2ecdD}.confirm-btn:disabled,.btn:disabled{opacity:.65;cursor:wait}
.locked-note{margin-top:9px;color:#839181;font-size:8px}
.field-error{font-size:8px;color:#a55246;margin-top:6px}
.rating-panel{position:sticky;top:20px;background:#fff;border:1px solid #e8ece6;border-radius:10px;padding:19px}
.rating-score{display:flex;align-items:baseline;gap:4px;margin:12px 0 5px}.rating-score strong{font:800 43px var(--display);letter-spacing:-2px;color:#426c51}.rating-score span{font-size:10px;color:#9da69e}
.level-badge{display:inline-block;background:#edf3e9;color:#638064;border-radius:20px;padding:6px 10px;font-size:8px}
.rating-track{height:5px;background:#edf0eb;border-radius:5px;margin:15px 0 9px;overflow:hidden}.rating-track i{height:100%;width:0;display:block;background:#83a17a;border-radius:5px;transition:width .25s ease}
.rating-caption{font-size:8px;line-height:1.5;color:#939c94;margin:0 0 15px}
.rating-criteria{border-top:1px solid #edf0eb;padding-top:12px;display:grid;gap:9px}.rating-criteria>b{font-size:9px;margin-bottom:2px}
.rating-criteria>span{font-size:8px;color:#78847a}.rating-criteria i{font-style:normal;color:#537359;float:right;font-weight:700}
.rating-help{font-size:8px;line-height:1.5;color:#939c94;background:#f7f9f5;border-radius:5px;padding:9px;margin-top:14px}
.app-shell footer{padding:19px 0 21px}
@media(max-width:900px){.app-shell .sidebar{width:200px}.app-shell .content{margin-left:200px}.card-layout{grid-template-columns:minmax(0,1fr) 220px}.page{padding-left:4%;padding-right:4%}}
@media(max-width:680px){.app-shell .sidebar{position:relative;width:100%;height:auto;inset:auto;padding:11px 14px;display:flex;flex-direction:row;align-items:center;gap:8px;overflow-x:auto;border-right:0;border-bottom:1px solid #e8ece6}.app-shell .brand{margin:0 8px 0 0;flex:none;font-size:17px}.app-shell .brandmark{width:32px;height:32px}.app-shell .brand small,.app-shell .side-label,.sidebar-note{display:none}.app-shell .navitem{width:auto;flex:none;padding:0 10px;height:35px;font-size:10px}.app-shell .content{margin-left:0}.app-shell .topbar{height:51px;padding:0 16px}.page{padding:25px 16px 40px}.page h1,.entry-card h1{font-size:27px}.panel{padding:19px 15px}.panel-actions{align-items:stretch;flex-direction:column}.panel-actions .btn{width:100%}.card-layout{grid-template-columns:1fr}.rating-panel{position:static;order:-1}.rating-criteria{grid-template-columns:1fr 1fr}.rating-criteria>b{grid-column:1/-1}.field-card{padding:14px}.field-card-head{gap:5px}.field-state{font-size:7px}.confirm-row{align-items:flex-start;flex-direction:column}.confirm-btn{width:100%}.entry-shell{padding-top:22px}.entry-card{padding:28px 21px 19px}.question-list{padding:0 13px}.step-line{margin-bottom:21px}}

/* Rating, catalog, proposal, and publish components */
.rating-indicator{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.rating-ring{width:58px;height:58px;border-radius:50%;background:conic-gradient(var(--rating-color) var(--rating),#edf0eb 0);display:grid;place-items:center;position:relative;flex:none}
.rating-ring:before{content:'';position:absolute;inset:5px;border-radius:50%;background:#fff}
.rating-ring>span{z-index:1;font:700 14px var(--display);color:#39473c;white-space:nowrap}.rating-ring small{font:500 7px var(--sans);color:#98a198}
.rating-level-badge{border-radius:20px;padding:6px 9px;font-size:8px;font-weight:700;background:var(--rating-soft);color:var(--rating-color)}
.rating-progress-track{height:4px;border-radius:5px;background:#edf0eb;overflow:hidden;width:100%;flex-basis:100%;margin-top:0}.rating-progress-track i{display:block;height:100%;border-radius:5px;background:var(--rating-color);transition:width .25s ease}
.level-project{--rating-color:#8d9690;--rating-soft:#eff1ef}.level-work{--rating-color:#ad8b35;--rating-soft:#f7f1dc}.level-ready{--rating-color:#4b79a6;--rating-soft:#e9f1f8}.level-priority{--rating-color:#4c825c;--rating-soft:#eaf3e8}
.rating-indicator.compact{display:flex;flex-direction:column;align-items:center;gap:7px}.rating-indicator.compact .rating-ring{width:52px;height:52px}
.publish-btn{width:100%;margin-top:13px}.publish-hint{font-size:8px;line-height:1.5;color:#929b92;margin:8px 0 0}.publish-btn[hidden]{display:none}
.catalog-filters{display:flex;align-items:end;gap:11px;flex-wrap:wrap;background:#fff;border:1px solid #e8ece6;padding:13px;border-radius:9px;margin:18px 0}
.catalog-filters label{display:grid;gap:6px;font-size:8px;color:#89948b;flex:1;min-width:150px}.catalog-filters select,.form-row input,.proposal-form-wrap input,.proposal-form-wrap textarea{border:1px solid #e2e7e0;border-radius:6px;background:#fcfdfa;padding:10px 11px;font:10px var(--sans);outline:none;color:#28352c}.catalog-filters select:focus,.form-row input:focus,.proposal-form-wrap input:focus,.proposal-form-wrap textarea:focus{border-color:#9eb39c;box-shadow:0 0 0 3px #edf3eb}
.catalog-list{display:grid;gap:11px}.catalog-card{width:100%;display:flex;justify-content:space-between;align-items:center;gap:18px;text-align:left;border:1px solid #e8ece6;background:#fff;border-radius:9px;padding:17px 19px;transition:.15s}.catalog-card:hover{border-color:#b7c7b2;box-shadow:0 7px 20px #293c2d0a;transform:translateY(-1px)}.catalog-card-main{min-width:0}.catalog-card h2{font:700 14px/1.4 var(--display);margin:9px 0 5px}.catalog-card p{font-size:9px;line-height:1.55;color:#808b82;margin:0 0 9px;max-width:620px}.catalog-more{font-size:8px;color:#5f7d60;font-weight:700}.catalog-more b{font-size:13px;margin-left:5px}.catalog-card-rating{flex:none}
.task-view-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:17px;margin-top:20px;align-items:start}.task-details,.proposal-form-wrap{background:white;border:1px solid #e8ece6;border-radius:10px;padding:21px}.task-details h1{font:700 26px/1.25 var(--display);margin:12px 0}.task-details>.rating-indicator{border-bottom:1px solid #edf0eb;padding:7px 0 14px;margin-bottom:4px;justify-content:flex-start}.detail-section{padding:13px 0;border-bottom:1px solid #edf0eb}.detail-section:last-child{border-bottom:0}.detail-section h3{font:700 10px var(--display);margin:0 0 6px}.detail-section p{font-size:9px;line-height:1.65;color:#69766d;margin:0}.proposal-form-wrap h2{font:700 16px var(--display);margin:9px 0 5px}.form-intro{font-size:9px;line-height:1.55;color:#818c82;margin:0 0 15px}.proposal-form-wrap .form-row{display:block;margin:12px 0}.proposal-form-wrap .form-row .field-label{display:block;font-size:9px;margin-bottom:6px}.proposal-form-wrap input,.proposal-form-wrap textarea{width:100%;resize:vertical}.proposal-form-wrap .panel-actions{margin-top:15px}.proposal-form-wrap .panel-actions .btn{width:100%}
.proposal-actions{display:flex;justify-content:flex-end;border-top:1px solid #eef0ec;padding-top:12px}.proposal-actions .btn{padding:10px 14px;font-size:9px}.selected-result{font-size:9px;color:#547957;background:#edf4e9;padding:10px;border-radius:6px;margin-top:12px}.chosen-banner{margin:14px 0;padding:13px 16px;background:#eaf3e7;border:1px solid #dce9d8;border-radius:8px;color:#4e7654;font-size:11px;font-weight:700}.chosen-banner[hidden]{display:none}.proposal-list{display:grid;gap:12px}.proposal-card{background:#fff;border:1px solid #e8ece6;border-radius:9px;padding:18px}.proposal-top{display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid #eef0ec}.team-avatar{width:34px;height:34px;display:grid;place-items:center;border-radius:9px;background:#edf2e9;color:#527354;font-weight:700}.proposal-team h3{font:700 11px var(--display);margin:0 0 4px}.proposal-team span{font-size:8px;color:#8c968d}.proposal-status{margin-left:auto;border-radius:20px;background:#f1f2ef;color:#818b82;font-size:8px;padding:6px 9px}.proposal-status.chosen{color:#4c825c;background:#eaf3e8}.proposal-content{display:grid;grid-template-columns:1fr 1fr;gap:13px;padding:12px 0}.proposal-content b{font-size:8px;color:#829084}.proposal-content p{font-size:9px;line-height:1.6;color:#505c53;margin:5px 0}.proposal-meta{grid-column:1/-1;display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:8px;color:#929b93}.proposal-meta a{color:#55765a;text-decoration:none}.proposal-meta span:last-child{color:#929b93}.empty-state{padding:35px 20px;text-align:center;border:1px dashed #d8dfd6;color:#89948b;border-radius:8px;font-size:10px}
.form-row input{width:100%}
@media(max-width:850px){.task-view-layout{grid-template-columns:1fr}.catalog-card{align-items:flex-start}.catalog-card-rating{padding-top:4px}}
@media(max-width:680px){.catalog-card{padding:14px;gap:8px}.catalog-card h2{font-size:12px}.rating-indicator.compact .rating-ring{width:45px;height:45px}.rating-indicator.compact .rating-ring>span{font-size:11px}.catalog-card-rating .rating-level-badge{font-size:7px;padding:5px 7px}.proposal-content{grid-template-columns:1fr}.proposal-meta{grid-column:auto}.task-details,.proposal-form-wrap{padding:16px}.catalog-filters label{min-width:100%}}

/* Form accessibility and readable multiline responses */
:focus-visible { outline: 2px solid #52775a; outline-offset: 3px; }
.question-content select { width:100%; margin:8px 0; padding:10px; border:1px solid #cdd7ca; border-radius:6px; background:#fff; }
.detail-section p,.proposal-content p { white-space:pre-wrap; overflow-wrap:anywhere; }
.api-empty { padding:18px; color:#a55246; }
button:disabled { cursor:not-allowed; }

```

## frontend/index.html

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f6f7f2">
  <title>AI Sana — выберите роль</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="entry-page">
  <main class="entry-shell">
    <a class="brand" href="index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a>
    <section class="entry-card">
      <div class="eyebrow">ПЛАТФОРМА СОТРУДНИЧЕСТВА</div>
      <h1>Хорошие решения<br>начинаются <i>вместе.</i></h1>
      <p>Выберите, как хотите участвовать в AI Sana.</p>
      <div class="role-options">
        <button class="role-card" data-role="business" type="button">
          <span class="role-icon">↗</span><span><b>Я бизнес</b><small>Опишу задачу и найду команду</small></span><span class="role-arrow">→</span>
        </button>
        <button class="role-card" data-role="team" type="button">
          <span class="role-icon team-icon">✳</span><span><b>Я команда</b><small>Найду интересную задачу и откликнусь</small></span><span class="role-arrow">→</span>
        </button>
      </div>
      <div class="entry-foot">ПРАКТИЧЕСКИЙ ХАКАТОН · 5 ЧАСОВ</div>
    </section>
  </main>
  <script src="js/api.js"></script>
  <script src="js/business.js"></script>
</body>
</html>

```

## frontend/js/api.js

```js
/* Shared JSON API client. Set window.API_BASE before this file to change the API prefix. */
(() => {
  const base = (window.API_BASE || '/api').replace(/\/$/, '');
  const request = async (path, options = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), window.API_TIMEOUT_MS || 20000);
    try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept:'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    const raw = await response.text();
    let data = null;
    if (raw) { try { data = JSON.parse(raw); } catch { throw new Error(`Сервер вернул некорректный JSON (${response.status}). Проверьте адрес API.`); } }
    if (!response.ok) throw new Error(data?.message || data?.error || `Ошибка API (${response.status})`);
    if (data?.success === false || data?.error) throw new Error(data.message || (typeof data.error === 'string' ? data.error : 'Сервер отклонил запрос.'));
    return data?.data ?? data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Сервер не ответил вовремя. Проверьте результат перед повторной отправкой.');
      if (error instanceof TypeError) throw new Error('Нет связи с сервером. Проверьте подключение и адрес API.');
      throw error;
    } finally { clearTimeout(timer); }
  };
  const json = (method, body) => ({ method, body: JSON.stringify(body) });

  window.SanaAPI = {
    createTask: raw_description => request('/tasks.php', json('POST', { raw_description })),
    getTask: id => request(`/tasks.php?id=${encodeURIComponent(id)}`),
    createCard: task_id => request('/cards.php', json('POST', { task_id })),
    updateCardField: payload => request('/cards.php', json('PATCH', payload)),
    getCard: id => request(`/cards.php?id=${encodeURIComponent(id)}`),
    publishCard: card_id => request('/publish.php', json('POST', { card_id })),
    getCatalog: filters => {
      const query = new URLSearchParams({ sort:'rating', ...(filters || {}) });
      return request(`/catalog.php?${query}`);
    },
    createTeam: payload => request('/teams.php', json('POST', payload)),
    createProposal: payload => request('/proposals.php', json('POST', payload)),
    getProposalsForCard: card_id => request(`/proposals.php?card_id=${encodeURIComponent(card_id)}`),
    getProposalsForTeam: team_id => request(`/proposals.php?team_id=${encodeURIComponent(team_id)}`),
    chooseProposal: proposal_id => request('/choose.php', json('PATCH', { proposal_id })),
    saveId(name, value) { localStorage.setItem(`aiSana.${name}`, String(value)); },
    getId(name) { return localStorage.getItem(`aiSana.${name}`); },
    clearId(name) { localStorage.removeItem(`aiSana.${name}`); }
  };
})();

```

## frontend/js/business.js

```js
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const idFromUrlOrStorage = (param, key) => params.get(param) || SanaAPI.getId(key);
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  const notice = (message, error = false) => {
    const el = $('#notice'); if (!el) return;
    el.textContent = message; el.className = `notice ${error ? 'is-error' : 'is-success'}`;
  };
  const setBusy = (button, busy, text = 'Обработка…') => {
    if (!button) return;
    if (busy) { button.dataset.originalText = button.innerHTML; button.disabled = true; button.innerHTML = text; }
    else { button.disabled = false; if (button.dataset.originalText) button.innerHTML = button.dataset.originalText; }
  };

  const fields = [
    { key:'context', label:'Контекст и потребность', weight:20, rows:4 },
    { key:'data_materials', label:'Данные и материалы', weight:20, rows:3 },
    { key:'expected_result', label:'Ожидаемый результат', weight:15, rows:3 },
    { key:'success_criteria', label:'Критерии успеха', weight:15, rows:3 },
    { key:'constraints', label:'Ограничения', weight:10, rows:3 },
    { key:'users', label:'Пользователи', weight:10, rows:2 },
    { key:'business_contact', label:'Связь с бизнесом', weight:10, rows:2 }
  ];
  const fieldByKey = Object.fromEntries(fields.map(field => [field.key, field]));
  function normalizeQuestions(data) {
    const source = data?.task || data;
    const supplied = source?.questions || data?.questions || source?.clarifying_questions || source?.ai_questions || [];
    const list = (Array.isArray(supplied) ? supplied : []).filter(item => item && (typeof item === 'string' || typeof item === 'object')).map(item => {
      const text = typeof item === 'string' ? item : item.question || item.text || item.label || '';
      const possible = typeof item === 'object' ? item.field || item.card_field || item.key : '';
      const field = fieldByKey[possible] ? possible : '';
      return typeof text === 'string' && text.trim() ? { field, question:text.trim() } : null;
    }).filter(Boolean);
    if (list.length < 3) throw new Error('Backend должен вернуть не менее трёх уточняющих вопросов в GET /api/tasks.php?id=…');
    return list;
  }

  async function initEntry() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-role]'); if (!button) return;
      const role = button.dataset.role;
      localStorage.setItem('aiSana.role', role);
      location.href = role === 'business' ? 'business/new-task.html' : 'team/profile.html';
    });
  }

  async function initNewTask() {
    const form = $('#draft-form'); if (!form) return;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      if (button.disabled) return;
      const description = $('#raw-description').value.trim();
      if (description.length < 10) { notice('Опишите задачу хотя бы в нескольких словах.', true); return; }
      setBusy(button, true);
      try {
        const result = await SanaAPI.createTask(description);
        const taskId = result?.task_id ?? result?.id;
        if (taskId == null) throw new Error('Сервер создал задачу, но не вернул task_id.');
        SanaAPI.saveId('taskId', taskId);
        location.href = `questions.html?task_id=${encodeURIComponent(taskId)}`;
      } catch (error) { notice(error.message || 'Не удалось отправить задачу.', true); setBusy(button, false); }
    });
  }

  async function initQuestions() {
    const form = $('#questions-form'); if (!form) return;
    form.addEventListener('submit', event => event.preventDefault());
    const submitButton = $('button[type="submit"]', form);
    submitButton.disabled = true;
    const taskId = idFromUrlOrStorage('task_id', 'taskId');
    if (!taskId) { notice('Не найден черновик. Вернитесь и создайте задачу заново.', true); return; }
    SanaAPI.saveId('taskId', taskId);
    let questionList;
    try {
      const task = await SanaAPI.getTask(taskId);
      questionList = normalizeQuestions(task);
      if (task?.raw_description || task?.task?.raw_description) SanaAPI.saveId('rawDescription', task.raw_description || task.task.raw_description);
    } catch (error) {
      $('#questions-list').innerHTML = `<div class="api-empty">${escapeHtml(error.message || 'Не удалось загрузить вопросы с сервера.')}</div>`;
      notice(error.message || 'Не удалось загрузить вопросы с сервера.', true);
      $('button[type="submit"]', form).disabled = true;
      return;
    }
    $('#questions-list').innerHTML = questionList.map((item, index) => {
      const field = fieldByKey[item.field];
      const destination = field ? `<small>Поле карточки: ${escapeHtml(field.label)}</small>` : `<label>К какому разделу относится ответ?<select data-answer-target required><option value="">Выберите раздел</option>${fields.map(f => `<option value="${f.key}">${escapeHtml(f.label)}</option>`).join('')}</select></label>`;
      return `<div class="question-row"><span class="question-number">${String(index + 1).padStart(2, '0')}</span><div class="question-content"><label for="answer-${index}"><b>${escapeHtml(item.question)}</b></label>${destination}<textarea id="answer-${index}" data-answer-field="${escapeHtml(item.field)}" rows="2" placeholder="Ваш ответ…"></textarea></div></div>`;
    }).join('');
    submitButton.disabled = false;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      if (button.disabled) return;
      const answersByField = {};
      form.querySelectorAll('[data-answer-field]').forEach(input => {
        const field = input.dataset.answerField || input.closest('.question-content').querySelector('[data-answer-target]').value;
        const value = input.value.trim();
        if (value && fieldByKey[field]) answersByField[field] = [answersByField[field], value].filter(Boolean).join('\n\n');
      });
      setBusy(button, true);
      let createdCardId = null;
      try {
        const created = await SanaAPI.createCard(taskId);
        const cardId = created?.card_id ?? created?.id;
        if (cardId == null) throw new Error('Сервер не вернул card_id при создании карточки.');
        createdCardId = cardId;
        SanaAPI.saveId('cardId', cardId);
        // Preserve entered answers if a later PATCH fails or the user reloads the card.
        sessionStorage.setItem(`aiSana.edits.${cardId}`, JSON.stringify(answersByField));
        const answers = Object.entries(answersByField).map(([field,value]) => ({field,value}));
        for (const answer of answers) {
          await SanaAPI.updateCardField({ card_id:cardId, field:answer.field, value:answer.value, confirmed:false });
        }
        sessionStorage.removeItem(`aiSana.edits.${cardId}`);
        location.href = `card.html?card_id=${encodeURIComponent(cardId)}`;
      } catch (error) {
        if (createdCardId != null) {
          SanaAPI.saveId('cardId', createdCardId);
          location.href = `card.html?card_id=${encodeURIComponent(createdCardId)}&answers_incomplete=1`;
          return;
        }
        notice(error.message || 'Не удалось сформировать карточку.', true); setBusy(button, false);
      }
    });
  }

  const isConfirmed = value => value === true || value === 1 || value === '1' || value === 'true';
  let currentCard = {};
  let savingField = false;
  const edits = new Map();
  function fieldValue(card, key) {
    const record = card?.card || card || {};
    const source = record.fields || record;
    const item = source[key];
    if (item && typeof item === 'object') return { value:item.value ?? item.text ?? '', confirmed:isConfirmed(item.confirmed) };
    return { value:item ?? '', confirmed:isConfirmed(source[`${key}_confirmed`]) };
  }

  function renderCard(card) {
    currentCard = card?.card || card || {};
    const host = $('#card-fields');
    host.innerHTML = fields.map(field => {
      const current = fieldValue(card, field.key);
      if (current.confirmed) edits.delete(field.key);
      if (!current.confirmed && edits.has(field.key)) current.value = edits.get(field.key);
      return `<form class="field-card ${current.confirmed ? 'confirmed' : ''}" data-field-form="${field.key}">
        <div class="field-card-head"><div><span class="field-weight">${field.weight} БАЛЛОВ</span><h2>${field.label}</h2></div><span class="field-state">${current.confirmed ? 'Подтверждено ✓' : 'Не подтверждено'}</span></div>
        <textarea name="value" rows="${field.rows}" ${current.confirmed ? 'disabled' : ''} placeholder="Добавьте информацию в это поле…">${escapeHtml(current.value)}</textarea>
        ${current.confirmed ? '<div class="locked-note">Поле подтверждено и защищено от изменений.</div>' : `<div class="confirm-row"><label class="confirm-check"><input type="checkbox" name="confirmed" required><span>Подтверждаю, что информация верна</span></label><button class="btn confirm-btn" type="submit">Подтвердить ✓</button></div>`}
        <div class="field-error" aria-live="polite"></div>
      </form>`;
    }).join('');

    const record = card?.card || card || {};
    const rating = Math.max(0, Math.min(100, Number(record.rating ?? record.readiness_score ?? 0)));
    if (window.SanaRating) SanaRating.render($('#rating-widget'), rating, record.readiness_level);
    const publish = $('#publish-button');
    if (publish) {
      const published = isConfirmed(record.published) || isConfirmed(record.is_published) || record.status === 'published' || record.status === 'опубликовано';
      publish.hidden = false;
      publish.disabled = (!Number.isFinite(rating) || rating < 40) && !published;
      publish.dataset.published = String(published);
      publish.textContent = published ? 'Перейти к предложениям →' : 'Опубликовать задачу →';
      $('#publish-hint').textContent = published ? 'Карточка опубликована и доступна командам.' : rating < 40 ? 'Для публикации подтвердите поля и наберите минимум 40 баллов.' : 'Рейтинг достиг 40 баллов — карточку можно опубликовать.';
    }
  }
  function levelFor(score) { return score >= 90 ? 'Приоритетная' : score >= 70 ? 'Готовая' : score >= 40 ? 'Рабочая' : 'Черновик'; }

  async function initCard() {
    const host = $('#card-fields'); if (!host) return;
    const cardId = idFromUrlOrStorage('card_id', 'cardId');
    if (!cardId) { notice('Не найдена карточка. Сначала ответьте на уточняющие вопросы.', true); host.innerHTML = ''; return; }
    SanaAPI.saveId('cardId', cardId);
    const editKey = `aiSana.edits.${cardId}`;
    try { Object.entries(JSON.parse(sessionStorage.getItem(editKey) || '{}')).forEach(([key,value]) => { if (fieldByKey[key]) edits.set(key,value); }); } catch { /* Ignore corrupt local drafts. */ }
    const persistEdits = () => sessionStorage.setItem(editKey, JSON.stringify(Object.fromEntries(edits)));
    host.addEventListener('input', event => {
      const form = event.target.closest('[data-field-form]');
      if (form && event.target.matches('textarea')) { edits.set(form.dataset.fieldForm, event.target.value); persistEdits(); }
    });
    const load = async () => { const data = await SanaAPI.getCard(cardId); renderCard(data); persistEdits(); };
    try {
      await load();
      if (params.get('answers_incomplete') === '1') notice('Карточка создана, но не все ответы сохранились. Проверьте и заполните поля вручную.', true);
    } catch (error) { host.innerHTML = ''; notice(error.message || 'Не удалось загрузить карточку.', true); return; }

    host.addEventListener('submit', async event => {
      const form = event.target.closest('[data-field-form]'); if (!form) return;
      event.preventDefault();
      if (savingField) return;
      const field = form.dataset.fieldForm;
      const value = $('textarea[name="value"]', form).value.trim();
      const checkbox = $('input[name="confirmed"]', form);
      const errorBox = $('.field-error', form);
      if (!value) { errorBox.textContent = 'Заполните поле перед подтверждением.'; return; }
      if (!checkbox.checked) { errorBox.textContent = 'Отметьте, что информация верна.'; return; }
      const button = $('button[type="submit"]', form); setBusy(button, true, 'Сохраняю…'); errorBox.textContent = '';
      savingField = true;
      $('textarea', form).disabled = true;
      try {
        if (form.dataset.saved !== 'true') await SanaAPI.updateCardField({ card_id:cardId, field, value, confirmed:true });
        form.dataset.saved = 'true';
        // Keep other unfinished edits when refreshing the server's rating and confirmations.
        $('textarea', form).disabled = true;
        checkbox.disabled = true;
        await load();
        notice(`Поле «${fieldByKey[field].label}» подтверждено. Рейтинг обновлён.`);
      } catch (error) {
        notice(error.message || 'Не удалось обновить карточку.', true);
        errorBox.textContent = error.message;
        setBusy(button, false);
        if (form.dataset.saved === 'true') {
          button.textContent = 'Обновить состояние';
          $('#publish-button').disabled = true;
        } else { $('textarea', form).disabled = false; }
      }
      finally { savingField = false; }
    });
    $('#publish-button')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      if (button.dataset.published === 'true') {
        location.href = `proposals.html?card_id=${encodeURIComponent(cardId)}`;
        return;
      }
      const rating = Number(currentCard.rating ?? currentCard.readiness_score ?? 0);
      if (!Number.isFinite(rating) || rating < 40 || savingField) return;
      if (edits.size) { notice('Сначала подтвердите изменённые поля, чтобы опубликовать актуальное описание.', true); return; }
      setBusy(button, true, 'Публикую…');
      try {
        await SanaAPI.publishCard(cardId);
        location.href = `proposals.html?card_id=${encodeURIComponent(cardId)}`;
      } catch (error) {
        notice(error.message || 'Не удалось опубликовать карточку.', true);
        setBusy(button, false);
      }
    });
  }

  const path = location.pathname;
  if (path.endsWith('/business/new-task.html')) initNewTask();
  else if (path.endsWith('/business/questions.html')) initQuestions();
  else if (path.endsWith('/business/card.html')) initCard();
  else initEntry();
})();

```

## frontend/js/catalog.js

```js
(() => {
  const $ = selector => document.querySelector(selector);
  const { escape:esc, notice, setBusy } = SanaUI;
  const host = $('#catalog-list'); if (!host) return;
  const topicSelect = $('#filter-topic');
  const levelSelect = $('#filter-level');
  let current = [];
  let knownTopics = [];
  let requestVersion = 0;
  const cardId = card => card.card_id ?? card.id;
  const textValue = value => value && typeof value === 'object' ? value.value ?? value.text ?? '' : value;
  const getTitle = card => card.title || card.name || textValue(card.expected_result) || 'Бизнес-задача';
  const getTopic = card => card.topic || card.industry || card.category || 'Другое';

  async function loadCatalog() {
    const version = ++requestVersion;
    notice($('#notice'), '');
    host.innerHTML = '<div class="loading">Загружаю каталог…</div>';
    try {
      const filters = { topic:topicSelect.value, level:levelSelect.value };
      const response = await SanaAPI.getCatalog(filters);
      if (version !== requestVersion) return;
      current = SanaUI.list(response, ['cards','catalog','items']).slice().sort((a,b) => Number(b.rating ?? b.readiness_score ?? 0) - Number(a.rating ?? a.readiness_score ?? 0));
      knownTopics = [...new Set([...knownTopics, ...current.map(getTopic)])];
      const selected = topicSelect.value;
      topicSelect.innerHTML = '<option value="">Все темы</option>' + knownTopics.map(topic => `<option value="${esc(topic)}">${esc(topic)}</option>`).join('');
      if (knownTopics.includes(selected)) topicSelect.value = selected;
      if (!current.length) { host.innerHTML = '<div class="empty-state">Опубликованных задач пока нет.</div>'; return; }
      host.innerHTML = current.map((card,index) => {
        const id = cardId(card);
        const rating = Number(card.rating ?? card.readiness_score ?? 0);
        const preview = textValue(card.context ?? card.fields?.context) || textValue(card.expected_result) || 'Откройте карточку, чтобы узнать подробности задачи.';
        return `<button class="catalog-card" type="button" data-card-id="${esc(id)}"><div class="catalog-card-main"><span class="tag">${esc(getTopic(card))}</span><h2>${esc(getTitle(card))}</h2><p>${esc(preview)}</p><span class="catalog-more">Посмотреть задачу <b>→</b></span></div><div class="catalog-card-rating" id="catalog-rating-${index}"></div></button>`;
      }).join('');
      current.forEach((card,index) => SanaRating.render($(`#catalog-rating-${index}`), Number(card.rating ?? card.readiness_score ?? 0), card.readiness_level, true));
    } catch (error) { if (version !== requestVersion) return; host.innerHTML = ''; notice($('#notice'), error.message || 'Не удалось загрузить каталог.', true); }
  }

  topicSelect.addEventListener('change', loadCatalog);
  levelSelect.addEventListener('change', loadCatalog);
  $('#filter-sort').addEventListener('change', loadCatalog);
  host.addEventListener('click', event => {
    const button = event.target.closest('[data-card-id]'); if (!button) return;
    SanaAPI.saveId('selectedCardId', button.dataset.cardId);
    location.href = `task-view.html?card_id=${encodeURIComponent(button.dataset.cardId)}`;
  });
  loadCatalog();
})();

```

## frontend/js/navigation.js

```js
(() => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  const business = location.pathname.includes('/business/');
  const cardId = SanaAPI.getId('cardId');
  const links = business
    ? [['new-task.html', '＋ Новая задача'], ...(cardId ? [[`card.html?card_id=${encodeURIComponent(cardId)}`, '▦ Карточка задачи'], [`proposals.html?card_id=${encodeURIComponent(cardId)}`, '↗ Предложения команд']] : []), ['../team/catalog.html', '⌕ Общий каталог']]
    : [['profile.html', '◎ Профиль команды'], ['catalog.html', '⌕ Каталог задач'], ['my-proposals.html', '↗ Мои предложения']];
  links.push(['../index.html', '↔ Сменить роль']);
  const existing = new Set(Array.from(sidebar.querySelectorAll('a.navitem')).map(a => new URL(a.href).pathname));
  for (const [href, label] of links) {
    if (existing.has(new URL(href, location.href).pathname)) continue;
    const link = document.createElement('a');
    link.className = 'navitem'; link.href = href; link.textContent = label;
    sidebar.insertBefore(link, sidebar.querySelector('.sidebar-note'));
  }
})();

```

## frontend/js/proposals.js

```js
(() => {
  const $ = selector => document.querySelector(selector);
  const { escape:esc, notice, queryId, setBusy } = SanaUI;
  const listHost = $('#proposal-list'); if (!listHost) return;
  const cardId = queryId('card_id', 'cardId');
  const chosenHost = $('#chosen-banner');
  if (!cardId) { listHost.innerHTML = ''; notice($('#notice'), 'Не найдена карточка задачи. Вернитесь к публикации.', true); return; }
  SanaAPI.saveId('cardId', cardId);
  let choosing = false;

  function render(proposals) {
    chosenHost.hidden = true;
    if (!proposals.length) { listHost.innerHTML = '<div class="empty-state">Предложений пока нет. Когда команды откликнутся, они появятся здесь.</div>'; return; }
    chosenHost.hidden = true;
    const picked = proposals.find(p => SanaUI.proposalStatus(p) === 'Выбрано');
    listHost.innerHTML = proposals.map(proposal => {
      const id = proposal.proposal_id ?? proposal.id;
      const team = proposal.team_name || proposal.name || `Команда #${proposal.team_id ?? ''}`;
      const selected = SanaUI.proposalStatus(proposal) === 'Выбрано';
      const rejected = SanaUI.proposalStatus(proposal) === 'Не выбрано';
      proposal = { ...proposal, prototype_link:SanaUI.safeUrl(proposal.prototype_link) };
      const status = selected ? 'Команда выбрана' : rejected ? 'Не выбрано' : 'На рассмотрении';
      return `<article class="proposal-card"><div class="proposal-top"><div class="team-avatar">${esc(team.slice(0,1).toUpperCase())}</div><div class="proposal-team"><h3>${esc(team)}</h3><span>Предложение команды</span></div><span class="proposal-status ${selected?'chosen':''}">${status}</span></div><div class="proposal-content"><div><b>Идея решения</b><p>${esc(proposal.solution_idea || '')}</p></div><div><b>План работы</b><p>${esc(proposal.plan || '')}</p></div><div class="proposal-meta"><span>Срок: ${esc(proposal.deadline || 'не указан')}</span>${proposal.prototype_link ? `<a href="${esc(proposal.prototype_link)}" target="_blank" rel="noreferrer">Открыть прототип ↗</a>` : '<span>Прототип не приложен</span>'}</div></div>${selected ? `<div class="selected-result">Команда выбрана: <b>${esc(team)}</b></div>` : rejected || picked ? '' : `<div class="proposal-actions"><button class="btn primary" type="button" data-choose-id="${esc(id)}" data-team-name="${esc(team)}">Выбрать эту команду</button></div>`}</article>`;
    }).join('');
    if (picked) {
      const team = picked.team_name || picked.name || `Команда #${picked.team_id ?? ''}`;
      chosenHost.hidden = false; chosenHost.textContent = `Команда выбрана: ${team}`;
    }
  }

  async function load() {
    listHost.innerHTML = '<div class="loading">Загружаю предложения…</div>';
    try {
      const [cardResult, proposalResult] = await Promise.all([SanaAPI.getCard(cardId), SanaAPI.getProposalsForCard(cardId)]);
      const card = cardResult?.card || cardResult?.data || cardResult || {};
      $('#proposal-task-title').textContent = card.title || card.name || 'Отклики к карточке задачи';
      render(SanaUI.list(proposalResult, ['proposals','items']));
    } catch (error) { listHost.innerHTML = ''; notice($('#notice'), error.message || 'Не удалось загрузить предложения.', true); }
  }

  listHost.addEventListener('click', async event => {
    const button = event.target.closest('[data-choose-id]'); if (!button) return;
    if (choosing) return;
    if (!window.confirm(`Выбрать команду «${button.dataset.teamName}»?`)) return;
    setBusy(button, true, 'Выбираю…');
    choosing = true;
    try {
      await SanaAPI.chooseProposal(button.dataset.chooseId);
      chosenHost.hidden = false;
      chosenHost.textContent = `Команда выбрана: ${button.dataset.teamName}`;
      notice($('#notice'), 'Ваш выбор сохранён. Команда назначена вручную.');
      await load();
    } catch (error) { notice($('#notice'), error.message || 'Не удалось выбрать команду.', true); setBusy(button, false); }
    finally { choosing = false; }
  });
  load();
})();

```

## frontend/js/ratings.js

```js
(() => {
  const normalize = (level, score) => {
    if (score >= 90) return { key:'priority', label:'Приоритет' };
    if (score >= 70) return { key:'ready', label:'Готово' };
    if (score >= 40) return { key:'work', label:'В работе' };
    return { key:'project', label:'Проект' };
  };
  window.SanaRating = {
    level:normalize,
    render(target, rating, readinessLevel, compact = false) {
      if (!target) return;
      const score = Math.max(0, Math.min(100, Number(rating) || 0));
      const level = normalize(readinessLevel, score);
      target.innerHTML = `<div class="rating-indicator ${compact?'compact':''} level-${level.key}">
        <div class="rating-ring" role="progressbar" aria-label="Готовность задачи" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${score}" style="--rating:${score*3.6}deg"><span>${score}<small>/100</small></span></div>
        <span class="rating-level-badge">${level.label}</span>
        ${compact ? '' : `<div class="rating-progress-track"><i style="width:${score}%"></i></div>`}
      </div>`;
    }
  };
})();

```

## frontend/js/team.js

```js
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const { escape:esc, notice, queryId, setBusy } = SanaUI;

  async function initProfile() {
    const form = $('#team-form'); if (!form) return;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      if (button.disabled) return;
      const payload = Object.fromEntries(Array.from(new FormData(form), ([key,value]) => [key,value.trim()]));
      if (!payload.name) { notice($('#notice'), 'Введите название команды.', true); return; }
      setBusy(button, true, 'Сохраняю…');
      try {
        const result = await SanaAPI.createTeam(payload);
        const teamId = result?.team_id ?? result?.id;
        if (teamId == null) throw new Error('Сервер не вернул team_id.');
        SanaAPI.saveId('teamId', teamId);
        SanaAPI.saveId('teamName', payload.name);
        location.href = 'catalog.html';
      } catch (error) { notice($('#notice'), error.message || 'Не удалось сохранить профиль.', true); setBusy(button, false); }
    });
  }

  function normalizeCard(data) { return data?.card || data?.data?.card || data?.data || data || {}; }
  function getField(card, key) {
    const source = card.fields || card;
    const raw = source[key];
    return raw && typeof raw === 'object' ? raw.value || raw.text || '' : raw || '';
  }
  async function initTaskView() {
    const host = $('#task-details'); if (!host) return;
    const form = $('#proposal-form');
    form.addEventListener('submit', event => event.preventDefault());
    const submitButton = $('button[type="submit"]', form);
    submitButton.disabled = true;
    const cardId = queryId('card_id', 'selectedCardId');
    if (!cardId) { host.innerHTML = ''; notice($('#notice'), 'Не найдена задача. Откройте её из каталога.', true); return; }
    SanaAPI.saveId('selectedCardId', cardId);
    try {
      const response = await SanaAPI.getCard(cardId);
      const card = normalizeCard(response);
      const rating = Number(card.rating ?? card.readiness_score ?? 0);
      const topic = card.topic || card.industry || card.category || 'Бизнес-задача';
      const title = card.title || card.name || 'Бизнес-задача';
      const sections = [
        ['Контекст и потребность','context'],['Данные и материалы','data_materials'],['Ожидаемый результат','expected_result'],
        ['Критерии успеха','success_criteria'],['Ограничения','constraints'],['Пользователи','users'],['Связь с бизнесом','business_contact']
      ].map(([label,key]) => `<section class="detail-section"><h3>${label}</h3><p>${esc(getField(card,key) || 'Информация не указана')}</p></section>`).join('');
      host.innerHTML = `<span class="tag">${esc(topic)}</span><h1>${esc(title)}</h1><div id="task-rating"></div>${sections}`;
      SanaRating.render($('#task-rating'), rating, card.readiness_level, true);
    } catch (error) { host.innerHTML = ''; notice($('#notice'), error.message || 'Не удалось загрузить задачу.', true); $('#proposal-form button[type="submit"]').disabled = true; return; }

    submitButton.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const teamId = SanaAPI.getId('teamId');
      if (!teamId) { notice($('#notice'), 'Сначала заполните профиль команды.', true); return; }
      const button = $('button[type="submit"]', form);
      if (button.disabled) return;
      const values = Object.fromEntries(Array.from(new FormData(form), ([key,value]) => [key,value.trim()]));
      if (!values.solution_idea || !values.plan || !values.deadline) { notice($('#notice'), 'Заполните идею, план и срок.', true); return; }
      if (values.prototype_link && !SanaUI.safeUrl(values.prototype_link)) { notice($('#notice'), 'Укажите ссылку на прототип, начинающуюся с https:// или http://.', true); return; }
      setBusy(button, true, 'Отправляю…');
      const payload = { card_id:cardId, team_id:teamId, ...values };
      try {
        await SanaAPI.createProposal(payload);
        location.href = 'my-proposals.html';
      } catch (error) { notice($('#notice'), error.message || 'Не удалось отправить предложение.', true); setBusy(button, false); }
    });
  }

  async function initMyProposals() {
    const host = $('#my-proposals-list'); if (!host) return;
    const teamId = SanaAPI.getId('teamId');
    if (!teamId) { host.innerHTML = ''; notice($('#notice'), 'Профиль команды не найден. Создайте профиль, чтобы видеть отклики.', true); return; }
    try {
      const response = await SanaAPI.getProposalsForTeam(teamId);
      const proposals = SanaUI.list(response, ['proposals','items']);
      if (!proposals.length) { host.innerHTML = '<div class="empty-state">Предложений пока нет. Откройте каталог и выберите задачу.</div>'; return; }
      host.innerHTML = proposals.map(proposal => {
        const status = SanaUI.proposalStatus(proposal);
        const title = proposal.card_title || proposal.task_title || proposal.title || `Задача #${proposal.card_id ?? ''}`;
        return `<article class="proposal-card"><div class="proposal-top"><div class="team-avatar">↗</div><div class="proposal-team"><h3>${esc(title)}</h3><span>${esc(proposal.created_at || 'Предложение команды')}</span></div><span class="proposal-status ${status==='Выбрано'?'chosen':''}">${status}</span></div><div class="proposal-content"><div><b>Идея решения</b><p>${esc(proposal.solution_idea || '')}</p></div><div><b>План</b><p>${esc(proposal.plan || '')}</p></div></div></article>`;
      }).join('');
    } catch (error) { host.innerHTML = ''; notice($('#notice'), error.message || 'Не удалось загрузить предложения.', true); }
  }

  const path = location.pathname;
  if (path.endsWith('/team/profile.html')) initProfile();
  else if (path.endsWith('/team/task-view.html')) initTaskView();
  else if (path.endsWith('/team/my-proposals.html')) initMyProposals();
})();

```

## frontend/js/ui.js

```js
(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  const list = (data, keys) => {
    if (Array.isArray(data)) return data;
    for (const key of keys) if (Array.isArray(data?.[key])) return data[key];
    throw new Error('Сервер вернул список в неизвестном формате. Попробуйте обновить страницу.');
  };
  const notice = (el, message, error = false) => {
    if (!el) return;
    el.textContent = message || '';
    el.className = `notice ${message ? (error ? 'is-error' : 'is-success') : ''}`;
  };
  const queryId = (param, key) => new URLSearchParams(location.search).get(param) || SanaAPI.getId(key);
  const setBusy = (button, busy, text = 'Загрузка…') => {
    if (!button) return;
    if (busy) { button.dataset.originalText ||= button.innerHTML; button.disabled = true; button.innerHTML = text; }
    else { button.disabled = false; if (button.dataset.originalText) button.innerHTML = button.dataset.originalText; }
  };
  const proposalStatus = proposal => {
    const value = String(proposal.status ?? proposal.selection_status ?? '').trim().toLowerCase();
    if (['rejected','not_selected','not selected','declined','не выбрано','не выбрана','отклонено','отклонена'].includes(value)) return 'Не выбрано';
    if (['selected','chosen','accepted','выбрано','выбрана','команда выбрана'].includes(value) || [true,1,'1'].includes(proposal.selected)) return 'Выбрано';
    return 'На рассмотрении';
  };
  const safeUrl = value => {
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  window.SanaUI = { escape, list, notice, queryId, setBusy, proposalStatus, safeUrl };
})();

```

## frontend/team/catalog.html

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Каталог задач — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">КОМАНДА</div><a class="navitem" href="profile.html">◎ &nbsp; Профиль команды</a><a class="navitem active" href="catalog.html">⌕ &nbsp; Каталог задач</a><a class="navitem" href="my-proposals.html">↗ &nbsp; Мои предложения</a></aside><main class="content"><header class="topbar"><div>Пространство команды <span>/</span> Каталог задач</div><span class="top-pill">ОБЩИЙ КАТАЛОГ</span></header><section class="page"><div class="eyebrow">ОТКРЫТЫЙ ПУЛ ПРОЕКТОВ</div><h1>Выберите задачу</h1><p class="intro">Все опубликованные задачи доступны каждой команде. Рейтинг показывает готовность описания к работе.</p><div class="catalog-filters"><label>Тема<select id="filter-topic"><option value="">Все темы</option></select></label><label>Уровень готовности<select id="filter-level"><option value="">Любой уровень</option><option value="project">Проект</option><option value="in_work">В работе</option><option value="ready">Готово</option><option value="priority">Приоритет</option></select></label><label>Сортировка<select id="filter-sort"><option value="rating">Рейтинг: сначала высокий</option></select></label></div><div id="catalog-list" class="catalog-list"><div class="loading">Загружаю каталог…</div></div><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana · Открытый выбор команды</footer></main></div><script src="../js/api.js"></script><script src="../js/ratings.js"></script><script src="../js/ui.js"></script><script src="../js/catalog.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/team/my-proposals.html

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Мои предложения — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">КОМАНДА</div><a class="navitem" href="catalog.html">⌕ &nbsp; Каталог задач</a><a class="navitem active" href="my-proposals.html">↗ &nbsp; Мои предложения</a></aside><main class="content"><header class="topbar"><div>Пространство команды <span>/</span> Мои предложения</div><span class="top-pill">СТАТУСЫ ОТКЛИКОВ</span></header><section class="page"><div class="eyebrow">ОТКЛИКИ КОМАНДЫ</div><h1>Мои предложения</h1><p class="intro">Решение о выборе принимает представитель бизнеса.</p><div id="my-proposals-list" class="proposal-list"><div class="loading">Загружаю предложения…</div></div><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana · Статус выбирает бизнес</footer></main></div><script src="../js/api.js"></script><script src="../js/ui.js"></script><script src="../js/team.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/team/profile.html

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Профиль команды — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">КОМАНДА</div><a class="navitem active" href="profile.html">◎ &nbsp; Профиль команды</a><a class="navitem" href="catalog.html">⌕ &nbsp; Каталог задач</a><a class="navitem" href="my-proposals.html">↗ &nbsp; Мои предложения</a></aside><main class="content"><header class="topbar"><div>Пространство команды <span>/</span> Профиль</div><span class="top-pill">КОМАНДА</span></header><section class="page narrow"><div class="step-line"><span>ПРОФИЛЬ КОМАНДЫ</span></div><div class="eyebrow">НАЙДИТЕ СВОЮ ЗАДАЧУ</div><h1>Расскажите о команде</h1><p class="intro">Профиль поможет бизнесу понять ваш опыт. Команда сама выбирает задачи и отправляет предложения.</p><form id="team-form" class="panel"><label class="form-row"><span class="field-label">Название команды</span><input name="name" required placeholder="Например, Qadam Studio"></label><label class="form-row"><span class="field-label">Интересы</span><textarea name="interests" rows="2" placeholder="Темы и сферы, которые вам интересны"></textarea></label><label class="form-row"><span class="field-label">Навыки</span><textarea name="skills" rows="2" placeholder="Исследования, аналитика, дизайн…"></textarea></label><label class="form-row"><span class="field-label">Технологии</span><input name="technologies" placeholder="Python, Figma, React…"></label><div class="panel-actions"><span>После сохранения откроется общий каталог задач</span><button class="btn primary" type="submit">Сохранить и открыть каталог →</button></div></form><div id="notice" class="notice" role="status" aria-live="polite"></div></section><footer>AI Sana · Команда выбирает сама</footer></main></div><script src="../js/api.js"></script><script src="../js/ui.js"></script><script src="../js/team.js"></script><script src="../js/navigation.js"></script></body></html>

```

## frontend/team/task-view.html

```html
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Задача и предложение — AI Sana</title><link rel="stylesheet" href="../css/style.css"></head>
<body><div class="app-shell"><aside class="sidebar"><a class="brand" href="../index.html"><span class="brandmark">s</span><span>ai sana<small>ПРОЕКТЫ, КОТОРЫЕ МЕНЯЮТ</small></span></a><div class="side-label">КОМАНДА</div><a class="navitem active" href="catalog.html">⌕ &nbsp; Каталог задач</a><a class="navitem" href="my-proposals.html">↗ &nbsp; Мои предложения</a></aside><main class="content"><header class="topbar"><div>Каталог задач <span>/</span> Предложить решение</div><span class="top-pill">ВАШ ВЫБОР</span></header><section class="page"><a class="back" href="catalog.html">← В каталог</a><div class="task-view-layout"><article id="task-details" class="task-details"><div class="loading">Загружаю карточку…</div></article><aside class="proposal-form-wrap"><div class="eyebrow">ОТКЛИК КОМАНДЫ</div><h2>Предложите решение</h2><p class="form-intro">Опишите идею и план — бизнес самостоятельно рассмотрит предложение.</p><form id="proposal-form"><label class="form-row"><span class="field-label">Идея решения</span><textarea name="solution_idea" rows="3" required placeholder="Какую идею предлагает команда?"></textarea></label><label class="form-row"><span class="field-label">План работы</span><textarea name="plan" rows="3" required placeholder="Основные этапы работы"></textarea></label><label class="form-row"><span class="field-label">Ссылка на прототип</span><input name="prototype_link" type="url" placeholder="https://…"></label><label class="form-row"><span class="field-label">Срок</span><input name="deadline" type="date" required></label><div class="panel-actions"><button class="btn primary" type="submit">Отправить предложение →</button></div></form><div id="notice" class="notice" role="status" aria-live="polite"></div></aside></div></section><footer>AI Sana · Никакого автоматического назначения</footer></main></div><script src="../js/api.js"></script><script src="../js/ratings.js"></script><script src="../js/ui.js"></script><script src="../js/team.js"></script><script src="../js/navigation.js"></script></body></html>

```
