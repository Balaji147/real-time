import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import yahooFinance from 'yahoo-finance2';

let portfolioData = JSON.parse(fs.readFileSync('./portfolio_data.json', 'utf-8'));

async function fetchCMPFromYahoo(companyName) {
  try {
    const searchRes = await yahooFinance.search(companyName);
    const quoteMeta = searchRes.quotes?.find(q => ['NSI', 'BSE'].includes(q.exchange)) || searchRes.quotes?.[0];
    if (!quoteMeta) return null;

    const quote = await yahooFinance.quote(quoteMeta.symbol);
    return {
      cmp: quote.regularMarketPrice,
      exchange: quoteMeta.exchange,
      symbol: quoteMeta.symbol
    };
  } catch (err) {
    console.warn(`⚠️ Failed to fetch Yahoo CMP for ${companyName}: ${err.message}`);
    return null;
  }
}

async function fetchGoogleFundamentals(baseSymbol, exchange) {
  const suffix = (/^\d+$/.test(baseSymbol) || exchange === 'BSE') ? 'BOM' : 'NSE';
  const url = `https://www.google.com/finance/quote/${baseSymbol}:${suffix}`;

  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);

const getMetric = (label) => {
  let value = '-';

document.querySelectorAll('div').forEach(div => {
  // Check if this div contains a span with a div whose text is 'P/E ratio'
  const span = div.querySelector('span');
  if (!span) return;

  const labelDiv = span.querySelector('div');
  console.log(labelDiv)
  if (labelDiv && labelDiv.textContent.trim() === 'P/E ratio') {
    // Now get the value div (any direct div child of container not inside span)
    const directDivs = Array.from(div.children).filter(child => child.tagName === 'DIV' && !child.closest('span'));
    // The value div is the last div child of the container excluding the span
    const valueDiv = directDivs[directDivs.length - 1];
    if (valueDiv) value = valueDiv.textContent.trim();
  }
});
    console.log("value",value)
  return value;
};
    const peRatio = getMetric('P/E ratio');
    const earnings = getMetric('Earnings per share');
    console.log(peRatio)
    return { peRatio, earnings };
  } catch (err) {
    console.warn(`⚠️ Google fetch failed for ${baseSymbol}:${suffix}: ${err.message}`);
    return { peRatio: '-', earnings: '-' };
  }
}

export async function updatePortfolioData() {
  for (const sector in portfolioData) {
    for (const stock of portfolioData[sector]) {
      const cmpData = await fetchCMPFromYahoo(stock.particulars);
      if (!cmpData) continue;

      const baseSymbol = cmpData.symbol.replace('.NS', '').replace('.BO', '');
      const { peRatio, earnings } = await fetchGoogleFundamentals(baseSymbol, cmpData.exchange);

      stock.cmp = cmpData.cmp;
      stock.peRatio = peRatio;
      stock.latestEarnings = earnings;
      stock.presentValue = cmpData.cmp * stock.quantity;
      stock.gainLoss = stock.presentValue - stock.investment;
    }
  }

  fs.writeFileSync('./portfolio_data.json', JSON.stringify(portfolioData, null, 2));
  console.log('✅ Portfolio updated successfully');
}

export const getPortfolioData = () => portfolioData;