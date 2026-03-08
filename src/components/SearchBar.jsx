import { Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function SearchBar({ sizes, onSelect }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const filtered = sizes.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative z-40 mb-4 w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="section-label mb-1">Schnellsuche</div>
          <p className="text-sm text-white/55">Direkter Sprung zu einer Gewindegroesse.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/45">
          {query ? `${filtered.length} Treffer` : `${sizes.length} Normgroessen`}
        </div>
      </div>

      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-linear-to-r from-accent/10 via-transparent to-accent2/8 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100" />
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Gewindegröße suchen... (z.B. M8)"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] py-4 pl-12 pr-28 text-white placeholder:text-white/30 focus:border-accent/45 focus:bg-white/[0.07] focus:outline-none transition-all"
        />
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[0.62rem] font-black uppercase tracking-[0.3em] text-white/28">
          M1.6 ... M64
        </div>
      </div>

      {isOpen && query && (
        <div className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-[24px] border border-white/[0.08] bg-bg/94 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-200">
          {filtered.length > 0 ? (
            filtered.map(s => (
              <button
                key={s}
                onClick={() => {
                  onSelect(s)
                  setQuery('')
                  setIsOpen(false)
                }}
                className="flex w-full items-center justify-between border-b border-white/6 px-5 py-3 text-left text-gray-300 transition-colors last:border-0 hover:bg-accent/10 hover:text-white"
              >
                <span className="font-mono text-base font-bold">M{s}</span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/38">Waehlen</span>
              </button>
            ))
          ) : (
            <div className="px-5 py-4 text-sm text-white/45">Keine passende Gewindegroesse gefunden.</div>
          )}
        </div>
      )}
    </div>
  )
}
