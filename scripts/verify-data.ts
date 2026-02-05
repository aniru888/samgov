/**
 * Verify seeded data via Supabase REST API
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUGS = [
  "gruha-lakshmi",
  "anna-bhagya",
  "shakti",
  "yuva-nidhi",
  "sandhya-suraksha",
  "bhagya-lakshmi",
  "vidyasiri",
  "raitha-shakti",
];

async function verify() {
  console.log("=== SamGov Data Verification ===\n");

  let allGood = true;

  for (const slug of SLUGS) {
    // Get scheme
    const { data: scheme } = await supabase
      .from("schemes")
      .select("id, name_en, name_kn, department, sources, helpline")
      .eq("slug", slug)
      .single();

    if (!scheme) {
      console.log(`FAIL: ${slug} - scheme not found`);
      allGood = false;
      continue;
    }

    // Get decision tree
    const { data: trees } = await supabase
      .from("decision_trees")
      .select("id, version, tree")
      .eq("scheme_id", scheme.id)
      .eq("is_active", true);

    const hasSources =
      Array.isArray(scheme.sources) && scheme.sources.length > 0;
    const hasTree = trees !== null && trees.length > 0;
    const nodeCount = hasTree
      ? Object.keys((trees[0].tree as Record<string, unknown>).nodes as object || {}).length
      : 0;
    const treeData = hasTree ? trees[0].tree as Record<string, unknown> : null;
    const startNode = treeData ? (treeData.start as string) : "N/A";

    // Validate tree structure
    let treeValid = false;
    if (treeData) {
      const nodes = treeData.nodes as Record<string, Record<string, unknown>>;
      const hasStart = startNode in nodes;
      const resultNodes = Object.values(nodes).filter(
        (n) => n.type === "result"
      );
      const questionNodes = Object.values(nodes).filter(
        (n) => n.type === "question"
      );
      treeValid = hasStart && resultNodes.length > 0 && questionNodes.length > 0;
    }

    const status =
      hasSources && hasTree && treeValid && scheme.name_kn ? "OK" : "WARN";

    if (status !== "OK") allGood = false;

    console.log(`${status}: ${slug}`);
    console.log(`  Name: ${scheme.name_en} (${scheme.name_kn || "no Kannada"})`);
    console.log(`  Dept: ${scheme.department}`);
    console.log(`  Sources: ${hasSources ? scheme.sources.length : "NONE"}`);
    console.log(
      `  Tree: ${hasTree ? `${nodeCount} nodes, start=${startNode}, valid=${treeValid}` : "MISSING"}`
    );
    console.log("");
  }

  // Summary
  console.log("=== Summary ===");
  console.log(`Schemes: ${SLUGS.length}`);

  const { count: treeCount } = await supabase
    .from("decision_trees")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);
  console.log(`Active trees: ${treeCount}`);

  const { count: docCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true });
  console.log(`Documents: ${docCount}`);

  console.log(`\nAll good: ${allGood ? "YES" : "NO - check warnings above"}`);
}

verify().catch(console.error);
