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
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-[var(--masters-green)] mb-2">
            {TOURNAMENT_CONFIG.name}
          </h1>
          <p className="text-stone-500 text-sm">
            April 9-12, 2026 • Augusta National
          </p>
        </div>

        {/* Pre-tournament: Countdown */}
        {isPre && (
          <div className="card p-6 text-center space-y-4">
            <Clock className="w-12 h-12 mx-auto text-[var(--masters-green)]" />
            <div>
              <h2 className="text-xl font-bold mb-2">Tournament Starts In</h2>
              <p className="text-3xl font-bold text-[var(--masters-green)]">
                {formatDistanceToNow(new Date(TOURNAMENT_CONFIG.startDate), { addSuffix: false })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-2xl font-bold">{ENTRANTS.length}</p>
                <p className="text-sm text-stone-500">Entrants</p>
              </div>
              <div>
                <p className="text-2xl font-bold">£{totalPot}</p>
                <p className="text-sm text-stone-500">Total Pot</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Indicator */}
        {isLive && scoresData && (
          <div className="flex items-center justify-between bg-[var(--masters-green)] text-white px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-semibold">LIVE</span>
            </div>
            <span className="text-sm opacity-90">
              {scoresData.timestamp && `Updated ${formatLastUpdated(scoresData.timestamp)}`}
            </span>
            {isValidating && <span className="text-xs opacity-75">Updating...</span>}
          </div>
        )}

        {/* Top 3 Sweep Leaders */}
        {leaderboardData && leaderboardData.leaderboard.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Sweep Leaderboard</h2>
              <Link href="/leaderboard" className="text-sm text-[var(--masters-green)] font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-2">
              {leaderboardData.leaderboard.slice(0, 3).map((entry, idx) => (
                <div key={entry.entrant.id} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl ${idx === 0 ? 'text-[var(--masters-gold)]' : idx === 1 ? 'text-stone-400' : 'text-amber-700'}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </div>
                    <div>
                      <p className="font-semibold">{entry.entrant.name}</p>
                      <p className="text-xs text-stone-500">
                        Best 4: {entry.best_four_golfers.map(g => g.name.split(' ').pop()).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold score-badge under-par">
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
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-[var(--masters-gold)]" />
            <h2 className="text-lg font-bold">Prize Breakdown</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥇 First Place (70%)</span>
              <span className="text-xl font-bold text-[var(--masters-gold)]">£{prizes.first}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥈 Second Place (20%)</span>
              <span className="text-lg font-bold text-stone-400">£{prizes.second}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥉 Third Place (10%)</span>
              <span className="text-lg font-bold text-amber-700">£{prizes.third}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/entrants" className="card p-4 text-center hover:shadow-md transition-shadow">
            <Users className="w-8 h-8 mx-auto mb-2 text-[var(--masters-green)]" />
            <p className="font-semibold">View Entrants</p>
            <p className="text-xs text-stone-500">{ENTRANTS.length} teams</p>
          </Link>
          <Link href="/rules" className="card p-4 text-center hover:shadow-md transition-shadow">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[var(--masters-green)]" />
            <p className="font-semibold">Rules</p>
            <p className="text-xs text-stone-500">How to win</p>
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
