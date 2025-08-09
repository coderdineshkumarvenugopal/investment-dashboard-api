import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PerformanceData } from '../types/portfolio';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  performance: PerformanceData;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ performance }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });
  };

  const data = {
    labels: performance.timeline.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Portfolio',
        data: performance.timeline.map(item => item.portfolio),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Nifty 50',
        data: performance.timeline.map(item => item.nifty50),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Gold',
        data: performance.timeline.map(item => item.gold),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E2E8F0',
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (label === 'Portfolio') {
              return `${label}: ${formatCurrency(value)}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#94A3B8',
          callback: function(value) {
            return typeof value === 'number' ? value.toLocaleString() : value;
          },
        },
      },
    },
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const getReturnColor = (percent: number) => {
    return percent >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Performance Comparison</h2>
      
      {/* Chart */}
      <div className="mb-6 h-80">
        <Line data={data} options={options} />
      </div>

      {/* Returns Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(performance.returns).map(([asset, returns]) => (
          <motion.div
            key={asset}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10"
          >
            <h3 className="font-semibold text-white mb-3 capitalize">
              {asset === 'nifty50' ? 'Nifty 50' : asset}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">1 Month</span>
                <span className={`font-semibold ${getReturnColor(returns['1month'])}`}>
                  {formatPercent(returns['1month'])}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">3 Months</span>
                <span className={`font-semibold ${getReturnColor(returns['3months'])}`}>
                  {formatPercent(returns['3months'])}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">1 Year</span>
                <span className={`font-semibold ${getReturnColor(returns['1year'])}`}>
                  {formatPercent(returns['1year'])}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PerformanceChart;