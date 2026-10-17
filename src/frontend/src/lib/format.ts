import { Currency } from "@/backend";

/**
 * Motoko `Time.now()` values are nanosecond bigints. Convert through this
 * helper before any JavaScript `Date` operation.
 */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Format a backend timestamp as a long French date, with a safe fallback. */
export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? DATE_FORMATTER.format(date) : "Date inconnue";
}

const CURRENCY_FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  [Currency.usd]: new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
  [Currency.cdf]: new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "CDF",
    maximumFractionDigits: 0,
  }),
};

/** Format a whole-number amount in the given currency. */
export function formatAmount(amount: bigint, currency: Currency): string {
  return CURRENCY_FORMATTERS[currency].format(Number(amount));
}

/** Format a compact count such as 5 300 000 as « 5,3 M ». */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Percentage of a goal already raised, clamped to 0–100. */
export function progressPercent(raised: bigint, goal: bigint): number {
  if (goal <= 0n) return 0;
  const ratio = Number((raised * 10000n) / goal) / 100;
  return Math.max(0, Math.min(100, ratio));
}
