-- ============================================
-- UPDATE RESPONSE PERMISSIONS
-- Grant authenticated users UPDATE and DELETE on survey_responses
-- ============================================

-- Revoke existing permissions
REVOKE ALL ON survey_responses FROM anon, authenticated;

-- Grant new permissions
-- anon: can only insert (submit surveys)
GRANT INSERT ON survey_responses TO anon;

-- authenticated: can do everything (view, update names, delete responses)
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses TO authenticated;

-- Verify
SELECT
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'survey_responses'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- Expected output:
-- anon        | INSERT
-- authenticated | DELETE
-- authenticated | INSERT
-- authenticated | SELECT
-- authenticated | UPDATE
