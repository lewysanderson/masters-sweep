'use client';

import MobileShell from '@/components/MobileShell';
import { ENTRANTS, getPrizes, getTotalPot, TOURNAMENT_CONFIG } from '@/lib/entrants-config';

export default function RulesPage() {
  const prizes = getPrizes();
  const totalPot = getTotalPot();

  return (
    <MobileShell>
      {/* Header */}
      <div className="bg-[var(--masters-green)] px-6 pt-10 pb-4 border-b border-[var(--masters-gold)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">How It Works</p>
        <h1 className="text-xl font-serif font-bold text-white">Rules</h1>
      </div>

      <div className="px-5 pt-4 space-y-4 pb-6">
        {/* Entry */}
        <div className="card !p-4">
          <h2 className="text-sm font-bold text-[var(--masters-green)] uppercase tracking-wider mb-3">Entry</h2>
          <ul className="space-y-2 text-sm text-stone-700">
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">1.</span>
              Entry fee is <strong>&pound;{TOURNAMENT_CONFIG.entry_fee}</strong> per person
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">2.</span>
              {ENTRANTS.length} entrants = <strong>&pound;{totalPot}</strong> total prize pool
            </li>
          </ul>
        </div>

        {/* Team Selection */}
        <div className="card !p-4">
          <h2 className="text-sm font-bold text-[var(--masters-green)] uppercase tracking-wider mb-3">Team Selection</h2>
          <p className="text-sm text-stone-600 mb-3">Each entrant selects <strong>7 golfers</strong> from three tiers:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <div>
                <p className="font-bold text-sm text-amber-800">Top 12</p>
                <p className="text-xs text-amber-600">World ranked 1-12</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <div>
                <p className="font-bold text-sm text-blue-800">Mid Tier</p>
                <p className="text-xs text-blue-600">World ranked 13-50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <div>
                <p className="font-bold text-sm text-purple-800">Wildcard</p>
                <p className="text-xs text-purple-600">World ranked 51+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="card !p-4">
          <h2 className="text-sm font-bold text-[var(--masters-green)] uppercase tracking-wider mb-3">Scoring</h2>
          <ul className="space-y-2 text-sm text-stone-700">
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">1.</span>
              Your <strong>best 4 scores</strong> out of 7 golfers count
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">2.</span>
              Scores are cumulative over all 4 rounds (total to par)
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">3.</span>
              If a golfer <strong>misses the cut</strong>, their score is <strong>doubled</strong> as a penalty
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--masters-gold)] font-bold">4.</span>
              <strong>Lowest combined score wins</strong>
            </li>
          </ul>
        </div>

        {/* Example */}
        <div className="card !p-4 bg-stone-50">
          <h2 className="text-sm font-bold text-stone-600 uppercase tracking-wider mb-3">Example</h2>
          <div className="text-sm text-stone-600 space-y-1">
            <p>If your 7 golfers finish at: <strong>-8, -5, -3, -1, +2, +4, CUT(+6)</strong></p>
            <p className="text-xs text-stone-400 mt-2">Best 4 scores: -8, -5, -3, -1</p>
            <p className="font-bold text-[var(--masters-green)]">Total: -8 + -5 + -3 + -1 = <strong>-17</strong></p>
            <p className="text-xs text-stone-400 mt-1">The +2, +4, and CUT golfer are dropped</p>
          </div>
        </div>

        {/* Prizes */}
        <div className="card !p-4">
          <h2 className="text-sm font-bold text-[var(--masters-green)] uppercase tracking-wider mb-3">Prizes</h2>
          <div className="space-y-3">
            {[
              { pos: '1st Place', pct: '70%', amount: prizes.first, color: 'bg-[var(--masters-gold)]' },
              { pos: '2nd Place', pct: '20%', amount: prizes.second, color: 'bg-stone-400' },
              { pos: '3rd Place', pct: '10%', amount: prizes.third, color: 'bg-amber-700' },
            ].map(({ pos, pct, amount, color }) => (
              <div key={pos} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${color}`} />
                <span className="flex-1 text-sm font-semibold text-stone-700">{pos} ({pct})</span>
                <span className="text-lg font-bold text-stone-900">&pound;{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
