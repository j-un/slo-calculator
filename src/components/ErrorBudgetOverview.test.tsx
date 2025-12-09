import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorBudgetOverview from './ErrorBudgetOverview';
import { useSloContext } from '../contexts/SloProvider';
import { formatNumber, formatPercentage } from '../utils/calculations'; // Import actual formatters

// Mock useSloContext
vi.mock('../contexts/SloProvider', async () => {
  const actual = await vi.importActual('../contexts/SloProvider');
  return {
    ...actual,
    useSloContext: vi.fn(),
  };
});

describe('ErrorBudgetOverview', () => {
  const mockContextValues = {
    ebRatio: 0.001,
    allowedFailures: 1000,
    windowDays: 30,
    // Other context values not directly used by this component
    sliDescription: '',
    setSliDescription: vi.fn(),
    slo: 99.9,
    setSlo: vi.fn(),
    totalEvents: 1000000,
    formattedTotalEvents: '1,000,000',
    handleTotalEventsChange: vi.fn(),
    collectionFreq: '1m',
    setCollectionFreq: vi.fn(),
    chartData: [],
    alerts: [],
    updateAlert: vi.fn(),
    alertResults: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSloContext as ReturnType<typeof vi.fn>).mockReturnValue(
      mockContextValues
    );
  });

  it('should render overview with correct data from context', () => {
    render(<ErrorBudgetOverview />);

    expect(screen.getByText('Error Budget Overview')).toBeInTheDocument();

    // Check Allowed Error Ratio
    expect(screen.getByText('Allowed Error Ratio')).toBeInTheDocument();
    expect(
      screen.getByText(formatPercentage(mockContextValues.ebRatio, 4))
    ).toBeInTheDocument();

    // Check Allowed Error Events
    expect(screen.getByText('Allowed Error Events')).toBeInTheDocument();
    expect(
      screen.getByText(formatNumber(mockContextValues.allowedFailures, 0))
    ).toBeInTheDocument();
    expect(
      screen.getByText(`per ${mockContextValues.windowDays} days`)
    ).toBeInTheDocument();
  });
});
