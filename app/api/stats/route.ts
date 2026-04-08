import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer, getTournamentInfo } from '@/lib/espn-api';
import { ENTRANTS } from '@/lib/entrants-config';
import { allGolfers } from '@/lib/dummy-data';
import { GolferStats } from '@/types/database';

export async function GET(request: Request) {
  try {
    const data = await scoreCache.getData();
    const tournamentInfo = getTournamentInfo(data);
    
    if (!tournamentInfo) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }
    
    // Build name -> ESPN map
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const espnByName = new Map<string, any>();
    competitors.forEach((comp) => {
      espnByName.set(comp.athlete.displayName.toLowerCase(), comp);
    });
    
    // Calculate pick statistics
    const pickCounts = new Map<number, number>();
    
    ENTRANTS.forEach(entrant => {
      [...entrant.team.top12, ...entrant.team.mid, ...entrant.team.wildcard].forEach(golferId => {
        pickCounts.set(golferId, (pickCounts.get(golferId) || 0) + 1);
      });
    });
    
    // Build golfer stats
    const golferStats: GolferStats[] = [];
    
    allGolfers.forEach(golfer => {
      const pickCount = pickCounts.get(golfer.id) || 0;
      if (pickCount === 0) return;
      
      // Try to get live score
      const nameLower = golfer.name.toLowerCase();
      const comp = espnByName.get(nameLower);
      const liveScore = comp ? 
        (comp.score === 'E' ? 0 : parseInt(comp.score?.replace('+', '') || '0', 10)) : 
        null;
      
      golferStats.push({
        golfer_id: golfer.id,
        golfer_name: golfer.name,
        pick_count: pickCount,
        pick_percentage: (pickCount / ENTRANTS.length) * 100,
        bucket: golfer.bucket,
        world_rank: golfer.world_rank,
        current_score: liveScore,
      });
    });
    
    golferStats.sort((a, b) => b.pick_count - a.pick_count);
    
    return NextResponse.json(
      {
        golfer_stats: golferStats,
        tournament_status: tournamentInfo.status,
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate stats' },
      { status: 500 }
    );
  }
}
