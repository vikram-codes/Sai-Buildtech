/** Price entry in Indian units: type "2.5" + Crore instead of 25000000. */

export const PRICE_UNITS = [
  { id: "rupees", label: "₹", multiplier: 1 },
  { id: "lakh", label: "Lakh", multiplier: 1_00_000 },
  { id: "crore", label: "Crore", multiplier: 1_00_00_000 },
] as const;

export type PriceUnit = (typeof PRICE_UNITS)[number]["id"];

/** "2.5" + crore → 25000000 (whole rupees). Returns null for empty/invalid input. */
export function toRupees(amount: string, unit: PriceUnit): number | null {
  const cleaned = amount.replace(/,/g, "").trim();
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const multiplier = PRICE_UNITS.find((u) => u.id === unit)!.multiplier;
  // Round to whole rupees; work in integers to avoid 2.3 * 1e7 = 22999999.999…
  const [whole, fraction = ""] = cleaned.split(".");
  const digits = Math.round(Number(`${whole}${fraction}`) * multiplier / 10 ** fraction.length);
  return Number.isSafeInteger(digits) ? digits : null;
}

/** Pick a natural unit for showing an existing price: 25000000 → { "2.5", crore }. */
export function fromRupees(rupees: number): { amount: string; unit: PriceUnit } {
  const pick = (unit: PriceUnit, multiplier: number) => ({
    amount: String(Math.round((rupees / multiplier) * 1e5) / 1e5),
    unit,
  });
  if (rupees >= 1_00_00_000 && rupees % 1_00_000 === 0) return pick("crore", 1_00_00_000);
  if (rupees >= 1_00_000 && rupees % 1_000 === 0) return pick("lakh", 1_00_000);
  return { amount: String(rupees), unit: "rupees" };
}
