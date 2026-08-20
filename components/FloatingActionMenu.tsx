"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Instagram, TikTok, WhatsApp, X } from "@/components/Icons";
import { site } from "@/data/site";

const actions = [
  { label: "WhatsApp", href: site.whatsapp, Icon: WhatsApp, external: true },
  { label: "Instagram", href: site.instagram, Icon: Instagram, external: true },
  { label: "TikTok", href: site.tiktok, Icon: TikTok, external: true },
  { label: "Carta", href: "/carta", Icon: FileText, external: false },
] as const;

export default function FloatingActionMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (open) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % actions.length), 2600);
    return () => window.clearInterval(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const navigateInternally = (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (navigating || pathname === href) {
      setOpen(false);
      return;
    }

    setNavigating(true);
    setOpen(false);

    window.dispatchEvent(new Event("suecia:navigation-start"));
    window.setTimeout(() => router.push(href), 120);
  };

  const CurrentIcon = actions[active].Icon;

  return (
    <div ref={rootRef} className={`floating-actions ${open ? "open" : ""}`}>
      <div className="floating-action-list">
        {actions.map(({ label, href, Icon, external }, index) => {
          const content = <><span>{label}</span><i><Icon /></i></>;
          return external ? (
            <a key={label} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} style={{ "--action-index": index } as CSSProperties}>{content}</a>
          ) : (
            <a key={label} href={href} onClick={(event) => navigateInternally(event, href)} style={{ "--action-index": index } as CSSProperties}>{content}</a>
          );
        })}
      </div>
      <button className="floating-action-toggle" onClick={() => setOpen(value => !value)} aria-label={open ? "Cerrar accesos rápidos" : "Abrir accesos rápidos"} aria-expanded={open}>
        <span className="floating-pulse" />
        {open ? <X /> : <CurrentIcon />}
      </button>
    </div>
  );
}
