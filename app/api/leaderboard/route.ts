import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer, getTournamentInfo } from '@/lib/espn-api';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { LeaderboardEntry, Golfer, TournamentInfo } from '@/types/database';

export async function GET(request: Request) {
  try {
    const data = await scoreCache.getData();
    const tournamentInfo = getTournamentInfo(data);
    
    // Build a name -> ESPN competitor map
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const espnByName = new Map<string, any>();
    competitors.forEach((comp) => {
      espnByName.set(comp.athlete.displayName.toLowerCase(), comp);
    });
    
    // Build a map from our dummy ID -> Golfer with live data
    const golferMap = new Map<number, Golfer>();
    allGolfers.forEach((dummyGolfer) => {
      const nameLower = dummyGolfer.name.toLowerCase();
      let comp = espnByName.get(nameLower);
      
      if (!comp) {
        const lastName = dummyGolfer.name.split(' ').pop()?.toLowerCase() || '';
        for (const [espnName, espnComp] of espnByName) {
          if (espnName.endsWith(lastName) && espnName.includes(dummyGolfer.name.split(' ')[0].toLowerCase())) {
            comp = espnComp;
            break;
          }
        }
      }
      
      if (comp) {
        const mapped = mapESPNToGolfer(comp, dummyGolfer.bucket);
        golferMap.set(dummyGolfer.id, { ...mapped, id: dummyGolfer.id, bucket: dummyGolfer.bucket });
      } else {
        // Pre-tournament fallback - no live score
        golferMap.set(dummyGolfer.id, {
          ...dummyGolfer,
          live_score: null,
          thru_hole: null,
          today_score: null,
          round_scores: [],
          status: 'active' as const,
          on_course: false,
        });
      }
    });
    
    const isPre = !tournamentInfo || tournamentInfo.status === 'pre';
    
    // Build leaderboard
    const leaderboard: LeaderboardEntry[] = ENTRANTS.map((entrant) => {
      const allGolferIds = [
        ...entrant.team.top12,
        ...entrant.team.mid,
        ...entrant.team.wildcard,
      ];
      
      const entrantGolfers = allGolferIds
        .map((id) => golferMap.get(id))
        .filter((g): g is Golfer => g !== undefined);
      
      // Calculate best 4 scores
      const { total, bestFour } = calculateScore(entrantGolfers, isPre);
      
      return {
        entrant,
        total_score: total,
        best_four_golfers: bestFour,
        all_golfers: entrantGolfers,
        rank: 0,
      };
    });
    
    // Sort by total score and assign ranks
    leaderboard.sort((a, b) => a.total_score - b.total_score);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
      if (index === 0) entry.prize_position = 1;
      else if (index === 1) entry.prize_position = 2;
      else if (index === 2) entry.prize_position = 3;
    });
    
    return NextResponse.json(
      {
        leaderboard,
        tournament: tournamentInfo,
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

function calculateScore(golfers: Golfer[], isPre: boolean): { total: number; bestFour: Golfer[] } {
  if (isPre || golfers.length === 0) {
    return { total: 0, bestFour: golfers.slice(0, 4) };
  }
  
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
