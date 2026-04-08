import { Golfer, GolferBucket, GolferStatus, TournamentInfo } from '@/types/database';

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/golf/pga';
const MASTERS_EVENT_ID = '401811941';

export interface ESPNCompetitor {
  id: string;
  order: number;
  athlete: {
    fullName: string;
    displayName: string;
    flag?: { alt: string };
  };
  score: string;  // "E", "-5", "+3"
  linescores?: Array<{ value?: number }>;
  status?: {
    thru?: string;     // "18", "F", "*", "11"
    position?: number;
    type?: string;
  };
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
      next: { revalidate: 60 }, // Next.js cache for 60s
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
  return parseInt(scoreStr.replace('+', ''), 10);
}

export function mapESPNToGolfer(competitor: ESPNCompetitor, bucket: GolferBucket): Golfer {
  const score = parseScoreToNumber(competitor.score);
  const thru = competitor.status?.thru;
  const roundScores = competitor.linescores?.map((ls) => ls.value || 0) || [];
  
  // Determine thru_hole
  let thruHole: number | null = null;
  if (thru === 'F') {
    thruHole = 18;
  } else if (thru && thru !== '*' && thru !== '-') {
    thruHole = parseInt(thru, 10);
  }
  
  // Determine on_course status
  const onCourse = thru !== 'F' && thru !== undefined && thru !== null && thru !== '-';
  
  return {
    id: parseInt(competitor.id, 10),
    name: competitor.athlete.displayName,
    espn_id: competitor.id,
    world_rank: competitor.order || 0,
    bucket,
    live_score: score,
    thru_hole: thruHole,
    today_score: roundScores.length > 0 ? roundScores[roundScores.length - 1] : null,
    round_scores: roundScores,
    position: competitor.status?.position,
    status: determineStatus(competitor, score),
    on_course: onCourse,
    country: competitor.athlete.flag?.alt,
  };
}

function determineStatus(competitor: ESPNCompetitor, score: number | null): GolferStatus {
  const statusType = competitor.status?.type?.toLowerCase();
  const thru = competitor.status?.thru;
  
  if (statusType === 'cut' || statusType?.includes('cut')) return 'cut';
  if (statusType === 'wd' || statusType?.includes('withdraw')) return 'withdrawn';
  if (thru === 'F' && score !== null) return 'completed';
  
  return 'active';
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
