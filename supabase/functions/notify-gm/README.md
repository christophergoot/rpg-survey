# Email Notification Setup

This Edge Function sends email notifications to GMs when players submit survey responses.

## Setup Steps

### 1. Get a Resend API Key (Free)

1. Go to [resend.com](https://resend.com) and create an account
2. Go to API Keys and create a new key
3. Copy the key (starts with `re_`)

Free tier: 100 emails/day, 3,000/month

### 2. Deploy the Edge Function

```bash
# Login to Supabase CLI
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Set the Resend API key as a secret
supabase secrets set RESEND_API_KEY=re_your_key_here

# Deploy the function
supabase functions deploy notify-gm
```

### 3. Done!

The app will automatically call this function when a player submits a survey response.

## Testing

You can test the function manually:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-gm' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"surveyId": "uuid-here", "playerName": "Test Player", "responseId": "uuid-here"}'
```

## Troubleshooting

- **No email received**: Check Supabase logs at Dashboard > Edge Functions > notify-gm > Logs
- **CORS errors**: The function includes CORS headers for browser requests
- **"GM email not found"**: Make sure the GM has a verified email in Supabase Auth

## Custom Domain (Optional)

To send from your own domain instead of `notifications@resend.dev`:

1. Add your domain in Resend dashboard
2. Update the `from` field in the Edge Function
