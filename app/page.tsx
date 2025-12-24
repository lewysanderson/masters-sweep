import Link from 'next/link';
import { Trophy, Users, Target, DollarSign } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-masters-green to-masters-green-dark">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            The April Major
          </h1>
          <p className="text-xl text-stone-100 mb-8">
            Masters Golf Sweepstake - Pick Your Dream Team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/games/create" className="btn-primary bg-white text-masters-green hover:bg-stone-100">
              Create a Game
            </Link>
            <Link href="/games/join" className="btn-primary border-2 border-white bg-transparent hover:bg-white/10">
              Join a Game
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="card bg-white/95">
            <div className="flex justify-center mb-4">
              <Trophy className="w-12 h-12 text-masters-green" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Pick 7 Golfers</h3>
            <p className="text-sm text-stone-600 text-center">
              Select your team following the bucket rules: 2 from Top 10, 3 from 11-50, 2 from the Field
            </p>
          </div>

          <div className="card bg-white/95">
            <div className="flex justify-center mb-4">
              <Target className="w-12 h-12 text-masters-green" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Best 4 Win</h3>
            <p className="text-sm text-stone-600 text-center">
              Your score is the combined total of your best 4 golfers. Lowest score wins!
            </p>
          </div>

          <div className="card bg-white/95">
            <div className="flex justify-center mb-4">
              <Users className="w-12 h-12 text-masters-green" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Play with Friends</h3>
            <p className="text-sm text-stone-600 text-center">
              Create private games, invite friends with a code, and compete on your own leaderboard
            </p>
          </div>

          <div className="card bg-white/95">
            <div className="flex justify-center mb-4">
              <DollarSign className="w-12 h-12 text-masters-green" />
            </div>
            <h3 className="text-lg font-bold text-center mb-2">Easy Entry Fees</h3>
            <p className="text-sm text-stone-600 text-center">
              Set custom entry fees and payment methods. Admin verifies payments manually
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="card inline-block max-w-2xl bg-white/95">
            <h2 className="text-2xl font-bold mb-4 text-masters-green">How It Works</h2>
            <ol className="text-left space-y-3">
              <li className="flex gap-3">
                <span className="font-bold text-masters-green">1.</span>
                <span>Create or join a game using a 6-character entry code</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-masters-green">2.</span>
                <span>Select 7 golfers following the bucket requirements</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-masters-green">3.</span>
                <span>Mark yourself as paid (admin will verify)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-masters-green">4.</span>
                <span>Watch the tournament and track the live leaderboard</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-masters-green">5.</span>
                <span>Winner takes all based on best 4 golfers' combined score!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
