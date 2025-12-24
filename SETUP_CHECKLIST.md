# Setup Checklist

Use this checklist to ensure your Masters Golf Sweepstake app is ready to run!

## ✅ Prerequisites

- [ ] **Node.js 18+** installed
  ```bash
  node --version
  # Should show v18.x.x or higher
  ```

- [ ] **npm** installed
  ```bash
  npm --version
  # Should show 9.x.x or higher
  ```

## ✅ Installation Steps

- [ ] **Navigate to project directory**
  ```bash
  cd /Users/lewysanderson/Desktop/Projects/masters-sweep
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  This installs:
  - Next.js 14+
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide React (icons)
  - Supabase client (for future use)

- [ ] **Verify installation**
  ```bash
  ls node_modules
  # Should see folders for next, react, typescript, etc.
  ```

## ✅ Run the Application

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Check terminal output**
  You should see:
  ```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
  ```

- [ ] **Open browser**
  Go to: http://localhost:3000

- [ ] **Verify homepage loads**
  - See "The April Major" title
  - See green gradient background
  - See 4 feature cards
  - See "How It Works" section

## ✅ Test Core Features

- [ ] **Dashboard** (http://localhost:3000/dashboard)
  - Game card shows "The April Major 2025"
  - Entry code shows "GOLF25"
  - Shows "Welcome, John Smith"
  - Payment status visible
  - Action buttons work

- [ ] **Select Team** (http://localhost:3000/games/select)
  - 65 golfers load
  - Can search for "Tiger"
  - Can filter by "Top 10", "11-50", "Field"
  - Click golfer to select
  - Bucket counter updates
  - Validation shows errors when incomplete
  - "Save Team" enables when 2-3-2 rule met

- [ ] **Leaderboard** (http://localhost:3000/games/leaderboard)
  - Shows 4 participants with teams
  - Rankings displayed (1st, 2nd, 3rd, etc.)
  - Best 4 golfers shown for each
  - Total scores calculated
  - Prize pool displayed ($60)
  - "YOU" badge on John Smith

- [ ] **Admin Panel** (http://localhost:3000/games/admin)
  - Shows all 5 participants
  - Payment status buttons work
  - Lock/unlock game toggle works
  - Statistics show correctly
  - Entry code displayed (GOLF25)

- [ ] **Create Game** (http://localhost:3000/games/create)
  - Form fields editable
  - Random entry code generated
  - "Create Game" button shows alert
  - Redirects to dashboard

- [ ] **Join Game** (http://localhost:3000/games/join)
  - Can enter "GOLF25" → Success
  - Invalid code shows error
  - Redirects on successful join

## ✅ Visual Checks

- [ ] **Colors**
  - Masters green (#005f40) used throughout
  - Buttons have green background
  - Headers have green background

- [ ] **Responsive Design**
  - Resize browser window
  - Mobile view works (< 768px)
  - Tablet view works (768-1024px)
  - Desktop view works (> 1024px)

- [ ] **Icons**
  - Trophy icons visible
  - User icons visible
  - Crown icon on 1st place
  - All Lucide icons rendering

- [ ] **Typography**
  - Headings bold and clear
  - Body text readable
  - Font sizes appropriate

## ✅ Data Validation

- [ ] **Golfers**
  - 10 in Top 10 bucket
  - 30 in Mid 40 bucket
  - 15 in Field bucket
  - All have scores, ranks, names

- [ ] **Users**
  - John Smith is admin
  - 6 total users in system
  - Display names showing

- [ ] **Game**
  - Entry code: GOLF25
  - Entry fee: $20
  - Status: Unlocked
  - 5 participants

- [ ] **Participants**
  - 3 verified payments
  - 1 pending payment
  - 1 unpaid
  - 4 with complete teams
  - 1 without team

## ✅ Functionality Tests

- [ ] **Selection Validation**
  - Can't select 8 golfers
  - Can't select 3 from Top 10
  - Can't select 1 from Field
  - Must meet exact 2-3-2 rule

- [ ] **Scoring Logic**
  - Best 4 golfers counted
  - Lower scores rank higher
  - Score formatting (-8, E, +2)

- [ ] **Search & Filter**
  - Search finds golfers
  - Filter narrows by bucket
  - "All" shows everyone

## ✅ No Errors

- [ ] **Browser Console**
  - Press F12 → Console tab
  - No red error messages
  - No warnings (optional)

- [ ] **Terminal**
  - No compilation errors
  - No TypeScript errors
  - Server running smoothly

## ✅ File Structure

- [ ] **All files present**
  ```
  ✓ app/page.tsx
  ✓ app/dashboard/page.tsx
  ✓ app/games/select/page.tsx
  ✓ app/games/leaderboard/page.tsx
  ✓ app/games/admin/page.tsx
  ✓ app/games/create/page.tsx
  ✓ app/games/join/page.tsx
  ✓ components/Header.tsx
  ✓ components/GolferCard.tsx
  ✓ components/BucketCounter.tsx
  ✓ lib/dummy-data.ts
  ✓ lib/utils.ts
  ✓ types/database.ts
  ✓ package.json
  ✓ tsconfig.json
  ✓ tailwind.config.ts
  ```

## 🎉 Success Criteria

Your app is ready when:

- [x] All pages load without errors
- [x] Can navigate between pages
- [x] Golfer selection works with validation
- [x] Leaderboard shows rankings
- [x] Admin panel functions properly
- [x] Styling looks good (Masters green theme)
- [x] Responsive on mobile, tablet, desktop
- [x] No console errors
- [x] TypeScript compiles successfully

## 🚀 Next Steps After Setup

1. **Explore the app**
   - Try all features
   - Test different selections
   - View admin capabilities

2. **Customize dummy data** (optional)
   - Edit `lib/dummy-data.ts`
   - Add more golfers
   - Change scores
   - Modify participants

3. **Prepare for production**
   - Set up Supabase account
   - Configure environment variables
   - Implement authentication
   - Add server actions

## ❓ Troubleshooting

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Dependencies won't install
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript errors
```bash
npm run build
```

### Page won't load
- Check terminal for errors
- Verify `npm run dev` is running
- Try http://localhost:3000 (not https)
- Clear browser cache

### Styling not working
- Verify Tailwind CSS installed
- Check `tailwind.config.ts` exists
- Restart dev server

## 📞 Need Help?

- Review [QUICKSTART.md](QUICKSTART.md)
- Check [README.md](README.md)
- Review [PROJECT_STRUCTURE.txt](PROJECT_STRUCTURE.txt)
- Inspect dummy data in [lib/dummy-data.ts](lib/dummy-data.ts)

---

**Ready to test?** Run `npm run dev` and start checking off items! ⛳
