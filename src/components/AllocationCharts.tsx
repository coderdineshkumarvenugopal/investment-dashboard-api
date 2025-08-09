import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { AllocationData } from '../types/portfolio';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationChartsProps {
  allocation: AllocationData;
}

const AllocationCharts: React.FC<AllocationChartsProps> = ({ allocation }) => {
  const sectorColors = {
    Technology: '#3B82F6',
    Banking: '#10B981',
    Energy: '#F59E0B',
    Healthcare: '#EF4444',
    Telecom: '#8B5CF6',
    FMCG: '#06B6D4',
    Auto: '#F97316',
  };

  const marketCapColors = {
    Large: '#059669',
    Mid: '#0EA5E9',
    Small: '#DC2626',
  };

  const sectorData = {
    labels: Object.keys(allocation.bySector),
    datasets: [
      {
        data: Object.values(allocation.bySector).map(item => item.percentage),
        backgroundColor: Object.keys(allocation.bySector).map(
          sector => sectorColors[sector as keyof typeof sectorColors] || '#6B7280'
        ),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const marketCapData = {
    labels: Object.keys(allocation.byMarketCap),
    datasets: [
      {
        data: Object.values(allocation.byMarketCap).map(item => item.percentage),
        backgroundColor: Object.keys(allocation.byMarketCap).map(
          cap => marketCapColors[cap as keyof typeof marketCapColors] || '#6B7280'
        ),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
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
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Asset Allocation</h2>
      
      <div className="space-y-8">
        {/* Sector Allocation */}
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-4">By Sector</h3>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2 h-64">
              <Pie data={sectorData} options={chartOptions} />
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {Object.entries(allocation.bySector).map(([sector, data]) => (
                <motion.div
                  key={sector}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: sectorColors[sector as keyof typeof sectorColors] || '#6B7280'
                      }}
                    />
                    <span className="text-slate-300 font-medium">{sector}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{data.percentage.toFixed(1)}%</div>
                    <div className="text-slate-400 text-sm">{formatCurrency(data.value)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Cap Allocation */}
        <div>
          <h3 className="text-lg font-semibold text-slate-300 mb-4">By Market Cap</h3>
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2 h-64">
              <Doughnut data={marketCapData} options={chartOptions} />
            </div>
            <div className="w-full lg:w-1/2 space-y-3">
              {Object.entries(allocation.byMarketCap).map(([cap, data]) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: marketCapColors[cap as keyof typeof marketCapColors] || '#6B7280'
                      }}
                    />
                    <span className="text-slate-300 font-medium">{cap} Cap</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{data.percentage.toFixed(1)}%</div>
                    <div className="text-slate-400 text-sm">{formatCurrency(data.value)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AllocationCharts;