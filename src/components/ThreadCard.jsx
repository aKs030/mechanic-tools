import { Gauge } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { CLEARANCE_DB, TORQUE_EXT_DB } from '../data/threads'

const TORQUE_PRIORITY = {
  4.6: 1,
  5.6: 2,
  6.8: 3,
  8.8: 4,
  10.9: 5,
  12.9: 6,
  'A2-70': 7,
  'A4-80': 8,
}

function useAnimatedNumber(targetValue, duration = 400, decimals = 2) {
  const [displayValue, setDisplayValue] = useState(targetValue)
  const displayValueRef = useRef(targetValue)
  const startTime = useRef(null)
  const startValue = useRef(targetValue)
  const frameId = useRef(null)

  useEffect(() => {
    displayValueRef.current = displayValue
  }, [displayValue])

  useEffect(() => {
    if (parseFloat(targetValue) === parseFloat(displayValueRef.current)) return

    startValue.current = parseFloat(displayValueRef.current) || 0
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
  }, [targetValue, duration, decimals])

  return trimFixed(displayValue, decimals)
}

function AnimatedNumber({ value, decimals = 1, className }) {
  const animated = useAnimatedNumber(value, 600, decimals)
  return <span className={className}>{animated}</span>
}

function trimFixed(value, digits) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  const fixed = n.toFixed(digits)
  return digits === 0 ? fixed : fixed.replace(/\.?0+$/, '')
}

function getTorqueDecimals(value) {
  const numericValue = Number(value)
  return numericValue >= 100 ? 0 : numericValue >= 10 ? 1 : 2
}

function formatWithUnit(value, unit, tone = 'text-white', isNumeric = true) {
  const shouldAnimate = isNumeric && Number.isFinite(Number(value))

  return (
    <div className="flex items-baseline justify-end gap-1 text-right">
      {shouldAnimate ? (
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
  const numericSize = Number(size)
  const clearance = CLEARANCE_DB[size] || null
  const torque = TORQUE_EXT_DB[size] || null
  const hasTorque = numericSize >= 2 && Boolean(torque)
  const torqueEntries = hasTorque
    ? Object.keys(torque)
        .sort((a, b) => (TORQUE_PRIORITY[a] ?? 9) - (TORQUE_PRIORITY[b] ?? 9))
        .map(grade => ({
          grade,
          value: torque[grade],
        }))
    : []

  const pitch = Number(data.pitch)

  const specRows = [
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
      value: formatWithUnit(trimFixed(1.2 * numericSize, 1), 'mm'),
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

            <div className="flex flex-col text-right">
              <span className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/40">
                Schlüsselweite
              </span>
              <span className="text-[0.55rem] font-medium text-white/25 italic">
                {data.din && data.hv ? 'ISO | DIN | HV' : data.din ? 'ISO | DIN' : data.hv ? 'ISO | HV' : 'ISO'}
              </span>
            </div>

            <div className="flex items-center text-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <AnimatedNumber
                  value={data.iso}
                  decimals={1}
                  className="font-mono text-4xl font-black tracking-tighter text-accent sm:text-6xl"
                />
                {data.din && (
                  <>
                    <div className="h-8 w-px bg-white/10 sm:h-10" />
                    <AnimatedNumber
                      value={data.din}
                      decimals={1}
                      className="font-mono text-3xl font-black tracking-tighter text-white/50 sm:text-5xl"
                    />
                  </>
                )}
                {data.hv && (
                  <>
                    <div className="h-8 w-px bg-white/10 sm:h-10" />
                    <AnimatedNumber
                      value={data.hv}
                      decimals={1}
                      className="font-mono text-3xl font-black tracking-tighter text-amber-400/50 sm:text-5xl"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-4 lg:gap-20">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/[0.08]" />

          <section className="flex flex-col">
            <div className="mt-1 flex-1 space-y-0.5">
              {specRows.map(row => (
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

          <section className="flex flex-col">
            <div className="mt-1 flex-1 space-y-0.5">
              {drillRows.map(row => (
                <SpecRow key={row.label} label={row.label} hint={row.hint} value={row.value} />
              ))}
            </div>
          </section>
        </div>

        <SectionDivider />

        <section className="relative w-full overflow-hidden rounded-[20px] border border-white/8 bg-white/4 px-2.5 py-3 sm:px-4 sm:py-4">
          <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-amber-400/5 blur-3xl opacity-20" />

          <div className="mb-2.5 flex items-center justify-between gap-2 sm:mb-3">
            <div className="flex items-center gap-1.5">
              <Gauge size={12} className="text-amber-300/50" />
              <h3 className="font-mono text-[0.6rem] font-black uppercase tracking-[0.12em] text-white/30 sm:text-[0.7rem]">
                Drehmomente (NM)
              </h3>
              <span className="text-[0.42rem] font-bold uppercase tracking-[0.08em] text-white/12 sm:hidden">
                µ=0,14
              </span>
            </div>
            <span className="hidden shrink-0 whitespace-nowrap text-right text-[0.45rem] font-bold text-white/10 uppercase tracking-widest sm:block">
              Standard Reibwert µ=0,14
            </span>
          </div>

          {hasTorque ? (
            <div className="pb-0.5 sm:overflow-x-auto sm:no-scrollbar">
              <div className="grid w-full grid-cols-8 items-end gap-x-0 px-0 sm:mx-auto sm:flex sm:w-max sm:min-w-max sm:gap-3.5">
                {torqueEntries.map(({ grade, value }) => (
                  <TorqueTile key={grade} grade={grade} value={value} />
                ))}
              </div>
            </div>
          ) : (
            <p className="py-1 text-center text-[0.7rem] font-medium italic text-white/15">n/a</p>
          )}
        </section>
      </div>
    </article>
  )
}

function SectionDivider() {
  return <div className="my-5 border-t border-white/6 sm:my-8" />
}

function TorqueTile({ grade, value }) {
  return (
    <div className="flex min-w-0 flex-col items-center text-center sm:w-[4.15rem] sm:shrink-0">
      <span className="w-full whitespace-nowrap text-[0.6rem] font-black tracking-[-0.05em] text-white sm:text-[0.82rem]">
        {grade}
      </span>
      <AnimatedNumber
        value={value}
        decimals={getTorqueDecimals(value)}
        className="font-mono text-[1.15rem] font-black leading-none tracking-[-0.07em] text-amber-400 sm:text-[1.85rem]"
      />
    </div>
  )
}

function SpecRow({ label, hint, note, value }) {
  return (
    <div className="grid grid-cols-[6.5rem_auto] items-center gap-2 border-b border-white/3 py-2 last:border-0 sm:grid-cols-[8.5rem_auto] sm:py-2.5">
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
