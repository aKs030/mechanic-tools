import { useMemo, useState } from 'react'
import { CLEARANCE_DB, DB, TORQUE_EXT_DB } from '../data/threads'

export default function FullTorqueTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'size', direction: 'asc' })
  const [showClearance, setShowClearance] = useState(false)

  const sizes = useMemo(() => {
    const filtered = Object.keys(DB).filter(
      s => s.includes(searchTerm) || `M${s}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return filtered.sort((a, b) => {
      const aVal = parseFloat(a)
      const bVal = parseFloat(b)
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [searchTerm, sortConfig])

  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-white/8 bg-linear-to-r from-white/[0.04] to-transparent p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="section-label mb-3">Normtabelle</div>
            <h2 className="text-2xl font-black tracking-[-0.05em] text-white">
              ISO-Regelgewinde im direkten Vergleich
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Filtere nach Groesse, sortiere die Reihe und blende bei Bedarf die
              Durchgangsbohrungen ein.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <TableStat label="Datensaetze" value={`${Object.keys(DB).length}`} />
            <TableStat label="Gefiltert" value={`${sizes.length}`} />
            <TableStat label="Sortierung" value={sortConfig.direction === 'asc' ? 'Auf' : 'Ab'} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Suche M6, M8, M10 ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="min-w-[220px] flex-1 rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/28 focus:border-accent/45 focus:outline-none"
          />
          <button
            onClick={() => setShowClearance(!showClearance)}
            className={`rounded-[20px] border px-4 py-3 text-xs font-black uppercase tracking-[0.26em] transition-all ${
              showClearance
                ? 'border-accent2/30 bg-accent2/10 text-accent2'
                : 'border-white/10 bg-white/[0.04] text-white/45 hover:text-white'
            }`}
          >
            {showClearance ? 'Durchgang aktiv' : 'Durchgang anzeigen'}
          </button>
        </div>
      </div>

      <div className="max-h-[65vh] overflow-auto no-scrollbar">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-bg/94 backdrop-blur-xl">
            <tr className="border-b border-white/8 bg-white/[0.03]">
              <SortableHead
                active={sortConfig.key === 'size'}
                direction={sortConfig.direction}
                onClick={() => handleSort('size')}
              >
                Groesse
              </SortableHead>
              <HeadCell>Steigung</HeadCell>
              <HeadCell>Kernloch</HeadCell>
              {showClearance && <HeadCell tone="text-accent2">Durchgang</HeadCell>}
              <HeadCell>SW</HeadCell>
              <HeadCell tone="text-amber-300">8.8</HeadCell>
              <HeadCell tone="text-amber-300">10.9</HeadCell>
              <HeadCell tone="text-amber-300">12.9</HeadCell>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr>
                <td colSpan={showClearance ? 8 : 7} className="px-5 py-12 text-center text-sm text-white/40">
                  Keine Ergebnisse gefunden.
                </td>
              </tr>
            ) : (
              sizes.map((s, index) => {
                const d = DB[s]
                const t = TORQUE_EXT_DB[s] || {}
                const c = CLEARANCE_DB[s]

                return (
                  <tr
                    key={s}
                    className={`border-b border-white/6 transition-colors hover:bg-white/[0.04] ${
                      index % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'
                    }`}
                  >
                    <td className="px-5 py-4 font-mono text-base font-black text-white">M{s}</td>
                    <td className="px-5 py-4 font-mono text-sm text-white/62">{d.pitch} mm</td>
                    <td className="px-5 py-4 font-mono text-sm text-white/62">Ø {d.drill}</td>
                    {showClearance && (
                      <td className="px-5 py-4 font-mono text-sm text-accent2/78">
                        {c ? `${c.fine} / ${c.medium} / ${c.coarse}` : '-'}
                      </td>
                    )}
                    <td className="px-5 py-4 font-mono text-sm text-white/62">SW {d.iso}</td>
                    <TorqueCell value={t['8.8']} />
                    <TorqueCell value={t['10.9']} />
                    <TorqueCell value={t['12.9']} />
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/8 bg-black/20 px-5 py-4 text-sm text-white/42">
        Werte basieren auf DIN 13-1, ISO 261 und ISO 273 Richtwerten. Drehmomente sind als
        praxisnahe Orientierung zu lesen.
      </div>
    </div>
  )
}

function TableStat({ label, value }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-[0.62rem] font-black uppercase tracking-[0.26em] text-white/38">
        {label}
      </div>
      <div className="mt-2 font-mono text-lg font-black text-white">{value}</div>
    </div>
  )
}

function HeadCell({ children, tone = 'text-white/38' }) {
  return (
    <th className={`px-5 py-4 text-[0.65rem] font-black uppercase tracking-[0.28em] ${tone}`}>
      {children}
    </th>
  )
}

function SortableHead({ children, active, direction, onClick }) {
  return (
    <th className="px-5 py-4 text-[0.65rem] font-black uppercase tracking-[0.28em]">
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 transition-colors ${
          active ? 'text-accent' : 'text-white/38 hover:text-white/72'
        }`}
      >
        {children}
        <span>{active ? (direction === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </th>
  )
}

function TorqueCell({ value }) {
  return (
    <td
      className={`px-5 py-4 font-mono text-sm font-bold ${
        value ? 'text-amber-200' : 'text-white/24'
      }`}
    >
      {value || '-'}
    </td>
  )
}
