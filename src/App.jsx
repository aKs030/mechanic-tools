import { useState } from 'react'
import ThreadCalculator from './tools/ThreadCalculator'
import CameraScanner from './tools/CameraScanner'
import ToolMenu from './components/ToolMenu'

function App() {
  const [activeTool, setActiveTool] = useState('threads')

  return (
    <div className="min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="absolute left-[-8rem] top-[-10rem] h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10rem] h-80 w-80 rounded-full bg-accent2/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-5xl px-4 pb-32 pt-4 sm:px-6">
        <header className="mx-auto mb-4 max-w-4xl">
          <div className="app-shell overflow-hidden px-4 py-3 sm:px-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.58rem] font-black uppercase tracking-[0.34em] text-white/34">
                  Workshop UI
                </div>
                <h1 className="mt-1 text-xl font-black tracking-[-0.08em] text-white sm:text-2xl">
                  MECHANIC <span className="text-accent">TOOLS</span>
                </h1>
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] text-white/55">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(94,231,194,0.85)]" />
                {activeTool === 'threads' ? 'Gewinde' : 'Scanner'}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl">
          {activeTool === 'threads' && <ThreadCalculator />}
          {activeTool === 'camera' && <CameraScanner />}
        </main>

        <ToolMenu active={activeTool} onSelect={setActiveTool} />
      </div>
    </div>
  )
}

export default App
