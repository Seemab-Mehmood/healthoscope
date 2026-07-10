// Generates country-specific priority insights from live PHI pillar scores.
// Nothing here is templated per-country by name — it's driven entirely by
// the actual live numbers, so the output changes as the live data changes.

export function buildActionInsights({ countryName, temp, pm25, deforest, tScore, pmScore, dScore, hasEco }) {
  const pillars = [];

  pillars.push({
    id: "climate",
    label: "Climate & Heat",
    score: tScore,
    metricLine: `Current reading: ${temp.toFixed(1)}°C (target ceiling: 15°C above pre-industrial baseline)`,
    effect:
      temp > 35
        ? `At ${temp.toFixed(1)}°C, outdoor labor and physical activity in ${countryName} carry a real risk of heat exhaustion and heatstroke, especially for outdoor workers, older adults, and children. Wet-bulb stress at this level can make the body's normal cooling (sweating) ineffective.`
        : temp > 28
        ? `Elevated temperatures around ${temp.toFixed(1)}°C increase strain on cooling systems, water demand, and can worsen cardiovascular and respiratory conditions during sustained heat events.`
        : `Temperatures are currently within a broadly manageable range, though local heatwave events can still spike well above this reading.`,
    individual: [
      "Avoid outdoor exertion during peak heat hours (typically 12pm–4pm) and stay hydrated.",
      "Check on elderly neighbors and family members during heat spikes — they're most at risk.",
      "Use passive cooling where possible (shading, cross-ventilation) to cut reliance on energy-intensive AC.",
    ],
    organization: [
      "Adjust outdoor-work schedules seasonally and provide shaded rest areas and water access for laborers.",
      "Invest in building insulation and reflective roofing to reduce cooling energy demand.",
      "Include heat-health protocols in workplace safety policy, not just fire/electrical safety.",
    ],
    government: [
      "Expand urban tree canopy and reflective/cool-roof mandates in dense heat-island districts.",
      "Issue public heat-health early warnings tied to wet-bulb thresholds, not just air temperature.",
      "Fund climate-resilient public housing and cooling centers for low-income and elderly populations.",
    ],
  });

  pillars.push({
    id: "air",
    label: "Air Quality",
    score: pmScore,
    metricLine: `Current PM2.5: ${pm25.toFixed(0)} µg/m³ (WHO guideline: 5 µg/m³ annual mean)`,
    effect:
      pm25 > 100
        ? `At ${pm25.toFixed(0)} µg/m³, PM2.5 levels are far above WHO's guideline — this is associated with elevated risk of asthma attacks, reduced lung function in children, and increased cardiovascular strain, particularly for people already living with respiratory conditions.`
        : pm25 > 35
        ? `PM2.5 at this level is a recognized contributor to long-term respiratory and cardiovascular disease risk, especially with repeated daily exposure.`
        : `Air quality is closer to WHO's guideline range, though local spikes (traffic, seasonal burning, industrial activity) can still push levels higher on specific days.`,
    individual: [
      "Check daily air quality before outdoor exercise, and mask (N95/KN95) on high-pollution days.",
      "Use indoor air purifiers or simple HEPA-filter DIY setups if pollution is persistently high.",
      "Avoid open burning of household or agricultural waste where alternatives exist.",
    ],
    organization: [
      "Monitor indoor air quality in schools, hospitals, and workplaces, not just outdoor readings.",
      "Shift delivery and logistics fleets toward lower-emission vehicles where financially feasible.",
      "Support employees working from home or with flexible hours during severe smog events.",
    ],
    government: [
      "Enforce industrial and vehicular emissions standards with real penalties, not just guidelines.",
      "Expand public real-time air-quality monitoring networks, especially in underserved areas.",
      "Invest in public transit to reduce vehicle-density-driven urban PM2.5 loads.",
    ],
  });

  if (hasEco) {
    pillars.push({
      id: "ecosystem",
      label: "Ecosystem & Forest Cover",
      score: dScore,
      metricLine: `Estimated canopy fragmentation: ${deforest.toFixed(0)}% (UN SDG 15 target ceiling: 10%)`,
      effect:
        deforest > 50
          ? `Significant forest loss at this level weakens natural flood buffering, reduces groundwater recharge, and is linked to shifting patterns in vector-borne disease spread as habitats fragment.`
          : deforest > 25
          ? `Moderate canopy loss can already measurably reduce local rainfall regulation and soil water retention, raising both flood and drought risk depending on season.`
          : `Forest cover is relatively better preserved, which supports natural water cycling and reduces climate volatility locally.`,
      individual: [
        "Support or participate in local tree-planting and urban greening initiatives.",
        "Reduce demand for products linked to deforestation (unsustainable palm oil, illegally sourced timber).",
        "Advocate for green spaces in your neighborhood or city planning consultations.",
      ],
      organization: [
        "Audit supply chains for deforestation-linked sourcing and commit to verified sustainable alternatives.",
        "Fund or partner with local reforestation and watershed-restoration projects.",
        "Incorporate biodiversity impact assessments into any land-use or construction projects.",
      ],
      government: [
        "Strengthen enforcement against illegal logging and unregulated land conversion.",
        "Expand protected area coverage and community-based forest management programs.",
        "Tie agricultural and infrastructure subsidies to reforestation or no-net-loss commitments.",
      ],
    });
  }

  pillars.sort((a, b) => a.score - b.score);
  return pillars;
}
