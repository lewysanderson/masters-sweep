import { type ClassValue, clsx } from 'clsx';
import { GolferBucket } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getGolferBucket(rank: number): GolferBucket {
  if (rank <= 12) return 'top12';
  if (rank <= 50) return 'mid';
  return 'wildcard';
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
