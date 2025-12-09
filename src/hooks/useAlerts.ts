import { useState, useMemo } from 'react';
import type {
  AlertConfig,
  AlertResult,
  WindowUnit,
} from '../utils/calculations';
import {
  calculateBurnRateAlert,
  calculateBurnRateFromBudget,
  convertToMinutes,
  calculateShortWindow,
} from '../utils/calculations';

// Default Configurations
const DEFAULT_ALERTS: AlertConfig[] = [
  {
    id: 'p1',
    label: 'Page 1 (Critical)',
    type: 'page',
    longWindowValue: 1,
    longWindowUnit: 'hours',
    budgetConsumed: 2,
  },
  {
    id: 'p2',
    label: 'Page 2 (High)',
    type: 'page',
    longWindowValue: 6,
    longWindowUnit: 'hours',
    budgetConsumed: 5,
  },
  {
    id: 'ticket',
    label: 'Ticket (Low)',
    type: 'ticket',
    longWindowValue: 3,
    longWindowUnit: 'days',
    budgetConsumed: 10,
  },
];

export interface ExtendedAlertResult extends AlertResult {
  burnRate: number;
  shortWindow: { value: number; unit: WindowUnit };
}

interface UseAlertsParams {
  slo: number;
  windowDays: number;
  totalEvents: number;
}

export const useAlerts = ({
  slo,
  windowDays,
  totalEvents,
}: UseAlertsParams) => {
  const [alerts, setAlerts] = useState<AlertConfig[]>(DEFAULT_ALERTS);

  const alertResults = useMemo(() => {
    const newResults: Record<string, ExtendedAlertResult> = {};
    const totalWindowMinutes = windowDays * 24 * 60;

    alerts.forEach((alert) => {
      const longWindowMinutes = convertToMinutes(
        alert.longWindowValue,
        alert.longWindowUnit
      );

      // 1. Calculate Burn Rate from user-provided budget consumed
      const newBurnRate = calculateBurnRateFromBudget(
        alert.budgetConsumed,
        totalWindowMinutes,
        longWindowMinutes
      );

      // 2. Calculate other alert params using the new burn rate
      const otherAlertMetrics = calculateBurnRateAlert(
        slo,
        windowDays,
        totalEvents,
        { ...alert, burnRate: newBurnRate } // Pass the calculated burn rate
      );

      const shortWindow = calculateShortWindow(
        alert.longWindowValue,
        alert.longWindowUnit
      );

      newResults[alert.id] = {
        burnRate: newBurnRate,
        shortWindow,
        ...otherAlertMetrics,
      };
    });
    return newResults;
  }, [slo, windowDays, totalEvents, alerts]);

  const updateAlert = (
    id: string,
    field: keyof AlertConfig,
    value: string | number
  ) => {
    if (field === 'longWindowUnit') {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, [field]: value as WindowUnit } : a
        )
      );
      return;
    }

    if (value === '') {
      // For number fields, empty string means 0
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: 0 } : a))
      );
      return;
    }

    if (field === 'longWindowValue') {
      const isInteger = /^[0-9]*$/.test(value as string);
      if (!isInteger) return;

      const numValue = parseInt(value as string, 10);
      if (numValue < 1 || numValue > 999) return;

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: numValue } : a))
      );
    } else if (field === 'budgetConsumed') {
      const isNumeric = /^[0-9]*\.?[0-9]*$/.test(value as string);
      if (!isNumeric) return;

      const numValue = parseFloat(value as string);
      if (numValue > 100) return;

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, [field]: numValue } : a))
      );
    }
  };

  return {
    alerts,
    updateAlert,
    alertResults,
  };
};
