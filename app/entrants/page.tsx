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
      <div className="bg-gradient-to-br from-[var(--masters-green)] to-[var(--masters-green-dark)] px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-white">Entrants</h1>
        <p className="text-white/60 text-sm mt-1">{ENTRANTS.length} teams competing</p>
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
                <div className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{entrant.name}</h3>
                    <Users className="w-5 h-5 text-[var(--masters-green)]" />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {entrant.team.top12.length} Top 12
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {entrant.team.mid.length} Mid
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      {entrant.team.wildcard.length} Wildcard
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <p className="text-sm text-[var(--masters-green)] font-semibold">
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
