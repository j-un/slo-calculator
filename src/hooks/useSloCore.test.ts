import { renderHook, act } from '@testing-library/react';
import { useSloCore } from './useSloCore';

describe('useSloCore', () => {
  it('should return initial state values', () => {
    const { result } = renderHook(() => useSloCore());

    expect(result.current.sliDescription).toBe('');
    expect(result.current.slo).toBe(99.9);
    expect(result.current.windowDays).toBe(30);
    expect(result.current.totalEvents).toBe(1000000);
    expect(result.current.formattedTotalEvents).toBe('1,000,000');
    expect(result.current.collectionFreq).toBe('1m');
    expect(result.current.ebRatio).toBeCloseTo(0.001);
    expect(result.current.allowedFailures).toBe(1000);
  });

  it('should update sliDescription', () => {
    const { result } = renderHook(() => useSloCore());

    act(() => {
      result.current.setSliDescription('Test Description');
    });

    expect(result.current.sliDescription).toBe('Test Description');
  });

  it('should update slo and recalculate ebRatio and allowedFailures', () => {
    const { result } = renderHook(() => useSloCore());

    act(() => {
      result.current.setSlo(99.0);
    });

    expect(result.current.slo).toBe(99.0);
    expect(result.current.ebRatio).toBeCloseTo(0.01);
    expect(result.current.allowedFailures).toBe(10000); // 1,000,000 * 0.01
  });

  it('should update windowDays', () => {
    const { result } = renderHook(() => useSloCore());

    act(() => {
      result.current.setWindowDays(7);
    });

    expect(result.current.windowDays).toBe(7);
  });

  it('should update totalEvents and recalculate ebRatio and allowedFailures', () => {
    const { result } = renderHook(() => useSloCore());

    act(() => {
      result.current.setTotalEvents(500000);
    });

    expect(result.current.totalEvents).toBe(500000);
    expect(result.current.formattedTotalEvents).toBe('500,000');
    expect(result.current.ebRatio).toBeCloseTo(0.001); // SLO (99.9) is unchanged
    expect(result.current.allowedFailures).toBe(500); // 500,000 * 0.001
  });

  it('should update collectionFreq', () => {
    const { result } = renderHook(() => useSloCore());

    act(() => {
      result.current.setCollectionFreq('5m');
    });

    expect(result.current.collectionFreq).toBe('5m');
  });

  describe('handleTotalEventsChange', () => {
    it('should update totalEvents for valid numeric input', () => {
      const { result } = renderHook(() => useSloCore());

      act(() => {
        result.current.handleTotalEventsChange({
          target: { value: '500,000' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.totalEvents).toBe(500000);
      expect(result.current.formattedTotalEvents).toBe('500,000');
    });

    it('should set totalEvents to 0 for empty input', () => {
      const { result } = renderHook(() => useSloCore());

      act(() => {
        result.current.handleTotalEventsChange({
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.totalEvents).toBe(0);
      expect(result.current.formattedTotalEvents).toBe('0');
    });

    it('should not update totalEvents for invalid non-numeric input', () => {
      const { result } = renderHook(() => useSloCore());
      const initialTotalEvents = result.current.totalEvents;
      const initialFormattedTotalEvents = result.current.formattedTotalEvents;

      act(() => {
        result.current.handleTotalEventsChange({
          target: { value: 'abc' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.totalEvents).toBe(initialTotalEvents);
      expect(result.current.formattedTotalEvents).toBe(
        initialFormattedTotalEvents
      );
    });
  });
});
