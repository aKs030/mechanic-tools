import { Camera, Gauge, RefreshCcw, Ruler, Wrench } from 'lucide-react'

export default function CameraScanner() {
  return (
    <div className="card card-glow overflow-hidden">
      <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-accent2/10 blur-3xl" />
      <div className="absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)] lg:items-center">
        <div>
          <div className="section-label mb-3">Scanner-Konzept</div>
          <h2 className="text-3xl font-black tracking-[-0.06em] text-white">
            Kamera-Ansicht mit klarerem Fokus auf Erkennung und Workflow.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/56">
            Die Oberflaeche zeigt nicht nur einen Platzhalter, sondern eine glaubwuerdige
            Vorschau auf den spaeteren Scan-Ablauf fuer Schraubenkopf, Gewinde und Werkzeugwahl.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ScannerFeature icon={Ruler} title="Pitch" text="Steigung aus Kontur und Kantenbild." />
            <ScannerFeature icon={Wrench} title="SW" text="Werkzeugmass direkt aus dem Kopfprofil." />
            <ScannerFeature icon={Gauge} title="Check" text="Schneller Abgleich mit Normdaten." />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-accent2/28 bg-accent2/12 px-6 py-3 text-sm font-bold text-white transition-all hover:border-accent2/45 hover:bg-accent2/18">
              <Camera size={18} />
              Scanner starten
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/78 transition-all hover:bg-white/[0.08] hover:text-white">
              <RefreshCcw size={18} />
              Demo erneut laden
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[360px]">
          <div className="relative aspect-[4/5] rounded-[34px] border border-white/10 bg-linear-to-br from-white/[0.08] to-black/30 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-4 rounded-[28px] border border-white/10 bg-linear-to-b from-accent2/6 via-transparent to-accent/10" />
            <div className="absolute inset-6 rounded-[24px] border border-dashed border-accent2/26" />

            <CornerMarker className="left-6 top-6" />
            <CornerMarker className="right-6 top-6 rotate-90" />
            <CornerMarker className="bottom-6 left-6 -rotate-90" />
            <CornerMarker className="bottom-6 right-6 rotate-180" />

            <div className="absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-transparent via-accent2 to-transparent shadow-[0_0_22px_rgba(90,169,255,0.65)] animate-[scannerSweep_2.8s_ease-in-out_infinite]" />

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <div>
                  <div className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-white/38">
                    Live frame
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/82">Schraubenkopf erkannt</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent2/12 text-accent2">
                  <Camera size={18} />
                </div>
              </div>

              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/10 bg-radial from-white/[0.2] via-white/[0.04] to-transparent">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border border-accent/20 bg-black/30">
                  <div className="grid h-20 w-20 grid-cols-3 gap-1 rounded-full border border-accent2/15 p-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="rounded-full bg-white/12" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-[24px] border border-white/10 bg-black/24 p-4 backdrop-blur-xl">
                <ScannerReadout label="Vermutung" value="M8 / SW 13" accent="text-accent" />
                <ScannerReadout label="Pitch" value="1.25 mm" accent="text-accent2" />
                <ScannerReadout label="Status" value="Normabgleich bereit" accent="text-amber-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScannerFeature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/18 p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon size={18} />
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-white/46">{text}</p>
    </div>
  )
}

function ScannerReadout({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3">
      <div className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-white/38">
        {label}
      </div>
      <div className={`font-mono text-sm font-black ${accent}`}>{value}</div>
    </div>
  )
}

function CornerMarker({ className }) {
  return (
    <div className={`absolute h-8 w-8 ${className}`}>
      <div className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-accent2/70" />
      <div className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-accent2/70" />
    </div>
  )
}
