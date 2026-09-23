/* All screens use the same PHP API. API_BASE can override its URL prefix. */
(() => {
  const base = (window.API_BASE || '/api').replace(/\/$/, '');
  const request = async (path, options = {}, timeout = window.API_TIMEOUT_MS || 20000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(`${base}${path}`, {
        ...options, signal: controller.signal, cache: 'no-store',
        headers: { Accept:'application/json', ...(options.body ? { 'Content-Type':'application/json' } : {}), ...options.headers }
      });
      const raw = await response.text();
      let data = null;
      if (raw) {
        try { data = JSON.parse(raw); }
        catch { throw new Error(`Сервер вернул некорректный ответ (${response.status}). Попробуйте обновить страницу.`); }
      }
      if (!response.ok || data?.success === false || data?.error) {
        throw new Error(data?.message || (typeof data?.error === 'string' ? data.error : `Ошибка сервера (${response.status}).`));
      }
      return data?.data ?? data;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Сервер не ответил вовремя. Проверьте результат перед повторной отправкой.');
      if (error instanceof TypeError) throw new Error('Нет связи с сервером. Проверьте подключение и обновите страницу.');
      throw error;
    } finally { clearTimeout(timer); }
  };
  const json = (method, body) => ({ method, body: JSON.stringify(body) });
  const aiTimeout = () => window.API_TIMEOUT_MS || 120000;
  // Browsers may disable storage; this must not prevent API operations.
  const memory = new Map();
  const storage = {
    get(name) { try { return localStorage.getItem(`aiSana.${name}`) ?? memory.get(name) ?? null; } catch { return memory.get(name) ?? null; } },
    set(name, value) { memory.set(name, String(value)); try { localStorage.setItem(`aiSana.${name}`, String(value)); } catch {} },
    remove(name) { memory.delete(name); try { localStorage.removeItem(`aiSana.${name}`); } catch {} }
  };
  window.SanaAPI = {
    createTask: raw_description => request('/tasks.php', json('POST', { raw_description })),
    getTask: id => request(`/tasks.php?id=${encodeURIComponent(id)}`),
    getQuestions: task_id => request('/cards.php', json('POST', { action:'questions', task_id }), aiTimeout()),
    createCard: (task_id, answers = {}) => request('/cards.php', json('POST', { action:'build', task_id, answers }), aiTimeout()),
    updateCardField: payload => request('/cards.php', json('PATCH', payload)),
    getCard: id => request(`/cards.php?id=${encodeURIComponent(id)}`),
    publishCard: card_id => request('/publish.php', json('PATCH', { card_id, published:true, confirmed:true })),
    getCatalog: filters => request(`/catalog.php?${new URLSearchParams({ sort:'rating', ...(filters || {}) })}`),
    getTeams: () => request('/teams.php'),
    getTeam: id => request(`/teams.php?id=${encodeURIComponent(id)}`),
    createTeam: payload => request('/teams.php', json('POST', payload)),
    updateTeam: (id, payload) => request('/teams.php', json('PATCH', { id, ...payload })),
    createProposal: payload => request('/proposals.php', json('POST', payload)),
    getProposalsForCard: card_id => request(`/proposals.php?card_id=${encodeURIComponent(card_id)}`),
    getProposalsForTeam: team_id => request(`/proposals.php?team_id=${encodeURIComponent(team_id)}`),
    chooseProposal: (proposal_id, decision = 'accepted') => request('/choose.php', json('PATCH', { proposal_id, decision })),
    saveId: storage.set, getId: storage.get, clearId: storage.remove,
    saveDraft(name, value) { storage.set(`draft.${name}`, JSON.stringify(value)); },
    getDraft(name, fallback = null) { try { return JSON.parse(storage.get(`draft.${name}`)) ?? fallback; } catch { return fallback; } },
    clearDraft(name) { storage.remove(`draft.${name}`); }
  };
})();
