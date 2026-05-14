import { getCategoryClass } from '../../utils/helpers';
import { CATEGORY_MAP } from '../../utils/constants';

const Badge = ({ category, type, size = 'sm' }) => {
  if (type) {
    return (
      <span
        className={`badge ${
          type === 'income'
            ? 'bg-success-500/20 text-success-400 border border-success-500/30'
            : 'bg-danger-500/20 text-danger-400 border border-danger-500/30'
        }`}
      >
        {type === 'income' ? '↑ Income' : '↓ Expense'}
      </span>
    );
  }

  if (category) {
    const catData = CATEGORY_MAP[category];
    return (
      <span className={`badge ${getCategoryClass(category)}`}>
        {catData?.icon && <span>{catData.icon}</span>}
        {category}
      </span>
    );
  }

  return null;
};

export default Badge;
