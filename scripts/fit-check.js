[...document.querySelectorAll('.service-tile,.personal-bento>*,.react-card:not([aria-hidden=true])')].filter(card => {
  const box = card.getBoundingClientRect();
  return [...card.querySelectorAll('*')].some(child => {
    const b = child.getBoundingClientRect();
    return b.height && (b.bottom > box.bottom + 1 || b.right > box.right + 1);
  });
}).map(card => card.className.split(' ')[0])
  .concat(document.documentElement.scrollHeight > innerHeight + 1 ? ['page scrolls'] : [])
  .join(', ') || 'ok'
