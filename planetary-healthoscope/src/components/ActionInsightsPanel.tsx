import React, { useState } from "react";
import { buildActionInsights } from "../data/actionPlaybook";

const AUDIENCE_TABS = [
  { id: "individual", label: "Individuals" },
  { id: "organization", label: "Organizations" },
  { id: "government", label: "Governments" },
];

function statusLabel(score) {
  if (score >= 75) return { text: "STABLE", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  if (score >= 55) return { text: "GUARDED", cls: "text-blue-400 bg-blue-500/10 border-blue-500/30" };
  if (score >= 40) return { text: "STRESSED", cls: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  return { text: "CRITICAL", cls: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
}

export default function ActionInsightsPanel({ countryName, temp, pm25, deforest, tScore, pmScore, dScore, hasEco }) {
  const insights = buildActionInsights({ countryName, temp, pm25, deforest, tScore, pmScore, dScore, hasEco });
  const [expandedId, setExpandedId] = useState(insights[0]?.id || null);
  const [audience, setAudience] = useState("individual");

  return (
    <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 flex flex-col gap-4">
      <div>
        <span className="font-mono text-[10px] text-emerald-400 tracking-widest block uppercase font-bold">
          ACTION & IMPACT
        </span>
        <h3 className="text-sm font-bold text-ink-100">
          Top Priorities for {countryName}
        </h3>
        <p className="text-[11px] text-ink-500 mt-1">
          Ranked from the weakest-performing pillar to the strongest, based on {countryName}'s current live readings.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {insights.map((pillar, idx) => {
          const status = statusLabel(pillar.score);
          const isOpen = expandedId === pillar.id;
          return (
            <div key={pillar.id} className="border border-ink-800 rounded-lg overflow-hidden bg-ink-950/40">
              <button
                onClick={() => setExpandedId(isOpen ? null : pillar.id)}
                className="w-full flex justify-between items-center gap-3 px-4 py-3 text-left hover:bg-ink-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-ink-500">#{idx + 1}</span>
                  <div>
                    <span className="text-sm font-semibold text-ink-100">{pillar.label}</span>
                    <span className="block text-[10px] text-ink-500 font-mono mt-0.5">{pillar.metricLine}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border ${status.cls}`}>
                    {status.text}
                  </span>
                  <span className={`font-mono text-emerald-400 text-base transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-ink-900 flex flex-col gap-4">
                  <p className="text-xs text-ink-300 leading-relaxed">{pillar.effect}</p>

                  <div>
                    <div className="flex gap-2 font-mono text-[9px] mb-3">
                      {AUDIENCE_TABS.map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setAudience(tab.id)}
                          className={`px-3 py-1.5 rounded uppercase border tracking-wider transition-all font-bold ${
                            audience === tab.id
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                              : "border-ink-800 text-ink-500 hover:text-ink-300"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <ul className="flex flex-col gap-2">
                      {pillar[audience].map((action, i) => (
                        <li key={i} className="flex gap-2 text-xs text-ink-300 leading-relaxed">
                          <span className="text-emerald-400 font-bold shrink-0">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
