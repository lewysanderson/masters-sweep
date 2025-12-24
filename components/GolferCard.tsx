import { Golfer } from '@/types/database';
import { formatScore, getScoreColor, getGolferBucket } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface GolferCardProps {
  golfer: Golfer;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  showBucket?: boolean;
}

export default function GolferCard({
  golfer,
  isSelected = false,
  onSelect,
  disabled = false,
  showBucket = true
}: GolferCardProps) {
  const bucket = getGolferBucket(golfer.current_rank);
  const bucketLabels = {
    top10: 'Top 10',
    mid40: 'Ranks 11-50',
    field: 'Field (51+)',
  };
  const bucketColors = {
    top10: 'bg-yellow-100 text-yellow-800',
    mid40: 'bg-blue-100 text-blue-800',
    field: 'bg-green-100 text-green-800',
  };

  return (
    <div
      onClick={!disabled ? onSelect : undefined}
      className={`
        card p-4 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-masters-green bg-masters-green/5' : 'hover:shadow-lg'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{golfer.name}</h3>
            {isSelected && <CheckCircle2 className="w-5 h-5 text-masters-green" />}
          </div>
          <p className="text-sm text-stone-500">Rank #{golfer.current_rank}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(golfer.live_score)}`}>
            {formatScore(golfer.live_score)}
          </div>
          <p className="text-xs text-stone-500">
            {golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        {showBucket && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${bucketColors[bucket]}`}>
            {bucketLabels[bucket]}
          </span>
        )}
        <span className="text-stone-600">
          Today: <span className={getScoreColor(golfer.today_score)}>{formatScore(golfer.today_score)}</span>
        </span>
      </div>

      {golfer.status === 'cut' && (
        <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
          <XCircle className="w-4 h-4" />
          <span>Missed Cut</span>
        </div>
      )}
    </div>
  );
}
