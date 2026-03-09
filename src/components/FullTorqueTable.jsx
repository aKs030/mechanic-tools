import { useMemo, useState } from 'react'
import { CLEARANCE_DB, DB, TORQUE_EXT_DB } from '../data/threads'

export default function FullTorqueTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'size', direction: 'asc' })
  const [showClearance, setShowClearance] = useState(false)
  const [boltType, setBoltType] = useState('full') // 'full' or 'expansion'

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
      <div className="border-b border-white/8 bg-linear-to-r from-white/[0.04] to-transparent p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="section-label mb-2">Normtabelle</div>
            <h2 className="text-[clamp(1.2rem,3.2vw,1.75rem)] font-black tracking-[-0.05em] text-white">
              ISO-Regelgewinde im direkten Vergleich
            </h2>
            <p className="mt-2 text-sm leading-5 text-white/55">
              Filtere nach Größe, sortiere die Reihe und blende bei Bedarf die Durchgangsbohrungen
              ein.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <TableStat label="Datensätze" value={`${Object.keys(DB).length}`} />
            <TableStat label="Gefiltert" value={`${sizes.length}`} />
            <TableStat label="Sortierung" value={sortConfig.direction === 'asc' ? 'Auf' : 'Ab'} />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Suche M6, M8, M10 ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="min-w-[220px] flex-1 rounded-[20px] border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white placeholder:text-white/28 focus:border-accent/45 focus:outline-none"
          />

          <div className="flex gap-2">
            <div className="flex rounded-[20px] bg-black/30 p-1 border border-white/8">
              <button
                onClick={() => setBoltType('full')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] text-[0.62rem] font-black uppercase tracking-wider transition-all ${
                  boltType === 'full'
                    ? 'bg-accent/20 text-accent'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                Vollschaft
              </button>
              <button
                onClick={() => setBoltType('expansion')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[16px] text-[0.62rem] font-black uppercase tracking-wider transition-all ${
                  boltType === 'expansion'
                    ? 'bg-amber-400/20 text-amber-400'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                Dehnschaft
              </button>
            </div>

            <button
              onClick={() => setShowClearance(!showClearance)}
              className={`rounded-[20px] border px-4 py-2.5 text-[0.62rem] font-black uppercase tracking-wider transition-all ${
                showClearance
                  ? 'border-accent2/30 bg-accent2/10 text-accent2'
                  : 'border-white/10 bg-white/[0.04] text-white/45 hover:text-white'
              }`}
            >
              {showClearance ? 'Durchgang aktiv' : 'Durchgang (+)'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-bg/94 backdrop-blur-xl">
            <tr className="border-b border-white/8 bg-white/[0.03]">
              <SortableHead
                active={sortConfig.key === 'size'}
                direction={sortConfig.direction}
                onClick={() => handleSort('size')}
              >
                Größe
              </SortableHead>
              <HeadCell>Steigung</HeadCell>
              <HeadCell>Kernloch</HeadCell>
              {showClearance && <HeadCell tone="text-accent2">Durchgang</HeadCell>}
              <HeadCell>SW</HeadCell>
              <HeadCell tone="text-amber-300">8.8</HeadCell>
              <HeadCell tone="text-amber-300">10.9</HeadCell>
              <HeadCell tone="text-amber-300">12.9</HeadCell>
              <HeadCell tone="text-indigo-300">GA</HeadCell>
              <HeadCell tone="text-indigo-300">GB</HeadCell>
              <HeadCell tone="text-indigo-300">VW</HeadCell>
              <HeadCell tone="text-indigo-300">YK</HeadCell>
            </tr>
          </thead>
          <tbody>
            {sizes.length === 0 ? (
              <tr>
                <td
                  colSpan={showClearance ? 8 : 7}
                  className="px-5 py-12 text-center text-sm text-white/40"
                >
                  Keine Ergebnisse gefunden.
                </td>
              </tr>
            ) : (
              sizes.map((s, index) => {
                const d = DB[s]
                const torqueData = TORQUE_EXT_DB[s] || {}
                const t = torqueData[boltType] || torqueData // Handle both nested and flat structures
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
                    <td className="px-5 py-4 font-mono text-sm text-white/62">
                      SW {d.iso}
                      {d.din ? ` / ${d.din}` : ''}
                      {d.hv ? ` / ${d.hv}` : ''}
                    </td>
                    <TorqueCell value={t['8.8']} />
                    <TorqueCell value={t['10.9']} />
                    <TorqueCell value={t['12.9']} />
                    <TorqueCell value={t['GA']} tone="text-indigo-200" />
                    <TorqueCell value={t['GB']} tone="text-indigo-200" />
                    <TorqueCell value={t['VW']} tone="text-indigo-200" />
                    <TorqueCell value={t['YK']} tone="text-indigo-200" />
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/8 bg-black/20 px-4 py-3 text-xs sm:px-5 sm:py-4 sm:text-sm text-white/42">
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.65rem] font-bold uppercase tracking-wider text-white/25">
          <span>GA: 24CrMo5</span>
          <span>GB: 21CrMoV57</span>
          <span>V: X22 CrMoV121</span>
          <span>VW: X19 CrMo VNbN</span>
          <span>YK: Ck 35</span>
        </div>
        Werte basieren auf DIN 13-1, ISO 261 und ISO 273 Richtwerten. Drehmomente sind als
        praxisnahe Orientierung zu lesen (Reibungszahl µ=0,14).
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

function TorqueCell({ value, tone = 'text-amber-200' }) {
  return (
    <td className={`px-5 py-4 font-mono text-sm font-bold ${value ? tone : 'text-white/24'}`}>
      {value || '-'}
    </td>
  )
}
