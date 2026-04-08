'use client';

import BottomNav from './BottomNav';

export default function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen premium-bg max-w-lg mx-auto relative shadow-2xl">
      <main className="pb-20 page-enter">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
