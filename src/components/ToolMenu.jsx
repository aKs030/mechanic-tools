import { Wrench, Camera } from 'lucide-react'

export default function ToolMenu({ active, onSelect }) {
    const items = [
        {
            id: 'threads',
            label: 'Gewinde',
            detail: 'Rechner',
            icon: Wrench,
        },
        {
            id: 'camera',
            label: 'Scanner',
            detail: 'Konzept',
            icon: Camera,
        },
    ]

    return (
        <nav className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-[28px] border border-white/[0.08] bg-bg/78 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="flex gap-2">
            {items.map(item => {
                const Icon = item.icon
                const isActive = active === item.id
                return (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`flex min-w-0 flex-1 items-center gap-3 rounded-[22px] border px-4 py-3 transition-all duration-300 ${
                            isActive
                                ? 'border-accent/35 bg-linear-to-br from-accent/22 to-accent2/10 text-white shadow-[0_0_28px_rgba(94,231,194,0.16)]'
                                : 'border-transparent text-white/45 hover:border-white/10 hover:bg-white/6 hover:text-white/85'
                        }`}
                    >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                            isActive
                                ? 'border-white/12 bg-black/18 text-accent'
                                : 'border-white/8 bg-white/[0.04] text-white/55'
                        }`}>
                            <Icon size={20} strokeWidth={isActive ? 2.6 : 2} />
                        </div>
                        <div className="min-w-0 text-left">
                            <div className="text-sm font-bold tracking-tight">{item.label}</div>
                            <div className={`text-[0.65rem] uppercase tracking-[0.28em] ${
                                isActive ? 'text-white/55' : 'text-white/32'
                            }`}>
                                {item.detail}
                            </div>
                        </div>
                        {isActive && <span className="ml-auto h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(94,231,194,0.9)]" />}
                    </button>
                )
            })}
            </div>
        </nav>
    )
}
