'use client';

import { useState } from 'react';
import MobileShell from '@/components/MobileShell';
import useSWR from 'swr';
import { GolferStats } from '@/types/database';
import { TrendingUp, TrendingDown, Target, Award, BarChart3, Percent } from 'lucide-react';
import { formatLastUpdated } from '@/lib/hooks/use-live-scores';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StatsData {
  golfer_stats: GolferStats[];
  aggregate_stats: {
    total_entrants: number;
    total_picks: number;
    unique_golfers_picked: number;
    most_popular_golfer: GolferStats;
    least_popular_golfer: GolferStats;
    average_picks_per_golfer: number;
    top12_picks: number;
    mid_picks: number;
    wildcard_picks: number;
    value_picks: GolferStats[];
    consensus_picks: GolferStats[];
  };
  tournament_status: 'pre' | 'in' | 'post';
  timestamp: number;
}

function formatOdds(odds?: number): string {
  if (!odds) return 'N/A';
  return `${odds.toFixed(1)} to 1`;
}

function formatProbability(prob?: number): string {
  if (!prob) return 'N/A';
  return `${(prob * 100).toFixed(1)}%`;
}

function formatScore(score: number | null | undefined): string {
  if (score === null || score === undefined) return '--';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

export default function StatsPage() {
  const { data, error, isLoading, isValidating } = useSWR<StatsData>('/api/stats', fetcher, {
    refreshInterval: 60000,
    dedupingInterval: 2000,
  });
  
  const [view, setView] = useState<'popularity' | 'value' | 'odds'>('popularity');
  const [showAll, setShowAll] = useState(false);
  
  const sortedStats = data?.golfer_stats ? [...data.golfer_stats] : [];
  
  if (view === 'value' && sortedStats.length > 0) {
    sortedStats.sort((a, b) => (b.value_rating || 0) - (a.value_rating || 0));
  } else if (view === 'odds' && sortedStats.length > 0) {
    sortedStats.sort((a, b) => (a.odds || 999) - (b.odds || 999));
  }
  
  return (
    <MobileShell>
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Stats</h1>
            <p className="text-white/60 text-sm mt-1">Pick analysis & probabilities</p>
          </div>
          {data?.timestamp && (
            <div className="text-right">
              <p className="text-xs text-white/60">{formatLastUpdated(data.timestamp)}</p>
              {isValidating && <p className="text-xs text-white/80 animate-pulse">Updating...</p>}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-6">
        {isLoading && (
          <>
            {/* Loading Skeletons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-stone-200 rounded w-12"></div>
              </div>
              <div className="card p-4 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-stone-200 rounded w-12"></div>
              </div>
            </div>
            <div className="card p-5 animate-pulse">
              <div className="h-5 bg-stone-200 rounded w-40 mb-3"></div>
              <div className="h-6 bg-stone-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
            <div className="card p-5 animate-pulse">
              <div className="h-5 bg-stone-200 rounded w-32 mb-3"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-stone-100 rounded"></div>
                ))}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="card p-6">
              <p className="text-red-600 font-semibold mb-2">Failed to load statistics</p>
              <p className="text-stone-500 text-sm">Please try again later</p>
            </div>
          </div>
        )}

        {!isLoading && !error && data && data.golfer_stats.length === 0 && (
          <div className="text-center py-8">
            <div className="card p-6">
              <p className="text-stone-600 font-semibold mb-2">No statistics available</p>
              <p className="text-stone-500 text-sm">Check back once entrants have made their picks</p>
            </div>
          </div>
        )}

        {!isLoading && !error && data && data.golfer_stats.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-[var(--masters-green)]" />
                  <p className="text-xs text-stone-500">Total Picks</p>
                </div>
                <p className="text-2xl font-bold">{data.aggregate_stats.total_picks}</p>
              </div>
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-[var(--masters-green)]" />
                  <p className="text-xs text-stone-500">Unique Golfers</p>
                </div>
                <p className="text-2xl font-bold">{data.aggregate_stats.unique_golfers_picked}</p>
              </div>
            </div>

            {/* Most Popular Golfer */}
            {data.aggregate_stats.most_popular_golfer && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[var(--masters-green)]" />
                  <h2 className="text-lg font-bold">Most Popular Pick</h2>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{data.aggregate_stats.most_popular_golfer.golfer_name}</p>
                    <p className="text-sm text-stone-500">
                      Picked by {data.aggregate_stats.most_popular_golfer.pick_count}/{data.aggregate_stats.total_entrants} entrants
                    </p>
                    {data.aggregate_stats.most_popular_golfer.current_score !== undefined && (
                      <p className="text-xs text-stone-400 mt-1">
                        Current Score: {formatScore(data.aggregate_stats.most_popular_golfer.current_score)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[var(--masters-green)]">
                      {data.aggregate_stats.most_popular_golfer.pick_percentage.toFixed(0)}%
                    </p>
                    {data.aggregate_stats.most_popular_golfer.odds && (
                      <p className="text-xs text-stone-500 mt-1">
                        {formatOdds(data.aggregate_stats.most_popular_golfer.odds)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Value Picks */}
            {data.aggregate_stats.value_picks.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-[var(--masters-green)]" />
                  <h2 className="text-lg font-bold">Best Value Picks</h2>
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  High win probability, low pick rate
                </p>
                <div className="space-y-2">
                  {data.aggregate_stats.value_picks.slice(0, 3).map((golfer, idx) => (
                    <div key={golfer.golfer_id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-stone-400">#{idx + 1}</span>
                        <div>
                          <p className="font-semibold text-sm">{golfer.golfer_name}</p>
                          <p className="text-xs text-stone-500">
                            {golfer.pick_count} picks • {formatOdds(golfer.odds)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">
                          {formatProbability(golfer.implied_probability)}
                        </p>
                        <p className="text-xs text-stone-400">
                          {golfer.pick_percentage.toFixed(0)}% picked
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bucket Distribution */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="w-5 h-5 text-[var(--masters-green)]" />
                <h2 className="text-lg font-bold">Pick Distribution</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Top 12</span>
                    <span className="font-semibold">{data.aggregate_stats.top12_picks} picks</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${(data.aggregate_stats.top12_picks / data.aggregate_stats.total_picks) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Mid Tier (13-50)</span>
                    <span className="font-semibold">{data.aggregate_stats.mid_picks} picks</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(data.aggregate_stats.mid_picks / data.aggregate_stats.total_picks) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-stone-600">Wildcards (51+)</span>
                    <span className="font-semibold">{data.aggregate_stats.wildcard_picks} picks</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(data.aggregate_stats.wildcard_picks / data.aggregate_stats.total_picks) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 border-b border-stone-200">
              <button
                onClick={() => setView('popularity')}
                className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                  view === 'popularity'
                    ? 'text-[var(--masters-green)]'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Popularity
                {view === 'popularity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--masters-green)]" />
                )}
              </button>
              <button
                onClick={() => setView('value')}
                className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                  view === 'value'
                    ? 'text-[var(--masters-green)]'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Value
                {view === 'value' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--masters-green)]" />
                )}
              </button>
              <button
                onClick={() => setView('odds')}
                className={`px-4 py-2 text-sm font-semibold transition-colors relative ${
                  view === 'odds'
                    ? 'text-[var(--masters-green)]'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Betting Odds
                {view === 'odds' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--masters-green)]" />
                )}
              </button>
            </div>

            {/* All Picked Golfers */}
            <div className="space-y-2">
              {sortedStats.slice(0, showAll ? sortedStats.length : 10).map((golfer, idx) => (
                <div key={golfer.golfer_id} className="card p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-mono text-stone-400 w-6">#{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{golfer.golfer_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            golfer.bucket === 'top12' ? 'bg-amber-100 text-amber-700' :
                            golfer.bucket === 'mid' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {golfer.bucket === 'top12' ? 'TOP 12' : 
                             golfer.bucket === 'mid' ? '13-50' : '51+'}
                          </span>
                          {golfer.current_score !== undefined && (
                            <span className="text-xs text-stone-400">
                              {formatScore(golfer.current_score)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {view === 'popularity' && (
                        <>
                          <p className="text-lg font-bold text-[var(--masters-green)]">
                            {golfer.pick_percentage.toFixed(0)}%
                          </p>
                          <p className="text-xs text-stone-400">
                            {golfer.pick_count} picks
                          </p>
                        </>
                      )}
                      {view === 'value' && golfer.value_rating !== undefined && (
                        <>
                          <p className={`text-lg font-bold ${
                            golfer.value_rating > 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {golfer.value_rating > 0 ? '+' : ''}{golfer.value_rating.toFixed(1)}
                          </p>
                          <p className="text-xs text-stone-400">
                            {formatProbability(golfer.implied_probability)}
                          </p>
                        </>
                      )}
                      {view === 'odds' && (
                        <>
                          <p className="text-sm font-bold">
                            {formatOdds(golfer.odds)}
                          </p>
                          <p className="text-xs text-stone-400">
                            {formatProbability(golfer.implied_probability)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedStats.length > 10 && (
              <div className="text-center pb-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-2 bg-[var(--masters-green)] text-white rounded-lg font-semibold hover:bg-[var(--masters-green-dark)] transition-colors"
                >
                  {showAll ? 'Show Less' : `Show All ${sortedStats.length} Golfers`}
                </button>
              </div>
            )}

            <div className="h-4" />
          </>
        )}
      </div>
    </MobileShell>
  );
}
