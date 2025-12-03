import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Calculate days until expiry
export function daysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Get expiry status color
export function getExpiryStatus(expiryDate) {
  const days = daysUntilExpiry(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 7) return 'critical';
  if (days <= 30) return 'warning';
  return 'valid';
}

// Calculate completion percentage
export function calculateCompletion(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}