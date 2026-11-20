import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { money, SIZES } from '../utils'

export default function DressModal() {
  const { state, dispatch, byId, add, toggleWish, openQuick, closeQuick } = useStore()
  const q = state.quick
  const d = q ? byId(q.id) : null
  const k = q ? q.list.indexOf(q.id) : -1
  const n = q ? q.list.length : 0
  const nav = k >= 0 && n > 1
  const go = (s) => openQuick(q.list[(k + s + n) % n], q.list)

  useEffect(() => {
    if (!q) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeQuick()
      if (nav && e.key === 'ArrowRight') go(1)
      if (nav && e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!d) return null
  const liked = state.wish.includes(d.id)

  return (
    <div id="modal" className="on" onClick={(e) => e.target.id === 'modal' && closeQuick()}>
      <div className="mb" role="dialog" aria-modal="true" aria-label={d.name}>
        <button className="ib mx" onClick={closeQuick} aria-label="Close">✕</button>
        <div className="mimg">
          <img src={d.img} alt={d.name} />
          {nav && <button className="ar l" onClick={() => go(-1)} aria-label="Previous dress">‹</button>}
          {nav && <button className="ar r" onClick={() => go(1)} aria-label="Next dress">›</button>}
        </div>
        <div>
          <small className="eyebrow">{d.category} / {d.type}</small>
          <h3>{d.name}</h3>
          <p className="muted">{d.desc}</p>
          <div className="price big">{money(d.price)}{d.oldPrice && <s>{money(d.oldPrice)}</s>}</div>
          <div className="sizes" style={{ marginTop: 18 }}>
            {SIZES.map((s) => (
              <button key={s} className={s === state.size ? 'on' : ''} onClick={() => dispatch({ type: 'size', size: s })}>{s}</button>
            ))}
          </div>
          <div className="row">
            <button className="pill" onClick={(e) => add(d.id, e.currentTarget.closest('.mb').querySelector('.mimg img'))}>Add to bag<i>+</i></button>
            <button className="lnk" onClick={() => toggleWish(d.id)}>{liked ? '♥ Saved' : '♡ Save'}</button>
          </div>
          <p className="muted small">True to size. Free returns within 30 days.</p>
        </div>
      </div>
    </div>
  )
}
