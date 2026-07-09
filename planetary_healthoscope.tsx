import React, { useState, useEffect, useRef, useMemo } from "react";

const FONT_LINK_ID = "healthoscope-fonts";

function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);
}

const COLORS = {
  void: "#03080F",             // Deep space navy background
  panel: "#06101E",            // Corporate dark navy panel background
  panelLight: "#0C1E34",       // Highlighted panel state
  hairline: "#182E4B",         // Deep blue borders
  bone: "#ECF1F6",             // Crisp contrast text color
  boneFaint: "#7B96B4",        // Secondary slate-blue text
  logoDarkBlue: "#063067",     // PHP Globe Dark Blue
  logoDarkGreen: "#0B6822",    // PHP Leaf Dark Green (Stable State)
  logoForestGreen: "#006838",  // PHP Leaf Secondary Dark Green
  brandBlueBright: "#1E73E5",  // Enhanced UI highlight blue
  amber: "#E3A347",            // Warning threshold
  amberDim: "#5C411A",
  red: "#D64531",              // Critical distress threshold
  redDim: "#5A1C14",
  greenGlow: "#10B981"
};

function PHPLogo({ size = 42, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path
        d="M 22 84 C 8 62 21 34 44 40 C 58 45 68 28 74 22 C 78 44 67 68 42 74 C 32 76 24 80 22 84 Z"
        fill={COLORS.logoForestGreen}
      />
      <path
        d="M 22 84 C 32 74 54 68 76 74 C 74 58 68 48 62 46 C 48 43 32 58 22 84 Z"
        fill={COLORS.logoDarkGreen}
      />
      <path
        d="M 22 84 C 17 89 12 92 6 94 C 11 89 16 84 22 84 Z"
        stroke={COLORS.logoForestGreen}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="46" r="26" fill="#FFFFFF" />
      <g fill={COLORS.logoDarkBlue}>
        <path d="M 36 28 Q 42 22 48 24 T 48 30 T 40 32 Z" />
        <path d="M 30 34 Q 38 32 44 38 T 40 48 T 34 46 Z" />
        <path d="M 38 48 Q 44 54 41 68 T 48 72 T 46 58 T 38 50 Z" />
        <path d="M 46 22 Q 49 18 51 22 T 47 26 Z" />
        <path d="M 52 26 Q 62 24 71 30 T 73 42 T 64 46 T 55 40 Z" />
        <path d="M 58 46 Q 64 50 62 62 T 56 66 T 54 54 Z" />
      </g>
    </svg>
  );
}

const TARGETS = {
  temp: { ideal: 15, unit: "°C", name: "Pre-Industrial Baseline Limit", standard: "IPCC Paris Accord (+1.5°C ceiling)" },
  pm25: { ideal: 5, unit: "µg/m³", name: "WHO Maximum Air Density Limit", standard: "World Health Organization 2021 Guide" },
  deforest: { ideal: 10, unit: "%", name: "Max Canopy Fragmentation Threshold", standard: "UN SDG 15: Life on Land Target" }
};

const REGIONS = [
  { 
    id: "global", 
    name: "Earth (Global Composite)", 
    baseTemp: 16.5, 
    basePm25: 32, 
    baseDeforest: 22, 
    weightClimate: 0.35, 
    weightHuman: 0.35, 
    weightEco: 0.30,
    desc: "Averages global climate offsets with ocean sink buffers and systemic baseline metrics."
  },
  { 
    id: "pk_punjab", 
    name: "Pakistan (Punjab Smog Corridor)", 
    baseTemp: 32.5, 
    basePm25: 185, 
    baseDeforest: 48, 
    weightClimate: 0.45, 
    weightHuman: 0.40, 
    weightEco: 0.15,
    desc: "Severe micro-particulate trapping corridor with seasonal agro-waste burning dynamic."
  },
  { 
    id: "pk_karachi", 
    name: "Pakistan (Karachi Coastal Grid)", 
    baseTemp: 34.0, 
    basePm25: 88, 
    baseDeforest: 35, 
    weightClimate: 0.35, 
    weightHuman: 0.40, 
    weightEco: 0.25,
    desc: "Industrial maritime air column interfacing with localized mangrove depletion."
  },
  { 
    id: "us_cali", 
    name: "United States (California Forest-Wildfire)", 
    baseTemp: 26.5, 
    basePm25: 45, 
    baseDeforest: 28, 
    weightClimate: 0.35, 
    weightHuman: 0.35, 
    weightEco: 0.30,
    desc: "High vulnerability dry-season thermal convection zone triggering canopy collapse."
  },
  { 
    id: "br_amazon", 
    name: "Brazil (Amazon Deforestation Frontier)", 
    baseTemp: 28.2, 
    basePm25: 25, 
    baseDeforest: 72, 
    weightClimate: 0.20, 
    weightHuman: 0.30, 
    weightEco: 0.50,
    desc: "Crucial carbon-sink frontier with aggressive agricultural expansion profiling."
  },
  { 
    id: "in_delhi", 
    name: "India (Delhi NCR Air Corridor)", 
    baseTemp: 31.0, 
    basePm25: 165, 
    baseDeforest: 32, 
    weightClimate: 0.40, 
    weightHuman: 0.45, 
    weightEco: 0.15,
    desc: "Dense atmospheric stagnation layer combined with major urban thermal heat islands."
  },
  { 
    id: "de_rhine", 
    name: "Germany (Rhine Basin Industrial)", 
    baseTemp: 18.2, 
    basePm25: 14, 
    baseDeforest: 12, 
    weightClimate: 0.30, 
    weightHuman: 0.40, 
    weightEco: 0.30,
    desc: "Managed riverine basin with intensive transport emission buffers."
  }
];

const ALERTS_PRESETS = [
  { id: 1, type: "Climate", severity: "critical", region: "Punjab Corridor, Pakistan", text: "Wet-Bulb temperature crosses physical limit (35°C critical threshold) in irrigated zones.", time: "Just now" },
  { id: 2, type: "Air Quality", severity: "warning", region: "Karachi Port Zone", text: "Particulate loading spikes to 17.5x WHO ideal target; immediate clinical warnings active.", time: "12 min ago" },
  { id: 3, type: "Biophysical", severity: "warning", region: "Amazon basin, Acre Sector", text: "Canopy structural loss reduces moisture loop generation by an estimated 28%.", time: "2h ago" },
  { id: 4, type: "Vector Velocity", severity: "critical", region: "Lahore Metropolitan District", text: "Mosquito reproduction cycle length falls below 9 days due to thermal optimization.", time: "5h ago" }
];

function statusColor(score) {
  if (score >= 75) return COLORS.logoDarkGreen;       // Stable Green
  if (score >= 55) return COLORS.brandBlueBright;     // Guarded Blue
  if (score >= 40) return COLORS.amber;               // Stressed Orange
  return COLORS.red;                                  // Distress Red
}

function phiLabel(score) {
  if (score >= 75) return "SYSTEM STABLE / RESILIENT";
  if (score >= 55) return "GUARDED / ACTIVE MONITOR";
  if (score >= 40) return "CRITICAL DISTRESS SIGNAL";
  return "ACUTE SYSTEMIC COLLAPSE";
}

const runDiagnosticRequest = async (promptText, updateStatus) => {
  const apiKey = ""; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-preview:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are the primary AI clinical-ecological diagnostic engine of the Planetary Healthoscope (pioneered by Seemab Mehmood & Planetary Health Pakistan).
Analyze simulated parameters including Wet-Bulb stress, PM2.5 particle inhalation, and fragmentation rate relative to global targets. 
Keep your output extremely precise, metrics-driven, under 200 words, structured with clear clinical conclusions and target recommendations.`;

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      updateStatus(`Verifying PHP diagnostic core credentials (Attempt ${i + 1}/5)...`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`Diagnostic core status code: ${response.status}`);
      const data = await response.json();
      const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (outputText) return outputText;
      throw new Error("Received empty diagnostic packet");
    } catch (err) {
      if (i === 4) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

function PulseTrace({ healthScore }) {
  const [path, setPath] = useState("");
  const tRef = useRef(0);

  const speed = useMemo(() => Math.max(0.6, (110 - healthScore) / 45), [healthScore]);
  const arrhythm = useMemo(() => Math.max(0.1, (100 - healthScore) / 40), [healthScore]);

  useEffect(() => {
    let raf;
    const width = 1000;
    const points = 150;
    const height = 90;

    function genPath(t) {
      let d = `M 0 ${height / 2}`;
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const phase = (i / points) * Math.PI * 12 + t;
        let y = Math.sin(phase * 0.8) * 3;
        
        const spikeTrigger = (i + Math.floor(t * 15)) % 60;
        if (spikeTrigger < 3) {
          const mult = 1 - (spikeTrigger / 3);
          y -= mult * 32 * (1 + arrhythm * 0.4);
        } else if (spikeTrigger >= 3 && spikeTrigger < 6) {
          const mult = (spikeTrigger - 3) / 3;
          y += mult * 16;
        }

        if (healthScore < 60) {
          y += Math.sin(phase * 4.5) * (4 * arrhythm);
        }

        d += ` L ${x.toFixed(1)} ${(height / 2 + y).toFixed(1)}`;
      }
      return d;
    }

    function animate() {
      tRef.current += 0.05 * speed;
      setPath(genPath(tRef.current));
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [healthScore, speed, arrhythm]);

  const color = statusColor(healthScore);

  return (
    <svg viewBox="0 0 1000 90" preserveAspectRatio="none" style={{ width: "100%", height: 90, display: "block" }}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}bb)`, transition: "stroke 0.4s ease" }}
      />
    </svg>
  );
}

function BiophysicsPhysicsEngine({ simulatedTemp, simulatedPm25, simulatedDeforest, healthScore }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });

  // Handle pointer coordinate parsing
  const updateMouseCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
    
    // Account for canvas actual internal resolution scale
    mouseRef.current.x = (clientX - rect.left) * (canvas.width / rect.width);
    mouseRef.current.y = (clientY - rect.top) * (canvas.height / rect.height);
  };

  const injectParticleBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x: mouseRef.current.x + (Math.random() - 0.5) * 30,
        y: mouseRef.current.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        radius: Math.random() * 2.5 + 1.5,
        type: Math.random() > 0.4 ? "PM25" : "VECTOR",
        life: 1.0,
        pulseOffset: Math.random() * Math.PI
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Responsive high-DPI scaling
    const scale = window.devicePixelRatio || 1;
    const width = 480;
    const height = 260;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // Initial particle seeding reflecting current PM2.5 and vector profiles
    const count = Math.min(180, Math.floor(simulatedPm25 * 0.4 + (simulatedTemp - 15) * 2));
    particlesRef.current = Array.from({ length: count }, () => {
      const type = Math.random() > 0.4 ? "PM25" : "VECTOR";
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: type === "PM25" ? Math.random() * 2 + 1.2 : Math.random() * 3 + 2,
        type,
        life: Math.random() * 0.5 + 0.5,
        pulseOffset: Math.random() * Math.PI
      };
    });

    const runSim = () => {
      ctx.clearRect(0, 0, width, height);

      // Thermal convection calculation based on temperature parameter
      const baseTempFactor = Math.max(0, simulatedTemp - 15) / 30; // 0 to 1
      const updraft = baseTempFactor * 0.85; 
      const speedCap = 1.5 + baseTempFactor * 3.5;

      // Canopy cover factor acting as particulate absorption blocks
      const canopyLoss = simulatedDeforest / 100;
      const targetCanopyCount = Math.floor((1 - canopyLoss) * 6);
      const canopyNodes = [];
      for (let i = 0; i < targetCanopyCount; i++) {
        canopyNodes.push({
          x: (width / (targetCanopyCount + 1)) * (i + 1),
          y: height - 40,
          r: 22
        });
      }

      // Draw Canopy shield nodes
      canopyNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `${COLORS.logoDarkGreen}15`;
        ctx.strokeStyle = `${COLORS.logoDarkGreen}44`;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.font = "8px 'JetBrains Mono'";
        ctx.fillStyle = COLORS.logoDarkGreen;
        ctx.textAlign = "center";
        ctx.fillText("SHIELD", node.x, node.y + 3);
      });

      // Draw Biological Alveoli (Human Health receptor target area on left)
      const alveoli = { x: 30, y: height / 2, r: 40 };
      ctx.beginPath();
      ctx.arc(alveoli.x, alveoli.y, alveoli.r, 0, Math.PI * 2);
      ctx.fillStyle = `${COLORS.red}12`;
      ctx.strokeStyle = `${COLORS.red}35`;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.font = "8px 'JetBrains Mono'";
      ctx.fillStyle = COLORS.red;
      ctx.textAlign = "center";
      ctx.fillText("ALVEOLI", alveoli.x, alveoli.y - 4);
      ctx.fillText("BARRIER", alveoli.x, alveoli.y + 6);

      // Update and draw particles
      particlesRef.current.forEach((p, index) => {
        // Convection wind forces
        p.vy -= updraft * 0.05;
        p.vx += (Math.random() - 0.5) * 0.15;

        // Interaction with mouse pointer
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 70) {
          const force = (70 - dist) / 70;
          p.vx += (dx / dist) * force * 1.5;
          p.vy += (dy / dist) * force * 1.5;
        }

        // Limit speed
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > speedCap) {
          p.vx = (p.vx / speed) * speedCap;
          p.vy = (p.vy / speed) * speedCap;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wall limits & wraps
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) { p.y = height; p.vy = 0; }
        if (p.y > height) { p.y = 0; p.vy = 0; }

        // Dynamic collision with forest shield nodes (removes/absorbs particles)
        canopyNodes.forEach(node => {
          const cx = p.x - node.x;
          const cy = p.y - node.y;
          if (Math.hypot(cx, cy) < node.r) {
            p.x = Math.random() * width;
            p.y = 0;
            p.vx = (Math.random() - 0.5) * 2;
          }
        });

        // Dynamic collision with physiological alveoli barrier
        const ax = p.x - alveoli.x;
        const ay = p.y - alveoli.y;
        if (Math.hypot(ax, ay) < alveoli.r) {
          // Glow impact
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${COLORS.red}44`;
          ctx.fill();

          p.x = width;
          p.y = Math.random() * height;
        }

        // Color coding
        let pColor = COLORS.boneFaint;
        if (p.type === "PM25") {
          pColor = simulatedPm25 > 120 ? COLORS.amber : "#52759e";
        } else {
          pColor = simulatedTemp > 30 ? COLORS.red : COLORS.brandBlueBright;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.fill();
      });

      // Render interactive click indicators
      if (mouseRef.current.isDown) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 20, 0, Math.PI * 2);
        ctx.strokeStyle = `${COLORS.brandBlueBright}55`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(runSim);
    };

    runSim();
    return () => cancelAnimationFrame(animationRef.current);
  }, [simulatedTemp, simulatedPm25, simulatedDeforest]);

  return (
    <div className="relative rounded bg-slate-950 overflow-hidden border border-slate-800">
      <div className="absolute top-3 left-4 z-10 flex flex-col pointer-events-none">
        <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold">LIVE BIOPHYSICAL SIMULATION ENGINE</span>
        <span className="text-[11px] text-slate-300 font-medium">Physiological Inhalation & Canopy Shield Model</span>
      </div>
      <div className="absolute top-3 right-4 z-10 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/50 pointer-events-none">
        TOUCH/CLICK TO INTERACT
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={updateMouseCoords}
        onMouseDown={(e) => {
          mouseRef.current.isDown = true;
          updateMouseCoords(e);
          injectParticleBurst();
        }}
        onMouseUp={() => { mouseRef.current.isDown = false; }}
        onMouseLeave={() => { mouseRef.current.x = -1000; mouseRef.current.y = -1000; mouseRef.current.isDown = false; }}
        onTouchMove={updateMouseCoords}
        onTouchStart={(e) => {
          mouseRef.current.isDown = true;
          updateMouseCoords(e);
          injectParticleBurst();
        }}
        onTouchEnd={() => { mouseRef.current.isDown = false; }}
        style={{ width: "100%", height: 260, cursor: "crosshair" }}
      />
    </div>
  );
}

function PHIGauge({ value, label }) {
  const r = 85;
  const c = 100;
  const circ = 2 * Math.PI * r;
  const strokePct = value / 100;
  const dashOffset = circ - (circ * strokePct);
  const color = statusColor(value);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx={c} cy={c} r={r} fill="none" stroke={COLORS.hairline} strokeWidth="10" />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.1, 0.8, 0.2, 1), stroke 0.6s ease" }}
      />
      <text x={c} y={c - 4} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="800" fontSize="48" fill={COLORS.bone}>
        {Math.round(value)}
      </text>
      <text x={c} y={c + 32} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="10" letterSpacing="1" fill={color}>
        {label}
      </text>
    </svg>
  );
}

function SpatialMap({ selectedId, onSelect, regionalPhis }) {
  const nodes = [
    { id: "global", name: "Global Ocean", top: "18%", left: "45%" },
    { id: "us_cali", name: "US West Coast", top: "34%", left: "15%" },
    { id: "br_amazon", name: "Amazon Basin", top: "68%", left: "32%" },
    { id: "pk_punjab", name: "Pakistan (Punjab Core)", top: "36%", left: "62%" },
    { id: "pk_karachi", name: "Pakistan (Coastal)", top: "45%", left: "58%" },
    { id: "in_delhi", name: "India (NCR)", top: "40%", left: "70%" },
    { id: "de_rhine", name: "Germany (Rhine)", top: "25%", left: "50%" },
  ];

  return (
    <div className="relative w-full h-[260px] rounded overflow-hidden border border-slate-800" style={{ background: COLORS.void }}>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(${COLORS.logoDarkGreen} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.logoDarkGreen} 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent animate-[radarSweep_4s_linear_infinite]" />

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map(n => {
          if (n.id === "pk_punjab") return null;
          return (
            <line
              key={`line-${n.id}`}
              x1={n.left}
              y1={n.top}
              x2="62%"
              y2="36%"
              stroke={COLORS.brandBlueBright}
              strokeWidth="1.2"
              strokeDasharray="4 6"
              opacity="0.25"
            />
          );
        })}
      </svg>

      {nodes.map(n => {
        const phi = regionalPhis[n.id] || 50;
        const color = statusColor(phi);
        const isActive = selectedId === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            style={{
              position: "absolute",
              top: n.top,
              left: n.left,
              transform: "translate(-50%, -50%)",
              background: isActive ? `${color}25` : COLORS.panel,
              border: `1.5px solid ${color}`,
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.1, 0.8, 0.2, 1)",
              zIndex: isActive ? 10 : 1,
              boxShadow: isActive ? `0 0 14px ${color}` : "none",
            }}
            className="flex items-center gap-1.5 focus:outline-none"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: COLORS.bone }} className="uppercase">
              {n.id.replace("pk_", "").replace("us_", "").replace("br_", "").replace("de_", "")}: {Math.round(phi)}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-3 left-4 flex gap-4 font-mono text-[9px] text-slate-500">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.logoDarkGreen }} /> STABLE</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.brandBlueBright }} /> MODERATE</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.red }} /> CRITICAL</div>
      </div>
    </div>
  );
}

function TargetsTrackerPanel({ simulatedTemp, simulatedPm25, simulatedDeforest }) {
  const getDeviation = (sim, ideal, higherIsWorse = true) => {
    const diff = sim - ideal;
    if (higherIsWorse) {
      return diff > 0 ? { val: diff, bad: true } : { val: Math.abs(diff), bad: false };
    }
    return diff < 0 ? { val: Math.abs(diff), bad: true } : { val: diff, bad: false };
  };

  const tempDev = getDeviation(simulatedTemp, TARGETS.temp.ideal, true);
  const pmDev = getDeviation(simulatedPm25, TARGETS.pm25.ideal, true);
  const deforestDev = getDeviation(simulatedDeforest, TARGETS.deforest.ideal, true);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded p-5 flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] tracking-widest text-blue-400 font-bold">REAL-WORLD PRODUCTION DATA TARGETS</span>
        <h3 className="text-sm font-semibold text-slate-100">UN SDG & World Health Standard Compliance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temp Gap */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{TARGETS.temp.name}</span>
            <div className="text-xl font-bold mt-1 text-slate-100 font-mono">
              {simulatedTemp}{TARGETS.temp.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-500">Standard: {TARGETS.temp.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${tempDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {tempDev.bad ? `+${tempDev.val.toFixed(1)}°C Over Target` : "Inside Protected Limits"}
            </span>
          </div>
        </div>

        {/* PM2.5 Gap */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{TARGETS.pm25.name}</span>
            <div className="text-xl font-bold mt-1 text-slate-100 font-mono">
              {simulatedPm25} {TARGETS.pm25.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-500">Standard: {TARGETS.pm25.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${pmDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {pmDev.bad ? `+${pmDev.val.toFixed(0)} µg/m³ Deviation` : "Safe Zone Verified"}
            </span>
          </div>
        </div>

        {/* Forest Canopy Gap */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{TARGETS.deforest.name}</span>
            <div className="text-xl font-bold mt-1 text-slate-100 font-mono">
              {simulatedDeforest}{TARGETS.deforest.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-slate-500">Standard: {TARGETS.deforest.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${deforestDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {deforestDev.bad ? `+${deforestDev.val.toFixed(0)}% Habitat Loss` : "Resilient Canopy Cover"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useFonts();

  const [selectedRegionId, setSelectedRegionId] = useState("pk_punjab");
  const [simulatedTemp, setSimulatedTemp] = useState(32.5);
  const [simulatedPm25, setSimulatedPm25] = useState(185);
  const [simulatedDeforest, setSimulatedDeforest] = useState(48);
  const [activeTab, setActiveTab] = useState("climate");
  const [clock, setClock] = useState(new Date());

  const [regionalHistoricalPhis, setRegionalHistoricalPhis] = useState({
    global: [76, 75, 74, 75, 74, 74, 73, 74],
    pk_punjab: [48, 47, 45, 42, 41, 40, 39, 41],
    pk_karachi: [58, 57, 56, 54, 54, 53, 52, 53],
    us_cali: [68, 66, 65, 64, 65, 63, 62, 64],
    br_amazon: [54, 52, 50, 48, 49, 47, 46, 48],
    in_delhi: [45, 43, 42, 40, 41, 38, 37, 39],
    de_rhine: [82, 81, 80, 81, 81, 80, 79, 81],
  });

  const [terminalOutput, setTerminalOutput] = useState("Core active. Initialize 'AI DIAGNOSTIC SCAN' to cross-reference simulated physics with planetary thresholds.");
  const [loadingDiagnostic, setLoadingDiagnostic] = useState(false);
  const [customQuery, setCustomQuery] = useState("");

  const activeRegion = useMemo(() => {
    return REGIONS.find(r => r.id === selectedRegionId) || REGIONS[1];
  }, [selectedRegionId]);

  useEffect(() => {
    setSimulatedTemp(activeRegion.baseTemp);
    setSimulatedPm25(activeRegion.basePm25);
    setSimulatedDeforest(activeRegion.baseDeforest);
  }, [selectedRegionId, activeRegion]);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const computedMetrics = useMemo(() => {
    const tScore = Math.max(0, 100 - Math.max(0, simulatedTemp - TARGETS.temp.ideal) * 3.1);
    const pmScore = Math.max(0, 100 - Math.max(0, simulatedPm25 - TARGETS.pm25.ideal) * 0.55);
    const dScore = Math.max(0, 100 - Math.max(0, simulatedDeforest - TARGETS.deforest.ideal) * 1.15);

    const rawPhi = (tScore * activeRegion.weightClimate) + (pmScore * activeRegion.weightHuman) + (dScore * activeRegion.weightEco);
    const livePhi = Math.min(100, Math.max(0, Math.round(rawPhi)));

    const respRisk = Math.min(100, Math.round((Math.max(0, simulatedPm25 - 12) * 0.42) + (Math.max(0, simulatedTemp - 25) * 1.3)));
    const vectorR0 = (1.0 + (Math.max(0, simulatedTemp - 20) * 0.085) - (Math.max(0, simulatedDeforest - 30) * 0.004)).toFixed(2);

    return {
      livePhi,
      respRisk,
      vectorR0: Math.max(0.4, parseFloat(vectorR0)),
      biodiversityIndex: (1.0 - (simulatedDeforest * 0.0085)).toFixed(2),
      waterStressScore: Math.round(Math.min(100, (simulatedTemp * 2.3) + (simulatedDeforest * 0.45))),
    };
  }, [simulatedTemp, simulatedPm25, simulatedDeforest, activeRegion]);

  const currentRegionalPhis = useMemo(() => {
    const current = {};
    REGIONS.forEach(r => {
      if (r.id === selectedRegionId) {
        current[r.id] = computedMetrics.livePhi;
      } else {
        const tScore = Math.max(0, 100 - Math.max(0, r.baseTemp - TARGETS.temp.ideal) * 3.1);
        const pmScore = Math.max(0, 100 - Math.max(0, r.basePm25 - TARGETS.pm25.ideal) * 0.55);
        const dScore = Math.max(0, 100 - Math.max(0, r.baseDeforest - TARGETS.deforest.ideal) * 1.15);
        current[r.id] = Math.round((tScore * r.weightClimate) + (pmScore * r.weightHuman) + (dScore * r.weightEco));
      }
    });
    return current;
  }, [selectedRegionId, computedMetrics]);

  useEffect(() => {
    setRegionalHistoricalPhis(prev => {
      const history = [...(prev[selectedRegionId] || [50, 50, 50, 50, 50, 50, 50, 50])];
      history[history.length - 1] = computedMetrics.livePhi;
      return { ...prev, [selectedRegionId]: history };
    });
  }, [computedMetrics.livePhi, selectedRegionId]);

  const handleAiConsultation = async (customText = "") => {
    setLoadingDiagnostic(true);
    setTerminalOutput("Connecting to Planetary Health Pakistan Diagnostic Core...");
    try {
      let promptText = "";
      if (customText) {
        promptText = `Region: ${activeRegion.name}. Physics engine variables: average ambient temp: ${simulatedTemp}°C, air quality PM2.5 levels: ${simulatedPm25}µg/m³, forest cover loss: ${simulatedDeforest}%. User Query: "${customText}". Provide dynamic clinical feedback based on these planetary healthoscope limits.`;
      } else {
        promptText = `Perform immediate environmental-physiological risk assessment on ${activeRegion.name} baseline. Current state metrics: Ambient Temp ${simulatedTemp}°C, atmospheric PM2.5 at ${simulatedPm25}µg/m³, canopy fragmentation index at ${simulatedDeforest}%. Live planetary health score calculated is ${computedMetrics.livePhi}/100. Provide clear clinical projections on respiratory barrier penetration and vector transmission velocities.`;
      }

      const rawResult = await runDiagnosticRequest(promptText, (status) => setTerminalOutput(status));
      setTerminalOutput(rawResult);
    } catch (err) {
      setTerminalOutput(`[CONNECTION ERROR]: PHP network pathway timeout: ${err.message}. Confirm local clinical gateway permissions.`);
    } finally {
      setLoadingDiagnostic(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <PHPLogo size={46} />
            <div>
              <h1 className="font-mono font-extrabold text-lg tracking-wider text-slate-100 flex items-center gap-2">
                PLANETARY HEALTHOSCOPE <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">v3.0</span>
              </h1>
              <p className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
                THE STETHOSCOPE FOR EARTH · POWERED BY PLANETARY HEALTH PAKISTAN (PHP)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-slate-400">
            <div>MONITOR ZONE: <span className="text-slate-100 font-semibold">{activeRegion.name.toUpperCase()}</span></div>
            <div>UTC METRIC: <span className="text-blue-400">{clock.toLocaleTimeString("en-GB")}</span></div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" /> PHP CORE ACTIVE
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
        
        {/* Top Scope Area */}
        <section className="bg-slate-900/40 border border-slate-900 rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/20 flex justify-between items-center">
            <span className="font-mono text-[10px] tracking-widest text-blue-400 font-bold">
              ACTIVE SYSTEM BIOSPHERE OSCILLOSCOPE WAVE PATTERN
            </span>
            <span className="font-mono text-[10px] text-slate-500 uppercase">Resilience rhythm trace</span>
          </div>
          <PulseTrace healthScore={computedMetrics.livePhi} />
        </section>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Columns - Simulator Control Deck */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Dynamic Controls Deck */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-[10px] text-emerald-400 tracking-widest block uppercase font-bold">SIMULATOR DECK</span>
                  <h2 className="text-sm font-bold text-slate-100">Planetary Stress Diagnostics</h2>
                </div>
                <button
                  onClick={() => {
                    setSimulatedTemp(activeRegion.baseTemp);
                    setSimulatedPm25(activeRegion.basePm25);
                    setSimulatedDeforest(activeRegion.baseDeforest);
                  }}
                  className="font-mono text-[9px] bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800 transition-colors"
                >
                  RESET BASELINE
                </button>
              </div>

              {/* Stressor Sliders */}
              <div className="flex flex-col gap-6">
                
                {/* Temperature */}
                <div>
                  <div className="flex justify-between mb-2 text-xs font-mono">
                    <span className="text-slate-300">Wet-Bulb Temperature</span>
                    <span className={`font-bold ${simulatedTemp > 31 ? "text-amber-400" : "text-slate-100"}`}>
                      {simulatedTemp}°C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    step="0.5"
                    value={simulatedTemp}
                    onChange={(e) => setSimulatedTemp(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                    <span>15°C (WHO Baseline)</span>
                    <span>45°C (Extreme Danger)</span>
                  </div>
                </div>

                {/* Atmospheric Air Quality PM2.5 */}
                <div>
                  <div className="flex justify-between mb-2 text-xs font-mono">
                    <span className="text-slate-300">Atmospheric PM₂.₅ Density</span>
                    <span className={`font-bold ${simulatedPm25 > 100 ? "text-rose-400" : "text-slate-100"}`}>
                      {simulatedPm25} µg/m³
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="1"
                    value={simulatedPm25}
                    onChange={(e) => setSimulatedPm25(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                    <span>5 µg/m³ (WHO Target)</span>
                    <span>300 µg/m³ (Severe Plume)</span>
                  </div>
                </div>

                {/* Deforestation Rate */}
                <div>
                  <div className="flex justify-between mb-2 text-xs font-mono">
                    <span className="text-slate-300">Canopy Fragmentation</span>
                    <span className={`font-bold ${simulatedDeforest > 50 ? "text-amber-400" : "text-slate-100"}`}>
                      {simulatedDeforest}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={simulatedDeforest}
                    onChange={(e) => setSimulatedDeforest(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
                    <span>0% (Intact Biosphere)</span>
                    <span>100% (Absolute Loss)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Region presets & description */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5 flex flex-col gap-4">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 tracking-widest block uppercase font-bold">REGION INTERACTION LAYER</span>
                <h2 className="text-sm font-bold text-slate-100">Baseline Preset Profiles</h2>
              </div>
              
              <select
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 outline-none focus:border-blue-500 transition-colors"
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-950 text-slate-200">
                    {r.name.toUpperCase()}
                  </option>
                ))}
              </select>

              <div className="text-[11px] text-slate-400 font-medium leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-900">
                {activeRegion.desc}
              </div>
            </div>

          </div>

          {/* Right Columns - Readout / Terminal & Physics Simulations */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Real-time target performance widgets */}
            <TargetsTrackerPanel 
              simulatedTemp={simulatedTemp} 
              simulatedPm25={simulatedPm25} 
              simulatedDeforest={simulatedDeforest} 
            />

            {/* Primary Metrics Gauges Row */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* PHI Gauge Panel */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5 flex flex-col items-center justify-center md:col-span-2 text-center">
                <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-bold mb-4 self-start">
                  PLANETARY COMPOSITE INDEX
                </span>
                <PHIGauge value={computedMetrics.livePhi} label={phiLabel(computedMetrics.livePhi)} />
              </div>

              {/* Real-time Physiological Readout Panel */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5 md:col-span-3 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-bold block mb-4">
                    BIOPHYSICAL RESPONSIVENESS MATRIX
                  </span>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-900/60">
                      <div>
                        <span className="text-xs font-semibold block text-slate-200">Physiological Respiratory Admission Multiplier</span>
                        <span className="text-[10px] text-slate-500">Compound cellular particulate exposure risk</span>
                      </div>
                      <span className={`font-mono text-base font-extrabold ${computedMetrics.respRisk > 50 ? "text-rose-400" : "text-slate-200"}`}>
                        {computedMetrics.respRisk}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-slate-900/60">
                      <div>
                        <span className="text-xs font-semibold block text-slate-200">Vector Transmission Rate (R₀)</span>
                        <span className="text-[10px] text-slate-500">Optimized incubation cycles for localized pathogens</span>
                      </div>
                      <span className={`font-mono text-base font-extrabold ${computedMetrics.vectorR0 > 1.2 ? "text-amber-400" : "text-slate-200"}`}>
                        {computedMetrics.vectorR0}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold block text-slate-200">Thermodynamic Water stress</span>
                        <span className="text-[10px] text-slate-500">Canopy loss and extreme dry column vapor pressure deficit</span>
                      </div>
                      <span className={`font-mono text-base font-extrabold ${computedMetrics.waterStressScore > 60 ? "text-rose-400" : "text-slate-200"}`}>
                        {computedMetrics.waterStressScore} / 100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Biophysics Physics Engine Integration */}
            <BiophysicsPhysicsEngine
              simulatedTemp={simulatedTemp}
              simulatedPm25={simulatedPm25}
              simulatedDeforest={simulatedDeforest}
              healthScore={computedMetrics.livePhi}
            />

            {/* Gemini AI Expert Console Panel */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <span className="font-mono text-[9px] text-blue-400 tracking-widest block uppercase font-bold">
                    PLANETARY DIAGNOSTIC ENGINE (AI)
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">
                    Clinical Ecological Cross-Analysis
                  </h3>
                </div>
                <button
                  onClick={() => handleAiConsultation()}
                  disabled={loadingDiagnostic}
                  className="font-mono text-[10px] bg-emerald-600 hover:bg-emerald-700 text-slate-100 font-bold px-4 py-2 rounded shadow-md transition-all uppercase disabled:opacity-60"
                >
                  {loadingDiagnostic ? "DOCKING AI..." : "RUN AI DIAGNOSTIC SCAN"}
                </button>
              </div>

              {/* AI Terminal output console */}
              <div className="bg-slate-950 border border-slate-900 rounded p-4 h-[150px] overflow-y-auto mb-4 font-mono text-[11px] leading-relaxed text-slate-300">
                <p className={`${loadingDiagnostic ? "text-blue-400" : "text-slate-300"} whitespace-pre-line`}>
                  {terminalOutput}
                </p>
              </div>

              {/* Dynamic console prompt input query */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask a specific PHP target benchmark, physiological, or simulation query..."
                  className="flex-1 bg-slate-950 border border-slate-900 rounded px-3 py-2 text-xs text-slate-200 outline-none focus:border-emerald-500 transition-colors font-sans"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customQuery.trim()) {
                      handleAiConsultation(customQuery);
                      setCustomQuery("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customQuery.trim()) {
                      handleAiConsultation(customQuery);
                      setCustomQuery("");
                    }
                  }}
                  disabled={loadingDiagnostic || !customQuery.trim()}
                  className="font-mono text-xs bg-slate-900 border border-slate-800 hover:border-blue-500 text-slate-200 px-4 py-2 rounded transition-colors disabled:opacity-50"
                >
                  SEND
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Global Map Scope & Dynamic Diagnostic Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Spatial Telemetry Grid - Left */}
          <div className="lg:col-span-5 bg-slate-900/40 border border-slate-900 rounded-lg p-5">
            <span className="font-mono text-[9px] text-emerald-400 tracking-widest block uppercase font-bold mb-3">
              SPATIAL TELEMETRY FEED
            </span>
            <h3 className="text-sm font-bold text-slate-100 mb-4">
              Geographic Monitoring Matrix
            </h3>
            <SpatialMap selectedId={selectedRegionId} onSelect={setSelectedRegionId} regionalPhis={currentRegionalPhis} />
          </div>

          {/* Vitals breakdown tabs - Right */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-900 rounded-lg p-5 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <span className="font-mono text-[9px] text-emerald-400 tracking-widest block uppercase font-bold">
                  DIAGNOSTIC DATA CHANNELS
                </span>
                <h3 className="text-sm font-bold text-slate-100">
                  Target Breakdowns & Compliance
                </h3>
              </div>
              <div className="flex gap-2 font-mono text-[9px]">
                {["climate", "human", "ecosystem"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded uppercase border tracking-wider transition-all font-bold ${
                      activeTab === tab 
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                        : "border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center divide-y divide-slate-900/80">
              {activeTab === "climate" && (
                <>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Global Wet-Bulb Stress Level</span>
                      <span className="text-[10px] text-slate-500">Extreme thermal heat stress threshold index</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedTemp > 35 ? "text-rose-400" : "text-slate-400"}`}>
                      {simulatedTemp > 35 ? "CRITICAL RISK" : "STABLE COMPLIANCE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Flood Vulnerability Profile</span>
                      <span className="text-[10px] text-slate-500">Precipitation anomalies and localized run-off buffers</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedTemp > 32 ? "text-amber-400" : "text-emerald-400"}`}>
                      {simulatedTemp > 32 ? "ELEVATED VULNERABILITY" : "OPTIMAL CONDITIONS"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Atmospheric Stagnation Rating</span>
                      <span className="text-[10px] text-slate-500">Aerosol micro-particle air trapping factor</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedPm25 > 150 ? "text-rose-400" : "text-emerald-400"}`}>
                      {simulatedPm25 > 150 ? "SEVERE POLLUTION LOAD" : "SAFE THRESHOLD LIMIT"}
                    </span>
                  </div>
                </>
              )}

              {activeTab === "human" && (
                <>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Outbreak Vector Speed</span>
                      <span className="text-[10px] text-slate-500">Thermal acceleration multiplier on reproduction rate</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${computedMetrics.vectorR0 > 1.3 ? "text-rose-400" : "text-slate-400"}`}>
                      {computedMetrics.vectorR0 > 1.3 ? "ACCELERATING CYCLES" : "DORMANT DYNAMICS"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Respiratory Stress Factor</span>
                      <span className="text-[10px] text-slate-500">Soot micro-particle inhalation collision index</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${computedMetrics.respRisk > 60 ? "text-rose-400" : "text-emerald-400"}`}>
                      {computedMetrics.respRisk > 60 ? "CRITICAL OUTBREAK THREAT" : "STABLE PATHWAY LIMIT"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Eco-Anxiety / Environmental Displacement</span>
                      <span className="text-[10px] text-slate-500">Systemic biome collapse psychological impact factor</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedDeforest > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                      {simulatedDeforest > 50 ? "MAX BIOSPHERE STRESS" : "NORMAL LIMIT"}
                    </span>
                  </div>
                </>
              )}

              {activeTab === "ecosystem" && (
                <>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Biodiversity Preservation Coefficient</span>
                      <span className="text-[10px] text-slate-500">Ecosystem forest canopy structural conservation</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {computedMetrics.biodiversityIndex}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Hydrological Basin Sieve Efficiency</span>
                      <span className="text-[10px] text-slate-500">Precipitation holding efficiency of intact roots</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedDeforest > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                      {simulatedDeforest > 40 ? "COMPROMISED RECHARGE" : "OPTIMAL SATURATION RATE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <span className="text-xs font-semibold block text-slate-200">Ocean Acidification Buffer</span>
                      <span className="text-[10px] text-slate-500">Marine thermal capacity and offset threshold</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${simulatedTemp > 30 ? "text-amber-400" : "text-emerald-400"}`}>
                      {simulatedTemp > 30 ? "ACIDIFYING PROFILE" : "BALANCED EXCHANGE RATE"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Triage Alerts System */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-mono text-[9px] text-emerald-400 tracking-widest block uppercase font-bold">
                TRIAGE ALERTER SYSTEM
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Active Operational Notifications
              </h3>
            </div>
            <span className="font-mono text-[9px] text-rose-400 border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 rounded font-bold">
              2 ACTIVE CRITICAL ANOMALIES
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {ALERTS_PRESETS.map(alert => {
              const borderTheme = alert.severity === "critical" ? "border-rose-900/60 bg-rose-950/20" : "border-amber-900/60 bg-amber-950/20";
              const lineTheme = alert.severity === "critical" ? "bg-rose-500" : "bg-amber-500";
              const labelTheme = alert.severity === "critical" ? "text-rose-400" : "text-amber-400";
              return (
                <div key={alert.id} className={`flex gap-4 p-4 border rounded ${borderTheme}`}>
                  <div className={`w-1 rounded-full ${lineTheme}`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className={`font-mono text-[9px] font-bold uppercase ${labelTheme}`}>
                        {alert.type} · {alert.region}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{alert.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console Footing */}
        <footer className="border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-slate-500 font-mono text-[10px]">
          <span>PLANETARY HEALTHOSCOPE SYSTEM · ARCHITECTURE SPECIFICATION v3.0</span>
          <span>FOUNDER CONCEPT: SEEMAB MEHMOOD · PHP INTEGRATION COMPLIANT</span>
        </footer>

      </main>

      <style>{`
        @keyframes radarSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}