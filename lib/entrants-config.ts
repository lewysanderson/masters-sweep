import { Entrant } from '@/types/database';

export const TOURNAMENT_CONFIG = {
  name: "The Masters 2026",
  year: 2026,
  startDate: "2026-04-09T12:00:00Z",  // 8am EDT
  endDate: "2026-04-12T20:00:00Z",
  espn_event_id: "401811941",
  entry_fee: 10,  // £10 per entrant
};

// Real entrants with their team selections (85 entrants × £10 = £850 prize pool)
export const ENTRANTS: Entrant[] = [
  { id: 'ent-1', name: 'Luke Gray', team: { top12: [4, 3], mid: [13, 20, 23], wildcard: [58, 67] } },
  { id: 'ent-2', name: 'Rory Lindsay Brown', team: { top12: [4, 6], mid: [37, 13, 24], wildcard: [57, 69] } },
  { id: 'ent-3', name: 'Emily Mcreynolds', team: { top12: [4, 1], mid: [15, 13, 20], wildcard: [52, 74] } },
  { id: 'ent-4', name: 'Charlie Robinson', team: { top12: [7, 6], mid: [13, 14, 30], wildcard: [57, 76] } },
  { id: 'ent-5', name: 'Alessandro Fardella', team: { top12: [2, 4], mid: [14, 13, 33], wildcard: [57, 56] } },
  { id: 'ent-6', name: 'Andrew Perry', team: { top12: [4, 6], mid: [13, 22, 24], wildcard: [66, 63] } },
  { id: 'ent-7', name: 'Omeid Naraghi-Shah', team: { top12: [3, 6], mid: [13, 14, 23], wildcard: [53, 58] } },
  { id: 'ent-8', name: 'George Apel', team: { top12: [3, 5], mid: [13, 23, 30], wildcard: [57, 50] } },
  { id: 'ent-9', name: 'Harry Blake', team: { top12: [3, 1], mid: [13, 22, 20], wildcard: [54, 56] } },
  { id: 'ent-10', name: 'Jack Ireson', team: { top12: [4, 5], mid: [13, 16, 17], wildcard: [64, 75] } },
  { id: 'ent-11', name: 'Pip Froud', team: { top12: [4, 5], mid: [17, 20, 28], wildcard: [57, 75] } },
  { id: 'ent-12', name: 'Tash Giddins', team: { top12: [4, 5], mid: [19, 20, 36], wildcard: [52, 51] } },
  { id: 'ent-13', name: 'Max Alexander', team: { top12: [2, 6], mid: [13, 19, 23], wildcard: [59, 65] } },
  { id: 'ent-14', name: 'Bradley Neil', team: { top12: [1, 6], mid: [13, 19, 28], wildcard: [56, 55] } },
  { id: 'ent-15', name: 'Tom Cochrane', team: { top12: [1, 8], mid: [13, 19, 31], wildcard: [54, 57] } },
  { id: 'ent-16', name: 'Craig Wilson', team: { top12: [1, 6], mid: [13, 17, 16], wildcard: [52, 53] } },
  { id: 'ent-17', name: 'Mark Nelson', team: { top12: [3, 6], mid: [18, 13, 14], wildcard: [76, 74] } },
  { id: 'ent-18', name: 'Josh Hillier', team: { top12: [1, 4], mid: [19, 20, 22], wildcard: [59, 64] } },
  { id: 'ent-19', name: 'Sean Dunne', team: { top12: [2, 8], mid: [13, 18, 23], wildcard: [52, 56] } },
  { id: 'ent-20', name: 'Oliver Hedger', team: { top12: [3, 1], mid: [13, 23, 27], wildcard: [53, 56] } },
  { id: 'ent-21', name: 'Ben Dixon', team: { top12: [1, 2], mid: [13, 14, 15], wildcard: [58, 60] } },
  { id: 'ent-22', name: 'Greg Whitelaw', team: { top12: [2, 6], mid: [13, 15, 26], wildcard: [55, 59] } },
  { id: 'ent-23', name: 'George St Quinton', team: { top12: [3, 6], mid: [13, 35, 26], wildcard: [51, 65] } },
  { id: 'ent-24', name: 'Caroline McElroy', team: { top12: [1, 3], mid: [13, 14, 16], wildcard: [64, 52] } },
  { id: 'ent-25', name: 'Craig Manning', team: { top12: [1, 12], mid: [13, 28, 34], wildcard: [66, 64] } },
  { id: 'ent-26', name: 'Jason Belyea', team: { top12: [1, 3], mid: [13, 16, 17], wildcard: [51, 64] } },
  { id: 'ent-27', name: 'James Pickard', team: { top12: [5, 6], mid: [14, 20, 33], wildcard: [51, 52] } },
  { id: 'ent-28', name: 'Debbie Belyea', team: { top12: [4, 5], mid: [19, 20, 49], wildcard: [59, 69] } },
  { id: 'ent-29', name: 'Jake Carty', team: { top12: [2, 3], mid: [23, 13, 26], wildcard: [51, 55] } },
  { id: 'ent-30', name: 'Ben Turner', team: { top12: [2, 12], mid: [32, 13, 14], wildcard: [66, 72] } },
  { id: 'ent-31', name: 'Oliver Newby', team: { top12: [8, 1], mid: [13, 32, 23], wildcard: [56, 70] } },
  { id: 'ent-32', name: 'Alex Coker', team: { top12: [2, 6], mid: [13, 15, 33], wildcard: [56, 65] } },
  { id: 'ent-33', name: 'Alex Carvell', team: { top12: [1, 5], mid: [39, 28, 13], wildcard: [59, 56] } },
  { id: 'ent-34', name: 'George Colleran', team: { top12: [5, 1], mid: [16, 13, 22], wildcard: [51, 52] } },
  { id: 'ent-35', name: 'Rob Barron Snr', team: { top12: [1, 2], mid: [14, 13, 16], wildcard: [54, 52] } },
  { id: 'ent-36', name: 'Ed Wootton', team: { top12: [2, 8], mid: [13, 18, 33], wildcard: [52, 80] } },
  { id: 'ent-37', name: 'Claudia Bowman', team: { top12: [8, 3], mid: [13, 19, 20], wildcard: [66, 54] } },
  { id: 'ent-38', name: 'Tom Dias', team: { top12: [5, 7], mid: [13, 18, 15], wildcard: [53, 54] } },
  { id: 'ent-39', name: 'Elliot Innes', team: { top12: [1, 3], mid: [13, 16, 29], wildcard: [54, 70] } },
  { id: 'ent-40', name: 'Edward Previte', team: { top12: [1, 8], mid: [13, 17, 39], wildcard: [53, 88] } },
  { id: 'ent-41', name: 'Steffan Heap', team: { top12: [1, 3], mid: [15, 20, 23], wildcard: [52, 61] } },
  { id: 'ent-42', name: 'Toby Edwards', team: { top12: [2, 5], mid: [19, 20, 23], wildcard: [53, 59] } },
  { id: 'ent-43', name: 'Jake Cade', team: { top12: [1, 7], mid: [19, 20, 26], wildcard: [52, 60] } },
  { id: 'ent-44', name: 'Gus Giddins', team: { top12: [10, 6], mid: [14, 28, 30], wildcard: [51, 91] } },
  { id: 'ent-45', name: 'Tom Kelland', team: { top12: [1, 2], mid: [13, 14, 24], wildcard: [55, 59] } },
  { id: 'ent-46', name: 'Dan Pritchard', team: { top12: [1, 6], mid: [14, 21, 27], wildcard: [57, 63] } },
  { id: 'ent-47', name: 'Jamie Stoddart', team: { top12: [2, 7], mid: [13, 31, 15], wildcard: [53, 56] } },
  { id: 'ent-48', name: 'Charlie Prior', team: { top12: [5, 8], mid: [31, 17, 13], wildcard: [66, 54] } },
  { id: 'ent-49', name: 'Charlie Slater', team: { top12: [8, 1], mid: [13, 14, 32], wildcard: [51, 56] } },
  { id: 'ent-50', name: 'Ewan MacGarvie', team: { top12: [4, 10], mid: [21, 23, 27], wildcard: [63, 65] } },
  { id: 'ent-51', name: 'James Rickard', team: { top12: [12, 5], mid: [16, 20, 33], wildcard: [52, 56] } },
  { id: 'ent-52', name: 'Chris Kulukundis', team: { top12: [4, 7], mid: [17, 34, 24], wildcard: [63, 60] } },
  { id: 'ent-53', name: 'Lily Apel', team: { top12: [9, 8], mid: [37, 41, 15], wildcard: [53, 69] } },
  { id: 'ent-54', name: 'Josh Hopkins', team: { top12: [5, 9], mid: [15, 16, 30], wildcard: [66, 53] } },
  { id: 'ent-55', name: 'Harry Marway', team: { top12: [1, 2], mid: [32, 19, 46], wildcard: [52, 74] } },
  { id: 'ent-56', name: 'Carys Major', team: { top12: [2, 12], mid: [16, 19, 20], wildcard: [54, 59] } },
  { id: 'ent-57', name: 'George Coslett', team: { top12: [2, 4], mid: [14, 35, 16], wildcard: [52, 51] } },
  { id: 'ent-58', name: 'Steven Bridges', team: { top12: [4, 3], mid: [16, 14, 32], wildcard: [54, 69] } },
  { id: 'ent-59', name: 'Addie Christianson', team: { top12: [4, 12], mid: [15, 16, 18], wildcard: [54, 53] } },
  { id: 'ent-60', name: 'Simon Robinson', team: { top12: [1, 4], mid: [14, 25, 35], wildcard: [51, 52] } },
  { id: 'ent-61', name: 'Andy Parke', team: { top12: [1, 6], mid: [14, 25, 32], wildcard: [51, 52] } },
  { id: 'ent-62', name: 'Owen Leigh', team: { top12: [5, 8], mid: [15, 20, 28], wildcard: [54, 59] } },
  { id: 'ent-63', name: 'Rob Haythorpe', team: { top12: [3, 6], mid: [23, 27, 33], wildcard: [54, 59] } },
  { id: 'ent-64', name: 'Sam Evans', team: { top12: [3, 9], mid: [17, 28, 32], wildcard: [52, 59] } },
  { id: 'ent-65', name: 'Robert McNutt', team: { top12: [3, 8], mid: [29, 18, 30], wildcard: [53, 60] } },
  { id: 'ent-66', name: 'Fraser Brown', team: { top12: [1, 2], mid: [14, 19, 22], wildcard: [51, 64] } },
  { id: 'ent-67', name: 'Brody Patience', team: { top12: [1, 6], mid: [14, 15, 25], wildcard: [54, 63] } },
  { id: 'ent-68', name: 'Brandon Heflin', team: { top12: [1, 2], mid: [14, 15, 22], wildcard: [53, 58] } },
  { id: 'ent-69', name: 'Tom Abbott', team: { top12: [3, 5], mid: [16, 23, 32], wildcard: [54, 59] } },
  { id: 'ent-70', name: 'Lucas King', team: { top12: [3, 4], mid: [15, 30, 26], wildcard: [51, 59] } },
  { id: 'ent-71', name: 'Rob Barron Jnr', team: { top12: [1, 8], mid: [23, 19, 24], wildcard: [51, 59] } },
  { id: 'ent-72', name: 'Jack Manning', team: { top12: [1, 5], mid: [15, 25, 23], wildcard: [59, 51] } },
  { id: 'ent-73', name: 'Michelle Vero', team: { top12: [3, 11], mid: [42, 35, 34], wildcard: [64, 74] } },
  { id: 'ent-74', name: 'Janine Manning', team: { top12: [1, 3], mid: [14, 32, 33], wildcard: [59, 64] } },
  { id: 'ent-75', name: 'Jack Turner', team: { top12: [5, 8], mid: [29, 16, 49], wildcard: [52, 53] } },
  { id: 'ent-76', name: 'David Canavan', team: { top12: [5, 10], mid: [15, 16, 17], wildcard: [52, 59] } },
  { id: 'ent-77', name: 'Lewys Anderson', team: { top12: [2, 1], mid: [37, 16, 14], wildcard: [51, 52] } },
  { id: 'ent-78', name: 'Rhys Major', team: { top12: [3, 7], mid: [14, 17, 18], wildcard: [53, 76] } },
  { id: 'ent-79', name: 'Amelia Powell', team: { top12: [7, 12], mid: [41, 19, 17], wildcard: [56, 81] } },
  { id: 'ent-80', name: 'Josh Tattersall', team: { top12: [1, 3], mid: [18, 31, 15], wildcard: [56, 59] } },
  { id: 'ent-81', name: 'Cameron Pearce', team: { top12: [1, 2], mid: [14, 27, 15], wildcard: [53, 54] } },
  { id: 'ent-82', name: 'Katie Lawrence', team: { top12: [3, 11], mid: [17, 25, 15], wildcard: [52, 81] } },
  { id: 'ent-83', name: 'James Grant', team: { top12: [3, 8], mid: [25, 36, 32], wildcard: [51, 56] } },
  { id: 'ent-84', name: 'Jack Bingham', team: { top12: [8, 12], mid: [33, 15, 14], wildcard: [62, 54] } },
  { id: 'ent-85', name: 'Brandon Carty', team: { top12: [1, 3], mid: [15, 19, 30], wildcard: [51, 83] } },
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
