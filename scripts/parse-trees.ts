/**
 * Parse decision trees from seed.sql and output as JSON
 *
 * SQL pattern:
 * WITH scheme AS (SELECT id FROM schemes WHERE slug = 'X')
 * INSERT INTO decision_trees (scheme_id, version, is_active, tree)
 * SELECT scheme.id, 1, true, '{ ... JSON ... }'::jsonb
 * FROM scheme;
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const content = readFileSync(
  join(process.cwd(), "supabase", "seed.sql"),
  "utf-8"
);

const slugs = [
  "gruha-lakshmi",
  "anna-bhagya",
  "shakti",
  "yuva-nidhi",
  "sandhya-suraksha",
  "bhagya-lakshmi",
  "vidyasiri",
  "raitha-shakti",
];

const trees: Record<string, unknown> = {};

for (const slug of slugs) {
  const wherePattern = `WHERE slug = '${slug}'`;
  let searchFrom = 0;
  let found = false;

  while (!found) {
    const whereIdx = content.indexOf(wherePattern, searchFrom);
    if (whereIdx === -1) break;

    // Check if "INSERT INTO decision_trees" appears within 200 chars AFTER
    const nearbyEnd = Math.min(content.length, whereIdx + wherePattern.length + 200);
    const afterText = content.substring(whereIdx, nearbyEnd);
    const hasInsert = afterText.includes("INSERT INTO decision_trees");

    if (!hasInsert) {
      searchFrom = whereIdx + 1;
      continue;
    }

    // Found the CTE pattern - find "true, '" which starts the JSON
    const trueMarker = "true, '";
    const trueIdx = content.indexOf(trueMarker, whereIdx);
    if (trueIdx === -1 || trueIdx > whereIdx + 500) {
      console.log(`${slug}: true marker not found nearby`);
      searchFrom = whereIdx + 1;
      continue;
    }

    const jsonStart = trueIdx + trueMarker.length;

    // Find "'::jsonb" end marker - but we need the LAST one that closes this tree
    // The JSON ends with }'::jsonb\nFROM scheme;
    const fromScheme = "FROM scheme;";
    const fromIdx = content.indexOf(fromScheme, jsonStart);
    if (fromIdx === -1) {
      console.log(`${slug}: FROM scheme not found`);
      searchFrom = whereIdx + 1;
      continue;
    }

    // The end of JSON is just before "'::jsonb\nFROM scheme;"
    const endMarker = "'::jsonb";
    // Search backwards from FROM scheme
    const regionBeforeFrom = content.substring(jsonStart, fromIdx);
    const endOffset = regionBeforeFrom.lastIndexOf(endMarker);
    if (endOffset === -1) {
      console.log(`${slug}: end marker not found`);
      searchFrom = whereIdx + 1;
      continue;
    }

    let jsonStr = regionBeforeFrom.substring(0, endOffset);
    // Unescape PostgreSQL doubled single quotes
    jsonStr = jsonStr.replace(/''/g, "'");

    try {
      const tree = JSON.parse(jsonStr);
      trees[slug] = tree;
      const nodeCount = Object.keys(tree.nodes || {}).length;
      console.log(`${slug}: OK (${nodeCount} nodes)`);
      found = true;
    } catch (e) {
      console.log(`${slug}: PARSE ERROR - ${(e as Error).message}`);
      searchFrom = whereIdx + 1;
    }
  }

  if (!found) {
    console.log(`${slug}: NOT FOUND`);
  }
}

const outPath = join(process.cwd(), "scripts", "decision-trees.json");
writeFileSync(outPath, JSON.stringify(trees, null, 2));
console.log(`\nWrote ${Object.keys(trees).length} trees to ${outPath}`);
