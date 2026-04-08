import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer, getTournamentInfo } from '@/lib/espn-api';
import { allGolfers } from '@/lib/dummy-data';
import { Golfer } from '@/types/database';

export async function GET(request: Request) {
  try {
    const data = await scoreCache.getData();
    const tournamentInfo = getTournamentInfo(data);
    
    if (!tournamentInfo) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }
    
    // Build a name -> ESPN competitor map
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const espnByName = new Map<string, any>();
    competitors.forEach((comp) => {
      espnByName.set(comp.athlete.displayName.toLowerCase(), comp);
    });
    
    // Map our golfers to include ESPN live data, keyed by OUR dummy IDs
    const updatedGolfers: Golfer[] = allGolfers.map((dummyGolfer) => {
      // Try exact match first, then partial
      const nameLower = dummyGolfer.name.toLowerCase();
      let comp = espnByName.get(nameLower);
      
      if (!comp) {
        // Try last name matching
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
        // CRITICAL: Override ID with our dummy ID so entrant team lookups work
        return {
          ...mapped,
          id: dummyGolfer.id,
          bucket: dummyGolfer.bucket,
        };
      }
      
      // No ESPN data yet - return pre-tournament golfer
      return {
        ...dummyGolfer,
        live_score: null,
        thru_hole: null,
        today_score: null,
        round_scores: [],
        status: 'active' as const,
        on_course: false,
      };
    });
    
    return NextResponse.json(
      {
        tournament: tournamentInfo,
        golfers: updatedGolfers,
        timestamp: Date.now(),
        cacheAge: scoreCache.getCacheAge(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
          'CDN-Cache-Control': 'max-age=60',
        },
      }
    );
  } catch (error) {
    console.error('Scores API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}
