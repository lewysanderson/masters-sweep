import { Entrant } from '@/types/database';

export const TOURNAMENT_CONFIG = {
  name: "The Masters 2026",
  year: 2026,
  startDate: "2026-04-09T12:00:00Z",  // 8am EDT
  endDate: "2026-04-12T20:00:00Z",
  espn_event_id: "401811941",
  entry_fee: 10,  // £10 per entrant
};

// Real entrants with their team selections
export const ENTRANTS: Entrant[] = [
  { id: 'ent-1', name: 'Amelia Powell', team: { top12: [7, 12], mid: [41, 19, 17], wildcard: [56, 81] } },
  { id: 'ent-2', name: 'Owen Leigh', team: { top12: [5, 8], mid: [15, 20, 28], wildcard: [54, 59] } },
  { id: 'ent-3', name: 'James Grant', team: { top12: [3, 8], mid: [25, 36, 32], wildcard: [51, 56] } },
  { id: 'ent-4', name: 'Oliver Hedger', team: { top12: [3, 1], mid: [13, 23, 27], wildcard: [53, 56] } },
  { id: 'ent-5', name: 'Rory Lindsay Brown', team: { top12: [4, 6], mid: [37, 13, 24], wildcard: [57, 69] } },
  { id: 'ent-6', name: 'Steven Bridges', team: { top12: [4, 3], mid: [16, 14, 32], wildcard: [54, 69] } },
  { id: 'ent-7', name: 'Emily Mcreynolds', team: { top12: [4, 1], mid: [15, 13, 20], wildcard: [52, 74] } },
  { id: 'ent-8', name: 'Janine Manning', team: { top12: [1, 3], mid: [14, 32, 33], wildcard: [59, 64] } },
  { id: 'ent-9', name: 'Craig Manning', team: { top12: [1, 12], mid: [13, 28, 34], wildcard: [66, 64] } },
  { id: 'ent-10', name: 'Rob Barron Jnr', team: { top12: [1, 8], mid: [23, 19, 24], wildcard: [51, 59] } },
  { id: 'ent-11', name: 'Tom Dias', team: { top12: [5, 7], mid: [13, 18, 15], wildcard: [53, 54] } },
  { id: 'ent-12', name: 'Jack Bingham', team: { top12: [8, 12], mid: [33, 15, 14], wildcard: [62, 54] } },
  { id: 'ent-13', name: 'Sam Evans', team: { top12: [3, 9], mid: [17, 28, 32], wildcard: [52, 59] } },
  { id: 'ent-14', name: 'Alex Coker', team: { top12: [2, 1], mid: [13, 15, 33], wildcard: [56, 65] } },
  { id: 'ent-15', name: 'Brandon Carty', team: { top12: [1, 3], mid: [15, 19, 30], wildcard: [51, 83] } },
  { id: 'ent-16', name: 'Gus Giddins', team: { top12: [1, 12], mid: [14, 28, 30], wildcard: [51, 91] } },
  { id: 'ent-17', name: 'Tash Giddins', team: { top12: [4, 5], mid: [19, 20, 36], wildcard: [52, 51] } },
  { id: 'ent-18', name: 'Jack Ireson', team: { top12: [4, 5], mid: [13, 16, 17], wildcard: [64, 75] } },
  { id: 'ent-19', name: 'James Rickard', team: { top12: [12, 5], mid: [16, 20, 33], wildcard: [52, 56] } },
  { id: 'ent-20', name: 'Charlie Slater', team: { top12: [8, 1], mid: [13, 14, 38], wildcard: [51, 56] } },
  { id: 'ent-21', name: 'Caroline McElroy', team: { top12: [1, 3], mid: [13, 14, 16], wildcard: [64, 52] } },
  { id: 'ent-22', name: 'Josh Tattersall', team: { top12: [1, 3], mid: [18, 31, 15], wildcard: [56, 59] } },
  { id: 'ent-23', name: 'Ewan MacGarvie', team: { top12: [4, 10], mid: [21, 23, 27], wildcard: [63, 65] } },
  { id: 'ent-24', name: 'Ben Dixon', team: { top12: [1, 2], mid: [13, 14, 15], wildcard: [58, 60] } },
  { id: 'ent-25', name: 'Brody Patience', team: { top12: [1, 6], mid: [14, 15, 25], wildcard: [54, 63] } },
  { id: 'ent-26', name: 'Charlie Robinson', team: { top12: [7, 6], mid: [13, 14, 30], wildcard: [57, 76] } },
  { id: 'ent-27', name: 'Simon Robinson', team: { top12: [1, 4], mid: [14, 25, 35], wildcard: [51, 52] } },
  { id: 'ent-28', name: 'Jake Cade', team: { top12: [1, 7], mid: [19, 20, 26], wildcard: [52, 60] } },
];

// Helper to validate entrant teams
export function validateEntrant(entrant: Entrant): boolean {
  return (
    entrant.team.top12.length === 2 &&
    entrant.team.mid.length === 3 &&
    entrant.team.wildcard.length === 2
  );
}

// Calculate total pot
export function getTotalPot(): number {
  return ENTRANTS.length * TOURNAMENT_CONFIG.entry_fee;
}

// Calculate prize amounts (70%, 20%, 10%)
export function getPrizes() {
  const total = getTotalPot();
  return {
    first: Math.floor(total * 0.70),
    second: Math.floor(total * 0.20),
    third: Math.floor(total * 0.10),
  };
}

// Get entrant by ID
export function getEntrantById(id: string): Entrant | undefined {
  return ENTRANTS.find((e) => e.id === id);
}
