# Supabase Setup Guide

This guide will walk you through setting up a Supabase project for the RPG Survey application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Access to the Supabase dashboard

## Step 1: Create a New Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: RPG Survey (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait for the project to finish setting up (2-3 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, click on the project to open it
2. In the left sidebar, click on "Settings" (gear icon at the bottom)
3. Click on "API" in the settings menu
4. You'll see two important values:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
5. Keep this tab open - you'll need these values in Step 4

## Step 3: Run Database Migrations

Now we'll create all the necessary database tables and policies.

1. In the Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql` from this repository
4. Click "Run" to execute the migration
5. Repeat for `supabase/migrations/002_seed_questions.sql` to populate the questions

You should see success messages for each migration.

## Step 4: Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the placeholder values with the actual values from Step 2

## Step 5: Enable Email Authentication

1. In the Supabase dashboard, go to "Authentication" → "Providers"
2. Ensure "Email" is enabled (it should be by default)
3. Scroll down to "Email Templates" if you want to customize the signup/login emails
4. Under "Authentication" → "URL Configuration", add your app URLs:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add both:
     - `http://localhost:5173`
     - `https://yourusername.github.io/rpg-survey` (for production)

## Step 6: Verify Your Setup

1. Start your development server:
   ```bash
   yarn dev
   ```

2. Open your browser to `http://localhost:5173`

3. Try to sign up as a GM to verify the connection works

## Database Schema Overview

Your Supabase project now has these tables:

- **surveys**: Stores GM-created surveys
- **survey_responses**: Stores player survey submissions
- **survey_questions**: Predefined question structure
- **question_translations**: English and Spanish translations for all questions
- **gm_profiles**: Extended profile information for Game Masters

## Row Level Security (RLS)

The migrations automatically set up Row Level Security policies to ensure:

- GMs can only see their own surveys and responses
- Players can submit responses anonymously
- Anyone with a share token can view and complete a survey
- Question translations are publicly readable

## Troubleshooting

### "Invalid API key" error

- Double-check your `.env.local` file has the correct values
- Make sure you copied the **anon** key, not the service key
- Restart your dev server after changing `.env.local`

### "Table doesn't exist" error

- Verify that the SQL migrations ran successfully
- Check the "Table Editor" in Supabase dashboard to confirm tables exist
- Re-run the migration if needed

### Authentication not working

- Check that Email authentication is enabled in Supabase
- Verify your redirect URLs are configured correctly
- Check browser console for detailed error messages

### CORS errors

- Supabase should automatically allow requests from any origin with the anon key
- If you see CORS errors, check your Supabase project settings under API

## For Production Deployment

When deploying to GitHub Pages, you'll need to:

1. Add your Supabase credentials to GitHub Secrets:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add two secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

2. Update the redirect URLs in Supabase:
   - Add your GitHub Pages URL to the allowed redirect URLs
   - Format: `https://yourusername.github.io/rpg-survey`

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Need Help?

If you encounter issues:

1. Check the Supabase logs: Dashboard → Logs
2. Check browser console for detailed error messages
3. Review the Supabase documentation
4. Open an issue in the GitHub repository
