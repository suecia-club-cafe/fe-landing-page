"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Instagram, LinkIcon, MapPin, MenuGrid, Star, TikTok, Users, WhatsApp } from "@/components/Icons";
import PrintCatalogButton from "@/components/PrintCatalogButton";
import { site } from "@/data/site";

const navItems = [
  { target: "#inicio", label: "Inicio", Icon: Home },
  { target: "#favoritos", label: "Favoritos", Icon: Star },
  { target: "/carta", label: "Carta", Icon: MenuGrid },
  { target: "#clientes", label: "Clientes", Icon: Users },
  { target: "#visitanos", label: "Visítanos", Icon: MapPin },
  { target: "/links", label: "Links", Icon: LinkIcon },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const onHome = pathname === "/";
  const onCarta = pathname === "/carta";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 56);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const items = useMemo(() => navItems.map(item => ({
    ...item,
    href: item.target.startsWith("#") && !onHome ? `/${item.target}` : item.target,
  })), [onHome]);

  return (
    <>
      <header className={`topbar ${scrolled || !onHome ? "topbar-scrolled" : ""}`}>
        <Link className="brand-lockup" href={onHome ? "#inicio" : "/#inicio"} aria-label="Suecia Club Café, inicio">
          <img src="/assets/brand/logo.jpg" alt="Logo Suecia Club Café" />
          <span><strong>SUECIA</strong><small>CLUB CAFÉ</small></span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegación principal">
          {items.map(({ href, label, Icon }) => (
            <Link href={href} key={label} className={pathname === href ? "is-active" : ""}>
              <Icon /><span>{label}</span>
            </Link>
          ))}
          {onCarta && <PrintCatalogButton className="nav-pdf-action" label="PDF" />}
        </nav>

        <div className="nav-actions">
          <div className="nav-social-cluster" aria-label="Redes sociales">
            <a className="nav-social" href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
            <a className="nav-social" href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTok /></a>
          </div>
          <a className="nav-whatsapp" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp"><WhatsApp/><span>WhatsApp</span></a>
          <button className="hamburger" onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={mobileOpen}><span/><span/></button>
        </div>
      </header>

      <div className={`mobile-nav ${mobileOpen ? "open" : ""}`}>
        {items.map(({ href, label, Icon }) => <Link href={href} key={label} onClick={() => setMobileOpen(false)}><Icon />{label}</Link>)}
        <div className="mobile-socials">
          <a href={site.whatsapp} target="_blank" rel="noreferrer"><WhatsApp/> WhatsApp</a>
          <a href={site.instagram} target="_blank" rel="noreferrer"><Instagram/> Instagram</a>
          <a href={site.tiktok} target="_blank" rel="noreferrer"><TikTok/> TikTok</a>
        </div>
      </div>
    </>
  );
}
