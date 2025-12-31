export function formatNumber(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US");
}

export function formatCurrency(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return `$${value.toFixed(2)}`;
}

export function formatPercent(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(2)}%`;
}
