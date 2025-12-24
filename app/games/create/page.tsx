'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { generateEntryCode } from '@/lib/utils';

export default function CreateGamePage() {
  const router = useRouter();
  const [gameName, setGameName] = useState('The April Major 2025');
  const [entryFee, setEntryFee] = useState(20);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [entryCode] = useState(generateEntryCode());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would create the game in Supabase
    alert(`Game created! Entry Code: ${entryCode}`);
    router.push('/dashboard');
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create New Game</h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="label">Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="input"
              required
            />
          </div>

          <div className="mb-6">
            <label className="label">Entry Fee ($)</label>
            <input
              type="number"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
              className="input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-6">
            <label className="label">Payment Instructions</label>
            <textarea
              value={paymentInfo}
              onChange={(e) => setPaymentInfo(e.target.value)}
              className="input"
              rows={3}
              placeholder="e.g., Venmo: @YourUsername or Cash App: $YourUsername"
            />
            <p className="text-xs text-stone-500 mt-1">
              Tell participants how to send payment
            </p>
          </div>

          <div className="mb-6 p-4 bg-masters-green/10 border border-masters-green/20 rounded-lg">
            <label className="label">Your Entry Code</label>
            <div className="text-3xl font-bold text-masters-green text-center py-4">
              {entryCode}
            </div>
            <p className="text-sm text-stone-600 text-center">
              Share this code with participants to join your game
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Game
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
