# Quick Start Guide

Get your Masters Golf Sweepstake app running in 3 simple steps!

## Prerequisites

Make sure you have **Node.js 18+** installed:
```bash
node --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org)

## Installation & Running

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including Next.js, React, Tailwind CSS, and TypeScript.

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Your Browser
Navigate to **http://localhost:3000**

## Testing the Application

The app is pre-loaded with dummy data so you can test all features immediately!

### You're logged in as:
- **Name**: John Smith
- **Email**: john@example.com
- **Role**: Admin of the demo game

### Try These Features:

#### 1. Homepage (http://localhost:3000)
- View the landing page with feature highlights
- Click "View Dashboard" to see your games

#### 2. Dashboard (http://localhost:3000/dashboard)
- See the game "The April Major 2025"
- Entry code: `GOLF25`
- Your payment status
- Quick actions

#### 3. Select Your Team (http://localhost:3000/games/select)
- Browse 65+ golfers across 3 buckets
- Search and filter golfers
- Watch the bucket counter update as you select
- Must pick: 2 Top 10, 3 from 11-50, 2 from Field
- Submit when validation passes ✓

#### 4. View Leaderboard (http://localhost:3000/games/leaderboard)
- See live rankings
- Best 4 golfers count toward score
- View everyone's teams
- See payment statuses

#### 5. Admin Panel (http://localhost:3000/games/admin)
- Manage participant payments
- Lock/unlock the game
- View collection statistics
- Monitor team completion

#### 6. Create New Game (http://localhost:3000/games/create)
- Set game name and entry fee
- Get auto-generated entry code
- Add payment instructions

#### 7. Join a Game (http://localhost:3000/games/join)
- Use entry code `GOLF25` to join the demo game
- Try an invalid code to see error handling

## Key Demo Data

### Participants (5 total)
1. **John Smith** (You) - Admin, Verified, Team Complete
2. **Sarah Johnson** - Verified, Team Complete
3. **Mike Davis** - Pending Payment, Team Complete
4. **Emily Wilson** - Verified, Team Complete
5. **Dave Anderson** - Unpaid, No Team Selected

### Prize Pool
- Entry Fee: $20
- Verified Payments: 3
- Total Collected: $60

### Golfers
- **10** in Top 10 (e.g., Scottie Scheffler at -8)
- **30** in Ranks 11-50 (e.g., Bryson DeChambeau at -10)
- **15** in Field 51+ (e.g., Tiger Woods at -12)

## Testing Specific Features

### Selection Validation
1. Go to `/games/select`
2. Try selecting 3 from Top 10 → Error shown
3. Try selecting only 6 golfers → Error shown
4. Select proper combination → Save button enables

### Admin Features
1. Go to `/games/admin`
2. Change Mike's status from Pending → Verified
3. Watch the stats update
4. Lock/unlock the game

### Search & Filter
1. Go to `/games/select`
2. Search "Tiger" → Find Tiger Woods
3. Filter by "Top 10" → See only top-ranked golfers
4. Filter by "Field" → See golfers ranked 51+

## File Structure Quick Reference

```
app/
├── page.tsx              → Homepage
├── dashboard/page.tsx    → Your games
└── games/
    ├── select/page.tsx   → Pick golfers
    ├── leaderboard/      → Rankings
    ├── admin/           → Admin panel
    ├── create/          → New game
    └── join/            → Join with code

components/               → Reusable UI
lib/dummy-data.ts        → Test data
types/database.ts        → TypeScript types
```

## Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Check code quality
```

## Next Steps

Once you're ready to deploy with real data:

1. **Set up Supabase**:
   - Create project at [supabase.com](https://supabase.com)
   - Run SQL schema from `Master-Prompt.txt`

2. **Update Environment**:
   ```bash
   # Edit .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_USE_DUMMY_DATA=false
   ```

3. **Implement Supabase Client**:
   - Add server actions for mutations
   - Connect authentication
   - Enable real-time subscriptions

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Dependencies not installing?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Rebuild TypeScript
npm run build
```

## Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Review [Master-Prompt.txt](Master-Prompt.txt) for requirements
- All dummy data is in [lib/dummy-data.ts](lib/dummy-data.ts)

## Have Fun! ⛳

Your Masters Golf Sweepstake app is ready to test. Explore all the features and see how the scoring system works with the best 4 golfers rule!
