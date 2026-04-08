'use client';

import { use } from 'react';
import MobileShell from '@/components/MobileShell';
import { getEntrantById } from '@/lib/entrants-config';
import { useLiveScores, useLiveLeaderboard } from '@/lib/hooks/use-live-scores';
import { allGolfers } from '@/lib/dummy-data';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

function formatScore(score: number | null): string {
  if (score === null) return '--';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

const bucketLabels = {
  top12: 'Top 12',
  mid: 'Mid Tier (13-50)',
  wildcard: 'Wildcard (51+)',
};

export default function EntrantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const entrant = getEntrantById(resolvedParams.id);
  const { data: scoresData } = useLiveScores();
  const { data: leaderboardData } = useLiveLeaderboard();
  
  if (!entrant) {
    return (
      <MobileShell>
        <div className="p-4">
          <p className="text-stone-400">Entrant not found</p>
          <Link href="/entrants" className="text-[var(--masters-green)] mt-2 inline-block">
            ← Back to Entrants
          </Link>
        </div>
      </MobileShell>
    );
  }
  
  // Find entrant's position in leaderboard
  const leaderboardEntry = leaderboardData?.leaderboard.find(
    (e) => e.entrant.id === entrant.id
  );
  
  // Get all golfer IDs for this entrant
  const allGolferIds = [
    ...entrant.team.top12,
    ...entrant.team.mid,
    ...entrant.team.wildcard,
  ];
  
  // Get golfers with live scores
  const teamGolfers = allGolferIds.map((id) => {
    const liveGolfer = scoresData?.golfers.find((g) => g.id === id);
    if (liveGolfer) return liveGolfer;
    
    // Fallback to dummy data
    return allGolfers.find((g) => g.id === id);
  }).filter(Boolean);
  
  // Determine best 4
  const bestFourIds = new Set(leaderboardEntry?.best_four_golfers.map(g => g.id) || []);
  
  return (
    <MobileShell>
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <Link href="/entrants" className="text-white/80 text-sm flex items-center gap-1 mb-3 hover:text-white">
          <ArrowLeft size={16} />
          Back to Entrants
        </Link>
        <h1 className="text-2xl font-bold text-white">{entrant.name}</h1>
        {leaderboardEntry && (
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-white/90">
              <Trophy size={16} />
              <span className="text-sm">Position: #{leaderboardEntry.rank}</span>
            </div>
            <div className="text-white/90">
              <span className="text-sm">Score: </span>
              <span className="text-lg font-bold">{formatScore(leaderboardEntry.total_score)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Top 12 Picks */}
        <div>
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">
            {bucketLabels.top12} (Pick 2)
          </h2>
          <div className="space-y-2">
            {entrant.team.top12.map((golferId) => {
              const golfer = teamGolfers.find((g) => g?.id === golferId);
              if (!golfer) return null;
              
              const isBestFour = bestFourIds.has(golfer.id);
              
              return (
                <div key={golfer.id} className={`card p-3 ${isBestFour ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{golfer.name}</p>
                        {isBestFour && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            TOP 4
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">
                        Rank #{golfer.world_rank}
                        {golfer.status === 'cut' && ' • CUT'}
                        {golfer.thru_hole !== null && ` • ${golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole}`}`}
                      </p>
                    </div>
                    <p className={`text-lg font-bold tabular-nums ${
                      (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                      (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                    }`}>
                      {formatScore(golfer.live_score)}
                      {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mid Tier Picks */}
        <div>
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">
            {bucketLabels.mid} (Pick 3)
          </h2>
          <div className="space-y-2">
            {entrant.team.mid.map((golferId) => {
              const golfer = teamGolfers.find((g) => g?.id === golferId);
              if (!golfer) return null;
              
              const isBestFour = bestFourIds.has(golfer.id);
              
              return (
                <div key={golfer.id} className={`card p-3 ${isBestFour ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{golfer.name}</p>
                        {isBestFour && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            TOP 4
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">
                        Rank #{golfer.world_rank}
                        {golfer.status === 'cut' && ' • CUT'}
                        {golfer.thru_hole !== null && ` • ${golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole}`}`}
                      </p>
                    </div>
                    <p className={`text-lg font-bold tabular-nums ${
                      (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                      (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                    }`}>
                      {formatScore(golfer.live_score)}
                      {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wildcard Picks */}
        <div>
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">
            {bucketLabels.wildcard} (Pick 2)
          </h2>
          <div className="space-y-2">
            {entrant.team.wildcard.map((golferId) => {
              const golfer = teamGolfers.find((g) => g?.id === golferId);
              if (!golfer) return null;
              
              const isBestFour = bestFourIds.has(golfer.id);
              
              return (
                <div key={golfer.id} className={`card p-3 ${isBestFour ? 'ring-2 ring-emerald-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{golfer.name}</p>
                        {isBestFour && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                            TOP 4
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">
                        Rank #{golfer.world_rank}
                        {golfer.status === 'cut' && ' • CUT'}
                        {golfer.thru_hole !== null && ` • ${golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole}`}`}
                      </p>
                    </div>
                    <p className={`text-lg font-bold tabular-nums ${
                      (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                      (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                    }`}>
                      {formatScore(golfer.live_score)}
                      {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </MobileShell>
  );
}
