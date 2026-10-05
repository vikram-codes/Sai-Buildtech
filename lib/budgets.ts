/**
 * Budget ranges for buyers (whole rupees). Shared by the homepage search and the
 * catalogue filter bar, so both always offer exactly the same options.
 */

const CRORE = 1_00_00_000;

export const BUDGETS = [
  { id: "under-1cr", label: "Under ₹1 Cr", min: undefined, max: CRORE },
  { id: "1-3cr", label: "₹1 – 3 Cr", min: CRORE, max: 3 * CRORE },
  { id: "3-5cr", label: "₹3 – 5 Cr", min: 3 * CRORE, max: 5 * CRORE },
  { id: "5-10cr", label: "₹5 – 10 Cr", min: 5 * CRORE, max: 10 * CRORE },
  { id: "10cr-plus", label: "₹10 Cr+", min: 10 * CRORE, max: undefined },
] as const;

export type BudgetId = (typeof BUDGETS)[number]["id"];
