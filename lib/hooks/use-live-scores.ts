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
  tournament?: TournamentInfo;
  timestamp: number;
}

export function useLiveScores() {
  return useSWR<ScoresData>('/api/scores', fetcher, {
    refreshInterval: 30000,
    dedupingInterval: 2000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}

export function useLiveLeaderboard() {
  return useSWR<LeaderboardData>('/api/leaderboard', fetcher, {
    refreshInterval: 30000,
    dedupingInterval: 2000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });
}

export function formatLastUpdated(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${dateNum} ${month} ${hours}:${mins} GMT`;
}
