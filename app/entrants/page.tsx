'use client';

import { useState } from 'react';
import MobileShell from '@/components/MobileShell';
import { ENTRANTS } from '@/lib/entrants-config';
import { Search, Users } from 'lucide-react';
import Link from 'next/link';

export default function EntrantsPage() {
  const [search, setSearch] = useState('');
  
  const filtered = ENTRANTS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <MobileShell>
      <div className="gold-accent bg-gradient-to-b from-[var(--masters-green)] to-[var(--masters-green-dark)] px-6 pt-14 pb-8 mb-6">
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm text-white/90">
          Competitors
        </div>
        <h1 className="text-3xl font-serif font-bold text-white">Entrants</h1>
        <p className="text-white/70 text-sm mt-2">{ENTRANTS.length} Teams Competing</p>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search entrants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Entrants Grid */}
        <div className="grid gap-3">
          {filtered.map((entrant) => {
            const totalPicks = entrant.team.top12.length + entrant.team.mid.length + entrant.team.wildcard.length;
            
            return (
              <Link href={`/entrants/${entrant.id}`} key={entrant.id}>
                <div className="card card-hover p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-stone-900">{entrant.name}</h3>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--masters-green-lighter)]">
                      <Users className="w-5 h-5 text-[var(--masters-green)]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="font-semibold text-stone-700">{entrant.team.top12.length} Top 12</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span className="font-semibold text-stone-700">{entrant.team.mid.length} Mid</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                      <span className="font-semibold text-stone-700">{entrant.team.wildcard.length} Wild</span>
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-stone-100">
                    <p className="text-xs font-bold text-[var(--masters-green)] uppercase tracking-wider">
                      View Team →
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-stone-400">No entrants found</p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </MobileShell>
  );
}
