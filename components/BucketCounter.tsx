interface BucketCounterProps {
  counts: {
    top10: number;
    mid40: number;
    field: number;
  };
}

export default function BucketCounter({ counts }: BucketCounterProps) {
  const buckets = [
    { label: 'Top 10', current: counts.top10, required: 2, color: 'yellow' },
    { label: 'Ranks 11-50', current: counts.mid40, required: 3, color: 'blue' },
    { label: 'Field (51+)', current: counts.field, required: 2, color: 'green' },
  ];

  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4">Selection Requirements</h3>
      <div className="space-y-3">
        {buckets.map((bucket) => {
          const isComplete = bucket.current === bucket.required;
          const isOver = bucket.current > bucket.required;

          return (
            <div key={bucket.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{bucket.label}</span>
                <span className={`text-sm font-bold ${
                  isComplete ? 'text-green-600' : isOver ? 'text-red-600' : 'text-stone-600'
                }`}>
                  {bucket.current} / {bucket.required}
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isComplete ? 'bg-green-500' : isOver ? 'bg-red-500' : `bg-${bucket.color}-500`
                  }`}
                  style={{ width: `${Math.min((bucket.current / bucket.required) * 100, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-stone-200">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Selected</span>
          <span className={`font-bold ${
            counts.top10 + counts.mid40 + counts.field === 7 ? 'text-green-600' : 'text-stone-600'
          }`}>
            {counts.top10 + counts.mid40 + counts.field} / 7
          </span>
        </div>
      </div>
    </div>
  );
}
