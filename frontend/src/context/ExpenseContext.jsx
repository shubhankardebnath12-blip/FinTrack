import { createContext, useContext, useState, useCallback } from 'react';
import { expenseService } from '../services/api';
import toast from 'react-hot-toast';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await expenseService.getAll(params);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch transactions');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    setStatsLoading(true);
    try {
      const { data } = await expenseService.getSummary();
      setSummary(data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchMonthlyStats = useCallback(async (year) => {
    try {
      const { data } = await expenseService.getMonthlyStats(year);
      setMonthlyStats(data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch monthly stats:', error);
    }
  }, []);

  const fetchCategoryStats = useCallback(async (params) => {
    try {
      const { data } = await expenseService.getCategoryStats(params);
      setCategoryStats(data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch category stats:', error);
    }
  }, []);

  const fetchTrend = useCallback(async (days = 30) => {
    try {
      const { data } = await expenseService.getSpendingTrend(days);
      setTrend(data.data);
      return data.data;
    } catch (error) {
      console.error('Failed to fetch trend:', error);
    }
  }, []);

  const createExpense = useCallback(async (expenseData) => {
    try {
      const { data } = await expenseService.create(expenseData);
      toast.success('Transaction added successfully! ✅');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
      throw error;
    }
  }, []);

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const { data } = await expenseService.update(id, expenseData);
      toast.success('Transaction updated! ✏️');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update transaction');
      throw error;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseService.delete(id);
      toast.success('Transaction deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
      throw error;
    }
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        summary,
        monthlyStats,
        categoryStats,
        trend,
        loading,
        statsLoading,
        fetchExpenses,
        fetchSummary,
        fetchMonthlyStats,
        fetchCategoryStats,
        fetchTrend,
        createExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
};
