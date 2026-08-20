"use client";

import { FileText } from "@/components/Icons";
import { site } from "@/data/site";

type Props = {
  className?: string;
  compact?: boolean;
  label?: string;
};

export default function PrintCatalogButton({ className = "", compact = false, label = "Ver carta en PDF" }: Props) {
  return (
    <button
      type="button"
      className={`${className} print-catalog-button ${compact ? "is-compact" : ""}`.trim()}
      onClick={() => window.open(site.menuPdfPath, "_blank", "noopener,noreferrer")}
      aria-label={label}
      title={label}
    >
      <FileText />
      {!compact && <span>{label}</span>}
    </button>
  );
}
