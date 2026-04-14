#!/usr/bin/env node
// Assign temporary passwords to GMs migrated from Supabase.
// Run AFTER scripts/migrate-from-supabase.sh has populated Neon.
//
// Usage:
//   NEON_DB_URL="postgres://..." node scripts/set-temp-passwords.js
//
// Output: prints a table of email → temp password to stdout.
//         Pipe to a file if you want to keep it:
//   NEON_DB_URL="..." node scripts/set-temp-passwords.js > /tmp/gm-temp-passwords.txt
//
// Dependencies: resolved from backend/node_modules (bcryptjs, pg)

"use strict";

const path = require("path");
const { randomBytes } = require("crypto");

// Resolve dependencies from the backend directory
const backendModules = path.join(__dirname, "..", "backend", "node_modules");
const { Pool } = require(path.join(backendModules, "pg"));
const bcrypt = require(path.join(backendModules, "bcryptjs"));

const NEON_DB_URL = process.env.NEON_DB_URL;
if (!NEON_DB_URL) {
  console.error("Error: NEON_DB_URL environment variable is not set.");
  process.exit(1);
}

function generateTempPassword() {
  // 12 URL-safe characters — easy to type, secure enough for a short-lived credential
  return randomBytes(9).toString("base64url").slice(0, 12);
}

async function main() {
  const pool = new Pool({
    connectionString: NEON_DB_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { rows: gms } = await pool.query(
      "SELECT id, email, display_name FROM gm_profiles WHERE password_hash = 'MIGRATION_PENDING' ORDER BY created_at ASC",
    );

    if (gms.length === 0) {
      console.log(
        "No GMs with MIGRATION_PENDING password found. Nothing to do.",
      );
      return;
    }

    console.log(`Found ${gms.length} GM(s) to update.\n`);
    console.log(
      "Email".padEnd(40) + "Display Name".padEnd(30) + "Temp Password",
    );
    console.log("-".repeat(85));

    for (const gm of gms) {
      const tempPassword = generateTempPassword();
      const hash = await bcrypt.hash(tempPassword, 12);

      await pool.query(
        "UPDATE gm_profiles SET password_hash = $1 WHERE id = $2",
        [hash, gm.id],
      );

      console.log(
        String(gm.email).padEnd(40) +
          String(gm.display_name ?? "").padEnd(30) +
          tempPassword,
      );
    }

    console.log("\nDone. Email each GM their temp password.");
    console.log("Remind them to change it after first sign-in.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
