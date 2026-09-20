import { UrgencyStatus } from '../types';

/**
 * Formats a number to standard Indian Rupee notation (e.g. 12,00,000)
 */
export function formatINR(amount: number, showSymbol = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? '₹0' : '0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.round(Math.abs(amount));

  // Convert to Indian format using Intl
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  const prefix = isNegative ? '- ' : '';
  const symbol = showSymbol ? '₹' : '';
  return `${prefix}${symbol}${formatted}`;
}

/**
 * Formats large amounts into Indian compact notations (K, L, Cr)
 * Examples: ₹45K, ₹7.42L, ₹1.25 Cr
 */
export function formatCompactINR(amount: number, showSymbol = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? '₹0' : '0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const symbol = showSymbol ? '₹' : '';
  const prefix = isNegative ? '- ' : '';

  if (absAmount >= 10000000) {
    // Crores
    const cr = absAmount / 10000000;
    const formatted = cr % 1 === 0 ? cr.toString() : cr.toFixed(2).replace(/\.?0+$/, '');
    return `${prefix}${symbol}${formatted} Cr`;
  } else if (absAmount >= 100000) {
    // Lakhs
    const lk = absAmount / 100000;
    const formatted = lk % 1 === 0 ? lk.toString() : lk.toFixed(2).replace(/\.?0+$/, '');
    return `${prefix}${symbol}${formatted}L`;
  } else if (absAmount >= 1000) {
    // Thousands
    const k = absAmount / 1000;
    const formatted = k % 1 === 0 ? k.toString() : k.toFixed(1).replace(/\.?0+$/, '');
    return `${prefix}${symbol}${formatted}K`;
  }

  return `${prefix}${symbol}${Math.round(absAmount)}`;
}

/**
 * Smart formatting depending on user preference
 */
export function formatMoney(amount: number, useCompact = false, showSymbol = true): string {
  return useCompact ? formatCompactINR(amount, showSymbol) : formatINR(amount, showSymbol);
}

/**
 * Formats a date string into friendly readable Indian date
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays === 1) return 'Tomorrow';

    // Format like "25 Sep" or "25 Sep 2026"
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: target.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    };
    return new Intl.DateTimeFormat('en-IN', options).format(target);
  } catch {
    return dateStr;
  }
}

/**
 * Determines Urgency Status for payment due dates
 */
export function getPaymentUrgency(dueDate: string, isPaid: boolean): UrgencyStatus {
  if (isPaid) return 'Paid';
  if (!dueDate) return 'Due later';

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays <= 7) return 'Due soon';
    return 'Due later';
  } catch {
    return 'Due later';
  }
}

/**
 * Downloads data as a CSV file
 */
export function downloadCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString();
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
