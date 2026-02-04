"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { DecisionTree, DecisionTreeRow } from "@/lib/rules-engine"
import { isValidDecisionTree } from "@/lib/rules-engine"

interface UseDecisionTreeResult {
  tree: DecisionTree | null
  treeId: string | null
  schemeId: string | null
  loading: boolean
  error: Error | null
}

/**
 * Hook to fetch the active decision tree for a scheme
 * @param schemeSlug - The scheme's URL slug
 */
export function useDecisionTree(schemeSlug: string): UseDecisionTreeResult {
  const [tree, setTree] = useState<DecisionTree | null>(null)
  const [treeId, setTreeId] = useState<string | null>(null)
  const [schemeId, setSchemeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTree() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // First, get the scheme ID from the slug
        const { data: scheme, error: schemeError } = await supabase
          .from("schemes")
          .select("id")
          .eq("slug", schemeSlug)
          .single()

        if (schemeError) {
          throw new Error(`Scheme not found: ${schemeSlug}`)
        }

        if (cancelled) return

        // Then, get the active decision tree for this scheme
        const { data: treeRow, error: treeError } = await supabase
          .from("decision_trees")
          .select("*")
          .eq("scheme_id", scheme.id)
          .eq("is_active", true)
          .single()

        if (treeError) {
          throw new Error(`No active decision tree found for scheme: ${schemeSlug}`)
        }

        if (cancelled) return

        const row = treeRow as DecisionTreeRow

        // Validate the tree before using it
        // IMPORTANT: Never use an invalid tree - this could break the wizard
        if (!isValidDecisionTree(row.tree)) {
          throw new Error(
            `Decision tree for ${schemeSlug} is invalid. Please contact support.`
          )
        }

        setTree(row.tree)
        setTreeId(row.id)
        setSchemeId(scheme.id)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Failed to load decision tree"))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchTree()

    return () => {
      cancelled = true
    }
  }, [schemeSlug])

  return { tree, treeId, schemeId, loading, error }
}
