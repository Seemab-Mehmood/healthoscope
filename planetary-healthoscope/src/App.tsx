import React, { useState, useEffect, useRef, useMemo } from "react";
import { WHO_COUNTRIES, WHO_REGION_ORDER, WHO_REGION_LABELS } from "./data/whoCountries";
import { useLiveEnvironmentalData } from "./hooks/useLiveEnvironmentalData";
import AboutUsPage from "./components/AboutUsPage";
import HowWeWorkPage from "./components/HowWeWorkPage";
import ActionInsightsPanel from "./components/ActionInsightsPanel";

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

const COLORS_DARK = {
  void: "#08120D",             // Deep forest-black background (logo-rooted, not navy)
  panel: "#0D1E15",            // Panel background
  panelLight: "#16301F",       // Highlighted panel state
  hairline: "#1F3D2A",         // Deep green borders
  bone: "#EAF3EC",             // Crisp contrast text color
  boneFaint: "#8FB79C",        // Secondary muted text
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

const COLORS_LIGHT = {
  void: "#F6FAF7",             // Light background, faint green tint (logo-rooted)
  panel: "#FFFFFF",
  panelLight: "#EAF3EC",
  hairline: "#D6E4DB",
  bone: "#0C1A12",             // Dark text on light background
  boneFaint: "#4C6B57",
  logoDarkBlue: "#063067",
  logoDarkGreen: "#0B6822",
  logoForestGreen: "#006838",
  brandBlueBright: "#1462C9",
  amber: "#B87418",
  amberDim: "#F3E0C2",
  red: "#B23223",
  redDim: "#F5D9D3",
  greenGlow: "#0E9F70"
};

function useColors(theme) {
  return theme === "light" ? COLORS_LIGHT : COLORS_DARK;
}

// Backwards-compatible default export used by module-scope helpers below
// (status color / label helpers are theme-agnostic since they're used for
// semantic meaning, not surface rendering).
const COLORS = COLORS_DARK;

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

function statusColor(score, colors = COLORS_DARK) {
  if (score >= 75) return colors.logoDarkGreen;       // Stable Green
  if (score >= 55) return colors.brandBlueBright;     // Guarded Blue
  if (score >= 40) return colors.amber;               // Stressed Orange
  return colors.red;                                  // Distress Red
}

function phiLabel(score) {
  if (score >= 75) return "SYSTEM STABLE / RESILIENT";
  if (score >= 55) return "GUARDED / ACTIVE MONITOR";
  if (score >= 40) return "CRITICAL DISTRESS SIGNAL";
  return "ACUTE SYSTEMIC COLLAPSE";
}

function PulseTrace({ healthScore, colors = COLORS_DARK }) {
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

function BiophysicsPhysicsEngine({ simulatedTemp, simulatedPm25, simulatedDeforest, healthScore, colors = COLORS_DARK }) {
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
        ctx.fillStyle = `${colors.logoDarkGreen}15`;
        ctx.strokeStyle = `${colors.logoDarkGreen}44`;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.font = "8px 'JetBrains Mono'";
        ctx.fillStyle = colors.logoDarkGreen;
        ctx.textAlign = "center";
        ctx.fillText("SHIELD", node.x, node.y + 3);
      });

      // Draw Biological Alveoli (Human Health receptor target area on left)
      const alveoli = { x: 30, y: height / 2, r: 40 };
      ctx.beginPath();
      ctx.arc(alveoli.x, alveoli.y, alveoli.r, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.red}12`;
      ctx.strokeStyle = `${colors.red}35`;
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.font = "8px 'JetBrains Mono'";
      ctx.fillStyle = colors.red;
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
          ctx.fillStyle = `${colors.red}44`;
          ctx.fill();

          p.x = width;
          p.y = Math.random() * height;
        }

        // Color coding
        let pColor = colors.boneFaint;
        if (p.type === "PM25") {
          pColor = simulatedPm25 > 120 ? colors.amber : "#52759e";
        } else {
          pColor = simulatedTemp > 30 ? colors.red : colors.brandBlueBright;
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
        ctx.strokeStyle = `${colors.brandBlueBright}55`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(runSim);
    };

    runSim();
    return () => cancelAnimationFrame(animationRef.current);
  }, [simulatedTemp, simulatedPm25, simulatedDeforest]);

  return (
    <div className="relative rounded bg-ink-950 overflow-hidden border border-ink-800">
      <div className="absolute top-3 left-4 z-10 flex flex-col pointer-events-none">
        <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold">LIVE BIOPHYSICAL SIMULATION ENGINE</span>
        <span className="text-[11px] text-ink-300 font-medium">Physiological Inhalation & Canopy Shield Model</span>
      </div>
      <div className="absolute top-3 right-4 z-10 text-[9px] font-mono text-ink-400 bg-ink-900/80 px-2 py-0.5 rounded border border-ink-700/50 pointer-events-none">
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

function PHIGauge({ value, label, colors = COLORS_DARK }) {
  const r = 85;
  const c = 100;
  const circ = 2 * Math.PI * r;
  const strokePct = value / 100;
  const dashOffset = circ - (circ * strokePct);
  const color = statusColor(value);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx={c} cy={c} r={r} fill="none" stroke={colors.hairline} strokeWidth="10" />
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
      <text x={c} y={c - 4} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="800" fontSize="48" fill={colors.bone}>
        {Math.round(value)}
      </text>
      <text x={c} y={c + 32} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="10" letterSpacing="1" fill={color}>
        {label}
      </text>
    </svg>
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
    <div className="bg-ink-900/60 border border-ink-800 rounded p-5 flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] tracking-widest text-blue-400 font-bold">REAL-WORLD PRODUCTION DATA TARGETS</span>
        <h3 className="text-sm font-semibold text-ink-100">UN SDG & World Health Standard Compliance</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temp Gap */}
        <div className="bg-ink-950/80 border border-ink-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">{TARGETS.temp.name}</span>
            <div className="text-xl font-bold mt-1 text-ink-100 font-mono">
              {simulatedTemp}{TARGETS.temp.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ink-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-ink-500">Standard: {TARGETS.temp.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${tempDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {tempDev.bad ? `+${tempDev.val.toFixed(1)}°C Over Target` : "Inside Protected Limits"}
            </span>
          </div>
        </div>

        {/* PM2.5 Gap */}
        <div className="bg-ink-950/80 border border-ink-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">{TARGETS.pm25.name}</span>
            <div className="text-xl font-bold mt-1 text-ink-100 font-mono">
              {simulatedPm25} {TARGETS.pm25.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ink-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-ink-500">Standard: {TARGETS.pm25.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${pmDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {pmDev.bad ? `+${pmDev.val.toFixed(0)} µg/m³ Deviation` : "Safe Zone Verified"}
            </span>
          </div>
        </div>

        {/* Forest Canopy Gap */}
        <div className="bg-ink-950/80 border border-ink-800/80 rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">{TARGETS.deforest.name}</span>
            <div className="text-xl font-bold mt-1 text-ink-100 font-mono">
              {simulatedDeforest}{TARGETS.deforest.unit}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-ink-800/60 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-ink-500">Standard: {TARGETS.deforest.standard}</span>
            <span className={`text-[10px] font-mono font-bold ${deforestDev.bad ? "text-rose-400" : "text-emerald-400"}`}>
              {deforestDev.bad ? `+${deforestDev.val.toFixed(0)}% Habitat Loss` : "Resilient Canopy Cover"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(min, max, v) {
  return Math.max(min, Math.min(max, v));
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-wider bg-ink-900 hover:bg-ink-800 text-ink-300 hover:text-ink-100 border border-ink-800 px-3 py-1.5 rounded transition-colors"
      aria-label="Toggle light or dark theme"
    >
      {theme === "dark" ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          LIGHT MODE
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          DARK MODE
        </>
      )}
    </button>
  );
}

function CountrySelector({ selectedCountry, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? WHO_COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q))
      : WHO_COUNTRIES;
    return list.slice(0, 60);
  }, [query]);

  const grouped = useMemo(() => {
    const g = {};
    WHO_REGION_ORDER.forEach(r => (g[r] = []));
    filtered.forEach(c => {
      if (!g[c.whoRegion]) g[c.whoRegion] = [];
      g[c.whoRegion].push(c);
    });
    return g;
  }, [filtered]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full font-mono text-xs bg-ink-950 border border-ink-800 rounded p-2.5 text-ink-200 outline-none focus:border-blue-500 transition-colors text-left flex justify-between items-center"
      >
        <span>
          {selectedCountry.name.toUpperCase()}
          <span className="text-ink-500"> · {selectedCountry.capital}</span>
        </span>
        <span className="text-ink-500 text-[9px] font-bold">{selectedCountry.whoRegion}</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-ink-900 border border-ink-800 rounded shadow-2xl overflow-hidden">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search WHO member state or capital city..."
            className="w-full bg-ink-950 border-b border-ink-800 px-3 py-2 text-xs text-ink-200 outline-none font-sans"
          />
          <div className="max-h-64 overflow-y-auto">
            {WHO_REGION_ORDER.map(region => {
              const items = grouped[region] || [];
              if (items.length === 0) return null;
              return (
                <div key={region}>
                  <div className="px-3 py-1 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-ink-950/60 sticky top-0">
                    {WHO_REGION_LABELS[region]} ({region})
                  </div>
                  {items.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelect(c);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-ink-800 transition-colors ${
                        c.id === selectedCountry.id ? "text-emerald-400 bg-ink-800/50" : "text-ink-300"
                      }`}
                    >
                      {c.name} <span className="text-ink-500">· {c.capital}</span>
                    </button>
                  ))}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-ink-500 text-center">No matches found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  useFonts();

  const [page, setPage] = useState("dashboard"); // 'dashboard' | 'about' | 'how'

  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem("healthoscope-theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const colors = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  useEffect(() => {
    try {
      window.localStorage.setItem("healthoscope-theme", theme);
    } catch {
      // localStorage unavailable; theme just won't persist across reloads
    }
  }, [theme]);

  const defaultCountry = WHO_COUNTRIES.find(c => c.id === "PAK") || WHO_COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [mode, setMode] = useState("live"); // 'live' | 'simulator'
  const [activeTab, setActiveTab] = useState("climate");
  const [clock, setClock] = useState(new Date());

  const liveData = useLiveEnvironmentalData(selectedCountry.lat, selectedCountry.lng, selectedCountry.id);

  const [simTemp, setSimTemp] = useState(28);
  const [simPm25, setSimPm25] = useState(60);
  const [simDeforest, setSimDeforest] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Seed the simulator sliders from live data whenever it successfully loads,
  // so "what-if" exploration starts from a real baseline.
  useEffect(() => {
    if (liveData.tempC !== null) setSimTemp(Math.round(liveData.tempC * 10) / 10);
    if (liveData.pm25 !== null) setSimPm25(Math.round(liveData.pm25));
    if (liveData.forestPct !== null) setSimDeforest(clamp(0, 100, Math.round(100 - liveData.forestPct)));
  }, [liveData.tempC, liveData.pm25, liveData.forestPct]);

  const activeTemp = mode === "live" ? liveData.tempC : simTemp;
  const activePm25 = mode === "live" ? liveData.pm25 : simPm25;
  const activeDeforest = mode === "live"
    ? (liveData.forestPct !== null ? clamp(0, 100, 100 - liveData.forestPct) : null)
    : simDeforest;
  const hasCoreData = activeTemp !== null && activePm25 !== null;

  const computedMetrics = useMemo(() => {
    if (!hasCoreData) return null;

    const tScore = clamp(0, 100, 100 - Math.max(0, activeTemp - TARGETS.temp.ideal) * 3.1);
    const pmScore = clamp(0, 100, 100 - Math.max(0, activePm25 - TARGETS.pm25.ideal) * 0.55);
    const hasEco = activeDeforest !== null;
    const dScore = hasEco ? clamp(0, 100, 100 - Math.max(0, activeDeforest - TARGETS.deforest.ideal) * 1.15) : null;

    const rawPhi = hasEco
      ? (tScore * 0.4) + (pmScore * 0.4) + (dScore * 0.2)
      : (tScore * 0.5) + (pmScore * 0.5);
    const livePhi = clamp(0, 100, Math.round(rawPhi));

    const respRisk = clamp(0, 100, Math.round((Math.max(0, activePm25 - 12) * 0.42) + (Math.max(0, activeTemp - 25) * 1.3)));
    const vectorR0raw = 1.0 + (Math.max(0, activeTemp - 20) * 0.085) - (hasEco ? Math.max(0, activeDeforest - 30) * 0.004 : 0);

    return {
      livePhi,
      respRisk,
      vectorR0: Math.max(0.4, parseFloat(vectorR0raw.toFixed(2))),
      biodiversityIndex: hasEco ? (1.0 - (activeDeforest * 0.0085)).toFixed(2) : null,
      waterStressScore: clamp(0, 100, Math.round((activeTemp * 2.3) + ((activeDeforest ?? 30) * 0.45))),
      hasEco,
      tScore,
      pmScore,
      dScore,
    };
  }, [activeTemp, activePm25, activeDeforest, hasCoreData]);

  const displayDeforest = activeDeforest !== null ? activeDeforest : 30;

  return (
    <div data-theme={theme} className="min-h-screen bg-ink-950 text-ink-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300 transition-colors duration-300">

      {/* Dynamic Header */}
      <header className="border-b border-ink-900 bg-ink-900/40 backdrop-blur-xl px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <PHPLogo size={46} />
              <div>
                <h1 className="font-mono font-extrabold text-lg tracking-wider text-ink-100 flex items-center gap-2">
                  PLANETARY HEALTHOSCOPE <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">v4.0</span>
                </h1>
                <p className="font-mono text-[9px] tracking-widest text-ink-400 uppercase">
                  THE STETHOSCOPE FOR EARTH · POWERED BY PLANETARY HEALTH PAKISTAN (PHP)
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-ink-400">
              {page === "dashboard" && (
                <>
                  <div>MONITOR ZONE: <span className="text-ink-100 font-semibold">{selectedCountry.name.toUpperCase()}</span></div>
                  <div>LOCAL CLOCK: <span className="text-blue-400">{clock.toLocaleTimeString("en-GB")}</span></div>
                  {mode === "live" ? (
                    liveData.loading ? (
                      <div className="flex items-center gap-2 text-blue-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> FETCHING LIVE DATA...
                      </div>
                    ) : liveData.error && activeTemp === null && activePm25 === null ? (
                      <div className="flex items-center gap-2 text-rose-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-rose-400" /> LIVE FEED UNAVAILABLE
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" /> LIVE DATA CONNECTED
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-amber-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> SCENARIO SIMULATOR (NOT LIVE)
                    </div>
                  )}
                </>
              )}
              <ThemeToggle theme={theme} onToggle={() => setTheme(t => (t === "dark" ? "light" : "dark"))} />
            </div>
          </div>

          <nav className="flex gap-2 font-mono text-[10px]">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "about", label: "About Us" },
              { id: "how", label: "How We Work" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                className={`px-3 py-1.5 rounded uppercase border tracking-wider transition-all font-bold ${
                  page === tab.id
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-ink-800 text-ink-500 hover:text-ink-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {page === "about" && <AboutUsPage />}
      {page === "how" && <HowWeWorkPage />}

      {/* Main Container */}
      {page === "dashboard" && (
      <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Top Scope Area */}
        <section className="bg-ink-900/40 border border-ink-900 rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-ink-900 bg-ink-950/20 flex justify-between items-center">
            <span className="font-mono text-[10px] tracking-widest text-blue-400 font-bold">
              ACTIVE SYSTEM BIOSPHERE OSCILLOSCOPE WAVE PATTERN
            </span>
            <span className="font-mono text-[10px] text-ink-500 uppercase">Resilience rhythm trace</span>
          </div>
          <PulseTrace healthScore={computedMetrics?.livePhi ?? 50} colors={colors} />
        </section>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Columns - Location & Mode */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Region interaction layer */}
            <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 flex flex-col gap-4">
              <div>
                <span className="font-mono text-[10px] text-emerald-400 tracking-widest block uppercase font-bold">REGION INTERACTION LAYER</span>
                <h2 className="text-sm font-bold text-ink-100">WHO Member State Selector</h2>
                <p className="text-[10px] text-ink-500 mt-1">193 WHO member states · capital-city coordinates</p>
              </div>

              <CountrySelector selectedCountry={selectedCountry} onSelect={setSelectedCountry} />

              <div className="flex gap-2 font-mono text-[9px]">
                <button
                  onClick={() => setMode("live")}
                  className={`flex-1 px-3 py-2 rounded uppercase border tracking-wider transition-all font-bold ${
                    mode === "live"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-ink-800 text-ink-500 hover:text-ink-300"
                  }`}
                >
                  Live Data
                </button>
                <button
                  onClick={() => setMode("simulator")}
                  className={`flex-1 px-3 py-2 rounded uppercase border tracking-wider transition-all font-bold ${
                    mode === "simulator"
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-ink-800 text-ink-500 hover:text-ink-300"
                  }`}
                >
                  Scenario Simulator
                </button>
              </div>

              {mode === "live" && (
                <div className="text-[10px] text-ink-500 font-mono leading-relaxed bg-ink-950/40 p-3 rounded border border-ink-900 flex flex-col gap-1">
                  <span>Temperature: Open-Meteo forecast API (hourly model update)</span>
                  <span>PM2.5: Open-Meteo Air Quality API (CAMS-based)</span>
                  <span>
                    Forest cover: World Bank Open Data{liveData.forestYear ? ` · latest reported year ${liveData.forestYear}` : ""} — periodic dataset, not live
                  </span>
                </div>
              )}
            </div>

            {mode === "simulator" && (
              <div className="bg-ink-900/40 border border-amber-900/40 rounded-lg p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] text-amber-400 tracking-widest block uppercase font-bold">SCENARIO SIMULATOR</span>
                    <h2 className="text-sm font-bold text-ink-100">Hypothetical What-If Explorer</h2>
                  </div>
                  <button
                    onClick={() => {
                      if (liveData.tempC !== null) setSimTemp(Math.round(liveData.tempC * 10) / 10);
                      if (liveData.pm25 !== null) setSimPm25(Math.round(liveData.pm25));
                      if (liveData.forestPct !== null) setSimDeforest(clamp(0, 100, Math.round(100 - liveData.forestPct)));
                    }}
                    className="font-mono text-[9px] bg-ink-950 hover:bg-ink-900 text-ink-400 hover:text-ink-200 px-2 py-1 rounded border border-ink-800 transition-colors"
                  >
                    RESET TO LIVE BASELINE
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex justify-between mb-2 text-xs font-mono">
                      <span className="text-ink-300">Ambient Temperature</span>
                      <span className={`font-bold ${simTemp > 31 ? "text-amber-400" : "text-ink-100"}`}>{simTemp}°C</span>
                    </div>
                    <input
                      type="range" min="15" max="45" step="0.5" value={simTemp}
                      onChange={e => setSimTemp(parseFloat(e.target.value))}
                      className="w-full h-1 bg-ink-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] text-ink-500 font-mono mt-2">
                      <span>15°C (WHO Baseline)</span>
                      <span>45°C (Extreme Danger)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-xs font-mono">
                      <span className="text-ink-300">Atmospheric PM₂.₅ Density</span>
                      <span className={`font-bold ${simPm25 > 100 ? "text-rose-400" : "text-ink-100"}`}>{simPm25} µg/m³</span>
                    </div>
                    <input
                      type="range" min="5" max="300" step="1" value={simPm25}
                      onChange={e => setSimPm25(parseInt(e.target.value))}
                      className="w-full h-1 bg-ink-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] text-ink-500 font-mono mt-2">
                      <span>5 µg/m³ (WHO Target)</span>
                      <span>300 µg/m³ (Severe Plume)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2 text-xs font-mono">
                      <span className="text-ink-300">Canopy Fragmentation</span>
                      <span className={`font-bold ${simDeforest > 50 ? "text-amber-400" : "text-ink-100"}`}>{simDeforest}%</span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="1" value={simDeforest}
                      onChange={e => setSimDeforest(parseInt(e.target.value))}
                      className="w-full h-1 bg-ink-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] text-ink-500 font-mono mt-2">
                      <span>0% (Intact Biosphere)</span>
                      <span>100% (Absolute Loss)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === "live" && (
              <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 flex flex-col gap-3">
                <span className="font-mono text-[10px] text-blue-400 tracking-widest block uppercase font-bold">LIVE FEED TIMESTAMPS</span>
                <div className="text-[11px] font-mono text-ink-400 flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span>Temperature fetched</span>
                    <span className="text-ink-200">{liveData.tempFetchedAt ? liveData.tempFetchedAt.toLocaleTimeString() : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PM2.5 fetched</span>
                    <span className="text-ink-200">{liveData.pm25FetchedAt ? liveData.pm25FetchedAt.toLocaleTimeString() : "—"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Columns - Readout & Physics Simulations */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {hasCoreData ? (
              <>
                <TargetsTrackerPanel
                  simulatedTemp={activeTemp}
                  simulatedPm25={activePm25}
                  simulatedDeforest={displayDeforest}
                />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 flex flex-col items-center justify-center md:col-span-2 text-center">
                    <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-bold mb-4 self-start">
                      PLANETARY COMPOSITE INDEX
                    </span>
                    <PHIGauge value={computedMetrics.livePhi} label={phiLabel(computedMetrics.livePhi)} colors={colors} />
                    {!computedMetrics.hasEco && (
                      <span className="text-[9px] font-mono text-ink-500 mt-3">
                        Ecosystem dimension unavailable for this state — score reflects climate + air quality only
                      </span>
                    )}
                  </div>

                  <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 md:col-span-3 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-emerald-400 tracking-widest uppercase font-bold block mb-4">
                        BIOPHYSICAL RESPONSIVENESS MATRIX
                      </span>
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-3 border-b border-ink-900/60">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Physiological Respiratory Admission Multiplier</span>
                            <span className="text-[10px] text-ink-500">Compound cellular particulate exposure risk</span>
                          </div>
                          <span className={`font-mono text-base font-extrabold ${computedMetrics.respRisk > 50 ? "text-rose-400" : "text-ink-200"}`}>
                            {computedMetrics.respRisk}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-ink-900/60">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Vector Transmission Rate (R₀)</span>
                            <span className="text-[10px] text-ink-500">Optimized incubation cycles for localized pathogens</span>
                          </div>
                          <span className={`font-mono text-base font-extrabold ${computedMetrics.vectorR0 > 1.2 ? "text-amber-400" : "text-ink-200"}`}>
                            {computedMetrics.vectorR0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Thermodynamic Water Stress</span>
                            <span className="text-[10px] text-ink-500">Canopy loss and extreme dry column vapor pressure deficit</span>
                          </div>
                          <span className={`font-mono text-base font-extrabold ${computedMetrics.waterStressScore > 60 ? "text-rose-400" : "text-ink-200"}`}>
                            {computedMetrics.waterStressScore} / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <BiophysicsPhysicsEngine
                  simulatedTemp={activeTemp}
                  simulatedPm25={activePm25}
                  simulatedDeforest={displayDeforest}
                  healthScore={computedMetrics.livePhi}
                  colors={colors}
                />

                <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-5 flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <span className="font-mono text-[9px] text-emerald-400 tracking-widest block uppercase font-bold">
                        DIAGNOSTIC DATA CHANNELS
                      </span>
                      <h3 className="text-sm font-bold text-ink-100">
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
                              : "border-ink-800 text-ink-500 hover:text-ink-300"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center divide-y divide-ink-900/80">
                    {activeTab === "climate" && (
                      <>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Wet-Bulb Stress Level</span>
                            <span className="text-[10px] text-ink-500">Extreme thermal heat stress threshold index</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${activeTemp > 35 ? "text-rose-400" : "text-ink-400"}`}>
                            {activeTemp > 35 ? "CRITICAL RISK" : "STABLE COMPLIANCE"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Flood Vulnerability Profile</span>
                            <span className="text-[10px] text-ink-500">Precipitation anomalies and localized run-off buffers</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${activeTemp > 32 ? "text-amber-400" : "text-emerald-400"}`}>
                            {activeTemp > 32 ? "ELEVATED VULNERABILITY" : "OPTIMAL CONDITIONS"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Atmospheric Stagnation Rating</span>
                            <span className="text-[10px] text-ink-500">Aerosol micro-particle air trapping factor</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${activePm25 > 150 ? "text-rose-400" : "text-emerald-400"}`}>
                            {activePm25 > 150 ? "SEVERE POLLUTION LOAD" : "SAFE THRESHOLD LIMIT"}
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === "human" && (
                      <>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Outbreak Vector Speed</span>
                            <span className="text-[10px] text-ink-500">Thermal acceleration multiplier on reproduction rate</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${computedMetrics.vectorR0 > 1.3 ? "text-rose-400" : "text-ink-400"}`}>
                            {computedMetrics.vectorR0 > 1.3 ? "ACCELERATING CYCLES" : "DORMANT DYNAMICS"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Respiratory Stress Factor</span>
                            <span className="text-[10px] text-ink-500">Soot micro-particle inhalation collision index</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${computedMetrics.respRisk > 60 ? "text-rose-400" : "text-emerald-400"}`}>
                            {computedMetrics.respRisk > 60 ? "CRITICAL OUTBREAK THREAT" : "STABLE PATHWAY LIMIT"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Eco-Anxiety / Environmental Displacement</span>
                            <span className="text-[10px] text-ink-500">Systemic biome collapse psychological impact factor</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${displayDeforest > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                            {displayDeforest > 50 ? "MAX BIOSPHERE STRESS" : "NORMAL LIMIT"}
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === "ecosystem" && (
                      <>
                        {computedMetrics.hasEco ? (
                          <>
                            <div className="flex justify-between items-center py-3">
                              <div>
                                <span className="text-xs font-semibold block text-ink-200">Biodiversity Preservation Coefficient</span>
                                <span className="text-[10px] text-ink-500">Ecosystem forest canopy structural conservation</span>
                              </div>
                              <span className="font-mono text-xs font-bold text-emerald-400">
                                {computedMetrics.biodiversityIndex}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                              <div>
                                <span className="text-xs font-semibold block text-ink-200">Hydrological Basin Sieve Efficiency</span>
                                <span className="text-[10px] text-ink-500">Precipitation holding efficiency of intact roots</span>
                              </div>
                              <span className={`font-mono text-xs font-bold ${displayDeforest > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                                {displayDeforest > 40 ? "COMPROMISED RECHARGE" : "OPTIMAL SATURATION RATE"}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="py-6 text-center text-xs text-ink-500 font-mono">
                            World Bank forest-cover dataset unavailable for this state.
                          </div>
                        )}
                        <div className="flex justify-between items-center py-3">
                          <div>
                            <span className="text-xs font-semibold block text-ink-200">Ocean Acidification Buffer</span>
                            <span className="text-[10px] text-ink-500">Marine thermal capacity and offset threshold</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${activeTemp > 30 ? "text-amber-400" : "text-emerald-400"}`}>
                            {activeTemp > 30 ? "ACIDIFYING PROFILE" : "BALANCED EXCHANGE RATE"}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <ActionInsightsPanel
                  countryName={selectedCountry.name}
                  temp={activeTemp}
                  pm25={activePm25}
                  deforest={displayDeforest}
                  tScore={computedMetrics.tScore}
                  pmScore={computedMetrics.pmScore}
                  dScore={computedMetrics.dScore}
                  hasEco={computedMetrics.hasEco}
                />
              </>
            ) : (
              <div className="bg-ink-900/40 border border-ink-900 rounded-lg p-10 flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
                {liveData.loading ? (
                  <>
                    <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                    <span className="font-mono text-xs text-ink-400">Connecting to live weather and air-quality feeds for {selectedCountry.name}...</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="font-mono text-xs text-ink-400">
                      Live data feeds are currently unreachable for {selectedCountry.name}. Try another state or switch to the Scenario Simulator.
                    </span>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Console Footing */}
        <footer className="border-t border-ink-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-ink-500 font-mono text-[10px]">
          <span>PLANETARY HEALTHOSCOPE SYSTEM · ARCHITECTURE SPECIFICATION v4.0</span>
          <span>FOUNDER CONCEPT: SEEMAB MEHMOOD · PHP INTEGRATION COMPLIANT</span>
        </footer>

      </main>
      )}

      <style>{`
        @keyframes radarSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
