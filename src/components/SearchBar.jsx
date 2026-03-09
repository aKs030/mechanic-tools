import { Search } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useState, useRef, useEffect, useCallback } from 'react'

const POPOVER_WIDTH = 250
const VIEWPORT_PADDING = 8
const POPOVER_OFFSET = 8
const POPOVER_ESTIMATED_HEIGHT = 320

export default function SearchBar({ sizes, onSelect, integrated = false }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState({
    top: 0,
    left: 0,
    width: POPOVER_WIDTH,
  })
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)
  const inputRef = useRef(null)

  const normalizedQuery = query.trim().toLowerCase().replace(/^m\s*/i, '').replace(',', '.')
  const filtered = (normalizedQuery ? sizes.filter(s => s.includes(normalizedQuery)) : sizes).slice(
    0,
    18
  )

  const updatePopoverPosition = useCallback(() => {
    if (!buttonRef.current || typeof window === 'undefined') return

    const rect = buttonRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const width = Math.min(POPOVER_WIDTH, viewportWidth - VIEWPORT_PADDING * 2)
    const left = Math.min(
      Math.max(VIEWPORT_PADDING, rect.right - width),
      viewportWidth - width - VIEWPORT_PADDING
    )

    let top = rect.bottom + POPOVER_OFFSET
    if (top + POPOVER_ESTIMATED_HEIGHT > viewportHeight - VIEWPORT_PADDING) {
      top = Math.max(VIEWPORT_PADDING, rect.top - POPOVER_ESTIMATED_HEIGHT - POPOVER_OFFSET)
    }

    setPopoverStyle({ top, left, width })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    updatePopoverPosition()

    const handleOutside = event => {
      const target = event.target
      if (containerRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setIsOpen(false)
    }

    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const handleViewportUpdate = () => updatePopoverPosition()

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleViewportUpdate)
    window.addEventListener('scroll', handleViewportUpdate, true)

    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleViewportUpdate)
      window.removeEventListener('scroll', handleViewportUpdate, true)
    }
  }, [isOpen, updatePopoverPosition])

  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      updatePopoverPosition()
    })
  }, [isOpen, updatePopoverPosition])

  useEffect(() => {
    if (!isOpen) return
    updatePopoverPosition()
  }, [isOpen, query, updatePopoverPosition])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  const handleSelect = size => {
    onSelect(size)
    setQuery('')
    setIsOpen(false)
  }

  const popoverContent = (
    <>
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[9990] bg-[linear-gradient(180deg,rgba(6,12,24,0.32),rgba(6,12,24,0.46))] backdrop-blur-[5px]"
      />
      <div
        ref={popoverRef}
        className="z-[10000] overflow-hidden rounded-[20px] border border-white/[0.08] bg-bg/95 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-3xl"
        style={{
          position: 'fixed',
          top: `${popoverStyle.top}px`,
          left: `${popoverStyle.left}px`,
          width: `${popoverStyle.width}px`,
        }}
      >
        <div className="border-b border-white/8 p-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && filtered.length > 0) {
                handleSelect(filtered[0])
              }
            }}
            placeholder="Suche z.B. M8"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/45 focus:outline-none"
          />
        </div>
        {filtered.length > 0 ? (
          <div className="grid max-h-[250px] grid-cols-3 gap-1 overflow-y-auto p-2">
            {filtered.map(s => (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-2 py-2 text-center font-mono text-xs font-bold text-gray-200 transition-colors hover:bg-accent/10 hover:text-white"
              >
                M{s}
              </button>
            ))}
          </div>
        ) : (
          <div className="px-3 py-4 text-sm text-white/45">Keine passende Größe gefunden.</div>
        )}
      </div>
    </>
  )

  return (
    <div ref={containerRef} className="relative z-[120]">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Gewindegröße wählen"
        onClick={() => setIsOpen(open => !open)}
        className={
          integrated
            ? 'group flex h-12 w-14 items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-90 active:bg-white/20'
            : 'group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-gray-300 shadow-[0_8px_26px_rgba(0,0,0,0.35)] transition-all hover:border-accent/35 hover:bg-accent/10 hover:text-accent active:scale-95'
        }
      >
        <Search size={18} />
      </button>

      {isOpen && typeof document !== 'undefined'
        ? createPortal(popoverContent, document.body)
        : null}
    </div>
  )
}
