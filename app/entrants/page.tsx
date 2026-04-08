'use client';

import { useState, useMemo } from 'react';
import MobileShell from '@/components/MobileShell';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { useLiveLeaderboard } from '@/lib/hooks/use-live-scores';
import { Search, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';

function formatScore(score: number): string {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

export default function EntrantsPage() {
  const { data: leaderboardData } = useLiveLeaderboard();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rank'>('name');

  const isPre = !leaderboardData?.tournament || leaderboardData.tournament.status === 'pre';

  // Build a map of entrant ID -> leaderboard entry
  const leaderboardMap = useMemo(() => {
    const map = new Map<string, any>();
    leaderboardData?.leaderboard?.forEach((entry) => {
      map.set(entry.entrant.id, entry);
    });
    return map;
  }, [leaderboardData]);

  // Get golfer names for team preview
  const getGolferName = (id: number): string => {
    const g = allGolfers.find((g) => g.id === id);
    return g ? g.name.split(' ').pop() || g.name : '?';
  };

  const filteredEntrants = useMemo(() => {
    let list = [...ENTRANTS];
    
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }
    
    if (sortBy === 'rank' && !isPre) {
      list.sort((a, b) => {
        const rankA = leaderboardMap.get(a.id)?.rank ?? 999;
        const rankB = leaderboardMap.get(b.id)?.rank ?? 999;
        return rankA - rankB;
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return list;
  }, [search, sortBy, leaderboardMap, isPre]);

  return (
    <MobileShell>
      {/* Header */}
      <div className="gold-accent bg-gradient-to-b from-[var(--masters-green)] to-[var(--masters-green-dark)] px-6 pt-14 pb-6 mb-4">
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm text-white/90">
          {ENTRANTS.length} Entrants
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">Entrants</h1>
        <p className="text-white/60 text-sm mt-1">View team selections and standings</p>
      </div>

      <div className="px-5 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            className="input pl-10 text-sm"
            placeholder="Find your name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('name')}
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
              sortBy === 'name' ? 'bg-[var(--masters-green)] text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            A-Z
          </button>
          {!isPre && (
            <button
              onClick={() => setSortBy('rank')}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                sortBy === 'rank' ? 'bg-[var(--masters-green)] text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              By Rank
            </button>
          )}
        </div>

        {/* Entrant list */}
        <div className="space-y-2 pb-4">
          {filteredEntrants.map((entrant) => {
            const lbEntry = leaderboardMap.get(entrant.id);
            const topPicks = [...entrant.team.top12, ...entrant.team.mid.slice(0, 1)].map(getGolferName);
            
            return (
              <Link
                key={entrant.id}
                href={`/entrants/${entrant.id}`}
                className={`card card-hover flex items-center gap-3 !p-4 ${
                  lbEntry?.rank === 1 && !isPre ? 'border-2 !border-[var(--masters-gold)]' : ''
                }`}
              >
                {/* Rank badge */}
                {!isPre && lbEntry && (
                  <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ${
                    lbEntry.rank === 1 ? 'bg-[var(--masters-gold)] text-white' :
                    lbEntry.rank === 2 ? 'bg-stone-300 text-stone-700' :
                    lbEntry.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {lbEntry.rank}
                  </div>
                )}

                {/* Name and team preview */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-stone-900 truncate">{entrant.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {topPicks.join(', ')} +{entrant.team.mid.length + entrant.team.wildcard.length - 1} more
                  </p>
                </div>

                {/* Score */}
                {!isPre && lbEntry && (
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-base font-bold tabular-nums ${
                      lbEntry.total_score < 0 ? 'text-red-600' :
                      lbEntry.total_score > 0 ? 'text-blue-600' : 'text-stone-600'
                    }`}>
                      {formatScore(lbEntry.total_score)}
                    </p>
                  </div>
                )}

                <ChevronRight size={16} className="flex-shrink-0 text-stone-300" />
              </Link>
            );
          })}
        </div>

        {filteredEntrants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400 text-sm">No entrants found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
