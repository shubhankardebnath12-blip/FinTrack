// Currency symbols map
export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
};

// Category config with icons, colors
export const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', color: '#f97316', bgColor: '#f9731620', icon: '🍕' },
  { id: 'Travel', label: 'Travel', color: '#3b82f6', bgColor: '#3b82f620', icon: '✈️' },
  { id: 'Shopping', label: 'Shopping', color: '#ec4899', bgColor: '#ec489920', icon: '🛍️' },
  { id: 'Bills', label: 'Bills & Utilities', color: '#eab308', bgColor: '#eab30820', icon: '📄' },
  { id: 'Entertainment', label: 'Entertainment', color: '#a855f7', bgColor: '#a855f720', icon: '🎬' },
  { id: 'Health', label: 'Health & Fitness', color: '#22c55e', bgColor: '#22c55e20', icon: '💊' },
  { id: 'Education', label: 'Education', color: '#06b6d4', bgColor: '#06b6d420', icon: '📚' },
  { id: 'Salary', label: 'Salary', color: '#10b981', bgColor: '#10b98120', icon: '💼' },
  { id: 'Investment', label: 'Investment', color: '#6366f1', bgColor: '#6366f120', icon: '📈' },
  { id: 'Other', label: 'Other', color: '#94a3b8', bgColor: '#94a3b820', icon: '📦' },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

export const EXPENSE_CATEGORIES = CATEGORIES.filter(
  (c) => !['Salary', 'Investment'].includes(c.id)
);

export const INCOME_CATEGORIES = CATEGORIES.filter((c) =>
  ['Salary', 'Investment', 'Other'].includes(c.id)
);

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
  '#10b981', '#94a3b8',
];
