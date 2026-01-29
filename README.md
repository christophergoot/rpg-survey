# 🎲 RPG Survey Creator

A bilingual web application that helps Game Masters gather player preferences for tabletop RPG campaigns. Create surveys, share them with players, and view beautiful analytics to craft the perfect campaign.

**Live Demo:** [https://christophergoot.github.io/rpg-survey](https://christophergoot.github.io/rpg-survey)

## ✨ Features

### For Game Masters
- 📝 **Create Custom Surveys** - Set up surveys with a title, description, and language preferences
- 🔗 **Easy Sharing** - Generate unique shareable links for each survey
- 📊 **Beautiful Analytics** - View response data with interactive Chart.js visualizations
- 👥 **Individual Responses** - See detailed responses from each player
- 💾 **CSV Export** - Export all responses to CSV for further analysis
- 🔒 **Protected Dashboard** - Secure authentication for GM-only features

### For Players
- 🌐 **Bilingual Support** - Complete surveys in English (US) or Spanish (Spain)
- 📱 **Mobile Friendly** - Responsive design works on all devices
- 🎯 **Progress Tracking** - Visual progress bar shows completion status
- ✅ **Smart Validation** - Real-time feedback on required questions
- 🚀 **Anonymous Option** - Complete surveys with or without providing a name

### Survey Questions
The survey includes 12 comprehensive questions covering:
- **Theme** (multi-select) - Fantasy, Sci-Fi, Horror, Modern, Historical, Cyberpunk, Post-Apocalyptic
- **Setting Details** - Free text for specific worlds/settings
- **Activity Preferences** - Rate interest in Combat, Puzzles, Diplomacy, Exploration
- **Rules Complexity** - Scale from rules-light to crunchy
- **Combat Style** - Narrative/Abstract, Tactical/Grid-based, or Hybrid
- **Campaign Length** - One-shot, Short arc, Medium campaign, or Long-term
- **Session Frequency** - Weekly, Bi-weekly, Monthly, or Flexible
- **Experience Level** - From beginner to veteran player
- **Character Creation** - Pre-gen, Collaborative, or Full player control
- **Tone Preferences** - Serious, Lighthearted, Heroic, Gritty, Mysterious
- **Content Boundaries** - Set comfort levels for various content types
- **Additional Comments** - Free-form feedback for the GM

## 🎨 Design Philosophy

The app features a **sci-fi inspired design** with:
- Deep blues, cyans, and purples color palette
- Subtle bias toward rules-light science fiction themes (questions ordered and worded to gently guide without manipulation)
- Dark mode optimized interface
- Smooth transitions and animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom sci-fi theme
- **React Router v6** - Client-side routing (Hash Router for GitHub Pages)
- **react-i18next** - Internationalization with EN/ES translations

### State Management & Data Fetching
- **Zustand** - Global state (language preference)
- **React Query** - Server state management and caching

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Row Level Security (RLS)** - Database-level access control
- **Supabase Auth** - Email/password authentication for GMs

### Visualizations
- **Chart.js** - Data visualization library
- **react-chartjs-2** - React wrapper for Chart.js
- Bar charts for theme distribution
- Radar charts for activity preferences

### Utilities
- **nanoid** - Unique token generation for shareable survey links

## 📦 Installation

### Prerequisites
- Node.js 18+ and Yarn
- A Supabase account (free tier works fine)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/rpg-survey.git
cd rpg-survey
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Setup Supabase

Follow the detailed instructions in [SETUP.md](SETUP.md), but here's the quick version:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_questions.sql`
   - `supabase/migrations/003_update_theme_to_multi_choice.sql`
3. Get your project URL and anon key from Settings → API

### 4. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Start Development Server
```bash
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🚀 Deployment

The app is configured to deploy to **GitHub Pages** automatically via GitHub Actions.

### Setup GitHub Pages Deployment

1. **Add Supabase credentials to GitHub Secrets:**
   - Go to your repo: Settings → Environments → pages
   - Add two environment secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. **Configure GitHub Pages:**
   - Settings → Pages
   - Source: **GitHub Actions**

3. **Push to main branch:**
   ```bash
   git push origin main
   ```

4. **Update Supabase redirect URLs:**
   - In Supabase Dashboard: Authentication → URL Configuration
   - Add: `https://yourusername.github.io/rpg-survey`

The workflow (`.github/workflows/deploy.yml`) will automatically:
- Build the app with your Supabase credentials
- Deploy to GitHub Pages
- Make it available at `https://yourusername.github.io/rpg-survey`

### Updating the Base Path

If your repository name is different from `rpg-survey`, update the base path in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

## 📖 Usage

### For Game Masters

1. **Sign Up** - Create a GM account with email and password
2. **Create Survey** - Click "Create New Survey" in your dashboard
3. **Configure** - Add title, description, and select supported languages
4. **Share** - Copy the generated link and share with your players
5. **View Results** - Click "View Results" to see responses and analytics
6. **Export Data** - Download responses as CSV for further analysis

### For Players

1. **Open Link** - Click the survey link shared by your GM
2. **Select Language** - Choose English or Spanish
3. **Complete Survey** - Answer all questions (progress bar shows completion)
4. **Submit** - Click submit on the final question
5. **Done!** - Your GM will see your responses

## 🗂️ Project Structure

```
rpg-survey/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment
├── supabase/
│   └── migrations/              # Database schema and seeds
│       ├── 001_initial_schema.sql
│       ├── 002_seed_questions.sql
│       └── 003_update_theme_to_multi_choice.sql
├── src/
│   ├── components/
│   │   ├── common/              # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── results/             # Results dashboard components
│   │   │   ├── ThemeChart.tsx
│   │   │   ├── ActivityPreferencesChart.tsx
│   │   │   ├── SummaryStats.tsx
│   │   │   ├── ResponseList.tsx
│   │   │   └── ExportButton.tsx
│   │   └── survey/              # Survey question components
│   │       ├── QuestionRenderer.tsx
│   │       ├── SingleChoiceQuestion.tsx
│   │       ├── MultiChoiceQuestion.tsx
│   │       ├── ScaleQuestion.tsx
│   │       ├── MultiScaleQuestion.tsx
│   │       ├── TextQuestion.tsx
│   │       └── SurveyProgress.tsx
│   ├── hooks/                   # React hooks
│   │   ├── useAuth.ts
│   │   ├── useSurvey.ts
│   │   ├── useQuestions.ts
│   │   └── useResponses.ts
│   ├── i18n/                    # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en/translation.json
│   │       └── es/translation.json
│   ├── lib/                     # Core configuration
│   │   ├── supabase.ts
│   │   ├── types.ts
│   │   └── chartConfig.ts
│   ├── pages/                   # Route pages
│   │   ├── Landing.tsx
│   │   ├── Signup.tsx
│   │   ├── Login.tsx
│   │   ├── GMDashboard.tsx
│   │   ├── SurveyCreation.tsx
│   │   ├── SurveyCompletion.tsx
│   │   └── ResultsDashboard.tsx
│   ├── stores/                  # Zustand stores
│   │   └── languageStore.ts
│   ├── utils/                   # Utility functions
│   │   ├── analytics.ts
│   │   └── shareTokenGenerator.ts
│   ├── App.tsx                  # Root component with routes
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── .env.example                 # Environment variables template
├── SETUP.md                     # Detailed Supabase setup guide
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

## 🔒 Security

- **Row Level Security (RLS)** - All database tables have RLS policies
- **GM Authentication** - Survey creation requires authentication
- **Anonymous Players** - Players can complete surveys without signing up
- **Environment Variables** - Sensitive credentials stored securely
- **HTTPS Only** - Supabase enforces HTTPS for all connections

## 🌐 Internationalization

The app supports two languages:
- 🇺🇸 **English (United States)**
- 🇪🇸 **Spanish (Spain)**

All UI text and survey questions are fully translated. Language selection is:
- Persistent (saved to localStorage)
- Per-player (players choose their own language)
- GM-controlled (GMs select which languages their survey supports)

## 🎯 Future Enhancements

Potential features for future development:
- Survey templates for quick creation
- Custom questions (GM-defined)
- Email notifications for new responses
- Survey expiration dates
- Advanced analytics (correlations, recommendations)
- Additional languages (French, German, Portuguese)
- Dark/light mode toggle
- PDF export of results
- Response editing capability

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that `.env.local` has the correct Supabase credentials
- Ensure you're using the **anon** key, not the service key
- Restart dev server after changing environment variables

### "Table doesn't exist" error
- Verify SQL migrations ran successfully in Supabase
- Check Table Editor in Supabase dashboard
- Re-run migrations if needed

### Build fails in GitHub Actions
- Ensure environment secrets are added to GitHub
- Check that secret names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Review Actions logs for specific errors

### CORS errors
- Supabase automatically allows requests from any origin with anon key
- If issues persist, check Supabase project settings under API

## 📄 License

MIT License - feel free to use this project for your own campaigns!

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Powered by [Supabase](https://supabase.com)
- Charts by [Chart.js](https://www.chartjs.org)
- Icons from emoji Unicode characters

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Happy Gaming! May your campaigns be epic and your dice rolls natural 20s! 🎲✨**
