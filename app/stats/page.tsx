'use client';

import { useState, useMemo } from 'react';
import MobileShell from '@/components/MobileShell';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { useLiveScores } from '@/lib/hooks/use-live-scores';
import { GolferBucket } from '@/types/database';

const TABS: Array<{ key: GolferBucket | 'all'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'top12', label: 'Top 12' },
  { key: 'mid', label: '13-50' },
  { key: 'wildcard', label: '51+' },
];

interface PickStat {
  id: number;
  name: string;
  bucket: GolferBucket;
  pickCount: number;
  pickPct: number;
  pickedBy: string[];
  worldRank: number;
}

export default function StatsPage() {
  const { data: scoresData } = useLiveScores();
  const [tab, setTab] = useState<GolferBucket | 'all'>('all');
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const isPre = !scoresData?.tournament || scoresData.tournament.status === 'pre';

  // Build pick data
  const pickStats = useMemo(() => {
    const countMap = new Map<number, { count: number; pickedBy: string[] }>();
    
    ENTRANTS.forEach(entrant => {
      [...entrant.team.top12, ...entrant.team.mid, ...entrant.team.wildcard].forEach(id => {
        const existing = countMap.get(id) || { count: 0, pickedBy: [] };
        existing.count++;
        existing.pickedBy.push(entrant.name);
        countMap.set(id, existing);
      });
    });

    const stats: PickStat[] = [];
    allGolfers.forEach(g => {
      const data = countMap.get(g.id);
      if (data && data.count > 0) {
        stats.push({
          id: g.id,
          name: g.name,
          bucket: g.bucket,
          pickCount: data.count,
          pickPct: (data.count / ENTRANTS.length) * 100,
          pickedBy: data.pickedBy,
          worldRank: g.world_rank,
        });
      }
    });

    return stats.sort((a, b) => b.pickCount - a.pickCount);
  }, []);

  const filteredStats = useMemo(() => {
    if (tab === 'all') return pickStats;
    return pickStats.filter(s => s.bucket === tab);
  }, [pickStats, tab]);

  const maxPicks = Math.max(...filteredStats.map(s => s.pickCount), 1);

  // Aggregate stats
  const uniqueGolfers = pickStats.length;
  const totalPicks = ENTRANTS.length * 7;
  const mostPicked = pickStats[0];
  const topPickedEntrant = useMemo(() => {
    // Find entrant whose picks are most "consensus"
    let best = { name: '', score: 0 };
    ENTRANTS.forEach(e => {
      const allPicks = [...e.team.top12, ...e.team.mid, ...e.team.wildcard];
      const score = allPicks.reduce((sum, id) => {
        const stat = pickStats.find(s => s.id === id);
        return sum + (stat?.pickCount || 0);
      }, 0);
      if (score > best.score) best = { name: e.name, score };
    });
    return best;
  }, [pickStats]);

  const bucketColor = (bucket: GolferBucket) => {
    if (bucket === 'top12') return 'bg-amber-500';
    if (bucket === 'mid') return 'bg-blue-500';
    return 'bg-purple-500';
  };

  const bucketTextColor = (bucket: GolferBucket) => {
    if (bucket === 'top12') return 'text-amber-700';
    if (bucket === 'mid') return 'text-blue-700';
    return 'text-purple-700';
  };

  return (
    <MobileShell>
      {/* Header */}
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Pick Analysis</p>
        <h1 className="text-xl font-serif font-bold text-white">Statistics</h1>
      </div>

      <div className="px-5 pt-4 space-y-4 pb-6">
        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card !p-3 text-center">
            <p className="text-xl font-bold text-[var(--masters-green)]">{uniqueGolfers}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Unique Picks</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-xl font-bold text-[var(--masters-gold)]">{totalPicks}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Total Picks</p>
          </div>
          <div className="card !p-3 text-center">
            <p className="text-xl font-bold text-stone-700">{mostPicked?.pickCount || 0}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">Most Picked</p>
          </div>
        </div>

        {/* Most popular */}
        {mostPicked && (
          <div className="card !p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Most Popular Pick</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900">{mostPicked.name}</p>
                <p className="text-xs text-stone-400">
                  Picked by {mostPicked.pickCount} of {ENTRANTS.length} entrants ({mostPicked.pickPct.toFixed(0)}%)
                </p>
              </div>
              <div className={`text-2xl font-bold ${bucketTextColor(mostPicked.bucket)}`}>
                {mostPicked.pickCount}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${
                tab === key ? 'bg-[var(--masters-green)] text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('chart')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
              view === 'chart' ? 'bg-stone-200 text-stone-700' : 'text-stone-400'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setView('table')}
            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
              view === 'table' ? 'bg-stone-200 text-stone-700' : 'text-stone-400'
            }`}
          >
            Table
          </button>
        </div>

        {/* Chart view */}
        {view === 'chart' && (
          <div className="card !p-4 space-y-2">
            {filteredStats.map((stat) => (
              <div key={stat.id} className="group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-stone-700 truncate w-28 flex-shrink-0" title={stat.name}>
                    {stat.name.split(' ').pop()}
                  </span>
                  <div className="flex-1 bg-stone-100 rounded-full h-5 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${bucketColor(stat.bucket)} flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max((stat.pickCount / maxPicks) * 100, 8)}%` }}
                    >
                      <span className="text-[10px] font-bold text-white">{stat.pickCount}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 w-8 text-right flex-shrink-0">
                    {stat.pickPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table view */}
        {view === 'table' && (
          <div className="card !p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">Player</th>
                  <th className="text-center px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">Tier</th>
                  <th className="text-center px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">Picks</th>
                  <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-stone-50">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-stone-800 truncate max-w-[140px]">{stat.name}</p>
                    </td>
                    <td className="text-center px-2 py-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        stat.bucket === 'top12' ? 'bg-amber-50 text-amber-700' :
                        stat.bucket === 'mid' ? 'bg-blue-50 text-blue-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {stat.bucket === 'top12' ? 'T12' : stat.bucket === 'mid' ? 'MID' : 'WC'}
                      </span>
                    </td>
                    <td className="text-center px-2 py-2">
                      <span className="font-bold text-stone-700">{stat.pickCount}</span>
                    </td>
                    <td className="text-right px-3 py-2">
                      <span className="text-stone-500">{stat.pickPct.toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Picked by breakdown for top picks */}
        <div className="card !p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Who Picked Who?</h3>
          <div className="space-y-3">
            {pickStats.slice(0, 5).map((stat) => (
              <div key={stat.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-stone-700">{stat.name}</p>
                  <span className="text-xs font-bold text-stone-400">{stat.pickCount} picks</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {stat.pickedBy.map((name, idx) => (
                    <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                      {name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
