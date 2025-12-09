import { describe, it, expect } from 'vitest';
import type { WindowUnit } from './calculations';
import {
  convertToMinutes,
  calculateErrorBudgetRatio,
  calculateAllowedFailureCount,
  calculateShortWindow,
  calculateBurnRateFromBudget,
  calculateBurnRateAlert,
  formatNumber,
  formatPercentage,
} from './calculations';

describe('calculations.ts', () => {
  describe('convertToMinutes', () => {
    it('should convert days to minutes correctly', () => {
      expect(convertToMinutes(1, 'days')).toBe(1440);
      expect(convertToMinutes(0.5, 'days')).toBe(720);
    });

    it('should convert hours to minutes correctly', () => {
      expect(convertToMinutes(1, 'hours')).toBe(60);
      expect(convertToMinutes(2.5, 'hours')).toBe(150);
    });

    it('should return minutes as is', () => {
      expect(convertToMinutes(1, 'minutes')).toBe(1);
      expect(convertToMinutes(30, 'minutes')).toBe(30);
    });
  });

  describe('calculateErrorBudgetRatio', () => {
    it('should calculate the error budget ratio correctly', () => {
      expect(calculateErrorBudgetRatio(99.9)).toBeCloseTo(0.001);
      expect(calculateErrorBudgetRatio(95)).toBeCloseTo(0.05);
      expect(calculateErrorBudgetRatio(100)).toBe(0);
      expect(calculateErrorBudgetRatio(0)).toBe(1);
    });
  });

  describe('calculateAllowedFailureCount', () => {
    it('should calculate the allowed failure count correctly', () => {
      expect(calculateAllowedFailureCount(1000000, 99.9)).toBe(1000);
      expect(calculateAllowedFailureCount(100000, 99)).toBe(1000);
      expect(calculateAllowedFailureCount(100, 99.5)).toBe(1); // Rounds up
      expect(calculateAllowedFailureCount(1000, 99.99)).toBe(0); // Rounds down if less than 0.5
      expect(calculateAllowedFailureCount(0, 99.9)).toBe(0);
      expect(calculateAllowedFailureCount(1234567, 99.999)).toBe(12); // Test with non-round numbers
    });
  });

  describe('calculateShortWindow', () => {
    it('should calculate short window for days correctly (x2 hours)', () => {
      expect(calculateShortWindow(1, 'days')).toEqual({
        value: 2,
        unit: 'hours',
      });
      expect(calculateShortWindow(3, 'days')).toEqual({
        value: 6,
        unit: 'hours',
      });
    });

    it('should calculate short window for hours correctly (x5 minutes)', () => {
      expect(calculateShortWindow(1, 'hours')).toEqual({
        value: 5,
        unit: 'minutes',
      });
      expect(calculateShortWindow(6, 'hours')).toEqual({
        value: 30,
        unit: 'minutes',
      });
    });

    it('should calculate short window for minutes correctly (divided by 12, min 1)', () => {
      expect(calculateShortWindow(60, 'minutes')).toEqual({
        value: 5,
        unit: 'minutes',
      });
      expect(calculateShortWindow(12, 'minutes')).toEqual({
        value: 1,
        unit: 'minutes',
      });
      expect(calculateShortWindow(1, 'minutes')).toEqual({
        value: 1,
        unit: 'minutes',
      }); // Min 1
      expect(calculateShortWindow(0, 'minutes')).toEqual({
        value: 1,
        unit: 'minutes',
      }); // Min 1
    });
  });

  describe('calculateBurnRateFromBudget', () => {
    it('should calculate burn rate correctly', () => {
      // 2% of budget in 1hr out of 30 days. Burn rate = (0.02 * (30*24*60)) / (1*60) = 0.02 * 720 = 14.4
      expect(calculateBurnRateFromBudget(2, 30 * 24 * 60, 1 * 60)).toBeCloseTo(
        14.4
      );
      // 5% of budget in 6hr out of 30 days. Burn rate = (0.05 * (30*24*60)) / (6*60) = 0.05 * 120 = 6
      expect(calculateBurnRateFromBudget(5, 30 * 24 * 60, 6 * 60)).toBeCloseTo(
        6
      );
      // 10% of budget in 3 days out of 30 days. Burn rate = (0.10 * (30*24*60)) / (3*24*60) = 0.10 * 10 = 1
      expect(
        calculateBurnRateFromBudget(10, 30 * 24 * 60, 3 * 24 * 60)
      ).toBeCloseTo(1);
    });

    it('should return 0 if window minutes are zero', () => {
      expect(calculateBurnRateFromBudget(10, 0, 60)).toBe(0);
      expect(calculateBurnRateFromBudget(10, 1440, 0)).toBe(0);
      expect(calculateBurnRateFromBudget(10, 0, 0)).toBe(0);
    });
  });

  describe('calculateBurnRateAlert', () => {
    it('should calculate alert parameters correctly for critical alert', () => {
      const alertConfig = {
        id: 'p1',
        label: 'Page 1 (Critical)',
        type: 'page' as const,
        longWindowValue: 1,
        longWindowUnit: 'hours' as WindowUnit,
        budgetConsumed: 2,
        burnRate: 14.4, // Pre-calculated burn rate from previous tests
      };
      const result = calculateBurnRateAlert(99.9, 30, 1000000, alertConfig);
      expect(result.threshold).toBeCloseTo(0.0144); // burnRate * (1 - SLO) = 14.4 * 0.001
      expect(result.triggerErrorCount).toBeCloseTo(20); // Corrected calculation
    });

    it('should calculate alert parameters correctly for low alert (burn rate 1)', () => {
      const alertConfig = {
        id: 'ticket',
        label: 'Ticket (Low)',
        type: 'ticket' as const,
        longWindowValue: 3,
        longWindowUnit: 'days' as WindowUnit,
        budgetConsumed: 10,
        burnRate: 1, // Burn rate of 1
      };
      const result = calculateBurnRateAlert(99.9, 30, 1000000, alertConfig);
      expect(result.threshold).toBeCloseTo(0.001); // 1 * 0.001
      // For a 30-day window, 3 days is 1/10th. 1M events -> 1000 allowed errors.
      // 1000 / 10 = 100 errors in 3 days for burn rate 1.
      expect(result.triggerErrorCount).toBeCloseTo(100);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas and default 2 decimal places', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567.89123)).toBe('1,234,567.89');
      expect(formatNumber(123.4)).toBe('123.4');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(1234567890)).toBe('1,234,567,890');
    });

    it('should format numbers with specified decimal places', () => {
      expect(formatNumber(123.456, 0)).toBe('123');
      expect(formatNumber(123.456, 1)).toBe('123.5'); // Rounds
      expect(formatNumber(123.456, 3)).toBe('123.456');
    });

    it('should handle zero decimal places correctly', () => {
      expect(formatNumber(999.99, 0)).toBe('1,000');
      expect(formatNumber(0.123, 0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages with default 3 decimal places', () => {
      expect(formatPercentage(0.001)).toBe('0.1%');
      expect(formatPercentage(0.05)).toBe('5%');
      expect(formatPercentage(0.99999)).toBe('99.999%');
      expect(formatPercentage(1)).toBe('100%');
      expect(formatPercentage(0)).toBe('0%');
    });

    it('should format percentages with specified decimal places', () => {
      expect(formatPercentage(0.001234, 1)).toBe('0.1%'); // Rounds
      expect(formatPercentage(0.001234, 4)).toBe('0.1234%');
      expect(formatPercentage(0.123456, 0)).toBe('12%');
    });

    it('should handle very small numbers with exponential notation', () => {
      expect(formatPercentage(0.0000001)).toBe('1.00e-7%'); // Corrected
      expect(formatPercentage(0.0000000123)).toBe('1.23e-8%'); // Corrected
    });
  });
});
