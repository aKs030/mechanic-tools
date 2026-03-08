import { Drill, Gauge, SlidersHorizontal } from 'lucide-react'
import { CLEARANCE_DB, TORQUE_EXT_DB } from '../data/threads'

function trimFixed(value, digits) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(digits).replace(/\.?0+$/, '')
}

function formatWithUnit(value, unit, tone = 'text-white') {
  return (
    <div className="flex items-baseline justify-end gap-2 text-right">
      <span
        className={`font-mono text-[1rem] font-black leading-none tracking-[-0.04em] sm:text-[1.12rem] ${tone}`}
      >
        {value}
      </span>
      {unit ? (
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/62 sm:text-[0.7rem]">
          {unit}
        </span>
      ) : null}
    </div>
  )
}

export default function ThreadCard({ size, data }) {
  const clearance = CLEARANCE_DB[size] || null
  const torque = TORQUE_EXT_DB[size] || null
  const hasTorque = Number(size) >= 2 && Boolean(torque)

  const pitch = Number(data.pitch)

  const threadRows = [
    {
      label: 'Gewinde',
      hint: 'Regelgewinde DIN 13-1',
      note: 'Schlüsselweite',
      value: (
        <div className="flex items-baseline justify-end gap-3 sm:gap-4">
          <span className="font-mono text-[1.8rem] font-black tracking-[-0.05em] text-white">M{size}</span>
          <span className="font-mono text-[1.8rem] font-black tracking-[-0.05em] text-accent">
            {trimFixed(data.iso, 1)}
          </span>
        </div>
      ),
    },
    {
      label: 'Steigung P',
      value: formatWithUnit(trimFixed(data.pitch, 2), 'mm'),
    },
    {
      label: 'Flankentiefe H3',
      hint: 'Theoretisch',
      value: formatWithUnit(trimFixed(0.6134 * pitch, 3), 'mm'),
    },
    {
      label: 'Einschraubtiefe',
      hint: 'Empfehlung (Stahl)',
      value: formatWithUnit(trimFixed(1.2 * Number(size), 1), 'mm'),
    },
    {
      label: 'Mindest-Material',
      hint: 'Grob-Richtwert',
      value: formatWithUnit(trimFixed(2.5 * pitch, 2), 'mm'),
    },
  ]

  const drillRows = [
    {
      label: 'Kernloch Ø',
      hint: 'DIN 336',
      value: formatWithUnit(trimFixed(data.drill, 2), 'mm', 'text-accent'),
    },
    {
      label: 'Durchgang (Fein)',
      hint: 'ISO 273',
      value: formatWithUnit(clearance ? trimFixed(clearance.fine, 1) : '-', 'mm'),
    },
    {
      label: 'Durchgang (Mittel)',
      value: formatWithUnit(clearance ? trimFixed(clearance.medium, 1) : '-', 'mm'),
    },
    {
      label: 'Durchgang (Grob)',
      value: formatWithUnit(clearance ? trimFixed(clearance.coarse, 1) : '-', 'mm'),
    },
  ]

  return (
    <article className="card mx-auto w-full max-w-[25rem] overflow-hidden rounded-[30px] border border-white/12 !p-0 sm:max-w-[35rem]">
      <div className="px-4 pb-4 pt-4 sm:px-7 sm:pb-6 sm:pt-6">
        <SectionHeading
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/16 bg-accent/10 text-accent">
              <SlidersHorizontal size={22} />
            </div>
          }
          title="Gewinde Details"
        />

        <div className="mt-2.5 sm:mt-3">
          {threadRows.map(row => (
            <SpecRow key={row.label} label={row.label} hint={row.hint} note={row.note} value={row.value} />
          ))}
        </div>

        <SectionDivider />
        <SectionHeading
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent2/16 bg-accent2/10 text-accent2">
              <Drill size={22} />
            </div>
          }
          title="Bohren & Senken"
        />

        <div className="mt-2.5 sm:mt-3">
          {drillRows.map(row => (
            <SpecRow key={row.label} label={row.label} hint={row.hint} value={row.value} />
          ))}
        </div>

        <SectionDivider />
        <SectionHeading
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/16 bg-amber-300/10 text-amber-300">
              <Gauge size={20} />
            </div>
          }
          title="Drehmomente (Nm)"
        />

        {hasTorque ? (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-2.5">
            {['8.8', '10.9', '12.9'].map(grade => (
              <TorqueCell
                key={grade}
                label={`FK ${grade}`}
                value={formatWithUnit(trimFixed(torque[grade], Number(torque[grade]) >= 10 ? 0 : 2), 'Nm')}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[0.95rem] font-medium italic text-white/45 sm:text-[1rem]">
            Keine Drehmomentdaten für diese Größe verfügbar.
          </p>
        )}
      </div>
    </article>
  )
}

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="font-mono text-[1.28rem] font-black tracking-[-0.02em] text-white sm:text-[1.8rem]">{title}</h3>
    </div>
  )
}

function SectionDivider() {
  return <div className="my-3 border-t border-white/[0.07] sm:my-4" />
}

function SpecRow({ label, hint, note, value }) {
  return (
    <div className="grid grid-cols-[minmax(8.5rem,11.5rem)_max-content] items-start gap-2 py-1 sm:grid-cols-[minmax(9.5rem,13rem)_max-content] sm:gap-2.5 sm:py-1.5">
      <div className="min-w-0">
        <div className="text-[0.66rem] font-black uppercase tracking-[0.18em] text-white/42 sm:text-[0.76rem]">
          {label}
        </div>
        {hint ? <div className="mt-0.5 text-[0.56rem] font-medium text-white/28 sm:text-[0.62rem]">{hint}</div> : null}
        {note ? (
          <div className="mt-1 text-[0.56rem] font-black uppercase tracking-[0.16em] text-white/42 sm:text-[0.62rem]">
            {note}
          </div>
        ) : null}
      </div>
      <div className="shrink-0">{value}</div>
    </div>
  )
}

function TorqueCell({ label, value }) {
  return (
    <div className="card-surface rounded-xl border border-white/[0.08] px-2 py-2 sm:px-2.5 sm:py-2.5">
      <div className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/42 sm:text-[0.68rem]">
        {label}
      </div>
      <div className="mt-1">{value}</div>
    </div>
  )
}
