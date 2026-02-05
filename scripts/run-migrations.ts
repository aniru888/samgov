/**
 * Migration Runner
 * Reads all SQL migration files and seed.sql, executes them against Supabase.
 *
 * Usage: npx tsx scripts/run-migrations.ts
 *
 * Requires DATABASE_URL in .env.local or as environment variable.
 * Format: postgresql://postgres.[ref]:[password]@[host]:5432/postgres
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import pg from "pg";

const { Client } = pg;

// Load .env.local
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    console.error("No .env.local found. Set DATABASE_URL environment variable.");
    return;
  }
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    "DATABASE_URL not set.\n" +
      "Set it in .env.local or as environment variable.\n" +
      "Format: postgresql://postgres.[ref]:[password]@[host]:5432/postgres"
  );
  process.exit(1);
}

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");
const SEED_FILE = join(process.cwd(), "supabase", "seed.sql");

// Migration files in order
const MIGRATION_FILES = [
  "001_initial_schema.sql",
  "002_decision_trees.sql",
  "003_scheme_sources.sql",
  "004_enable_pgvector.sql",
  "005_rag_tables.sql",
  "006_rag_functions.sql",
  "007_embedding_1024.sql",
  "008_api_usage.sql",
];

async function main() {
  console.log("Connecting to Supabase database...");

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected successfully!\n");

    // Test connection
    const res = await client.query("SELECT current_database(), current_user");
    console.log(`Database: ${res.rows[0].current_database}`);
    console.log(`User: ${res.rows[0].current_user}\n`);

    // Run each migration
    for (const filename of MIGRATION_FILES) {
      const filepath = join(MIGRATIONS_DIR, filename);
      if (!existsSync(filepath)) {
        console.error(`  MISSING: ${filename}`);
        continue;
      }

      console.log(`Running ${filename}...`);
      let sql = readFileSync(filepath, "utf-8");

      // Migration 007 wraps in BEGIN/COMMIT - pg client auto-manages transactions
      // Strip explicit BEGIN/COMMIT to avoid nesting issues
      sql = sql.replace(/^\s*BEGIN\s*;\s*$/gm, "");
      sql = sql.replace(/^\s*COMMIT\s*;\s*$/gm, "");

      try {
        await client.query(sql);
        console.log(`  OK: ${filename}`);
      } catch (err) {
        const pgErr = err as { message: string; code?: string; detail?: string };
        // Skip "already exists" errors (idempotent re-runs)
        if (
          pgErr.code === "42P07" || // relation already exists
          pgErr.code === "42710" || // type already exists
          pgErr.code === "42P16" || // constraint already exists
          pgErr.message?.includes("already exists")
        ) {
          console.log(`  SKIP (already exists): ${filename}`);
        } else {
          console.error(`  FAIL: ${filename}`);
          console.error(`  Error: ${pgErr.message}`);
          if (pgErr.detail) console.error(`  Detail: ${pgErr.detail}`);
          // Continue with other migrations even if one fails
        }
      }
    }

    // Run seed
    console.log("\nRunning seed.sql...");
    if (!existsSync(SEED_FILE)) {
      console.error("  MISSING: seed.sql");
    } else {
      const seedSql = readFileSync(SEED_FILE, "utf-8");
      try {
        await client.query(seedSql);
        console.log("  OK: seed.sql");
      } catch (err) {
        const pgErr = err as { message: string; code?: string };
        console.error(`  FAIL: seed.sql`);
        console.error(`  Error: ${pgErr.message}`);
      }
    }

    // Verify
    console.log("\n--- Verification ---");

    try {
      const schemes = await client.query("SELECT count(*) FROM schemes");
      console.log(`Schemes: ${schemes.rows[0].count}`);
    } catch {
      console.log("Schemes table: not found");
    }

    try {
      const trees = await client.query(
        "SELECT count(*) FROM decision_trees WHERE is_active = true"
      );
      console.log(`Active decision trees: ${trees.rows[0].count}`);
    } catch {
      console.log("Decision trees table: not found");
    }

    try {
      const docs = await client.query("SELECT count(*) FROM documents");
      console.log(`Documents: ${docs.rows[0].count}`);
    } catch {
      console.log("Documents table: not found");
    }

    try {
      const ext = await client.query(
        "SELECT extname FROM pg_extension WHERE extname = 'vector'"
      );
      console.log(`pgvector: ${ext.rows.length > 0 ? "enabled" : "not installed"}`);
    } catch {
      console.log("pgvector: check failed");
    }

    console.log("\nDone!");
  } catch (err) {
    const pgErr = err as { message: string };
    console.error("Connection failed:", pgErr.message);
    console.error(
      "\nTroubleshooting:\n" +
        "1. Check DATABASE_URL in .env.local\n" +
        "2. Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres\n" +
        "3. Find your database password in Supabase Dashboard > Settings > Database\n" +
        "4. Find your connection string in Supabase Dashboard > Settings > Database > Connection string"
    );
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
