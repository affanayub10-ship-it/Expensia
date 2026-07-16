/** Format a monetary amount in USD. */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a date string using the user's chosen date format pattern. */
export function formatDate(date: string | Date, fmt: string = "medium"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (fmt === "short") {
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  if (fmt === "medium") {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

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
