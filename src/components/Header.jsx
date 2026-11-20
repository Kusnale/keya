import { useState } from 'react'
import { useStore } from '../context/StoreContext'

export default function Header({ query, setQuery }) {
  const { state, cartCount, openPanel } = useStore()
  const [searching, setSearching] = useState(false)
  return (
    <>
      <header>
        <nav>
          <a href="#top">Home</a>
          <a href="#shop">Shop</a>
          <a href="#drop">New drop</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="logo">KEYA</div>
        <div className="icons">
          <button className="ib" aria-label="Search" onClick={() => setSearching((v) => !v)}>⌕</button>
          <button className="ib" id="wish-btn" aria-label="Open wishlist" onClick={() => openPanel('wish')}>
            ♡<span className="badge">{state.wish.length}</span>
          </button>
          <button className="ib" id="bag-btn" aria-label="Open bag" onClick={() => openPanel('bag')}>
            🛍<span className="badge">{cartCount}</span>
          </button>
        </div>
      </header>
      <div className={'sbox' + (searching ? ' on' : '')}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            document.getElementById('shop')?.scrollIntoView()
          }}
          type="search"
          placeholder="Search floral, lace, gown, mini…"
          aria-label="Search dresses"
        />
      </div>
    </>
  )
}
