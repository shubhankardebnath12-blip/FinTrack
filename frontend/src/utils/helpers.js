import { CURRENCY_SYMBOLS } from './constants';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatCurrency = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), fmt);
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return formatDistanceToNow(d, { addSuffix: true });
};

export const formatCompactNumber = (num) => {
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(2);
};

export const clsxMerge = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getCategoryClass = (category) => {
  const map = {
    Food: 'cat-food',
    Travel: 'cat-travel',
    Shopping: 'cat-shopping',
    Bills: 'cat-bills',
    Entertainment: 'cat-entertainment',
    Health: 'cat-health',
    Education: 'cat-education',
    Salary: 'cat-salary',
    Investment: 'cat-investment',
    Other: 'cat-other',
  };
  return map[category] || 'cat-other';
};

export const truncate = (str, length = 30) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
