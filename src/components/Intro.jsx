import { useEffect, useState } from 'react'

export default function Intro() {
  const [off, setOff] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setOff(true), 1700)
    return () => clearTimeout(t)
  }, [])
  return (
    <div id="intro" className={off ? 'off' : ''}>
      <b>KEYA</b>
      <i />
    </div>
  )
}
