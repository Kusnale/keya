import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../utils'

// One slide-in panel that shows either the bag or the wishlist
export default function Drawer() {
  const { state, dispatch, byId, cartLines, cartTotal, add, toggleWish, openPanel, closePanel, toast } = useStore()
  const isWish = state.panel === 'wish'
  const open = state.panel === 'bag' || isWish

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closePanel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closePanel])

  const wishDresses = state.wish.map(byId)

  const addAll = () => {
    wishDresses.forEach((d) => dispatch({ type: 'add', id: d.id }))
    toast(`Added ${wishDresses.length} to bag · size ${state.size}`)
    openPanel('bag')
  }

  return (
    <>
      <div className={'shade' + (open ? ' on' : '')} onClick={closePanel} />
      <aside className={'drawer' + (open ? ' on' : '')} aria-label={isWish ? 'Wishlist' : 'Bag'}>
        <div className="dh">
          {isWish ? 'Your wishlist' : 'Your bag'}
          <button className="ib" onClick={closePanel} aria-label="Close">✕</button>
        </div>
        <div className="tabs">
          <button className={!isWish ? 'on' : ''} onClick={() => openPanel('bag')}>Bag ({cartLines.length})</button>
          <button className={isWish ? 'on' : ''} onClick={() => openPanel('wish')}>Wishlist ({state.wish.length})</button>
        </div>

        <div className="items">
          {isWish ? (
            wishDresses.length ? wishDresses.map((d) => (
              <div className="it" key={d.id}>
                <img src={d.img} alt="" />
                <div>
                  {d.name}
                  <small>{d.category} · {money(d.price)}</small>
                  <span className="mini">
                    <button onClick={(e) => add(d.id, e.currentTarget.closest('.it').querySelector('img'))}>Add to bag</button>
                    <button onClick={() => toggleWish(d.id)}>Remove</button>
                  </span>
                </div>
              </div>
            )) : <p className="empty">Nothing saved yet. Tap ♡ on a dress you love.</p>
          ) : (
            cartLines.length ? cartLines.map((l) => (
              <div className="it" key={l.key}>
                <img src={l.dress.img} alt="" />
                <div>{l.dress.name}<small>Size {l.size} · {money(l.dress.price)}</small></div>
                <span className="qty">
                  <button onClick={() => dispatch({ type: 'qty', key: l.key, d: -1 })} aria-label="Less">−</button>
                  {l.qty}
                  <button onClick={() => dispatch({ type: 'qty', key: l.key, d: 1 })} aria-label="More">+</button>
                </span>
              </div>
            )) : <p className="empty">Your bag is empty. Add a dress you love.</p>
          )}
        </div>

        {isWish ? (
          <button className="go" disabled={!wishDresses.length} onClick={addAll}>Add all to bag</button>
        ) : (
          <>
            <div className="total"><span>Total</span><span>{money(cartTotal)}</span></div>
            <button className="go" onClick={() => (cartLines.length ? openPanel('checkout') : toast('Add a dress first'))}>Checkout</button>
          </>
        )}
      </aside>
    </>
  )
}
