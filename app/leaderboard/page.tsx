'use client';

import MobileShell from '@/components/MobileShell';
import { useLiveLeaderboard, formatLastUpdated } from '@/lib/hooks/use-live-scores';
import { getPrizes, ENTRANTS } from '@/lib/entrants-config';
import { Trophy, ChevronDown, ChevronUp, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';
import { LeaderboardEntry } from '@/types/database';
import Link from 'next/link';

function formatScore(score: number): string {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function EntryRow({ entry, expanded, onToggle, isPre }: {
  entry: LeaderboardEntry; expanded: boolean; onToggle: () => void; isPre: boolean;
}) {
  const prizes = getPrizes();
  const prizeAmounts: Record<number, number> = { 1: prizes.first, 2: prizes.second, 3: prizes.third };

  return (
    <div className={`card card-hover overflow-hidden ${
      !isPre && entry.rank === 1 ? 'border-2 border-[var(--masters-gold)] shadow-gold' : ''
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-4">
        {/* Rank */}
        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
          !isPre && entry.rank === 1 ? 'bg-[var(--masters-gold)] text-white' :
          !isPre && entry.rank === 2 ? 'bg-stone-300 text-stone-700' :
          !isPre && entry.rank === 3 ? 'bg-amber-700 text-white' :
          'bg-stone-100 text-stone-500'
        }`}>
          {isPre ? '-' : entry.rank}
        </div>

        {/* Name */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-stone-900 truncate">{entry.entrant.name}</p>
            {!isPre && entry.prize_position && (
              <span className="text-[10px] font-bold bg-[var(--masters-gold-light)] text-[var(--masters-gold-dark)] px-1.5 py-0.5 rounded flex-shrink-0">
                {entry.prize_position === 1 ? `1st` : entry.prize_position === 2 ? `2nd` : `3rd`}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {isPre ? '7 golfers selected' : `Best 4 of ${entry.all_golfers.length}`}
          </p>
        </div>

        {/* Score */}
        {!isPre && (
          <span className={`text-xl font-bold tabular-nums ${
            entry.total_score < 0 ? 'text-red-600' : entry.total_score > 0 ? 'text-blue-600' : 'text-stone-600'
          }`}>
            {formatScore(entry.total_score)}
          </span>
        )}

        {expanded ? <ChevronUp size={16} className="text-stone-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-stone-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-stone-100">
          <div className="flex items-center justify-between mt-3 mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Team Breakdown</p>
            <Link href={`/entrants/${entry.entrant.id}`} className="text-[10px] font-bold uppercase tracking-wider text-[var(--masters-green)] hover:underline">
              Full Details →
            </Link>
          </div>
          <div className="space-y-1">
            {entry.all_golfers
              .map(g => ({
                golfer: g,
                effective: g.status === 'cut' ? (g.live_score ?? 0) * 2 : (g.live_score ?? 0),
                isBestFour: entry.best_four_golfers.some(bf => bf.id === g.id),
              }))
              .sort((a, b) => a.effective - b.effective)
              .map(({ golfer, effective, isBestFour }) => (
                <div key={golfer.id} className={`flex items-center gap-2 py-1.5 px-2 rounded ${
                  isBestFour ? 'bg-emerald-50' : 'opacity-40'
                }`}>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    golfer.bucket === 'top12' ? 'bg-amber-100 text-amber-700' :
                    golfer.bucket === 'mid' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {golfer.bucket === 'top12' ? 'T12' : golfer.bucket === 'mid' ? 'MID' : 'WC'}
                  </span>
                  <span className="flex-1 text-sm truncate">{golfer.name}</span>
                  {golfer.status === 'cut' && (
                    <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
                  )}
                  {!isPre && (
                    <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${
                      effective < 0 ? 'text-red-600' : effective > 0 ? 'text-blue-600' : 'text-stone-500'
                    }`}>
                      {formatScore(effective)}
                      {golfer.status === 'cut' && <span className="text-[10px] ml-0.5">x2</span>}
                    </span>
                  )}
                  {isBestFour && (
                    <span className="text-[8px] font-bold bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded flex-shrink-0">
                      B4
                    </span>
                  )}
                </div>
              ))}
          </div>

          {/* Prize info */}
          {!isPre && entry.prize_position && (
            <div className="mt-3 pt-3 border-t border-stone-100 text-center">
              <span className="text-sm font-bold text-[var(--masters-gold-dark)]">
                Prize: £{prizeAmounts[entry.prize_position]}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const { data, isLoading, isValidating } = useLiveLeaderboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isPre = !data?.tournament || data.tournament.status === 'pre';

  return (
    <MobileShell>
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Sweep Standings</p>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-white">Leaderboard</h1>
          {data?.timestamp && !isPre && (
            <div className="flex items-center gap-2">
              {isValidating && <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />}
              <p className="text-[10px] text-white/40">{formatLastUpdated(data.timestamp)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-3 pb-6">
        {/* Pre-tournament message */}
        {isPre && (
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Clock size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Leaderboard will update live once the tournament starts. All entrants start at E (even).
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && !data && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard entries */}
        {data?.leaderboard?.map((entry) => (
          <EntryRow
            key={entry.entrant.id}
            entry={entry}
            expanded={expandedId === entry.entrant.id}
            onToggle={() => setExpandedId(expandedId === entry.entrant.id ? null : entry.entrant.id)}
            isPre={isPre}
          />
        ))}
      </div>
    </MobileShell>
  );
}
