'use client';

import MobileShell from '@/components/MobileShell';
import { getEntrantById, ENTRANTS } from '@/lib/entrants-config';
import { useLiveScores, useLiveLeaderboard } from '@/lib/hooks/use-live-scores';
import { allGolfers } from '@/lib/dummy-data';
import { ArrowLeft, Trophy, Circle, ChevronDown, ChevronUp, Star, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Golfer, GolferBucket } from '@/types/database';
import { useState } from 'react';
import { useFavourites } from '@/lib/hooks/use-favourites';

function formatScore(score: number | null): string {
  if (score === null) return '-';
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function scoreColor(score: number | null): string {
  if (score === null) return 'text-stone-400';
  if (score < 0) return 'text-red-600';
  if (score > 0) return 'text-blue-600';
  return 'text-stone-600';
}

const bucketConfig: Record<GolferBucket, { label: string; count: string; color: string; bg: string }> = {
  top12: { label: 'Top 12', count: 'Pick 2', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  mid: { label: 'Mid Tier (13-50)', count: 'Pick 3', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  wildcard: { label: 'Wildcard (51+)', count: 'Pick 2', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
};

function GolferCard({ golfer, isBestFour, isPre, currentRound }: {
  golfer: Golfer;
  isBestFour: boolean;
  isPre: boolean;
  currentRound: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasRoundScores = golfer.round_scores && golfer.round_scores.length > 0;
  const isCut = golfer.status === 'cut';
  const isWD = golfer.status === 'withdrawn';
  const effectiveScore = isCut ? (golfer.live_score ?? 0) * 2 : (golfer.live_score ?? 0);

  // How many entrants picked this golfer
  const pickCount = ENTRANTS.filter(e => {
    const allPicks = [...e.team.top12, ...e.team.mid, ...e.team.wildcard];
    return allPicks.includes(golfer.id);
  }).length;

  // Status text
  let statusText = 'Not started';
  if (!isPre && golfer.thru_hole !== null) {
    if (golfer.thru_hole === 18) {
      statusText = `R${currentRound} - F`;
    } else {
      statusText = `R${currentRound} - Thru ${golfer.thru_hole}`;
    }
  }
  if (isCut) statusText = 'CUT';
  if (isWD) statusText = 'WD';

  return (
    <div className={`rounded-lg border transition-all ${
      isCut ? 'border-red-200 bg-red-50/30' :
      isBestFour ? 'border-emerald-300 bg-emerald-50/50 shadow-sm' : 'border-stone-200 bg-white'
    } ${isCut || isWD ? 'opacity-70' : ''}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3"
      >
        {/* On course indicator */}
        <div className="flex-shrink-0 w-2">
          {!isPre && golfer.on_course && (
            <span className="block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Player info */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm truncate ${isCut || isWD ? 'line-through text-stone-400' : ''}`}>
              {golfer.name}
            </p>
            {isBestFour && !isCut && (
              <span className="flex-shrink-0 text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                BEST 4
              </span>
            )}
            {isCut && !isPre && (
              <span className="flex-shrink-0 text-[8px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                MISSED CUT
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{statusText}</p>
        </div>

        {/* Score */}
        <div className="text-right flex-shrink-0">
          {isCut && !isPre ? (
            <div>
              <p className="text-lg font-bold tabular-nums text-red-600">
                {formatScore(effectiveScore)}
              </p>
              <p className="text-[10px] text-stone-400 font-medium tabular-nums">
                <span className="line-through">{formatScore(golfer.live_score)}</span> &times;2
              </p>
            </div>
          ) : (
            <p className={`text-lg font-bold tabular-nums ${isPre ? 'text-stone-300' : scoreColor(golfer.live_score)}`}>
              {isPre ? '-' : formatScore(golfer.live_score)}
            </p>
          )}
        </div>

        {/* Expand arrow */}
        <div className="flex-shrink-0 text-stone-300">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Cut penalty banner */}
      {isCut && !isPre && (
        <div className="mx-4 mb-2 px-3 py-1.5 bg-red-100 rounded-md flex items-center gap-2">
          <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
          <p className="text-[10px] font-semibold text-red-700">
            Score doubled: {formatScore(golfer.live_score)} &rarr; {formatScore(effectiveScore)}
          </p>
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-3 pt-0 border-t border-stone-100 space-y-2">
          {/* Round scores */}
          {hasRoundScores && !isPre && (
            <div className="flex gap-1 mt-2">
              {golfer.round_scores?.map((score, idx) => (
                <div key={idx} className="flex-1 text-center bg-stone-50 rounded py-1.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">R{idx + 1}</p>
                  <p className={`text-sm font-bold tabular-nums ${score === 0 ? 'text-stone-500' : score < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {score === 0 ? 'E' : score > 0 ? `+${score}` : score}
                  </p>
                </div>
              ))}
              {/* Fill empty rounds */}
              {Array.from({ length: 4 - (golfer.round_scores?.length || 0) }).map((_, idx) => (
                <div key={`empty-${idx}`} className="flex-1 text-center bg-stone-50 rounded py-1.5">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">R{(golfer.round_scores?.length || 0) + idx + 1}</p>
                  <p className="text-sm font-bold tabular-nums text-stone-300">-</p>
                </div>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>World Rank #{golfer.world_rank}</span>
            {golfer.country && <span>{golfer.country}</span>}
            <span>Picked by {pickCount}/{ENTRANTS.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EntrantDetailPage({ params }: { params: { id: string } }) {
  const { data: scoresData, isLoading: scoresLoading } = useLiveScores();
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLiveLeaderboard();
  const { isFavourite, toggleFavourite } = useFavourites();
  
  const entrant = getEntrantById(params.id);
  
  if (!entrant) {
    return (
      <MobileShell>
        <div className="p-5 pt-16">
          <div className="card p-6 text-center">
            <p className="text-stone-600 font-semibold mb-2">Entrant not found</p>
            <Link href="/entrants" className="text-[var(--masters-green)] text-sm font-semibold hover:underline">
              Back to Entrants
            </Link>
          </div>
        </div>
      </MobileShell>
    );
  }

  const tournament = scoresData?.tournament;
  const isPre = !tournament || tournament.status === 'pre';
  const currentRound = tournament?.current_round || 1;

  // Find leaderboard entry
  const leaderboardEntry = leaderboardData?.leaderboard?.find(
    (e) => e?.entrant?.id === entrant.id
  );
  
  // Build golfer list from scores data (keyed by our dummy IDs)
  const golferMap = new Map<number, Golfer>();
  if (scoresData?.golfers) {
    scoresData.golfers.forEach((g) => golferMap.set(g.id, g));
  }
  
  // Get team golfers, fallback to dummy data for name/bucket
  const getGolfer = (dummyId: number): Golfer | null => {
    const live = golferMap.get(dummyId);
    if (live) return live;
    const dummy = allGolfers.find((g) => g.id === dummyId);
    if (dummy) return { ...dummy, live_score: null, thru_hole: null, today_score: null, round_scores: [], status: 'active', on_course: false };
    return null;
  };

  const bestFourIds = new Set(
    leaderboardEntry?.best_four_golfers?.map(g => g?.id).filter(Boolean) || []
  );

  const isLoading = scoresLoading || leaderboardLoading;

  return (
    <MobileShell>
      {/* Header */}
      <div className="bg-[var(--masters-green)] px-5 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <Link href="/entrants" className="text-white/50 text-[10px] font-bold flex items-center gap-1 mb-2 hover:text-white/80 uppercase tracking-[0.15em] transition-colors">
          <ArrowLeft size={12} />
          Entrants
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-serif font-bold text-white">{entrant.name}</h1>
          <button
            onClick={() => toggleFavourite(entrant.id)}
            className="p-1 rounded-full transition-colors"
            aria-label={isFavourite(entrant.id) ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Star
              size={18}
              className={isFavourite(entrant.id)
                ? 'text-[var(--masters-gold)] fill-[var(--masters-gold)]'
                : 'text-white/30 hover:text-white/60'
              }
            />
          </button>
        </div>
        
        {/* Score summary */}
        {!isPre && leaderboardEntry && (
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-2 text-white/90">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-xs font-bold">
                {leaderboardEntry.rank <= 3 ? (
                  <Trophy size={12} className="text-[var(--masters-gold)]" />
                ) : (
                  leaderboardEntry.rank
                )}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-white/40">Pos</p>
                <p className="text-sm font-bold">#{leaderboardEntry.rank}</p>
              </div>
            </div>
            <div className="text-white/90">
              <p className="text-[9px] uppercase tracking-wider text-white/40">Best 4</p>
              <p className="text-lg font-bold tabular-nums">{formatScore(leaderboardEntry.total_score)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && !scoresData && (
        <div className="px-5 pt-6">
          <div className="card p-8 text-center">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-stone-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-stone-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Team breakdown */}
      <div className="px-5 pt-5 space-y-5 pb-6">
        {(['top12', 'mid', 'wildcard'] as GolferBucket[]).map((bucket) => {
          const config = bucketConfig[bucket];
          const golferIds = entrant.team[bucket];
          
          return (
            <div key={bucket}>
              <div className={`flex items-center justify-between mb-2 px-1`}>
                <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {config.label}
                </h2>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  {config.count}
                </span>
              </div>
              <div className="space-y-2">
                {golferIds.map((golferId) => {
                  const golfer = getGolfer(golferId);
                  if (!golfer) return null;
                  
                  return (
                    <GolferCard
                      key={golfer.id}
                      golfer={golfer}
                      isBestFour={bestFourIds.has(golfer.id)}
                      isPre={isPre}
                      currentRound={currentRound}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Scoring summary */}
        {!isPre && leaderboardEntry && (
          <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-200">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Scoring Summary</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-stone-400">Best 4</p>
                <p className={`text-lg font-bold tabular-nums ${scoreColor(leaderboardEntry.total_score)}`}>
                  {formatScore(leaderboardEntry.total_score)}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400">Position</p>
                <p className="text-lg font-bold text-stone-700">#{leaderboardEntry.rank}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400">of</p>
                <p className="text-lg font-bold text-stone-700">{ENTRANTS.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
