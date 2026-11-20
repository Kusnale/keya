import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAutoTurn } from '../hooks'
import { money, SIZES } from '../utils'
import Ring3D from './Ring3D'

const FEAT = [22, 1, 78, 58, 46, 40, 76, 107]

export default function Hero3D() {
  const { state, dispatch, byId, add, openQuick } = useStore()
  const items = FEAT.map(byId)
  const [hover, setHover] = useState(false)           // pause while you use the buttons
  const [turn, setTurn] = useAutoTurn(1500, hover || !!state.quick)
  const d = items[((turn % items.length) + items.length) % items.length]

  return (
    <section className="hero">
      <div className="ghost">KEYA</div>
      <div className="hero-text" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="crumb">Summer 2026 / {d.category}</div>
        <h1>{d.name}</h1>
        <p>{d.desc}</p>
        <div className="sizes">
          {SIZES.map((s) => (
            <button key={s} className={s === state.size ? 'on' : ''} onClick={() => dispatch({ type: 'size', size: s })}>{s}</button>
          ))}
        </div>
        <div className="row">
          <button className="pill" onClick={(e) => add(d.id, e.currentTarget.closest('.hero').querySelector('.panel.on img'))}>
            <span>Add to bag · {money(d.price)}</span><i>+</i>
          </button>
          <button className="lnk" onClick={() => openQuick(d.id, FEAT)}>View larger</button>
        </div>
      </div>
      <Ring3D items={items} turn={turn} setTurn={setTurn} />
    </section>
  )
}
