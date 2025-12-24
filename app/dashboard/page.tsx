import Link from 'next/link';
import Header from '@/components/Header';
import { dummyGame, dummyParticipants, currentUser } from '@/lib/dummy-data';
import { Users, DollarSign, Trophy, Settings } from 'lucide-react';

export default function DashboardPage() {
  const myParticipation = dummyParticipants.find(p => p.user_id === currentUser.id);
  const hasSelections = myParticipation?.selections && myParticipation.selections.length === 7;
  const isAdmin = dummyGame.admin_id === currentUser.id;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Games</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-masters-green">{dummyGame.name}</h2>
                <p className="text-sm text-stone-500">Entry Code: {dummyGame.entry_code}</p>
              </div>
              {isAdmin && (
                <span className="px-3 py-1 bg-masters-green text-white text-xs font-semibold rounded-full">
                  ADMIN
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-stone-600">
                <Users className="w-5 h-5" />
                <span>{dummyParticipants.length} participants</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <DollarSign className="w-5 h-5" />
                <span>Entry Fee: ${dummyGame.entry_fee}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">
                  Prize Pool: ${dummyGame.entry_fee * dummyParticipants.filter(p => p.payment_status === 'verified').length}
                </span>
              </div>
            </div>

            {myParticipation && (
              <div className="mb-4 p-3 bg-stone-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Payment Status:</span>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    myParticipation.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
                    myParticipation.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {myParticipation.payment_status.toUpperCase()}
                  </span>
                </div>
                {myParticipation.payment_status === 'unpaid' && (
                  <p className="text-xs text-stone-600 mt-2">
                    Mark as paid once you&apos;ve sent payment
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!hasSelections ? (
                <Link href="/games/select" className="btn-primary text-center">
                  Select Your Golfers
                </Link>
              ) : (
                <Link href="/games/select" className="btn-secondary text-center">
                  View/Edit Your Team
                </Link>
              )}
              <Link href="/games/leaderboard" className="btn-secondary text-center">
                View Leaderboard
              </Link>
              {isAdmin && (
                <Link href="/games/admin" className="btn-primary bg-stone-700 hover:bg-stone-800 text-center flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Settings
                </Link>
              )}
            </div>

            {dummyGame.payment_info && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Payment Info:</p>
                <p className="text-sm text-blue-800">{dummyGame.payment_info}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/games/create" className="block p-4 bg-stone-100 hover:bg-stone-200 rounded-lg transition">
                <h4 className="font-semibold">Create New Game</h4>
                <p className="text-sm text-stone-600">Start a new sweepstake with friends</p>
              </Link>
              <Link href="/games/join" className="block p-4 bg-stone-100 hover:bg-stone-200 rounded-lg transition">
                <h4 className="font-semibold">Join Another Game</h4>
                <p className="text-sm text-stone-600">Enter with a 6-character code</p>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-masters-green/10 border border-masters-green/20 rounded-lg">
              <h4 className="font-semibold text-masters-green mb-2">Game Status</h4>
              <p className="text-sm text-stone-700">
                {dummyGame.is_locked ? (
                  <span className="text-red-600 font-semibold">🔒 Locked - No more changes allowed</span>
                ) : (
                  <span className="text-green-600 font-semibold">✓ Open - You can still make changes</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
