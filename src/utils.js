export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export const money = (n) => '₹' + n.toLocaleString('en-IN')

// Makes a copy of the dress photo fly into the bag icon
export function flyTo(src, targetSel = '#bag-btn') {
  const t = document.querySelector(targetSel)
  if (!src || !t || !src.animate) return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = src.getBoundingClientRect()
  const b = t.getBoundingClientRect()
  const f = src.cloneNode()
  Object.assign(f.style, {
    position: 'fixed', left: r.left + 'px', top: r.top + 'px',
    width: r.width + 'px', height: r.height + 'px', zIndex: 90,
    pointerEvents: 'none', margin: 0, objectFit: 'cover', transform: 'none'
  })
  document.body.appendChild(f)
  const dx = b.left + b.width / 2 - r.left - r.width / 2
  const dy = b.top + b.height / 2 - r.top - r.height / 2
  f.animate(
    [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.05)`, opacity: 0.3 }],
    { duration: 800, easing: 'cubic-bezier(.6,0,.8,.5)' }
  ).onfinish = () => f.remove()
}
