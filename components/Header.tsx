'use client';

import Link from 'next/link';
import { Trophy, LogOut } from 'lucide-react';
import { currentUser } from '@/lib/dummy-data';

export default function Header() {
  return (
    <header className="bg-masters-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <Trophy className="w-8 h-8" />
            <span className="text-xl font-bold">The April Major</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm">
              Welcome, <span className="font-semibold">{currentUser.display_name}</span>
            </span>
            <Link href="/" className="flex items-center gap-2 hover:bg-masters-green-dark px-3 py-2 rounded transition">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
