type Holding = {
  sector: string;
  particulars: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  nseBse: string | number;
  cmp?: number;
  presentValue?: number;
  gainLoss?: number;
  peRatio?: number;
  latestEarnings?: string;
  allStocks?:any
};

export default Holding