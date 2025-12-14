import { renderHook, act } from '@testing-library/react';
import { useAlerts } from './useAlerts';

describe('useAlerts', () => {
  const initialParams = {
    slo: 99.9,
    windowDays: 30,
    totalEvents: 1000000,
  };

  it('should return initial alert configurations and calculate alertResults', () => {
    const { result } = renderHook(() => useAlerts(initialParams));

    // Check initial alerts are present
    expect(result.current.alerts).toHaveLength(3);
    expect(result.current.alerts[0].id).toBe('p1');

    // Check initial alertResults calculations
    const p1Result = result.current.alertResults['p1'];
    expect(p1Result).toBeDefined();
    expect(p1Result.burnRate).toBeCloseTo(14.4); // 2% budget in 1hr (30 days total)
    expect(p1Result.threshold).toBeCloseTo(0.0144); // 14.4 * 0.001 (for SLO 99.9)
    expect(p1Result.triggerErrorCount).toBeCloseTo(20);
    expect(p1Result.shortWindow).toEqual({ value: 5, unit: 'minutes' });
  });

  it('should update alert longWindowValue and recalculate alertResults', () => {
    const { result } = renderHook(() => useAlerts(initialParams));

    act(() => {
      result.current.updateAlert('p1', 'longWindowValue', '2');
    });

    const updatedAlert = result.current.alerts.find((a) => a.id === 'p1');
    expect(updatedAlert?.longWindowValue).toBe(2);

    // Recalculate burn rate and check result
    const p1Result = result.current.alertResults['p1'];
    expect(p1Result.burnRate).toBeCloseTo(7.2); // 2% budget in 2hr instead of 1hr -> burn rate halves
    expect(p1Result.threshold).toBeCloseTo(0.0072); // 7.2 * 0.001
    expect(p1Result.shortWindow).toEqual({ value: 10, unit: 'minutes' }); // 2 hours * 5 minutes/hour
  });

  it('should update alert longWindowUnit and recalculate alertResults', () => {
    const { result } = renderHook(() => useAlerts(initialParams));

    act(() => {
      result.current.updateAlert('p1', 'longWindowUnit', 'days');
    });

    const updatedAlert = result.current.alerts.find((a) => a.id === 'p1');
    expect(updatedAlert?.longWindowUnit).toBe('days');

    // Check recalculation
    const p1Result = result.current.alertResults['p1'];
    expect(p1Result.burnRate).toBeCloseTo(0.6); // 2% budget in 1 day (30 days total)
    expect(p1Result.threshold).toBeCloseTo(0.0006); // 0.6 * 0.001
    expect(p1Result.shortWindow).toEqual({ value: 2, unit: 'hours' }); // 1 day * 2 hours/day
  });

  it('should update alert budgetConsumed and recalculate alertResults', () => {
    const { result } = renderHook(() => useAlerts(initialParams));

    act(() => {
      result.current.updateAlert('p1', 'budgetConsumed', '4');
    });

    const updatedAlert = result.current.alerts.find((a) => a.id === 'p1');
    expect(updatedAlert?.budgetConsumed).toBe(4);

    // Check recalculation
    const p1Result = result.current.alertResults['p1'];
    expect(p1Result.burnRate).toBeCloseTo(28.8); // 4% budget in 1hr -> burn rate doubles
    expect(p1Result.threshold).toBeCloseTo(0.0288); // 28.8 * 0.001
  });

  it('should recalculate alertResults when slo changes', () => {
    const { result, rerender } = renderHook(
      ({ slo, windowDays, totalEvents }) =>
        useAlerts({ slo, windowDays, totalEvents }),
      { initialProps: initialParams }
    );

    expect(result.current.alertResults['p1'].threshold).toBeCloseTo(0.0144);

    act(() => {
      rerender({ ...initialParams, slo: 99.0 }); // Change SLO
    });

    // Threshold should change: burnRate (14.4) * new ebRatio (0.01) = 0.144
    expect(result.current.alertResults['p1'].threshold).toBeCloseTo(0.144);
  });

  it('should handle invalid longWindowValue input', () => {
    const { result } = renderHook(() => useAlerts(initialParams));
    const initialLongWindowValue = result.current.alerts[0].longWindowValue;

    act(() => {
      result.current.updateAlert('p1', 'longWindowValue', 'invalid');
    });
    expect(result.current.alerts[0].longWindowValue).toBe(
      initialLongWindowValue
    ); // Should not change

    act(() => {
      result.current.updateAlert('p1', 'longWindowValue', '0'); // Too low
    });
    expect(result.current.alerts[0].longWindowValue).toBe(
      initialLongWindowValue
    );

    act(() => {
      result.current.updateAlert('p1', 'longWindowValue', '1000'); // Too high
    });
    expect(result.current.alerts[0].longWindowValue).toBe(
      initialLongWindowValue
    );
  });

    it('should cap budgetConsumed at 100 when input is too high', () => {
      const initialProps = {
        slo: 99.9,
        windowDays: 30,
        totalEvents: 1000000,
      };
      const { result } = renderHook(() => useAlerts(initialProps));
      
      act(() => {
        result.current.updateAlert('p1', 'budgetConsumed', '101'); // Too high
      });
      // Expect the value to be capped at 100, not remain unchanged
      expect(result.current.alerts[0].budgetConsumed).toBe(100);
    });


  it('should set longWindowValue/budgetConsumed to 0 if empty string is passed', () => {
    const { result } = renderHook(() => useAlerts(initialParams));

    act(() => {
      result.current.updateAlert('p1', 'longWindowValue', '');
    });
    expect(result.current.alerts[0].longWindowValue).toBe(0);

    act(() => {
      result.current.updateAlert('p1', 'budgetConsumed', '');
    });
    expect(result.current.alerts[0].budgetConsumed).toBe(0);
  });
});
