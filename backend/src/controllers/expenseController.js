const { validationResult } = require('express-validator');
const Expense = require('../models/Expense');

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      minAmount,
      maxAmount,
    } = req.query;

    const query = { userId: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Expense.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const expense = await Expense.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary stats
// @route   GET /api/expenses/stats/summary
// @access  Private
const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [incomeResult, expenseResult, recentTransactions] = await Promise.all([
      Expense.aggregate([
        { $match: { userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.aggregate([
        { $match: { userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Expense.find({ userId }).sort({ date: -1 }).limit(5),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance,
        savingsRate: parseFloat(savingsRate),
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly stats
// @route   GET /api/expenses/stats/monthly
// @access  Private
const getMonthlyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const stats = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(year, i, 1).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
    }));

    stats.forEach(({ _id, total }) => {
      const monthData = months[_id.month - 1];
      monthData[_id.type] = total;
    });

    res.json({ success: true, data: months });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category stats
// @route   GET /api/expenses/stats/category
// @access  Private
const getCategoryStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type = 'expense', year, month } = req.query;

    const matchQuery = { userId, type };
    if (year) {
      const startDate = month
        ? new Date(year, month - 1, 1)
        : new Date(`${year}-01-01`);
      const endDate = month
        ? new Date(year, month, 0)
        : new Date(`${year}-12-31`);
      matchQuery.date = { $gte: startDate, $lte: endDate };
    }

    const stats = await Expense.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const totalAmount = stats.reduce((sum, s) => sum + s.total, 0);
    const data = stats.map((s) => ({
      category: s._id,
      total: s.total,
      count: s.count,
      percentage: totalAmount > 0 ? parseFloat(((s.total / totalAmount) * 100).toFixed(1)) : 0,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get spending trend (last 30 days)
// @route   GET /api/expenses/stats/trend
// @access  Private
const getSpendingTrend = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Expense.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: stats.map(s => ({ date: s._id, amount: s.total })) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI-powered financial insights
// @route   GET /api/expenses/stats/insights
// @access  Private
const getAIInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    const [allTime, thisMonth, lastMonth, last3MonthsCategories, dailyAvgData, topExpenses] = await Promise.all([
      // All-time summary
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // This month
      Expense.aggregate([
        { $match: { userId, date: { $gte: thisMonthStart } } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // Last month
      Expense.aggregate([
        { $match: { userId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),

      // Category breakdown last 3 months (expenses only)
      Expense.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: threeMonthsAgo } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),

      // Daily spending average this month
      Expense.aggregate([
        { $match: { userId, type: 'expense', date: { $gte: thisMonthStart } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            daily: { $sum: '$amount' },
          },
        },
      ]),

      // Top 3 largest single expenses all time
      Expense.find({ userId, type: 'expense' }).sort({ amount: -1 }).limit(3).select('title amount category date'),
    ]);

    // Parse all-time
    const atIncome = allTime.find(r => r._id === 'income')?.total || 0;
    const atExpense = allTime.find(r => r._id === 'expense')?.total || 0;
    const atBalance = atIncome - atExpense;
    const atSavingsRate = atIncome > 0 ? (atBalance / atIncome) * 100 : 0;

    // Parse this month
    const tmIncome = thisMonth.find(r => r._id === 'income')?.total || 0;
    const tmExpense = thisMonth.find(r => r._id === 'expense')?.total || 0;
    const tmCount = thisMonth.find(r => r._id === 'expense')?.count || 0;
    const tmBalance = tmIncome - tmExpense;
    const tmSavingsRate = tmIncome > 0 ? (tmBalance / tmIncome) * 100 : 0;

    // Parse last month
    const lmIncome = lastMonth.find(r => r._id === 'income')?.total || 0;
    const lmExpense = lastMonth.find(r => r._id === 'expense')?.total || 0;

    // Month-over-month change
    const momExpenseChange = lmExpense > 0 ? ((tmExpense - lmExpense) / lmExpense) * 100 : 0;
    const momIncomeChange = lmIncome > 0 ? ((tmIncome - lmIncome) / lmIncome) * 100 : 0;

    // Daily average
    const dailyAvg = dailyAvgData.length > 0
      ? dailyAvgData.reduce((s, d) => s + d.daily, 0) / dailyAvgData.length
      : 0;

    // Projected month-end spending
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const projectedMonthExpense = dailyAvg * daysInMonth;

    // Category analysis with 50/30/20 rule context
    const totalCatExpense = last3MonthsCategories.reduce((s, c) => s + c.total, 0);
    const categoryAnalysis = last3MonthsCategories.map(c => ({
      category: c._id,
      total: c.total,
      count: c.count,
      percentage: totalCatExpense > 0 ? parseFloat(((c.total / totalCatExpense) * 100).toFixed(1)) : 0,
      monthlyAvg: parseFloat((c.total / 3).toFixed(2)),
    }));

    // Overspending detection (categories > 30% of total expense)
    const overspendingCategories = categoryAnalysis
      .filter(c => c.percentage > 30)
      .map(c => ({ ...c, severity: c.percentage > 50 ? 'high' : 'medium' }));

    // Savings target: 20% of income (50/30/20 rule)
    const idealSavings = tmIncome * 0.2;
    const idealNeeds = tmIncome * 0.5;
    const idealWants = tmIncome * 0.3;
    const savingsGap = idealSavings - tmBalance;

    // Generate insights array
    const insights = [];

    // 1. Savings rate insight
    if (atSavingsRate >= 30) {
      insights.push({ type: 'positive', category: 'savings', title: 'Excellent Savings Rate!', message: `You're saving ${atSavingsRate.toFixed(1)}% of your income — well above the recommended 20%. Keep it up!`, impact: 'high' });
    } else if (atSavingsRate >= 20) {
      insights.push({ type: 'positive', category: 'savings', title: 'Healthy Savings Rate', message: `Your ${atSavingsRate.toFixed(1)}% savings rate meets the 50/30/20 rule target. Consider pushing toward 25%+.`, impact: 'medium' });
    } else if (atSavingsRate > 0) {
      insights.push({ type: 'warning', category: 'savings', title: 'Savings Rate Below Target', message: `You're saving only ${atSavingsRate.toFixed(1)}% of income. The 50/30/20 rule suggests saving at least 20% (${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(idealSavings)}/mo).`, impact: 'high' });
    } else if (atIncome > 0) {
      insights.push({ type: 'danger', category: 'savings', title: 'No Savings Detected', message: 'Your expenses exceed your income. Immediate action needed to prevent financial stress.', impact: 'critical' });
    }

    // 2. Month-over-month spending change
    if (lmExpense > 0 && Math.abs(momExpenseChange) > 5) {
      if (momExpenseChange > 0) {
        insights.push({ type: momExpenseChange > 20 ? 'danger' : 'warning', category: 'spending', title: 'Spending Increased This Month', message: `Your spending is up ${momExpenseChange.toFixed(1)}% vs last month (+${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(tmExpense - lmExpense)}). Review recent transactions.`, impact: 'high' });
      } else {
        insights.push({ type: 'positive', category: 'spending', title: 'Spending Down This Month!', message: `Great job! You've reduced spending by ${Math.abs(momExpenseChange).toFixed(1)}% compared to last month, saving an extra ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(lmExpense - tmExpense)}.`, impact: 'high' });
      }
    }

    // 3. Overspending categories
    overspendingCategories.forEach(cat => {
      insights.push({
        type: cat.severity === 'high' ? 'danger' : 'warning',
        category: 'category',
        title: `High Spending on ${cat.category}`,
        message: `${cat.category} accounts for ${cat.percentage}% of your expenses (~${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cat.monthlyAvg)}/mo). Consider setting a monthly cap.`,
        impact: cat.severity,
      });
    });

    // 4. Projected month-end
    if (tmIncome > 0 && projectedMonthExpense > 0) {
      if (projectedMonthExpense > tmIncome) {
        insights.push({ type: 'danger', category: 'forecast', title: 'On Track to Overspend', message: `At your current daily rate of ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(dailyAvg)}/day, you'll spend ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(projectedMonthExpense)} this month — exceeding your income.`, impact: 'critical' });
      } else if (projectedMonthExpense > tmIncome * 0.8) {
        insights.push({ type: 'warning', category: 'forecast', title: 'Month-End Forecast: Tight', message: `Projected month-end spending is ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(projectedMonthExpense)} (${((projectedMonthExpense/tmIncome)*100).toFixed(0)}% of income). You have ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(tmIncome - projectedMonthExpense)} remaining budget.`, impact: 'medium' });
      } else {
        insights.push({ type: 'positive', category: 'forecast', title: 'Month-End Looking Good', message: `At ${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(dailyAvg)}/day spend rate, you'll end the month with ~${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(tmIncome - projectedMonthExpense)} remaining.`, impact: 'low' });
      }
    }

    // 5. Transaction frequency insight
    if (tmCount > 0) {
      const avgPerDay = tmCount / dayOfMonth;
      if (avgPerDay > 3) {
        insights.push({ type: 'warning', category: 'behavior', title: 'High Transaction Frequency', message: `You're averaging ${avgPerDay.toFixed(1)} transactions/day this month. Frequent small purchases often add up — consider batching shopping trips.`, impact: 'medium' });
      }
    }

    // Budgeting recommendations (50/30/20)
    const budgetRecommendations = {
      rule: '50/30/20',
      monthlyIncome: tmIncome,
      needs: { target: idealNeeds, label: 'Needs (50%)', description: 'Rent, food, utilities, transport' },
      wants: { target: idealWants, label: 'Wants (30%)', description: 'Entertainment, dining out, shopping' },
      savings: { target: idealSavings, label: 'Savings (20%)', description: 'Emergency fund, investments, goals' },
      currentExpense: tmExpense,
      currentSavings: tmBalance,
      savingsGap: savingsGap > 0 ? savingsGap : 0,
    };

    res.json({
      success: true,
      data: {
        summary: {
          allTime: { income: atIncome, expense: atExpense, balance: atBalance, savingsRate: parseFloat(atSavingsRate.toFixed(1)) },
          thisMonth: { income: tmIncome, expense: tmExpense, balance: tmBalance, savingsRate: parseFloat(tmSavingsRate.toFixed(1)), transactionCount: tmCount },
          lastMonth: { income: lmIncome, expense: lmExpense },
          changes: { expense: parseFloat(momExpenseChange.toFixed(1)), income: parseFloat(momIncomeChange.toFixed(1)) },
        },
        forecast: {
          dailyAvg: parseFloat(dailyAvg.toFixed(2)),
          projectedMonthExpense: parseFloat(projectedMonthExpense.toFixed(2)),
          daysRemaining: daysInMonth - dayOfMonth,
          remainingBudget: parseFloat((tmIncome - tmExpense).toFixed(2)),
        },
        categoryAnalysis,
        overspendingCategories,
        topExpenses,
        insights,
        budgetRecommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getMonthlyStats,
  getCategoryStats,
  getSpendingTrend,
  getAIInsights,
};
