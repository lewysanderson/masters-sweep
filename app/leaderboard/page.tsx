'use client';

import MobileShell from '@/components/MobileShell';
import { useLiveLeaderboard, formatTimestamp } from '@/lib/hooks/use-live-scores';
import { getPrizes, ENTRANTS } from '@/lib/entrants-config';
import { AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className={entry.rank <= 3 && !isPre ? 'bg-[var(--masters-gold)]/[0.03]' : ''}>
      <button onClick={onToggle} className="w-full flex items-center gap-2 px-3 py-[7px] hover:bg-stone-50/50 transition-colors">
        {/* Rank */}
        <span className={`w-6 text-center text-xs font-bold tabular-nums flex-shrink-0 ${
          !isPre && entry.rank === 1 ? 'text-[var(--masters-gold)]' :
          !isPre && entry.rank <= 3 ? 'text-amber-700' :
          'text-stone-400'
        }`}>
          {isPre ? '-' : entry.rank}
        </span>

        {/* Name */}
        <span className="flex-1 text-left text-[13px] font-semibold text-stone-900 truncate">{entry.entrant.name}</span>

        {/* Prize */}
        {!isPre && entry.prize_position && (
          <span className="text-[8px] font-bold bg-[var(--masters-gold)]/10 text-[var(--masters-gold-dark)] px-1.5 py-0.5 rounded flex-shrink-0">
            £{prizeAmounts[entry.prize_position]}
          </span>
        )}

        {/* Score */}
        {!isPre && (
          <span className={`text-[13px] font-bold tabular-nums w-8 text-right flex-shrink-0 ${
            entry.total_score < 0 ? 'text-red-600' : entry.total_score > 0 ? 'text-blue-600' : 'text-stone-500'
          }`}>
            {formatScore(entry.total_score)}
          </span>
        )}

        {expanded ? <ChevronUp size={12} className="text-stone-300 flex-shrink-0" /> : <ChevronDown size={12} className="text-stone-300 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-3 pb-2.5 pt-0.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Team</p>
            <Link href={`/entrants/${entry.entrant.id}`} className="text-[9px] font-bold uppercase tracking-wider text-[var(--masters-green)] hover:underline">
              Details →
            </Link>
          </div>
          <div className="space-y-px">
            {entry.all_golfers
              .map(g => ({
                golfer: g,
                effective: g.status === 'cut' ? (g.live_score ?? 0) * 2 : (g.live_score ?? 0),
                isBestFour: entry.best_four_golfers.some(bf => bf.id === g.id),
              }))
              .sort((a, b) => a.effective - b.effective)
              .map(({ golfer, effective, isBestFour }) => {
                const isCut = golfer.status === 'cut';
                return (
                  <div key={golfer.id} className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded text-[11px] ${
                    isBestFour ? 'bg-emerald-50/80' : 'opacity-35'
                  } ${isCut ? '!opacity-60' : ''}`}>
                    <span className={`text-[7px] font-bold px-1 py-0.5 rounded ${
                      golfer.bucket === 'top12' ? 'bg-amber-100 text-amber-700' :
                      golfer.bucket === 'mid' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {golfer.bucket === 'top12' ? 'T12' : golfer.bucket === 'mid' ? 'MID' : 'WC'}
                    </span>
                    <span className={`flex-1 truncate ${isCut ? 'line-through text-stone-400' : ''}`}>{golfer.name}</span>
                    {isCut && (
                      <span className="flex-shrink-0 text-[7px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">
                        CUT &times;2
                      </span>
                    )}
                    {!isPre && (
                      <span className={`font-bold tabular-nums flex-shrink-0 ${
                        isCut ? 'text-red-500' :
                        effective < 0 ? 'text-red-600' : effective > 0 ? 'text-blue-600' : 'text-stone-400'
                      }`}>
                        {formatScore(effective)}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const { data, isLoading } = useLiveLeaderboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isPre = !data?.tournament || data.tournament.status === 'pre';

  return (
    <MobileShell>
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Sweep Standings</p>
        <h1 className="text-xl font-serif font-bold text-white">Leaderboard</h1>
      </div>

      <div className="px-4 pt-3 pb-6">
        {/* Last updated */}
        {data?.timestamp && !isPre && (
          <p className="text-[10px] text-stone-400 text-center mb-2">
            Live scores as at {formatTimestamp(data.timestamp)}
          </p>
        )}

        {/* Pre-tournament message */}
        {isPre && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg mb-2">
            <Clock size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-800">Leaderboard updates live once the tournament starts.</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && !data && (
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-2 px-3 py-2">
                <div className="w-6 h-4 bg-stone-200 rounded" />
                <div className="flex-1 h-4 bg-stone-200 rounded" />
                <div className="w-8 h-4 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Column header */}
        {data?.leaderboard && data.leaderboard.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200">
            <span className="w-6 text-center">#</span>
            <span className="flex-1">Entrant</span>
            {!isPre && <span className="w-8 text-right">Score</span>}
            <span className="w-3" />
          </div>
        )}

        {/* Leaderboard */}
        <div className="divide-y divide-stone-100 bg-white rounded-b-lg border-x border-b border-stone-200 overflow-hidden">
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
      </div>
    </MobileShell>
  );
}
