
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