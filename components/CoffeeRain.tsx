export default function CoffeeRain({ count = 18, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`coffee-rain ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="coffee-bean"
          style={{
            left: `${(i * 37) % 101}%`,
            animationDelay: `${-(i * 0.73)}s`,
            animationDuration: `${8 + (i % 7) * 1.15}s`,
            opacity: 0.12 + (i % 5) * 0.045,
            transform: `scale(${0.6 + (i % 5) * 0.13}) rotate(${i * 19}deg)`,
          }}
        />
      ))}
    </div>
  );
}
