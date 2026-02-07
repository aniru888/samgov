import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/screen
 * Multi-scheme profile screener.
 * Takes a citizen profile and returns all potentially matching schemes.
 *
 * This is a simple attribute-based pre-filter, NOT the full decision tree check.
 * It narrows 51 schemes down to a relevant subset based on demographic attributes.
 */

interface CitizenProfile {
  gender?: "male" | "female" | "other";
  age?: number;
  category?: "general" | "obc" | "sc" | "st" | "minority";
  income_level?: "bpl" | "below_2.5l" | "above_2.5l";
  occupation?: "farmer" | "student" | "worker" | "entrepreneur" | "unemployed" | "other";
  district?: string;
}

interface ScreenedScheme {
  slug: string;
  name_en: string;
  name_kn: string | null;
  category: string | null;
  target_group: string | null;
  benefits_summary: string | null;
  application_url: string | null;
  required_documents: string[] | null;
  match_level: "likely" | "possible" | "check";
  match_reasons: string[];
  has_decision_tree: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profile: CitizenProfile = body.profile || body;

    const supabase = await createClient();

    // Fetch all active schemes with decision tree info
    const { data: schemes, error: schemesError } = await supabase
      .from("schemes")
      .select("id, slug, name_en, name_kn, category, target_group, tags, benefits_summary, eligibility_summary, application_url, required_documents")
      .eq("is_active", true)
      .order("name_en");

    if (schemesError) {
      return NextResponse.json(
        { error: "Failed to fetch schemes" },
        { status: 500 }
      );
    }

    // Get schemes that have active decision trees
    const { data: treeSlugs } = await supabase
      .from("decision_trees")
      .select("scheme_id, schemes!inner(slug)")
      .eq("is_active", true);

    const treeSchemeIds = new Set(
      (treeSlugs || []).map((t: { scheme_id: string }) => t.scheme_id)
    );

    // Score each scheme against the profile
    const results: ScreenedScheme[] = [];

    for (const scheme of schemes || []) {
      const reasons: string[] = [];
      let score = 0;
      const tg = (scheme.target_group || "").toLowerCase();
      const tags: string[] = scheme.tags || [];
      const tagsLower = tags.map((t: string) => t.toLowerCase());
      const eligibility = (scheme.eligibility_summary || "").toLowerCase();

      // Gender matching
      if (profile.gender) {
        if (profile.gender === "female" && (
          tg.includes("women") || tg.includes("girl") || tg.includes("pregnant") ||
          tagsLower.some(t => t.includes("women") || t.includes("girl") || t.includes("female"))
        )) {
          score += 3;
          reasons.push("Targets women/girls");
        } else if (profile.gender === "male" && (
          tg.includes("women") || tg.includes("girl") || tg.includes("pregnant")
        )) {
          // Male applying to women-only scheme — skip
          continue;
        }
      }

      // Category (caste) matching
      if (profile.category) {
        const cat = profile.category.toLowerCase();
        if (cat === "sc" || cat === "st") {
          if (tg.includes("sc") || tg.includes("st")) {
            score += 3;
            reasons.push("Targets SC/ST communities");
          }
        }
        if (cat === "obc" && (tg.includes("backward") || tagsLower.some(t => t.includes("obc")))) {
          score += 3;
          reasons.push("Targets OBC/backward classes");
        }
        if (cat === "minority" && (tg.includes("minority") || tg.includes("minorities"))) {
          score += 3;
          reasons.push("Targets minorities");
        }
        // Exclude category-specific schemes for general
        if (cat === "general" && (tg.includes("sc/st") || tg.includes("minority"))) {
          continue;
        }
      }

      // Income matching
      if (profile.income_level) {
        if (profile.income_level === "bpl" && (
          tg.includes("bpl") || tg.includes("poor") || tg.includes("rural poor") || tg.includes("urban poor") ||
          eligibility.includes("bpl") || eligibility.includes("below poverty")
        )) {
          score += 3;
          reasons.push("Targets BPL families");
        }
      }

      // Occupation matching
      if (profile.occupation) {
        if (profile.occupation === "farmer" && (
          tg.includes("farmer") || tagsLower.some(t => t.includes("farmer") || t.includes("agriculture"))
        )) {
          score += 3;
          reasons.push("Targets farmers");
        }
        if (profile.occupation === "student" && (
          tg.includes("student") || tagsLower.some(t => t.includes("student") || t.includes("education") || t.includes("scholarship"))
        )) {
          score += 3;
          reasons.push("Targets students");
        }
        if (profile.occupation === "entrepreneur" && (
          tg.includes("entrepreneur") || tagsLower.some(t => t.includes("entrepreneur") || t.includes("business") || t.includes("self-employment"))
        )) {
          score += 3;
          reasons.push("Targets entrepreneurs");
        }
        if (profile.occupation === "worker" && (
          tg.includes("worker") || tg.includes("unorganized") || tagsLower.some(t => t.includes("labor") || t.includes("worker"))
        )) {
          score += 2;
          reasons.push("Targets workers");
        }
        if (profile.occupation === "unemployed" && (
          tg.includes("youth") || tagsLower.some(t => t.includes("unemploy") || t.includes("employment"))
        )) {
          score += 2;
          reasons.push("Targets unemployed/youth");
        }
      }

      // Age matching
      if (profile.age !== undefined) {
        if (profile.age >= 60 && eligibility.includes("senior")) {
          score += 2;
          reasons.push("Targets seniors (60+)");
        }
        if (profile.age >= 60 && tg.includes("youth")) {
          continue; // Youth schemes not for seniors
        }
        if (profile.age > 35 && tg.includes("youth") && eligibility.includes("under")) {
          continue; // Age-restricted youth schemes
        }
      }

      // Universal schemes (target "All Citizens", "Households") always included
      if (tg.includes("all citizen") || tg.includes("household")) {
        if (reasons.length === 0) {
          reasons.push("Available to all citizens");
        }
        score += 1;
      }

      // Include scheme if it has any match or is universal
      if (score > 0 || reasons.length > 0) {
        const matchLevel: "likely" | "possible" | "check" =
          score >= 5 ? "likely" : score >= 2 ? "possible" : "check";

        results.push({
          slug: scheme.slug,
          name_en: scheme.name_en,
          name_kn: scheme.name_kn,
          category: scheme.category,
          target_group: scheme.target_group,
          benefits_summary: scheme.benefits_summary,
          application_url: scheme.application_url,
          required_documents: scheme.required_documents,
          match_level: matchLevel,
          match_reasons: reasons,
          has_decision_tree: treeSchemeIds.has(scheme.id),
        });
      }
    }

    // Sort: likely first, then possible, then check. Within each, tree-equipped first.
    results.sort((a, b) => {
      const levelOrder = { likely: 0, possible: 1, check: 2 };
      const levelDiff = levelOrder[a.match_level] - levelOrder[b.match_level];
      if (levelDiff !== 0) return levelDiff;
      if (a.has_decision_tree !== b.has_decision_tree) {
        return a.has_decision_tree ? -1 : 1;
      }
      return 0;
    });

    return NextResponse.json({
      data: {
        schemes: results,
        total: results.length,
        profile_used: profile,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
