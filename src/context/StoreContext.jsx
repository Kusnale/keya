import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import DRESSES from '../data/dresses'
import { flyTo } from '../utils'

const Ctx = createContext(null)

// Sample reviews so the wall is not empty. Replace them with real ones when you have them.
const SAMPLES = [
  { id: 's1', name: 'Ananya', city: 'Pune', rating: 5, dress: 'Midnight Fern Maxi', text: 'The print looks even better in person, and the fabric is light.' },
  { id: 's2', name: 'Riya', city: 'Mumbai', rating: 5, dress: 'Ivory Lace Mermaid Gown', text: 'Fits true to size. I wore it to a wedding and got compliments all night.' },
  { id: 's3', name: 'Meera', city: 'Nashik', rating: 4, dress: 'Wisteria Gown', text: 'Beautiful gown for the price. Delivery was quick.' },
  { id: 's4', name: 'Sana', city: 'Hyderabad', rating: 5, dress: 'Sage Satin Halter Gown', text: 'The satin drapes so well. Easily the most elegant thing in my wardrobe.' },
  { id: 's5', name: 'Kavya', city: 'Bengaluru', rating: 5, dress: 'Wildflower Sundress', text: 'Perfect for hot afternoons. Light, breathable and the colours are lovely.' },
  { id: 's6', name: 'Isha', city: 'Delhi', rating: 4, dress: 'Garnet Lace Corset Mini', text: 'Gorgeous lace detail. I sized up and it fit perfectly.' },
  { id: 's7', name: 'Tanvi', city: 'Pune', rating: 5, dress: 'Petal Lace Gown', text: 'It looks far more expensive than it is. Packed beautifully too.' },
  { id: 's8', name: 'Aditi', city: 'Jaipur', rating: 5, dress: 'Peony Asymmetric Gown', text: 'I wore it to a birthday dinner. The floral print is dreamy.' },
  { id: 's9', name: 'Nisha', city: 'Chennai', rating: 4, dress: 'Delft Floral Midi', text: 'Comfortable all day and the fabric does not wrinkle much.' },
  { id: 's10', name: 'Pooja', city: 'Kolkata', rating: 5, dress: 'Ivory Ruffle Gown', text: 'The ruffles move beautifully when you walk. I loved it.' },
  { id: 's11', name: 'Simran', city: 'Chandigarh', rating: 5, dress: 'Noir Leaf Maxi', text: 'Such a classy print. I have already ordered a second one.' },
  { id: 's12', name: 'Divya', city: 'Surat', rating: 4, dress: 'Rosewater Halter Maxi', text: 'Lovely flow and a flattering cut. Delivery took three days.' }
].map((r) => ({ ...r, verified: true }))

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v === null || v === undefined ? fallback : v
  } catch (e) {
    return fallback
  }
}

// panel: null | 'bag' | 'wish' | 'checkout'      quick: null | { id, list }
// ordered: ids of dresses this customer has ordered (unlocks the review form)
const makeInit = () => ({
  cart: {}, wish: [], panel: null, size: 'M', quick: null, toast: '',
  ordered: load('keya-ordered', []),
  buyer: load('keya-buyer', ''),
  reviews: [...load('keya-reviews', []), ...SAMPLES]
})

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const k = `${a.id}|${s.size}`
      return { ...s, cart: { ...s.cart, [k]: (s.cart[k] || 0) + 1 } }
    }
    case 'qty': {
      const c = { ...s.cart }
      const n = (c[a.key] || 0) + a.d
      if (n < 1) delete c[a.key]
      else c[a.key] = n
      return { ...s, cart: c }
    }
    case 'wish':
      return { ...s, wish: s.wish.includes(a.id) ? s.wish.filter((x) => x !== a.id) : [...s.wish, a.id] }
    case 'size': return { ...s, size: a.size }
    case 'panel': return { ...s, panel: a.panel }
    case 'quick': return { ...s, quick: a.quick }
    case 'toast': return { ...s, toast: a.msg }
    case 'clear': return { ...s, cart: {} }
    case 'order': return { ...s, ordered: [...new Set([...s.ordered, ...a.ids])], buyer: a.name || s.buyer }
    case 'review': return { ...s, reviews: [a.review, ...s.reviews] }
    default: return s
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, makeInit)
  const byId = useCallback((id) => DRESSES.find((d) => d.id === id), [])
  const toast = useCallback((msg) => dispatch({ type: 'toast', msg }), [])

  // remember orders and the customer's own reviews in this browser
  useEffect(() => {
    try {
      localStorage.setItem('keya-ordered', JSON.stringify(state.ordered))
      localStorage.setItem('keya-buyer', JSON.stringify(state.buyer))
      localStorage.setItem('keya-reviews', JSON.stringify(state.reviews.filter((r) => r.mine)))
    } catch (e) { /* storage not available */ }
  }, [state.ordered, state.buyer, state.reviews])

  const add = useCallback((id, el) => {
    dispatch({ type: 'add', id })
    flyTo(el)
    toast(`Added to bag · size ${state.size}`)
  }, [state.size, toast])

  const toggleWish = useCallback((id) => {
    toast(state.wish.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist')
    dispatch({ type: 'wish', id })
  }, [state.wish, toast])

  const cartLines = useMemo(
    () => Object.entries(state.cart).map(([key, qty]) => {
      const [id, size] = key.split('|')
      return { key, qty, size, dress: byId(Number(id)) }
    }),
    [state.cart, byId]
  )
  const cartCount = cartLines.reduce((t, l) => t + l.qty, 0)
  const cartTotal = cartLines.reduce((t, l) => t + l.qty * l.dress.price, 0)

  const value = {
    state, dispatch, byId, toast, add, toggleWish, cartLines, cartCount, cartTotal,
    openPanel: (panel) => dispatch({ type: 'panel', panel }),
    closePanel: () => dispatch({ type: 'panel', panel: null }),
    openQuick: (id, list) => dispatch({ type: 'quick', quick: { id, list } }),
    closeQuick: () => dispatch({ type: 'quick', quick: null })
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
