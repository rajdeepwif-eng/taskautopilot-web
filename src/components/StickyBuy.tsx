"use client";

import { useEffect, useState } from "react";

/** Mobile sticky buy bar that waits until the visitor has scrolled past the first screen. */
export default function StickyBuy({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white p-3 lg:hidden">{children}</div>;
}
