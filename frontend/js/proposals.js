
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