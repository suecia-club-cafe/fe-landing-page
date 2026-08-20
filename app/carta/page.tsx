import SiteHeader from "@/components/SiteHeader";
import MenuCatalog from "@/components/MenuCatalog";
import PrintableCatalog from "@/components/PrintableCatalog";
import PrintCatalogButton from "@/components/PrintCatalogButton";
import CatalogPdfQr from "@/components/CatalogPdfQr";
import { ArrowRight, WhatsApp } from "@/components/Icons";
import { site } from "@/data/site";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Carta | Suecia Club Café", description: "Explora la carta digital de Suecia Club Café." };

export default async function CartaPage() {
  const catalog = await getCatalog();

  return (
    <main className="inner-page carta-page">
      <SiteHeader />

      <section className="menu-hero">
        <span>CARTA · SUECIA CLUB CAFÉ</span>
        <h1>Todo lo que puede<br/><em>llegar a tu mesa.</em></h1>
        <p>Explora los productos por categoría, consulta disponibilidad por WhatsApp o abre la versión PDF alojada. Esa dirección será estable para que también puedas compartirla o escanearla desde un QR.</p>
        <div className="menu-hero-actions">
          <a href="#carta-productos">Explorar productos <ArrowRight/></a>
          <PrintCatalogButton className="menu-pdf-button" />
          <CatalogPdfQr />
        </div>
      </section>

      <MenuCatalog productsData={catalog.products} categoriesData={catalog.categories} />

      <section className="menu-note">
        <h2>¿No encuentras algo?</h2>
        <p>La disponibilidad puede cambiar. Escríbenos y consulta por especiales, postres del día o precios.</p>
        <a href={site.whatsapp} target="_blank" rel="noreferrer"><WhatsApp/> Consultar por WhatsApp <ArrowRight/></a>
      </section>

      <PrintableCatalog products={catalog.products} categories={catalog.printableCategories} />
    </main>
  );
}
