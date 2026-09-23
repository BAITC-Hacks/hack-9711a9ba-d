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
