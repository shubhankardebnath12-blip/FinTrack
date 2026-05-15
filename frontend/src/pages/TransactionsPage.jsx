import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Plus, SortAsc, SortDesc, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import TransactionCard from '../components/transactions/TransactionCard';
import TransactionForm from '../components/transactions/TransactionForm';
import { TransactionSkeleton } from '../components/ui/Skeleton';
import { Input, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { CATEGORIES } from '../utils/constants';
import { debounce } from '../utils/helpers';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: `${c.icon} ${c.label}` })),
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'expense', label: '↓ Expense' },
  { value: 'income', label: '↑ Income' },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Title' },
];

const TransactionsPage = () => {
  const { fetchExpenses, deleteExpense } = useExpenses();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
  });

  const loadTransactions = useCallback(async (f) => {
    setLoading(true);
    try {
      const result = await fetchExpenses({ ...f, limit: 10 });
      setTransactions(result.data || []);
      setPagination(result.pagination || { page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  useEffect(() => {
    loadTransactions(filters);
  }, [filters, loadTransactions]);

  useEffect(() => {
    const handler = () => loadTransactions(filters);
    window.addEventListener('expense-updated', handler);
    return () => window.removeEventListener('expense-updated', handler);
  }, [loadTransactions, filters]);

  const debouncedSearch = useCallback(
    debounce((search) => {
      setFilters((p) => ({ ...p, search, page: 1 }));
    }, 400),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value, page: 1 }));
  };

  const handleSort = (field) => {
    setFilters((p) => ({
      ...p,
      sortBy: field,
      sortOrder: p.sortBy === field && p.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: '', category: '', startDate: '', endDate: '', sortBy: 'date', sortOrder: 'desc', page: 1 });
  };

  const hasActiveFilters = filters.type || filters.category || filters.startDate || filters.endDate;

  const handleEdit = (txn) => {
    setEditData(txn);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    loadTransactions(filters);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            onChange={handleSearchChange}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Filter}
            onClick={() => setShowFilters((p) => !p)}
            className={showFilters || hasActiveFilters ? 'border-primary-500/50 text-primary-400' : ''}
          >
            Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-400 ml-1" />}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => { setEditData(null); setShowForm(true); }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass-card p-4 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Type"
              options={TYPE_OPTIONS}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            />
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            />
            <Input
              label="From Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              label="To Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-danger-400 hover:text-danger-300 mt-3 transition-colors"
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Sort bar */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto no-scrollbar pb-1" style={{ color: 'var(--color-text-muted)' }}>
        <span className="flex-shrink-0">Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all duration-200 ${
              filters.sortBy === opt.value
                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                : 'hover:bg-white/10 hover:text-white'
            }`}
          >
            {opt.label}
            {filters.sortBy === opt.value && (
              filters.sortOrder === 'desc' ? <SortDesc size={11} /> : <SortAsc size={11} />
            )}
          </button>
        ))}
        <span className="ml-auto flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{pagination.total} transactions</span>
      </div>

      {/* Transactions list */}
      {loading ? (
        <TransactionSkeleton />
      ) : transactions.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-base font-semibold text-white mb-2">No transactions found</h3>
          <p className="text-sm text-white/40">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn) => (
            <TransactionCard
              key={txn._id}
              transaction={txn}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/40">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={pagination.page <= 1}
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      <TransactionForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        editData={editData}
        onSuccess={() => loadTransactions(filters)}
      />
    </div>
  );
};

export default TransactionsPage;
