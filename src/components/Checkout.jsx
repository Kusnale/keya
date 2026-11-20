import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../utils'

export default function Checkout() {
  const { state, dispatch, cartLines, cartTotal, toast, closePanel } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [pay, setPay] = useState('UPI')
  const [done, setDone] = useState(false)
  if (state.panel !== 'checkout') return null

  const ship = cartTotal > 999 ? 0 : 99
  const close = () => { setDone(false); closePanel() }
  const place = () => {
    if (!name.trim() || !phone.trim()) return toast('Please enter your name and mobile number')
    dispatch({ type: 'order', ids: cartLines.map((l) => l.dress.id), name: name.trim() })
    dispatch({ type: 'clear' })
    setDone(true)
  }

  return (
    <div id="co" className="on">
      <button className="lnk" onClick={close}>← Back to shop</button>
      {done ? (
        <div className="thanks">
          <h2>Thank you</h2>
          <p className="sub">Your order is placed, and you can now leave a review below. This is a demo, so no payment was taken.</p>
          <button className="pill" onClick={close}>Keep shopping<i>→</i></button>
        </div>
      ) : (
        <div className="cg">
          <div>
            <h2>Checkout</h2>
            <div className="fld"><b>Contact</b>
              <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <input placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
            </div>
            <div className="fld"><b>Delivery</b>
              <input placeholder="Address" /><input placeholder="City" /><input placeholder="PIN code" inputMode="numeric" />
            </div>
            <b>Payment</b>
            <div className="pay">
              {['UPI', 'Card', 'Cash on delivery'].map((x) => (
                <button key={x} className={x === pay ? 'on' : ''} onClick={() => setPay(x)}>{x}</button>
              ))}
            </div>
            <button className="go" onClick={place}>Place order · {money(cartTotal + ship)}</button>
          </div>
          <div className="sm">
            <b>Order summary</b>
            {cartLines.map((l) => (
              <div className="srow" key={l.key}>
                <span>{l.dress.name} × {l.qty}<br /><small>Size {l.size}</small></span>
                <span>{money(l.dress.price * l.qty)}</span>
              </div>
            ))}
            <hr />
            <div className="srow"><span>Shipping</span><span>{ship ? money(ship) : 'Free'}</span></div>
            <div className="srow big"><span>Total</span><span>{money(cartTotal + ship)}</span></div>
          </div>
        </div>
      )}
    </div>
  )
}
