import { useRef, useEffect, useCallback, useMemo, useState } from 'react'
import { DB } from '../data/threads'
import SearchBar from './SearchBar'

const QUICK_BUTTON_WIDTH = 76

export default function WheelSelector({ sizes, selectedSize, onSelect }) {
  const trackRef = useRef(null)
  const quickGridRef = useRef(null)
  const itemRefs = useRef([])
  const scrollingTimeoutRef = useRef(null)
  const scrollRafRef = useRef(0)
  const isProgrammaticScroll = useRef(false)
  const isUserScrolling = useRef(false)
  const selectedSizeRef = useRef(selectedSize)
  const [quickColumns, setQuickColumns] = useState(4)

  selectedSizeRef.current = selectedSize

  const vibrate = pattern => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern)
    }
  }

  // Triple the array for infinite scrolling
  const infiniteSizes = useMemo(() => [...sizes, ...sizes, ...sizes], [sizes])

  const quickSourceSizes = useMemo(
    () =>
      sizes.filter(sizeStr => {
        const size = Number(sizeStr)
        // Focus on medium and large sizes (starting from M16), as M6-M12 are not needed for quick access
        return Number.isFinite(size) && size >= 16
      }),
    [sizes]
  )

  const quickSizesDisplay = useMemo(
    () => quickSourceSizes.slice(0, quickColumns * 2),
    [quickSourceSizes, quickColumns]
  )

  // Dynamic color coding based on thread size
  const getAccentColor = sizeStr => {
    const num = parseFloat(sizeStr)
    if (num <= 4)
      return {
        glow: 'via-cyan-400',
        text: 'text-cyan-400',
        shadow: 'shadow-[0_8px_32px_rgba(34,211,238,0.15)]',
      }
    if (num >= 14)
      return {
        glow: 'via-amber-500',
        text: 'text-amber-500',
        shadow: 'shadow-[0_8px_32px_rgba(245,158,11,0.15)]',
      }
    return {
      glow: 'via-[#5ee7c2]',
      text: 'text-accent',
      shadow: 'shadow-[0_8px_32px_rgba(94,231,194,0.15)]',
    }
  }

  const colors = getAccentColor(selectedSize)

  // Vanilla JS update for buttery smooth 60fps 3D lens effect
  const updateVisuals = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const trackCenter = track.scrollLeft + track.clientWidth / 2
    const itemWidth = 72 // matching w-[72px]

    let closestIdx = 0
    let minDistance = Infinity

    infiniteSizes.forEach((_, idx) => {
      const item = itemRefs.current[idx]
      if (!item) return
      const itemCenter = item.offsetLeft + item.clientWidth / 2
      const distance = Math.abs(trackCenter - itemCenter)

      // Calculate 3D Lens Effect
      const normalizedDist = Math.min(distance / (itemWidth * 2.5), 1)

      // Scale peaks at 1.25 in center, drops to 0.75 outside
      const scale = 1.3 - normalizedDist * 0.55
      // Opacity drops from 1 to 0.15
      const opacity = 1 - normalizedDist * 0.85
      // Rotate backwards slightly the further away they are (3D drum effect)
      const rotateX = normalizedDist * 40

      item.style.transform = `perspective(300px) rotateX(${rotateX}deg) scale(${scale})`
      item.style.opacity = Math.max(0.1, opacity)

      if (distance < minDistance) {
        minDistance = distance
        closestIdx = idx
      }
    })

    return closestIdx
  }, [infiniteSizes])

  const processScroll = useCallback(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const itemWidth = 72
    const totalWidth = sizes.length * itemWidth

    // Infinite loop jump - ONLY if user is actively scrolling manually (not smooth-scrolling programmatically)
    // because setting track.scrollLeft abruptly cancels any active `behavior: 'smooth'` animation!
    if (!isProgrammaticScroll.current) {
      if (track.scrollLeft < totalWidth * 0.5) {
        track.scrollLeft += totalWidth
      } else if (track.scrollLeft > totalWidth * 1.5) {
        track.scrollLeft -= totalWidth
      }
    }

    const closestIdx = updateVisuals()
    const actualSize = closestIdx === undefined ? undefined : infiniteSizes[closestIdx]

    // Live-Update of the selected Size while scrolling!
    if (actualSize && actualSize !== selectedSize && !isProgrammaticScroll.current) {
      onSelect(actualSize)
    }

    // Reset programmatic and user scroll flags once scrolling stops
    if (scrollingTimeoutRef.current) clearTimeout(scrollingTimeoutRef.current)
    scrollingTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false
      isUserScrolling.current = false
    }, 150)
  }, [infiniteSizes, onSelect, selectedSize, sizes.length, updateVisuals])

  const handleScroll = useCallback(() => {
    if (!isProgrammaticScroll.current) {
      isUserScrolling.current = true
    }
    if (scrollRafRef.current) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0
      processScroll()
    })
  }, [processScroll])

  // Smoother jump when clicking side items
  const handleItemClick = (s, idx) => {
    onSelect(s)
    vibrate(10)
    const item = itemRefs.current[idx]
    if (item && trackRef.current) {
      isProgrammaticScroll.current = true
      trackRef.current.scrollTo({
        left: item.offsetLeft - trackRef.current.clientWidth / 2 + item.clientWidth / 2,
        behavior: 'smooth',
      })
    }
  }

  // When selectedSize changes from Quick Buttons, spin the wheel smoothly
  useEffect(() => {
    if (!trackRef.current) return
    if (isUserScrolling.current) return // Avoid fighting user dragging/scrolling

    // Find index in the middle section to keep it centered
    const idx = sizes.indexOf(selectedSize) + sizes.length
    const item = itemRefs.current[idx]

    if (item) {
      const track = trackRef.current
      const trackCenter = track.scrollLeft + track.clientWidth / 2
      const itemCenter = item.offsetLeft + item.clientWidth / 2

      // Only programmatic scroll if not already centered (avoids fighting dragging)
      if (Math.abs(trackCenter - itemCenter) > 20) {
        isProgrammaticScroll.current = true
        track.scrollTo({
          left: item.offsetLeft - track.clientWidth / 2 + item.clientWidth / 2,
          behavior: 'smooth',
        })
      }
    }
  }, [selectedSize, sizes])

  // Initial Setup
  useEffect(() => {
    // Initial jump to right position without smooth scrolling
    if (trackRef.current) {
      const track = trackRef.current
      const idx = sizes.indexOf(selectedSizeRef.current) + sizes.length
      const item = itemRefs.current[idx]
      if (item) {
        track.scrollLeft = item.offsetLeft - track.clientWidth / 2 + item.clientWidth / 2
      }
    }

    updateVisuals()
    window.addEventListener('resize', updateVisuals)
    return () => {
      window.removeEventListener('resize', updateVisuals)
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current)
      }
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [updateVisuals, sizes])

  useEffect(() => {
    if (!quickGridRef.current) return

    const node = quickGridRef.current

    const updateQuickColumns = () => {
      const maxColumnsFromData = Math.max(1, Math.floor(quickSourceSizes.length / 2))
      const columnsByWidth = Math.max(1, Math.floor(node.clientWidth / QUICK_BUTTON_WIDTH))
      const nextColumns = Math.min(columnsByWidth, maxColumnsFromData)
      setQuickColumns(prev => (prev === nextColumns ? prev : nextColumns))
    }

    updateQuickColumns()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateQuickColumns)
      observer.observe(node)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', updateQuickColumns)
    return () => window.removeEventListener('resize', updateQuickColumns)
  }, [quickSourceSizes.length])

  const handlePrev = () => {
    const idx = sizes.indexOf(selectedSize)
    const prevIdx = (idx - 1 + sizes.length) % sizes.length
    onSelect(sizes[prevIdx])
    vibrate([10, 30, 10])
  }

  const handleNext = () => {
    const idx = sizes.indexOf(selectedSize)
    const nextIdx = (idx + 1) % sizes.length
    onSelect(sizes[nextIdx])
    vibrate([10, 30, 10])
  }

  return (
    <div className="relative flex w-full flex-col items-center overflow-x-hidden overflow-y-visible select-none">
      <div
        className="relative mt-2 h-[92px] w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
      >
        {/* Mechanics "Lens" Marker in the center */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[70px] w-[90px] -translate-x-1/2 -translate-y-1/2">
          <div
            className={`absolute inset-0 rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-[2px] transition-shadow duration-500 ${colors.shadow}`}
          ></div>
          {/* Soft elegant accent glows instead of harsh lines */}
          <div
            className={`absolute inset-x-4 top-0 h-[1.5px] bg-linear-to-r from-transparent ${colors.glow} to-transparent transition-all duration-500 opacity-60`}
          ></div>
          <div
            className={`absolute inset-x-4 bottom-0 h-[1.5px] bg-linear-to-r from-transparent ${colors.glow} to-transparent transition-all duration-500 opacity-60`}
          ></div>
        </div>

        {/* The actual scrolling track */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="relative z-10 flex h-full snap-x snap-mandatory items-center gap-0 overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {infiniteSizes.map((s, i) => {
            const isSelected = s === selectedSize && i >= sizes.length && i < sizes.length * 2
            return (
              <div
                key={`${s}-${i}`}
                ref={el => (itemRefs.current[i] = el)}
                onClick={() => handleItemClick(s, i)}
                className="snap-center shrink-0 w-[72px] flex flex-col items-center justify-center cursor-pointer will-change-transform relative"
                style={{ transformOrigin: 'center center' }}
              >
                <div className="flex items-baseline justify-center gap-0.5 w-full transition-all duration-300">
                  <span
                    className={`font-sans font-bold text-[11px] uppercase tracking-wider ${isSelected ? colors.text : 'text-gray-500'} transition-colors duration-500`}
                  >
                    M
                  </span>
                  <span
                    className={`font-sans font-black tracking-tighter text-[26px] leading-none ${isSelected ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'text-gray-400'} transition-all duration-500`}
                  >
                    {s}
                  </span>
                </div>
                <span
                  className={`font-mono text-[9.5px] -mt-0.5 font-bold tracking-tighter ${isSelected ? 'text-white/70' : 'text-gray-600'} transition-colors duration-500`}
                >
                  {DB[s].iso}
                  {DB[s].din ? `|${DB[s].din}` : ''}
                  {DB[s].hv ? `|${DB[s].hv}` : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Scroll Buttons - Modern Floating Pill */}
      <div className="relative z-50 mb-3 mt-1">
        <div className="flex items-center rounded-full border border-white/10 bg-white/6 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          <button
            onClick={handlePrev}
            disabled={sizes.indexOf(selectedSize) === 0}
            aria-label="Vorherige Größe"
            className="group w-14 h-12 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none active:scale-90"
          >
            <svg
              className="transition-transform duration-150 group-active:-translate-x-1"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="w-px h-4 bg-white/20 mx-1"></div>
          <SearchBar sizes={sizes} onSelect={onSelect} integrated />
          <div className="w-px h-4 bg-white/20 mx-1"></div>
          <button
            onClick={handleNext}
            disabled={sizes.indexOf(selectedSize) === sizes.length - 1}
            aria-label="Nächste Größe"
            className="group flex h-12 w-14 items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/20 disabled:pointer-events-none disabled:opacity-30"
          >
            <svg
              className="transition-transform duration-150 group-active:translate-x-1"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full max-w-xl px-2">
        <div
          ref={quickGridRef}
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${quickColumns}, ${QUICK_BUTTON_WIDTH}px)`,
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          {quickSizesDisplay.map(s => {
            const isActive = s === selectedSize
            const swPrimary = DB[s].iso
            const swSecondary = DB[s].din
            const swHv = DB[s].hv
            const swParts = [swPrimary]
            if (swSecondary) swParts.push(swSecondary)
            if (swHv) swParts.push(swHv)
            const swLabel = swParts.join('|')

            return (
              <button
                key={`quick-${s}`}
                type="button"
                onClick={() => {
                  onSelect(s)
                  vibrate(8)
                }}
                className={`w-full rounded-lg border px-2.5 py-2 text-center leading-tight transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'border-accent/50 bg-accent/14 shadow-[0_0_24px_rgba(94,231,194,0.22)]'
                    : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6'
                }`}
              >
                <div className="font-mono text-[0.86rem] font-black tracking-tight text-white">
                  M{s}
                </div>
                <div
                  className={`text-[0.64rem] font-semibold ${isActive ? 'text-accent2/85' : 'text-white/55'}`}
                >
                  SW{swLabel}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
