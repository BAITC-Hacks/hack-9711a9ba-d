
(() => {
  const normalize = (level, score) => {
    if (score >= 90) return { key:'priority', label:'Приоритет' };
    if (score >= 70) return { key:'ready', label:'Готово' };
    if (score >= 40) return { key:'work', label:'В работе' };
    return { key:'project', label:'Проект' };
  };
  window.SanaRating = {
    level:normalize,
    render(target, rating, readinessLevel, compact = false) {
      if (!target) return;
      const score = Math.max(0, Math.min(100, Number(rating) || 0));
      const level = normalize(readinessLevel, score);
      target.innerHTML = `<div class="rating-indicator ${compact?'compact':''} level-${level.key}">
        <div class="rating-ring" role="progressbar" aria-label="Готовность задачи" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${score}" style="--rating:${score*3.6}deg"><span>${score}<small>/100</small></span></div>
        <span class="rating-level-badge">${level.label}</span>
        ${compact ? '' : `<div class="rating-progress-track"><i style="width:${score}%"></i></div>`}
      </div>`;
    }
  };
})();
