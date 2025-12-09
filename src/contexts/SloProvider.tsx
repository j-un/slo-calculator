import { createContext, useContext, useMemo } from 'react';
import { useSloCore } from '../hooks/useSloCore';
import { useAlerts } from '../hooks/useAlerts';
import type { ExtendedAlertResult } from '../hooks/useAlerts';
import type { AlertConfig } from '../utils/calculations';

// Define the shape of the context data
interface SloContextType {
  // from useSloCore
  sliDescription: string;
  setSliDescription: (value: string) => void;
  slo: number;
  setSlo: (value: number) => void;
  windowDays: number;
  setWindowDays: (value: number) => void;
  totalEvents: number;
  formattedTotalEvents: string;
  handleTotalEventsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  collectionFreq: string;
  setCollectionFreq: (value: string) => void;
  ebRatio: number;
  allowedFailures: number;
  chartData: { name: string; value: number; color: string }[];

  // from useAlerts
  alerts: AlertConfig[];
  updateAlert: (id: string, field: keyof AlertConfig, value: any) => void;
  alertResults: Record<string, ExtendedAlertResult>;
}

// Create the context with a placeholder default value
const SloContext = createContext<SloContextType | undefined>(undefined);

// Create the provider component
export const SloProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    sliDescription,
    setSliDescription,
    slo,
    setSlo,
    windowDays,
    setWindowDays,
    totalEvents,
    formattedTotalEvents,
    handleTotalEventsChange,
    collectionFreq,
    setCollectionFreq,
    ebRatio,
    allowedFailures,
  } = useSloCore();

  const { alerts, updateAlert, alertResults } = useAlerts({
    slo,
    windowDays,
    totalEvents,
  });

  const chartData = useMemo(
    () => [
      { name: 'Good Events (SLO)', value: slo, color: '#4ade80' },
      { name: 'Error Budget', value: 100 - slo, color: '#f87171' },
    ],
    [slo]
  );

  const value = {
    sliDescription,
    setSliDescription,
    slo,
    setSlo,
    windowDays,
    setWindowDays,
    totalEvents,
    formattedTotalEvents,
    handleTotalEventsChange,
    collectionFreq,
    setCollectionFreq,
    ebRatio,
    allowedFailures,
    chartData,
    alerts,
    updateAlert,
    alertResults,
  };

  return <SloContext.Provider value={value}>{children}</SloContext.Provider>;
};

// Create a custom hook for consuming the context
export const useSloContext = () => {
  const context = useContext(SloContext);
  if (context === undefined) {
    throw new Error('useSloContext must be used within a SloProvider');
  }
  return context;
};
