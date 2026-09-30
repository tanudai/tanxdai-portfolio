// Lists visible text rendered below the readable minimum (12px). Returns 'ok' or "size:selector 'sample'" entries.
(() => {
  const MIN = 12;
  const seen = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode, el = node.parentElement;
    if (!node.textContent.trim() || !el || el.closest('[aria-hidden=true], .sr-only, [data-decorative], dialog:not([open])')) continue;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height || getComputedStyle(el).visibility === 'hidden') continue;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size >= MIN) continue;
    const key = `${size}px ${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`;
    if (!seen.has(key)) seen.set(key, node.textContent.trim().slice(0, 18));
  }
  return [...seen].map(([key, sample]) => `${key} '${sample}'`).join(' | ') || 'ok';
})()
