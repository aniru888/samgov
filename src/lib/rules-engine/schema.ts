/**
 * SamGov Rules Engine Schema
 * Zod validation schemas for decision trees
 */

import { z } from "zod"

/**
 * Question option schema
 */
export const QuestionOptionSchema = z.object({
  label: z.string().min(1, "Option label cannot be empty"),
  label_kn: z.string().optional(),
  next: z.string().min(1, "Next node reference cannot be empty"),
})

/**
 * Question node schema
 */
export const QuestionNodeSchema = z.object({
  type: z.literal("question"),
  text_en: z.string().min(1, "Question text cannot be empty"),
  text_kn: z.string().optional(),
  options: z
    .array(QuestionOptionSchema)
    .min(2, "Questions must have at least 2 options")
    .max(6, "Questions should not have more than 6 options"),
})

/**
 * Result status schema - CRITICAL: Use correct language
 */
export const ResultStatusSchema = z.enum(["eligible", "ineligible", "needs_review"])

/**
 * Result node schema
 */
export const ResultNodeSchema = z.object({
  type: z.literal("result"),
  status: ResultStatusSchema,
  reason_en: z.string().min(1, "Result reason cannot be empty"),
  reason_kn: z.string().optional(),
  fix_en: z.string().optional(),
  fix_kn: z.string().optional(),
  next_steps_en: z.string().optional(),
  next_steps_kn: z.string().optional(),
  documents: z.array(z.string()).optional(),
})

/**
 * Decision node schema (discriminated union)
 */
export const DecisionNodeSchema = z.discriminatedUnion("type", [
  QuestionNodeSchema,
  ResultNodeSchema,
])

/**
 * Complete decision tree schema
 */
export const DecisionTreeSchema = z.object({
  start: z.string().min(1, "Start node ID is required"),
  nodes: z.record(z.string(), DecisionNodeSchema).refine(
    (nodes) => Object.keys(nodes).length > 0,
    "Tree must have at least one node"
  ),
})

/**
 * Parse and validate a decision tree from unknown input
 * Throws ZodError if invalid
 */
export function parseDecisionTree(data: unknown) {
  return DecisionTreeSchema.parse(data)
}

/**
 * Safe parse that returns result object
 */
export function safeParseDecisionTree(data: unknown) {
  return DecisionTreeSchema.safeParse(data)
}

/**
 * Type exports for TypeScript inference
 */
export type QuestionOption = z.infer<typeof QuestionOptionSchema>
export type QuestionNode = z.infer<typeof QuestionNodeSchema>
export type ResultNode = z.infer<typeof ResultNodeSchema>
export type DecisionNode = z.infer<typeof DecisionNodeSchema>
export type DecisionTree = z.infer<typeof DecisionTreeSchema>
