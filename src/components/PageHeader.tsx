import { Activity } from 'lucide-react';

const PageHeader = () => {
  return (
    <header className="space-y-2 border-b pb-6 text-center">
      <h1 className="flex items-center justify-center text-3xl font-bold text-indigo-700">
        <Activity className="mr-3 h-8 w-8" />
        SLO / Error Budget Calculator
      </h1>
      <p className="text-gray-600">
        Design your SLOs and generate Multi-Burn Rate Alerting policies.
      </p>
    </header>
  );
};

export default PageHeader;
