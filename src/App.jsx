import { useState } from 'react'
import ThreadCalculator from './tools/ThreadCalculator'
import CameraScanner from './tools/CameraScanner'
import ToolMenu from './components/ToolMenu'
import ViewportFit from './components/ViewportFit'

function App() {
  const [activeTool, setActiveTool] = useState('threads')
  const [threadView, setThreadView] = useState('rechner')

  const handleSelect = next => {
    if (next === 'threads') {
      setActiveTool('threads')
      setThreadView('rechner')
      return
    }

    if (next === 'thread-table') {
      setActiveTool('threads')
      setThreadView('tabelle')
      return
    }

    setActiveTool(next)
  }

  return (
    <div className="h-[100dvh] overflow-hidden overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="absolute left-[-8rem] top-[-10rem] h-72 w-72 rounded-full bg-accent/12 blur-3xl" />
        <div className="absolute right-[-6rem] top-[10rem] h-80 w-80 rounded-full bg-accent2/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto flex h-full max-w-md flex-col px-3 pb-[calc(0.8rem+env(safe-area-inset-bottom))] pt-[calc(0.8rem+env(safe-area-inset-top))] sm:max-w-5xl sm:px-6 sm:pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pt-[calc(1rem+env(safe-area-inset-top))]">
        <main className="mx-auto min-h-0 w-full max-w-4xl flex-1">
          <ViewportFit fitKey={`${activeTool}:${threadView}`}>
            {activeTool === 'threads' && <ThreadCalculator view={threadView} />}
            {activeTool === 'camera' && <CameraScanner />}
          </ViewportFit>
        </main>

        <div className="mx-auto mt-2 w-full max-w-4xl shrink-0 sm:mt-3">
          <ToolMenu active={activeTool} threadView={threadView} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  )
}

export default App
