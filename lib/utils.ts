import { type ClassValue, clsx } from 'clsx';
import { Golfer, GolferBucket, Participant, LeaderboardEntry, Selection } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getGolferBucket(rank: number): GolferBucket {
  if (rank <= 10) return 'top10';
  if (rank <= 50) return 'mid40';
  return 'field';
}

export function validateSelection(selectedGolfers: Golfer[]): {
  valid: boolean;
  errors: string[];
  counts: { top10: number; mid40: number; field: number };
} {
  const counts = { top10: 0, mid40: 0, field: 0 };
  const errors: string[] = [];

  selectedGolfers.forEach((golfer) => {
    const bucket = getGolferBucket(golfer.current_rank);
    counts[bucket]++;
  });

  if (selectedGolfers.length !== 7) {
    errors.push(`Must select exactly 7 golfers (currently ${selectedGolfers.length})`);
  }

  if (counts.top10 !== 2) {
    errors.push(`Must select exactly 2 golfers from Top 10 (currently ${counts.top10})`);
  }

  if (counts.mid40 !== 3) {
    errors.push(`Must select exactly 3 golfers from Ranks 11-50 (currently ${counts.mid40})`);
  }

  if (counts.field !== 2) {
    errors.push(`Must select exactly 2 golfers from the Field (51+) (currently ${counts.field})`);
  }

  return {
    valid: errors.length === 0,
    errors,
    counts,
  };
}

export function calculateBestFourScore(golfers: Golfer[]): {
  totalScore: number;
  bestFour: Golfer[];
} {
  // Sort by live_score (ascending, since lower is better in golf)
  const sortedGolfers = [...golfers].sort((a, b) => a.live_score - b.live_score);

  // Take the best 4
  const bestFour = sortedGolfers.slice(0, 4);

  // Sum their scores
  const totalScore = bestFour.reduce((sum, golfer) => sum + golfer.live_score, 0);

  return {
    totalScore,
    bestFour,
  };
}

export function generateLeaderboard(participants: Participant[]): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = participants
    .filter((p) => p.selections && p.selections.length === 7)
    .map((participant) => {
      const golfers = participant.selections!.map((s) => s.golfer!);
      const { totalScore, bestFour } = calculateBestFourScore(golfers);

      return {
        participant,
        total_score: totalScore,
        best_four_golfers: bestFour,
        rank: 0, // Will be set below
      };
    });

  // Sort by total score (ascending - lowest wins)
  entries.sort((a, b) => a.total_score - b.total_score);

  // Assign ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

export function generateEntryCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function formatScore(score: number): string {
  if (score === 0) return 'E';
  if (score > 0) return `+${score}`;
  return score.toString();
}

export function getScoreColor(score: number): string {
  if (score < -5) return 'text-purple-600';
  if (score < 0) return 'text-red-600';
  if (score === 0) return 'text-gray-600';
  return 'text-gray-800';
}
