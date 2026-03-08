import { Wrench, Camera, TableProperties } from 'lucide-react'

export default function ToolMenu({ active, threadView, onSelect }) {
  const items = [
    {
      id: 'threads',
      label: 'Gewinde',
      detail: 'Rechner',
      icon: Wrench,
    },
    {
      id: 'thread-table',
      label: 'Tabelle',
      detail: 'Gesamt',
      icon: TableProperties,
    },
    {
      id: 'camera',
      label: 'Scanner',
      detail: 'Konzept',
      icon: Camera,
    },
  ]

  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-[24px] border border-white/[0.08] bg-bg/82 p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:inset-x-4 sm:bottom-4 sm:max-w-xl sm:rounded-[28px] sm:p-2">
      <div className="flex gap-1.5 sm:gap-2">
        {items.map(item => {
          const Icon = item.icon
          const isActive =
            item.id === 'threads'
              ? active === 'threads' && threadView === 'rechner'
              : item.id === 'thread-table'
                ? active === 'threads' && threadView === 'tabelle'
                : active === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-[18px] border px-3 py-2.5 transition-all duration-300 sm:gap-3 sm:rounded-[22px] sm:px-4 sm:py-3 ${
                isActive
                  ? 'border-accent/35 bg-linear-to-br from-accent/22 to-accent2/10 text-white shadow-[0_0_28px_rgba(94,231,194,0.16)]'
                  : 'border-transparent text-white/45 hover:border-white/10 hover:bg-white/6 hover:text-white/85'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11 sm:rounded-2xl ${
                  isActive
                    ? 'border-white/12 bg-black/18 text-accent'
                    : 'border-white/8 bg-white/[0.04] text-white/55'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.6 : 2} />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[0.84rem] font-bold tracking-tight sm:text-sm">{item.label}</div>
                <div
                  className={`text-[0.56rem] uppercase tracking-[0.22em] sm:text-[0.65rem] sm:tracking-[0.28em] ${
                    isActive ? 'text-white/55' : 'text-white/32'
                  }`}
                >
                  {item.detail}
                </div>
              </div>
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(94,231,194,0.9)] sm:h-2.5 sm:w-2.5" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
