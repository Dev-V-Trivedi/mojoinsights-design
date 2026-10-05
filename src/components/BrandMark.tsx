/**
 * MojoInsights product mark — the Mojo "M": two rounded diagonal strokes
 * with the detached lower-left counter.
 */
export function BrandMark({ className = 'w-6 h-6', color = '#FFE95C' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 620 404" className={className} aria-hidden="true" fill="none">
      <g stroke={color} strokeLinecap="round" strokeWidth="186">
        <path d="M190 100 L330 300" />
        <path d="M425 100 L520 300" />
      </g>
      <ellipse cx="97" cy="300" rx="97" ry="92" fill={color} />
    </svg>
  );
}

export function BrandLockup({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="w-10 h-10 shrink-0 rounded-[14px] bg-ink flex items-center justify-center shadow-level1">
        <BrandMark className="w-6 h-6" />
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-bold text-ink leading-tight tracking-[-0.01em]">
          MojoInsights
        </span>
      )}
    </span>
  );
}
