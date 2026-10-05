'use client';

import * as React from 'react';
import { Icon, type IconName } from './Icon';

/* ---------------- Page header (identical rhythm on every screen) --------------- */

export function PageHeader({
  title, description, badges, actions,
}: {
  title: string;
  description?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display text-page-title text-ink">{title}</h1>
          {badges}
        </div>
        {description && <p className="text-sm text-neutralx-secondary leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </section>
  );
}

export function LivePill({ label = 'Live Stream Active' }: { label?: string }) {
  return (
    <span className="badge bg-success-tint text-success border-success/20">
      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
      {label}
    </span>
  );
}

export function VersionPill({ children }: { children: React.ReactNode }) {
  return <span className="badge bg-white text-neutralx-secondary border-hairline font-mono">{children}</span>;
}

/* ------------------------------- Card ---------------------------------- */

export function Card({
  children, className = '', pad = true, as: As = 'div',
}: { children: React.ReactNode; className?: string; pad?: boolean; as?: any }) {
  return <As className={`card ${pad ? 'card-pad' : ''} ${className}`}>{children}</As>;
}

export function CardHeader({
  title, subtitle, action, icon,
}: { title: string; subtitle?: string; action?: React.ReactNode; icon?: IconName }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-ink shrink-0">
              <Icon name={icon} className="w-4 h-4" />
            </span>
          )}
          <h2 className="font-display text-card-title text-ink">{title}</h2>
        </div>
        {subtitle && <p className="text-[12.5px] text-neutralx-secondary mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------- KPI ----------------------------------- */

export type Delta = { value: string; positive?: boolean; neutral?: boolean };

export function KpiCard({
  label, value, unit, delta, caption, icon, tone = 'light', spark, children,
}: {
  label: string; value: string | number; unit?: string; delta?: Delta;
  caption?: React.ReactNode; icon?: IconName; tone?: 'light' | 'dark' | 'gold';
  spark?: number[]; children?: React.ReactNode;
}) {
  const dark = tone === 'dark';
  const gold = tone === 'gold';
  return (
    <div className={[
      'rounded-card border p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] transition-shadow hover:shadow-level2',
      dark ? 'bg-ink border-white/10 text-white'
        : gold ? 'bg-gold border-gold text-ink'
        : 'bg-white border-hairline shadow-level1',
    ].join(' ')}>
      <div className="flex items-start justify-between gap-4">
        <span className={`label-micro ${dark ? 'text-white/90' : gold ? 'text-ink/70' : ''}`}>{label}</span>
        {icon && (
          <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            gold ? 'bg-ink text-gold' : 'bg-gold text-ink'}`}>
            <Icon name={icon} className="w-4 h-4" />
          </span>
        )}
      </div>

      <div className="my-4 flex items-end justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display text-[24px] sm:text-kpi tnum ${dark ? 'text-white' : 'text-ink'}`}>{value}</span>
          {unit && <span className={`text-sm ${dark ? 'text-white/90' : gold ? 'text-ink/70' : 'text-neutralx-secondary'}`}>{unit}</span>}
        </div>
        {delta && (
          <span className={[
            'badge',
            delta.neutral ? (dark ? 'bg-white/15 text-white border-white/25' : 'bg-info-tint text-ink border-hairline')
              : delta.positive ? 'bg-success-tint text-success border-success/20'
              : 'bg-danger-tint text-danger border-danger/20',
          ].join(' ')}>
            {!delta.neutral && <Icon name="trend" className={`w-3.5 h-3.5 ${delta.positive ? '' : 'rotate-180'}`} />}
            {delta.value}
          </span>
        )}
        {spark && <Sparkline data={spark} className="w-24 h-8" tone={dark ? 'light' : 'ink'} />}
      </div>

      {caption && (
        <div className={`text-[12px] leading-relaxed ${dark ? 'text-white/90' : gold ? 'text-ink/70' : 'text-neutralx-secondary'}`}>
          {caption}
        </div>
      )}
      {children}
    </div>
  );
}

/* ----------------------------- Charts ---------------------------------- */

export function Sparkline({
  data, className = 'w-full h-10', tone = 'ink',
}: { data: number[]; className?: string; tone?: 'ink' | 'gold' | 'light' | 'success' | 'danger' }) {
  const color = { ink: '#111013', gold: '#F0BC00', light: '#FFFFFF', success: '#1F9D55', danger: '#D93D3D' }[tone];
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * 100, 32 - ((d - min) / span) * 28]);
  const path = smoothPath(pts);
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function smoothPath(pts: number[][]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export function AreaChart({
  series, labels, height = 220,
}: {
  series: { name: string; data: number[]; color: string; fill?: string }[];
  labels: string[];
  height?: number;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const all = series.flatMap((s) => s.data);
  const max = Math.max(...all) * 1.12, min = 0;
  const W = 100, H = 100;
  const x = (i: number) => (i / (labels.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * H;

  return (
    <div className="w-full">
      <div className="relative" style={{ height }}
           onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="#E7E6E1" strokeWidth="0.4"
                  strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          ))}
          {series.map((s) => {
            const pts = s.data.map((d, i) => [x(i), y(d)]);
            const line = smoothPath(pts);
            return (
              <g key={s.name}>
                {s.fill && <path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={s.fill} opacity="0.5" />}
                <path d={line} fill="none" stroke={s.color} strokeWidth="2.2" strokeLinecap="round"
                      vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="#111013" strokeWidth="0.6"
                  strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          )}
        </svg>

        {/* hover hit areas + dots */}
        <div className="absolute inset-0 flex">
          {labels.map((_, i) => (
            <button key={i} onMouseEnter={() => setHover(i)} aria-label={`${labels[i]}`}
                    className="flex-1 h-full cursor-crosshair" />
          ))}
        </div>

        {hover !== null && (
          <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full z-10"
               style={{ left: `${(hover / (labels.length - 1)) * 100}%`, top: '34%' }}>
            <div className="rounded-full bg-ink text-white px-3.5 py-2 shadow-level3 whitespace-nowrap flex items-center gap-2.5">
              <span className="text-[11px] font-semibold text-white/85">{labels[hover]}</span>
              {series.map((s) => (
                <span key={s.name} className="text-[11.5px] font-bold tnum" style={{ color: s.color === '#111013' ? '#fff' : s.color }}>
                  {s.data[hover].toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-3 px-0.5">
        {labels.map((l, i) => (
          <span key={l} className={`text-[11px] tnum transition-colors ${hover === i ? 'text-ink font-semibold' : 'text-neutralx-muted'}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function BarMeter({
  label, value, total, percent, color = '#111013',
}: { label: string; value?: string | number; total?: string; percent: number; color?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="flex items-center gap-2 text-[12.5px] font-medium text-ink min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
          <span className="truncate">{label}</span>
        </span>
        <span className="text-[12px] text-neutralx-secondary tnum shrink-0">
          {percent}%{value !== undefined && ` (${value})`}{total && ` / ${total}`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-canvas overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  );
}

export function Gauge({ value, label, size = 150 }: { value: number; label: string; size?: number }) {
  const r = 52, c = Math.PI * r;
  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 130 72" className="w-full">
        <path d="M 13 65 A 52 52 0 0 1 117 65" fill="none" stroke="#E7E6E1" strokeWidth="13" strokeLinecap="round" />
        <path d="M 13 65 A 52 52 0 0 1 117 65" fill="none" stroke="#111013" strokeWidth="13" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,1,.36,1)' }} />
        <text x="65" y="56" textAnchor="middle" className="fill-ink font-display tnum" style={{ fontSize: 22, fontWeight: 700 }}>
          {value}%
        </text>
      </svg>
      <p className="label-micro -mt-1">{label}</p>
    </div>
  );
}

export function Donut({
  segments, size = 150, centerLabel, centerValue,
}: { segments: { label: string; value: number; color: string }[]; size?: number; centerLabel?: string; centerValue?: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const R = 42, C = 2 * Math.PI * R;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#F0EFEA" strokeWidth="13" />
        {segments.map((s) => {
          const len = (s.value / total) * C;
          const el = (
            <circle key={s.label} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="13"
                    strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += len;
          return el;
        })}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold text-ink tnum">{centerValue}</span>
          <span className="label-micro text-[10px]">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Controls -------------------------------- */

export function Segmented<T extends string>({
  options, value, onChange, size = 'md',
}: { options: readonly T[]; value: T; onChange: (v: T) => void; size?: 'sm' | 'md' }) {
  return (
    <div className="inline-flex max-w-full items-center p-1 bg-black/[0.055] rounded-full overflow-x-auto scroll-x" role="tablist">
      {options.map((o) => (
        <button key={o} role="tab" aria-selected={value === o} onClick={() => onChange(o)}
                className={[
                  'rounded-full font-semibold transition-all whitespace-nowrap',
                  size === 'sm' ? 'px-3 py-1 text-[11.5px]' : 'px-3.5 py-1.5 text-badge',
                  value === o ? 'bg-ink text-white shadow-level1' : 'text-neutralx-secondary hover:text-ink',
                ].join(' ')}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs, value, onChange,
}: { tabs: { id: T; label: string; badge?: string | number; dot?: boolean }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-full border border-hairline shadow-level1 overflow-x-auto scroll-x max-w-full"
         role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}
                className={[
                  'flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap',
                  value === t.id ? 'bg-ink text-white shadow-level1' : 'text-neutralx-secondary hover:text-ink hover:bg-hover',
                ].join(' ')}>
          {t.label}
          {t.dot && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
          {t.badge !== undefined && (
            <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center tnum ${
              value === t.id ? 'bg-gold text-ink' : 'bg-canvas text-neutralx-secondary border border-hairline'}`}>
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value, onChange, placeholder = 'Filter…', className = '',
}: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={`relative flex items-center bg-white rounded-full border border-hairline shadow-level1 h-10 px-3.5
                     focus-within:border-ink focus-within:shadow-focus transition-shadow ${className}`}>
      <Icon name="filter" className="w-4 h-4 text-neutralx-muted shrink-0" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}
             className="w-full bg-transparent border-none outline-none px-2.5 text-[12.5px] text-ink placeholder:text-neutralx-muted" />
      {value && (
        <button onClick={() => onChange('')} aria-label="Clear filter"
                className="shrink-0 text-neutralx-muted hover:text-ink transition-colors">
          <Icon name="x" className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function Select({
  value, onChange, options, label,
}: { value: string; onChange: (v: string) => void; options: string[]; label?: string }) {
  return (
    <label className="relative inline-flex items-center">
      {label && <span className="sr-only">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}
              className="appearance-none h-10 pl-4 pr-9 rounded-full bg-white border border-hairline shadow-level1
                         text-[12.5px] font-semibold text-ink cursor-pointer hover:bg-hover transition-colors
                         focus:outline-none focus:border-ink focus:shadow-focus">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <Icon name="chevronDown" className="w-4 h-4 absolute right-3 pointer-events-none text-neutralx-muted" />
    </label>
  );
}

export function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:shadow-focus ${
              checked ? 'bg-ink' : 'bg-hairline'}`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}

export function Checkbox({
  checked, onChange, label, indeterminate,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; indeterminate?: boolean }) {
  return (
    <button role="checkbox" aria-checked={indeterminate ? 'mixed' : checked} aria-label={label}
            onClick={() => onChange(!checked)}
            className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-all shrink-0
                        focus-visible:outline-none focus-visible:shadow-focus ${
              checked || indeterminate ? 'bg-ink border-ink text-white' : 'bg-white border-neutralx-muted hover:border-ink'}`}>
      {indeterminate ? <span className="w-2 h-0.5 bg-white rounded" />
        : checked ? <Icon name="check" className="w-3 h-3" strokeWidth={3} /> : null}
    </button>
  );
}

export function StatusDot({ tone }: { tone: 'success' | 'danger' | 'warning' | 'muted' }) {
  const c = { success: 'bg-success', danger: 'bg-danger', warning: 'bg-gold', muted: 'bg-neutralx-muted' }[tone];
  return <span className={`w-2 h-2 rounded-full shrink-0 ${c}`} />;
}

export function ProgressBar({ percent, tone = 'ink' }: { percent: number; tone?: 'ink' | 'gold' | 'success' | 'danger' }) {
  const c = { ink: 'bg-ink', gold: 'bg-gold', success: 'bg-success', danger: 'bg-danger' }[tone];
  return (
    <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
      <div className={`h-full rounded-full ${c} transition-[width] duration-700`} style={{ width: `${percent}%` }} />
    </div>
  );
}

/* ------------------------------ Table ---------------------------------- */

export function TableShell({
  children, className = '', minWidth = 840,
}: { children: React.ReactNode; className?: string; minWidth?: number }) {
  return (
    <div className={`overflow-x-auto scroll-x -mx-6 px-6 ${className}`}>
      <table className="w-full border-collapse table-auto" style={{ minWidth }}>{children}</table>
    </div>
  );
}

export function SortHeader({
  label, active, dir, onClick, align = 'left',
}: { label: string; active?: boolean; dir?: 'asc' | 'desc'; onClick?: () => void; align?: 'left' | 'right' }) {
  return (
    <th className={`th ${align === 'right' ? 'text-right' : ''}`}>
      {onClick ? (
        <button onClick={onClick}
                className={`inline-flex items-center gap-1.5 uppercase transition-colors hover:text-ink ${active ? 'text-ink' : ''}`}>
          {label}
          <Icon name="chevronDown" className={`w-3 h-3 transition-transform ${active && dir === 'asc' ? 'rotate-180' : ''} ${active ? 'opacity-100' : 'opacity-30'}`} />
        </button>
      ) : label}
    </th>
  );
}

export function Pagination({
  page, pageCount, total, onPage, unit = 'rows',
}: { page: number; pageCount: number; total: number; onPage: (p: number) => void; unit?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 mt-1 border-t border-hairline flex-wrap">
      <p className="text-[12px] text-neutralx-secondary tnum">
        Page <strong className="text-ink">{page}</strong> of {pageCount} · {total.toLocaleString()} {unit}
      </p>
      <div className="flex items-center gap-2">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
                className="btn-ghost !px-4 !py-2 !text-[12px] disabled:opacity-40">Previous</button>
        <button onClick={() => onPage(Math.min(pageCount, page + 1))} disabled={page === pageCount}
                className="btn-dark !px-4 !py-2 !text-[12px] disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

export function EmptyState({ icon = 'search', title, body, action }: { icon?: IconName; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <span className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-ink mb-4">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <p className="font-display text-card-title text-ink">{title}</p>
      <p className="text-[12.5px] text-neutralx-secondary mt-1.5 max-w-sm">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ------------------------------ Modal ---------------------------------- */

export function Modal({
  open, onClose, title, description, children, footer, width = 'max-w-lg',
}: {
  open: boolean; onClose: () => void; title: string; description?: string;
  children?: React.ReactNode; footer?: React.ReactNode; width?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`relative w-full ${width} bg-white rounded-card border border-hairline shadow-level3 animate-fade-up max-h-[88vh] flex flex-col`}>
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <h2 className="font-display text-[19px] font-bold text-ink">{title}</h2>
            {description && <p className="text-[12.5px] text-neutralx-secondary mt-1.5 leading-relaxed">{description}</p>}
          </div>
          <button onClick={onClose} aria-label="Close dialog"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutralx-muted hover:bg-hover hover:text-ink transition-colors shrink-0">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        {children && <div className="px-6 pb-2 overflow-y-auto">{children}</div>}
        {footer && <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-hairline mt-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------ Toast ---------------------------------- */

const ToastCtx = React.createContext<(msg: string, tone?: 'success' | 'danger' | 'info') => void>(() => {});
export const useToast = () => React.useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<{ id: number; msg: string; tone: string }[]>([]);
  const push = React.useCallback((msg: string, tone: 'success' | 'danger' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
               className="animate-fade-up pointer-events-auto flex items-center gap-3 rounded-full bg-ink text-white
                          pl-4 pr-5 py-3 shadow-level3 max-w-sm">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              t.tone === 'danger' ? 'bg-danger' : t.tone === 'info' ? 'bg-white/15' : 'bg-success'}`}>
              <Icon name={t.tone === 'danger' ? 'x' : 'check'} className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            <span className="text-[12.5px] font-medium">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* --------------------------- Misc helpers ------------------------------ */

export function Avatar({ src, name, size = 32 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  if (src) return <img src={src} alt="" style={{ width: size, height: size }} className="rounded-full object-cover border border-hairline shrink-0" />;
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.36 }}
          className="rounded-full bg-ink text-gold font-bold flex items-center justify-center shrink-0">
      {initials}
    </span>
  );
}

export function Mono({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`mono ${className}`}>{children}</span>;
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const toast = useToast();
  return (
    <button onClick={() => { navigator.clipboard?.writeText(value); toast('Copied to clipboard'); }}
            aria-label={label}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutralx-muted hover:text-ink hover:bg-hover transition-colors shrink-0">
      <Icon name="copy" className="w-3.5 h-3.5" />
    </button>
  );
}

export function SectionGrid({ children, cols = 3, className = '' }: { children: React.ReactNode; cols?: 2 | 3 | 4; className?: string }) {
  const c = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 xl:grid-cols-3', 4: 'grid-cols-2 xl:grid-cols-4' }[cols];
  return <section className={`grid grid-cols-1 ${c} gap-5 ${className}`}>{children}</section>;
}
