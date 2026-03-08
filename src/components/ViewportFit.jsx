import { useLayoutEffect, useRef, useState } from 'react'

const EPSILON = 0.001

export default function ViewportFit({ children, fitKey }) {
  const frameRef = useRef(null)
  const contentRef = useRef(null)
  const [metrics, setMetrics] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    ready: false,
  })

  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current

    if (!frame || !content) return

    let rafId = 0

    const recalc = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const frameWidth = frame.clientWidth
        const frameHeight = frame.clientHeight
        const contentWidth = content.scrollWidth
        const contentHeight = content.scrollHeight

        if (!frameWidth || !frameHeight || !contentWidth || !contentHeight) return

        const scale = Math.min(frameWidth / contentWidth, frameHeight / contentHeight, 1)
        const scaledWidth = contentWidth * scale

        const next = {
          scale,
          offsetX: (frameWidth - scaledWidth) / 2,
          offsetY: 0,
          ready: true,
        }

        setMetrics(prev => {
          const unchanged =
            Math.abs(prev.scale - next.scale) < EPSILON &&
            Math.abs(prev.offsetX - next.offsetX) < 0.5 &&
            Math.abs(prev.offsetY - next.offsetY) < 0.5 &&
            prev.ready === next.ready

          return unchanged ? prev : next
        })
      })
    }

    recalc()

    const observer = new ResizeObserver(recalc)
    observer.observe(frame)
    observer.observe(content)
    window.addEventListener('resize', recalc)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', recalc)
    }
  }, [fitKey])

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden">
      <div
        ref={contentRef}
        className="absolute left-0 top-0 w-full origin-top-left"
        style={{
          transform: `translate3d(${metrics.offsetX}px, ${metrics.offsetY}px, 0) scale(${metrics.scale})`,
          visibility: metrics.ready ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
