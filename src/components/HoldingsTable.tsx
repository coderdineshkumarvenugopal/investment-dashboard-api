import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Holding } from '../types/portfolio';

interface HoldingsTableProps {
  holdings: Holding[];
}

type SortField = 'symbol' | 'name' | 'value' | 'gainLossPercent' | 'gainLoss' | 'currentPrice';
type SortDirection = 'asc' | 'desc';

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedHoldings = useMemo(() => {
    let filtered = holdings.filter(
      (holding) =>
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [holdings, searchTerm, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <div className="w-4 h-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Portfolio Holdings</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th 
                className="text-left py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-2">
                  Symbol <SortIcon field="symbol" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Company <SortIcon field="name" />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-slate-300">Qty</th>
              <th 
                className="text-right py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center gap-2 justify-end">
                  Current Price <SortIcon field="currentPrice" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center gap-2 justify-end">
                  Market Value <SortIcon field="value" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gainLoss')}
              >
                <div className="flex items-center gap-2 justify-end">
                  Gain/Loss <SortIcon field="gainLoss" />
                </div>
              </th>
              <th 
                className="text-right py-3 px-4 font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gainLossPercent')}
              >
                <div className="flex items-center gap-2 justify-end">
                  Return % <SortIcon field="gainLossPercent" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredAndSortedHoldings.map((holding, index) => (
                <motion.tr
                  key={holding.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{holding.symbol}</div>
                    <div className="text-xs text-slate-400">{holding.sector}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div className="max-w-32 truncate">{holding.name}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{holding.quantity}</td>
                  <td className="py-4 px-4 text-right text-white">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-white">
                    {formatCurrency(holding.value)}
                  </td>
                  <td className={`py-4 px-4 text-right font-semibold ${
                    holding.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <div className="flex items-center justify-end gap-1">
                      {holding.gainLoss >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {formatCurrency(Math.abs(holding.gainLoss))}
                    </div>
                  </td>
                  <td className={`py-4 px-4 text-right font-bold ${
                    holding.gainLossPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {formatPercent(holding.gainLossPercent)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        <AnimatePresence>
          {filteredAndSortedHoldings.map((holding, index) => (
            <motion.div
              key={holding.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-white text-lg">{holding.symbol}</div>
                  <div className="text-slate-300 text-sm">{holding.name}</div>
                  <div className="text-slate-400 text-xs">{holding.sector}</div>
                </div>
                <div className={`text-right font-bold text-lg ${
                  holding.gainLossPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {formatPercent(holding.gainLossPercent)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Quantity</div>
                  <div className="text-white font-semibold">{holding.quantity}</div>
                </div>
                <div>
                  <div className="text-slate-400">Current Price</div>
                  <div className="text-white font-semibold">{formatCurrency(holding.currentPrice)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Market Value</div>
                  <div className="text-white font-semibold">{formatCurrency(holding.value)}</div>
                </div>
                <div>
                  <div className="text-slate-400">Gain/Loss</div>
                  <div className={`font-semibold flex items-center gap-1 ${
                    holding.gainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {holding.gainLoss >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {formatCurrency(Math.abs(holding.gainLoss))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedHoldings.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No holdings found matching your search.
        </div>
      )}
    </motion.div>
  );
};

export default HoldingsTable;