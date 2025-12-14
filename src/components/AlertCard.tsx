import type { AlertConfig } from '../utils/calculations';
import {
  formatNumber,
  formatPercentage,
  calculateTimeToExhaustion,
} from '../utils/calculations';
import type { ExtendedAlertResult } from '../hooks/useAlerts';
import { useState, useEffect } from 'react';

interface AlertCardProps {
  alert: AlertConfig;
  result: ExtendedAlertResult;
  updateAlert: (id: string, field: keyof AlertConfig, value: any) => void;
  windowDays: number;
}

const AlertCard = ({
  alert,
  result,
  updateAlert,
  windowDays,
}: AlertCardProps) => {
  const { shortWindow } = result;
  const [budgetConsumedInput, setBudgetConsumedInput] = useState(
    alert.budgetConsumed.toString()
  );
  const [longWindowValueInput, setLongWindowValueInput] = useState(
    alert.longWindowValue.toString()
  );

  useEffect(() => {
    // Sync local state with prop when prop changes (e.g. from reset or other external updates)
    // Only update if the parsed value is different to avoid cursor jumping if we were to format it strictly
    if (parseFloat(budgetConsumedInput) !== alert.budgetConsumed) {
      setBudgetConsumedInput(alert.budgetConsumed.toString());
    }
    if (parseInt(longWindowValueInput) !== alert.longWindowValue) {
      setLongWindowValueInput(alert.longWindowValue.toString());
    }
  }, [alert.budgetConsumed, alert.longWindowValue]);

  const handleBudgetBlur = () => {
    updateAlert(alert.id, 'budgetConsumed', budgetConsumedInput);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudgetConsumedInput(e.target.value);
  };

  const handleLongWindowValueBlur = () => {
    updateAlert(alert.id, 'longWindowValue', longWindowValueInput);
  };

  const handleLongWindowValueChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Prevent non-numeric input for longWindowValue
    if (/^[0-9]*$/.test(e.target.value) || e.target.value === '') {
      setLongWindowValueInput(e.target.value);
    }
  };

  return (
    <div
      key={alert.id}
      className={`rounded-xl border-l-8 bg-white shadow-sm ${alert.type === 'page' ? 'border-red-400' : 'border-blue-400'} overflow-hidden`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
          <h3
            className={`text-lg font-bold ${alert.type === 'page' ? 'text-red-700' : 'text-blue-700'}`}
          >
            {alert.label}
          </h3>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${alert.type === 'page' ? 'border-red-200 bg-red-50 text-red-600' : 'border-blue-200 bg-blue-50 text-blue-600'}`}
          >
            {alert.type === 'page'
              ? alert.id === 'p2'
                ? 'Page / Mention'
                : 'Page / Call'
              : 'Ticket / Issue'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Configuration Inputs */}
          <div className="space-y-3 rounded-md bg-gray-50 p-3">
            <h4 className="mb-2 text-xs font-bold text-gray-500 uppercase">
              Parameters
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">
                  Long Window
                </label>
                <div className="flex">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-12 rounded-l-md border-gray-300 bg-indigo-50 text-sm"
                    value={longWindowValueInput}
                    onChange={handleLongWindowValueChange}
                    onBlur={handleLongWindowValueBlur}
                  />
                  <select
                    className="rounded-r-md border-gray-300 text-sm"
                    value={alert.longWindowUnit}
                    onChange={(e) =>
                      updateAlert(alert.id, 'longWindowUnit', e.target.value)
                    }
                  >
                    <option value="days">d</option>
                    <option value="hours">h</option>
                    <option value="minutes">m</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 uppercase">
                  Short Window
                </label>
                <div className="flex">
                  <div className="w-12 rounded-l-md border-gray-300 text-sm">
                    <span className="text-sm font-medium text-gray-800">
                      {shortWindow.value}
                    </span>
                  </div>
                  <div className="w-12 rounded-l-md border-gray-300 text-sm">
                    <span className="text-sm text-gray-500">
                      {shortWindow.unit[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] text-gray-500 uppercase">
                Budget Consumed (%)
              </label>
              <input
                type="text"
                inputMode="numeric"
                step="0.01"
                className="w-12 rounded-md border-gray-300 bg-indigo-50 text-sm"
                value={budgetConsumedInput}
                onChange={handleBudgetChange}
                onBlur={handleBudgetBlur}
              />
            </div>
          </div>

          {/* Calculated Impact */}
          <div className="space-y-3">
            <h4 className="mb-2 text-xs font-bold text-gray-500 uppercase">
              Projected Impact
            </h4>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Burn Rate:</span>
                <span className="font-bold">
                  {formatNumber(result.burnRate, 1)}
                </span>
              </div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">Time to Exhaustion:</span>
                <span className="font-bold text-gray-800">
                  {calculateTimeToExhaustion(windowDays, result.burnRate)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-gray-400">
                Percentage of total error budget consumed if this burn rate
                persists for {alert.longWindowValue}
                {alert.longWindowUnit[0]}.
              </p>
              <div className="relative h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${alert.budgetConsumed > 50 ? 'bg-red-500' : 'bg-indigo-500'}`}
                  style={{ width: `${Math.min(alert.budgetConsumed, 100)}%` }}
                ></div>
                {/* Scale line per 10% */}
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full w-px bg-gray-300"
                    style={{ left: `${(i + 1) * 10}%` }}
                  ></div>
                ))}
                {/* Label */}
                <div className="absolute top-2 left-0 text-[8px] text-gray-400">
                  0%
                </div>
                <div className="absolute top-2 left-1/4 -translate-x-1/2 text-[8px] text-gray-400">
                  25%
                </div>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-400">
                  50%
                </div>
                <div className="absolute top-2 left-3/4 -translate-x-1/2 text-[8px] text-gray-400">
                  75%
                </div>
                <div className="absolute top-2 right-0 text-[8px] text-gray-400">
                  100%
                </div>
              </div>
            </div>

            <div className="mt-5.5 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase">
                  Est. Trigger Errors
                </span>
                <span className="font-mono text-lg font-medium text-gray-800">
                  {formatNumber(result.triggerErrorCount, 0)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase">
                  Error Rate Threshold
                </span>
                <span className="font-mono text-lg font-medium text-gray-800">
                  {formatPercentage(result.threshold, 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
