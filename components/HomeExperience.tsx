"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CoffeeRain from "@/components/CoffeeRain";
import LinkHubCards from "@/components/LinkHubCards";
import BrandMark from "@/components/BrandMark";
import CircularMoments from "@/components/CircularMoments";
import { ArrowRight, ArrowUpRight, Clock, Coffee, Home, Instagram, MapPin, MenuGrid, TikTok, WhatsApp, Star, Users, LinkIcon } from "@/components/Icons";
import { products } from "@/data/catalog";
import { site } from "@/data/site";

const favorites = [products[0], products[2], products[4], products[8]];
const clientPhotos = [
  { image: "/assets/clientes/betty.png", title: "Betty Amparo", copy: "Una de las personas que ya forman parte de las historias de Suecia." },
  { image: "/assets/clientes/cliente-2.png", title: "Tardes compartidas", copy: "Café, postres y una mesa que se presta para conversar." },
  { image: "/assets/clientes/cliente-3.png", title: "Momentos del club", copy: "Fotos reales de quienes pasan por el local." },
  { image: "/assets/clientes/cliente-4.png", title: "La comunidad", copy: "Porque el lugar también se construye con quienes vuelven." },
];



function SocialButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return <a className="social-pill" href={href} target="_blank" rel="noreferrer" aria-label={label}>{children}<span>{label}</span><ArrowUpRight /></a>;
}

export default function HomeExperience() {
  const horizontalRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal], [data-wipe]")];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.innerWidth <= 900) return;
      const section = horizontalRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-maxX * progress}px,0,0)`;
      section.style.setProperty("--story-progress", String(progress));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <main>
      <SiteHeader />

      <section className="hero" id="inicio">
        <video autoPlay muted loop playsInline preload="metadata" className="hero-video"><source src="/assets/video/principal.mp4" type="video/mp4" /></video>
        <div className="hero-overlay"/><div className="hero-grain"/>
        <div className="hero-ambient hero-ambient-one"/><div className="hero-ambient hero-ambient-two"/>
        <div className="hero-content">
          <p className="hero-kicker" data-wipe>CAFÉ DE ESPECIALIDAD · PUEBLO LIBRE</p>
          <div data-reveal>
            <BrandMark className="hero-brand-mark" size={126} alt="Suecia Club Café" />
          </div>
          <h1 data-reveal><span>Suecia</span><small>CLUB CAFÉ</small></h1>
          <p className="hero-copy" data-reveal>Café, dulces, sánguches y ese tipo de tardes que empiezan con un antojo y terminan en una conversación larga.</p>
          <div className="hero-actions" data-reveal>
            <a className="hero-primary" href="#favoritos"><span className="cta-icon"><Coffee /></span><span><small>EMPIEZA AQUÍ</small>Descubrir Suecia</span><ArrowRight /></a>
            <Link className="hero-secondary" href="/carta"><MenuGrid /><span>Explorar la carta</span><ArrowUpRight /></Link>
          </div>
        </div>
        <div className="hero-info-row">
          <div><Clock /><span><b>Horario</b>Lun — Sáb · 4:00 — 10:00 pm</span></div>
          <div><MapPin /><span><b>Pueblo Libre</b>Martín Alonso de Meza 135</span></div>
          <a href="#intro">Seguir bajando <span>↓</span></a>
        </div>
      </section>

      <section className="intro" id="intro">
        <CoffeeRain count={12}/>
        <div className="intro-top"><span>01 / EL CLUB</span><span>CAFÉ · TARDE · CONVERSACIÓN</span></div>
        <div className="intro-grid intro-grid-v8">
          <div className="intro-title intro-title-v8">
            <p>UN RINCÓN EN PUEBLO LIBRE</p>
            <h2><span>Vienes por el café.</span><em>Vuelves por el lugar.</em></h2>
            <div className="intro-signals" aria-label="Datos de Suecia Club Café">
              <span><Coffee /> Café de especialidad</span>
              <span><Clock /> 4:00 — 10:00 pm</span>
              <span><MapPin /> Pueblo Libre</span>
            </div>
          </div>

          <div className="intro-experience" data-reveal>
            <div className="intro-film">
              <video autoPlay muted loop playsInline preload="metadata" aria-label="Momentos dentro de Suecia Club Café">
                <source src="/assets/video/nosotros.mp4" type="video/mp4" />
              </video>
              <div className="intro-film-shade"/>
              <span className="intro-film-label">UN CLUB PARA LA TARDE</span>
              <span className="intro-film-index">PUEBLO LIBRE · LIMA</span>
            </div>
            <div className="intro-copy intro-copy-v8">
              <p>Suecia no necesita sentirse enorme para ser memorable. Su fuerza está en lo cercano: una bebida, algo dulce o salado, una mesa y tiempo para quedarse.</p>
              <a href="#clientes">Conoce el club <ArrowRight /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="horizontal-story" id="favoritos" ref={horizontalRef}>
        <div className="horizontal-sticky">
          <div className="story-top"><span>02 / FAVORITOS</span><span>SCROLL VERTICAL → VIAJE HORIZONTAL</span></div>
          <div className="horizontal-track" ref={trackRef}>
            <article className="story-lead">
              <span>DE LA CASA</span>
              <h2>Lo que hace que una mesa <em>pida otra ronda.</em></h2>
              <p>Desplázate hacia abajo. La historia se mueve de lado.</p>
            </article>
            {favorites.map((item, index) => (
              <article className="story-card" key={item.name}>
                <img src={item.image} alt={item.name}/><div className="story-shade"/>
                <div className="story-number">0{index + 1}</div>
                <div className="story-copy"><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><Link href={`/carta?categoria=${encodeURIComponent(item.category)}`}>Ver en carta <ArrowUpRight /></Link></div>
              </article>
            ))}
            <article className="story-end"><Coffee/><h3>¿Ya elegiste?</h3><p>La carta completa reúne todos los productos identificados en las fotografías del negocio.</p><Link href="/carta">Abrir carta completa <ArrowRight /></Link></article>
          </div>
          <div className="story-progress"><span/></div>
        </div>
      </section>

      <section className="worlds-section">
        <div className="section-heading" data-reveal><span>03 / TRES FORMAS DE ANTOJARSE</span><h2>No es solo café.<br/><em>Es la mesa completa.</em></h2></div>
        <div className="arch-grid">
          {[
            ["CAFÉ", "Para bajar el ritmo", "/assets/productos/capuccino.png", "Bebidas preparadas para acompañar una pausa."],
            ["DULCE", "Para pedir cucharita", "/assets/productos/carrot-cake-buttercream.png", "Tortas, pies y postres que entran primero por los ojos."],
            ["SALADO", "Para venir con hambre", "/assets/productos/butifarra-lomo-ahumado.png", "Sánguches y opciones saladas para quedarse más tiempo."],
          ].map(([tag,title,image,copy]) => <article className="arch-card" key={tag}><img src={image} alt={title}/><div/><span>{tag}</span><section><h3>{title}</h3><p>{copy}</p><Link href="/carta">Explorar <ArrowUpRight /></Link></section></article>)}
        </div>
      </section>

      <section className="client-section" id="clientes">
        <CoffeeRain count={20}/>
        <div className="client-heading"><div data-reveal><span>04 / CLIENTES</span><h2>Las mejores fotos<br/><em>no siempre son de producto.</em></h2></div><p data-reveal>Un espacio para mostrar fotos tomadas en el local, publicaciones compartidas por clientes, sorteos y momentos reales de la comunidad.</p></div>
        <div className="client-rail" data-native-scroll="true">
          {[...clientPhotos, ...clientPhotos].map((client, index) => <article className="client-card" key={`${client.title}-${index}`}><img src={client.image} alt={client.title}/><div><span>EN SUECIA</span><h3>{client.title}</h3><p>{client.copy}</p></div></article>)}
        </div>
        <div className="client-social-cta" data-reveal><p>¿Subiste una foto desde Suecia? Etiqueta al café para que pueda formar parte de esta sección.</p><div><SocialButton href={site.instagram} label="Instagram"><Instagram /></SocialButton><SocialButton href={site.tiktok} label="TikTok"><TikTok /></SocialButton></div></div>
        <CircularMoments />
      </section>

      <section className="neon-signature" aria-label="El letrero de Suecia Club Café">
        <div className="neon-signature-photo">
          <img src="/assets/brand/logo-neon-foto-tono-frio.png" alt="Letrero de neón de Suecia Club Café en el local" />
          <div className="neon-signature-shade"/>
          <span className="neon-signature-caption">PUEBLO LIBRE · LIMA</span>
        </div>
        <div className="neon-signature-copy" data-reveal>
          <span>UNA SEÑAL EN LA NOCHE</span>
          <h2>Cuando veas<br/><em>esta luz, llegaste.</em></h2>
          <p>El letrero forma parte de la experiencia real del local. Lo usamos aquí como una pausa visual para conectar la identidad digital con el lugar que te espera en Pueblo Libre.</p>
          <a href="#visitanos">Cómo llegar <ArrowRight /></a>
        </div>
      </section>

      <section className="link-hub" id="links">
        <div className="link-hub-copy" data-reveal><div className="link-hub-brand-stage" aria-hidden="true"><span className="link-hub-orbit-ring" /><span className="link-hub-orbit-dot" /><BrandMark className="link-hub-brand-mark" size={114} alt="Suecia Club Café" /></div><span>05 / ENCUÉNTRANOS</span><h2>Todos los caminos<br/><em>llevan a Suecia.</em></h2><p>Los accesos permanecen limpios y compactos. Abre cada destino directamente o despliega su QR solo cuando lo necesites.</p><Link className="hub-main-link" href="/links">Abrir página de links <ArrowRight /></Link></div>
        <LinkHubCards />
      </section>

      <section className="visit" id="visitanos">
        <div className="visit-copy">
          <span className="section-kicker" data-reveal>06 / VISÍTANOS</span>
          <h2 data-reveal>Nos vemos<br/><em>esta tarde.</em></h2>
          <div className="visit-facts">
            <div data-reveal><span className="fact-icon"><MapPin /></span><section><small>UBICACIÓN</small><h3>Martín Alonso de Meza 135</h3><p>Pueblo Libre, Lima · frente al Parque Suecia</p></section></div>
            <div data-reveal><span className="fact-icon"><Clock /></span><section><small>HORARIO</small><h3>Lunes a sábado</h3><p>4:00 pm — 10:00 pm</p></section></div>
          </div>
          <div className="visit-socials" data-reveal><SocialButton href={site.whatsapp} label="WhatsApp"><WhatsApp /></SocialButton><SocialButton href={site.instagram} label="Instagram"><Instagram /></SocialButton><SocialButton href={site.tiktok} label="TikTok"><TikTok /></SocialButton></div>
          <a className="visit-map-button" href={site.maps} target="_blank" rel="noreferrer"><MapPin/> Abrir en Google Maps <ArrowUpRight/></a>
        </div>
        <div className="map-shell" data-reveal><iframe title="Ubicación de Suecia Club Café en Google Maps" src={site.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div className="map-badge"><img src="/assets/brand/logo.jpg" alt=""/><span><b>Suecia Club Café</b>Pueblo Libre</span></div></div>
      </section>

      <footer className="site-footer">
        <CoffeeRain count={12}/>
        <div className="footer-top">
          <div className="footer-brand"><BrandMark className="footer-brand-mark" size={104} alt="Suecia Club Café"/><div><h2>Suecia</h2><p>CAFÉ DE ESPECIALIDAD · DULCES · SÁNDWICHES Y MÁS</p></div></div>
          <div className="footer-cta"><span>¿Qué se te antoja hoy?</span><a href={site.whatsapp} target="_blank" rel="noreferrer"><WhatsApp/> Escribir por WhatsApp <ArrowRight /></a></div>
        </div>
        <div className="footer-grid">
          <div><span>VISÍTANOS</span><p>{site.address}</p><p>{site.hours}</p></div>
          <div><span>NAVEGA</span><Link href="#inicio"><Home/> Inicio</Link><Link href="#favoritos"><Star/> Favoritos</Link><Link href="#clientes"><Users/> Clientes</Link><Link href="/carta"><MenuGrid/> Carta</Link><Link href="/links"><LinkIcon/> Links & QR</Link></div>
          <div><span>SÍGUENOS</span><a href={site.instagram} target="_blank" rel="noreferrer"><Instagram/> Instagram</a><a href={site.tiktok} target="_blank" rel="noreferrer"><TikTok/> TikTok</a><a href={site.whatsapp} target="_blank" rel="noreferrer"><WhatsApp/> WhatsApp</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 SUECIA CLUB CAFÉ</span><span>HECHO PARA LAS TARDES DE PUEBLO LIBRE.</span></div>
      </footer>
    </main>
  );
}
