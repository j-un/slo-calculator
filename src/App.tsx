import PageHeader from './components/PageHeader';
import SloCompositionChart from './components/SloCompositionChart';
import ErrorBudgetOverview from './components/ErrorBudgetOverview';
import SloInputForm from './components/SloInputForm';
import AlertsConfiguration from './components/AlertsConfiguration';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: INPUTS */}
          <div className="space-y-6 lg:col-span-4">
            <SloInputForm />
            <SloCompositionChart />
          </div>

          {/* RIGHT COLUMN: OUTPUTS & ALERTS */}
          <div className="space-y-6 lg:col-span-8">
            <ErrorBudgetOverview />
            <AlertsConfiguration />
          </div>
        </div>
        <footer className="mt-8 text-center text-sm text-gray-400 underline">
          <a
            href="https://github.com/j-un/slo-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600"
          >
            GitHub
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
