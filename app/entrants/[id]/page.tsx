'use client';

import MobileShell from '@/components/MobileShell';
import { getEntrantById } from '@/lib/entrants-config';
import { useLiveScores, useLiveLeaderboard } from '@/lib/hooks/use-live-scores';
import { allGolfers } from '@/lib/dummy-data';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Golfer } from '@/types/database';

function formatScore(score: number | null): string {
  if (score === null) return 'E';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function getRoundStatus(golfer: any, currentRound: number, tournamentStarted: boolean): string {
  if (!tournamentStarted) return 'Not started';
  
  if (golfer.thru_hole === null) {
    return 'Not started';
  }
  
  if (golfer.thru_hole === 18) {
    return `Round ${currentRound} - F`;
  }
  
  return `Round ${currentRound} - Thru ${golfer.thru_hole}`;
}

const bucketLabels = {
  top12: 'Top 12',
  mid: 'Mid Tier (13-50)',
  wildcard: 'Wildcard (51+)',
};

export default function EntrantDetailPage({ params }: { params: { id: string } }) {
  // ALWAYS call hooks first before any conditional returns
  const { data: scoresData } = useLiveScores();
  const { data: leaderboardData } = useLiveLeaderboard();
  
  // Check tournament status
  const tournamentStatus = scoresData?.tournament?.status || 'pre';
  const tournamentStarted = tournamentStatus === 'in' || tournamentStatus === 'post';
  
  // THEN do data lookups
  const entrant = getEntrantById(params.id);
  
  // Handle entrant not found
  if (!entrant) {
    return (
      <MobileShell>
        <div className="p-5">
          <div className="card p-6 text-center">
            <p className="text-stone-600 font-semibold mb-2">Entrant not found</p>
            <Link href="/entrants" className="text-[var(--masters-green)] text-sm font-semibold hover:underline">
              ← Back to Entrants
            </Link>
          </div>
        </div>
      </MobileShell>
    );
  }
  
  // Find entrant's position in leaderboard
  const leaderboardEntry = leaderboardData?.leaderboard?.find(
    (e) => e?.entrant?.id === entrant.id
  );
  
  // Get all golfer IDs for this entrant
  const allGolferIds = [
    ...entrant.team.top12,
    ...entrant.team.mid,
    ...entrant.team.wildcard,
  ];
  
  // Map dummy IDs to golfers with live scores
  const teamGolfers = allGolferIds.map((dummyId) => {
    // Get golfer info from dummy data (for name and bucket)
    const dummyGolfer = allGolfers.find((g) => g.id === dummyId);
    if (!dummyGolfer) return null;
    
    // Try to find live data by matching name
    const liveGolfer = scoresData?.golfers?.find(
      (g) => g.name === dummyGolfer.name || g.name.includes(dummyGolfer.name)
    );
    
    // If we have live data, use it; otherwise create a pre-tournament golfer object
    if (liveGolfer) {
      return liveGolfer;
    }
    
    // Pre-tournament: create golfer with E score
    return {
      id: dummyGolfer.id,
      name: dummyGolfer.name,
      world_rank: dummyGolfer.world_rank,
      bucket: dummyGolfer.bucket,
      live_score: 0,
      thru_hole: null,
      today_score: 0,
      status: 'active' as const,
    } as Golfer;
  }).filter((g): g is NonNullable<typeof g> => g !== null);
  
  // Determine best 4 (with defensive checks)
  const bestFourIds = new Set(
    leaderboardEntry?.best_four_golfers?.map(g => g?.id).filter(Boolean) || []
  );
  
  // Check if we have team data
  if (teamGolfers.length === 0) {
    return (
      <MobileShell>
        <div className="p-5">
          <div className="card p-6 text-center">
            <p className="text-stone-600 font-semibold mb-2">Error loading team data</p>
            <p className="text-sm text-stone-500 mb-4">Unable to find golfers for this team</p>
            <Link href="/entrants" className="text-[var(--masters-green)] text-sm font-semibold hover:underline">
              ← Back to Entrants
            </Link>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <div className="gold-accent bg-gradient-to-b from-[var(--masters-green)] to-[var(--masters-green-dark)] px-6 pt-14 pb-8 mb-6">
        <Link href="/entrants" className="text-white/80 text-xs font-semibold flex items-center gap-2 mb-4 hover:text-white uppercase tracking-wider">
          <ArrowLeft size={14} />
          Back to Entrants
        </Link>
        <h1 className="text-3xl font-serif font-bold text-white">{entrant.name}</h1>
        {tournamentStarted && leaderboardEntry && leaderboardEntry.rank && leaderboardEntry.total_score !== undefined && (
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2 text-white/90">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                <Trophy size={14} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/60">Position</p>
                <p className="text-lg font-bold">#{leaderboardEntry.rank}</p>
              </div>
            </div>
            <div className="text-white/90">
              <p className="text-[10px] uppercase tracking-wider text-white/60">Score</p>
              <p className="text-2xl font-bold tabular-nums">{formatScore(leaderboardEntry.total_score)}</p>
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
              const golfer = teamGolfers.find((g) => g.id === golferId);
              if (!golfer) {
                console.error(`Golfer with ID ${golferId} not found`);
                return null;
              }
              
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
                        {getRoundStatus(golfer, scoresData?.tournament?.current_round || 1, tournamentStarted)}
                        {golfer.status === 'cut' && ' • CUT'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold tabular-nums ${
                        (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                        (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                      }`}>
                        {formatScore(golfer.live_score)}
                        {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                      </p>
                    </div>
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
              const golfer = teamGolfers.find((g) => g.id === golferId);
              if (!golfer) {
                console.error(`Golfer with ID ${golferId} not found`);
                return null;
              }
              
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
                        {getRoundStatus(golfer, scoresData?.tournament?.current_round || 1, tournamentStarted)}
                        {golfer.status === 'cut' && ' • CUT'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold tabular-nums ${
                        (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                        (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                      }`}>
                        {formatScore(golfer.live_score)}
                        {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                      </p>
                    </div>
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
              const golfer = teamGolfers.find((g) => g.id === golferId);
              if (!golfer) {
                console.error(`Golfer with ID ${golferId} not found`);
                return null;
              }
              
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
                        {getRoundStatus(golfer, scoresData?.tournament?.current_round || 1, tournamentStarted)}
                        {golfer.status === 'cut' && ' • CUT'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold tabular-nums ${
                        (golfer.live_score ?? 0) < 0 ? 'text-red-600' : 
                        (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                      }`}>
                        {formatScore(golfer.live_score)}
                        {golfer.status === 'cut' && <span className="text-xs ml-1">×2</span>}
                      </p>
                    </div>
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
