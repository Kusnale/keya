import { useState } from 'react'
import { useStore } from '../context/StoreContext'

const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

function ReviewBox({ r, dup }) {
  return (
    <article className={'rev' + (dup ? ' dup' : '')} aria-hidden={dup ? 'true' : undefined}>
      <div className="stars">{stars(r.rating)}</div>
      <p>{r.text}</p>
      <div className="who">
        <b>{r.name}</b>{r.city ? `, ${r.city}` : ''}
        {r.dress && <small>on {r.dress}</small>}
        {r.verified && <span className="vb">Verified buyer</span>}
      </div>
    </article>
  )
}

// Only customers who have placed an order can write a review
function ReviewForm() {
  const { state, byId, dispatch, toast } = useStore()
  const pending = state.ordered.filter((id) => byId(id) && !state.reviews.some((r) => r.dressId === id))
  const [dressId, setDressId] = useState(null)
  const [name, setName] = useState(state.buyer)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  if (!state.ordered.length) {
    return (
      <div className="lock">
        <b>Want to leave a review?</b>
        <p>Reviews can only be written by customers who have placed an order. Order a dress and this form will unlock.</p>
        <a className="lnk" href="#shop">Shop dresses</a>
      </div>
    )
  }
  if (!pending.length) {
    return (
      <div className="lock">
        <b>Thank you!</b>
        <p>You have reviewed every dress you ordered. Order another dress to write a new review.</p>
      </div>
    )
  }

  const chosen = pending.includes(dressId) ? dressId : pending[0]
  const submit = () => {
    if (!name.trim()) return toast('Please enter your name')
    if (text.trim().length < 10) return toast('Please write at least a short sentence')
    dispatch({
      type: 'review',
      review: { id: 'u' + Date.now(), name: name.trim(), city: '', rating, text: text.trim(), dress: byId(chosen).name, dressId: chosen, verified: true, mine: true }
    })
    setText('')
    toast('Thank you for your review')
  }

  return (
    <div className="rform">
      <b>Write a review</b>
      <select value={chosen} onChange={(e) => setDressId(Number(e.target.value))} aria-label="Dress you ordered">
        {pending.map((id) => <option key={id} value={id}>{byId(id).name}</option>)}
      </select>
      <div className="starpick" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)}>
            {n <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea rows="4" placeholder="Tell us about the fit, fabric and how you wore it" value={text} onChange={(e) => setText(e.target.value)} />
      <button className="go" onClick={submit}>Post review</button>
    </div>
  )
}

export default function Reviews() {
  const { state } = useStore()
  const all = state.reviews
  const avg = all.reduce((t, r) => t + r.rating, 0) / all.length
  const cols = [0, 1, 2].map((c) => all.filter((_, i) => i % 3 === c))

  return (
    <section id="reviews">
      <h2>Customer reviews</h2>
      <div className="score">
        <b>{avg.toFixed(1)}</b>
        <div><div className="stars">{stars(Math.round(avg))}</div><small className="muted">{all.length} reviews from verified buyers</small></div>
      </div>
      <div className="rev-cols">
        {cols.map((col, c) => (
          <div className={'rev-col' + (c % 2 ? ' down' : '')} key={c}>
            <div className="rev-track">
              {[...col, ...col].map((r, i) => <ReviewBox key={r.id + '-' + i} r={r} dup={i >= col.length} />)}
            </div>
          </div>
        ))}
      </div>
      <ReviewForm />
    </section>
  )
}
