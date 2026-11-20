import { useState } from 'react'

const mod = (x, m) => ((x % m) + m) % m

// A rotating 3D ring. It has at most `slots` panels; when there are more dresses than
// slots, the panel at the back swaps to the next dress, so every dress gets its turn.
export default function Ring3D({ items, turn, setTurn, dark = false, slots = 12 }) {
  const M = items.length
  const n = Math.min(slots, M)
  const step = 360 / n
  const a = mod(turn, n)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const w = typeof window !== 'undefined' && window.innerWidth <= 900 ? 170 : 240
  const R = Math.round((w / 2 / Math.tan(Math.PI / n)) * 1.12)

  // how many steps panel k is from the front, in the range -n/2 .. n/2-1
  const off = (k) => { const d = mod(k - a, n); return d >= n / 2 ? d - n : d }
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({ x: -((e.clientY - r.top) / r.height - 0.5) * 8, y: ((e.clientX - r.left) / r.width - 0.5) * 14 })
  }

  return (
    <div className={'stage' + (dark ? ' dark' : '')} style={{ '--R': R + 'px' }} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="ring" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${-turn * step + tilt.y}deg)` }}>
        {Array.from({ length: n }, (_, k) => {
          const it = items[mod(turn + off(k), M)]
          return (
            <button
              key={k}
              className={'panel' + (k === a ? ' on' : '')}
              style={{ transform: `rotateY(${k * step}deg) translateZ(var(--R))` }}
              onClick={() => setTurn((t) => t + off(k))}
              aria-label={`Show ${it.name}`}
            >
              <img src={it.img} alt={it.name} />
            </button>
          )
        })}
      </div>
      <div className="hnav">
        <button onClick={() => setTurn((t) => t - 1)} aria-label="Previous dress">‹</button>
        <button onClick={() => setTurn((t) => t + 1)} aria-label="Next dress">›</button>
      </div>
    </div>
  )
}
