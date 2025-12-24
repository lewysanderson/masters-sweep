# The April Major - Masters Golf Sweepstake

A robust, responsive web application for running Masters Golf sweepstakes with friends. Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- **Game Management**: Create and join private games with unique entry codes
- **Smart Team Selection**: Pick 7 golfers following bucket rules (2 from Top 10, 3 from 11-50, 2 from Field)
- **Live Leaderboard**: Track scores in real-time based on best 4 golfers
- **Payment Management**: Admin can verify payments, participants can mark themselves as paid
- **Game Locking**: Admin can lock games to prevent changes once tournament starts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Database**: Supabase (PostgreSQL + Auth) - *Currently using dummy data*

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- (Optional) Supabase account for production deployment

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Current Demo Mode

The application currently uses **dummy data** for local testing. You can:

- Browse the homepage and features
- View the dashboard (logged in as John Smith)
- Create and join games (use code `GOLF25` to join the demo game)
- Select golfers with validation
- View the live leaderboard
- Access admin features (John Smith is the admin)

### Demo Credentials

The app simulates being logged in as:
- **Name**: John Smith
- **Email**: john@example.com
- **Role**: Admin of "The April Major 2025" game

## Project Structure

```
masters-sweep/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── dashboard/
│   │   └── page.tsx                # User dashboard
│   ├── games/
│   │   ├── create/page.tsx         # Create game
│   │   ├── join/page.tsx           # Join game
│   │   ├── select/page.tsx         # Select golfers
│   │   ├── leaderboard/page.tsx    # View leaderboard
│   │   └── admin/page.tsx          # Admin panel
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── Header.tsx                  # Navigation header
│   ├── GolferCard.tsx             # Golfer display card
│   └── BucketCounter.tsx          # Selection tracker
├── lib/
│   ├── dummy-data.ts              # Demo data
│   └── utils.ts                   # Utility functions
├── types/
│   └── database.ts                # TypeScript types
└── Master-Prompt.txt              # Project specification
```

## Key Pages

### Homepage (`/`)
- Feature showcase
- Quick access to create/join games
- How it works guide

### Dashboard (`/dashboard`)
- View your games
- Check payment status
- Quick actions for team selection and leaderboard

### Select Team (`/games/select`)
- Browse golfers by bucket (Top 10, 11-50, Field)
- Search and filter functionality
- Real-time validation of bucket requirements
- Visual feedback for selected golfers

### Leaderboard (`/games/leaderboard`)
- Live rankings based on best 4 golfers
- View all participants' teams
- Prize pool display
- Payment status indicators

### Admin Panel (`/games/admin`)
- Manage payment statuses
- Lock/unlock game
- View participant details
- Monitor collection progress

## Scoring Rules

1. Each participant selects 7 golfers following bucket requirements
2. Score is calculated from the **best 4 golfers** in your team
3. Lower scores win (golf scoring: -12 beats -8)
4. Golfers who miss the cut count with their current score

## Bucket Requirements

- **2 Golfers** from Top 10 rankings
- **3 Golfers** from Ranks 11-50
- **2 Golfers** from the Field (51+)

## Payment Flow

1. User joins game and selects team
2. User marks themselves as "Paid" (status: pending)
3. Admin manually verifies payment (status: verified)
4. Only verified payments count toward prize pool

## Supabase Integration (Future)

To connect to Supabase for production:

1. Create a Supabase project
2. Run the SQL schema from [Master-Prompt.txt](Master-Prompt.txt) (lines 30-87)
3. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_USE_DUMMY_DATA=false
   ```
4. Implement Supabase client and Server Actions

## Color Scheme

- **Primary**: Masters Green (`#005f40`)
- **Secondary**: Stone (`#f5f5f4`)
- **Accents**: Yellow (Top 10), Blue (11-50), Green (Field)

## Building for Production

```bash
npm run build
npm start
```

## Linting

```bash
npm run lint
```

## Contributing

This is a private sweepstake application. Contributions are welcome for bug fixes and feature enhancements.

## License

Private project for personal use.

## Author

Built as a comprehensive golf sweepstake platform for The April Major tournament.
