import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is running');
});

// Sample Indian stock data
const portfolioData = {
  holdings: [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      quantity: 50,
      avgPrice: 2450.00,
      currentPrice: 2680.50,
      sector: "Energy",
      marketCap: "Large",
      value: 134025.00,
      gainLoss: 11525.00,
      gainLossPercent: 9.4
    },
    {
      symbol: "INFY",
      name: "Infosys Limited",
      quantity: 100,
      avgPrice: 1800.00,
      currentPrice: 2010.75,
      sector: "Technology",
      marketCap: "Large",
      value: 201075.00,
      gainLoss: 21075.00,
      gainLossPercent: 11.7
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      quantity: 75,
      avgPrice: 3200.00,
      currentPrice: 3890.25,
      sector: "Technology",
      marketCap: "Large",
      value: 291768.75,
      gainLoss: 51768.75,
      gainLossPercent: 21.6
    },
    {
      symbol: "HDFC",
      name: "HDFC Bank",
      quantity: 60,
      avgPrice: 1650.00,
      currentPrice: 1615.80,
      sector: "Banking",
      marketCap: "Large",
      value: 96948.00,
      gainLoss: -2052.00,
      gainLossPercent: -2.1
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Ltd",
      quantity: 80,
      avgPrice: 1100.00,
      currentPrice: 1245.30,
      sector: "Banking",
      marketCap: "Large",
      value: 99624.00,
      gainLoss: 11624.00,
      gainLossPercent: 13.2
    },
    {
      symbol: "HCLTECH",
      name: "HCL Technologies",
      quantity: 90,
      avgPrice: 1350.00,
      currentPrice: 1520.40,
      sector: "Technology",
      marketCap: "Large",
      value: 136836.00,
      gainLoss: 15336.00,
      gainLossPercent: 12.6
    },
    {
      symbol: "WIPRO",
      name: "Wipro Limited",
      quantity: 120,
      avgPrice: 450.00,
      currentPrice: 485.75,
      sector: "Technology",
      marketCap: "Large",
      value: 58290.00,
      gainLoss: 4290.00,
      gainLossPercent: 7.9
    },
    {
      symbol: "SBIN",
      name: "State Bank of India",
      quantity: 200,
      avgPrice: 550.00,
      currentPrice: 612.35,
      sector: "Banking",
      marketCap: "Large",
      value: 122470.00,
      gainLoss: 12470.00,
      gainLossPercent: 11.3
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Ltd",
      quantity: 150,
      avgPrice: 900.00,
      currentPrice: 1058.60,
      sector: "Telecom",
      marketCap: "Large",
      value: 158790.00,
      gainLoss: 23790.00,
      gainLossPercent: 17.7
    },
    {
      symbol: "DRREDDY",
      name: "Dr Reddy's Laboratories",
      quantity: 40,
      avgPrice: 5200.00,
      currentPrice: 6150.25,
      sector: "Healthcare",
      marketCap: "Large",
      value: 246010.00,
      gainLoss: 38010.00,
      gainLossPercent: 18.3
    }
  ]
};

// Calculate portfolio metrics
const calculatePortfolioMetrics = () => {
  const totalValue = portfolioData.holdings.reduce((sum, holding) => sum + holding.value, 0);
  const totalInvested = portfolioData.holdings.reduce((sum, holding) => sum + (holding.quantity * holding.avgPrice), 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = (totalGainLoss / totalInvested) * 100;

  const topPerformer = portfolioData.holdings.reduce((best, current) => 
    current.gainLossPercent > best.gainLossPercent ? current : best
  );

  const worstPerformer = portfolioData.holdings.reduce((worst, current) => 
    current.gainLossPercent < worst.gainLossPercent ? current : worst
  );

  return {
    totalValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercent,
    topPerformer,
    worstPerformer
  };
};

// API Routes

// 1. Portfolio Holdings Endpoint
app.get('/api/portfolio/holdings', (_req, res) => {
  try {
    res.json(portfolioData.holdings);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio holdings' });
  }
});

// 2. Portfolio Allocation Endpoint
app.get('/api/portfolio/allocation', (_req, res) => {
  try {
    const sectorTotals: { [key: string]: number } = {};
    const marketCapTotals: { [key: string]: number } = {};
    
    let totalValue = 0;
    
    portfolioData.holdings.forEach(holding => {
      totalValue += holding.value;
      sectorTotals[holding.sector] = (sectorTotals[holding.sector] || 0) + holding.value;
      marketCapTotals[holding.marketCap] = (marketCapTotals[holding.marketCap] || 0) + holding.value;
    });

    const bySector: { [key: string]: { value: number; percentage: number } } = {};
    const byMarketCap: { [key: string]: { value: number; percentage: number } } = {};

    Object.entries(sectorTotals).forEach(([sector, value]) => {
      bySector[sector] = {
        value: Math.round(value),
        percentage: Math.round((value / totalValue) * 100 * 10) / 10
      };
    });

    Object.entries(marketCapTotals).forEach(([cap, value]) => {
      byMarketCap[cap] = {
        value: Math.round(value),
        percentage: Math.round((value / totalValue) * 100 * 10) / 10
      };
    });

    res.json({ bySector, byMarketCap });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio allocation' });
  }
});

// 3. Performance Comparison Endpoint
app.get('/api/portfolio/performance', (_req, res) => {
  try {
    const timeline = [
      {
        date: "2024-01-01",
        portfolio: 650000,
        nifty50: 21000,
        gold: 62000
      },
      {
        date: "2024-02-01",
        portfolio: 672000,
        nifty50: 21450,
        gold: 63200
      },
      {
        date: "2024-03-01",
        portfolio: 680000,
        nifty50: 22100,
        gold: 64500
      },
      {
        date: "2024-04-01",
        portfolio: 695000,
        nifty50: 22800,
        gold: 66200
      },
      {
        date: "2024-05-01",
        portfolio: 715000,
        nifty50: 23200,
        gold: 67800
      },
      {
        date: "2024-06-01",
        portfolio: 700000,
        nifty50: 23500,
        gold: 68000
      }
    ];

    const returns = {
      portfolio: { "1month": 2.3, "3months": 8.1, "1year": 15.7 },
      nifty50: { "1month": 1.8, "3months": 6.2, "1year": 12.4 },
      gold: { "1month": -0.5, "3months": 4.1, "1year": 8.9 }
    };

    res.json({ timeline, returns });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
});

// 4. Portfolio Summary Endpoint
app.get('/api/portfolio/summary', (_req, res) => {
  try {
    const metrics = calculatePortfolioMetrics();
    
    const summary = {
      totalValue: Math.round(metrics.totalValue),
      totalInvested: Math.round(metrics.totalInvested),
      totalGainLoss: Math.round(metrics.totalGainLoss),
      totalGainLossPercent: Math.round(metrics.totalGainLossPercent * 100) / 100,
      topPerformer: {
        symbol: metrics.topPerformer.symbol,
        name: metrics.topPerformer.name,
        gainPercent: metrics.topPerformer.gainLossPercent
      },
      worstPerformer: {
        symbol: metrics.worstPerformer.symbol,
        name: metrics.worstPerformer.name,
        gainPercent: metrics.worstPerformer.gainLossPercent
      },
      diversificationScore: 8.2,
      riskLevel: "Moderate"
    };

    res.json(summary);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const handler = serverless(app);