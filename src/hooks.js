import { useEffect, useState } from 'react'

// Turns a 3D ring by one dress every `ms` milliseconds
export function useAutoTurn(ms = 1500, paused = false) {
  const [turn, setTurn] = useState(0)
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setTurn((v) => v + 1), ms)
    return () => clearInterval(t)
  }, [ms, paused])
  return [turn, setTurn]
}
