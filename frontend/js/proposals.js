(() => {
  const $ = selector => document.querySelector(selector);
  const { escape:esc, notice, queryId } = SanaUI;
  const listHost = $('#proposal-list');
  if (!listHost) return;
  const cardId = queryId('card_id', 'cardId');
  const chosenHost = $('#chosen-banner');
  if (!cardId) { listHost.innerHTML = ''; notice($('#notice'), 'Не найдена карточка задачи. Вернитесь к публикации.', true); return; }
  SanaAPI.saveId('cardId', cardId);
  let choosing = false;
  function render(proposals) {
    const picked = proposals.filter(proposal => SanaUI.proposalStatus(proposal) === 'Выбрано');
    chosenHost.hidden = picked.length === 0;
    chosenHost.textContent = picked.length ? 'Приняты предложения: ' + picked.map(item => item.team_name || 'Команда #' + item.team_id).join(', ') : '';
    if (!proposals.length) { listHost.innerHTML = '<div class="empty-state">Предложений пока нет. Когда команды откликнутся, они появятся здесь.</div>'; return; }
    listHost.innerHTML = proposals.map(proposal => {
      const id = proposal.proposal_id ?? proposal.id;
      const team = proposal.team_name || 'Команда #' + proposal.team_id;
      const status = SanaUI.proposalStatus(proposal);
      const prototype = SanaUI.safeUrl(proposal.prototype_link);
      const profileFields = [['Интересы',proposal.team_interests],['Навыки',proposal.team_skills],['Технологии',proposal.team_technologies]].filter(([, value]) => value);
      const profile = profileFields.length ? '<details class="team-profile"><summary>Профиль команды</summary><div class="proposal-content">' + profileFields.map(([label,value]) => '<div><b>' + label + '</b><p>' + esc(value) + '</p></div>').join('') + '</div></details>' : '';
      const button = (decision, label, primary = false) => '<button class="btn ' + (primary ? 'primary' : 'confirm-btn') + '" type="button" data-proposal-id="' + esc(id) + '" data-decision="' + decision + '">' + label + '</button>';
      const actions = (status !== 'Выбрано' ? button('accepted', 'Принять предложение', true) : '') + (status !== 'Не выбрано' ? button('rejected', 'Отклонить') : '') + (status !== 'На рассмотрении' ? button('pending', 'Отменить решение') : '');
      return '<article class="proposal-card"><div class="proposal-top"><div class="team-avatar">' + esc(team.slice(0,1).toUpperCase()) + '</div><div class="proposal-team"><h3>' + esc(team) + '</h3><span>Предложение команды</span></div><span class="proposal-status ' + (status === 'Выбрано' ? 'chosen' : '') + '">' + status + '</span></div><div class="proposal-content"><div><b>Идея решения</b><p>' + esc(proposal.solution_idea) + '</p></div><div><b>План работы</b><p>' + esc(proposal.plan) + '</p></div><div class="proposal-meta"><span>Срок: ' + esc(proposal.deadline || 'не указан') + '</span>' + (prototype ? '<a href="' + esc(prototype) + '" target="_blank" rel="noopener noreferrer">Открыть прототип ↗</a>' : '<span>Прототип не приложен</span>') + '</div></div>' + profile + '<div class="proposal-actions">' + actions + '</div></article>';
    }).join('');
  }
  async function load() {
    const [cardResult, proposalResult] = await Promise.all([SanaAPI.getCard(cardId), SanaAPI.getProposalsForCard(cardId)]);
    const card = cardResult?.card || cardResult;
    $('#proposal-task-title').textContent = card.title || 'Отклики к карточке задачи';
    render(SanaUI.list(proposalResult, ['proposals','items']));
  }
  listHost.addEventListener('click', async event => {
    const button = event.target.closest('[data-decision]');
    if (!button || choosing) return;
    choosing = true;
    listHost.querySelectorAll('button').forEach(item => { item.disabled = true; });
    try {
      await SanaAPI.chooseProposal(button.dataset.proposalId, button.dataset.decision);
      notice($('#notice'), 'Решение сохранено.');
      await load();
    } catch (error) { notice($('#notice'), error.message + ' Обновите страницу, чтобы проверить статус.', true); }
    finally {
      choosing = false;
      listHost.querySelectorAll('button').forEach(item => { item.disabled = false; });
    }
  });
  load().catch(error => { listHost.innerHTML = ''; notice($('#notice'), error.message, true); });
})();
