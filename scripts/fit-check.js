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
  // Open dialogs and popovers clip (overflow hidden) rather than scroll, so check they fit on screen and cut nothing off.
  const clipped = [...document.querySelectorAll('.project-dialog[open], .service-expanded, #contact-dialog[open], :popover-open')].filter(box => {
    const r = box.getBoundingClientRect();
    if (r.top < -1 || r.left < -1 || r.bottom > innerHeight + 1 || r.right > innerWidth + 1) return true;
    return [...box.querySelectorAll('*')].some(child => {
      if (child.closest('[data-decorative], .film-screen, .sr-only, .film-sr')) return false;
      const b = child.getBoundingClientRect();
      return b.height && (b.bottom > r.bottom + 1 || b.right > r.right + 1);
    });
  }).map(box => `clipped:${box.id || box.className.toString().split(' ')[0]}`);
  const page = document.documentElement.scrollHeight > innerHeight + 1 ? ['page scrolls'] : [];
  return [...escaped, ...scrolls, ...clipped, ...page].join(', ') || 'ok';
})()
