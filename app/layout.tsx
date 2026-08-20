import type { Metadata } from "next";
import type { ReactNode } from "react";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import PageLoader from "@/components/PageLoader";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suecia Club Café | Café de especialidad en Pueblo Libre",
  description: "Café de especialidad, dulces, sándwiches y más en Pueblo Libre. Lunes a sábado, de 4 a 10 pm.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <PageLoader />
        <SmoothScroll />
        {children}
        <FloatingActionMenu />
      </body>
    </html>
  );
}
