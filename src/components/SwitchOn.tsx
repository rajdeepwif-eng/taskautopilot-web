"use client";

import { useEffect, useState } from "react";

/** The logo's switch, flicking ON once when the page loads (shown ON straight away if motion is reduced). */
export default function SwitchOn({ size = 44 }: { size?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setOn(true); return; }
    const id = window.setTimeout(() => setOn(true), 600);
    return () => window.clearTimeout(id);
  }, []);
  const w = Math.round(size * 1.82);
  return (
    <svg width={w} height={size} viewBox="0 0 200 110" aria-hidden="true" className="inline-block shrink-0 align-middle">
      <rect width="200" height="110" rx="55" fill={on ? "#E8641B" : "#C9CDD3"} style={{ transition: "fill 400ms ease" }} />
      <g style={{ opacity: on ? 1 : 0, transition: "opacity 400ms ease 200ms" }}>
        <rect x="30" y="26" width="48" height="10" rx="5" fill="#fff" opacity="0.95" />
        <rect x="30" y="50" width="40" height="10" rx="5" fill="#fff" opacity="0.7" />
        <rect x="30" y="74" width="32" height="10" rx="5" fill="#fff" opacity="0.45" />
      </g>
      <g style={{ transform: `translateX(${on ? 0 : -90}px)`, transition: "transform 450ms cubic-bezier(.3,1.4,.5,1)" }}>
        <circle cx="145" cy="55" r="43" fill="#fff" />
        <path d="M121 57 L138 74 L171 39" fill="none" stroke="#14213D" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 80, strokeDashoffset: on ? 0 : 80, transition: "stroke-dashoffset 350ms ease 400ms" }} />
      </g>
    </svg>
  );
}
