'use client';

import { useState, useMemo } from 'react';
import MobileShell from '@/components/MobileShell';
import { useLiveScores, formatLastUpdated, formatTimestamp } from '@/lib/hooks/use-live-scores';
import { ENTRANTS } from '@/lib/entrants-config';
import { GolferBucket, Golfer } from '@/types/database';
import { Search, ArrowUpDown } from 'lucide-react';

const FILTERS: Array<{ key: GolferBucket | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'top12', label: 'Top 12' },
  { key: 'mid', label: '13-50' },
  { key: 'wildcard', label: '51+' },
];

function formatScore(score: number | null): string {
  if (score === null) return '-';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

const bucketStyles: Record<GolferBucket, { bg: string; text: string; label: string }> = {
  top12: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'T12' },
  mid: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'MID' },
  wildcard: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'WC' },
};

export default function PlayersPage() {
  const { data, isLoading, isValidating } = useLiveScores();
  const [filter, setFilter] = useState<GolferBucket | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'picks'>('rank');

  const isPre = !data?.tournament || data.tournament.status === 'pre';
  const currentRound = data?.tournament?.current_round || 1;

  // Build pick count map
  const pickCounts = useMemo(() => {
    const counts = new Map<number, number>();
    ENTRANTS.forEach(entrant => {
      [...entrant.team.top12, ...entrant.team.mid, ...entrant.team.wildcard].forEach(id => {
        counts.set(id, (counts.get(id) || 0) + 1);
      });
    });
    return counts;
  }, []);

  const golfers = useMemo(() => {
    if (!data?.golfers) return [];
    
    let list = filter === 'all' ? data.golfers : data.golfers.filter(g => g.bucket === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }
    if (sortBy === 'score' && !isPre) {
      list = [...list].sort((a, b) => (a.live_score ?? 999) - (b.live_score ?? 999));
    } else if (sortBy === 'picks') {
      list = [...list].sort((a, b) => (pickCounts.get(b.id) || 0) - (pickCounts.get(a.id) || 0));
    } else {
      list = [...list].sort((a, b) => a.world_rank - b.world_rank);
    }
    return list;
  }, [data?.golfers, filter, search, sortBy, isPre, pickCounts]);

  return (
    <MobileShell>
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">
          {data ? `${data.golfers.length} Competitors` : 'Tournament Field'}
        </p>
        <h1 className="text-xl font-serif font-bold text-white">Players</h1>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {/* Last updated */}
        {data?.timestamp && !isPre && (
          <p className="text-[10px] text-stone-400 text-center">
            Live scores as at {formatTimestamp(data.timestamp)}
          </p>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            className="input pl-10 text-sm"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
                filter === key ? 'bg-[var(--masters-green)] text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="w-px bg-stone-200 mx-1" />
          <button
            onClick={() => setSortBy(sortBy === 'rank' ? (isPre ? 'picks' : 'score') : sortBy === 'score' ? 'picks' : 'rank')}
            className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 flex items-center gap-1 whitespace-nowrap"
          >
            <ArrowUpDown size={12} />
            {sortBy === 'rank' ? 'Rank' : sortBy === 'score' ? 'Score' : 'Picks'}
          </button>
        </div>

        {/* Player list */}
        <div className="space-y-1.5 pb-4">
          {/* Table header */}
          <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            <span className="flex-1">Player</span>
            <span className="w-10 text-center">Picks</span>
            {!isPre && <span className="w-12 text-right">Score</span>}
            {!isPre && <span className="w-16 text-right">Thru</span>}
          </div>

          {golfers.map((golfer) => {
            const bucket = bucketStyles[golfer.bucket];
            const picks = pickCounts.get(golfer.id) || 0;
            const isCut = golfer.status === 'cut';

            let statusText = '';
            if (!isPre) {
              if (isCut) statusText = 'CUT';
              else if (golfer.thru_hole === 18) statusText = 'F';
              else if (golfer.thru_hole !== null && golfer.thru_hole > 0) statusText = `${golfer.thru_hole}`;
              else statusText = '-';
            }

            return (
              <div key={golfer.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-stone-100 ${
                isCut ? 'opacity-50' : ''
              }`}>
                {/* Name & Bucket */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {!isPre && golfer.on_course && (
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                    )}
                    <p className={`font-semibold text-sm truncate ${isCut ? 'line-through text-stone-400' : ''}`}>
                      {golfer.name}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${bucket.bg} ${bucket.text}`}>
                    {bucket.label}
                  </span>
                </div>

                {/* Pick count */}
                <div className="w-10 text-center">
                  <span className={`text-xs font-bold ${picks > 0 ? 'text-stone-600' : 'text-stone-300'}`}>
                    {picks > 0 ? picks : '-'}
                  </span>
                </div>

                {/* Score */}
                {!isPre && (
                  <div className="w-12 text-right">
                    <span className={`text-sm font-bold tabular-nums ${
                      (golfer.live_score ?? 0) < 0 ? 'text-red-600' :
                      (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-500'
                    }`}>
                      {formatScore(golfer.live_score)}
                    </span>
                  </div>
                )}

                {/* Status */}
                {!isPre && (
                  <div className="w-16 text-right">
                    <span className={`text-xs ${isCut ? 'font-bold text-red-500' : 'text-stone-400'}`}>
                      {statusText}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {golfers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-stone-400 text-sm">No players found</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
