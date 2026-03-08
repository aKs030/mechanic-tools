import { useState } from 'react'
import { DB } from '../data/threads'
import WheelSelector from '../components/WheelSelector'
import ThreadCard from '../components/ThreadCard'
import FullTorqueTable from '../components/FullTorqueTable'

const SIZES = Object.keys(DB).sort((a, b) => parseFloat(a) - parseFloat(b))

export default function ThreadCalculator({ view = 'rechner' }) {
  const [size, setSize] = useState('8')

  if (view === 'tabelle') {
    return (
      <div className="space-y-4">
        <div className="card px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div>
              <div className="section-label mb-1">Ansicht</div>
              <div className="text-lg font-black tracking-tight text-white">Gesamt-Tabelle</div>
            </div>
          </div>
        </div>

        <FullTorqueTable />
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <section className="relative overflow-hidden px-1 pb-1 pt-3 sm:px-2 sm:pt-4">
        <div className="pointer-events-none absolute inset-x-8 top-10 h-28 rounded-full bg-[radial-gradient(circle_at_center,rgba(94,231,194,0.12)_0%,rgba(90,169,255,0.1)_42%,transparent_72%)] blur-3xl" />
        <div className="relative pt-3 sm:pt-2">
          <WheelSelector sizes={SIZES} selectedSize={size} onSelect={setSize} />
        </div>
      </section>

      <ThreadCard size={size} data={DB[size]} />
    </div>
  )
}
