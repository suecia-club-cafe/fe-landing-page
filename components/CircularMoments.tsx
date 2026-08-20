"use client";

import type { CSSProperties } from "react";
import BrandMark from "@/components/BrandMark";

const orbitItems = [
  { image: "/assets/productos/capuccino.png", title: "Capuccino", description: "Una pausa servida en taza.", tag: "CAFÉ" },
  { image: "/assets/clientes/betty.png", title: "Betty Amparo", description: "Personas que ya son parte de la historia.", tag: "CLIENTES" },
  { image: "/assets/productos/carrot-cake-buttercream.png", title: "Carrot cake", description: "Uno de esos antojos que llegan primero por los ojos.", tag: "DULCE" },
  { image: "/assets/clientes/cliente-2.png", title: "Tardes compartidas", description: "Una mesa, algo rico y conversación sin apuro.", tag: "MOMENTOS" },
  { image: "/assets/productos/butifarra-lomo-ahumado.png", title: "Butifarra", description: "Para cuando la tarde también pide algo salado.", tag: "SALADO" },
  { image: "/assets/clientes/cliente-3.png", title: "El club", description: "El lugar se completa con quienes lo visitan.", tag: "COMUNIDAD" },
  { image: "/assets/productos/pie-de-limon.png", title: "Pie de limón", description: "Cítrico, cremoso y hecho para acompañar café.", tag: "DULCE" },
  { image: "/assets/clientes/cliente-4.png", title: "Volver", description: "La mejor señal de que una tarde estuvo bien.", tag: "CLIENTES" },
];

function OrbitCard({ item, index }: { item: (typeof orbitItems)[number]; index: number }) {
  // Match the geometry of the reference component: the first card starts at
  // 12 o'clock and every card's base points toward the logo in the center.
  const angleValue = (360 / orbitItems.length) * index - 90;
  return (
    <div
      className="suecia-orbit-position"
      style={{ "--orbit-angle": `${angleValue}deg` } as CSSProperties}
    >
      <article className="suecia-orbit-card">
        <div className="suecia-orbit-card-inner">
          <div className="suecia-orbit-card-face suecia-orbit-card-front">
            <img src={item.image} alt={item.title} />
            <span>{item.tag}</span>
          </div>
          <div className="suecia-orbit-card-face suecia-orbit-card-back">
            <small>{item.tag}</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function CircularMoments() {
  return (
    <div className="suecia-orbit-section" data-reveal>
      <div className="suecia-orbit-heading">
        <span>EL UNIVERSO SUECIA</span>
        <h3>Productos, personas y momentos<br/><em>girando alrededor del club.</em></h3>
        <p>Fotos reales de clientes y productos orbitan alrededor de la identidad de Suecia, como pequeñas escenas de una misma tarde.</p>
      </div>

      <div className="suecia-orbit-stage" aria-label="Galería circular de Suecia Club Café">
        <div className="suecia-orbit-guide" aria-hidden="true" />
        <div className="suecia-orbit-track">
          {orbitItems.map((item, index) => <OrbitCard item={item} index={index} key={`${item.title}-${index}`} />)}
        </div>
        <div className="suecia-orbit-center">
          <div className="suecia-orbit-center-glow" />
          <BrandMark className="suecia-orbit-brand" size={184} alt="Suecia Club Café" />
          <span>SUECIA</span>
          <small>CLUB CAFÉ</small>
        </div>
      </div>

      <div className="suecia-orbit-mobile" data-native-scroll="true">
        {orbitItems.map((item, index) => (
          <article key={`mobile-${item.title}-${index}`}>
            <img src={item.image} alt={item.title}/>
            <span>{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
