"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureTouch } from "@/lib/attribution";

/** Mounted once in the layout: records where each visitor came from. */
export default function Attribution() {
  const path = usePathname();
  useEffect(() => { captureTouch(); }, [path]);
  return null;
}
