
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