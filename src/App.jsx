import { useState } from 'react'
import Intro from './components/Intro'
import Header from './components/Header'
import Hero3D from './components/Hero3D'
import Collection from './components/Collection'
import Launch from './components/Launch'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import Drawer from './components/Drawer'
import DressModal from './components/DressModal'
import Checkout from './components/Checkout'
import Toast from './components/Toast'
import DRESSES from './data/dresses'
import { money } from './utils'

const PRICES = DRESSES.map((d) => d.price)

export default function App() {
  const [query, setQuery] = useState('')
  return (
    <>
      <Intro />
      <Header query={query} setQuery={setQuery} />
      <main id="top">
        <Hero3D />
        <div className="strip">
          <span>Dresses from {money(Math.min(...PRICES))} to {money(Math.max(...PRICES))}</span>
          <span>Free shipping over ₹999</span>
          <span>30-day easy returns</span>
        </div>
        <Collection query={query} />
        <Launch />
        <Reviews />
      </main>
      <Footer />
      <Drawer />
      <DressModal />
      <Checkout />
      <Toast />
    </>
  )
}
