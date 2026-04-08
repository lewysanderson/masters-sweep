import { Entrant } from '@/types/database';

export const TOURNAMENT_CONFIG = {
  name: "The Masters 2026",
  year: 2026,
  startDate: "2026-04-09T12:00:00Z",  // 8am EDT
  endDate: "2026-04-12T20:00:00Z",
  espn_event_id: "401811941",
  entry_fee: 10,  // £10 per entrant
};

// Entrants with their team selections (using dummy data)
export const ENTRANTS: Entrant[] = [
  {
    id: "ent-1",
    name: "John Smith",
    team: {
      top12: [1, 4],           // Scheffler, Rory
      mid: [14, 16, 25],       // Matsuyama, Spieth, Cantlay
      wildcard: [59, 70],      // Wyndham Clark, Tom McKibbin
    },
  },
  {
    id: "ent-2",
    name: "Sarah Johnson",
    team: {
      top12: [3, 6],           // DeChambeau, Schauffele
      mid: [19, 23, 31],       // Hovland, Bhatia, J. Thomas
      wildcard: [80, 65],      // Danny Willett, Potgieter
    },
  },
  {
    id: "ent-3",
    name: "Mike Davis",
    team: {
      top12: [2, 5],           // Rahm, Åberg
      mid: [17, 43, 46],       // Koepka, Harman, Aaron Rai
      wildcard: [52, 64],      // Dustin Johnson, Sergio Garcia
    },
  },
  {
    id: "ent-4",
    name: "Emily Wilson",
    team: {
      top12: [11, 9],          // Morikawa, Fleetwood
      mid: [35, 40, 28],       // Cam Smith, Sam Burns, Hatton
      wildcard: [74, 63],      // Bubba Watson, Max Greyserman
    },
  },
  {
    id: "ent-5",
    name: "Dave Anderson",
    team: {
      top12: [1, 6],           // Scheffler, Schauffele
      mid: [14, 23, 31],       // Matsuyama, Bhatia, Thomas
      wildcard: [59, 70],      // Wyndham Clark, McKibbin
    },
  },
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
