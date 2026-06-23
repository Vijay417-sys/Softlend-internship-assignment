/**
 * Format a number as Indian Rupee currency string
 * e.g. 500000 -> "₹5,00,000"
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  // Indian numbering system
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
  return `₹${formatted}`;
}

/**
 * Format an ISO date string to a readable date
 * e.g. "2024-01-10" -> "Jan 10, 2024"
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate monthly EMI
 * EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]
 * @param {number} principal
 * @param {number} annualRate - annual interest rate in %
 * @param {number} tenureMonths
 * @returns {number}
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  const P = Number(principal);
  const r = Number(annualRate) / 12 / 100;
  const n = Number(tenureMonths);
  if (!P || !r || !n) return 0;
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return parseFloat(emi.toFixed(2));
}

/**
 * Get CIBIL score color category
 * @param {number} score
 * @returns {'red' | 'amber' | 'green'}
 */
export function getScoreCategory(score) {
  if (score < 650) return 'red';
  if (score < 750) return 'amber';
  return 'green';
}
