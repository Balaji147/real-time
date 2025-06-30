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
    console.log(quote.regularMarketPrice)
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
      $('div').each((_, div) => {
        const divEl = $(div);
        const span = divEl.find('span').first();
        if (!span.length) return;

        const labelDiv = span.find('div').first();
        if (labelDiv.text().trim() === label) {
          const directDivs = divEl.children('div').not(span);
          const valueDiv = directDivs.last();
          if (valueDiv.length) {
            value = valueDiv.text().trim();
          }
        }
      });
      return value;
    };

    const peRatio = getMetric('P/E ratio');
    const earnings = getMetric('Earnings per share');
    return { peRatio, earnings };
  } catch (err) {
    console.warn(`⚠️ Google fetch failed for ${baseSymbol}:${suffix}: ${err.message}`);
    return { peRatio: '-', earnings: '-' };
  }
}

export const updatePortfolioData = async () => {
  Object.entries(portfolioData.portfolio).forEach(([sector, items]) => {
    if (items.length > 1) {
      const totals = {};

      // Initialize totals object with numeric keys
      Object.keys(items[1]).forEach(key => {
        if (typeof items[1][key] === 'number') {
          totals[key] = 0;
        }
      });

      // Sum up numeric fields
      items.slice(1).forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === 'number') {
            totals[key] += value;
          }
        });
      });

      // Assign totals to the first entry
      Object.assign(items[0], totals);
    }
  }); 

  

  fs.writeFileSync('./portfolio_data.json', JSON.stringify(portfolioData, null, 2));
};
