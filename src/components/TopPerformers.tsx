import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Shield, Target } from 'lucide-react';
import { PortfolioSummary } from '../types/portfolio';

interface TopPerformersProps {
  summary: PortfolioSummary;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ summary }) => {
  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'text-emerald-400';
      case 'moderate':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return Shield;
      case 'moderate':
        return Target;
      case 'high':
        return AlertTriangle;
      default:
        return Target;
    }
  };

  const RiskIcon = getRiskIcon(summary.riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Key Insights</h2>
      
      <div className="space-y-6">
        {/* Top Performer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-4 border border-emerald-500/30"
        >
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/10 -translate-y-8 translate-x-8" />
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-400 mb-1">Top Performer</h3>
              <p className="text-white font-bold text-lg">{summary.topPerformer.symbol}</p>
              <p className="text-slate-300 text-sm mb-2">{summary.topPerformer.name}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">
                  {formatPercent(summary.topPerformer.gainPercent)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Worst Performer */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 p-4 border border-red-500/30"
        >
          <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-red-500/10 -translate-y-8 translate-x-8" />
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-400 mb-1">Needs Attention</h3>
              <p className="text-white font-bold text-lg">{summary.worstPerformer.symbol}</p>
              <p className="text-slate-300 text-sm mb-2">{summary.worstPerformer.name}</p>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-bold">
                  {formatPercent(summary.worstPerformer.gainPercent)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Health */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <h3 className="font-semibold text-white mb-4">Portfolio Health</h3>
          
          <div className="space-y-4">
            {/* Diversification Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/20 rounded">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Diversification</span>
              </div>
              <div className="text-right">
                <span className="text-white font-bold">{summary.diversificationScore}/10</span>
                <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{ width: `${(summary.diversificationScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/20 rounded">
                  <RiskIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-slate-300">Risk Level</span>
              </div>
              <span className={`font-bold ${getRiskColor(summary.riskLevel)}`}>
                {summary.riskLevel}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <h3 className="font-semibold text-white mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-slate-400">Gainers</div>
              <div className="text-emerald-400 font-bold">8/10</div>
            </div>
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <div className="text-slate-400">Sectors</div>
              <div className="text-blue-400 font-bold">5</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopPerformers;