import { useEffect, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useAutoTurn } from '../hooks'
import DRESSES from '../data/dresses'
import { money } from '../utils'
import Ring3D from './Ring3D'

// New launch: every party dress, cycling through a 3D ring like the hero
const PARTY = DRESSES.filter((d) => d.section === 'party').map((d) => d.id)

export default function Launch() {
  const { state, byId, add, openQuick, toast } = useStore()
  const items = PARTY.map(byId)
  const [hover, setHover] = useState(false)
  const [turn, setTurn] = useAutoTurn(1500, hover || !!state.quick)
  const d = items[((turn % items.length) + items.length) % items.length]

  const [target] = useState(() => Date.now() + 9.5 * 864e5)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((target - now) / 1000))
  const parts = [['Days', s / 86400], ['Hours', (s % 86400) / 3600], ['Min', (s % 3600) / 60], ['Sec', s % 60]]

  return (
    <section className="launch" id="drop">
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="crumb light">New launch</div>
        <h2>The party edit</h2>
        <p className="sub">{PARTY.length} new party dresses, arriving in small runs. Be first to wear them.</p>
        <div className="cd">
          {parts.map(([l, n]) => (<div key={l}>{String(Math.floor(n)).padStart(2, '0')}<span>{l}</span></div>))}
        </div>
        <div className="now"><small>Now showing</small><b>{d.name}</b></div>
        <div className="row">
          <button className="pill" onClick={(e) => add(d.id, e.currentTarget.closest('.launch').querySelector('.panel.on img'))}>
            <span>Add to bag · {money(d.price)}</span><i>+</i>
          </button>
          <button className="lnk" onClick={() => openQuick(d.id, PARTY)}>View larger</button>
          <button className="lnk" onClick={() => toast('You’re on the list. We’ll email you before the launch.')}>Notify me</button>
        </div>
      </div>
      <Ring3D items={items} turn={turn} setTurn={setTurn} dark slots={12} />
    </section>
  )
}
