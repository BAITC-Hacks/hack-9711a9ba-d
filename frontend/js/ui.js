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
