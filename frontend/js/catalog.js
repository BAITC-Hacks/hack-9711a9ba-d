(() => {
  const $ = selector => document.querySelector(selector);
  const { escape:esc, list, notice } = SanaUI;
  const host = $('#catalog-list');
  if (!host) return;
  let requestNumber = 0;
  function render(cards) {
    if (!cards.length) {
      host.innerHTML = '<div class="empty-state">Задачи не найдены. Попробуйте изменить фильтры.</div>';
      return;
    }
    host.innerHTML = cards.map((card, index) => `<a class="catalog-card" href="task-view.html?card_id=${encodeURIComponent(card.id ?? card.card_id)}"><div class="catalog-card-main"><span class="tag">${esc(card.topic || 'Бизнес-задача')}</span><h2>${esc(card.title || `Задача #${card.id}`)}</h2><p>${esc(card.need || card.context || 'Описание пока не добавлено')}</p><span class="catalog-more">Посмотреть задачу <b>→</b></span></div><div class="catalog-card-rating" id="catalog-rating-${index}"></div></a>`).join('');
    cards.forEach((card, index) => SanaRating.render($(`#catalog-rating-${index}`), card.rating, card.readiness_level, true));
  }
  async function load(initial = false) {
    const ownRequest = ++requestNumber;
    host.innerHTML = '<div class="loading">Загружаю каталог…</div>';
    notice($('#notice'), '');
    try {
      const cards = list(await SanaAPI.getCatalog({ topic:$('#filter-topic').value, level:$('#filter-level').value, sort:$('#filter-sort').value }), ['cards', 'items']);
      if (initial) {
        const topics = [...new Set(cards.map(card => card.topic).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'ru'));
        $('#filter-topic').innerHTML = '<option value="">Все темы</option>' + topics.map(topic => `<option value="${esc(topic)}">${esc(topic)}</option>`).join('');
      }
      if (ownRequest !== requestNumber) return;
      render(cards);
    } catch (error) {
      if (ownRequest !== requestNumber) return;
      host.innerHTML = '<button class="btn" type="button" id="retry-catalog">Загрузить ещё раз</button>';
      notice($('#notice'), error.message, true);
      $('#retry-catalog').addEventListener('click', () => load(initial));
    }
  }
  ['#filter-topic', '#filter-level', '#filter-sort'].forEach(selector => $(selector).addEventListener('change', () => load()));
  load(true);
})();
