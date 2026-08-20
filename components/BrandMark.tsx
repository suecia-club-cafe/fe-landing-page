import type { CSSProperties } from "react";

type BrandMarkProps = {
  className?: string;
  size?: number;
  alt?: string;
};

export default function BrandMark({
  className = "",
  size,
  alt = "Suecia Club Café",
}: BrandMarkProps) {
  const style = size
    ? ({ "--brand-mark-size": `${size}px` } as CSSProperties)
    : undefined;

  return (
    <div className={`suecia-brand-mark ${className}`.trim()} style={style}>
      <span className="brand-mark-glow" aria-hidden="true" />
      <img
        className="brand-mark-layer brand-mark-ticks"
        src="/assets/brand/suecia-tick-ring.svg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="brand-mark-layer brand-mark-origin"
        src="/assets/brand/suecia-origin-ring.svg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="brand-mark-layer brand-mark-static"
        src="/assets/brand/suecia-static.svg"
        alt={alt}
      />
    </div>
  );
}
