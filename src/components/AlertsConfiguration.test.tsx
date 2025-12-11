import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlertsConfiguration from './AlertsConfiguration';
import { useSloContext } from '../contexts/SloProvider';
import type {
  AlertConfig,
  AlertResult,
  WindowUnit,
} from '../utils/calculations';

// Mock AlertCard to prevent full rendering and assert its props
vi.mock('./AlertCard', () => ({
  default: vi.fn(() => null),
}));
import AlertCard from './AlertCard';

// Mock useSloContext
vi.mock('../contexts/SloProvider', async () => {
  const actual = await vi.importActual('../contexts/SloProvider');
  return {
    ...actual,
    useSloContext: vi.fn(),
  };
});

describe('AlertsConfiguration', () => {
  const mockAlerts: AlertConfig[] = [
    {
      id: 'p1',
      label: 'Page 1 (Critical)',
      type: 'page',
      longWindowValue: 1,
      longWindowUnit: 'hours',
      budgetConsumed: 2,
    },
    {
      id: 't1',
      label: 'Ticket 1 (Low)',
      type: 'ticket',
      longWindowValue: 3,
      longWindowUnit: 'days',
      budgetConsumed: 10,
    },
  ];

  const mockAlertResults: Record<
    string,
    AlertResult & {
      burnRate: number;
      shortWindow: { value: number; unit: WindowUnit };
    }
  > = {
    p1: {
      threshold: 0.0144,
      triggerErrorCount: 20,
      burnRate: 14.4,
      shortWindow: { value: 5, unit: 'minutes' },
    },
    t1: {
      threshold: 0.001,
      triggerErrorCount: 100,
      burnRate: 1,
      shortWindow: { value: 6, unit: 'hours' },
    },
  };

  const mockUpdateAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSloContext as ReturnType<typeof vi.fn>).mockReturnValue({
      alerts: mockAlerts,
      alertResults: mockAlertResults,
      updateAlert: mockUpdateAlert,
      // Provide other context values that might be accessed by SloProvider's internal logic, even if not directly by this component
      sliDescription: '',
      setSliDescription: vi.fn(),
      slo: 99.9,
      setSlo: vi.fn(),
      windowDays: 30,
      setWindowDays: vi.fn(),
      totalEvents: 1000000,
      formattedTotalEvents: '1,000,000',
      handleTotalEventsChange: vi.fn(),
      collectionFreq: '1m',
      setCollectionFreq: vi.fn(),
      ebRatio: 0.001,
      allowedFailures: 1000,
      chartData: [],
    });
    // Ensure AlertCard mock is cleared and ready
    vi.mocked(AlertCard).mockImplementation((props) => (
      <div data-testid={`mock-alert-card-${props.alert.id}`}>
        Mock AlertCard for {props.alert.label}
      </div>
    ));
  });

  it('should render the title and reference link', () => {
    render(<AlertsConfiguration />);
    expect(
      screen.getByText('Multi-Burn Rate Alert Configuration')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Reference: SRE Workbook/i })
    ).toHaveAttribute('href', 'https://sre.google/workbook/alerting-on-slos/');
  });

  it('should render an AlertCard for each alert in the context', () => {
    render(<AlertsConfiguration />);
    expect(AlertCard).toHaveBeenCalledTimes(mockAlerts.length);

    // Verify props passed to the first AlertCard
    expect(AlertCard).toHaveBeenCalledWith(
      expect.objectContaining({
        alert: mockAlerts[0],
        result: mockAlertResults.p1,
        updateAlert: mockUpdateAlert,
        windowDays: 30, // Verify windowDays is passed
      }),
      undefined // Expect undefined for the second argument (context)
    );

    // Verify props passed to the second AlertCard
    expect(AlertCard).toHaveBeenCalledWith(
      expect.objectContaining({
        alert: mockAlerts[1],
        result: mockAlertResults.t1,
        updateAlert: mockUpdateAlert,
        windowDays: 30, // Verify windowDays is passed
      }),
      undefined // Expect undefined for the second argument (context)
    );
  });
});
