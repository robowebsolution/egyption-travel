export function formatUSD(value: number | string | null | undefined): string {
  const num = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.]/g, ''))
    : (typeof value === 'number' ? value : 0);
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(isNaN(num) ? 0 : num);
  } catch {
    return `$${isNaN(num) ? 0 : Math.round(num)}`;
  }
}
