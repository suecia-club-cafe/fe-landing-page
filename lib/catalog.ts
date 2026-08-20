import { categories, printableCategories, products, type CatalogFilter, type Product, type ProductCategory } from "@/data/catalog";

/**
 * Adaptador de contenido del catálogo.
 * Hoy devuelve el catálogo local; mañana puede consultar Sanity sin cambiar
 * MenuCatalog ni el generador de PDF: ambos consumen esta misma estructura.
 */
export async function getCatalog(): Promise<{ products: Product[]; categories: CatalogFilter[]; printableCategories: ProductCategory[] }> {
  return { products, categories, printableCategories };
}
