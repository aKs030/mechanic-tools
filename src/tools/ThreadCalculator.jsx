import { useState } from 'react'
import { DB } from '../data/threads'
import WheelSelector from '../components/WheelSelector'
import ThreadCard from '../components/ThreadCard'
import FullTorqueTable from '../components/FullTorqueTable'

const SIZES = Object.keys(DB).sort((a, b) => parseFloat(a) - parseFloat(b))

export default function ThreadCalculator() {
  const [size, setSize] = useState('8')
  const [view, setView] = useState('rechner')

  if (view === 'tabelle') {
    return (
      <div className="space-y-4">
        <div className="card px-4 py-3 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="section-label mb-1">Ansicht</div>
              <div className="text-lg font-black tracking-tight text-white">Gesamt-Tabelle</div>
            </div>
            <button
              onClick={() => setView('rechner')}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/55 transition-colors hover:text-white"
            >
              Rechner
            </button>
          </div>
        </div>

        <FullTorqueTable />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="section-label">SELECTOR WHEEL</div>
          <button
            onClick={() => setView('tabelle')}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white"
          >
            Tabelle
          </button>
        </div>

        <WheelSelector sizes={SIZES} selectedSize={size} onSelect={setSize} />
      </div>

      <ThreadCard size={size} data={DB[size]} />
    </div>
  )
}
