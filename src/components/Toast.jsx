import { useEffect } from 'react'
import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { state, toast } = useStore()
  useEffect(() => {
    if (!state.toast) return
    const t = setTimeout(() => toast(''), 2400)
    return () => clearTimeout(t)
  }, [state.toast, toast])
  return <div id="toast" className={state.toast ? 'on' : ''} role="status">{state.toast}</div>
}
