import { Golfer } from '@/types/database';

// The Odds API - free tier available at https://the-odds-api.com/
// Alternative: Can scrape from betting sites or use dummy data for development

const ODDS_API_KEY = process.env.ODDS_API_KEY || 'demo'; // Get from theoddsapi.com
const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';

interface OddsResponse {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
}

// Fetch live odds from The Odds API
export async function fetchGolfOdds(): Promise<Map<string, number>> {
  try {
    // For demo/development, return mock odds
    if (ODDS_API_KEY === 'demo') {
      return generateMockOdds();
    }

    const url = `${ODDS_API_BASE}/sports/golf_masters/odds?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h&oddsFormat=decimal`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour (odds don't change that often)
    });
    
    if (!response.ok) {
      console.warn('Odds API failed, using mock data');
      return generateMockOdds();
    }
    
    const data: OddsResponse[] = await response.json();
    
    // Parse odds from response
    const oddsMap = new Map<string, number>();
    data.forEach(event => {
      event.bookmakers.forEach(bookmaker => {
        bookmaker.markets.forEach(market => {
          if (market.key === 'h2h') {
            market.outcomes.forEach(outcome => {
              // Use average odds if player appears multiple times
              const existingOdds = oddsMap.get(outcome.name);
              if (existingOdds) {
                oddsMap.set(outcome.name, (existingOdds + outcome.price) / 2);
              } else {
                oddsMap.set(outcome.name, outcome.price);
              }
            });
          }
        });
      });
    });
    
    return oddsMap;
  } catch (error) {
    console.error('Error fetching odds:', error);
    return generateMockOdds();
  }
}

// Generate realistic mock odds based on world ranking
function generateMockOdds(): Map<string, number> {
  const mockOdds = new Map<string, number>();
  
  // Top favorites (lower odds = more likely to win)
  const oddsData: Record<string, number> = {
    'Scottie Scheffler': 6.5,
    'Jon Rahm': 9.0,
    'Bryson DeChambeau': 12.0,
    'Rory McIlroy': 10.0,
    'Ludvig Åberg': 15.0,
    'Xander Schauffele': 14.0,
    'Cameron Young': 35.0,
    'Matt Fitzpatrick': 40.0,
    'Tommy Fleetwood': 45.0,
    'Robert MacIntyre': 50.0,
    'Collin Morikawa': 30.0,
    'Justin Rose': 60.0,
    'Patrick Reed': 50.0,
    'Hideki Matsuyama': 25.0,
    'Min Woo Lee': 55.0,
    'Jordan Spieth': 28.0,
    'Brooks Koepka': 35.0,
    'Chris Gotterup': 80.0,
    'Viktor Hovland': 32.0,
    'Shane Lowry': 50.0,
    'Si Woo Kim': 70.0,
    'Russell Henley': 60.0,
    'Akshay Bhatia': 40.0,
    'Jacob Bridgeman': 90.0,
    'Patrick Cantlay': 38.0,
    'Nicolai Højgaard': 65.0,
    'Jake Knapp': 75.0,
    'Tyrrell Hatton': 45.0,
    'Sepp Straka': 55.0,
    'J.J. Spaun': 85.0,
    'Justin Thomas': 30.0,
    'Adam Scott': 55.0,
    'Corey Conners': 70.0,
    'Marco Penge': 95.0,
    'Cameron Smith': 42.0,
    'Jason Day': 60.0,
    'Maverick McNealy': 75.0,
    'Sungjae Im': 58.0,
    'Gary Woodland': 100.0,
    'Sam Burns': 48.0,
    'Harris English': 65.0,
    'Max Homa': 52.0,
    'Brian Harman': 55.0,
    'Daniel Berger': 80.0,
    'Rasmus Højgaard': 70.0,
    'Aaron Rai': 60.0,
    'Kurt Kitayama': 90.0,
    'Ben Griffin': 75.0,
    'Ryan Fox': 85.0,
    'Casey Jarvis': 95.0,
    // Wildcards (higher odds)
    'Keegan Bradley': 80.0,
    'Dustin Johnson': 65.0,
    'Harry Hall': 100.0,
    'Alex Noren': 90.0,
    'Ryan Gerard': 120.0,
    'Michael Kim': 85.0,
    'Nick Taylor': 95.0,
    'Sam Stevens': 100.0,
    'Wyndham Clark': 58.0,
    'Haotong Li': 110.0,
    'Carlos Ortiz': 95.0,
    'Sami Valimaki': 120.0,
    'Max Greyserman': 88.0,
    'Sergio Garcia': 95.0,
    'Aldrich Potgieter': 80.0,
    'Rasmus Neergaard-Petersen': 115.0,
    'Nicolas Echavarria': 100.0,
    'Andrew Novak': 105.0,
    'Matt McCarty': 92.0,
    'Tom McKibbin': 85.0,
    'Michael Brennan': 125.0,
    'Kristoffer Reitan': 115.0,
    'John Keefer': 130.0,
    'Bubba Watson': 90.0,
    'Charl Schwartzel': 105.0,
    'Zach Johnson': 110.0,
    'Davis Riley': 88.0,
    'Fifa Laopakdee': 140.0,
    'Naoyuki Kataoka': 125.0,
    'Danny Willett': 82.0,
    'Ethan Fang': 135.0,
    'Jose Maria Olazabal': 150.0,
    'Brandon Holtz': 120.0,
    'Mateo Pulcini': 130.0,
    'Mason Howell': 110.0,
    'Jackson Herrington': 125.0,
    'Brian Campbell': 140.0,
    'Vijay Singh': 160.0,
    'Angel Cabrera': 145.0,
    'Mike Weir': 155.0,
    'Fred Couples': 150.0,
  };
  
  Object.entries(oddsData).forEach(([name, odds]) => {
    mockOdds.set(name, odds);
  });
  
  return mockOdds;
}

// Calculate implied probability from decimal odds
export function calculateImpliedProbability(odds: number): number {
  return 1 / odds;
}

// Enrich golfers with odds data
export function enrichGolfersWithOdds(golfers: Golfer[], oddsMap: Map<string, number>): Golfer[] {
  return golfers.map(golfer => {
    const odds = oddsMap.get(golfer.name);
    if (odds) {
      return {
        ...golfer,
        odds,
        implied_probability: calculateImpliedProbability(odds),
      };
    }
    return golfer;
  });
}

// Calculate dynamic win probability based on current position and odds
export function calculateDynamicWinProbability(
  golfer: Golfer,
  allGolfers: Golfer[],
  tournamentStatus: 'pre' | 'in' | 'post'
): number {
  if (tournamentStatus === 'pre') {
    // Pre-tournament: use betting odds
    return golfer.implied_probability || 0;
  }
  
  if (tournamentStatus === 'post') {
    // Post-tournament: winner has 100%, others 0%
    return golfer.position === 1 ? 1 : 0;
  }
  
  // During tournament: combine current position with pre-tournament odds
  const activeGolfers = allGolfers.filter(g => g.status === 'active');
  
  if (golfer.status !== 'active') {
    return 0; // Cut/withdrawn players have 0% chance
  }
  
  if (!golfer.live_score || !golfer.position) {
    return golfer.implied_probability || 0;
  }
  
  // Weight: 70% current position, 30% pre-tournament odds
  const positionScore = 1 - ((golfer.position - 1) / activeGolfers.length);
  const oddsScore = golfer.implied_probability || 0;
  
  const combinedScore = (positionScore * 0.7) + (oddsScore * 0.3);
  
  // Normalize across all active golfers
  const totalScore = activeGolfers.reduce((sum, g) => {
    if (!g.position || !g.live_score) return sum;
    const gPositionScore = 1 - ((g.position - 1) / activeGolfers.length);
    const gOddsScore = g.implied_probability || 0;
    return sum + ((gPositionScore * 0.7) + (gOddsScore * 0.3));
  }, 0);
  
  return totalScore > 0 ? combinedScore / totalScore : 0;
}
