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
    // console.log(quote.regularMarketPrice, quote.symbol)
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
  // console.log(url)
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
      validateStatus: () => true,
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

    const latestEarnings = $('div.YMlKec.fxKbKc').first().text().trim() || '-';
    const peRatio = getMetric('P/E ratio');

    return {
      peRatio: peRatio || '-',
      latestEarnings: latestEarnings || '-',
    };
  } catch (err) {
    console.warn(`⚠️ Google fetch failed for ${baseSymbol}:${suffix}: ${err.message}`);
    return {
      peRatio: '-',
      latestEarnings: '-',
    };
  }
}


//fetchGoogleFundamentals("hdfcbank","nse")
export const updatePortfolioData = async () => {
  for (const [sector, items] of Object.entries(portfolioData.portfolio)) {
    if (items.length > 1) {
      const totals = {};
      Object.keys(items[1]).forEach(key => {
        if (typeof items[1][key] === 'number') {
          totals[key] = 0;
        }
      });

      // 👇 Create item update promises
      const itemPromises = items.slice(1).map(async (item) => {
        try {
          if (item.purchasePrice && item.quantity) {
            item.investment = item.purchasePrice * item.quantity;
          }

          const yahooData = await fetchCMPFromYahoo(item.particulars);
          item.cmp = yahooData?.cmp ?? item.cmp;
          item.presentValue = item.cmp * item.quantity;
          item.gainLoss = item.presentValue - item.investment;

          if (yahooData?.exchange) {
            const googleData = await fetchGoogleFundamentals(item.nseBse, yahooData.exchange);
            item.peRatio = googleData?.peRatio ?? '-';
            item.latestEarnings = googleData?.latestEarnings ?? '-';
          } else {
            item.peRatio = '-';
            item.latestEarnings = '-';
          }

          return item;
        } catch (err) {
          console.error(`❌ Error updating ${item.particulars}:`, err.message);
          // Still return item with fallback values
          item.peRatio = '-';
          item.latestEarnings = '-';
          return item;
        }
      });

      // ✅ Execute all updates in parallel
      const results = await Promise.allSettled(itemPromises);

      // ✅ Filter out the successful values or fallback to empty item
      const updatedItems = results.map(result =>
        result.status === 'fulfilled' ? result.value : {}
      );

      // ✅ Sum all numeric fields
      updatedItems.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
           if (key === 'investment' || key === 'portfolioPercent' || key === 'presentValue' || key === 'gainLoss') {
            // console.log(key, value)  
            if(value !== ''){
                totals[key] += value;
            }
          }else 
              totals[key] = ''
        });
      });
      // ✅ Assign totals to first item in sector
      Object.assign(items[0], totals);
    }
  }

  // ✅ Save updated portfolio
  fs.writeFileSync('./portfolio_data.json', JSON.stringify(portfolioData, null, 2));
};
