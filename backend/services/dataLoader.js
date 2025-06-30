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
      $(`div:contains(${label})`).each((_, el) => {
        const container = $(el).closest('div.gyFHrc');
        if (container.length) {
          const val = container.find('div.P6K39c').text().trim();
          if (val) value = val;
        }
      });
      return value;
    };

    // New: Get latest earnings from div with YMlKec fxKbKc class
    const latestEarningsRaw = $('div.YMlKec.fxKbKc').first().text().trim();
    const latestEarnings = latestEarningsRaw || '-';
    const peRatio = getMetric('P/E ratio');

    return { peRatio, latestEarnings };
  } catch (err) {
    console.warn(`⚠️ Google fetch failed for ${baseSymbol}:${suffix}: ${err.message}`);
    return { peRatio: '-', earnings: '-', latestEarnings: '-' };
  }
}


//fetchGoogleFundamentals("hdfcbank","nse")
export const updatePortfolioData = async () => {
  for (const [sector, items] of Object.entries(portfolioData.portfolio)) {
    if (items.length > 1) {
      const totals = {};
      
      // Initialize totals object with numeric keys
      Object.keys(items[1]).forEach(key => {
        if (typeof items[1][key] === 'number') {
          totals[key] = 0;
        }
      });

      // Calculate totals, investment, presentValue, gainLoss
      for (const item of items.slice(1)) {
        // Calculate investment = price * qty
        if (item.purchasePrice && item.quantity) {
          item.investment = item.purchasePrice * item.quantity;
        }

        // Calculate presentValue = cmp * qty
        if (item.cmp && item.quantity) {
          item.presentValue = item.cmp * item.quantity;
        }

        // Calculate gainLoss = presentValue - investment
        if (item.presentValue != null && item.investment != null) {
          item.gainLoss = item.presentValue - item.investment;
        }

        // Sum numeric fields
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === 'number') {
            totals[key] += value;
          }
        });

        // Fetch Yahoo data
        try {
          const yahooData = await fetchCMPFromYahoo(item.particulars);
          item.cmp = yahooData?.cmp
          if (yahooData?.exchange) {
            // Fetch Google data using name and exchange
            const googleData = await fetchGoogleFundamentals(item.nseBse, yahooData.exchange);
            // Update item with fetched values
            item.peRatio = googleData?.peRatio || item.peRatio;

            item.latestEarnings = googleData?.latestEarnings || item.latestEarnings;
          }
        } catch (err) {
          console.error(`Failed to fetch data for ${item.particulars}:`, err);
        }
      }

      // Assign totals to the first entry
      Object.assign(items[0], totals);
    }
  }

  fs.writeFileSync('./portfolio_data.json', JSON.stringify(portfolioData, null, 2));
};

updatePortfolioData()