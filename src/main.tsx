import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Lenis from 'lenis'
import './index.css'
import App from './App.tsx'

function SmoothScroll() {
  const location = useLocation()

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    let frame = 0

    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lenis?.destroy()
      lenis = undefined
    }

    const start = () => {
      if (motionPreference.matches || lenis) return

      lenis = new Lenis({
        duration: 1.05,
        easing: (progress) => Math.min(1, 1.001 - 2 ** (-10 * progress)),
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -100 },
      })

      const animate = (time: number) => {
        lenis?.raf(time)
        frame = requestAnimationFrame(animate)
      }

      frame = requestAnimationFrame(animate)
    }

    const updateMotionPreference = () => {
      if (motionPreference.matches) stop()
      else start()
    }

    updateMotionPreference()
    motionPreference.addEventListener('change', updateMotionPreference)

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference)
      stop()
    }
  }, [])

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SmoothScroll />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
