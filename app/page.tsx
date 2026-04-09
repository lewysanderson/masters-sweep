'use client';

import { useLiveScores, useLiveLeaderboard, formatLastUpdated } from '@/lib/hooks/use-live-scores';
import { TOURNAMENT_CONFIG, getTotalPot, getPrizes, ENTRANTS } from '@/lib/entrants-config';
import MobileShell from '@/components/MobileShell';
import Link from 'next/link';
import { Trophy, Users, Clock, ChevronRight, TrendingUp, Award, Star } from 'lucide-react';
import { formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { useFavourites } from '@/lib/hooks/use-favourites';
import { getEntrantById } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';

function formatScore(score: number): string {
  if (score === 0) return 'E';
  return score > 0 ? `+${score}` : `${score}`;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate);
  const now = new Date();
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const mins = differenceInMinutes(target, now) % 60;

  if (days < 0) return null;

  return (
    <div className="flex items-center justify-center gap-4">
      {[
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: mins, label: 'Mins' },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-white/50 mt-1.5 font-bold">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: scoresData, isLoading, isValidating } = useLiveScores();
  const { data: leaderboardData } = useLiveLeaderboard();
  const { favourites, loaded: favsLoaded } = useFavourites();
  
  const tournament = scoresData?.tournament;
  const isPre = !tournament || tournament.status === 'pre';
  const isLive = tournament?.status === 'in';
  const isPost = tournament?.status === 'post';
  
  const prizes = getPrizes();
  const totalPot = getTotalPot();

  // Build favourite entrant data
  const favouriteEntrants = favourites
    .map((id) => {
      const entrant = getEntrantById(id);
      if (!entrant) return null;
      const lbEntry = leaderboardData?.leaderboard?.find((e) => e.entrant.id === id);
      return { entrant, lbEntry };
    })
    .filter(Boolean) as Array<{ entrant: NonNullable<ReturnType<typeof getEntrantById>>; lbEntry: any }>;

  const getGolferName = (id: number): string => {
    const g = allGolfers.find((g) => g.id === id);
    return g ? g.name.split(' ').pop() || g.name : '?';
  };
  
  return (
    <MobileShell>
      {/* Header */}
      <div className="bg-[var(--masters-green)] text-white px-6 pt-10 pb-5 border-b border-[var(--masters-gold)]">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Golf Sweep 2026</p>
          <h1 className="text-2xl font-serif font-bold tracking-tight">
            The Masters
          </h1>
          <p className="text-[11px] text-white/50 mt-0.5">April 9-12 &middot; Augusta National</p>

          {/* Pre-tournament countdown */}
          {isPre && (
            <div className="mt-5">
              <Countdown targetDate={TOURNAMENT_CONFIG.startDate} />
            </div>
          )}

          {/* Live indicator */}
          {isLive && scoresData && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                Round {tournament?.current_round || 1}
              </span>
              <span className="text-[10px] text-white/35">
                {formatLastUpdated(scoresData.timestamp)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-5 pb-6">

        {/* My Team(s) - favourited entrants */}
        {favsLoaded && favouriteEntrants.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Star size={14} className="text-[var(--masters-gold)] fill-[var(--masters-gold)]" />
              <h2 className="text-lg font-serif font-bold text-stone-900">My Team</h2>
            </div>
            <div className="space-y-2">
              {favouriteEntrants.map(({ entrant, lbEntry }) => {
                const golferNames = [
                  ...entrant.team.top12,
                  ...entrant.team.mid,
                  ...entrant.team.wildcard,
                ].map(getGolferName);

                // Get live golfer data for score display
                const golferScores = [
                  ...entrant.team.top12,
                  ...entrant.team.mid,
                  ...entrant.team.wildcard,
                ].map((gid) => {
                  const live = scoresData?.golfers?.find((g) => g.id === gid);
                  const dummy = allGolfers.find((g) => g.id === gid);
                  return {
                    name: live?.name || dummy?.name || '?',
                    shortName: (live?.name || dummy?.name || '?').split(' ').pop() || '?',
                    score: live?.live_score ?? null,
                    thru: live?.thru_hole ?? null,
                    onCourse: live?.on_course || false,
                    isBestFour: lbEntry?.best_four_golfers?.some((bf: any) => bf.id === gid) || false,
                    bucket: dummy?.bucket || 'wildcard',
                  };
                });

                return (
                  <Link
                    key={entrant.id}
                    href={`/entrants/${entrant.id}`}
                    className="card card-hover !p-0 overflow-hidden border-[var(--masters-green)]/20"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--masters-green)]/[0.04] border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <Star size={12} className="text-[var(--masters-gold)] fill-[var(--masters-gold)]" />
                        <p className="font-bold text-sm text-stone-900">{entrant.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {lbEntry && !isPre && (
                          <>
                            <span className="text-[10px] font-bold text-stone-400">#{lbEntry.rank}</span>
                            <span className={`text-base font-bold tabular-nums ${
                              lbEntry.total_score < 0 ? 'text-red-600' :
                              lbEntry.total_score > 0 ? 'text-blue-600' : 'text-stone-600'
                            }`}>
                              {formatScore(lbEntry.total_score)}
                            </span>
                          </>
                        )}
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                    </div>

                    {/* Golfer grid */}
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-7 gap-1">
                        {golferScores.map((g, idx) => (
                          <div key={idx} className={`text-center py-1.5 rounded ${
                            g.isBestFour && !isPre ? 'bg-emerald-50' : 'bg-stone-50'
                          }`}>
                            <p className="text-[9px] font-semibold text-stone-500 truncate px-0.5">{g.shortName}</p>
                            <p className={`text-xs font-bold tabular-nums mt-0.5 ${
                              isPre ? 'text-stone-300' :
                              g.score === null ? 'text-stone-300' :
                              g.score < 0 ? 'text-red-600' :
                              g.score > 0 ? 'text-blue-600' : 'text-stone-500'
                            }`}>
                              {isPre ? '-' : g.score === null ? '-' : g.score === 0 ? 'E' : g.score > 0 ? `+${g.score}` : g.score}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Post-tournament banner */}
        {isPost && (
          <div className="bg-gradient-to-r from-[var(--masters-gold)] to-[var(--masters-gold-dark)] text-white px-5 py-4 rounded-xl shadow-gold text-center">
            <Award size={20} className="mx-auto mb-1" />
            <p className="font-bold uppercase tracking-wider text-sm">Tournament Complete</p>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card !p-4 text-center">
            <p className="text-2xl font-serif font-bold text-[var(--masters-green)]">{ENTRANTS.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">Entrants</p>
          </div>
          <div className="card !p-4 text-center">
            <p className="text-2xl font-serif font-bold text-[var(--masters-gold)]">&pound;{totalPot}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">Prize Pool</p>
          </div>
          <div className="card !p-4 text-center">
            <p className="text-2xl font-serif font-bold text-stone-600">7</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">Picks Each</p>
          </div>
        </div>

        {/* Prize breakdown */}
        <div className="card !p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Prize Split</h3>
          <div className="flex items-center gap-3">
            {[
              { pos: '1st', amount: prizes.first, color: 'bg-[var(--masters-gold)]' },
              { pos: '2nd', amount: prizes.second, color: 'bg-stone-300' },
              { pos: '3rd', amount: prizes.third, color: 'bg-amber-700' },
            ].map(({ pos, amount, color }) => (
              <div key={pos} className="flex-1 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <div>
                  <p className="text-xs font-bold text-stone-600">{pos}</p>
                  <p className="text-sm font-bold text-stone-900">&pound;{amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sweep leaderboard preview */}
        {(isLive || isPost) && leaderboardData && leaderboardData.leaderboard.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900">Sweep Leaders</h2>
              <Link href="/leaderboard" className="text-xs font-bold text-[var(--masters-green)] uppercase tracking-wider">
                View All <ChevronRight size={12} className="inline" />
              </Link>
            </div>
            <div className="space-y-2">
              {leaderboardData.leaderboard.slice(0, 5).map((entry, idx) => (
                <Link
                  key={entry.entrant.id}
                  href={`/entrants/${entry.entrant.id}`}
                  className={`card card-hover flex items-center gap-3 !p-3.5 ${
                    idx === 0 ? 'border-2 !border-[var(--masters-gold)]' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                    idx === 0 ? 'bg-[var(--masters-gold)] text-white' :
                    idx === 1 ? 'bg-stone-300 text-stone-700' :
                    idx === 2 ? 'bg-amber-700 text-white' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-stone-900 truncate">{entry.entrant.name}</p>
                    <p className="text-xs text-stone-400 truncate">
                      {entry.best_four_golfers.map(g => g.name.split(' ').pop()).join(', ')}
                    </p>
                  </div>
                  <span className={`text-lg font-bold tabular-nums ${
                    entry.total_score < 0 ? 'text-red-600' : entry.total_score > 0 ? 'text-blue-600' : 'text-stone-600'
                  }`}>
                    {formatScore(entry.total_score)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tournament leaders (live scores) */}
        {isLive && scoresData?.golfers && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-serif font-bold text-stone-900">Tournament Leaders</h2>
              <Link href="/players" className="text-xs font-bold text-[var(--masters-green)] uppercase tracking-wider">
                All Players <ChevronRight size={12} className="inline" />
              </Link>
            </div>
            <div className="card !p-0 overflow-hidden divide-y divide-stone-100">
              {[...scoresData.golfers]
                .filter(g => g.live_score !== null)
                .sort((a, b) => (a.live_score ?? 0) - (b.live_score ?? 0))
                .slice(0, 5)
                .map((golfer, idx) => (
                  <div key={golfer.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-5 text-xs font-bold text-stone-400 text-right">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{golfer.name}</p>
                      <p className="text-xs text-stone-400">
                        {golfer.thru_hole === 18 ? 'F' : golfer.thru_hole ? `Thru ${golfer.thru_hole}` : '-'}
                      </p>
                    </div>
                    <span className={`font-bold tabular-nums ${
                      (golfer.live_score ?? 0) < 0 ? 'text-red-600' :
                      (golfer.live_score ?? 0) > 0 ? 'text-blue-600' : 'text-stone-600'
                    }`}>
                      {golfer.live_score === 0 ? 'E' : golfer.live_score !== null ? (golfer.live_score > 0 ? `+${golfer.live_score}` : golfer.live_score) : '-'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/entrants" className="card card-hover !p-4 text-center">
            <Users size={20} className="mx-auto mb-2 text-[var(--masters-green)]" />
            <p className="text-sm font-bold text-stone-700">Find My Team</p>
            <p className="text-xs text-stone-400 mt-0.5">View all selections</p>
          </Link>
          <Link href="/stats" className="card card-hover !p-4 text-center">
            <TrendingUp size={20} className="mx-auto mb-2 text-[var(--masters-green)]" />
            <p className="text-sm font-bold text-stone-700">Pick Analysis</p>
            <p className="text-xs text-stone-400 mt-0.5">See popular picks</p>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
