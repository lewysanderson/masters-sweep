export type PaymentStatus = 'unpaid' | 'pending' | 'verified';
export type GolferStatus = 'active' | 'cut' | 'withdrawn' | 'completed';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Golfer {
  id: number;
  name: string;
  current_rank: number;
  live_score: number; // To Par (e.g. -5, +2)
  thru_hole: number;
  today_score: number;
  status: GolferStatus;
  odds_to_win?: number;
}

export interface Game {
  id: string;
  admin_id: string;
  name: string;
  entry_code: string;
  is_locked: boolean;
  theme_color: string;
  entry_fee: number;
  payment_info?: string;
  created_at: string;
}

export interface Participant {
  id: string;
  user_id: string;
  game_id: string;
  payment_status: PaymentStatus;
  user?: Profile;
  selections?: Selection[];
}

export interface Selection {
  id: string;
  participant_id: string;
  golfer_id: number;
  golfer?: Golfer;
}

export interface LeaderboardEntry {
  participant: Participant;
  total_score: number;
  best_four_golfers: Golfer[];
  rank: number;
}

export type GolferBucket = 'top10' | 'mid40' | 'field';

export interface BucketRequirements {
  top10: number; // Must select 2
  mid40: number;  // Must select 3
  field: number;  // Must select 2
}
