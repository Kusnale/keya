import { useStore } from '../context/StoreContext'
import { money } from '../utils'

export default function DressCard({ d, list }) {
  const { state, add, toggleWish, openQuick } = useStore()
  const liked = state.wish.includes(d.id)

  return (
    <article className="card">
      <div
        className="ph"
        role="button"
        tabIndex={0}
        aria-label={`Open ${d.name}`}
        onClick={() => openQuick(d.id, list)}
        onKeyDown={(e) => e.key === 'Enter' && openQuick(d.id, list)}
      >
        {d.oldPrice && <span className="tag">Sale</span>}
        <button
          className={'heart' + (liked ? ' on' : '')}
          aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={(e) => { e.stopPropagation(); toggleWish(d.id) }}
        >{liked ? '♥' : '♡'}</button>
        <img src={d.img} alt={d.name} loading="lazy" />
      </div>
      <div className="info">
        <small>{d.category} / {d.type}</small>
        <h3>{d.name}</h3>
        <div className="row2">
          <span className="price">{money(d.price)}{d.oldPrice && <s>{money(d.oldPrice)}</s>}</span>
          <button className="addb" onClick={(e) => add(d.id, e.currentTarget.closest('.card').querySelector('img'))}>Add to bag</button>
        </div>
      </div>
    </article>
  )
}
