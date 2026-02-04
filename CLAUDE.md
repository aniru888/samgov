# SamGov Development Guide

> GovTech SaaS for Indian welfare scheme eligibility debugging and AI-powered document Q&A.
> AI assistants: Read this FIRST before any work.

---

## TOP PRIORITY RULES (NON-NEGOTIABLE)

**These rules override all other instructions. Violation is unacceptable.**

1. **NEVER GIVE OVERCONFIDENT ADVICE** - This is GovTech. Wrong advice = real harm to vulnerable citizens. Always say "may be eligible" never "you are eligible". Include disclaimers.

2. **NEVER SKIP LEGAL REQUIREMENTS** - Every page needs disclaimer banner. ToS and Privacy Policy are BLOCKING for launch. No government logos/emblems ever.

3. **NEVER TAKE SHORTCUTS** - Every feature requires full systems-level thinking. No "quick fixes" that skip proper architecture.

4. **NEVER MAKE ASSUMPTIONS** - Ask questions when unclear. Verify requirements before implementing. Government scheme rules are complex - don't guess.

5. **ALWAYS EXPLORE FIRST** - Use explore agents before any implementation. Understand existing code patterns before writing new code.

6. **COMPLETE END-TO-END** - No partial implementations. No "TODO later" comments. Every feature must work fully when marked complete.

7. **TEST EVERYTHING** - Type safety (`npx tsc --noEmit`), build (`npm run build`), console clean. All gates must pass.

8. **TRUST NOTHING FROM GOVERNMENT SOURCES** - Rules change frequently. Always include "Last verified" dates. Link to official sources.

9. **FREE TIER AWARENESS** - We're on $0/month infrastructure. Check rate limits before implementing. Cache aggressively. Never assume unlimited resources.

10. **KANNADA CONTENT REQUIRES HUMAN REVIEW** - Never ship machine-translated Kannada without native speaker verification. Bad translations harm trust.

11. **VERIFY BEFORE CLAIMING COMPLETE** - "It should work" is not verification. TEST IT. PROVE IT. Be skeptical of your own work.

12. **USE SUBAGENTS PRODUCTIVELY** - Use explore agents for unfamiliar code (3+ files). Use specialized agents for their domains. Use code-reviewer after implementation.

13. **DOCUMENT SCHEME SOURCES** - Every decision tree node must link to source circular/GO. No orphan rules without provenance.

14. **NO SILENT FALLBACKS** - When AI fails (rate limit, hallucination detected), TELL THE USER. Don't hide failures behind degraded responses.

---

## Quick Reference

| Component | Location | Tech |
|-----------|----------|------|
| Frontend + API | `src/app/` | Next.js 14+ App Router |
| Components | `src/components/` | React, shadcn/ui, Tailwind |
| Database | `supabase/` | Supabase (Postgres + pgvector) |
| RAG Pipeline | `src/lib/rag/` | Gemini 1.5 Flash, Supabase Edge |
| Decision Trees | `src/lib/rules-engine/` | JSONB, Zod validation |
| Edge Functions | `supabase/functions/` | Deno (Supabase Edge) |

> **For full implementation plan, see [PLAN.md](./PLAN.md).**

---

## Tech Stack

| Layer | Technology | Free Tier Limits |
|-------|------------|------------------|
| **Framework** | Next.js 14+ App Router | Vercel: 100GB bandwidth |
| **Database** | Supabase (Postgres) | 500MB storage, 2GB transfer |
| **Vector Search** | pgvector (384 dims) | Included in Supabase |
| **LLM** | Google Gemini 1.5 Flash | 60 req/min, 1.5M tokens/day (~600 queries) |
| **Embeddings** | Supabase Edge (gte-small) | Unlimited |
| **Auth** | Supabase Auth | 50K MAU |
| **Deployment** | Vercel | Hobby tier |

### Free Tier Budget (MEMORIZE THIS)

| Resource | Daily Limit | Per-Minute | Action if Exceeded |
|----------|-------------|------------|-------------------|
| Gemini tokens | 1.5M | N/A | Queue + "try later" message |
| Gemini requests | N/A | 60 | Client-side rate limiting |
| Supabase Edge | Unlimited | N/A | N/A |
| Vercel bandwidth | ~3GB | N/A | ISR caching reduces this |

---

## Project Structure

```
samgov/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Public routes (NO AUTH)
│   │   │   ├── schemes/[slug]/   # Scheme info pages (ISR)
│   │   │   ├── debug/[slug]/     # Rejection debugger wizard
│   │   │   ├── ask/              # AI Q&A interface
│   │   │   ├── terms/            # Terms of Service (REQUIRED)
│   │   │   └── privacy/          # Privacy Policy (REQUIRED)
│   │   ├── (admin)/              # Protected admin routes
│   │   │   ├── dashboard/        # Admin home
│   │   │   ├── rules/[schemeId]/ # Decision tree editor
│   │   │   └── documents/        # Document upload & management
│   │   ├── api/
│   │   │   ├── health/           # Health check endpoint (REQUIRED)
│   │   │   ├── ask/              # RAG Q&A endpoint
│   │   │   └── documents/        # Document upload
│   │   └── layout.tsx            # Root layout with DisclaimerBanner
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── disclaimer-banner.tsx # REQUIRED on every page
│   │   ├── scheme/               # Scheme-specific components
│   │   ├── debugger/             # Decision tree wizard UI
│   │   └── chat/                 # AI chat interface
│   ├── lib/
│   │   ├── supabase/             # Supabase client & queries
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── admin.ts          # Service role client
│   │   ├── rules-engine/         # Decision tree logic
│   │   │   ├── types.ts          # DecisionTree, Node types
│   │   │   ├── validator.ts      # Zod schema + tree validation
│   │   │   └── debugger.ts       # Tree traversal logic
│   │   ├── rag/                  # RAG pipeline
│   │   │   ├── pipeline.ts       # Main askQuestion function
│   │   │   ├── embeddings.ts     # Supabase Edge embedding
│   │   │   └── prompts.ts        # System prompts
│   │   └── utils/
│   │       ├── rate-limit.ts     # Client-side rate limiting
│   │       └── cache.ts          # unstable_cache wrappers
│   └── types/                    # Shared TypeScript types
├── supabase/
│   ├── migrations/               # SQL migrations
│   ├── seed.sql                  # Initial Karnataka schemes
│   └── functions/
│       └── embed/                # Edge function for embeddings
├── public/
│   └── locales/                  # i18n (en, kn)
├── PLAN.md                       # Full implementation plan
└── CLAUDE.md                     # This file
```

---

## Subagent Strategy

### When to Use Subagents

**ALWAYS prefer subagents for:**
- Exploring unfamiliar code areas (3+ files to check)
- Parallel verification tasks
- Multi-domain features (frontend + database + API)
- Research tasks (finding GitHub repos, reading docs)

**Use direct tools for:**
- Single file edits
- Quick lookups (known file paths)
- Running build/test commands

### Subagent Types

| Agent | Scope | When to Use |
|-------|-------|-------------|
| `Explore` | Codebase research | FIRST step for any task |
| `Plan` | Architecture design | Complex multi-file features |
| `feature-dev:code-architect` | Feature blueprints | Designing new features |
| `feature-dev:code-explorer` | Deep code analysis | Understanding existing patterns |
| `feature-dev:code-reviewer` | Code review | After implementation |
| `code-simplifier:code-simplifier` | Refactoring | Cleaning up code |

### Workflow Pattern

```
1. Explore agent → Understand existing code
2. Plan agent → Design implementation approach
3. Direct implementation → Write code
4. code-reviewer agent → Review changes
5. superpowers:verification-before-completion → Final check
```

---

## Skills (Slash Commands)

### Plugin Skills (Use Proactively)

| Plugin | Key Skills | When to Use |
|--------|-----------|-------------|
| **superpowers** | `brainstorming`, `verification-before-completion`, `systematic-debugging` | Before creative work, before claiming done, when stuck |
| **feature-dev** | `feature-dev` | Guided multi-step feature development |
| **frontend-design** | `frontend-design` | Generating production-grade UI |
| **code-review** | `code-review` | After major implementations |
| **code-simplifier** | `code-simplifier` | Refactoring for clarity |
| **vercel** | `deploy`, `logs`, `setup` | Vercel deployment management |
| **claude-md-management** | `revise-claude-md`, `claude-md-improver` | Updating this file |

### Decision Tree for Skills

```
Starting new feature?
├── Complex/unclear requirements → superpowers:brainstorming
├── Clear requirements → feature-dev:feature-dev
└── UI-heavy feature → frontend-design:frontend-design

During implementation?
├── Need architecture help → feature-dev:code-architect
├── Understanding existing code → feature-dev:code-explorer
└── Stuck on bug → superpowers:systematic-debugging

After implementation?
├── Code quality check → code-review:code-review
├── Simplify/refactor → code-simplifier:code-simplifier
└── Before marking done → superpowers:verification-before-completion

Deploying?
├── First time → vercel:setup
├── Deploy to prod → vercel:deploy
└── Check issues → vercel:logs
```

---

## MCP Servers (Model Context Protocol)

### Active MCPs

| MCP | Purpose | Key Tools |
|-----|---------|-----------|
| **Serena** | Code intelligence | `find_symbol`, `get_symbols_overview`, `replace_symbol_body` |
| **Context7** | Library docs | `resolve-library-id` → `query-docs` |
| **Firebase** | Firebase config | `firebase_get_environment`, `firebase_init` |
| **Claude-in-Chrome** | Browser automation | `read_page`, `computer`, `navigate` |

### Serena Usage (Preferred for Code Analysis)

**Use Serena instead of grep/read when:**
- Looking up specific functions (`find_symbol`)
- Understanding file structure (`get_symbols_overview`)
- Refactoring across files (`rename_symbol`, `replace_symbol_body`)
- Tracing function calls (`find_referencing_symbols`)

**Example workflow:**
```
1. get_symbols_overview(relative_path="src/lib/rag/pipeline.ts")
2. find_symbol(name_path="askQuestion", include_body=True)
3. find_referencing_symbols(name_path="askQuestion", ...)
4. replace_symbol_body(...) or replace_content(...)
```

### Context7 Usage (Library Documentation)

**For Next.js, Supabase, Gemini API docs:**
```
1. resolve-library-id: query="Next.js ISR caching", libraryName="next.js"
2. query-docs: libraryId="/vercel/next.js", query="revalidatePath usage"
```

---

## Architecture Rules

### Decision Trees (JSONB)

**Schema validation is MANDATORY.** Every tree must pass:

```typescript
// src/lib/rules-engine/validator.ts
const NodeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('question'),
    text_en: z.string(),
    text_kn: z.string().optional(),
    options: z.array(z.object({
      label: z.string(),
      next: z.string() // Must reference existing node
    }))
  }),
  z.object({
    type: z.literal('result'),
    status: z.enum(['eligible', 'ineligible', 'needs_review']),
    reason_en: z.string(),
    reason_kn: z.string().optional(),
    fix_en: z.string().optional(),
    documents: z.array(z.string()).optional()
  })
]);
```

**Validation rules:**
- All `next` references must point to existing nodes
- Every path must terminate in a `result` node
- No orphan nodes (unreachable from root)
- No cycles in the graph

### RAG Pipeline

**Embedding consistency is CRITICAL:**
- Documents: 384 dims (gte-small via Supabase Edge)
- Queries: 384 dims (gte-small via Supabase Edge)
- NEVER mix embedding models

**Hallucination prevention:**
- Always show source citations
- If retrieval score < 0.7, say "I'm not sure"
- System prompt: "Only answer from provided context"
- For critical queries (documents, deadlines), fall back to hardcoded data

### Frontend Rules

**Disclaimer banner is NON-NEGOTIABLE:**
```tsx
// Must be in root layout.tsx
<DisclaimerBanner />
// Renders on EVERY page:
// "⚠️ This is NOT a government website. Information is for guidance only."
```

**Result messaging:**
```tsx
// WRONG
<p>You are eligible for Gruha Lakshmi!</p>

// RIGHT
<p>Based on your inputs, you may meet basic eligibility criteria.</p>
<ul>
  <li>Additional criteria may apply</li>
  <li>Rules may have changed recently</li>
  <li>Always verify on official portal</li>
</ul>
<a href="https://sevasindhu.karnataka.gov.in">Check Official Portal →</a>
```

---

## Common Gotchas

### Supabase Connection Pooling

**Use port 6543 (Supavisor) for serverless:**
```typescript
// Connection string format
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### pgvector Similarity Search

**Always use cosine similarity:**
```sql
-- In Supabase RPC function
SELECT *, 1 - (embedding <=> query_embedding) AS similarity
FROM document_chunks
WHERE 1 - (embedding <=> query_embedding) > 0.7
ORDER BY embedding <=> query_embedding
LIMIT 5;
```

### ISR Caching

**Scheme pages should use ISR:**
```typescript
// src/app/(public)/schemes/[slug]/page.tsx
export const revalidate = 3600; // 1 hour

// After admin updates, call:
revalidatePath('/schemes/' + slug);
```

### Gemini Rate Limiting

**Implement client-side throttling:**
```typescript
// Max 1 query per 5 seconds per user
const RATE_LIMIT_MS = 5000;
let lastQueryTime = 0;

async function rateLimitedQuery(query: string) {
  const now = Date.now();
  if (now - lastQueryTime < RATE_LIMIT_MS) {
    throw new Error('Please wait before asking another question');
  }
  lastQueryTime = now;
  return askQuestion(query);
}
```

---

## Quality Gates (NON-NEGOTIABLE)

### Before Every Commit

```bash
# Type safety
npx tsc --noEmit

# Build check
npm run build

# Check for console errors in browser
```

### Before Marking Complete

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] No new TypeScript `any` types
- [ ] Error handling present for all API calls
- [ ] Browser console clean (no warnings)
- [ ] Disclaimer banner visible on new pages
- [ ] Rate limiting in place for AI endpoints
- [ ] Decision trees pass validation
- [ ] Use `superpowers:verification-before-completion`

### Before Launch (BLOCKING)

**Legal:**
- [ ] Disclaimer banner on EVERY page
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] "NOT A GOVERNMENT WEBSITE" visible
- [ ] No government logos/emblems

**Technical:**
- [ ] Health check endpoint returning 200
- [ ] Monitoring alerts configured
- [ ] All decision trees validated
- [ ] Rate limiting on AI endpoints

**Content:**
- [ ] 3+ schemes fully populated
- [ ] Kannada text reviewed by native speaker
- [ ] Source PDFs attached to decision trees
- [ ] "Last verified" dates on all scheme pages

---

## Safety Rules

### Never Modify Without Reading First

- `supabase/migrations/` - Database schema (irreversible in prod)
- `src/lib/supabase/` - Client configuration
- `src/lib/rag/prompts.ts` - System prompts affect all responses
- `.env*` files - Never commit secrets

### Database Changes Require

1. Create migration in `supabase/migrations/`
2. Test locally with `npx supabase db push`
3. Document rollback procedure
4. Never delete columns in production

### Content Changes Require

1. Source document (circular, GO, official FAQ)
2. "Last verified" date
3. For Kannada: native speaker review
4. For decision trees: validation passes

---

## Domain Contexts

### @schemes - Scheme Information

**Tables:** `schemes`
**Key fields:** `slug`, `name_en`, `name_kn`, `eligibility_summary`, `application_url`
**ISR:** Revalidate every hour, on-demand after admin edits

### @decision-trees - Rejection Debugging

**Tables:** `decision_trees`
**Key fields:** `tree` (JSONB), `version`, `is_active`
**Validation:** Zod schema + graph integrity checks
**UI:** React Flow-based visual editor

### @rag - AI Document Q&A

**Tables:** `document_chunks`, `chat_sessions`, `chat_messages`
**Pipeline:** Query → Embed (Supabase Edge) → pgvector search → Gemini
**Safety:** Citation required, confidence threshold, rate limiting

### @admin - Content Management

**Auth:** Supabase Auth with magic links
**Roles:** `admin`, `editor`, `viewer`
**Audit:** All changes logged to `audit_log` table

---

## Reference Repositories

| Category | Repository | Use For |
|----------|------------|---------|
| **GovTech** | [DIGIT-Core](https://github.com/egovernments/Digit-Core) | Architecture patterns |
| **Scheme Eligibility** | [Scheme Seva](https://github.com/9582anupam/scheme-seva) | India-specific reference |
| **Rule Engine** | [nested-rules-engine](https://github.com/ayonious/nested-rules-engine) | JSON decision trees |
| **RAG** | [RAGFlow](https://github.com/infiniflow/ragflow) | Production RAG patterns |
| **Vector Search** | [pgvector](https://github.com/pgvector/pgvector) | Postgres vectors |
| **AI Chatbot** | [Jugalbandi-Manager](https://github.com/OpenNyAI/Jugalbandi-Manager) | Multilingual patterns |
| **Next.js Starter** | [nextbase](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter) | Project scaffold |

---

## Development Commands

```bash
# Initialize project (first time)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
npm install @supabase/supabase-js @google/generative-ai zod
npx supabase init

# Local development
npx supabase start          # Start local Supabase
npm run dev                 # Start Next.js dev server

# Database
npx supabase db push        # Apply migrations
npx supabase db reset       # Reset and reseed

# Quality checks
npx tsc --noEmit            # Type check
npm run build               # Build check
npm run lint                # Lint check

# Deployment
npx vercel                  # Deploy to Vercel
npx supabase db push --db-url "postgres://..."  # Production migration
```

---

## Troubleshooting

### "Embedding dimension mismatch"
- Ensure ALL embeddings use gte-small (384 dims)
- Check `document_chunks.embedding` column is VECTOR(384)
- Re-embed documents if model changed

### "Rate limit exceeded" from Gemini
- Check client-side throttling is in place
- Implement queue with "try again later" message
- Consider caching common queries

### "Decision tree validation failed"
- Check all `next` references point to existing nodes
- Ensure no orphan nodes
- Verify all paths reach a `result` node
- Use `src/lib/rules-engine/validator.ts`

### "Supabase connection timeout"
- Use pooled connection (port 6543)
- Check keep-alive cron is running
- Verify connection string in env vars

---

**Last Updated:** 2026-02-04
**Plan Version:** 1.0
