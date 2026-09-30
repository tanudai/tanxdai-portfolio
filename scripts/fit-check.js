// Returns 'ok', or what broke: card content escaping its card, or anything that scrolls (the owner's hard rule).
(() => {
  const escaped = [...document.querySelectorAll('.service-tile,.personal-bento>*,.react-card:not([aria-hidden=true])')].filter(card => {
    const box = card.getBoundingClientRect();
    return [...card.querySelectorAll('*')].some(child => {
      if (child.closest('dialog, [data-decorative]')) return false; // top-layer dialogs and masked decoration are not content
      const b = child.getBoundingClientRect();
      return b.height && (b.bottom > box.bottom + 1 || b.right > box.right + 1);
    });
  }).map(card => card.className.split(' ')[0]);
  const scrolls = [...document.querySelectorAll('*')].filter(el => {
    if (!el.getClientRects().length) return false;
    const { overflowX, overflowY } = getComputedStyle(el);
    return (/auto|scroll/.test(overflowY) && el.scrollHeight > el.clientHeight + 1) || (/auto|scroll/.test(overflowX) && el.scrollWidth > el.clientWidth + 1);
  }).map(el => `scrolls:${el.id || el.className.toString().split(' ')[0] || el.tagName}`);
  const page = document.documentElement.scrollHeight > innerHeight + 1 ? ['page scrolls'] : [];
  return [...escaped, ...scrolls, ...page].join(', ') || 'ok';
})()
