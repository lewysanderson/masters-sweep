import useSWR from 'swr';
import { Golfer, TournamentInfo, LeaderboardEntry } from '@/types/database';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ScoresData {
  tournament: TournamentInfo;
  golfers: Golfer[];
  timestamp: number;
  cacheAge: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  timestamp: number;
}

export function useLiveScores() {
  return useSWR<ScoresData>('/api/scores', fetcher, {
    refreshInterval: 60000,        // Poll every 60s
    dedupingInterval: 2000,        // Prevent duplicate requests
    revalidateOnFocus: false,      // Don't refetch on tab focus
    revalidateOnReconnect: true,   // Refetch if internet reconnects
  });
}

export function useLiveLeaderboard() {
  return useSWR<LeaderboardData>('/api/leaderboard', fetcher, {
    refreshInterval: 60000,
    dedupingInterval: 2000,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
}

// Helper to format last updated time
export function formatLastUpdated(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
