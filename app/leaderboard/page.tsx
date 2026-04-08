'use client';

import MobileShell from '@/components/MobileShell';
import { useLiveLeaderboard, formatLastUpdated } from '@/lib/hooks/use-live-scores';
import { Trophy, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { LeaderboardEntry } from '@/types/database';

function formatScore(score: number): string {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function EntryRow({ entry, expanded, onToggle }: {
  entry: LeaderboardEntry; expanded: boolean; onToggle: () => void;
}) {
  const medalColors: Record<number, string> = {
    1: 'text-[var(--masters-gold)]',
    2: 'text-stone-400',
    3: 'text-amber-700',
  };

  const prizeLabels: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };

  return (
    <div className="card">
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4">
        <div className="w-8 text-center">
          {entry.rank <= 3 ? (
            <Trophy size={20} className={medalColors[entry.rank] || 'text-stone-400'} />
          ) : (
            <span className="text-sm font-bold text-stone-400">{entry.rank}</span>
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-stone-900">
              {entry.entrant.name}
            </p>
            {entry.prize_position && (
              <span className="text-sm">{prizeLabels[entry.prize_position]}</span>
            )}
          </div>
          <p className="text-xs text-stone-400">
            Best 4 of {entry.all_golfers.length} golfers
          </p>
        </div>
        <span className={`text-lg font-bold tabular-nums ${
          entry.total_score < 0 ? 'text-red-600' : entry.total_score > 0 ? 'text-blue-600' : 'text-stone-600'
        }`}>
          {formatScore(entry.total_score)}
        </span>
        {expanded ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-stone-100 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 mt-3">Team Breakdown</p>
          {entry.all_golfers
            .map(g => ({
              golfer: g,
              effective: g.status === 'cut' ? (g.live_score ?? 0) * 2 : (g.live_score ?? 0),
              isBestFour: entry.best_four_golfers.some(bf => bf.id === g.id),
            }))
            .sort((a, b) => a.effective - b.effective)
            .map(({ golfer, effective, isBestFour }) => (
              <div key={golfer.id} className={`flex items-center gap-2 py-1 ${!isBestFour ? 'opacity-40' : ''}`}>
                <span className="text-xs font-mono text-stone-400 w-5 text-right">#{golfer.world_rank}</span>
                <span className="flex-1 text-sm">{golfer.name}</span>
                {golfer.status === 'cut' && (
                  <AlertTriangle size={12} className="text-amber-500" />
                )}
                <span className={`text-xs font-bold tabular-nums ${
                  effective < 0 ? 'text-red-600' : effective > 0 ? 'text-blue-600' : 'text-stone-500'
                }`}>
                  {formatScore(effective)}
                  {golfer.status === 'cut' && <span className="text-[10px] ml-0.5">x2</span>}
                </span>
                {isBestFour && (
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">TOP 4</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const { data, isLoading, isValidating } = useLiveLeaderboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <MobileShell>
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            <p className="text-white/60 text-sm mt-1">
              {data ? `${data.leaderboard.length} entrants` : 'Loading...'}
            </p>
          </div>
          {data?.timestamp && (
            <div className="text-right">
              <p className="text-xs text-white/60">{formatLastUpdated(data.timestamp)}</p>
              {isValidating && <p className="text-xs text-white/80 animate-pulse">Updating...</p>}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-stone-400">Loading leaderboard...</p>
          </div>
        )}

        {data?.leaderboard.map(entry => (
          <EntryRow
            key={entry.entrant.id}
            entry={entry}
            expanded={expandedId === entry.entrant.id}
            onToggle={() => setExpandedId(expandedId === entry.entrant.id ? null : entry.entrant.id)}
          />
        ))}
        <div className="h-4" />
      </div>
    </MobileShell>
  );
}
