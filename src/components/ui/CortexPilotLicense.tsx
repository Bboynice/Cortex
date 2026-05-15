"use client";

import type { PointerEventHandler } from "react";
import { useMemo, useRef } from "react";
import { CheckCircle2, Fingerprint, Cpu, ShieldCheck } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const MAX_TILT_DEG = 8;

interface CortexPilotLicenseProps {
  licenseId?: string;
  name?: string;
  points?: number;
}

export default function CortexPilotLicense({
  licenseId = "cor1234",
  name = "Pilot Name",
  points = 0, // Level 0 by default to test the "dim" state
}: CortexPilotLicenseProps) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const rX = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });
  const rY = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });

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

  // --- THE FORMULA ---
  const heatLevel = points / 100;
  // Intensity ranges from 0.05 (empty) to 1.0 (full blast)
  // We cap it at 1.0 so it doesn't wash out the text
  const heatIntensity = Math.min(Math.max(heatLevel / 10, 0.05), 1.0);

  const licenseNumber = `CX-${licenseId.toUpperCase()}`;
  const issuedAt = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={pointerMove}
      onPointerLeave={pointerLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformPerspective: "1200px",
        transformStyle: "preserve-3d",
        // @ts-ignore - Injecting the custom CSS variable
        "--heat-intensity": heatIntensity,
      }}
      className="relative w-[380px] h-[240px] rounded-3xl border border-white/10 overflow-hidden shadow-2xl cursor-default bg-black transition-colors duration-700"
    >
      {/* 1. THE HEAT BACKGROUND (Controlled by --heat-intensity) */}
      <div className="absolute inset-0 bg-cortex-heat pointer-events-none" />
      
      {/* 2. GLASS LAYER (Darkens the card so text stays readable) */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-black/40" />

      {/* 3. LANYARD SLOT */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-white/10 rounded-full border border-white/5 z-20" />

      {/* 4. MAIN CONTENT */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between [transform:translateZ(40px)]">
        
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h1 className="text-[10px] font-black tracking-[0.3em] text-white/90 uppercase">
              Pilot License
            </h1>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
              ID: {licenseNumber}
            </p>
          </div>
          <div className="flex gap-2">
             <div className="p-1.5 bg-white/5 rounded-lg border border-white/10">
                <Cpu size={14} className="text-white/40" />
             </div>
          </div>
        </div>

        {/* MIDDLE: NAME & CHIP */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-xl font-bold text-white tracking-tight leading-none uppercase">
              {name}
            </p>
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-1000 ${heatLevel > 0 ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">
                {heatLevel > 0 ? 'Identity_Verified' : 'Pending_Auth'}
              </span>
            </div>
          </div>

          {/* INDUSTRIAL CHIP */}
          <div className="w-10 h-7 rounded bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_25%,#fff_25.5%,#fff_50%,transparent_50.5%)] bg-[size:3px_100%]" />
             <ShieldCheck size={14} className="text-white/30" />
          </div>
        </div>

        {/* FOOTER: FINGERPRINT & STATS */}
        <div className="flex items-end justify-between pt-4 border-t border-white/10">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Points</span>
              <span className="text-xs font-mono font-bold text-white">{points}</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4">
              <span className="text-[7px] text-white/30 uppercase font-black tracking-widest">Heat</span>
              <span className="text-xs font-mono font-bold text-primary">LVL {heatLevel}</span>
            </div>
          </div>

          {/* BIOMETRIC SCANNER */}
          <div className="relative group flex items-center justify-center">
              {/* This glow also reacts to heatIntensity! */}
              <div 
                className="absolute inset-0 bg-primary blur-md rounded-full transition-opacity duration-1000" 
                style={{ opacity: heatIntensity * 0.5 }}
              />
              <Fingerprint 
                size={32} 
                className={`relative transition-colors duration-1000 ${heatLevel > 0 ? 'text-white' : 'text-white/20'}`} 
              />
              {heatLevel > 0 && (
                <div className="absolute -top-1 -right-1">
                   <CheckCircle2 size={12} className="text-green-500 fill-black" />
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 5. MACHINE READABLE ZONE */}
      <div className="absolute bottom-1.5 left-6 right-6 flex justify-between opacity-10 font-mono text-[5px] tracking-[0.5em] text-white select-none">
        <span>CORTEX_ENGINE_V3</span>
        <span>ISSUED_{issuedAt}</span>
      </div>

      {/* 6. GLOSS REFLECTION */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}