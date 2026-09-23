(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const { escape:esc, notice, queryId, setBusy } = SanaUI;
  const teamFields = ['name', 'interests', 'skills', 'technologies'];
  const valuesFrom = form => Object.fromEntries(Array.from(new FormData(form), ([key,value]) => [key, String(value).trim()]));

  async function initProfile() {
    const form = $('#team-form');
    if (!form) return;
    const select = $('#existing-team');
    const use = $('#use-team');
    const button = $('button[type="submit"]', form);
    let teams = [];
    let activeTeamId = null;
    let loading = true;
    button.disabled = true;
    const fill = team => {
      activeTeamId = team?.id ?? null;
      teamFields.forEach(name => { $('[name="' + name + '"]', form).value = team?.[name] || ''; });
      select.value = activeTeamId == null ? '' : String(activeTeamId);
      use.disabled = activeTeamId == null;
      button.textContent = activeTeamId == null ? 'Создать и открыть каталог →' : 'Сохранить изменения →';
    };
    select.addEventListener('change', () => fill(teams.find(team => String(team.id) === select.value)));
    use.addEventListener('click', () => {
      if (activeTeamId == null) return;
      const team = teams.find(item => String(item.id) === String(activeTeamId));
      SanaAPI.saveId('teamId', activeTeamId);
      SanaAPI.saveId('teamName', team.name);
      location.href = 'catalog.html';
    });
    $('#new-team').addEventListener('click', () => { fill(null); $('[name="name"]', form).focus(); });
    try {
      teams = SanaUI.list(await SanaAPI.getTeams(), ['teams', 'items']);
      select.innerHTML = '<option value="">Новая команда</option>' + teams.map(team => '<option value="' + esc(team.id) + '">' + esc(team.name) + '</option>').join('');
      fill(teams.find(team => String(team.id) === SanaAPI.getId('teamId')));
    } catch (error) {
      notice($('#notice'), error.message, true);
      select.disabled = true;
    } finally { loading = false; button.disabled = false; }
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled || loading) return;
      const payload = valuesFrom(form);
      if (!payload.name) { notice($('#notice'), 'Введите название команды.', true); return; }
      setBusy(button, true, 'Сохраняю…');
      use.disabled = true; select.disabled = true; $('#new-team').disabled = true;
      try {
        const result = activeTeamId == null ? await SanaAPI.createTeam(payload) : await SanaAPI.updateTeam(activeTeamId, payload);
        const teamId = result?.team_id ?? result?.id ?? activeTeamId;
        if (teamId == null) throw new Error('Сервер не вернул номер команды.');
        SanaAPI.saveId('teamId', teamId);
        SanaAPI.saveId('teamName', payload.name);
        location.href = 'catalog.html';
      } catch (error) {
        notice($('#notice'), error.message, true);
        setBusy(button, false);
        use.disabled = activeTeamId == null; select.disabled = false; $('#new-team').disabled = false;
      }
    });
  }

  function getField(card, key) {
    const raw = (card.fields || card)[key] ?? card[key];
    return raw && typeof raw === 'object' ? raw.value || raw.text || '' : raw || '';
  }
  async function initTaskView() {
    const host = $('#task-details');
    if (!host) return;
    const form = $('#proposal-form');
    const button = $('button[type="submit"]', form);
    form.addEventListener('submit', event => event.preventDefault());
    button.disabled = true;
    const cardId = queryId('card_id', 'selectedCardId');
    if (!cardId) { host.innerHTML = ''; notice($('#notice'), 'Не найдена задача. Откройте её из каталога.', true); return; }
    SanaAPI.saveId('selectedCardId', cardId);
    const teamId = SanaAPI.getId('teamId');
    const draftKey = 'proposal.' + cardId + '.' + (teamId || 'new');
    const draft = SanaAPI.getDraft(draftKey, {});
    ['solution_idea', 'plan', 'prototype_link', 'deadline'].forEach(name => { $('[name="' + name + '"]', form).value = draft[name] || ''; });
    form.addEventListener('input', () => SanaAPI.saveDraft(draftKey, valuesFrom(form)));
    let card;
    try {
      const result = await SanaAPI.getCard(cardId);
      card = result?.card || result;
      const sections = [
        ['Потребность', 'need'], ['Формат взаимодействия', 'interaction_format'],
        ['Контекст и потребность','context'], ['Данные и материалы','data_materials'], ['Ожидаемый результат','expected_result'],
        ['Критерии успеха','success_criteria'], ['Ограничения','constraints'], ['Пользователи','users'], ['Связь с бизнесом','business_contact']
      ].map(([label,key]) => '<section class="detail-section"><h3>' + label + '</h3><p>' + esc(getField(card,key) || 'Информация не указана') + '</p></section>').join('');
      host.innerHTML = '<span class="tag">' + esc(card.topic || 'Бизнес-задача') + '</span><h1>' + esc(card.title || 'Бизнес-задача') + '</h1><div id="task-rating"></div>' + sections;
      SanaRating.render($('#task-rating'), card.rating, card.readiness_level, true);
    } catch (error) { host.innerHTML = ''; notice($('#notice'), error.message, true); return; }
    if (![true, 1, '1'].includes(card.published)) {
      notice($('#notice'), 'Задача снята с публикации. Новые предложения пока не принимаются.', true);
      return;
    }
    if (!teamId) {
      notice($('#notice'), 'Создайте или выберите профиль команды перед отправкой предложения.', true);
      const link = document.createElement('a');
      link.className = 'btn';
      link.href = 'profile.html';
      link.textContent = 'Открыть профиль команды';
      form.appendChild(link);
      return;
    }
    button.disabled = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      const values = valuesFrom(form);
      if (!values.solution_idea || !values.plan || !values.deadline) { notice($('#notice'), 'Заполните идею, план и срок.', true); return; }
      if (values.prototype_link && !SanaUI.safeUrl(values.prototype_link)) { notice($('#notice'), 'Укажите ссылку на прототип, начинающуюся с https:// или http://.', true); return; }
      setBusy(button, true, 'Отправляю…');
      try {
        await SanaAPI.createProposal({ card_id:cardId, team_id:teamId, ...values });
        SanaAPI.clearDraft(draftKey);
        location.href = 'my-proposals.html';
      } catch (error) { notice($('#notice'), error.message, true); setBusy(button, false); }
    });
  }

  async function initMyProposals() {
    const host = $('#my-proposals-list');
    if (!host) return;
    const teamId = SanaAPI.getId('teamId');
    if (!teamId) { host.innerHTML = '<div class="empty-state">Выберите <a href="profile.html">профиль команды</a>, чтобы видеть её предложения.</div>'; return; }
    try {
      const proposals = SanaUI.list(await SanaAPI.getProposalsForTeam(teamId), ['proposals','items']);
      if (!proposals.length) { host.innerHTML = '<div class="empty-state">Предложений пока нет. <a href="catalog.html">Откройте каталог</a> и выберите задачу.</div>'; return; }
      host.innerHTML = proposals.map(proposal => {
        const status = SanaUI.proposalStatus(proposal);
        const title = proposal.card_title || 'Задача #' + proposal.card_id;
        const prototype = SanaUI.safeUrl(proposal.prototype_link);
        return '<article class="proposal-card"><div class="proposal-top"><div class="team-avatar">↗</div><div class="proposal-team"><h3><a href="task-view.html?card_id=' + encodeURIComponent(proposal.card_id) + '">' + esc(title) + '</a></h3><span>' + esc(proposal.created_at || 'Предложение команды') + '</span></div><span class="proposal-status ' + (status === 'Выбрано' ? 'chosen' : '') + '">' + status + '</span></div><div class="proposal-content"><div><b>Идея решения</b><p>' + esc(proposal.solution_idea) + '</p></div><div><b>План</b><p>' + esc(proposal.plan) + '</p></div><div class="proposal-meta"><span>Срок: ' + esc(proposal.deadline) + '</span>' + (prototype ? '<a href="' + esc(prototype) + '" target="_blank" rel="noopener noreferrer">Открыть прототип ↗</a>' : '') + '</div></div></article>';
      }).join('');
    } catch (error) { host.innerHTML = ''; notice($('#notice'), error.message, true); }
  }
  const path = location.pathname;
  if (path.endsWith('/team/profile.html')) initProfile();
  else if (path.endsWith('/team/task-view.html')) initTaskView();
  else if (path.endsWith('/team/my-proposals.html')) initMyProposals();
})();
