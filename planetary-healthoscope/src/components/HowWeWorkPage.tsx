import React, { useState } from "react";

const STEPS = [
  {
    id: "select",
    title: "1. Pick a WHO Member State",
    short: "Choose any of the 193 WHO member states from the searchable selector.",
    detail:
      "Each entry carries the capital city's coordinates, used as the anchor point for that country's live environmental readings. Coordinates come from an open, community-maintained country dataset, and WHO regional groupings (AFRO, AMRO, SEARO, EURO, EMRO, WPRO) follow WHO's own published regional structure.",
  },
  {
    id: "fetch",
    title: "2. We fetch three live signals",
    short: "Temperature, air quality, and forest cover — pulled straight from public data providers, no fabricated numbers.",
    detail: null, // rendered specially below
  },
  {
    id: "score",
    title: "3. We calculate the Planetary Health Index (PHI)",
    short: "A single 0–100 composite score built from climate, human-health, and ecosystem signals.",
    detail: null,
  },
  {
    id: "act",
    title: "4. We translate the score into action",
    short: "The dashboard ranks the weakest pillars for that country and suggests concrete steps for individuals, organizations, and governments.",
    detail:
      "This isn't generic advice — it's generated from that country's actual live numbers. If air quality is the worst-performing pillar, the recommendations focus there first. As live conditions change, the priorities shift too.",
  },
];

const DATA_SOURCES = [
  {
    name: "Open-Meteo Weather API",
    metric: "Ambient temperature",
    detail: "A free, keyless global forecast API. We call it live, in your browser, for the selected capital city's coordinates.",
    live: true,
  },
  {
    name: "Open-Meteo Air Quality API",
    metric: "PM2.5 (fine particulate matter)",
    detail: "Built on Copernicus Atmosphere Monitoring Service (CAMS) satellite and ground-station modeling — the same pollutant WHO's air quality guidelines are built around.",
    live: true,
  },
  {
    name: "World Bank Open Data",
    metric: "Forest area (% of land area)",
    detail: "The closest genuinely open global dataset for canopy cover. Updated annually, not in real time — we label the reporting year on-screen rather than pretend it's live.",
    live: false,
  },
];

function Accordion({ step, isOpen, onToggle }) {
  return (
    <div className="border border-ink-800 rounded-lg overflow-hidden bg-ink-950/40">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-4 px-5 py-4 text-left hover:bg-ink-900/40 transition-colors"
      >
        <div>
          <h3 className="text-sm font-bold text-ink-100">{step.title}</h3>
          <p className="text-xs text-ink-400 mt-1">{step.short}</p>
        </div>
        <span className={`font-mono text-emerald-400 text-lg transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-ink-900 text-xs text-ink-300 leading-relaxed">
          {step.detail && <p>{step.detail}</p>}

          {step.id === "fetch" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {DATA_SOURCES.map(src => (
                <div key={src.name} className="bg-ink-900/60 border border-ink-800 rounded p-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-ink-100 uppercase">{src.metric}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${src.live ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {src.live ? "LIVE" : "PERIODIC"}
                    </span>
                  </div>
                  <span className="text-[11px] text-ink-400">{src.name}</span>
                  <span className="text-[10px] text-ink-500 leading-relaxed">{src.detail}</span>
                </div>
              ))}
            </div>
          )}

          {step.id === "score" && (
            <div className="mt-3 flex flex-col gap-3">
              <div className="bg-ink-900/60 border border-ink-800 rounded p-4 font-mono text-[11px] text-ink-300 leading-loose">
                <div>Climate Score = 100 − max(0, Temp − 15°C) × 3.1</div>
                <div>Air Quality Score = 100 − max(0, PM2.5 − 5µg/m³) × 0.55</div>
                <div>Ecosystem Score = 100 − max(0, Deforestation − 10%) × 1.15</div>
                <div className="mt-2 pt-2 border-t border-ink-800 text-emerald-400">
                  PHI = (Climate × 0.4) + (Air Quality × 0.4) + (Ecosystem × 0.2)
                </div>
              </div>
              <p>
                The 15°C, 5µg/m³, and 10% thresholds aren't arbitrary — they trace back to the IPCC Paris Agreement
                pre-industrial baseline, WHO's 2021 global air quality guideline, and UN SDG 15 (Life on Land)
                habitat targets, respectively. When a country's forest-cover dataset isn't available, PHI falls
                back to a 50/50 weighting across climate and air quality alone, and the dashboard says so plainly
                rather than silently guessing a number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HowWeWorkPage() {
  const [openStep, setOpenStep] = useState("fetch");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
      <div className="text-center flex flex-col gap-2 mb-2">
        <span className="font-mono text-[11px] tracking-widest text-emerald-400 font-bold uppercase">How We Work</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-100">From live signal to a single number you can act on</h1>
        <p className="text-sm text-ink-400 max-w-2xl mx-auto">
          Tap a step below to see exactly where the data comes from and how it's calculated — nothing on this
          dashboard is fabricated or simulated unless it's explicitly marked as a "Scenario Simulator."
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {STEPS.map(step => (
          <Accordion
            key={step.id}
            step={step}
            isOpen={openStep === step.id}
            onToggle={() => setOpenStep(prev => (prev === step.id ? null : step.id))}
          />
        ))}
      </div>

      <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-6 flex flex-col gap-2 mt-2">
        <span className="font-mono text-[10px] tracking-widest text-blue-400 font-bold uppercase">Honesty Notes</span>
        <ul className="text-xs text-ink-400 leading-relaxed list-disc pl-5 flex flex-col gap-1.5">
          <li>Capital-city coordinates are used as a proxy for the whole country — readings reflect conditions at that single point, not a nationwide average.</li>
          <li>Forest cover is the only non-live figure on the dashboard; we show its reporting year rather than implying it updates in real time.</li>
          <li>The "Scenario Simulator" mode is a separate, clearly labeled what-if explorer — it never overwrites or gets mistaken for live readings.</li>
          <li>No AI-generated diagnostic text is used anywhere; every number and recommendation traces back to a formula you can see above.</li>
        </ul>
      </div>
    </div>
  );
}
