export type GolferStatus = 'active' | 'cut' | 'withdrawn' | 'completed';
export type GolferBucket = 'top12' | 'mid' | 'wildcard';
export type TournamentStatus = 'pre' | 'in' | 'post';

export interface Golfer {
  id: number;
  name: string;
  espn_id?: string;              // ESPN athlete ID
  world_rank: number;
  bucket: GolferBucket;
  
  // Live data from ESPN
  live_score: number | null;     // Total to par
  thru_hole: number | null;      // Holes completed (or 18 for finished)
  today_score: number | null;    // Today's round score
  round_scores?: number[];       // [R1, R2, R3, R4]
  position?: number;             // Tournament position
  
  status: GolferStatus;
  on_course?: boolean;           // Currently playing
  country?: string;
  tee_time?: string;             // Today's tee time
  
  // Betting odds
  odds?: number;                 // Decimal odds (e.g., 5.5 = 5.5 to 1)
  implied_probability?: number;  // Calculated from odds (0-1)
}

export interface GolferStats {
  golfer_id: number;
  golfer_name: string;
  pick_count: number;
  pick_percentage: number;
  bucket: GolferBucket;
  world_rank: number;
  odds?: number;
  implied_probability?: number;
  current_score?: number | null;
  value_rating?: number;         // Pick % vs implied probability
}

export interface Entrant {
  id: string;
  name: string;
  team: {
    top12: number[];    // Golfer IDs (must be exactly 2)
    mid: number[];      // Golfer IDs (must be exactly 3)
    wildcard: number[]; // Golfer IDs (must be exactly 2)
  };
}

export interface LeaderboardEntry {
  entrant: Entrant;
  total_score: number;
  best_four_golfers: Golfer[];
  all_golfers: Golfer[];
  rank: number;
  previous_rank?: number;        // For movement indicators
  prize_position?: 1 | 2 | 3;   // If in prize positions
}

export interface TournamentInfo {
  id: string;
  name: string;
  status: TournamentStatus;
  start_date: string;
  end_date: string;
  current_round?: number;        // 1-4
  cut_line?: number;             // Score to make cut
}

export interface BucketRequirements {
  top12: number;
  mid: number;
  wildcard: number;
}

export const BUCKET_REQUIREMENTS: BucketRequirements = {
  top12: 2,
  mid: 3,
  wildcard: 2,
};

export const PRIZE_SPLIT = {
  first: 0.70,
  second: 0.20,
  third: 0.10,
};
