import { Golfer, Profile, Game, Participant, Selection } from '@/types/database';

// Dummy Golfers - Top 10
export const top10Golfers: Golfer[] = [
  { id: 1, name: 'Scottie Scheffler', current_rank: 1, live_score: -8, thru_hole: 18, today_score: -3, status: 'active', odds_to_win: 4.5 },
  { id: 2, name: 'Rory McIlroy', current_rank: 2, live_score: -6, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 8.0 },
  { id: 3, name: 'Jon Rahm', current_rank: 3, live_score: -5, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 10.0 },
  { id: 4, name: 'Viktor Hovland', current_rank: 4, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 12.0 },
  { id: 5, name: 'Brooks Koepka', current_rank: 5, live_score: -7, thru_hole: 18, today_score: -4, status: 'active', odds_to_win: 14.0 },
  { id: 6, name: 'Xander Schauffele', current_rank: 6, live_score: -3, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 16.0 },
  { id: 7, name: 'Patrick Cantlay', current_rank: 7, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 18.0 },
  { id: 8, name: 'Ludvig Aberg', current_rank: 8, live_score: -9, thru_hole: 18, today_score: -5, status: 'active', odds_to_win: 20.0 },
  { id: 9, name: 'Collin Morikawa', current_rank: 9, live_score: -1, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 22.0 },
  { id: 10, name: 'Tyrrell Hatton', current_rank: 10, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 25.0 },
];

// Dummy Golfers - Ranks 11-50
export const mid40Golfers: Golfer[] = [
  { id: 11, name: 'Max Homa', current_rank: 11, live_score: -3, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 28.0 },
  { id: 12, name: 'Tommy Fleetwood', current_rank: 12, live_score: -2, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 30.0 },
  { id: 13, name: 'Justin Thomas', current_rank: 13, live_score: -6, thru_hole: 18, today_score: -3, status: 'active', odds_to_win: 32.0 },
  { id: 14, name: 'Cameron Smith', current_rank: 14, live_score: 0, thru_hole: 18, today_score: 2, status: 'active', odds_to_win: 35.0 },
  { id: 15, name: 'Matt Fitzpatrick', current_rank: 15, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 38.0 },
  { id: 16, name: 'Jordan Spieth', current_rank: 16, live_score: -5, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 40.0 },
  { id: 17, name: 'Tony Finau', current_rank: 17, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 42.0 },
  { id: 18, name: 'Sahith Theegala', current_rank: 18, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 45.0 },
  { id: 19, name: 'Russell Henley', current_rank: 19, live_score: 1, thru_hole: 18, today_score: 3, status: 'active', odds_to_win: 50.0 },
  { id: 20, name: 'Sam Burns', current_rank: 20, live_score: -3, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 55.0 },
  { id: 21, name: 'Hideki Matsuyama', current_rank: 21, live_score: -7, thru_hole: 18, today_score: -4, status: 'active', odds_to_win: 60.0 },
  { id: 22, name: 'Rickie Fowler', current_rank: 22, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 65.0 },
  { id: 23, name: 'Jason Day', current_rank: 23, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 70.0 },
  { id: 24, name: 'Sungjae Im', current_rank: 24, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 75.0 },
  { id: 25, name: 'Bryson DeChambeau', current_rank: 25, live_score: -10, thru_hole: 18, today_score: -6, status: 'active', odds_to_win: 80.0 },
  { id: 26, name: 'Shane Lowry', current_rank: 26, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 85.0 },
  { id: 27, name: 'Adam Scott', current_rank: 27, live_score: -3, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 90.0 },
  { id: 28, name: 'Justin Rose', current_rank: 28, live_score: 2, thru_hole: 18, today_score: 4, status: 'cut', odds_to_win: 95.0 },
  { id: 29, name: 'Min Woo Lee', current_rank: 29, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 100.0 },
  { id: 30, name: 'Sepp Straka', current_rank: 30, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 110.0 },
  { id: 31, name: 'Corey Conners', current_rank: 31, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 120.0 },
  { id: 32, name: 'Keegan Bradley', current_rank: 32, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 130.0 },
  { id: 33, name: 'Will Zalatoris', current_rank: 33, live_score: -3, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 140.0 },
  { id: 34, name: 'Brian Harman', current_rank: 34, live_score: -5, thru_hole: 18, today_score: -3, status: 'active', odds_to_win: 150.0 },
  { id: 35, name: 'Si Woo Kim', current_rank: 35, live_score: 1, thru_hole: 18, today_score: 2, status: 'active', odds_to_win: 160.0 },
  { id: 36, name: 'Tom Kim', current_rank: 36, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 170.0 },
  { id: 37, name: 'Denny McCarthy', current_rank: 37, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 180.0 },
  { id: 38, name: 'Taylor Moore', current_rank: 38, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 190.0 },
  { id: 39, name: 'Eric Cole', current_rank: 39, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 200.0 },
  { id: 40, name: 'Akshay Bhatia', current_rank: 40, live_score: -6, thru_hole: 18, today_score: -3, status: 'active', odds_to_win: 220.0 },
];

// Dummy Golfers - Field (51+)
export const fieldGolfers: Golfer[] = [
  { id: 51, name: 'Tiger Woods', current_rank: 51, live_score: -12, thru_hole: 18, today_score: -7, status: 'active', odds_to_win: 250.0 },
  { id: 52, name: 'Phil Mickelson', current_rank: 52, live_score: 3, thru_hole: 18, today_score: 5, status: 'cut', odds_to_win: 300.0 },
  { id: 53, name: 'Dustin Johnson', current_rank: 53, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 350.0 },
  { id: 54, name: 'Sergio Garcia', current_rank: 54, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 400.0 },
  { id: 55, name: 'Patrick Reed', current_rank: 55, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 450.0 },
  { id: 56, name: 'Louis Oosthuizen', current_rank: 56, live_score: -3, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 500.0 },
  { id: 57, name: 'Gary Woodland', current_rank: 57, live_score: 2, thru_hole: 18, today_score: 3, status: 'active', odds_to_win: 550.0 },
  { id: 58, name: 'Bubba Watson', current_rank: 58, live_score: -4, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 600.0 },
  { id: 59, name: 'Webb Simpson', current_rank: 59, live_score: 1, thru_hole: 18, today_score: 2, status: 'active', odds_to_win: 650.0 },
  { id: 60, name: 'Zach Johnson', current_rank: 60, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 700.0 },
  { id: 61, name: 'Lucas Glover', current_rank: 61, live_score: -5, thru_hole: 18, today_score: -3, status: 'active', odds_to_win: 750.0 },
  { id: 62, name: 'Cameron Young', current_rank: 62, live_score: -1, thru_hole: 18, today_score: 0, status: 'active', odds_to_win: 800.0 },
  { id: 63, name: 'Harris English', current_rank: 63, live_score: -2, thru_hole: 18, today_score: -1, status: 'active', odds_to_win: 850.0 },
  { id: 64, name: 'Billy Horschel', current_rank: 64, live_score: 0, thru_hole: 18, today_score: 1, status: 'active', odds_to_win: 900.0 },
  { id: 65, name: 'Chris Kirk', current_rank: 65, live_score: -3, thru_hole: 18, today_score: -2, status: 'active', odds_to_win: 950.0 },
];

export const allGolfers: Golfer[] = [...top10Golfers, ...mid40Golfers, ...fieldGolfers];

// Dummy Users
export const dummyUsers: Profile[] = [
  { id: 'user-1', email: 'john@example.com', display_name: 'John Smith', created_at: new Date().toISOString() },
  { id: 'user-2', email: 'sarah@example.com', display_name: 'Sarah Johnson', created_at: new Date().toISOString() },
  { id: 'user-3', email: 'mike@example.com', display_name: 'Mike Davis', created_at: new Date().toISOString() },
  { id: 'user-4', email: 'emily@example.com', display_name: 'Emily Wilson', created_at: new Date().toISOString() },
  { id: 'user-5', email: 'dave@example.com', display_name: 'Dave Anderson', created_at: new Date().toISOString() },
  { id: 'user-6', email: 'lisa@example.com', display_name: 'Lisa Brown', created_at: new Date().toISOString() },
];

// Dummy Game
export const dummyGame: Game = {
  id: 'game-1',
  admin_id: 'user-1',
  name: 'The April Major 2025',
  entry_code: 'GOLF25',
  is_locked: false,
  theme_color: '#005f40',
  entry_fee: 20,
  payment_info: 'Venmo: @JohnSmith or Cash App: $JohnSmith',
  created_at: new Date().toISOString(),
};

// Dummy Participants with selections
export const dummyParticipants: Participant[] = [
  {
    id: 'part-1',
    user_id: 'user-1',
    game_id: 'game-1',
    payment_status: 'verified',
    user: dummyUsers[0],
  },
  {
    id: 'part-2',
    user_id: 'user-2',
    game_id: 'game-1',
    payment_status: 'verified',
    user: dummyUsers[1],
  },
  {
    id: 'part-3',
    user_id: 'user-3',
    game_id: 'game-1',
    payment_status: 'pending',
    user: dummyUsers[2],
  },
  {
    id: 'part-4',
    user_id: 'user-4',
    game_id: 'game-1',
    payment_status: 'verified',
    user: dummyUsers[3],
  },
  {
    id: 'part-5',
    user_id: 'user-5',
    game_id: 'game-1',
    payment_status: 'unpaid',
    user: dummyUsers[4],
  },
];

// Dummy Selections - Each participant has 7 golfers (2 top10, 3 mid40, 2 field)
export const dummySelections: Selection[] = [
  // User 1 selections
  { id: 'sel-1', participant_id: 'part-1', golfer_id: 1, golfer: top10Golfers[0] },
  { id: 'sel-2', participant_id: 'part-1', golfer_id: 5, golfer: top10Golfers[4] },
  { id: 'sel-3', participant_id: 'part-1', golfer_id: 13, golfer: mid40Golfers[2] },
  { id: 'sel-4', participant_id: 'part-1', golfer_id: 21, golfer: mid40Golfers[10] },
  { id: 'sel-5', participant_id: 'part-1', golfer_id: 25, golfer: mid40Golfers[14] },
  { id: 'sel-6', participant_id: 'part-1', golfer_id: 51, golfer: fieldGolfers[0] },
  { id: 'sel-7', participant_id: 'part-1', golfer_id: 58, golfer: fieldGolfers[7] },

  // User 2 selections
  { id: 'sel-8', participant_id: 'part-2', golfer_id: 8, golfer: top10Golfers[7] },
  { id: 'sel-9', participant_id: 'part-2', golfer_id: 2, golfer: top10Golfers[1] },
  { id: 'sel-10', participant_id: 'part-2', golfer_id: 16, golfer: mid40Golfers[5] },
  { id: 'sel-11', participant_id: 'part-2', golfer_id: 18, golfer: mid40Golfers[7] },
  { id: 'sel-12', participant_id: 'part-2', golfer_id: 34, golfer: mid40Golfers[23] },
  { id: 'sel-13', participant_id: 'part-2', golfer_id: 61, golfer: fieldGolfers[10] },
  { id: 'sel-14', participant_id: 'part-2', golfer_id: 53, golfer: fieldGolfers[2] },

  // User 3 selections
  { id: 'sel-15', participant_id: 'part-3', golfer_id: 3, golfer: top10Golfers[2] },
  { id: 'sel-16', participant_id: 'part-3', golfer_id: 10, golfer: top10Golfers[9] },
  { id: 'sel-17', participant_id: 'part-3', golfer_id: 11, golfer: mid40Golfers[0] },
  { id: 'sel-18', participant_id: 'part-3', golfer_id: 20, golfer: mid40Golfers[9] },
  { id: 'sel-19', participant_id: 'part-3', golfer_id: 40, golfer: mid40Golfers[29] },
  { id: 'sel-20', participant_id: 'part-3', golfer_id: 55, golfer: fieldGolfers[4] },
  { id: 'sel-21', participant_id: 'part-3', golfer_id: 65, golfer: fieldGolfers[14] },

  // User 4 selections
  { id: 'sel-22', participant_id: 'part-4', golfer_id: 4, golfer: top10Golfers[3] },
  { id: 'sel-23', participant_id: 'part-4', golfer_id: 7, golfer: top10Golfers[6] },
  { id: 'sel-24', participant_id: 'part-4', golfer_id: 12, golfer: mid40Golfers[1] },
  { id: 'sel-25', participant_id: 'part-4', golfer_id: 15, golfer: mid40Golfers[4] },
  { id: 'sel-26', participant_id: 'part-4', golfer_id: 27, golfer: mid40Golfers[16] },
  { id: 'sel-27', participant_id: 'part-4', golfer_id: 56, golfer: fieldGolfers[5] },
  { id: 'sel-28', participant_id: 'part-4', golfer_id: 62, golfer: fieldGolfers[11] },
];

// Add selections to participants
dummyParticipants[0].selections = dummySelections.slice(0, 7);
dummyParticipants[1].selections = dummySelections.slice(7, 14);
dummyParticipants[2].selections = dummySelections.slice(14, 21);
dummyParticipants[3].selections = dummySelections.slice(21, 28);
dummyParticipants[4].selections = [];

// Current logged-in user (for demo)
export const currentUser: Profile = dummyUsers[0];
