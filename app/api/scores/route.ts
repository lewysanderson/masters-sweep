import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer, getTournamentInfo } from '@/lib/espn-api';
import { allGolfers } from '@/lib/dummy-data';

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
    
    // Map ESPN data to our Golfer format
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const updatedGolfers = competitors.map((comp) => {
      // Find golfer in our data to get bucket assignment
      const existingGolfer = allGolfers.find(
        (g) => g.name === comp.athlete.displayName || g.name.includes(comp.athlete.displayName)
      );
      const bucket = existingGolfer?.bucket || 'wildcard';
      return mapESPNToGolfer(comp, bucket);
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
