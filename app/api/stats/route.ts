import { NextResponse } from 'next/server';
import { scoreCache } from '@/lib/score-cache';
import { mapESPNToGolfer, getTournamentInfo } from '@/lib/espn-api';
import { fetchGolfOdds, enrichGolfersWithOdds, calculateDynamicWinProbability } from '@/lib/odds-api';
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
    
    // Get live scores
    const competitors = data.events[0]?.competitions[0]?.competitors || [];
    const espnGolfersMap = new Map();
    
    competitors.forEach((comp) => {
      const existingGolfer = allGolfers.find(
        (g) => g.name === comp.athlete.displayName || g.name.includes(comp.athlete.displayName)
      );
      if (existingGolfer) {
        const updatedGolfer = mapESPNToGolfer(comp, existingGolfer.bucket);
        espnGolfersMap.set(existingGolfer.id, updatedGolfer);
      }
    });
    
    // Fetch betting odds
    const oddsMap = await fetchGolfOdds();
    
    // Calculate pick statistics
    const pickCounts = new Map<number, number>();
    const totalPicks = ENTRANTS.length * 7; // Each entrant picks 7 golfers
    
    ENTRANTS.forEach(entrant => {
      const allPicks = [
        ...entrant.team.top12,
        ...entrant.team.mid,
        ...entrant.team.wildcard,
      ];
      
      allPicks.forEach(golferId => {
        pickCounts.set(golferId, (pickCounts.get(golferId) || 0) + 1);
      });
    });
    
    // Build golfer stats
    const golferStats: GolferStats[] = [];
    
    allGolfers.forEach(golfer => {
      const pickCount = pickCounts.get(golfer.id) || 0;
      // Only use live data, skip if not available
      const liveGolfer = espnGolfersMap.get(golfer.id);
      if (!liveGolfer) return; // Skip golfers without live data
      
      const odds = oddsMap.get(golfer.name);
      const impliedProbability = odds ? (1 / odds) : undefined;
      
      // Enrich with live scores
      const enrichedGolfer = {
        ...liveGolfer,
        odds,
        implied_probability: impliedProbability,
      };
      
      // Calculate dynamic win probability
      const allEnrichedGolfers = Array.from(espnGolfersMap.values()).map(g => ({
        ...g,
        odds: oddsMap.get(g.name),
        implied_probability: oddsMap.get(g.name) ? (1 / oddsMap.get(g.name)!) : undefined,
      }));
      
      const winProbability = calculateDynamicWinProbability(
        enrichedGolfer,
        allEnrichedGolfers.length > 0 ? allEnrichedGolfers : allGolfers,
        tournamentInfo.status
      );
      
      // Calculate value rating: pick % vs implied probability
      const pickPercentage = (pickCount / ENTRANTS.length) * 100;
      const valueRating = impliedProbability 
        ? (impliedProbability * 100) - (pickPercentage)
        : 0;
      
      if (pickCount > 0) {
        golferStats.push({
          golfer_id: golfer.id,
          golfer_name: golfer.name,
          pick_count: pickCount,
          pick_percentage: pickPercentage,
          bucket: golfer.bucket,
          world_rank: golfer.world_rank,
          odds,
          implied_probability: impliedProbability,
          current_score: liveGolfer.live_score,
          value_rating: valueRating,
        });
      }
    });
    
    // Sort by pick count (most popular first)
    golferStats.sort((a, b) => b.pick_count - a.pick_count);
    
    // Calculate aggregate statistics
    const aggregateStats = {
      total_entrants: ENTRANTS.length,
      total_picks: totalPicks,
      unique_golfers_picked: golferStats.length,
      most_popular_golfer: golferStats[0],
      least_popular_golfer: golferStats[golferStats.length - 1],
      average_picks_per_golfer: golferStats.reduce((sum, s) => sum + s.pick_count, 0) / golferStats.length,
      
      // Bucket breakdown
      top12_picks: golferStats.filter(s => s.bucket === 'top12').reduce((sum, s) => sum + s.pick_count, 0),
      mid_picks: golferStats.filter(s => s.bucket === 'mid').reduce((sum, s) => sum + s.pick_count, 0),
      wildcard_picks: golferStats.filter(s => s.bucket === 'wildcard').reduce((sum, s) => sum + s.pick_count, 0),
      
      // Value picks (high probability, low pick rate)
      value_picks: golferStats
        .filter(s => s.value_rating && s.value_rating > 5)
        .sort((a, b) => (b.value_rating || 0) - (a.value_rating || 0))
        .slice(0, 5),
      
      // Consensus picks (high pick rate)
      consensus_picks: golferStats
        .filter(s => s.pick_percentage > 40)
        .sort((a, b) => b.pick_percentage - a.pick_percentage),
    };
    
    return NextResponse.json(
      {
        golfer_stats: golferStats,
        aggregate_stats: aggregateStats,
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
