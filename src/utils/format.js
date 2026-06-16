export function formatCurrency(amount, currency = 'INR') {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPct(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

export function aggregateGroup(items) {
  const invested = items.reduce((s, i) => s + i.investedAmount, 0);
  const current = items.reduce((s, i) => s + i.currentValue, 0);
  const gain = current - invested;
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0;
  return { invested, current, gain, gainPct };
}
