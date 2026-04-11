import { Golfer, GolferBucket, GolferStatus, TournamentInfo } from '@/types/database';

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/golf/pga';
const MASTERS_EVENT_ID = '401811941';

// ESPN response types (loosely typed due to varying API responses)
export interface ESPNCompetitor {
  id: string;
  order: number;
  athlete: {
    fullName: string;
    displayName: string;
    flag?: { alt: string };
  };
  score: string;  // "E", "-5", "+3"
  linescores?: Array<{
    period?: number;
    value?: number;
    displayValue?: string;
    linescores?: Array<{
      period?: number;
      value?: number;
    }>;
  }>;
  status?: {
    thru?: string;
    position?: number;
    type?: string;
  } | null;
}

export interface ESPNResponse {
  events: Array<{
    id: string;
    name: string;
    date: string;
    endDate: string;
    status: {
      type: {
        id: string;
        state: 'pre' | 'in' | 'post';
        completed: boolean;
      };
    };
    competitions: Array<{
      competitors: ESPNCompetitor[];
      status?: {
        period?: number;  // Current round
      };
    }>;
  }>;
}

export async function fetchMastersTournament(): Promise<ESPNResponse> {
  try {
    const url = `${ESPN_BASE_URL}/scoreboard`;
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh - caching handled by ScoreCache singleton
    });
    
    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch ESPN data:', error);
    throw error;
  }
}

export function parseScoreToNumber(scoreStr: string): number | null {
  if (!scoreStr || scoreStr === '-') return null;
  if (scoreStr === 'E') return 0;
  const num = parseInt(scoreStr.replace('+', ''), 10);
  return isNaN(num) ? null : num;
}

export function mapESPNToGolfer(competitor: ESPNCompetitor, bucket: GolferBucket, currentRound?: number): Golfer {
  const score = parseScoreToNumber(competitor.score);
  const rounds = competitor.linescores || [];
  const round = currentRound || 1;
  
  // Extract round-by-round scores from displayValue
  // Skip sentinel entries (value=0, displayValue="-") which ESPN uses for cut golfers
  const roundScores: number[] = [];
  rounds.forEach((r) => {
    if (r.displayValue && r.displayValue !== '-') {
      const parsed = parseScoreToNumber(r.displayValue);
      roundScores.push(parsed ?? 0);
    }
  });
  
  // Determine thru-hole from hole-by-hole data in current round
  let thruHole: number | null = null;
  const currentRoundData = rounds[round - 1];
  if (currentRoundData?.linescores && currentRoundData.linescores.length > 0) {
    thruHole = currentRoundData.linescores.length;
  } else if (round > 1) {
    // If current round has no holes but previous rounds exist, check if they finished previous round
    const prevRound = rounds[round - 2];
    if (prevRound?.linescores && prevRound.linescores.length === 18) {
      thruHole = 0; // Finished previous round, hasn't started current
    }
  }
  
  // For completed rounds, check if all previous rounds show 18 holes
  // If the current round index has no data but player has a score, they may not have started
  const completedHoles = thruHole || 0;
  const onCourse = completedHoles > 0 && completedHoles < 18;
  const finishedRound = completedHoles === 18;
  
  // Today's score (current round's displayValue)
  let todayScore: number | null = null;
  if (currentRoundData?.displayValue) {
    todayScore = parseScoreToNumber(currentRoundData.displayValue);
  }
  
  // Determine status
  // ESPN does NOT provide an explicit "cut" status field. Instead, cut must be
  // inferred from the linescores structure:
  // - Made cut: 4 linescores (Round 4 placeholder present)
  // - Missed cut: fewer linescores, last entry is a sentinel (value=0, displayValue="-")
  const statusType = competitor.status?.type?.toLowerCase();
  let status: GolferStatus = 'active';
  if (statusType === 'cut' || statusType?.includes('cut')) {
    status = 'cut';
  } else if (statusType === 'wd' || statusType?.includes('withdraw')) {
    status = 'withdrawn';
  } else if (round >= 3 && rounds.length > 0) {
    // After round 2 is complete, detect cut from linescores structure
    // Cut golfers have fewer linescores and their last entry is a zeroed-out sentinel
    const lastRound = rounds[rounds.length - 1];
    const isSentinel = lastRound && 
      lastRound.value !== undefined && 
      lastRound.value === 0 && 
      (lastRound.displayValue === '-' || lastRound.displayValue === undefined);
    
    // If tournament is in round 3+ but golfer only has entries up to round 2
    // (the sentinel round 3 entry doesn't count as a real round)
    if (isSentinel && rounds.length < 4) {
      status = 'cut';
    }
  } else if (finishedRound) {
    status = 'active'; // Still active, just finished today's round
  }
  
  return {
    id: parseInt(competitor.id, 10),
    name: competitor.athlete.displayName,
    espn_id: competitor.id,
    world_rank: competitor.order || 0,
    bucket,
    live_score: score,
    thru_hole: thruHole,
    today_score: todayScore,
    round_scores: roundScores,
    position: competitor.status?.position || competitor.order,
    status,
    on_course: onCourse,
    country: competitor.athlete.flag?.alt,
  };
}

export function getTournamentInfo(data: ESPNResponse): TournamentInfo | null {
  if (!data.events || data.events.length === 0) return null;
  
  const event = data.events.find((e) => e.id === MASTERS_EVENT_ID) || data.events[0];
  const currentRound = event.competitions?.[0]?.status?.period;
  
  return {
    id: event.id,
    name: event.name,
    status: event.status.type.state,
    start_date: event.date,
    end_date: event.endDate,
    current_round: currentRound ?? undefined,
  };
}
