import { useMemo, useState } from 'react'
import DRESSES from '../data/dresses'
import DressCard from './DressCard'

const CHIPS = ['All', 'Long gowns', 'Short dresses', 'Floral', 'Prints', 'Lace', 'Solid']

export default function Collection({ query }) {
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q ? DRESSES : DRESSES.filter((d) => d.section === 'summer')
    let L = pool.filter(
      (d) => (cat === 'All' || d.category === cat || d.type === cat) &&
        `${d.name} ${d.category} ${d.type}`.toLowerCase().includes(q)
    )
    if (sort) L = [...L].sort((a, b) => (sort === 'a' ? a.price - b.price : b.price - a.price))
    return L
  }, [cat, sort, query])
  const ids = list.map((d) => d.id)

  return (
    <section id="shop">
      <h2>Summer dresses</h2>
      <p className="sub">Flowing maxis and gowns in exclusive prints, florals, lace and classic cuts. Tap a photo to see it larger.</p>
      <div className="bar">
        <div className="chips">
          {CHIPS.map((c) => (
            <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="">Featured</option>
          <option value="a">Price: low to high</option>
          <option value="d">Price: high to low</option>
        </select>
        <div className="sub" style={{ width: '100%', margin: 0 }}>{list.length} dresses</div>
      </div>
      <div className="grid">
        {list.length ? list.map((d) => <DressCard key={d.id} d={d} list={ids} />)
          : <p className="empty">No dress matches that. Try “floral”, “lace” or “gown”.</p>}
      </div>
    </section>
  )
}
