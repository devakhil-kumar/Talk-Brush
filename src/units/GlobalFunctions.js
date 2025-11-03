
/**
 * Formats an ISO date string to a readable local datetime string
 * @param {string} isoString - The ISO date string
 * @param {Object} options - Optional formatting options
 * @returns {string} - Formatted date/time or 'Not Login' if invalid
 */
export const formatDateTime = (isoString, options = {}) => {
  if (!isoString) return 'Not Login';

  const date = new Date(isoString);

  const defaultOptions = {
    year: 'numeric',
    month: 'short', // Jan, Feb, etc.
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // AM/PM format
  };

  return date.toLocaleString(undefined, { ...defaultOptions, ...options });
};
