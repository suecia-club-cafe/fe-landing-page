import Link from "next/link";
import CoffeeRain from "@/components/CoffeeRain";
import LinkHubCards from "@/components/LinkHubCards";
import BrandMark from "@/components/BrandMark";
import { Globe } from "@/components/Icons";

export const metadata = { title: "Links | Suecia Club Café", description: "Todos los accesos de Suecia Club Café en un solo lugar." };

export default function LinksPage() {
  return (
    <main className="links-page">
      <CoffeeRain count={22}/>

      <div className="links-page-topbar">
        <Link className="links-web-button" href="/">
          <Globe />
          <span>Sitio web</span>
        </Link>
      </div>

      <div className="links-brand-stage" aria-hidden="true">
        <span className="links-brand-light" />
        <span className="links-brand-ambient ambient-one" />
        <span className="links-brand-ambient ambient-two" />

        <div className="links-brand-rings">
          <span className="links-brand-ring ring-one" />
          <span className="links-brand-ring ring-two" />
          <span className="links-brand-ring ring-three" />
          <span className="links-brand-orbit-runner"><i className="links-brand-orbit-dot" /></span>
        </div>

        <BrandMark className="links-brand-mark" size={188} alt="Suecia Club Café" />
      </div>

      <div className="links-head">
        <span>ENCUENTRA · SIGUE · COMPARTE</span>
        <h1>Todo Suecia<br/><em>en un solo lugar.</em></h1>
        <p>La carta, las redes y la ubicación en un mismo lugar. Los QR permanecen guardados hasta que decidas mostrarlos.</p>
      </div>

      <LinkHubCards large />
    </main>
  );
}
