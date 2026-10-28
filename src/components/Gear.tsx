/** Decorative slow-turning gear for the hero. Purely visual. */
export function Gear({ className = "" }: { className?: string }) {
  const teeth = 14;
  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {Array.from({ length: teeth }, (_, i) => (
        <rect key={i} x="-7" y="-92" width="14" height="16" rx="2" transform={`rotate(${(360 / teeth) * i})`} />
      ))}
      <circle r="76" />
      <circle r="60" strokeDasharray="3 7" />
      <circle r="24" />
      <circle r="8" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1="0" y1="-24" x2="0" y2="-60" transform={`rotate(${60 * i})`} />
      ))}
    </svg>
  );
}
