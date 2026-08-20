export const site = {
  name: "Suecia Club Café",
  shortName: "Suecia",
  address: "Jr. Martín Alonso de Meza 135, Pueblo Libre, Lima",
  hours: "Lunes a sábado · 4:00 pm — 10:00 pm",
  instagram: "https://www.instagram.com/sueciaclubcafe/",
  tiktok: "https://www.tiktok.com/@sueciaclubcafe",
  whatsapp: "https://wa.me/51904407086",
  maps: "https://www.google.com/maps/search/?api=1&query=Jr.+Martin+Alonso+de+Meza+135,+Pueblo+Libre,+Lima",
  mapsEmbed: "https://www.google.com/maps?q=Jr.%20Martin%20Alonso%20de%20Meza%20135%2C%20Pueblo%20Libre%2C%20Lima&output=embed",
  // Stable public endpoint used by every QR. Today it redirects to the static
  // PDF below; later the route can regenerate/publish the latest CMS version
  // without ever changing printed QR codes.
  menuPdfPath: "/api/carta-pdf",
  menuPdfFile: "/carta-suecia-club-cafe.pdf",
};

export function whatsappForProduct(name: string) {
  return `${site.whatsapp}?text=${encodeURIComponent(`Hola, quisiera consultar por ${name} de Suecia Club Café.`)}`;
}
