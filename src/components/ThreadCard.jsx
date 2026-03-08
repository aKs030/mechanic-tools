import { Drill, Gauge, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { CLEARANCE_DB, TORQUE_EXT_DB } from '../data/threads'

function useAnimatedNumber(targetValue, duration = 400, decimals = 2) {
  const [displayValue, setDisplayValue] = useState(targetValue)
  const startTime = useRef(null)
  const startValue = useRef(targetValue)
  const frameId = useRef(null)

  useEffect(() => {
    if (parseFloat(targetValue) === parseFloat(displayValue)) return

    startValue.current = parseFloat(displayValue) || 0
    startTime.current = null

    const animate = timestamp => {
      if (!startTime.current) startTime.current = timestamp
      const progress = Math.min((timestamp - startTime.current) / duration, 1)

      // Ease out expo for a premium feel
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = startValue.current + (parseFloat(targetValue) - startValue.current) * ease

      setDisplayValue(current.toFixed(decimals))

      if (progress < 1) {
        frameId.current = requestAnimationFrame(animate)
      }
    }

    frameId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId.current)
  }, [targetValue, decimals])

  return trimFixed(displayValue, decimals)
}

function AnimatedNumber({ value, decimals = 1, className }) {
  const animated = useAnimatedNumber(value, 600, decimals)
  return <span className={className}>{animated}</span>
}

function trimFixed(value, digits) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(digits).replace(/\.?0+$/, '')
}

function formatWithUnit(value, unit, tone = 'text-white', isNumeric = true) {
  return (
    <div className="flex items-baseline justify-end gap-1 text-right">
      {isNumeric ? (
        <AnimatedNumber
          value={value}
          decimals={unit === 'mm' ? 3 : 2}
          className={`font-mono text-[1rem] font-black leading-none tracking-[-0.04em] sm:text-[1.12rem] ${tone}`}
        />
      ) : (
        <span
          className={`font-mono text-[1rem] font-black leading-none tracking-[-0.04em] sm:text-[1.12rem] ${tone}`}
        >
          {value}
        </span>
      )}
      {unit ? (
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.04em] text-white/50 sm:text-[0.66rem]">
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
          <span className="font-mono text-[1.8rem] font-black tracking-[-0.05em] text-white">
            M{size}
          </span>
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
    <article className="card mx-auto w-full overflow-hidden border-x-0 border-y border-white/12 !p-0 sm:rounded-[30px] sm:border-x">
      <div className="px-3.5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-8">
        {/* Neue dynamische Überschrift über zwei Spalten */}
        <div className="mb-8 flex items-center justify-center gap-6 border-b border-white/10 pb-8 sm:gap-14">
          <div className="flex flex-col text-right">
            <span className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40">
              Gewinde
            </span>
            <span className="text-[0.55rem] font-medium text-white/25">DIN 13-1</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <span className="font-mono text-4xl font-black tracking-tighter text-white sm:text-6xl">
              M<AnimatedNumber value={size} decimals={1} />
            </span>
            <div className="h-10 w-px bg-white/10 sm:h-14" />

            {/* Schlüsselweite Label LINKS vom Wert */}
            <div className="flex flex-col text-right">
              <span className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40">
                Schlüsselweite
              </span>
              <span className="text-[0.55rem] font-medium text-white/25 italic">
                {data.din ? 'ISO | DIN' : 'ISO'}
              </span>
            </div>

            <div className="flex items-center text-center">
              {data.din ? (
                <div className="flex items-center gap-3 sm:gap-5">
                  <AnimatedNumber
                    value={data.iso}
                    decimals={1}
                    className="font-mono text-4xl font-black tracking-tighter text-accent sm:text-6xl"
                  />
                  <div className="h-10 w-px bg-white/10 sm:h-14" />
                  <AnimatedNumber
                    value={data.din}
                    decimals={1}
                    className="font-mono text-4xl font-black tracking-tighter text-white/50 sm:text-6xl"
                  />
                </div>
              ) : (
                <AnimatedNumber
                  value={data.iso}
                  decimals={1}
                  className="font-mono text-4xl font-black tracking-tighter text-accent sm:text-6xl"
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4 lg:gap-20">
          {/* Vertikaler Trenner */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/[0.08]" />

          {/* Linke Spalte: Gewinde */}
          <section className="flex flex-col">
            <div className="mt-1 flex-1 space-y-0.5">
              {threadRows.slice(1).map(row => (
                <SpecRow
                  key={row.label}
                  label={row.label}
                  hint={row.hint}
                  note={row.note}
                  value={row.value}
                />
              ))}
            </div>
          </section>

          {/* Rechte Spalte: Bohren & Senken */}
          <section className="flex flex-col">
            <div className="mt-1 flex-1 space-y-0.5">
              {drillRows.map(row => (
                <SpecRow key={row.label} label={row.label} hint={row.hint} value={row.value} />
              ))}
            </div>
          </section>
        </div>

        <SectionDivider />

        <section>
          <SectionHeading
            icon={
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/16 bg-amber-300/10 text-amber-300">
                <Gauge size={20} />
              </div>
            }
            title="Drehmomente (Nm)"
          />

          {hasTorque ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {['8.8', '10.9', '12.9'].map(grade => (
                <TorqueCell
                  key={grade}
                  label={`FK ${grade}`}
                  value={formatWithUnit(
                    trimFixed(torque[grade], Number(torque[grade]) >= 10 ? 0 : 2),
                    'Nm'
                  )}
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[0.95rem] font-medium italic text-white/45 sm:text-[1rem]">
              Keine Drehmomentdaten für diese Größe verfügbar.
            </p>
          )}
        </section>
      </div>
    </article>
  )
}

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h3 className="font-mono text-[1.28rem] font-black tracking-[-0.02em] text-white sm:text-[1.8rem]">
        {title}
      </h3>
    </div>
  )
}

function SectionDivider() {
  return <div className="my-5 border-t border-white/[0.06] sm:my-8" />
}

function SpecRow({ label, hint, note, value }) {
  return (
    <div className="grid grid-cols-[6.5rem_auto] items-center gap-2 border-b border-white/[0.03] py-2 last:border-0 sm:grid-cols-[8.5rem_auto] sm:py-2.5">
      <div className="min-w-0">
        <div className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40 sm:text-[0.72rem]">
          {label}
        </div>
        {hint ? (
          <div className="mt-0.5 text-[0.52rem] font-medium text-white/25 sm:text-[0.58rem]">
            {hint}
          </div>
        ) : null}
        {note ? (
          <div className="mt-1 text-[0.52rem] font-black uppercase tracking-[0.16em] text-white/40 sm:text-[0.58rem]">
            {note}
          </div>
        ) : null}
      </div>
      <div className="flex justify-start">{value}</div>
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
