import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';

interface OverviewCardsProps {
  summary: PortfolioSummary;
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ summary }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const cards = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(summary.totalValue),
      icon: DollarSign,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50',
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(summary.totalGainLoss),
      subtitle: formatPercent(summary.totalGainLossPercent),
      icon: summary.totalGainLoss >= 0 ? TrendingUp : TrendingDown,
      gradient: summary.totalGainLoss >= 0 ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600',
      bgGradient: summary.totalGainLoss >= 0 ? 'from-emerald-50 to-green-50' : 'from-red-50 to-rose-50',
      textColor: summary.totalGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      title: 'Total Invested',
      value: formatCurrency(summary.totalInvested),
      icon: PieChart,
      gradient: 'from-orange-500 to-yellow-600',
      bgGradient: 'from-orange-50 to-yellow-50',
    },
    {
      title: 'Risk Level',
      value: summary.riskLevel,
      subtitle: `Score: ${summary.diversificationScore}/10`,
      icon: TrendingUp,
      gradient: 'from-indigo-500 to-cyan-600',
      bgGradient: 'from-indigo-50 to-cyan-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className={`relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 transition-all duration-300 hover:bg-white/15`}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-5`} />
          
          {/* Icon */}
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} mb-4`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <div className="relative">
            <p className="text-slate-300 text-sm font-medium mb-1">{card.title}</p>
            <p className={`text-2xl font-bold mb-1 ${card.textColor || 'text-white'}`}>
              {card.value}
            </p>
            {card.subtitle && (
              <p className={`text-sm font-medium ${card.textColor || 'text-slate-300'}`}>
                {card.subtitle}
              </p>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-10 h-10 rounded-full bg-white/5 translate-y-5 -translate-x-5" />
        </motion.div>
      ))}
    </div>
  );
};

export default OverviewCards;