import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { portfolioAPI } from '../services/api';
import { AllocationData, Holding, PerformanceData, PortfolioSummary } from '../types/portfolio';
import AllocationCharts from './AllocationCharts';
import HoldingsTable from './HoldingsTable';
import LoadingSpinner from './LoadingSpinner';
import OverviewCards from './OverviewCards';
import PerformanceChart from './PerformanceChart';
import TopPerformers from './TopPerformers';

const PortfolioDashboard: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [allocation, setAllocation] = useState<AllocationData | null>(null);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [holdingsData, allocationData, performanceData, summaryData] = await Promise.all([
          portfolioAPI.getHoldings(),
          portfolioAPI.getAllocation(),
          portfolioAPI.getPerformance(),
          portfolioAPI.getSummary(),
        ]);

        setHoldings(holdingsData);
        setAllocation(allocationData);
        setPerformance(performanceData);
        setSummary(summaryData);
      } catch (err) {
        setError('Failed to load portfolio data. Please try again.');
        console.error('Error fetching portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md"
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-red-800 font-semibold text-xl mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Investment Portfolio
            <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Dashboard
            </span>
          </h1>
          <p className="text-slate-300 text-lg">
            Track your investments with real-time analytics and insights
          </p>
        </motion.div>

        {/* Overview Cards */}
        {summary && <OverviewCards summary={summary} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Holdings Table */}
          <div className="xl:col-span-2">
            <HoldingsTable holdings={holdings} />
          </div>

          {/* Top Performers */}
          <div>
            {summary && <TopPerformers summary={summary} />}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Allocation Charts */}
          <div>
            {allocation && <AllocationCharts allocation={allocation} />}
          </div>

          {/* Performance Chart */}
          <div>
            {performance && <PerformanceChart performance={performance} />}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>Made with ❤️ by Dinesh</p>
          <p className="mt-2">Data is for demonstration purposes only.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;