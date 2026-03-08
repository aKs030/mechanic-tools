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
    <div className="space-y-3 sm:space-y-4">
      <section className="relative overflow-hidden px-1 pb-1 pt-1 sm:px-2">
        <div className="pointer-events-none absolute inset-x-8 top-12 h-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(94,231,194,0.12)_0%,rgba(90,169,255,0.1)_42%,transparent_72%)] blur-3xl" />
        <div className="relative mb-2.5 flex items-center justify-between gap-3 px-2 sm:mb-3 sm:px-3">
          <div className="section-label">SELECTOR WHEEL</div>
          <button
            onClick={() => setView('tabelle')}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[0.56rem] font-black uppercase tracking-[0.22em] text-white/45 shadow-[0_10px_28px_rgba(0,0,0,0.24)] transition-colors hover:text-white sm:px-3 sm:py-2 sm:text-[0.62rem] sm:tracking-[0.28em]"
          >
            Tabelle
          </button>
        </div>

        <div className="relative">
          <WheelSelector sizes={SIZES} selectedSize={size} onSelect={setSize} />
        </div>
      </section>

      <ThreadCard size={size} data={DB[size]} />
    </div>
  )
}
