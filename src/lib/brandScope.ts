import { BRANDS, ALL_BRANDS_ID } from '@/data/brands';

/** Stable string hash so each record always belongs to the same brand across reloads. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Index of the brand that owns a record. In production this comes from the record's brand_id. */
export function ownerIndex(id: string): number {
  return hash(id) % BRANDS.length;
}

/** Keep only the rows that belong to the selected brand. "All brands" returns everything. */
export function scopeRows<T extends { id: string }>(rows: T[], brandId: string, min = 3): T[] {
  if (brandId === ALL_BRANDS_ID) return rows;
  const idx = BRANDS.findIndex((b) => b.id === brandId);
  if (idx < 0) return rows;
  const owned = rows.filter((r) => ownerIndex(r.id) === idx);
  if (owned.length >= Math.min(min, rows.length)) return owned;
  // Too few records for this brand: top up from the rest, rotated per brand, so the list is never empty.
  const need = Math.min(min, rows.length);
  const rest = rows.filter((r) => !owned.includes(r));
  const start = idx % Math.max(1, rest.length);
  const extra = [...rest.slice(start), ...rest.slice(0, start)].slice(0, need - owned.length);
  return [...owned, ...extra];
}

/** Count of a brand's share, used for KPI tiles on top of the scoped table. */
export function scopeCount(total: number, brandId: string): number {
  if (brandId === ALL_BRANDS_ID) return total;
  const b = BRANDS.find((x) => x.id === brandId);
  return Math.max(0, Math.round(total * (b?.scale ?? 1)));
}
