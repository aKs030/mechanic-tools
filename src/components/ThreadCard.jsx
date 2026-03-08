import { Bolt, Drill, Gauge, Layers } from 'lucide-react'
import { CLEARANCE_DB, TORQUE_EXT_DB } from '../data/threads'

const SECTION_STYLES = {
  accent: {
    icon: Bolt,
    halo: 'bg-accent/10',
    border: 'border-accent/14',
    pill: 'border-accent/16 bg-accent/10 text-accent/82',
    value: 'text-accent',
    label: 'text-accent/78',
  },
  blue: {
    icon: Drill,
    halo: 'bg-accent2/10',
    border: 'border-accent2/14',
    pill: 'border-accent2/16 bg-accent2/10 text-accent2/82',
    value: 'text-accent2',
    label: 'text-accent2/78',
  },
  amber: {
    icon: Gauge,
    halo: 'bg-amber-300/10',
    border: 'border-amber-300/14',
    pill: 'border-amber-300/16 bg-amber-300/10 text-amber-300/82',
    value: 'text-amber-300',
    label: 'text-amber-300/78',
  },
  default: {
    icon: Layers,
    halo: 'bg-white/[0.06]',
    border: 'border-white/8',
    pill: 'border-white/10 bg-white/[0.05] text-white/56',
    value: 'text-white',
    label: 'text-white/42',
  },
}

export default function ThreadCard({ size, data }) {
  const clearance = CLEARANCE_DB[size] || null
  const torque = TORQUE_EXT_DB[size] || null

  const sections = [
    {
      title: 'Basiswerte',
      tone: 'accent',
      meta: `M${size}`,
      items: [
        { label: 'Gewinde', value: `M${size}` },
        { label: 'SW', value: data.iso },
        { label: 'Steigung', value: `${data.pitch} mm` },
        { label: 'Kernloch', value: `Ø ${data.drill} mm` },
      ],
    },
    {
      title: 'Details',
      tone: 'default',
      meta: 'ISO',
      items: [
        { label: 'Flankentiefe', value: `${(0.6134 * parseFloat(data.pitch)).toFixed(3)} mm` },
        { label: 'Einschraubtiefe', value: `${(1.2 * parseFloat(size)).toFixed(1)} mm` },
        { label: 'Min. Material', value: `${(2.5 * parseFloat(data.pitch)).toFixed(2)} mm` },
        { label: 'Profil', value: '60 Grad' },
        { label: 'Norm', value: 'ISO 261 / 965' },
      ],
    },
    {
      title: 'Durchgang',
      tone: 'blue',
      meta: clearance ? 'ISO 273' : 'n/a',
      items: clearance
        ? [
            { label: 'Fein', value: clearance.fine },
            { label: 'Mittel', value: clearance.medium },
            { label: 'Grob', value: clearance.coarse },
          ]
        : [{ label: 'Durchgang', value: '-' }],
    },
    {
      title: 'Drehmoment',
      tone: 'amber',
      meta: 'Nm',
      items: torque
        ? [
            { label: '8.8', value: torque['8.8'] },
            { label: '10.9', value: torque['10.9'] },
            { label: '12.9', value: torque['12.9'] },
          ]
        : [{ label: 'Drehmoment', value: '-' }],
    },
  ]

  return (
    <div className="space-y-3 pb-10">
      {sections.map(section => (
        <CategoryCard
          key={section.title}
          title={section.title}
          meta={section.meta}
          tone={section.tone}
          items={section.items}
        />
      ))}
    </div>
  )
}

function CategoryCard({ title, meta, items, tone = 'default' }) {
  const style = SECTION_STYLES[tone]
  const Icon = style.icon

  return (
    <section className={`card overflow-hidden px-4 py-4 sm:px-5 ${style.border}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/22 to-transparent" />
      <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl ${style.halo}`} />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${style.pill}`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="section-label mb-1">{title}</div>
              <div className="text-sm font-semibold tracking-tight text-white/80">
                {items.length} Werte
              </div>
            </div>
          </div>

          <div className={`rounded-full border px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.28em] ${style.pill}`}>
            {meta}
          </div>
        </div>

        <div className="max-w-[34rem] overflow-hidden rounded-[24px] border border-white/[0.06] bg-black/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          {items.map(item => (
            <ListRow
              key={item.label}
              label={item.label}
              value={item.value}
              labelClass={style.label}
              valueClass={style.value}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ListRow({ label, value, labelClass, valueClass }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_auto] items-center justify-start gap-x-4 border-b border-white/[0.06] px-4 py-3 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_auto] sm:gap-x-5">
      <div className={`text-[0.65rem] font-black uppercase tracking-[0.28em] ${labelClass}`}>
        {label}
      </div>
      <div className={`font-mono text-lg font-black tracking-[-0.05em] ${valueClass}`}>
        {value}
      </div>
    </div>
  )
}
