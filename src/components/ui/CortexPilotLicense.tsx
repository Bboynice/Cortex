"use client";

import type { CSSProperties, PointerEventHandler } from "react";
import { useMemo, useRef, useState } from "react";
import { Fingerprint, Cpu, CheckCircle2 } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  AnimatePresence,
} from "framer-motion";

const MAX_TILT_DEG = 10;

interface CortexPilotLicenseProps {
  licenseId?: string;
  name?: string;
  points?: number;
}

export default function CortexPilotLicense({
  licenseId = "0000",
  name = "Unknown Pilot",
  points = 0,
}: CortexPilotLicenseProps) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [isVerified, setIsVerified] = useState(false);

  const rX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const pointerMove = useMemo<PointerEventHandler<HTMLDivElement>>(
    () => (event) => {
      if (!cardRef.current || reduceMotion) return;
      const r = cardRef.current.getBoundingClientRect();
      const px = event.clientX - r.left - r.width / 2;
      const py = event.clientY - r.top - r.height / 2;
      rX.set((py / (r.height / 2)) * -MAX_TILT_DEG);
      rY.set((px / (r.width / 2)) * MAX_TILT_DEG);
    },
    [reduceMotion, rX, rY]
  );

  const pointerLeave = () => {
    rX.set(0);
    rY.set(0);
  };

  const heatLevel = (Math.pow(points / 20, 1/3)).toFixed(1);
  const heatN = Number(heatLevel);

  // FIX 1: Map the transition step all the way up to Level 8 so it has room to breathe
  const heatT = Math.min(1, heatN / 8);

  const heatLayerStyle = useMemo(() => {
    return {
      position: "absolute",
      // Scales from 0 (completely off) to 1.0 (full asset color density)
      "--heat-intensity": String(heatT),
      // FIX 2: Calibrated baseline targets so the gradient stays rich and dark, never over-bleaching
      "--heat-brightness": String(0.25 + heatT * 0.9), 
      "--heat-saturate": String(0.5 + heatT * 0.7),
      "--heat-grain": String(0.03 + heatT * 0.1),
    } as CSSProperties;
  }, [heatT]);

  // Fades out the black cover layout step-by-step as points grow
  const blackMaskOpacity = Math.max(0, 1 - heatT);
  const isOverdrive = heatN >= 8; // Activates core visual sweep past Level 8

  // Dynamic Framework Border
  const borderColor = heatN > 4
    ? "rgba(232, 80, 2, 0.4)" 
    : "rgba(255, 255, 255, 0.08)";

  const handleFingerprintClick = () => {
    if (points === 0 || isVerified) return;
    setIsVerified(true);
    setTimeout(() => {
      setIsVerified(false);
    }, 2000);
  };

  return (
    <>
      <div
        className="relative inline-block overflow-visible px-4 py-7 align-top"
        onPointerMove={pointerMove}
        onPointerLeave={pointerLeave}
      >
        <div className="relative h-[240px] w-[380px] [perspective:1500px]">
          <motion.div
            ref={cardRef}
            style={{
              rotateX: rX,
              rotateY: rY,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderColor: borderColor,
              boxShadow:
                "0 20px 50px -18px rgba(0,0,0,0.7), 0 2px 8px -2px rgba(0,0,0,0.5)",
              overflow: "visible",
            }}
            className="relative box-border h-full w-full overflow-visible rounded-3xl border bg-[#070708] transition-colors duration-1000 will-change-transform [isolation:isolate]"
          >
            {/* THE CLIPPED CORTEX HEAT ENGINE LAYER */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl bg-cortex-heat cortex-heat-reactive transition-all duration-1000"
              style={heatLayerStyle}
            />

            {/* 1. THE BLACK-OUT MASK */}
            <motion.div 
              animate={{ opacity: blackMaskOpacity }}
              transition={{ duration: 0.8, ease: "linear" }}
              className="pointer-events-none absolute inset-0 z-[1] rounded-3xl bg-black"
            />

            {/* 2. PROTECTIVE GLASS SURFACING SHIELD */}
            <div
              className={`pointer-events-none absolute inset-0 z-[2] rounded-3xl transition-all duration-1000 ${
                heatN > 0
                  ? "bg-gradient-to-br from-white/[0.06] via-transparent to-black/50 ring-1 ring-inset ring-white/[0.05]"
                  : "bg-black/95"
              }`}
            />

            {/* 3. LANYARD HOUSING SLOT */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full z-30 opacity-30" />

            {/* 4. CONTENT FRAME GRID */}
            <div 
              className="relative z-[10] p-6 h-full flex flex-col justify-between"
              style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
            >
              {/* HEADER INFORMATION STRIP */}
              <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                <div className="space-y-0.5">
                  <h1 className={`text-[10px] font-black tracking-[0.4em] uppercase transition-colors duration-1000 ${heatN > 0 ? 'text-white' : 'text-white/10'}`}>
                    Pilot License
                  </h1>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest opacity-60">
                    {`CX-${licenseId.toUpperCase()}-${name.slice(0, 1).toUpperCase()}`}
                  </p>
                </div>
                <div className={`p-1.5 rounded-lg border transition-all duration-700 ${isOverdrive ? 'bg-primary/20 border-primary/40 shadow-[0_0_15px_rgba(232,80,2,0.3)]' : 'bg-white/5 border-white/10'}`}>
                  <Cpu size={14} className={isOverdrive ? 'text-primary' : 'text-white/10'} />
                </div>
              </div>

              {/* CENTRAL CALLSIGN BLOCK */}
              <div className="space-y-1" style={{ transform: "translateZ(40px)" }}>
                <p className={`text-2xl font-bold tracking-tighter uppercase transition-all duration-1000 ${heatN > 0 ? 'text-white' : 'text-white/5'}`}>
                  {name}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full transition-all duration-1000 ${heatN > 0 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/10'}`} />
                  <span className={`text-[8px] font-mono uppercase tracking-widest transition-opacity duration-1000 ${heatN > 0 ? 'text-white/30' : 'opacity-0'}`}>
                    Neural Link established
                  </span>
                </div>
              </div>

              {/* FOOTER TELEMETRY PANEL */}
              <div className="flex items-end justify-between border-t border-white/10 pt-4" style={{ transform: "translateZ(20px)" }}>
                <div className="flex gap-5">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-white/20 uppercase font-black tracking-widest">Efficiency</span>
                    <span className={`text-sm font-mono font-bold ${heatN > 0 ? 'text-white' : 'text-white/10'}`}>{points}pts</span>
                  </div>
                  <div className="flex flex-col border-l border-white/10 pl-4">
                    <span className="text-[7px] text-white/20 uppercase font-black tracking-widest text-nowrap">Heat Level</span>
                    <span className={`text-sm font-mono font-bold transition-all duration-700 ${heatN > 0 ? 'text-primary' : 'text-white/10'}`}>
                      LVL {heatLevel}
                    </span>
                  </div>
                </div>

                {/* BIOMETRIC AUTH PORT */}
                <div 
                    className="relative group cursor-pointer" 
                    onClick={handleFingerprintClick} 
                    style={{ transform: "translateZ(30px)" }}
                >
                  <motion.div 
                    animate={{ 
                      opacity: heatN > 0 ? [0.1, 0.3, 0.1] : 0,
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-primary blur-2xl rounded-full z-0" 
                  />
                  <Fingerprint 
                    size={32} 
                    className={`relative z-10 transition-colors duration-1000 ${heatN > 0 ? 'text-white/70' : 'text-white/5'}`} 
                  />

                  <AnimatePresence>
                    {isVerified && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }} 
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 15, 
                            opacity: { duration: 0.1 } 
                        }}
                        className="absolute -top-1.5 -right-1.5 z-20" 
                      >
                        <CheckCircle2 
                            size={14} 
                            className="text-green-500 fill-green-500 stroke-black stroke-[2px]" 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 5. OVERDRIVE HIGHSPEED SWEEP */}
            {isOverdrive && (
              <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="pointer-events-none absolute inset-y-0 w-[60%] skew-x-12 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  aria-hidden
                />
              </div>
            )}

            {/* 6. REFLECTIVE SURFACE GLAZE */}
            <div className="pointer-events-none absolute inset-0 z-[50] rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-40" />
          </motion.div>
        </div>
      </div>
    </>
  );
}