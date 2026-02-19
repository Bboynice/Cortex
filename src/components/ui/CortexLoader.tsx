"use client";

import { motion } from "framer-motion";
import React, { useId } from "react";



interface CortexLoaderProps {
  size?: number;
  color?: string;
  gradient?: {
    from: string;
    via?: string;
    to: string;
    /** Degrees, default 45 */
    angle?: number;
  };
}
export default function CortexLoader({
  size = 10,
  color = "currentColor",
  gradient,
}: CortexLoaderProps) {
  const DURATION_S = 4.8;
  // Smooth, futuristic easing (gentle accel/decel into "stops")
  const EASE = [0.33, 1, 0.68, 1] as const;
  const loop = (times: number[]) => ({
    rotate: { type: "tween" as const, duration: DURATION_S, repeat: Infinity, ease: EASE, times },
    strokeDasharray: { type: "tween" as const, duration: DURATION_S, repeat: Infinity, ease: EASE, times },
    strokeDashoffset: { type: "tween" as const, duration: DURATION_S, repeat: Infinity, ease: EASE, times },
  });
  const gradientId = useId();
  const stroke = gradient ? `url(#${gradientId})` : color;
  const START_ROTATE = -45; // top-right gap alignment baseline
  return (
    <svg
      width={size * 10}
      height={size * 10}
      className="block"
      viewBox="0 0 100 100"
    >
      {gradient ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={
              gradient.angle !== undefined ? `rotate(${gradient.angle})` : "rotate(45)"
            }
          >
            <stop offset="0%" stopColor={gradient.from} />
            {gradient.via ? <stop offset="50%" stopColor={gradient.via} /> : null}
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>
        </defs>
      ) : null}

      <motion.circle
        cx="50"
        cy="50"
        r="45"
        stroke={stroke}
        strokeWidth="1"
        fill="none"
        pathLength={100}
        strokeDasharray="91 9"
        strokeDashoffset={-4.5}
        strokeLinecap="round"
        style={{ transformOrigin: "50px 50px" }}
        initial={{ rotate: START_ROTATE }}
        animate={{
          // 1 spin (clockwise): start → probe/hold → probe/hold → full spin back to start
          rotate: [
            START_ROTATE,
            START_ROTATE + 135,
            START_ROTATE + 135, // hold
            START_ROTATE + 255,
            START_ROTATE + 255, // hold
            START_ROTATE + 360,
          ],
          strokeDasharray: ["91 9", "80 20", "80 20", "86 14", "86 14", "91 9"],
          strokeDashoffset: [-4.5, -10, -10, -7, -7, -4.5],
        }}
        transition={loop([0, 0.24, 0.38, 0.62, 0.76, 1])}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="37.5"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        pathLength={100}
        strokeDasharray="90 10"
        strokeDashoffset={-5}
        strokeLinecap="round"
        style={{ transformOrigin: "50px 50px" }}
        initial={{ rotate: START_ROTATE }}
        animate={{
          // 2 spins (clockwise): start → probe/hold → 1 spin → probe/hold → 2 spins back to start
          rotate: [
            START_ROTATE,
            START_ROTATE + 210,
            START_ROTATE + 210, // hold
            START_ROTATE + 360,
            START_ROTATE + 555,
            START_ROTATE + 555, // hold
            START_ROTATE + 720,
          ],
          // middle ring: larger/chaotic breathing than outer, stays readable
          strokeDasharray: ["90 10", "74 26", "74 26", "88 12", "78 22", "78 22", "90 10"],
          strokeDashoffset: [-5, -13, -13, -6, -11, -11, -5],
        }}
        transition={loop([0, 0.16, 0.28, 0.44, 0.64, 0.78, 1])}
      />
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        stroke={stroke}
        strokeWidth="1.5"
        fill="none"
        pathLength={100}
        strokeDasharray="86 14"
        strokeDashoffset={-7}
        strokeLinecap="round"
        style={{ transformOrigin: "50px 50px" }}
        initial={{ rotate: START_ROTATE }}
        animate={{
          // 3 spins (clockwise): start → probe/hold → probe/hold → long run → 3 spins back to start
          rotate: [
            START_ROTATE,
            START_ROTATE + 240,
            START_ROTATE + 240, // hold
            START_ROTATE + 585,
            START_ROTATE + 585, // hold
            START_ROTATE + 945,
            START_ROTATE + 1080,
          ],
          // small ring: biggest breathing so the gap stays visible at small size
          strokeDasharray: ["86 14", "66 34", "66 34", "78 22", "78 22", "70 30", "86 14"],
          strokeDashoffset: [-7, -17, -17, -11, -11, -15, -7],
        }}
        transition={loop([0, 0.14, 0.24, 0.46, 0.6, 0.84, 1])}
      />
    </svg>
  );
}