import { useEffect, useState } from 'react';
import { fetchPortfolioData } from '../services/api';

export const usePortfolioData = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const data = await fetchPortfolioData();
    
    const allStocks = Object.values(data).flat();
    setPortfolio(allStocks);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return { portfolio, loading };
};
