import catalogData from "@/data/catalog.json";

export type ProductCategory = "Café" | "Dulces" | "Salados" | "Bebidas" | "Combos";

export type Product = {
  name: string;
  category: ProductCategory;
  image: string;
  description: string;
  price?: string;
};

/**
 * Fuente única local del catálogo mientras el sitio funciona sin CMS.
 * El JSON también alimenta el script que publica la carta PDF estática.
 * Cuando llegue Sanity, `lib/catalog.ts` será el adaptador que lea el CMS y
 * el proceso de publicación podrá regenerar este mismo PDF automáticamente.
 */
export const products = catalogData.products as Product[];

export type CatalogFilter = "Todos" | ProductCategory;
const categoryOrder: ProductCategory[] = ["Café", "Dulces", "Salados", "Bebidas", "Combos"];
export const printableCategories: ProductCategory[] = categoryOrder.filter(category => products.some(product => product.category === category));
export const categories: CatalogFilter[] = ["Todos", ...printableCategories];
