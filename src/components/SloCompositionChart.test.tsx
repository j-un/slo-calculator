import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SloCompositionChart from './SloCompositionChart';
import { useSloContext } from '../contexts/SloProvider';

// Mock useSloContext
vi.mock('../contexts/SloProvider', async () => {
  const actual = await vi.importActual('../contexts/SloProvider');
  return {
    ...actual,
    useSloContext: vi.fn(),
  };
});

// Mock recharts
vi.mock('recharts', () => ({
  PieChart: vi.fn(() => null),
  Pie: vi.fn(() => null),
  Cell: vi.fn(() => null),
  ResponsiveContainer: vi.fn(() => null),
  Tooltip: vi.fn(() => null),
  Legend: vi.fn(() => null),
}));

// Import the mocked components to assert against them
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

describe('SloCompositionChart', () => {
  const mockChartData = [
    { name: 'Good Events (SLO)', value: 99.9, color: '#4ade80' },
    { name: 'Error Budget', value: 0.1, color: '#f87171' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useSloContext as ReturnType<typeof vi.fn>).mockReturnValue({
      chartData: mockChartData,
    });
    // Reset the mocked recharts components
    vi.mocked(PieChart).mockImplementation(({ children }) => <>{children}</>);
    vi.mocked(Pie).mockImplementation(({ children }) => <>{children}</>);
    vi.mocked(Cell).mockImplementation(() => null);
    vi.mocked(ResponsiveContainer).mockImplementation(({ children }) => (
      <>{children}</>
    ));
    vi.mocked(Tooltip).mockImplementation(() => null);
    vi.mocked(Legend).mockImplementation(() => null);
  });

  it('should render the chart with data from context', () => {
    render(<SloCompositionChart />);

    expect(screen.getByText('Composition')).toBeInTheDocument();

    // Assert that the mocked recharts components are called with the correct data
    expect(ResponsiveContainer).toHaveBeenCalledTimes(1);
    expect(PieChart).toHaveBeenCalledTimes(1);
    expect(Pie).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Pie).mock.calls[0][0].data).toEqual(mockChartData);
    expect(Legend).toHaveBeenCalledTimes(1);
    expect(Tooltip).toHaveBeenCalledTimes(1);

    // Optionally, check if cells are rendered (less critical, as Pie handles data)
    expect(Cell).toHaveBeenCalledTimes(mockChartData.length);
  });
});
