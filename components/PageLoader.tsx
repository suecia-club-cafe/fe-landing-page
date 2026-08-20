"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 760);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const showLoader = () => setVisible(true);
    window.addEventListener("suecia:navigation-start", showLoader);

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      try {
        const next = new URL(href, window.location.href);
        if (next.origin === window.location.origin && next.pathname !== window.location.pathname) setVisible(true);
      } catch {
        // Ignore malformed/external URLs.
      }
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("suecia:navigation-start", showLoader);
    };
  }, []);

  return (
    <div className={`page-loader ${visible ? "is-loading" : "is-ready"}`} aria-hidden={!visible}>
      <div className="page-loader-glow" />
      <div className="loader-orbit">
        <span className="loader-ring" />
        <span className="loader-dot" />
        <img src="/assets/brand/logo.jpg" alt="" />
      </div>
      <div className="loader-wordmark"><strong>SUECIA</strong><span>CLUB CAFÉ</span></div>
      <div className="loader-progress"><i /></div>
    </div>
  );
}
