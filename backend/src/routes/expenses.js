const express = require('express');
const { body } = require('express-validator');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getMonthlyStats,
  getCategoryStats,
  getSpendingTrend,
  getAIInsights,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// Stats routes (must be before /:id)
router.get('/stats/summary', getSummary);
router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/category', getCategoryStats);
router.get('/stats/trend', getSpendingTrend);
router.get('/stats/insights', getAIInsights);

// CRUD routes
router.route('/')
  .get(getExpenses)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Title is required'),
      body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
      body('category').notEmpty().withMessage('Category is required'),
      body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
      body('date').isISO8601().withMessage('Valid date required'),
    ],
    createExpense
  );

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
