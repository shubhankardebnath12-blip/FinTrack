import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useExpenses } from '../../context/ExpenseContext';
import { CATEGORIES } from '../../utils/constants';
import { format } from 'date-fns';

const defaultForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: format(new Date(), 'yyyy-MM-dd'),
  note: '',
};

const TransactionForm = ({ isOpen, onClose, editData = null, onSuccess }) => {
  const { createExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(editData);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || '',
        amount: editData.amount?.toString() || '',
        type: editData.type || 'expense',
        category: editData.category || 'Food',
        date: format(new Date(editData.date), 'yyyy-MM-dd'),
        note: editData.note || '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
      };

      if (isEditing) {
        await updateExpense(editData._id, payload);
      } else {
        await createExpense(payload);
      }

      onSuccess?.();
      onClose();
      setForm(defaultForm);
    } catch {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.label}`,
  }));

  const typeOptions = [
    { value: 'expense', label: '↓ Expense' },
    { value: 'income', label: '↑ Income' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {isEditing ? 'Update' : 'Add Transaction'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type toggle */}
        <div>
          <label className="input-label">Transaction Type</label>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: opt.value }))}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  form.type === opt.value
                    ? opt.value === 'expense'
                      ? 'bg-danger-600/20 border-danger-500/50 text-danger-400'
                      : 'bg-success-600/20 border-success-500/50 text-success-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Netflix subscription"
          error={errors.title}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.amount}
          />

          <Input
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            error={errors.date}
          />
        </div>

        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categoryOptions}
        />

        <Textarea
          label="Note (optional)"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Add a note..."
          rows={3}
        />
      </form>
    </Modal>
  );
};

export default TransactionForm;
