import Header from '@/components/Header';
import { dummyParticipants, currentUser, dummyGame } from '@/lib/dummy-data';
import { generateLeaderboard, formatScore, getScoreColor } from '@/lib/utils';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function LeaderboardPage() {
  const leaderboard = generateLeaderboard(dummyParticipants);
  const totalPrize = dummyGame.entry_fee * dummyParticipants.filter(p => p.payment_status === 'verified').length;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-stone-600">{dummyGame.name}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <Trophy className="w-8 h-8 text-masters-green mx-auto mb-2" />
            <div className="text-3xl font-bold text-masters-green">${totalPrize}</div>
            <div className="text-sm text-stone-600">Total Prize Pool</div>
          </div>
          <div className="card text-center">
            <Medal className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl font-bold">{dummyParticipants.length}</div>
            <div className="text-sm text-stone-600">Total Participants</div>
          </div>
          <div className="card text-center">
            <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-3xl font-bold">
              {leaderboard.length > 0 ? leaderboard[0].participant.user?.display_name : '-'}
            </div>
            <div className="text-sm text-stone-600">Current Leader</div>
          </div>
        </div>

        <div className="space-y-4">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.participant.user_id === currentUser.id;
            const isWinner = entry.rank === 1;

            return (
              <div
                key={entry.participant.id}
                className={`card ${isCurrentUser ? 'ring-2 ring-masters-green' : ''} ${
                  isWinner ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    {entry.rank === 1 && (
                      <Crown className="w-10 h-10 text-yellow-500" />
                    )}
                    {entry.rank === 2 && (
                      <Medal className="w-9 h-9 text-gray-400" />
                    )}
                    {entry.rank === 3 && (
                      <Medal className="w-8 h-8 text-amber-700" />
                    )}
                    {entry.rank > 3 && (
                      <span className="text-2xl font-bold text-stone-400">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">
                        {entry.participant.user?.display_name}
                      </h3>
                      {isCurrentUser && (
                        <span className="px-2 py-1 bg-masters-green text-white text-xs rounded">YOU</span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        entry.participant.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
                        entry.participant.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {entry.participant.payment_status === 'verified' ? '✓ Paid' :
                         entry.participant.payment_status === 'pending' ? 'Pending' : 'Unpaid'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.best_four_golfers.map((golfer) => (
                        <div
                          key={golfer.id}
                          className="px-3 py-1 bg-stone-100 rounded text-sm flex items-center gap-2"
                        >
                          <span className="font-medium">{golfer.name}</span>
                          <span className={`font-bold ${getScoreColor(golfer.live_score)}`}>
                            {formatScore(golfer.live_score)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-3xl font-bold ${getScoreColor(entry.total_score)}`}>
                      {formatScore(entry.total_score)}
                    </div>
                    <div className="text-xs text-stone-500">Total Score</div>
                  </div>
                </div>
              </div>
            );
          })}

          {dummyParticipants.filter(p => !p.selections || p.selections.length < 7).map((participant) => (
            <div key={participant.id} className="card bg-stone-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-stone-500">
                    {participant.user?.display_name}
                  </h3>
                  <p className="text-sm text-stone-400">No team selected yet</p>
                </div>
                <span className="px-3 py-1 bg-stone-300 text-stone-600 text-xs rounded font-medium">
                  INCOMPLETE
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 card bg-blue-50 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Scoring Rules</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your score is the combined total of your <strong>best 4 golfers</strong></li>
            <li>• Lower scores are better (e.g., -12 beats -8)</li>
            <li>• If a golfer misses the cut, they count with their current score</li>
            <li>• Leaderboard updates live during the tournament</li>
          </ul>
        </div>
      </main>
    </>
  );
}
