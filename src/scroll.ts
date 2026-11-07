type ScrollListener = (scrollY: number) => void

const listeners = new Set<ScrollListener>()
let listening = false

function notifyScroll() {
  const scrollY = window.scrollY
  listeners.forEach(listener => listener(scrollY))
}

export function getScrollPosition() {
  return window.scrollY
}

export function subscribeToScroll(listener: ScrollListener) {
  listeners.add(listener)

  if (!listening) {
    window.addEventListener('scroll', notifyScroll, { passive: true })
    listening = true
  }

  listener(getScrollPosition())

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && listening) {
      window.removeEventListener('scroll', notifyScroll)
      listening = false
    }
  }
}
