import { Settings } from 'lucide-react';
import { useSloContext } from '../contexts/SloProvider';

const SloInputForm = () => {
  const {
    sliDescription,
    setSliDescription,
    slo,
    setSlo,
    windowDays,
    setWindowDays,
    formattedTotalEvents,
    handleTotalEventsChange,
    collectionFreq,
    setCollectionFreq,
  } = useSloContext();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
        <Settings className="mr-2 h-5 w-5 text-indigo-500" />
        SLI / SLO Definition
      </h2>

      <div className="space-y-4">
        {/* SLI Description */}
        <div>
          <label
            htmlFor="sliDescription"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            SLI Description
          </label>
          <textarea
            id="sliDescription"
            rows={2}
            value={sliDescription}
            onChange={(e) => setSliDescription(e.target.value)}
            placeholder="e.g., The proportion of successful requests, as measured from the load balancer metrics."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* SLO */}
        <div>
          <label
            htmlFor="slo"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            SLO Target (%)
          </label>
          <div className="mb-2 flex gap-2">
            {[99.99, 99.9, 99.5, 99.0].map((val) => (
              <button
                key={val}
                onClick={() => setSlo(val)}
                className={`rounded border px-2 py-1 text-xs ${slo === val ? 'border-indigo-300 bg-indigo-100 text-indigo-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
              >
                {val}%
              </button>
            ))}
          </div>
          <input
            id="slo"
            type="number"
            step="0.001"
            max="100"
            min="0"
            value={slo}
            onChange={(e) => setSlo(parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Window */}
        <div>
          <label
            htmlFor="windowDays"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Aggregation Window (Days)
          </label>
          <div className="mb-2 flex gap-2">
            {[30, 28, 7].map((val) => (
              <button
                key={val}
                onClick={() => setWindowDays(val)}
                className={`rounded border px-2 py-1 text-xs ${windowDays === val ? 'border-indigo-300 bg-indigo-100 text-indigo-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
              >
                {val}d
              </button>
            ))}
          </div>
          <input
            id="windowDays"
            type="number"
            value={windowDays}
            onChange={(e) => setWindowDays(parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Estimated Events */}
        <div>
          <label
            htmlFor="totalEvents"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Estimated Total Events
          </label>
          <input
            id="totalEvents"
            type="text"
            inputMode="numeric"
            value={formattedTotalEvents}
            onChange={handleTotalEventsChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            e.g., Number of requests for Availability SLI, number of processed
            items for Data Freshness SLI.
          </p>
        </div>

        {/* Collection Frequency */}
        <div>
          <label
            htmlFor="collectionFreq"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Metric Collection Frequency (No effect yet)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['10s', '30s', '1m', '5m'].map((val) => (
              <button
                key={val}
                onClick={() => setCollectionFreq(val)}
                className={`rounded border px-2 py-1 text-xs ${collectionFreq === val ? 'border-indigo-300 bg-indigo-100 text-indigo-700' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SloInputForm;
