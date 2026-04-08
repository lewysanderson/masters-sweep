'use client';

import MobileShell from '@/components/MobileShell';
import { PRIZE_SPLIT, BUCKET_REQUIREMENTS } from '@/types/database';
import { getTotalPot, getPrizes, TOURNAMENT_CONFIG } from '@/lib/entrants-config';
import { Trophy, Users, Calculator, Award } from 'lucide-react';

export default function RulesPage() {
  const prizes = getPrizes();
  const totalPot = getTotalPot();
  
  return (
    <MobileShell>
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-white">Rules</h1>
        <p className="text-white/60 text-sm mt-1">How the sweep works</p>
      </div>

      <div className="px-5 pt-4 space-y-6">
        {/* Overview */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-[var(--masters-green)]" />
            <h2 className="text-lg font-bold">Overview</h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Pick a team of 7 golfers from The Masters field. Your score is the combined total of your 
            <strong> best 4 golfers</strong>. Lowest score wins!
          </p>
        </div>

        {/* Team Selection */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-[var(--masters-green)]" />
            <h2 className="text-lg font-bold">Team Selection</h2>
          </div>
          <p className="text-sm text-stone-600 mb-4">
            You must pick exactly 7 golfers following these rules:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {BUCKET_REQUIREMENTS.top12}
              </div>
              <div>
                <p className="font-semibold text-sm">Top 12</p>
                <p className="text-xs text-stone-500">World ranking 1-12</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {BUCKET_REQUIREMENTS.mid}
              </div>
              <div>
                <p className="font-semibold text-sm">Mid Tier</p>
                <p className="text-xs text-stone-500">World ranking 13-50</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {BUCKET_REQUIREMENTS.wildcard}
              </div>
              <div>
                <p className="font-semibold text-sm">Wildcards</p>
                <p className="text-xs text-stone-500">World ranking 51+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-[var(--masters-green)]" />
            <h2 className="text-lg font-bold">Scoring System</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Best 4 Count</h3>
              <p className="text-sm text-stone-600">
                Of your 7 golfers, only your <strong>best 4 scores</strong> count toward your total. 
                This means 3 golfers act as backups in case someone plays poorly or misses the cut.
              </p>
            </div>
            <div className="bg-stone-50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Example</h3>
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Golfer A: -8</span>
                  <span className="text-emerald-600 font-bold">✓ Counts</span>
                </div>
                <div className="flex justify-between">
                  <span>Golfer B: -5</span>
                  <span className="text-emerald-600 font-bold">✓ Counts</span>
                </div>
                <div className="flex justify-between">
                  <span>Golfer C: -3</span>
                  <span className="text-emerald-600 font-bold">✓ Counts</span>
                </div>
                <div className="flex justify-between">
                  <span>Golfer D: -2</span>
                  <span className="text-emerald-600 font-bold">✓ Counts</span>
                </div>
                <div className="flex justify-between opacity-50">
                  <span>Golfer E: +1</span>
                  <span>✗ Doesn&apos;t count</span>
                </div>
                <div className="flex justify-between opacity-50">
                  <span>Golfer F: +3</span>
                  <span>✗ Doesn&apos;t count</span>
                </div>
                <div className="flex justify-between opacity-50">
                  <span>Golfer G: +5</span>
                  <span>✗ Doesn&apos;t count</span>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between font-bold">
                  <span>Your Total:</span>
                  <span className="text-[var(--masters-green)]">-18</span>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2 text-red-900">⚠️ Cut Penalty</h3>
              <p className="text-sm text-red-800">
                If a golfer misses the cut, their score is <strong>doubled</strong> (×2). 
                Choose your wildcards wisely!
              </p>
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[var(--masters-green)]" />
            <h2 className="text-lg font-bold">Prize Breakdown</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥇 First Place ({PRIZE_SPLIT.first * 100}%)</span>
              <span className="text-xl font-bold text-[var(--masters-gold)]">£{prizes.first}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥈 Second Place ({PRIZE_SPLIT.second * 100}%)</span>
              <span className="text-lg font-bold text-stone-400">£{prizes.second}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">🥉 Third Place ({PRIZE_SPLIT.third * 100}%)</span>
              <span className="text-lg font-bold text-amber-700">£{prizes.third}</span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="font-semibold">Total Pot</span>
              <span className="text-xl font-bold">£{totalPot}</span>
            </div>
            <p className="text-xs text-stone-500 text-center pt-2">
              Entry fee: £{TOURNAMENT_CONFIG.entry_fee} per person
            </p>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </MobileShell>
  );
}
