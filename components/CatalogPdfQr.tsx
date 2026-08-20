"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, Qr, X } from "@/components/Icons";
import { site } from "@/data/site";

export function qrSourceForPath(origin: string, path: string, size = 260) {
  if (!origin) return "";
  const target = `${origin}${path}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(target)}`;
}

export function catalogQrSource(origin: string, size = 260) {
  return qrSourceForPath(origin, site.menuPdfPath, size);
}

export default function CatalogPdfQr({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);
  const qrSrc = useMemo(() => catalogQrSource(origin), [origin]);

  return (
    <div className={`catalog-pdf-qr ${open ? "is-open" : ""} ${className}`.trim()}>
      <button type="button" className="catalog-pdf-qr-toggle" onClick={() => setOpen(value => !value)} aria-expanded={open}>
        {open ? <X /> : <Qr />}
        <span>{open ? "Cerrar QR" : "Escanear carta"}</span>
      </button>
      <div className="catalog-pdf-qr-panel" aria-hidden={!open}>
        <div className="catalog-pdf-qr-image">
          {qrSrc ? <img src={qrSrc} alt="Código QR de la carta PDF de Suecia Club Café" /> : <span>Cargando QR…</span>}
        </div>
        <div>
          <small>CARTA PDF</small>
          <strong>Escanea y abre la carta</strong>
          <p>El QR apunta a una ruta estable. Hoy sirve el PDF alojado; más adelante esa misma ruta podrá entregar automáticamente la última carta generada desde el CMS.</p>
          <a href={site.menuPdfPath} target="_blank" rel="noreferrer"><FileText /> Abrir PDF</a>
        </div>
      </div>
    </div>
  );
}
