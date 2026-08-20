import type { Product, ProductCategory } from "@/data/catalog";
import { site } from "@/data/site";

type Props = {
  products: Product[];
  categories: ProductCategory[];
};

function chunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

export default function PrintableCatalog({ products, categories }: Props) {
  return (
    <section className="print-catalog-root" aria-hidden="true">
      <header className="print-cover">
        <div className="print-cover-orbit">
          <span />
          <img src="/assets/brand/logo.jpg" alt="" />
        </div>
        <p>SUECIA · CLUB CAFÉ</p>
        <h1>Carta</h1>
        <h2>Para elegir sin prisa.</h2>
        <div className="print-cover-meta">
          <span>{site.address}</span>
          <span>{site.hours}</span>
        </div>
      </header>

      {categories.flatMap((category, categoryIndex) => {
        const items = products.filter(product => product.category === category);
        return chunks(items, 4).map((pageItems, pageIndex) => (
          <section className="print-category" key={`${category}-${pageIndex}`}>
            <div className="print-category-heading">
              <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
              <div>
                <small>SUECIA CLUB CAFÉ</small>
                <h2>{category}{pageIndex > 0 ? " · cont." : ""}</h2>
              </div>
              <em>{pageIndex === 0 ? "Para compartir la tarde." : "Seguimos eligiendo."}</em>
            </div>
            <div className="print-products-grid">
              {pageItems.map(product => (
                <article className="print-product" key={product.name}>
                  <div className="print-product-image">
                    <img src={product.image} alt="" />
                  </div>
                  <div className="print-product-copy">
                    <small>{product.category}</small>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <strong>{product.price ?? "Consultar"}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ));
      })}

      <footer className="print-catalog-footer">
        <img src="/assets/brand/logo.jpg" alt="" />
        <div>
          <small>¿QUÉ SE TE ANTOJA HOY?</small>
          <h2>Nos vemos esta tarde.</h2>
          <p>{site.address}</p>
          <p>{site.hours}</p>
          <p>@sueciaclubcafe</p>
        </div>
      </footer>
    </section>
  );
}
