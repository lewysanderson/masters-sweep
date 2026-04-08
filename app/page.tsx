'use client';

import { useLiveScores, useLiveLeaderboard, formatLastUpdated } from '@/lib/hooks/use-live-scores';
import { TOURNAMENT_CONFIG, getTotalPot, getPrizes, ENTRANTS } from '@/lib/entrants-config';
import MobileShell from '@/components/MobileShell';
import Link from 'next/link';
import { Trophy, Users, Clock, Coins } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HomePage() {
  const { data: scoresData, isLoading, isValidating } = useLiveScores();
  const { data: leaderboardData } = useLiveLeaderboard();
  
  const tournament = scoresData?.tournament;
  const isPre = !tournament || tournament.status === 'pre';
  const isLive = tournament?.status === 'in';
  const isPost = tournament?.status === 'post';
  
  const prizes = getPrizes();
  const totalPot = getTotalPot();
  
  return (
    <MobileShell>
      {/* Premium Header */}
      <div className="gold-accent bg-gradient-to-b from-[var(--masters-green)] to-[var(--masters-green-dark)] text-white px-6 pt-12 pb-8 mb-6">
        <div className="text-center">
          <div className="mb-3">
            <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
              Golf Sweep 2026
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2 tracking-tight">
            The Masters
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-white/80">
            <span>April 9-12</span>
            <span>•</span>
            <span>Augusta National</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6 pb-6">

        {/* Pre-tournament: Countdown */}
        {isPre && (
          <div className="card-elevated text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--masters-green-lighter)] mb-2">
              <Clock className="w-8 h-8 text-[var(--masters-green)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">Tournament Begins</h2>
              <p className="text-4xl font-serif font-bold text-[var(--masters-green)]">
                {formatDistanceToNow(new Date(TOURNAMENT_CONFIG.startDate), { addSuffix: false })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-5 border-t-2 border-stone-100">
              <div>
                <p className="text-3xl font-serif font-bold text-[var(--masters-green)]">{ENTRANTS.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mt-1">Entrants</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-[var(--masters-gold)]">£{totalPot}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 mt-1">Prize Pool</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Indicator */}
        {isLive && scoresData && (
          <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-4 rounded-lg shadow-premium">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-bold uppercase tracking-wider text-sm">Live Coverage</span>
            </div>
            <div className="text-right">
              <span className="text-xs opacity-90 block">
                {scoresData.timestamp && formatLastUpdated(scoresData.timestamp)}
              </span>
              {isValidating && <span className="text-[10px] opacity-75">Updating...</span>}
            </div>
          </div>
        )}

        {/* Top 3 Sweep Leaders */}
        {leaderboardData && leaderboardData.leaderboard.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-stone-900">Sweep Leaderboard</h2>
              <Link href="/leaderboard" className="text-xs font-bold text-[var(--masters-green)] uppercase tracking-wider hover:text-[var(--masters-green-dark)]">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {leaderboardData.leaderboard.slice(0, 3).map((entry, idx) => (
                <div key={entry.entrant.id} className={`card card-hover flex items-center justify-between ${idx === 0 ? 'border-2 border-[var(--masters-gold)]' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                      idx === 0 ? 'bg-[var(--masters-gold)] text-white' : 
                      idx === 1 ? 'bg-stone-300 text-stone-700' : 
                      'bg-amber-700 text-white'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{entry.entrant.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {entry.best_four_golfers.map(g => g.name.split(' ').pop()).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold tabular-nums ${entry.total_score <= 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {entry.total_score > 0 ? '+' : ''}{entry.total_score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tournament Leaders */}
        {isLive && scoresData?.golfers && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Tournament Leaders</h2>
            <div className="space-y-2">
              {scoresData.golfers
                .filter(g => g.live_score !== null)
                .sort((a, b) => (a.live_score || 0) - (b.live_score || 0))
                .slice(0, 5)
                .map((golfer) => (
                  <div key={golfer.id} className="card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {golfer.on_course && (
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      )}
                      <div>
                        <p className="font-semibold text-sm">{golfer.name}</p>
                        <p className="text-xs text-stone-500">
                          {golfer.thru_hole === 18 ? 'F' : `Thru ${golfer.thru_hole || '-'}`}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-lg ${
                      (golfer.live_score || 0) < 0 ? 'text-red-600' : 
                      (golfer.live_score || 0) > 0 ? 'text-green-700' : 'text-stone-900'
                    }`}>
                      {golfer.live_score === 0 ? 'E' : 
                       (golfer.live_score || 0) > 0 ? `+${golfer.live_score}` : 
                       golfer.live_score}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Prize Breakdown */}
        <div className="card-elevated space-y-5 bg-gradient-to-br from-white to-[var(--masters-green-lighter)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--masters-gold)]">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-serif font-bold">Prize Fund</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-[var(--masters-gold)]">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">1st Place</span>
                <span className="text-sm text-stone-600">70% of pot</span>
              </div>
              <span className="text-3xl font-serif font-bold text-[var(--masters-gold)]">£{prizes.first}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">2nd Place</span>
                <span className="text-sm text-stone-600">20% of pot</span>
              </div>
              <span className="text-2xl font-serif font-bold text-stone-500">£{prizes.second}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200">
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">3rd Place</span>
                <span className="text-sm text-stone-600">10% of pot</span>
              </div>
              <span className="text-2xl font-serif font-bold text-amber-700">£{prizes.third}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/entrants" className="card card-hover text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--masters-green-lighter)] mb-3 group-hover:bg-[var(--masters-green)] transition-colors">
              <Users className="w-6 h-6 text-[var(--masters-green)] group-hover:text-white transition-colors" />
            </div>
            <p className="font-bold text-sm">View Entrants</p>
            <p className="text-xs text-stone-500 mt-1">{ENTRANTS.length} teams</p>
          </Link>
          <Link href="/rules" className="card card-hover text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--masters-gold-light)] mb-3 group-hover:bg-[var(--masters-gold)] transition-colors">
              <Trophy className="w-6 h-6 text-[var(--masters-gold)] group-hover:text-white transition-colors" />
            </div>
            <p className="font-bold text-sm">Rules</p>
            <p className="text-xs text-stone-500 mt-1">How to win</p>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-stone-400">Loading tournament data...</p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
