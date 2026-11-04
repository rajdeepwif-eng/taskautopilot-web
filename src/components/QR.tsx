"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Renders a QR code for a URL as an inline SVG (prints crisply). */
export default function QR({ url, size = 160, className = "" }: { url: string; size?: number; className?: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let live = true;
    QRCode.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" }).then((s) => { if (live) setSvg(s); }).catch(() => setSvg(""));
    return () => { live = false; };
  }, [url]);
  return <div className={className} style={{ width: size, height: size }} role="img" aria-label={`QR code for ${url}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
