const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton shimmer ${className}`} />
      ))}
    </>
  );
};

export const TransactionSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="glass-card p-4 flex items-center gap-4">
        <div className="skeleton shimmer w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton shimmer h-4 w-40 rounded" />
          <div className="skeleton shimmer h-3 w-24 rounded" />
        </div>
        <div className="skeleton shimmer h-6 w-20 rounded" />
      </div>
    ))}
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="skeleton shimmer w-24 h-4 rounded" />
      <div className="skeleton shimmer w-10 h-10 rounded-xl" />
    </div>
    <div className="skeleton shimmer w-32 h-8 rounded" />
    <div className="skeleton shimmer w-20 h-4 rounded" />
  </div>
);

export default Skeleton;
