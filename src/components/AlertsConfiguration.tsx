import { AlertTriangle, Info } from 'lucide-react';
import AlertCard from './AlertCard';
import { useSloContext } from '../contexts/SloProvider';

const AlertsConfiguration = () => {
  const { alerts, alertResults, updateAlert, windowDays } = useSloContext();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-lg font-semibold text-gray-800">
          <AlertTriangle className="mr-2 h-5 w-5 text-indigo-500" />
          Multi-Burn Rate Alert Configuration
        </h2>
        <a
          href="https://sre.google/workbook/alerting-on-slos/"
          target="_blank"
          className="flex items-center text-xs text-indigo-600 hover:underline"
        >
          <Info className="mr-1 h-3 w-3" />
          Reference: SRE Workbook
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {alerts.map((alert) => {
          const result = alertResults[alert.id];
          if (!result) return null;

          return (
            <AlertCard
              key={alert.id}
              alert={alert}
              result={result}
              updateAlert={updateAlert}
              windowDays={windowDays}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AlertsConfiguration;
