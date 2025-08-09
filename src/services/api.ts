import axios from 'axios';
import { Holding, AllocationData, PerformanceData, PortfolioSummary } from '../types/portfolio';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const portfolioAPI = {
  async getHoldings(): Promise<Holding[]> {
    const response = await api.get('/portfolio/holdings');
    return response.data;
  },

  async getAllocation(): Promise<AllocationData> {
    const response = await api.get('/portfolio/allocation');
    return response.data;
  },

  async getPerformance(): Promise<PerformanceData> {
    const response = await api.get('/portfolio/performance');
    return response.data;
  },

  async getSummary(): Promise<PortfolioSummary> {
    const response = await api.get('/portfolio/summary');
    return response.data;
  }
};

export default portfolioAPI;