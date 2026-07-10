import React from "react";

function Section({ eyebrow = null, title = null, children }) {
  return (
    <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-6 md:p-8 flex flex-col gap-3">
      {eyebrow && (
        <span className="font-mono text-[10px] tracking-widest text-emerald-400 font-bold uppercase">{eyebrow}</span>
      )}
      {title && <h2 className="text-lg md:text-xl font-bold text-ink-100">{title}</h2>}
      <div className="text-sm text-ink-300 leading-relaxed flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6">
      <div className="text-center flex flex-col gap-2 mb-2">
        <span className="font-mono text-[11px] tracking-widest text-emerald-400 font-bold uppercase">About Us</span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink-100">Planetary Health Pakistan (PHP)</h1>
        <p className="font-mono text-sm text-blue-400 tracking-wide">From Echo to Eco</p>
        <p className="text-sm text-ink-400 italic max-w-xl mx-auto">
          From hearing the warnings to creating solutions.
        </p>
      </div>

      <Section>
        <p>
          Planetary Health Pakistan (PHP) is a national, youth-led initiative dedicated to advancing the health of
          both people and the planet. Founded by <strong className="text-ink-100">Seemab Mehmood</strong>, a
          Planetary Health Alliance Campus Ambassador (2022–2025), PHP brings together science, medicine,
          technology, mathematics, artificial intelligence, environmental stewardship, and community leadership to
          address Pakistan's most pressing planetary health challenges.
        </p>
        <p>
          We believe that human health and the health of Earth's natural systems are inseparable. As climate
          change, pollution, biodiversity loss, and environmental degradation increasingly threaten communities
          across Pakistan, PHP serves as a collaborative platform for research, education, innovation, and policy
          engagement.
        </p>
        <p>
          Inspired by the journey <em className="text-ink-200">"From Echo to Eco,"</em> our mission is to transform
          awareness into action — moving beyond recognizing environmental challenges toward building practical,
          evidence-based solutions that create a healthier and more resilient future.
        </p>
      </Section>

      <Section eyebrow="Our Vision">
        <blockquote className="border-l-2 border-emerald-500 pl-4 italic text-ink-200">
          "To position Pakistan as a global pioneer in planetary health, where the well-being of people and the
          vitality of Earth's ecosystems are treated as one. By uniting medicine, mathematics, artificial
          intelligence, and environmental science, we envision a resilient Pakistan that safeguards both human life
          and planetary life for generations to come."
        </blockquote>
      </Section>

      <Section eyebrow="Our Mission" title="Planetary Health Pakistan is committed to:">
        <ul className="flex flex-col gap-3">
          {[
            { t: "Integrating Science and Society", d: "by bridging medicine, climate science, ecology, public health, and technology into a unified planetary health framework." },
            { t: "Developing Predictive Solutions", d: "through mathematical modelling, artificial intelligence, and planetary health indices to anticipate and prevent climate-related health risks." },
            { t: "Protecting Communities", d: "by designing evidence-based responses to Pakistan's most urgent challenges, including smog, floods, heatwaves, water scarcity, and environmentally linked diseases." },
            { t: "Empowering Youth", d: "by nurturing a nationwide network of Planetary Health Ambassadors committed to local and global sustainability." },
            { t: "Driving Global Leadership", d: "by contributing to international dialogue and supporting planetary health priorities aligned with the United Nations, the World Health Organization, and the Intergovernmental Panel on Climate Change." },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-xs font-bold text-emerald-400 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span><strong className="text-ink-100">{item.t}</strong> {item.d}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Organizational Infrastructure">
        <p>
          Planetary Health Pakistan is structured to foster interdisciplinary collaboration through a dedicated
          governing and operational framework.
        </p>

        <div className="mt-2 bg-ink-950/60 border border-ink-800 rounded p-4">
          <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">Governing Council</span>
          <p className="mt-1 text-ink-300">
            The Governing Council provides strategic direction, institutional oversight, and long-term vision for
            the organization.
          </p>
        </div>

        <div className="mt-3">
          <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">Core Operational Cells</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {[
              { t: "Planetary Health Index Cell", d: "Developing research, indicators, and evidence-based planetary health metrics." },
              { t: "Youth & Outreach Cell", d: "Building national engagement, education, ambassador programmes, and community partnerships." },
              { t: "Digital Transformation Cell", d: "Leading digital innovation, communications, artificial intelligence integration, and technology development." },
            ].map((cell, i) => (
              <div key={i} className="bg-ink-950/60 border border-ink-800 rounded p-4 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-ink-100">{cell.t}</span>
                <span className="text-[11px] text-ink-400 leading-relaxed">{cell.d}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3">
          Together, these pillars strengthen Planetary Health Pakistan's mission of creating science-driven
          solutions for healthier communities and a sustainable future.
        </p>
      </Section>

      <div className="text-center py-4">
        <span className="font-mono text-sm text-emerald-400 font-bold tracking-widest">
          PLANETARY HEALTH PAKISTAN — FROM ECHO TO ECO.
        </span>
      </div>
    </div>
  );
}
