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
  const [chartBucket, setChartBucket] = useState<'all' | 'top12' | 'mid' | 'wildcard'>('all');
  
  const sortedStats = data?.golfer_stats ? [...data.golfer_stats] : [];
  
  if (view === 'value' && sortedStats.length > 0) {
    sortedStats.sort((a, b) => (b.value_rating || 0) - (a.value_rating || 0));
  } else if (view === 'odds' && sortedStats.length > 0) {
    sortedStats.sort((a, b) => (a.odds || 999) - (b.odds || 999));
  }
  
  return (
    <MobileShell>
      <div className="gold-accent bg-gradient-to-b from-[var(--masters-green)] to-[var(--masters-green-dark)] px-6 pt-14 pb-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm text-white/90">
              Analytics
            </div>
            <h1 className="text-3xl font-serif font-bold text-white">Statistics</h1>
            <p className="text-white/70 text-sm mt-2">Pick analysis & probabilities</p>
          </div>
          {data?.timestamp && (
            <div className="text-right">
              <p className="text-xs text-white/70">{formatLastUpdated(data.timestamp)}</p>
              {isValidating && <p className="text-xs text-white/90 animate-pulse mt-1">Updating...</p>}
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

            {/* Pick Distribution Bar Chart */}
            <div className="card-elevated">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--masters-green-lighter)]">
                  <BarChart3 className="w-5 h-5 text-[var(--masters-green)]" />
                </div>
                <h2 className="text-xl font-serif font-bold">Pick Distribution</h2>
              </div>

              {/* Bucket Tabs */}
              <div className="flex gap-1 mb-4 bg-stone-100 p-1 rounded-lg">
                <button
                  onClick={() => setChartBucket('all')}
                  className={`flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    chartBucket === 'all'
                      ? 'bg-white text-[var(--masters-green)] shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setChartBucket('top12')}
                  className={`flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    chartBucket === 'top12'
                      ? 'bg-white text-[var(--masters-green)] shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Top 12
                </button>
                <button
                  onClick={() => setChartBucket('mid')}
                  className={`flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    chartBucket === 'mid'
                      ? 'bg-white text-[var(--masters-green)] shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  13-50
                </button>
                <button
                  onClick={() => setChartBucket('wildcard')}
                  className={`flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${
                    chartBucket === 'wildcard'
                      ? 'bg-white text-[var(--masters-green)] shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  51+
                </button>
              </div>

              {/* Bar Chart */}
              <div className="relative">
                {(() => {
                  const filteredGolfers = chartBucket === 'all' 
                    ? data.golfer_stats
                    : data.golfer_stats.filter(g => g.bucket === chartBucket);
                  
                  const sortedGolfers = [...filteredGolfers].sort((a, b) => b.pick_count - a.pick_count);
                  const maxPicks = Math.max(...sortedGolfers.map(g => g.pick_count), 1);
                  
                  return (
                    <>
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 bottom-20 flex flex-col justify-between text-xs text-stone-500 font-mono pr-3">
                        <span>{maxPicks}</span>
                        <span>{Math.floor(maxPicks * 0.75)}</span>
                        <span>{Math.floor(maxPicks * 0.5)}</span>
                        <span>{Math.floor(maxPicks * 0.25)}</span>
                        <span>0</span>
                      </div>

                      {/* Chart container with padding and scroll */}
                      <div className="ml-12 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <div className="flex items-end gap-4 min-w-max px-4 py-4">
                          {sortedGolfers.map((golfer) => {
                            const heightPercent = (golfer.pick_count / maxPicks) * 100;
                            const barColor = 
                              golfer.bucket === 'top12' ? 'bg-amber-500' :
                              golfer.bucket === 'mid' ? 'bg-blue-500' :
                              'bg-purple-500';
                            
                            return (
                              <div key={golfer.golfer_id} className="flex flex-col items-center" style={{ width: '52px', minWidth: '52px' }}>
                                {/* Bar container */}
                                <div className="relative w-full flex flex-col items-center" style={{ height: '200px' }}>
                                  {/* Pick count above bar */}
                                  <div className="h-6 flex items-center justify-center">
                                    {golfer.pick_count > 0 && (
                                      <span className="text-[10px] font-bold text-stone-700">
                                        {golfer.pick_count}
                                      </span>
                                    )}
                                  </div>
                                  {/* Bar */}
                                  <div className="w-full flex-1 flex flex-col justify-end">
                                    <div 
                                      className={`w-full ${barColor} rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group shadow-sm`}
                                      style={{ height: `${Math.max(heightPercent, 2)}%`, minHeight: '4px' }}
                                      title={`${golfer.golfer_name}: ${golfer.pick_count} picks`}
                                    >
                                      {/* Tooltip on hover */}
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                                        <div className="bg-stone-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                          <p className="font-bold">{golfer.golfer_name}</p>
                                          <p className="text-stone-300">{golfer.pick_count} picks ({golfer.pick_percentage.toFixed(0)}%)</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Player name label area */}
                                <div className="relative w-full mt-2" style={{ height: '60px' }}>
                                  <div className="absolute left-0 top-0 w-full h-full flex items-start justify-center">
                                    <span 
                                      className="text-[10px] font-semibold text-stone-700 whitespace-nowrap inline-block"
                                      style={{ 
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'top center',
                                        marginTop: '8px'
                                      }}
                                    >
                                      {golfer.golfer_name.split(' ').pop()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-stone-200">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-500 rounded"></div>
                          <span className="text-xs text-stone-600">Top 12</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="text-xs text-stone-600">13-50</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded"></div>
                          <span className="text-xs text-stone-600">51+</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
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
