"use client";
import { useEffect, useMemo, useState } from "react";
import { categories as fallbackCategories, products as fallbackProducts, type CatalogFilter, type Product } from "@/data/catalog";
import { whatsappForProduct } from "@/data/site";
import { ArrowUpRight, WhatsApp } from "@/components/Icons";
import CoffeeRain from "@/components/CoffeeRain";

export default function MenuCatalog({ compact = false, productsData = fallbackProducts, categoriesData = fallbackCategories }: { compact?: boolean; productsData?: Product[]; categoriesData?: CatalogFilter[] }) {
  const [active, setActive] = useState<CatalogFilter>("Todos");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("categoria");
    if (requested && categoriesData.includes(requested as CatalogFilter)) setActive(requested as CatalogFilter);
  }, []);
  const visible = useMemo(() => active === "Todos" ? productsData : productsData.filter(p => p.category === active), [active, productsData]);

  return (
    <section className={`catalog-section ${compact ? "catalog-compact" : ""}`} id="carta-productos">
      <CoffeeRain count={14} />
      <div className="catalog-heading">
        <div>
          <span className="section-kicker">CARTA DIGITAL</span>
          <h2>Encuentra tu <em>próximo antojo.</em></h2>
        </div>
        <p>Filtra por categoría, abre el producto y consulta disponibilidad directamente por WhatsApp. Los precios quedan preparados para añadirse cuando el negocio decida publicarlos.</p>
      </div>
      <div className="category-pills" role="tablist" aria-label="Categorías de la carta">
        {categoriesData.map(category => (
          <button key={category} onClick={() => setActive(category)} className={active === category ? "active" : ""} role="tab" aria-selected={active === category}>{category}</button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map(product => (
          <article className="product-card" key={product.name}>
            <div className="product-image-wrap"><img src={product.image} alt={product.name} /></div>
            <div className="product-card-body">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="product-card-bottom">
                <strong>{product.price ?? "Consultar"}</strong>
                <a href={whatsappForProduct(product.name)} target="_blank" rel="noreferrer" aria-label={`Consultar ${product.name} por WhatsApp`}>
                  <WhatsApp /> Consultar <ArrowUpRight />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
