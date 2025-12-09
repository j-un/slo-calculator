import { useState, useEffect } from 'react';
import {
  calculateErrorBudgetRatio,
  calculateAllowedFailureCount,
  formatNumber,
} from '../utils/calculations';

export const useSloCore = () => {
  const [sliDescription, setSliDescription] = useState<string>('');
  const [slo, setSlo] = useState<number>(99.9);
  const [windowDays, setWindowDays] = useState<number>(30);
  const [totalEvents, setTotalEvents] = useState<number>(1000000);
  const [formattedTotalEvents, setFormattedTotalEvents] = useState<string>(
    formatNumber(1000000, 0)
  );
  const [collectionFreq, setCollectionFreq] = useState<string>('1m');

  const [ebRatio, setEbRatio] = useState<number>(0);
  const [allowedFailures, setAllowedFailures] = useState<number>(0);

  useEffect(() => {
    setFormattedTotalEvents(formatNumber(totalEvents, 0));
  }, [totalEvents]);

  useEffect(() => {
    setEbRatio(calculateErrorBudgetRatio(slo));
    setAllowedFailures(calculateAllowedFailureCount(totalEvents, slo));
  }, [slo, totalEvents]);

  const handleTotalEventsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      setTotalEvents(numValue);
    } else if (rawValue === '') {
      setTotalEvents(0);
    }
  };

  return {
    sliDescription,
    setSliDescription,
    slo,
    setSlo,
    windowDays,
    setWindowDays,
    totalEvents,
    setTotalEvents,
    formattedTotalEvents,
    handleTotalEventsChange,
    collectionFreq,
    setCollectionFreq,
    ebRatio,
    allowedFailures,
  };
};
