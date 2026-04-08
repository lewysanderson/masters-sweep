'use client';

import { useState, useMemo } from 'react';
import MobileShell from '@/components/MobileShell';
import { useLiveScores, formatLastUpdated } from '@/lib/hooks/use-live-scores';
import { GolferBucket } from '@/types/database';
import { Search } from 'lucide-react';

const FILTERS: Array<{ key: GolferBucket | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'top12', label: 'Top 12' },
  { key: 'mid', label: '13-50' },
  { key: 'wildcard', label: '51+' },
];

function formatScore(score: number | null): string {
  if (score === null) return '--';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

const bucketStyles: Record<GolferBucket, { bg: string; text: string }> = {
  top12: { bg: 'bg-amber-50', text: 'text-amber-700' },
  mid: { bg: 'bg-blue-50', text: 'text-blue-700' },
  wildcard: { bg: 'bg-purple-50', text: 'text-purple-700' },
};

export default function PlayersPage() {
  const { data, isLoading, isValidating } = useLiveScores();
  const [filter, setFilter] = useState<GolferBucket | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'score'>('rank');

  const golfers = useMemo(() => {
    if (!data?.golfers) return [];
    
    let list = filter === 'all' ? data.golfers : data.golfers.filter(g => g.bucket === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g => g.name.toLowerCase().includes(q));
    }
    if (sortBy === 'score') {
      list = [...list].sort((a, b) => (a.live_score ?? 999) - (b.live_score ?? 999));
    } else {
      list = [...list].sort((a, b) => a.world_rank - b.world_rank);
    }
    return list;
  }, [data?.golfers, filter, search, sortBy]);

  return (
    <MobileShell>
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Field</h1>
            <p className="text-white/60 text-sm mt-1">
              {data ? `${data.golfers.length} players` : 'Loading...'}
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
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search players..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f.key
                  ? 'bg-[var(--masters-green)] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setSortBy(sortBy === 'rank' ? 'score' : 'rank')}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200"
          >
            {sortBy === 'rank' ? 'By Rank' : 'By Score'}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-stone-400">Loading players...</p>
          </div>
        )}

        {/* Players List */}
        <div className="space-y-2">
          {golfers.map(golfer => {
            const bucket = bucketStyles[golfer.bucket];
            return (
              <div key={golfer.id} className="card p-3 flex items-center gap-3">
                {/* On Course Indicator */}
                {golfer.on_course && (
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                )}
                
                {/* Rank */}
                <div className="w-8 text-right">
                  <span className="text-xs font-mono text-stone-400">#{golfer.world_rank}</span>
                </div>

                {/* Name & Bucket */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{golfer.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bucket.bg} ${bucket.text}`}>
                      {golfer.bucket === 'top12' ? 'TOP 12' : 
                       golfer.bucket === 'mid' ? '13-50' : '51+'}
                    </span>
                    {golfer.status === 'cut' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                        CUT
                      </span>
                    )}
                    {golfer.thru_hole !== null && (
                      <span className="text-xs text-stone-400">
                        {golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scores */}
                <div className="text-right">
                  <p className={`text-lg font-bold tabular-nums ${
                    (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                    (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                  }`}>
                    {formatScore(golfer.live_score)}
                  </p>
                  {golfer.today_score !== null && (
                    <p className="text-xs text-stone-400 tabular-nums">
                      R{data?.tournament.current_round || 1}: {formatScore(golfer.today_score)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {golfers.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-stone-400">No players found</p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </MobileShell>
  );
}
