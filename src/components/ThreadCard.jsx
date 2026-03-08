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
      layout: 'compact-grid',
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
    <div className="grid items-start gap-2 pb-1 md:gap-2.5 lg:grid-cols-2">
      {sections.map(section => (
        <CategoryCard
          key={section.title}
          title={section.title}
          meta={section.meta}
          layout={section.layout}
          tone={section.tone}
          items={section.items}
        />
      ))}
    </div>
  )
}

function CategoryCard({ title, meta, items, tone = 'default', layout = 'list' }) {
  const style = SECTION_STYLES[tone]
  const Icon = style.icon

  return (
    <section
      className={`card self-start w-full min-w-0 overflow-hidden px-2 py-2 sm:px-3 sm:py-2.5 ${style.border}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/22 to-transparent" />
      <div
        className={`pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-full blur-3xl sm:h-20 sm:w-20 ${style.halo}`}
      />

      <div className="relative">
        <div className="mb-1 flex items-start justify-between gap-2 sm:mb-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-xl border sm:h-8 sm:w-8 ${style.pill}`}
            >
              <Icon size={15} />
            </div>
            <div className="min-w-0">
              <div className="section-label mb-0.5">{title}</div>
              <div className="text-[0.72rem] font-semibold tracking-tight text-white/80 sm:text-[0.8rem]">
                {items.length} Werte
              </div>
            </div>
          </div>

          <div
            className={`shrink-0 rounded-full border px-1.5 py-1 text-[0.5rem] font-black uppercase tracking-[0.18em] sm:px-2 sm:py-1 sm:text-[0.54rem] sm:tracking-[0.2em] ${style.pill}`}
          >
            {meta}
          </div>
        </div>

        {layout === 'compact-grid' ? (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
            {items.map((item, index) => (
              <CompactPairCard
                key={item.label}
                label={item.label}
                value={item.value}
                labelClass={style.label}
                valueClass={style.value}
                className={
                  items.length % 2 === 1 && index === items.length - 1
                    ? 'col-span-2 sm:col-span-1'
                    : ''
                }
              />
            ))}
          </div>
        ) : layout === 'metric-grid' ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {items.map(item => (
              <MetricValueCard
                key={item.label}
                label={item.label}
                value={item.value}
                labelClass={style.label}
                valueClass={style.value}
              />
            ))}
          </div>
        ) : (
          <div className="card-surface w-full overflow-hidden rounded-[15px] border sm:rounded-[17px]">
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
        )}
      </div>
    </section>
  )
}

function ListRow({ label, value, labelClass, valueClass }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-white/[0.06] px-2.5 py-2 last:border-b-0 sm:gap-x-2.5 sm:px-3 sm:py-2.5">
      <div
        className={`shrink-0 text-[0.5rem] font-black uppercase tracking-[0.14em] sm:text-[0.58rem] sm:tracking-[0.18em] ${labelClass}`}
      >
        {label}
      </div>
      <div
        className={`min-w-0 break-words font-mono text-[0.92rem] font-black leading-tight tracking-[-0.04em] sm:text-[1.06rem] ${valueClass}`}
      >
        {value}
      </div>
    </div>
  )
}

function CompactPairCard({ label, value, labelClass, valueClass, className = '' }) {
  return (
    <div
      className={`card-surface rounded-[13px] border px-2 py-1.5 sm:rounded-[15px] sm:px-2.5 sm:py-2 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-1.5">
        <div
          className={`text-[0.54rem] font-black uppercase tracking-[0.14em] sm:text-[0.6rem] sm:tracking-[0.16em] ${labelClass}`}
        >
          {label}
        </div>
        <div
          className={`text-right font-mono text-[0.9rem] font-black tracking-[-0.04em] sm:text-[1.02rem] ${valueClass}`}
        >
          {value}
        </div>
      </div>
    </div>
  )
}

function MetricValueCard({ label, value, labelClass, valueClass }) {
  return (
    <div className="card-surface rounded-[13px] border px-2 py-1.5 sm:rounded-[15px] sm:px-2.5 sm:py-2">
      <div
        className={`mb-1 text-[0.5rem] font-black uppercase tracking-[0.18em] sm:text-[0.56rem] sm:tracking-[0.2em] ${labelClass}`}
      >
        {label}
      </div>
      <div
        className={`font-mono text-[0.92rem] font-black tracking-[-0.04em] sm:text-[1.04rem] ${valueClass}`}
      >
        {value}
      </div>
    </div>
  )
}
