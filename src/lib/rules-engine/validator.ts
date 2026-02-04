/**
 * SamGov Rules Engine Validator
 * Graph validation for decision trees
 *
 * CRITICAL: All decision trees must pass validation before use.
 * Invalid trees can lead to broken wizard experiences.
 */

import type {
  DecisionTree,
  DecisionNode,
  TreeValidationError,
  TreeValidationResult,
} from "./types"
import { safeParseDecisionTree } from "./schema"

/**
 * Validate a decision tree structure
 *
 * Checks:
 * 1. Schema validation (Zod)
 * 2. Start node exists
 * 3. All 'next' references point to existing nodes
 * 4. No orphan nodes (unreachable from start)
 * 5. No cycles (would cause infinite loops)
 * 6. All paths terminate in result nodes
 */
export function validateDecisionTree(data: unknown): TreeValidationResult {
  const errors: TreeValidationError[] = []
  const warnings: string[] = []

  // Step 1: Schema validation
  const parseResult = safeParseDecisionTree(data)

  if (!parseResult.success) {
    return {
      valid: false,
      errors: parseResult.error.issues.map((issue) => ({
        code: "INVALID_STATUS" as const,
        message: issue.message,
        details: issue.path.join("."),
      })),
      warnings: [],
      stats: {
        totalNodes: 0,
        questionNodes: 0,
        resultNodes: 0,
        maxDepth: 0,
        allPathsTerminate: false,
      },
    }
  }

  const tree = parseResult.data as DecisionTree

  // Step 2: Check start node exists
  if (!tree.nodes[tree.start]) {
    errors.push({
      code: "INVALID_START_REF",
      message: `Start node '${tree.start}' does not exist in nodes`,
      nodeId: tree.start,
    })
  }

  // Step 3: Validate all 'next' references
  const allNodeIds = new Set(Object.keys(tree.nodes))
  const referencedNodeIds = new Set<string>()

  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    if (node.type === "question") {
      if (node.options.length === 0) {
        errors.push({
          code: "EMPTY_OPTIONS",
          message: `Question node '${nodeId}' has no options`,
          nodeId,
        })
      }

      for (const option of node.options) {
        referencedNodeIds.add(option.next)
        if (!allNodeIds.has(option.next)) {
          errors.push({
            code: "INVALID_NEXT_REF",
            message: `Node '${nodeId}' references non-existent node '${option.next}'`,
            nodeId,
            details: `Option "${option.label}" -> ${option.next}`,
          })
        }
      }
    }
  }

  // Step 4: Check for orphan nodes (not reachable from start)
  const reachableNodes = findReachableNodes(tree)

  for (const nodeId of allNodeIds) {
    if (!reachableNodes.has(nodeId) && nodeId !== tree.start) {
      // Check if it's also not referenced by any node
      if (!referencedNodeIds.has(nodeId)) {
        errors.push({
          code: "ORPHAN_NODE",
          message: `Node '${nodeId}' is not reachable from start and not referenced`,
          nodeId,
        })
      } else if (!reachableNodes.has(nodeId)) {
        warnings.push(`Node '${nodeId}' is referenced but not reachable from start`)
      }
    }
  }

  // Step 5: Check for cycles
  const cycleResult = detectCycle(tree)
  if (cycleResult.hasCycle) {
    errors.push({
      code: "CYCLE_DETECTED",
      message: `Cycle detected in tree: ${cycleResult.path.join(" -> ")}`,
      details: cycleResult.path.join(" -> "),
    })
  }

  // Step 6: Check all paths terminate
  const terminationResult = checkAllPathsTerminate(tree)
  if (!terminationResult.allTerminate) {
    for (const path of terminationResult.nonTerminatingPaths) {
      errors.push({
        code: "NO_TERMINAL",
        message: `Path does not terminate: ${path.join(" -> ")}`,
        details: path.join(" -> "),
      })
    }
  }

  // Calculate stats
  const stats = calculateTreeStats(tree, reachableNodes)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      ...stats,
      allPathsTerminate: terminationResult.allTerminate,
    },
  }
}

/**
 * Find all nodes reachable from the start node
 */
function findReachableNodes(tree: DecisionTree): Set<string> {
  const reachable = new Set<string>()
  const queue = [tree.start]

  while (queue.length > 0) {
    const nodeId = queue.shift()!

    if (reachable.has(nodeId)) continue
    reachable.add(nodeId)

    const node = tree.nodes[nodeId]
    if (node && node.type === "question") {
      for (const option of node.options) {
        if (!reachable.has(option.next)) {
          queue.push(option.next)
        }
      }
    }
  }

  return reachable
}

/**
 * Detect cycles in the tree using DFS
 */
function detectCycle(tree: DecisionTree): { hasCycle: boolean; path: string[] } {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const path: string[] = []

  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      // Found a cycle
      const cycleStart = path.indexOf(nodeId)
      return true
    }

    if (visited.has(nodeId)) return false

    visited.add(nodeId)
    recursionStack.add(nodeId)
    path.push(nodeId)

    const node = tree.nodes[nodeId]
    if (node && node.type === "question") {
      for (const option of node.options) {
        if (dfs(option.next)) {
          return true
        }
      }
    }

    recursionStack.delete(nodeId)
    path.pop()
    return false
  }

  const hasCycle = dfs(tree.start)
  return { hasCycle, path: hasCycle ? [...path, path[0]] : [] }
}

/**
 * Check that all paths from start terminate in result nodes
 */
function checkAllPathsTerminate(tree: DecisionTree): {
  allTerminate: boolean
  nonTerminatingPaths: string[][]
} {
  const nonTerminatingPaths: string[][] = []
  const maxDepth = 100 // Prevent infinite loops in case of missed cycles

  function explore(nodeId: string, path: string[], depth: number): boolean {
    if (depth > maxDepth) {
      nonTerminatingPaths.push([...path, "...(max depth exceeded)"])
      return false
    }

    const node = tree.nodes[nodeId]

    if (!node) {
      nonTerminatingPaths.push([...path, `${nodeId} (missing)`])
      return false
    }

    if (node.type === "result") {
      return true
    }

    // It's a question node
    let allOptionsTerminate = true
    for (const option of node.options) {
      const optionTerminates = explore(
        option.next,
        [...path, `${nodeId} -[${option.label}]-> ${option.next}`],
        depth + 1
      )
      if (!optionTerminates) {
        allOptionsTerminate = false
      }
    }

    return allOptionsTerminate
  }

  const allTerminate = explore(tree.start, [tree.start], 0)
  return { allTerminate, nonTerminatingPaths }
}

/**
 * Calculate tree statistics
 */
function calculateTreeStats(tree: DecisionTree, reachableNodes: Set<string>) {
  let questionNodes = 0
  let resultNodes = 0

  for (const nodeId of reachableNodes) {
    const node = tree.nodes[nodeId]
    if (node) {
      if (node.type === "question") questionNodes++
      if (node.type === "result") resultNodes++
    }
  }

  // Calculate max depth using BFS
  let maxDepth = 0
  const depths = new Map<string, number>()
  depths.set(tree.start, 0)
  const queue = [tree.start]

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const depth = depths.get(nodeId)!
    maxDepth = Math.max(maxDepth, depth)

    const node = tree.nodes[nodeId]
    if (node && node.type === "question") {
      for (const option of node.options) {
        if (!depths.has(option.next)) {
          depths.set(option.next, depth + 1)
          queue.push(option.next)
        }
      }
    }
  }

  return {
    totalNodes: Object.keys(tree.nodes).length,
    questionNodes,
    resultNodes,
    maxDepth,
  }
}

/**
 * Quick validation check - returns true if valid, false otherwise
 * Use validateDecisionTree for detailed error information
 */
export function isValidDecisionTree(data: unknown): boolean {
  return validateDecisionTree(data).valid
}
