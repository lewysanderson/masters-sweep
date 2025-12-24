'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { dummyGame } from '@/lib/dummy-data';

export default function JoinGamePage() {
  const router = useRouter();
  const [entryCode, setEntryCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate game lookup
    if (entryCode.toUpperCase() === dummyGame.entry_code) {
      alert(`Successfully joined ${dummyGame.name}!`);
      router.push('/dashboard');
    } else {
      setError('Invalid entry code. Please check and try again.');
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Join a Game</h1>

        <form onSubmit={handleSubmit} className="card">
          <div className="mb-6">
            <label className="label">Enter 6-Character Game Code</label>
            <input
              type="text"
              value={entryCode}
              onChange={(e) => setEntryCode(e.target.value.toUpperCase())}
              className="input text-center text-2xl tracking-widest"
              maxLength={6}
              placeholder="XXXXXX"
              required
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Tip:</strong> Ask the game admin for the entry code.
              For demo purposes, try: <span className="font-mono font-bold">{dummyGame.entry_code}</span>
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
              Join Game
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
