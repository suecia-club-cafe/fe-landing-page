"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, Instagram, MapPin, MenuGrid, Qr, TikTok, WhatsApp, X } from "@/components/Icons";
import { site } from "@/data/site";
import { catalogQrSource, qrSourceForPath } from "@/components/CatalogPdfQr";

type Entry = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  qr: string | null;
  dynamicQrPath?: string;
  dynamicQrLabel?: string;
  Icon: typeof MenuGrid;
  internal: boolean;
  newTab?: boolean;
};

const entries: Entry[] = [
  {
    id: "carta",
    title: "Carta digital",
    subtitle: "Explora todos los productos",
    href: "/carta",
    qr: "dynamic",
    dynamicQrPath: "/carta",
    dynamicQrLabel: "Carta digital",
    Icon: MenuGrid,
    internal: true,
  },
  {
    id: "carta-pdf",
    title: "Carta en PDF",
    subtitle: "Escanea la carta y llévala contigo",
    href: site.menuPdfPath,
    qr: "dynamic",
    dynamicQrPath: site.menuPdfPath,
    dynamicQrLabel: "Carta en PDF",
    Icon: FileText,
    internal: false,
    newTab: true,
  },
  { id: "instagram", title: "Instagram", subtitle: "@sueciaclubcafe", href: site.instagram, qr: "/assets/qr/instagram.png", Icon: Instagram, internal: false, newTab: true },
  { id: "tiktok", title: "TikTok", subtitle: "Suecia Club Café", href: site.tiktok, qr: "/assets/qr/tiktok.png", Icon: TikTok, internal: false, newTab: true },
  { id: "whatsapp", title: "WhatsApp", subtitle: "Consultas y disponibilidad", href: site.whatsapp, qr: "/assets/qr/whatsapp.png", Icon: WhatsApp, internal: false, newTab: true },
  { id: "maps", title: "Google Maps", subtitle: "Martín Alonso de Meza 135", href: site.maps, qr: "/assets/qr/maps.png", Icon: MapPin, internal: false, newTab: true },
];

export default function LinkHubCards({ large = false }: { large?: boolean }) {
  const [openQr, setOpenQr] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const dynamicQrSources = useMemo(
    () => ({
      carta: qrSourceForPath(origin, "/carta"),
      "carta-pdf": catalogQrSource(origin),
    }),
    [origin],
  );

  return (
    <div className={`link-collapsed-list ${large ? "large" : ""}`}>
      {entries.map(({ id, title, subtitle, href, qr, dynamicQrPath, dynamicQrLabel, Icon, internal, newTab }) => {
        const expanded = openQr === id;
        const qrSrc = dynamicQrPath
          ? dynamicQrSources[id as keyof typeof dynamicQrSources] ?? qrSourceForPath(origin, dynamicQrPath)
          : qr;
        const linkContent = <>Abrir <ArrowUpRight /></>;

        return (
          <article className={expanded ? "qr-open" : ""} key={id}>
            <div className="link-collapsed-row">
              <span className="link-collapsed-icon"><Icon /></span>
              <div className="link-collapsed-copy"><small>{title.toUpperCase()}</small><h3>{subtitle}</h3></div>
              <div className="link-collapsed-actions">
                {internal
                  ? <Link href={href}>{linkContent}</Link>
                  : <a href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noreferrer" : undefined}>{linkContent}</a>}
                {qr && (
                  <button type="button" onClick={() => setOpenQr(expanded ? null : id)} aria-expanded={expanded}>
                    {expanded ? <X /> : <Qr />}<span>{expanded ? "Cerrar" : "QR"}</span>
                  </button>
                )}
              </div>
            </div>
            {qr && (
              <div className="link-qr-drawer" aria-hidden={!expanded}>
                <div>
                  {qrSrc ? <img src={qrSrc} alt={`Código QR de ${title}`} /> : <div className="qr-loading">Preparando QR…</div>}
                  <span>
                    <b>Escanea para abrir {dynamicQrLabel ?? title}</b>
                    <small>{dynamicQrPath ? "Este QR apunta a la versión publicada actual de ese destino." : "Úsalo desde otro dispositivo."}</small>
                  </span>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
