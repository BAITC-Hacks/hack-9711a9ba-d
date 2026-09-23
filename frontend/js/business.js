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
