import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SloInputForm from './SloInputForm';
import { useSloContext } from '../contexts/SloProvider';

// Mock useSloContext to control its values and spy on its functions
vi.mock('../contexts/SloProvider', async () => {
  const actual = await vi.importActual('../contexts/SloProvider');
  return {
    ...actual,
    useSloContext: vi.fn(),
  };
});

describe('SloInputForm', () => {
  const mockContextValues = {
    sliDescription: 'Mock SLI',
    setSliDescription: vi.fn(),
    slo: 99.9,
    setSlo: vi.fn(),
    windowDays: 30,
    setWindowDays: vi.fn(),
    formattedTotalEvents: '1,000,000',
    handleTotalEventsChange: vi.fn(),
    collectionFreq: '1m',
    setCollectionFreq: vi.fn(),
    ebRatio: 0.001, // not used by form directly but part of context
    allowedFailures: 1000, // not used by form directly but part of context
    chartData: [], // not used by form directly but part of context
    alerts: [], // not used by form directly but part of context
    updateAlert: vi.fn(), // not used by form directly but part of context
    alertResults: {}, // not used by form directly but part of context
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useSloContext as ReturnType<typeof vi.fn>).mockReturnValue(
      mockContextValues
    );
  });

  it('should render form elements with initial context values', () => {
    render(<SloInputForm />);

    expect(screen.getByLabelText(/SLI Description/i)).toHaveValue(
      mockContextValues.sliDescription
    );
    expect(screen.getByLabelText(/SLO Target \(\%\)/i)).toHaveValue(
      mockContextValues.slo
    );
    expect(screen.getByLabelText(/Aggregation Window \(Days\)/i)).toHaveValue(
      mockContextValues.windowDays
    );
    expect(screen.getByLabelText(/Estimated Total Events/i)).toHaveValue(
      mockContextValues.formattedTotalEvents
    );
    expect(screen.getByRole('button', { name: '1m' })).toHaveClass(
      'bg-indigo-100'
    );
  });

  it('should call setSliDescription when SLI Description changes', () => {
    render(<SloInputForm />);
    const textarea = screen.getByLabelText(/SLI Description/i);
    fireEvent.change(textarea, { target: { value: 'New Description' } });
    expect(mockContextValues.setSliDescription).toHaveBeenCalledWith(
      'New Description'
    );
  });

  it('should call setSlo when SLO Target changes', () => {
    render(<SloInputForm />);
    const input = screen.getByLabelText(/SLO Target \(\%\)/i);
    fireEvent.change(input, { target: { value: '99.5' } });
    expect(mockContextValues.setSlo).toHaveBeenCalledWith(99.5);
  });

  it('should call setSlo with 99.9 when 99.9% button is clicked', () => {
    render(<SloInputForm />);
    const button = screen.getByRole('button', { name: '99.9%' });
    fireEvent.click(button);
    expect(mockContextValues.setSlo).toHaveBeenCalledWith(99.9);
  });

  it('should call setWindowDays when Aggregation Window changes', () => {
    render(<SloInputForm />);
    const input = screen.getByLabelText(/Aggregation Window \(Days\)/i);
    fireEvent.change(input, { target: { value: '7' } });
    expect(mockContextValues.setWindowDays).toHaveBeenCalledWith(7);
  });

  it('should call setWindowDays with 7 when 7d button is clicked', () => {
    render(<SloInputForm />);
    const button = screen.getByRole('button', { name: '7d' });
    fireEvent.click(button);
    expect(mockContextValues.setWindowDays).toHaveBeenCalledWith(7);
  });

  it('should call handleTotalEventsChange when Estimated Total Events changes', () => {
    render(<SloInputForm />);
    const input = screen.getByLabelText(/Estimated Total Events/i);
    fireEvent.change(input, { target: { value: '2,000,000' } });
    expect(mockContextValues.handleTotalEventsChange).toHaveBeenCalled(); // Specific value handled by mock
  });

  it('should call setCollectionFreq when Metric Collection Frequency button is clicked', () => {
    render(<SloInputForm />);
    const button = screen.getByRole('button', { name: '5m' });
    fireEvent.click(button);
    expect(mockContextValues.setCollectionFreq).toHaveBeenCalledWith('5m');
  });
});
