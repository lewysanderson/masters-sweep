'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Trophy, UsersRound, BarChart3 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/entrants', label: 'Entrants', icon: UsersRound },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-2 border-stone-200 pb-[env(safe-area-inset-bottom)] shadow-2xl">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={active ? 'nav-item-active' : 'nav-item-inactive'}>
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px]">{label}</span>
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--masters-gold)] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
