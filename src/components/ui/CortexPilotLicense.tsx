"use client";

import type { PointerEventHandler } from "react";
import { useMemo, useRef, useState } from "react"; // Added useState
import { Fingerprint, Cpu, CheckCircle2 } from "lucide-react"; // Added CheckCircle2
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  AnimatePresence, // Added AnimatePresence for exit animations
} from "framer-motion";

const MAX_TILT_DEG = 10;

interface CortexPilotLicenseProps {
  licenseId?: string;
  name?: string;
  points?: number;
}

export default function CortexPilotLicense({
  licenseId = "",
  name = "",
  points = 0,
}: CortexPilotLicenseProps) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // State to track the verification "pop"
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

  const heatLevel = Math.pow(points / 20, 1/3).toFixed(1);
  
  // Transition: 1 (Black) to 0 (Transparent Heat)
  const blackMaskOpacity = Math.max(0, 1 - (Number(heatLevel) / 8)); 
  const isOverdrive = Number(heatLevel) >= 8;

  // Dynamic Border Color
  const borderColor = Number(heatLevel) > 5 
    ? "rgba(232, 80, 2, 0.5)" // Primary Orange at high heat
    : "rgba(255, 255, 255, 0.1)"; // Subtle Gray at low heat

  // Handler for Fingerprint Click
  const handleFingerprintClick = () => {
    // Only verify if the card is active (power link established)
    if (points === 0 || isVerified) return;

    // Trigger the process
    setIsVerified(true);

    // Automatically reset after 2 seconds (the length of the animation sequence)
    setTimeout(() => {
      setIsVerified(false);
    }, 2000);
  };

  return (
    <div 
      className="relative w-[380px] h-[240px] [perspective:1500px]"
      onPointerMove={pointerMove}
      onPointerLeave={pointerLeave}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX: rX,
          rotateY: rY,
          transformStyle: "preserve-3d",
          borderColor: borderColor, // Dynamic border
          // Small, tight industrial shadow
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)" 
        }}
        // The container IS the cortex-heat background
        className="relative w-full h-full rounded-3xl border bg-cortex-heat overflow-hidden isolation-isolate transition-colors duration-1000"
      >
        
        {/* 1. THE BLACK-OUT MASK */}
        <motion.div 
          animate={{ opacity: blackMaskOpacity }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-black z-[1] pointer-events-none"
        />

        {/* 2. GLASS EFFECT */}
        <div className={`absolute inset-0 z-[2] transition-all duration-1000 ${Number(heatLevel) > 0 ? 'backdrop-blur-xl bg-black/20' : 'bg-black/90'}`} />

        {/* 3. LANYARD SLOT */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full z-30 opacity-30" />

        {/* 4. CONTENT (Floating on 3D Space) */}
        <div 
          className="relative z-[10] p-6 h-full flex flex-col justify-between"
          style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
        >
          {/* HEADER */}
          <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
            <div className="space-y-0.5">
              <h1 className={`text-[10px] font-black tracking-[0.4em] uppercase transition-colors duration-1000 ${Number(heatLevel) > 0 ? 'text-white' : 'text-white/10'}`}>
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

          {/* NAME BLOCK */}
          <div className="space-y-1" style={{ transform: "translateZ(40px)" }}>
            <p className={`text-2xl font-bold tracking-tighter uppercase transition-all duration-1000 ${Number(heatLevel) > 0 ? 'text-white' : 'text-white/5'}`}>
              {name}
            </p>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full transition-all duration-1000 ${Number(heatLevel) > 0 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-white/10'}`} />
              <span className={`text-[8px] font-mono uppercase tracking-widest transition-opacity duration-1000 ${Number(heatLevel) > 0 ? 'text-white/30' : 'opacity-0'}`}>
                Neural Link established
              </span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-end justify-between border-t border-white/10 pt-4" style={{ transform: "translateZ(20px)" }}>
            <div className="flex gap-5">
              <div className="flex flex-col">
                <span className="text-[7px] text-white/20 uppercase font-black tracking-widest">Efficiency</span>
                <span className={`text-sm font-mono font-bold ${Number(heatLevel) > 0 ? 'text-white' : 'text-white/10'}`}>{points}pts</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <span className="text-[7px] text-white/20 uppercase font-black tracking-widest text-nowrap">Heat Level</span>
                <span className={`text-sm font-mono font-bold transition-all duration-700 ${Number(heatLevel) > 0 ? 'text-primary' : 'text-white/10'}`}>
                  LVL {heatLevel}
                </span>
              </div>
            </div>

            {/* SCANNER AREA (Interactive) */}
            <div 
                className="relative group cursor-pointer" // Added pointer and group
                onClick={handleFingerprintClick} // Attach handler
                style={{ transform: "translateZ(30px)" }}
            >
              {/* Dynamic Aura Glow */}
              <motion.div 
                animate={{ 
                  opacity: Number(heatLevel) > 0 ? [0.1, 0.3, 0.1] : 0,
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-primary blur-2xl rounded-full z-0" 
              />
              {/* Fingerprint Icon */}
              <Fingerprint 
                size={32} 
                className={`relative z-10 transition-colors duration-1000 ${Number(heatLevel) > 0 ? 'text-white/70' : 'text-white/5'}`} 
              />

              {/* VERIFICATION "POP" ICON */}
              {/* AnimatePresence handles the 'exit' state animation automatically when isVerified goes false */}
              <AnimatePresence>
                {isVerified && (
                  <motion.div
                    // Verification Process Animation: Scale-in with Bounce
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }} // Pop-out when reset
                    transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 15, // Creates slight bounce
                        opacity: { duration: 0.1 } 
                    }}
                    className="absolute -top-1.5 -right-1.5 z-20" // Positioned corner
                  >
                    <CheckCircle2 
                        size={14} 
                        className="text-green-500 fill-green-500 stroke-black stroke-[2px]" // Green, filled, black border contrast
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 5. OVERDRIVE SHINE EFFECT */}
        {isOverdrive && (
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 z-[5] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-20 pointer-events-none"
          />
        )}

        {/* 6. GLASS GLOSS */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-[50] opacity-50" />
      </motion.div>
    </div>
  );
}