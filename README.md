# slo-calculator

This project is an SLO (Service Level Objective) and Error Budget Calculator web application. It is designed to help Site Reliability Engineers (SREs) and developers define their SLOs, visualize error budgets, and generate multi-burn rate alerting policies based on the book "The Site Reliability Workbook".

## Features

- **SLO Definition**: Define your SLI description, SLO target (%), and aggregation window (days).
- **Error Budget Calculation**: Automatically calculates the error budget ratio and allowed failure count based on total events.
- **Visualizations**:
  - **Composition Chart**: Visualizes the proportion of good events vs. the error budget.
  - **Overview**: Displays key metrics like Allowed Error Ratio and Allowed Error Events.
- **Alerting Configuration**: Generates multi-burn rate alerting policies (Page and Ticket alerts) with customizable parameters.
- **Interactive Inputs**: Real-time updates as you modify SLO targets, window sizes, and event counts.

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/j-un/slo-calculator.git
   cd slo-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view the application.

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Testing

To run the unit tests:

```bash
npm run test
```

To run tests with coverage:

```bash
npm run coverage
```

### Linting and Formatting

To lint the codebase:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```
