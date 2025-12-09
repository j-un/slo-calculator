export type TimeUnit = 'minutes' | 'seconds';
export type WindowUnit = 'days' | 'hours' | 'minutes';
export type SliType = 'availability' | 'latency' | 'freshness' | 'other';

export interface AlertConfig {
  id: string;
  label: string;
  type: 'page' | 'ticket';
  longWindowValue: number;
  longWindowUnit: WindowUnit;
  budgetConsumed: number;
}

export interface AlertResult {
  threshold: number; // Error rate required to trigger
  triggerErrorCount: number; // Number of errors required in the long window
}

export const convertToMinutes = (value: number, unit: WindowUnit): number => {
  switch (unit) {
    case 'days':
      return value * 24 * 60;
    case 'hours':
      return value * 60;
    case 'minutes':
      return value;
  }
};

export const calculateErrorBudgetRatio = (slo: number) => {
  return 1 - slo / 100;
};

export const calculateAllowedFailureCount = (
  totalEvents: number,
  slo: number
) => {
  // Handle floating point precision issues (e.g. 1 - 99.9/100)
  const ratio = (100 - slo) / 100;
  return Math.round(totalEvents * ratio);
};

export const calculateShortWindow = (
  longValue: number,
  longUnit: WindowUnit
): { value: number; unit: WindowUnit } => {
  switch (longUnit) {
    case 'days':
      return { value: longValue * 2, unit: 'hours' }; // * 24 / 12
    case 'hours':
      return { value: longValue * 5, unit: 'minutes' }; // * 60 / 12
    case 'minutes': {
      const result = Math.round(longValue / 12);
      // Ensure short window is at least 1 minute if long window is > 0
      return { value: result > 0 ? result : 1, unit: 'minutes' };
    }
  }
};

export const calculateBurnRateFromBudget = (
  budgetConsumedPercent: number, // The percentage value, e.g., 2 for 2%
  totalWindowMinutes: number,
  longWindowMinutes: number
): number => {
  if (longWindowMinutes === 0 || totalWindowMinutes === 0) {
    return 0;
  }
  const budgetConsumedRatio = budgetConsumedPercent / 100; // convert percentage to ratio
  const burnRate =
    (budgetConsumedRatio * totalWindowMinutes) / longWindowMinutes;
  return burnRate;
};

export const calculateBurnRateAlert = (
  slo: number,
  totalWindowDays: number,
  totalEvents: number, // Total events in the full aggregation window
  alert: AlertConfig & { burnRate: number }
): AlertResult => {
  const ebRatio = 1 - slo / 100;

  // Threshold = Burn Rate * (1 - SLO)
  const threshold = alert.burnRate * ebRatio;

  // Total Window in Minutes
  const totalWindowMinutes = totalWindowDays * 24 * 60;

  // Long Window in Minutes
  const longWindowMinutes = convertToMinutes(
    alert.longWindowValue,
    alert.longWindowUnit
  );

  // Trigger Error Count
  // Number of errors in Long Window needed to exceed threshold.
  // Events per minute = Total Events / Total Window Minutes
  const eventsPerMinute = totalEvents / totalWindowMinutes;
  const eventsInLongWindow = eventsPerMinute * longWindowMinutes;

  const triggerErrorCount = Math.ceil(eventsInLongWindow * threshold);

  return {
    threshold,
    triggerErrorCount,
  };
};

export const formatNumber = (num: number, maximumFractionDigits = 2) => {
  // Manual formatting to ensure commas in headless environments
  const parts = num.toFixed(maximumFractionDigits).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (maximumFractionDigits === 0) {
    return parts[0];
  }

  // If original number was integer but we allow fraction digits, remove .00 if needed?
  // toFixed keeps trailing zeros.
  // The original usage of toLocaleString(undefined, { maximumFractionDigits }) doesn't keep trailing zeros usually.
  // But here we used toFixed which forces them.
  // Let's emulate toLocaleString behavior loosely: remove trailing zeros if they are 0.
  // Actually, simpler:
  return parseFloat(num.toFixed(maximumFractionDigits)).toLocaleString('en-US');
};

export const formatPercentage = (num: number, decimals = 3) => {
  if (num > 0 && num < 0.00001) {
    return num.toExponential(2) + '%';
  }
  return (
    (num * 100).toLocaleString('en-US', { maximumFractionDigits: decimals }) +
    '%'
  );
};
