export const CURRENCIES: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  EUR: { symbol: "€", locale: "de-DE" },
  GBP: { symbol: "£", locale: "en-GB" },
  INR: { symbol: "₹", locale: "en-IN" },
  PKR: { symbol: "₨", locale: "ur-PK" },
  BDT: { symbol: "৳", locale: "bn-BD" },
  JPY: { symbol: "¥", locale: "ja-JP" },
  CAD: { symbol: "C$", locale: "en-CA" },
  AUD: { symbol: "A$", locale: "en-AU" },
};

/**
 * Exchange rates relative to USD (1 USD = X units of currency).
 * These are approximate static rates — for a production app you would
 * fetch live rates from an API (e.g. exchangerate-api.com).
 */
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  PKR: 278.5,
  BDT: 110.0,
  JPY: 157.0,
  CAD: 1.36,
  AUD: 1.53,
};

/**
 * Format a monetary amount without any conversion.
 * Use this when the amount is already in the target currency.
 */
export function formatMoney(amount: number, currency = "USD"): string {
  const cfg = CURRENCIES[currency] ?? CURRENCIES.USD;
  try {
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(amount);
  } catch {
    return `${cfg.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Convert an amount from one currency to another using the static rates.
 */
export function convertAmount(
  amount: number,
  toCurrency: string,
  fromCurrency = "USD",
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = EXCHANGE_RATES[fromCurrency] ?? 1;
  const toRate = EXCHANGE_RATES[toCurrency] ?? 1;
  // Convert to USD first, then to target currency
  return (amount / fromRate) * toRate;
}

/**
 * Format and convert a monetary amount from one currency to another.
 * Only use this when you actually need to convert between currencies.
 * If amount is already in the display currency, use formatMoney() instead.
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  baseCurrency = "USD",
): string {
  const converted = convertAmount(amount, currency, baseCurrency);
  return formatMoney(converted, currency);
}

/**
 * Format a date string using the user's chosen date format pattern.
 * Patterns: "MMM d, yyyy" | "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd"
 */
export function formatDate(date: string | Date, fmt: string = "medium"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  // Legacy short/medium modes used internally
  if (fmt === "short") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  if (fmt === "medium") {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Named pattern from settings
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const d2 = String(d.getDate());
  const monthShort = d.toLocaleString("default", { month: "short" });

  switch (fmt) {
    case "dd/MM/yyyy": return `${dd}/${mm}/${yyyy}`;
    case "MM/dd/yyyy": return `${mm}/${dd}/${yyyy}`;
    case "yyyy-MM-dd": return `${yyyy}-${mm}-${dd}`;
    case "MMM d, yyyy":
    default:           return `${monthShort} ${d2}, ${yyyy}`;
  }
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

