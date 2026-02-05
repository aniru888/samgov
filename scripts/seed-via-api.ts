/**
 * Seed SamGov data via Supabase REST API
 * Works without direct database access - uses service_role key + PostgREST.
 *
 * Usage: npx tsx scripts/seed-via-api.ts
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
function loadEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// =====================================================
// SCHEME DATA
// =====================================================
const ALL_SCHEMES = [
  {
    slug: "gruha-lakshmi",
    name_en: "Gruha Lakshmi",
    name_kn: "ಗೃಹ ಲಕ್ಷ್ಮಿ",
    department: "Women and Child Development",
    eligibility_summary:
      "Women who are the head of household listed on BPL/APL/Antyodaya ration card. Family income < ₹2 lakh/year. Neither applicant nor husband should be taxpayer/GST filer. Government employees not eligible.",
    benefits_summary:
      "₹2,000 per month transferred directly to woman head of household bank account via DBT.",
    application_url: "https://sevasindhu.karnataka.gov.in/",
    official_source_url:
      "https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "anna-bhagya",
    name_en: "Anna Bhagya",
    name_kn: "ಅನ್ನ ಭಾಗ್ಯ",
    department: "Food and Civil Supplies",
    eligibility_summary:
      "BPL families with valid Antyodaya or PHH (Priority Household) ration card. Must be Karnataka resident. Family income < ₹2 lakh/year. No separate application needed - automatic via ration card.",
    benefits_summary:
      "10 kg rice per person per month at subsidized rates OR equivalent cash (₹34/kg) transferred to bank account.",
    application_url: "https://ahara.kar.nic.in/",
    official_source_url: "https://ahara.kar.nic.in/",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "shakti",
    name_en: "Shakti",
    name_kn: "ಶಕ್ತಿ",
    department: "Transport",
    eligibility_summary:
      "All women and transgender persons who are permanent Karnataka residents. Age 6+. Valid ID proof required (Aadhaar/Voter ID/DL/Passport). RTC employees not eligible. Only non-AC buses covered.",
    benefits_summary:
      "Free travel on KSRTC, BMTC, NWKRTC, KKRTC non-AC buses within Karnataka. Show original Aadhaar to conductor.",
    application_url: "https://sevasindhu.karnataka.gov.in/",
    official_source_url: "https://shakti.ksrtc.in/",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "yuva-nidhi",
    name_en: "Yuva Nidhi",
    name_kn: "ಯುವ ನಿಧಿ",
    department: "Skill Development, Entrepreneurship and Livelihood",
    eligibility_summary:
      "Unemployed degree/diploma holders who graduated in 2022-23 or 2023-24. Must have studied 6+ years in Karnataka. Unemployed for 6+ months. Not pursuing higher education. Not receiving ESI/PF/NPS or other govt benefits.",
    benefits_summary:
      "₹3,000/month for degree holders, ₹1,500/month for diploma holders. Maximum 2 years or until employment. Free skill training under Kaushalkar.",
    application_url: "https://sevasindhugs.karnataka.gov.in/",
    official_source_url:
      "https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "sandhya-suraksha",
    name_en: "Sandhya Suraksha",
    name_kn: "ಸಂಧ್ಯಾ ಸುರಕ್ಷಾ",
    department: "Social Welfare",
    eligibility_summary:
      "Karnataka residents aged 65+. Annual income of applicant + spouse < ₹20,000. Bank balance < ₹10,000. Must be from unorganized sector (weavers, farmers, fishermen, etc.). No other pension from any source.",
    benefits_summary:
      "₹1,000/month pension. Discounted KSRTC bus passes. Access to govt-supported old age day care facilities.",
    application_url: "https://sevasindhuservices.karnataka.gov.in/",
    official_source_url:
      "https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "bhagya-lakshmi",
    name_en: "Bhagya Lakshmi",
    name_kn: "ಭಾಗ್ಯಲಕ್ಷ್ಮಿ",
    department: "Women and Child Development",
    eligibility_summary:
      "For BPL families with girl child born after March 31, 2006. Registration within 1 year of birth. Max 2 girls per family eligible. Girl must complete education up to 8th grade and not marry before 18.",
    benefits_summary:
      "₹10,000 bond at birth (matures to ₹34,751 at age 18). Health insurance up to ₹25,000/year. Annual scholarship ₹300-₹1,000 for class 1-10.",
    application_url: "https://blakshmi.kar.nic.in/",
    official_source_url: "https://blakshmi.kar.nic.in/",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "vidyasiri",
    name_en: "Vidyasiri Scholarship",
    name_kn: "ವಿದ್ಯಾಸಿರಿ ಸ್ಕಾಲರ್\u200cಶಿಪ್",
    department: "Backward Classes Welfare",
    eligibility_summary:
      "For SC/ST/OBC/Minority students pursuing post-matric courses. Family income ₹1-2.5 lakh/year. Must reside 5+ km from college. 75% attendance required. Max 2 male students per family (no limit for females).",
    benefits_summary:
      "₹1,500/month for 10 months (₹15,000/year) for food and accommodation support.",
    application_url: "https://ssp.postmatric.karnataka.gov.in/",
    official_source_url:
      "https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en",
    last_verified_at: "2026-02-04",
  },
  {
    slug: "raitha-shakti",
    name_en: "Raitha Shakti",
    name_kn: "ರೈತ ಶಕ್ತಿ",
    department: "Agriculture",
    eligibility_summary:
      "Karnataka farmers registered on FRUITS portal. Land holding up to 5 acres maximum. Must have land ownership documents.",
    benefits_summary:
      "₹250 per acre diesel subsidy via DBT. Maximum for 5 acres (₹1,250 total).",
    application_url: "https://fruits.karnataka.gov.in/",
    official_source_url: "https://fruits.karnataka.gov.in/",
    last_verified_at: "2026-02-04",
  },
];

// Sources per scheme
const SCHEME_SOURCES: Record<string, { sources: unknown[]; helpline: unknown }> =
  {
    "gruha-lakshmi": {
      sources: [
        {
          type: "official",
          url: "https://dwcd.karnataka.gov.in/info-2/GRUHALAKSHMI+SCHEME/en",
          title: "WCD Karnataka Official Page",
          used_for: "primary_eligibility",
        },
        {
          type: "official",
          url: "https://dwcd.karnataka.gov.in/41/gruhalakshmi-scheme/en",
          title: "Scheme Guidelines",
          used_for: "detailed_guidelines",
        },
        {
          type: "official",
          url: "https://sevasindhuservices.karnataka.gov.in/",
          title: "Seva Sindhu Portal",
          used_for: "application",
        },
        {
          type: "secondary",
          url: "https://cleartax.in/s/gruha-lakshmi-scheme-karnataka",
          title: "ClearTax Guide",
          used_for: "eligibility_details,documents,exclusions",
        },
      ],
      helpline: {
        phone: ["1902", "08147500500", "08277000555"],
        method: "SMS ration card number",
      },
    },
    "anna-bhagya": {
      sources: [
        {
          type: "official",
          url: "https://ahara.kar.nic.in/",
          title: "Karnataka Ahara Portal",
          used_for: "primary_source",
        },
        {
          type: "secondary",
          url: "https://cleartax.in/s/anna-bhagya-scheme",
          title: "ClearTax Guide",
          used_for: "eligibility,benefits",
        },
        {
          type: "secondary",
          url: "https://www.govtschemes.in/karnataka-anna-bhagya-scheme",
          title: "GovtSchemes.in",
          used_for: "ration_card_types",
        },
      ],
      helpline: { phone: ["1967", "18004259339"], email: "foodcom-ka@nic.in" },
    },
    shakti: {
      sources: [
        {
          type: "official",
          url: "https://yuvakanaja.karnataka.gov.in/591/shakti-yojana/en",
          title: "Yuva Kanaja Official",
          used_for: "primary_eligibility",
        },
        {
          type: "official",
          url: "https://shakti.ksrtc.in/",
          title: "KSRTC Shakti Portal",
          used_for: "bus_service_details",
        },
        {
          type: "official",
          url: "https://sevasindhuservices.karnataka.gov.in/",
          title: "Seva Sindhu Smart Card",
          used_for: "application",
        },
        {
          type: "secondary",
          url: "https://www.govtschemes.in/karnataka-shakti-scheme",
          title: "GovtSchemes.in",
          used_for: "age_limits,bus_types,exclusions",
        },
      ],
      helpline: {
        phone: ["1902", "080-4959-6666"],
        email: "sevasindhu@karnataka.gov.in",
      },
    },
    "yuva-nidhi": {
      sources: [
        {
          type: "official",
          url: "https://kaushalya.karnataka.gov.in/21/yuvanidhi-scheme/en",
          title: "Kaushalya Karnataka Official",
          used_for: "primary_eligibility",
        },
        {
          type: "official",
          url: "https://ceg.karnataka.gov.in/Blog/public/details/YuvaNidhi/en",
          title: "CEG Eligibility Checker",
          used_for: "self_check",
        },
        {
          type: "official",
          url: "https://sevasindhuservices.karnataka.gov.in/directApply.do?serviceId=2079",
          title: "Direct Application Link",
          used_for: "application",
        },
        {
          type: "secondary",
          url: "https://cleartax.in/s/yuva-nidhi-scheme-karnataka",
          title: "ClearTax Guide",
          used_for: "detailed_exclusions",
        },
      ],
      helpline: { phone: ["1800-599-9918", "1902"] },
    },
    "sandhya-suraksha": {
      sources: [
        {
          type: "official",
          url: "https://karunadu.karnataka.gov.in/welfareofdisabled/Pages/Senior-Citizen-Schemes.aspx",
          title: "Karnataka Social Welfare",
          used_for: "primary_source",
        },
        {
          type: "official",
          url: "https://sevasindhuservices.karnataka.gov.in/",
          title: "Seva Sindhu Portal",
          used_for: "application",
        },
        {
          type: "secondary",
          url: "https://www.indiafilings.com/learn/sandhya-surksha-pension-scheme/",
          title: "IndiaFilings Guide",
          used_for: "eligibility,income_limits",
        },
      ],
      helpline: {},
    },
    "bhagya-lakshmi": {
      sources: [
        {
          type: "official",
          url: "https://blakshmi.kar.nic.in/",
          title: "Bhagya Lakshmi Official Portal",
          used_for: "primary_source,application",
        },
        {
          type: "official",
          url: "https://www.myscheme.gov.in/schemes/bys",
          title: "myScheme.gov.in",
          used_for: "government_verification",
        },
        {
          type: "secondary",
          url: "https://cleartax.in/s/bhagyalakshmi-scheme-karnataka",
          title: "ClearTax Guide",
          used_for: "eligibility,benefits",
        },
      ],
      helpline: {},
    },
    vidyasiri: {
      sources: [
        {
          type: "official",
          url: "https://bcwd.karnataka.gov.in/44/vidyasiri/en",
          title: "BCWD Karnataka Official",
          used_for: "primary_eligibility",
        },
        {
          type: "official",
          url: "https://bcwd.karnataka.gov.in/info-2/Scholarships/Vidyasiri/en",
          title: "Vidyasiri Scholarship Info",
          used_for: "detailed_info",
        },
        {
          type: "official",
          url: "https://ssp.postmatric.karnataka.gov.in/",
          title: "SSP Portal",
          used_for: "application",
        },
      ],
      helpline: {
        phone: ["8050770005"],
        email: "bcdbng@kar.nic.in",
        address:
          "No.16/D, 3rd Floor, Devraj Urs Bhavan, Millers Tank Bed Road, Vasanth Nagar, Bangalore – 560052",
      },
    },
    "raitha-shakti": {
      sources: [
        {
          type: "official",
          url: "https://fruits.karnataka.gov.in/",
          title: "FRUITS Portal",
          used_for: "farmer_registration,eligibility",
        },
        {
          type: "secondary",
          url: "https://sarkariyojana.com/raitha-shakti-yojana-karnataka/",
          title: "SarkariYojana Guide",
          used_for: "eligibility,subsidy_amount",
        },
      ],
      helpline: {},
    },
  };

// =====================================================
// DECISION TREES (loaded from pre-parsed JSON file)
// =====================================================
function loadDecisionTrees(): Map<string, Record<string, unknown>> {
  const treesPath = join(process.cwd(), "scripts", "decision-trees.json");
  const data = JSON.parse(readFileSync(treesPath, "utf-8"));
  return new Map(Object.entries(data));
}

// =====================================================
// MAIN
// =====================================================
async function main() {
  console.log("Seeding SamGov via Supabase REST API...\n");

  // 1. Upsert all 8 schemes
  console.log("1. Upserting schemes...");
  for (const scheme of ALL_SCHEMES) {
    const { data: existing } = await supabase
      .from("schemes")
      .select("id, slug")
      .eq("slug", scheme.slug)
      .single();

    if (existing) {
      // Update existing scheme with full data
      const { error } = await supabase
        .from("schemes")
        .update({
          name_en: scheme.name_en,
          name_kn: scheme.name_kn,
          department: scheme.department,
          eligibility_summary: scheme.eligibility_summary,
          benefits_summary: scheme.benefits_summary,
          application_url: scheme.application_url,
          official_source_url: scheme.official_source_url,
          last_verified_at: scheme.last_verified_at,
        })
        .eq("slug", scheme.slug);

      if (error) {
        console.error(`  FAIL update ${scheme.slug}:`, error.message);
      } else {
        console.log(`  UPDATED: ${scheme.slug}`);
      }
    } else {
      // Insert new scheme
      const { error } = await supabase.from("schemes").insert(scheme);

      if (error) {
        console.error(`  FAIL insert ${scheme.slug}:`, error.message);
      } else {
        console.log(`  INSERTED: ${scheme.slug}`);
      }
    }
  }

  // 2. Update sources and helplines
  console.log("\n2. Updating sources & helplines...");
  for (const [slug, data] of Object.entries(SCHEME_SOURCES)) {
    const { error } = await supabase
      .from("schemes")
      .update({
        sources: data.sources,
        helpline: data.helpline,
      })
      .eq("slug", slug);

    if (error) {
      console.error(`  FAIL sources ${slug}:`, error.message);
    } else {
      console.log(`  OK: ${slug}`);
    }
  }

  // 3. Load and insert decision trees
  console.log("\n3. Loading decision trees...");
  const trees = loadDecisionTrees();
  console.log(`   Found ${trees.size} trees`);

  // Get scheme IDs
  const { data: schemes } = await supabase
    .from("schemes")
    .select("id, slug");

  if (!schemes) {
    console.error("Failed to fetch scheme IDs");
    return;
  }

  const schemeIdMap = new Map(schemes.map((s) => [s.slug, s.id]));

  // Delete existing decision trees (they might be incomplete)
  console.log("\n4. Replacing decision trees...");
  const { error: deleteError } = await supabase
    .from("decision_trees")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

  if (deleteError) {
    console.error("  WARN: Could not clear old trees:", deleteError.message);
  }

  for (const [slug, tree] of trees) {
    const schemeId = schemeIdMap.get(slug);
    if (!schemeId) {
      console.error(`  SKIP ${slug}: scheme not found`);
      continue;
    }

    const { error } = await supabase.from("decision_trees").insert({
      scheme_id: schemeId,
      version: 1,
      is_active: true,
      tree: tree,
    });

    if (error) {
      console.error(`  FAIL ${slug}:`, error.message);
    } else {
      console.log(`  OK: ${slug}`);
    }
  }

  // 5. Verify
  console.log("\n--- Verification ---");

  const { data: allSchemes } = await supabase
    .from("schemes")
    .select("slug, name_en");
  console.log(`Schemes: ${allSchemes?.length ?? 0}`);
  allSchemes?.forEach((s) => console.log(`  - ${s.slug}: ${s.name_en}`));

  const { data: activeTrees } = await supabase
    .from("decision_trees")
    .select("scheme_id, is_active")
    .eq("is_active", true);
  console.log(`Active decision trees: ${activeTrees?.length ?? 0}`);

  console.log("\nDone! The debugger wizard should now work.");
  console.log(
    "NOTE: api_usage table still needs migration 008 via SQL Editor."
  );
}

main().catch(console.error);
