import React, { useState } from 'react';
import './App.css';
import PortfolioTable from './components/portfolioTable';
import { usePortfolioData } from './hooks/usePortfolioData';
import LoadingSpinner from './components/loader.component';
import ErrorMessage from './components/errorScreen.component';
import DisclaimerPopup from './components/dataDisclaimer.component';

function App() {
  const { portfolio, loading } = usePortfolioData();
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (loading) return <LoadingSpinner />;

  if (!portfolio || portfolio.length === 0) {
    return (
      <ErrorMessage
        title="No Portfolio Data Available"
        message="Please try again later or contact support."
      />
    );
  }

  if (showDisclaimer) {
    return <DisclaimerPopup onClose={() => setShowDisclaimer(false)} />;
  }

  return (
    <div className="App">
      <PortfolioTable data={portfolio} />
    </div>
  );
}

export default App;
