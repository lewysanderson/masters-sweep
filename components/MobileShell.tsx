'use client';

import BottomNav from './BottomNav';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 max-w-lg mx-auto relative">
      <main className="pb-20 page-enter">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
