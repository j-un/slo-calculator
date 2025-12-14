import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlertCard from './AlertCard';
import type { AlertConfig } from '../utils/calculations';
import type { ExtendedAlertResult } from '../hooks/useAlerts';
import {
  formatNumber,
  formatPercentage,
  calculateTimeToExhaustion,
} from '../utils/calculations'; // Import actual functions

describe('AlertCard', () => {
  const mockUpdateAlert = vi.fn();
  const mockWindowDays = 30;

  const mockAlert: AlertConfig = {
    id: 'test-alert',
    label: 'Test Alert',
    type: 'page',
    longWindowValue: 24,
    longWindowUnit: 'hours',
    budgetConsumed: 50.5,
  };

  const mockResult: ExtendedAlertResult = {
    threshold: 0.05,
    triggerErrorCount: 100,
    burnRate: 2.5,
    shortWindow: { value: 2, unit: 'hours' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders alert details correctly', () => {
    render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    // Check Header
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('Page / Call')).toBeInTheDocument(); // type='page' and id!='p2'

    // Check Calculated Values (using actual formatters)
    expect(screen.getByText(formatNumber(mockResult.burnRate, 1))).toBeInTheDocument(); // Burn Rate
    expect(screen.getByText(calculateTimeToExhaustion(mockWindowDays, mockResult.burnRate))).toBeInTheDocument(); // Time to Exhaustion
    expect(screen.getByText(formatNumber(mockResult.triggerErrorCount, 0))).toBeInTheDocument(); // Trigger Errors
    expect(screen.getByText(formatPercentage(mockResult.threshold, 4))).toBeInTheDocument(); // Threshold
  });

  it('renders correct badge for ticket type', () => {
    const ticketAlert: AlertConfig = { ...mockAlert, type: 'ticket' };
    render(
      <AlertCard
        alert={ticketAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );
    expect(screen.getByText('Ticket / Issue')).toBeInTheDocument();
  });

  it('handles Long Window input changes and updates on blur', () => {
    render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    const input = screen.getByDisplayValue(mockAlert.longWindowValue.toString()); // Initial longWindowValue

    // Change value
    fireEvent.change(input, { target: { value: '48' } });
    expect(input).toHaveValue('48');
    // updateAlert should not be called yet
    expect(mockUpdateAlert).not.toHaveBeenCalled();

    // Blur
    fireEvent.blur(input);
    expect(mockUpdateAlert).toHaveBeenCalledWith(
      'test-alert',
      'longWindowValue',
      '48'
    );
  });

  it('prevents non-numeric input for Long Window', () => {
    render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    const input = screen.getByDisplayValue(mockAlert.longWindowValue.toString());

    // Try to enter non-numeric
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue(mockAlert.longWindowValue.toString());
  });

  it('handles Budget Consumed input changes and updates on blur', () => {
    render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    const input = screen.getByDisplayValue(mockAlert.budgetConsumed.toString());

    // Change value
    fireEvent.change(input, { target: { value: '60.5' } });
    expect(input).toHaveValue('60.5');

    // Blur
    fireEvent.blur(input);
    expect(mockUpdateAlert).toHaveBeenCalledWith(
      'test-alert',
      'budgetConsumed',
      '60.5'
    );
  });

  it('handles Long Window Unit change', () => {
    render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    // Initial value is 'hours' -> 'h' in select options usually, but value is 'hours'
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('hours');

    fireEvent.change(select, { target: { value: 'days' } });

    expect(mockUpdateAlert).toHaveBeenCalledWith(
      'test-alert',
      'longWindowUnit',
      'days'
    );
  });
  
  it('syncs local state when props change', () => {
     const { rerender } = render(
      <AlertCard
        alert={mockAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );
    
    const budgetInput = screen.getByDisplayValue(mockAlert.budgetConsumed.toString());
    expect(budgetInput).toBeInTheDocument();

    // Re-render with new prop
    const newAlert = { ...mockAlert, budgetConsumed: 75 };
    rerender(
      <AlertCard
        alert={newAlert}
        result={mockResult}
        updateAlert={mockUpdateAlert}
        windowDays={mockWindowDays}
      />
    );

    expect(screen.getByDisplayValue('75')).toBeInTheDocument();
  });
});
