#!/usr/bin/env bash
# Migrate rpg-survey data from Supabase to Neon
#
# Prerequisites:
#   - pg_dump and psql installed (comes with PostgreSQL client tools)
#   - SUPABASE_DB_URL set to your Supabase direct connection string
#     (Dashboard → Settings → Database → Connection string → URI → Direct)
#   - NEON_DB_URL set to your Neon connection string
#
# Usage:
#   export SUPABASE_DB_URL="postgresql://postgres:[pw]@db.[ref].supabase.co:5432/postgres"
#   export NEON_DB_URL="postgres://[user]:[pw]@ep-xxx.neon.tech/neondb?sslmode=require"
#   bash scripts/migrate-from-supabase.sh

set -euo pipefail

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to your Supabase direct connection string}"
: "${NEON_DB_URL:?Set NEON_DB_URL to your Neon connection string}"

GM_DUMP="/tmp/rpg_gm_profiles.sql"
DATA_DUMP="/tmp/rpg_surveys_responses.sql"

echo "==> Step 1: Exporting gm_profiles from Supabase..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --column-inserts \
  --no-owner \
  --no-privileges \
  --table=public.gm_profiles \
  -f "$GM_DUMP"

echo "==> Step 2: Exporting surveys + survey_responses from Supabase..."
pg_dump "$SUPABASE_DB_URL" \
  --data-only \
  --no-owner \
  --no-privileges \
  --table=public.surveys \
  --table=public.survey_responses \
  -f "$DATA_DUMP"

echo "==> Step 3: Transforming gm_profiles — adding placeholder password_hash..."
# With --column-inserts, pg_dump writes:
#   INSERT INTO public.gm_profiles (id, email, display_name, created_at) VALUES (...);
# We add password_hash to the column list and append the sentinel value.
# 'MIGRATION_PENDING' is not a valid bcrypt hash, so users cannot log in until they reset.

cp "$GM_DUMP" "${GM_DUMP}.bak"

sed -i '' \
  's/(id, email, display_name, created_at) VALUES/(id, email, display_name, created_at, password_hash) VALUES/' \
  "$GM_DUMP"

sed -i '' \
  "s/);$/, 'MIGRATION_PENDING');/" \
  "$GM_DUMP"

echo "==> Verifying transform (first 5 INSERT lines)..."
grep "^INSERT" "$GM_DUMP" | head -5
echo ""
echo "    Verify the above shows (id, email, display_name, created_at, password_hash)"
echo "    and ends with , 'MIGRATION_PENDING');"
echo ""
read -r -p "Does it look correct? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborting. Restore from backup at ${GM_DUMP}.bak"
  exit 1
fi

echo "==> Step 4: Importing gm_profiles to Neon..."
psql "$NEON_DB_URL" -f "$GM_DUMP"

echo "==> Step 5: Importing surveys + survey_responses to Neon..."
psql "$NEON_DB_URL" -f "$DATA_DUMP"

echo "==> Step 6: Verifying row counts..."
echo ""
echo "--- Supabase ---"
psql "$SUPABASE_DB_URL" -c "
  SELECT 'gm_profiles'     AS \"table\", count(*) FROM gm_profiles
  UNION ALL
  SELECT 'surveys',                       count(*) FROM surveys
  UNION ALL
  SELECT 'survey_responses',              count(*) FROM survey_responses;
"

echo "--- Neon ---"
psql "$NEON_DB_URL" -c "
  SELECT 'gm_profiles'     AS \"table\", count(*) FROM gm_profiles
  UNION ALL
  SELECT 'surveys',                       count(*) FROM surveys
  UNION ALL
  SELECT 'survey_responses',              count(*) FROM survey_responses;
"

echo ""
echo "==> Done!"
echo ""
echo "Next steps:"
echo "  1. Confirm the row counts above match between Supabase and Neon."
echo "  2. All existing GMs have password_hash = 'MIGRATION_PENDING'."
echo "     They cannot log in until they reset their password."
echo "  3. Email GMs their instructions before flipping VITE_API_URL."
echo ""
echo "To list GM emails for your outreach:"
psql "$NEON_DB_URL" -c "SELECT email, display_name FROM gm_profiles ORDER BY created_at;"
