/**
 * Seed Schemes Script
 * Inserts/updates schemes from the manifest into Supabase
 * Skips existing schemes (matches on slug)
 *
 * Usage: npx tsx scripts/seed-schemes.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { ALL_MANIFEST_SCHEMES, type SchemeManifestEntry } from "./karnataka-scheme-manifest";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedSchemes() {
  console.log(`\nSeeding ${ALL_MANIFEST_SCHEMES.length} schemes...\n`);

  // Fetch existing schemes to skip
  const { data: existing, error: fetchError } = await supabase
    .from("schemes")
    .select("slug");

  if (fetchError) {
    console.error("Failed to fetch existing schemes:", fetchError);
    process.exit(1);
  }

  const existingSlugs = new Set((existing || []).map((s) => s.slug));
  console.log(`Found ${existingSlugs.size} existing schemes in DB`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const scheme of ALL_MANIFEST_SCHEMES) {
    try {
      if (existingSlugs.has(scheme.slug)) {
        // Update existing scheme with new category/tags data
        const { error } = await supabase
          .from("schemes")
          .update({
            category: scheme.category,
            tags: scheme.tags,
            target_group: scheme.target_group,
            benefits_type: scheme.benefits_type,
            scheme_level: scheme.scheme_level,
            data_source: scheme.data_source,
            is_active: true,
            // Only update name_kn if provided and not already set
            ...(scheme.name_kn ? { name_kn: scheme.name_kn } : {}),
          })
          .eq("slug", scheme.slug);

        if (error) {
          errors.push(`Update ${scheme.slug}: ${error.message}`);
        } else {
          updated++;
          console.log(`  Updated: ${scheme.slug} (${scheme.category})`);
        }
      } else {
        // Insert new scheme
        const { error } = await supabase.from("schemes").insert({
          slug: scheme.slug,
          name_en: scheme.name_en,
          name_kn: scheme.name_kn || null,
          department: scheme.department,
          eligibility_summary: scheme.eligibility_summary,
          benefits_summary: scheme.benefits_summary,
          application_url: scheme.application_url || null,
          official_source_url: scheme.official_source_url || null,
          category: scheme.category,
          tags: scheme.tags,
          target_group: scheme.target_group,
          benefits_type: scheme.benefits_type,
          scheme_level: scheme.scheme_level,
          data_source: scheme.data_source,
          is_active: true,
          last_verified_at: new Date().toISOString(),
        });

        if (error) {
          errors.push(`Insert ${scheme.slug}: ${error.message}`);
        } else {
          inserted++;
          console.log(`  Inserted: ${scheme.slug} (${scheme.category})`);
        }
      }
    } catch (err) {
      errors.push(`${scheme.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`Inserted: ${inserted}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\nErrors:");
    errors.forEach((e) => console.log(`  - ${e}`));
  }

  // Verify total count
  const { count } = await supabase
    .from("schemes")
    .select("*", { count: "exact", head: true });

  console.log(`\nTotal schemes in DB: ${count}`);
}

seedSchemes().catch(console.error);
