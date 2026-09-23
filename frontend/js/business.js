(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const idFromUrlOrStorage = (param, key) => params.get(param) || SanaAPI.getId(key);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
  const notice = (message, error = false) => {
    const el = $('#notice');
    if (el) { el.textContent = message; el.className = 'notice ' + (error ? 'is-error' : 'is-success'); }
  };
  const setBusy = (button, busy, text = 'Обработка…') => {
    if (!button) return;
    if (busy) { button.dataset.originalText = button.innerHTML; button.disabled = true; button.textContent = text; }
    else { button.disabled = false; if (button.dataset.originalText) button.innerHTML = button.dataset.originalText; }
  };
  const fields = [
    { key:'title', label:'Название задачи', rows:2 },
    { key:'topic', label:'Тема', rows:2 },
    { key:'need', label:'Краткая потребность', rows:2 },
    { key:'interaction_format', label:'Формат взаимодействия', rows:2 },
    { key:'context', label:'Контекст и потребность', weight:20, rows:4 },
    { key:'data_materials', label:'Данные и материалы', weight:20, rows:3 },
    { key:'expected_result', label:'Ожидаемый результат', weight:15, rows:3 },
    { key:'success_criteria', label:'Критерии успеха', weight:15, rows:3 },
    { key:'constraints', label:'Ограничения', weight:10, rows:3 },
    { key:'users', label:'Пользователи', weight:10, rows:2 },
    { key:'business_contact', label:'Связь с бизнесом', weight:10, rows:2 }
  ];
  const fieldByKey = Object.fromEntries(fields.map(field => [field.key, field]));
  const isConfirmed = value => [true, 1, '1', 'true'].includes(value);
  const cardUrl = id => 'card.html?card_id=' + encodeURIComponent(id);
  function normalizeQuestions(data) {
    const supplied = Array.isArray(data?.questions) ? data.questions : [];
    const list = supplied.filter(item => item && typeof item === 'object' && fieldByKey[item.field] && fieldByKey[item.field].weight && typeof item.question === 'string' && item.question.trim());
    if (list.length < 3) throw new Error('Не удалось получить уточняющие вопросы. Обновите страницу и попробуйте ещё раз.');
    return list;
  }
  function providerMessage(data) {
    if (data?.provider === 'local_stub') return 'Вопросы и черновик подготовлены локальным помощником. Проверьте и дополните сведения перед публикацией.';
    return 'Помощник уточняет детали вашей задачи. Ответы можно отредактировать в карточке.';
  }

  function initEntry() {
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-role]');
      if (!button) return;
      SanaAPI.saveId('role', button.dataset.role);
      location.href = button.dataset.role === 'business' ? 'business/new-task.html' : 'team/profile.html';
    });
  }
  function initNewTask() {
    const form = $('#draft-form');
    if (!form) return;
    const input = $('#raw-description');
    input.value = SanaAPI.getDraft('description', '');
    input.addEventListener('input', () => SanaAPI.saveDraft('description', input.value));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      if (button.disabled) return;
      const description = input.value.trim();
      if (description.length < 10) { notice('Опишите задачу хотя бы в нескольких словах.', true); return; }
      setBusy(button, true, 'Сохраняю задачу…');
      try {
        const result = await SanaAPI.createTask(description);
        const taskId = result?.task_id ?? result?.id;
        if (!taskId) throw new Error('Сервер не вернул номер задачи.');
        SanaAPI.saveId('taskId', taskId);
        SanaAPI.clearDraft('description');
        location.href = 'questions.html?task_id=' + encodeURIComponent(taskId);
      } catch (error) { notice(error.message, true); setBusy(button, false); }
    });
  }
  async function initQuestions() {
    const form = $('#questions-form');
    if (!form) return;
    const host = $('#questions-list');
    const button = $('button[type="submit"]', form);
    form.addEventListener('submit', event => event.preventDefault());
    button.disabled = true;
    const taskId = idFromUrlOrStorage('task_id', 'taskId');
    if (!taskId) { host.innerHTML = ''; notice('Не найден черновик. Создайте новую задачу.', true); return; }
    SanaAPI.saveId('taskId', taskId);
    const existingCard = SanaAPI.getId('taskCard.' + taskId);
    if (existingCard) { location.replace(cardUrl(existingCard)); return; }
    const draftKey = 'questions.' + taskId;
    let draft = SanaAPI.getDraft(draftKey, {});
    let questionList;
    try {
      await SanaAPI.getTask(taskId);
      const result = draft.questions ? draft : await SanaAPI.getQuestions(taskId);
      questionList = normalizeQuestions(result);
      draft = { questions:questionList, provider:result.provider, answers:draft.answers || {} };
      SanaAPI.saveDraft(draftKey, draft);
      if ($('#assistant-note')) $('#assistant-note').textContent = providerMessage(result);
    } catch (error) {
      host.innerHTML = '<div class="api-empty">' + esc(error.message) + '</div>';
      notice(error.message, true);
      return;
    }
    host.innerHTML = questionList.map((item, index) => '<div class="question-row"><span class="question-number">' + String(index + 1).padStart(2, '0') + '</span><div class="question-content"><label for="answer-' + index + '"><b>' + esc(item.question) + '</b></label><small>' + esc(fieldByKey[item.field].label) + '</small><textarea id="answer-' + index + '" data-answer-field="' + esc(item.field) + '" rows="2" placeholder="Ваш ответ…">' + esc(draft.answers[item.field] || '') + '</textarea></div></div>').join('');
    const collectAnswers = () => {
      const answers = {};
      form.querySelectorAll('[data-answer-field]').forEach(input => {
        const value = input.value.trim();
        if (value) answers[input.dataset.answerField] = value;
      });
      draft.answers = answers;
      SanaAPI.saveDraft(draftKey, draft);
      return answers;
    };
    form.addEventListener('input', collectAnswers);
    button.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      const answers = collectAnswers();
      setBusy(button, true, 'Формирую карточку…');
      try {
        const created = await SanaAPI.createCard(taskId, answers);
        const cardId = created?.card_id ?? created?.id;
        if (!cardId) throw new Error('Сервер не вернул номер карточки.');
        SanaAPI.saveId('cardId', cardId);
        SanaAPI.saveId('taskCard.' + taskId, cardId);
        SanaAPI.saveDraft('provider.' + cardId, { provider:created.provider, fallback_reason:created.fallback_reason });
        SanaAPI.clearDraft(draftKey);
        location.href = cardUrl(cardId);
      } catch (error) { notice(error.message, true); setBusy(button, false); }
    });
  }

  let currentCard = {};
  let savingField = false;
  let refreshRequired = false;
  const edits = new Map();
  function fieldValue(card, key) {
    const record = card?.card || card || {};
    const source = record.fields || record;
    const item = source[key];
    if (item && typeof item === 'object') return { value:item.value ?? item.text ?? '', confirmed:isConfirmed(item.confirmed) };
    return { value:item ?? record[key] ?? '', confirmed:isConfirmed(source[key + '_confirmed'] ?? record[key + '_confirmed']) };
  }
  function updatePublishState() {
    const button = $('#publish-button');
    if (!button) return;
    const published = isConfirmed(currentCard.published);
    const check = $('#publish-confirm');
    button.hidden = false;
    button.dataset.published = String(published);
    button.textContent = published ? 'Перейти к предложениям →' : 'Опубликовать задачу →';
    const hasRequired = Boolean(String(fieldValue(currentCard, 'title').value).trim() && String(fieldValue(currentCard, 'context').value).trim());
    button.disabled = savingField || refreshRequired || (!published && (!check?.checked || !hasRequired || edits.size > 0));
    const confirmRow = $('#publish-confirm-row');
    if (confirmRow) confirmRow.hidden = published;
    const hint = $('#publish-hint');
    if (hint) hint.textContent = published ? 'Карточка опубликована и доступна командам.' : edits.size ? 'Сохраните изменённые поля перед публикацией.' : !hasRequired ? 'Добавьте название и контекст задачи.' : 'Проверьте карточку и подтвердите публикацию. Рейтинг отражает полноту подтверждённых сведений.';
  }
  function renderCard(card) {
    currentCard = card?.card || card || {};
    $('#card-fields').innerHTML = fields.map(field => {
      const current = fieldValue(currentCard, field.key);
      if (current.confirmed) edits.delete(field.key);
      if (edits.has(field.key)) current.value = edits.get(field.key);
      const state = field.weight ? current.confirmed ? 'Подтверждено ✓' : 'Не подтверждено' : 'Описание задачи';
      const buttons = current.confirmed
        ? '<div class="confirm-row"><span class="locked-note">Изменение снимет подтверждение и публикацию.</span><button class="btn confirm-btn" type="button" data-unlock="' + field.key + '">Изменить</button></div>'
        : '<div class="confirm-row">' + (field.weight ? '<label class="confirm-check"><input type="checkbox" name="confirmed"><span>Подтверждаю, что информация верна</span></label>' : '<span class="locked-note">Это поле не влияет на рейтинг.</span>') + '<button class="btn confirm-btn" type="submit">Сохранить</button></div>';
      return '<form class="field-card ' + (current.confirmed ? 'confirmed' : '') + '" data-field-form="' + field.key + '"><div class="field-card-head"><div><span class="field-weight">' + (field.weight ? field.weight + ' БАЛЛОВ' : 'О ЗАДАЧЕ') + '</span><h2><label for="card-' + field.key + '">' + field.label + '</label></h2></div><span class="field-state">' + state + '</span></div><textarea id="card-' + field.key + '" name="value" rows="' + field.rows + '" ' + (current.confirmed ? 'disabled ' : '') + 'placeholder="Добавьте информацию в это поле…">' + esc(current.value) + '</textarea>' + buttons + '<div class="field-error" aria-live="polite"></div></form>';
    }).join('');
    if (window.SanaRating) SanaRating.render($('#rating-widget'), currentCard.rating, currentCard.readiness_level);
    const criteria = $('#rating-criteria');
    const breakdown = currentCard.rating_details?.breakdown;
    if (criteria && Array.isArray(breakdown)) {
      criteria.innerHTML = '<b>Начисленные баллы</b>' + breakdown.filter(item => fieldByKey[item.field]).map(item => {
        const reason = item.points > 0 ? 'Подтверждено' : item.filled ? 'Нужно подтвердить' : 'Нужно заполнить';
        return '<span><span>' + fieldByKey[item.field].label + '</span><i>' + esc(item.points) + ' / ' + esc(item.weight) + '</i><small>' + reason + '</small></span>';
      }).join('');
    }
    updatePublishState();
  }
  async function initCard() {
    const host = $('#card-fields');
    if (!host) return;
    const cardId = idFromUrlOrStorage('card_id', 'cardId');
    if (!cardId) { notice('Не найдена карточка. Сначала создайте задачу.', true); host.innerHTML = ''; return; }
    SanaAPI.saveId('cardId', cardId);
    const editKey = 'aiSana.edits.' + cardId;
    try { Object.entries(JSON.parse(sessionStorage.getItem(editKey) || '{}')).forEach(([key, value]) => { if (fieldByKey[key] && typeof value === 'string') edits.set(key, value); }); } catch {}
    const persistEdits = () => { try { sessionStorage.setItem(editKey, JSON.stringify(Object.fromEntries(edits))); } catch {} };
    const resetConfirmation = () => { if ($('#publish-confirm')) $('#publish-confirm').checked = false; };
    host.addEventListener('input', event => {
      const form = event.target.closest('[data-field-form]');
      if (form && event.target.matches('textarea')) {
        const key = form.dataset.fieldForm;
        if (event.target.value === fieldValue(currentCard, key).value) edits.delete(key);
        else edits.set(key, event.target.value);
        persistEdits(); resetConfirmation(); updatePublishState();
      }
    });
    const load = async () => {
      const data = await SanaAPI.getCard(cardId);
      refreshRequired = false;
      renderCard(data);
      persistEdits();
    };
    try {
      await load();
      if (SanaAPI.getDraft?.('provider.' + cardId)?.provider === 'local_stub') {
        notice('Черновик подготовлен локальным помощником. Проверьте сведения и добавьте недостающие детали.');
      }
    }
    catch (error) { host.innerHTML = ''; notice(error.message, true); return; }

    const save = async (form, field, value, confirmed, button) => {
      if (savingField) return;
      const errorBox = $('.field-error', form);
      if (confirmed && !value) { errorBox.textContent = 'Заполните поле перед подтверждением.'; return; }
      const input = $('textarea', form);
      const checkbox = $('input[name="confirmed"]', form);
      setBusy(button, true, 'Сохраняю…');
      savingField = true;
      input.disabled = true;
      if (checkbox) checkbox.disabled = true;
      errorBox.textContent = '';
      updatePublishState();
      try {
        let updatedCard;
        if (form.dataset.saved !== 'true') {
          const payload = { id:cardId, field, value };
          if (fieldByKey[field].weight) payload.confirmed = confirmed;
          updatedCard = await SanaAPI.updateCardField(payload);
          form.dataset.saved = 'true';
          edits.delete(field);
          persistEdits();
          resetConfirmation();
        }
        if (updatedCard?.id && updatedCard.rating != null) {
          refreshRequired = false;
          renderCard(updatedCard);
          persistEdits();
        } else { await load(); }
        notice('Поле «' + fieldByKey[field].label + '» сохранено. Рейтинг обновлён.');
      } catch (error) {
        errorBox.textContent = error.message;
        notice(error.message, true);
        setBusy(button, false);
        if (form.dataset.saved === 'true') {
          refreshRequired = true;
          button.textContent = 'Обновить состояние';
        } else {
          input.disabled = isConfirmed(fieldValue(currentCard, field).confirmed);
          if (checkbox) checkbox.disabled = false;
        }
      } finally { savingField = false; updatePublishState(); }
    };
    host.addEventListener('submit', async event => {
      const form = event.target.closest('[data-field-form]');
      if (!form) return;
      event.preventDefault();
      const field = form.dataset.fieldForm;
      const value = $('textarea[name="value"]', form).value.trim();
      const checkbox = $('input[name="confirmed"]', form);
      await save(form, field, value, Boolean(checkbox?.checked), $('button[type="submit"]', form));
    });
    host.addEventListener('click', async event => {
      const button = event.target.closest('[data-unlock]');
      if (!button) return;
      const field = button.dataset.unlock;
      await save(button.closest('[data-field-form]'), field, fieldValue(currentCard, field).value, false, button);
    });
    $('#publish-confirm')?.addEventListener('change', updatePublishState);
    $('#publish-button')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      if (button.disabled) return;
      if (button.dataset.published === 'true') { location.href = 'proposals.html?card_id=' + encodeURIComponent(cardId); return; }
      if (!$('#publish-confirm')?.checked || edits.size || savingField || refreshRequired) return;
      setBusy(button, true, 'Публикую…');
      try {
        await SanaAPI.publishCard(cardId);
        location.href = 'proposals.html?card_id=' + encodeURIComponent(cardId);
      } catch (error) { notice(error.message, true); setBusy(button, false); updatePublishState(); }
    });
  }
  const path = location.pathname;
  if (path.endsWith('/business/new-task.html')) initNewTask();
  else if (path.endsWith('/business/questions.html')) initQuestions();
  else if (path.endsWith('/business/card.html')) initCard();
  else initEntry();
})();
