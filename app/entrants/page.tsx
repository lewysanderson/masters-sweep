'use client';

import { useState, useMemo } from 'react';
import MobileShell from '@/components/MobileShell';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { useLiveLeaderboard } from '@/lib/hooks/use-live-scores';
import { useFavourites } from '@/lib/hooks/use-favourites';
import { Search, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';

function formatScore(score: number): string {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

export default function EntrantsPage() {
  const { data: leaderboardData } = useLiveLeaderboard();
  const { favourites, toggleFavourite, isFavourite, loaded } = useFavourites();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rank'>('name');

  const isPre = !leaderboardData?.tournament || leaderboardData.tournament.status === 'pre';

  const leaderboardMap = useMemo(() => {
    const map = new Map<string, any>();
    leaderboardData?.leaderboard?.forEach((entry) => {
      map.set(entry.entrant.id, entry);
    });
    return map;
  }, [leaderboardData]);

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
      // Favourites first, then alphabetical
      list.sort((a, b) => {
        const aFav = favourites.includes(a.id) ? 0 : 1;
        const bFav = favourites.includes(b.id) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        return a.name.localeCompare(b.name);
      });
    }
    
    return list;
  }, [search, sortBy, leaderboardMap, isPre, favourites]);

  return (
    <MobileShell>
      {/* Header */}
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">{ENTRANTS.length} Entrants</p>
        <h1 className="text-xl font-serif font-bold text-white">Entrants</h1>
      </div>

      <div className="px-5 pt-4 space-y-3">
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

        {/* Tip if no favourites */}
        {loaded && favourites.length === 0 && !search && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            <Star size={14} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-800">Tap the star next to your name to pin your team to the home page.</p>
          </div>
        )}

        {/* Entrant list */}
        <div className="space-y-2 pb-4">
          {filteredEntrants.map((entrant) => {
            const lbEntry = leaderboardMap.get(entrant.id);
            const topPicks = [...entrant.team.top12, ...entrant.team.mid.slice(0, 1)].map(getGolferName);
            const fav = isFavourite(entrant.id);
            
            return (
              <div
                key={entrant.id}
                className={`card card-hover flex items-center gap-3 !p-4 ${
                  lbEntry?.rank === 1 && !isPre ? 'border-2 !border-[var(--masters-gold)]' : ''
                } ${fav ? '!border-[var(--masters-green)] !border-opacity-40' : ''}`}
              >
                {/* Favourite star */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavourite(entrant.id);
                  }}
                  className="flex-shrink-0 -ml-1 p-1 rounded-full transition-colors"
                  aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Star
                    size={16}
                    className={fav ? 'text-[var(--masters-gold)] fill-[var(--masters-gold)]' : 'text-stone-300'}
                  />
                </button>

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
                <Link href={`/entrants/${entrant.id}`} className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-stone-900 truncate">{entrant.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {topPicks.join(', ')} +{entrant.team.mid.length + entrant.team.wildcard.length - 1} more
                  </p>
                </Link>

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

                <Link href={`/entrants/${entrant.id}`} className="flex-shrink-0">
                  <ChevronRight size={16} className="text-stone-300" />
                </Link>
              </div>
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
