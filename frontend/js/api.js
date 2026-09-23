/* Shared JSON API client. Set window.API_BASE before this file to change the API prefix. */
(() => {
  const base = (window.API_BASE || '/api').replace(/\/$/, '');
  const request = async (path, options = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), window.API_TIMEOUT_MS || 20000);
    try {
    const response = await fetch(`${base}${path}`, {
      ...options,
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept:'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers }
    });
    const raw = await response.text();
    let data = null;
    if (raw) { try { data = JSON.parse(raw); } catch { throw new Error(`Сервер вернул некорректный JSON (${response.status}). Проверьте адрес API.`); } }
    if (!response.ok) throw new Error(data?.message || data?.error || `Ошибка API (${response.status})`);
    if (data?.success === false || data?.error) throw new Error(data.message || (typeof data.error === 'string' ? data.error : 'Сервер отклонил запрос.'));
    return data?.data ?? data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Сервер не ответил вовремя. Проверьте результат перед повторной отправкой.');
      if (error instanceof TypeError) throw new Error('Нет связи с сервером. Проверьте подключение и адрес API.');
      throw error;
    } finally { clearTimeout(timer); }
  };
  const json = (method, body) => ({ method, body: JSON.stringify(body) });

  window.SanaAPI = {
    createTask: raw_description => request('/tasks.php', json('POST', { raw_description })),
    getTask: id => request(`/tasks.php?id=${encodeURIComponent(id)}`),
    createCard: task_id => request('/cards.php', json('POST', { task_id })),
    updateCardField: payload => request('/cards.php', json('PATCH', payload)),
    getCard: id => request(`/cards.php?id=${encodeURIComponent(id)}`),
    publishCard: card_id => request('/publish.php', json('POST', { card_id })),
    getCatalog: filters => {
      const query = new URLSearchParams({ sort:'rating', ...(filters || {}) });
      return request(`/catalog.php?${query}`);
    },
    createTeam: payload => request('/teams.php', json('POST', payload)),
    createProposal: payload => request('/proposals.php', json('POST', payload)),
    getProposalsForCard: card_id => request(`/proposals.php?card_id=${encodeURIComponent(card_id)}`),
    getProposalsForTeam: team_id => request(`/proposals.php?team_id=${encodeURIComponent(team_id)}`),
    chooseProposal: proposal_id => request('/choose.php', json('PATCH', { proposal_id })),
    saveId(name, value) { localStorage.setItem(`aiSana.${name}`, String(value)); },
    getId(name) { return localStorage.getItem(`aiSana.${name}`); },
    clearId(name) { localStorage.removeItem(`aiSana.${name}`); }
  };
})();
