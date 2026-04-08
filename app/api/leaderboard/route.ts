import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer } from '@/lib/espn-api';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { LeaderboardEntry, Golfer } from '@/types/database';

export async function GET(request: Request) {
  try {
    const data = await scoreCache.getData();
    
    // Map ESPN data to golfers
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const espnGolfersMap = new Map<number, Golfer>();
    
    competitors.forEach((comp) => {
      const existingGolfer = allGolfers.find(
        (g) => g.name === comp.athlete.displayName || g.name.includes(comp.athlete.displayName)
      );
      if (existingGolfer) {
        const updatedGolfer = mapESPNToGolfer(comp, existingGolfer.bucket);
        espnGolfersMap.set(existingGolfer.id, updatedGolfer);
      }
    });
    
    // Build leaderboard
    const leaderboard: LeaderboardEntry[] = ENTRANTS.map((entrant) => {
      const allGolferIds = [
        ...entrant.team.top12,
        ...entrant.team.mid,
        ...entrant.team.wildcard,
      ];
      
      // Get golfers with live scores only (no dummy data fallback)
      const entrantGolfers = allGolferIds
        .map((id) => espnGolfersMap.get(id))
        .filter((g): g is Golfer => g !== null && g !== undefined);
      
      // Calculate best 4 scores
      const { total, bestFour } = calculateScore(entrantGolfers);
      
      return {
        entrant,
        total_score: total,
        best_four_golfers: bestFour,
        all_golfers: entrantGolfers,
        rank: 0, // Will be assigned after sorting
      };
    });
    
    // Sort by total score and assign ranks
    leaderboard.sort((a, b) => a.total_score - b.total_score);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
      
      // Assign prize positions
      if (index === 0) entry.prize_position = 1;
      else if (index === 1) entry.prize_position = 2;
      else if (index === 2) entry.prize_position = 3;
    });
    
    return NextResponse.json(
      {
        leaderboard,
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to build leaderboard' },
      { status: 500 }
    );
  }
}

// Calculate best 4 scores (same logic as dummy-data.ts)
function calculateScore(golfers: Golfer[]): { total: number; bestFour: Golfer[] } {
  const scored = golfers.map((g) => ({
    golfer: g,
    effectiveScore: g.status === 'cut' ? (g.live_score ?? 0) * 2 : (g.live_score ?? 0),
  }));
  
  scored.sort((a, b) => a.effectiveScore - b.effectiveScore);
  const bestFour = scored.slice(0, 4);
  
  return {
    total: bestFour.reduce((sum, s) => sum + s.effectiveScore, 0),
    bestFour: bestFour.map((s) => s.golfer),
  };
}
