# GovTech SaaS Platform: Universal Scheme Engine + AI Document Intelligence

> **Plan Version:** 1.0 | **Created:** 2026-02-03 | **Status:** Verified & Ready for Implementation
>
> **To resume this plan in a new chat:** Just say "Read and implement PLAN.md"

## Executive Summary

Building a **production-grade GovTech SaaS** combining:
1. **Universal Scheme Engine** - Status debugging & information discovery for Indian welfare schemes
2. **AI-Powered Document Intelligence** - RAG pipeline for scheme document Q&A

**Critical Realism Filter** (Samagra-style thinking):
- We're building for **trust-deficit environments** - no login, no PII collection
- Target **"long-tail anxiety" queries** that government SEO misses
- Design for **volunteer maintainability** - non-technical admins must edit rules
- Optimize for **free-tier constraints** - cold starts, connection limits

---

## Phase 1: Foundation (Week 1)

### 1.1 Project Setup
```
samgov/
├── src/
│   ├── app/                    # Next.js 14+ App Router
│   │   ├── (public)/           # Public routes (no auth)
│   │   │   ├── schemes/        # Scheme information pages
│   │   │   ├── debug/          # Rejection debugger
│   │   │   └── ask/            # AI Q&A interface
│   │   ├── (admin)/            # Protected admin routes
│   │   │   ├── dashboard/      # Admin dashboard
│   │   │   ├── rules/          # Decision tree editor
│   │   │   └── documents/      # Document management
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── scheme/             # Scheme-specific components
│   │   ├── debugger/           # Rejection debugger UI
│   │   └── chat/               # AI chat interface
│   ├── lib/
│   │   ├── supabase/           # Supabase client & queries
│   │   ├── rules-engine/       # Decision tree logic
│   │   ├── rag/                # RAG pipeline
│   │   └── utils/              # Utilities
│   └── types/                  # TypeScript types
├── supabase/
│   ├── migrations/             # Database migrations
│   └── seed.sql                # Initial scheme data
└── public/
    └── locales/                # i18n (en, kn)
```

### 1.2 Tech Stack (Justified)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Framework** | Next.js 14+ App Router | ISR for free-tier caching, Server Actions for mutations |
| **Database** | Supabase (Postgres) | Free tier generous, built-in Auth, pgvector for RAG |
| **Vector Search** | pgvector in Supabase | No separate vector DB cost, native Postgres |
| **UI** | shadcn/ui + Tailwind | Accessible, customizable, volunteer-friendly |
| **AI/LLM** | **Google Gemini 1.5 Flash** | FREE: 60 req/min, 1.5M tokens/day |
| **Embeddings** | **Supabase Edge (gte-small)** | FREE: Unlimited, 384 dims |
| **Deployment** | Vercel | Free tier, edge functions, perfect Next.js integration |

**Total Infrastructure Cost: $0/month** (all free tiers)

---

## Phase 2: Database Schema (Week 1)

### 2.1 Core Tables

```sql
-- Schemes master table
CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  name_kn TEXT,
  state TEXT NOT NULL, -- 'central', 'karnataka', 'maharashtra'
  ministry TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'discontinued'
  summary_en TEXT,
  eligibility_summary TEXT,
  benefits_summary TEXT,
  application_url TEXT,
  helpline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Decision trees for rejection debugging (JSONB)
CREATE TABLE decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES schemes(id),
  version INTEGER DEFAULT 1,
  tree JSONB NOT NULL, -- The decision tree structure
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example decision tree JSONB structure:
-- {
--   "root": "q1",
--   "nodes": {
--     "q1": {
--       "type": "question",
--       "text_en": "Is your household income below ₹2 lakh per annum?",
--       "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದ ಆದಾಯ ವಾರ್ಷಿಕ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
--       "options": [
--         {"label": "Yes", "next": "q2"},
--         {"label": "No", "next": "r_income_reject"}
--       ]
--     },
--     "r_income_reject": {
--       "type": "result",
--       "status": "rejected",
--       "reason_en": "Income exceeds ₹2 lakh limit",
--       "fix_en": "If you recently lost income, get updated income certificate from Tahsildar",
--       "documents": ["income_certificate"]
--     }
--   }
-- }

-- Document chunks for RAG
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES schemes(id),
  document_name TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(384), -- pgvector (gte-small via Supabase Edge - FREE)
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON document_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Chat sessions (anonymous, no PII)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  scheme_id UUID REFERENCES schemes(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (uses Supabase Auth)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor', -- 'admin', 'editor', 'viewer'
  states TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for decision tree changes
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Row Level Security (RLS)

```sql
-- Public read access to schemes and decision trees
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON schemes FOR SELECT USING (true);

ALTER TABLE decision_trees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active" ON decision_trees
  FOR SELECT USING (is_active = true);

-- Admin write access
CREATE POLICY "Admin write" ON schemes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
```

---

## Phase 3: Core Features (Week 2-3)

### 3.1 Rejection Debugger (Priority: HIGH)

**User Flow:**
1. User selects scheme (e.g., "Gruha Lakshmi")
2. System presents decision tree as wizard
3. User answers questions step-by-step
4. System shows: rejection reason + actionable fix + required documents

**Implementation:**
```typescript
// src/lib/rules-engine/debugger.ts
interface DebuggerState {
  currentNode: string;
  answers: Record<string, string>;
  path: string[];
}

export function evaluateDecisionTree(
  tree: DecisionTree,
  state: DebuggerState
): DebuggerResult {
  const node = tree.nodes[state.currentNode];

  if (node.type === 'result') {
    return {
      status: node.status,
      reason: node.reason_en,
      fix: node.fix_en,
      documents: node.documents,
      path: state.path
    };
  }

  return {
    type: 'question',
    node: node,
    progress: calculateProgress(state.path, tree)
  };
}
```

### 3.2 AI Document Q&A (Priority: HIGH)

**RAG Pipeline:**
```
BUILD TIME: Documents → Supabase Edge gte-small (384 dims) → pgvector
QUERY TIME: Query → Supabase Edge gte-small (384 dims) → pgvector search → Gemini
```

**Why this approach?**
- Jina free tier = 31 queries/day (UNUSABLE for runtime)
- Supabase Edge Functions with gte-small = FREE + UNLIMITED
- Same model for docs and queries = consistent similarity scores

```typescript
// src/lib/rag/pipeline.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Supabase Edge embedding (FREE, UNLIMITED)
async function embedQueryWithSupabase(text: string): Promise<number[]> {
  const { data, error } = await supabase.functions.invoke('embed', {
    body: { text }
  });
  if (error) throw error;
  return data.embedding; // 384 dimensions
}

export async function askQuestion(
  query: string,
  schemeId: string
): Promise<RAGResponse> {
  // 1. Embed query with Supabase Edge (FREE, UNLIMITED)
  const queryEmbedding = await embedQueryWithSupabase(query);

  // 2. Vector search in Supabase (pgvector)
  const { data: chunks } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: 5,
    filter_scheme_id: schemeId
  });

  // 3. Build prompt with context
  const context = chunks.map(c => c.content).join('\n\n');

  // 4. Call Gemini (FREE: 60 req/min, 1.5M tokens/day)
  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `${SYSTEM_PROMPT}\n\nContext:\n${context}\n\nQuestion: ${query}` }]
    }],
    generationConfig: { temperature: 0.3 }
  });

  return {
    answer: result.response.text(),
    sources: chunks.map(c => ({
      document: c.document_name,
      snippet: c.content.slice(0, 200)
    }))
  };
}
```

---

## Phase 4: Admin Dashboard (Week 3-4)

### 4.1 Visual Decision Tree Editor

**Key Features:**
- Drag-and-drop node editor (using React Flow)
- Preview mode to test decision paths
- Version history with rollback
- Multilingual text editing (en/kn)

### 4.2 Document Upload & Processing

**Flow:**
1. Admin uploads PDF (scheme guidelines, GOs)
2. System extracts text (PDF.js)
3. Chunks text semantically (500 tokens, 50 overlap)
4. Generates embeddings via Supabase Edge
5. Stores in pgvector

---

## Phase 5: Free-Tier Optimizations

### 5.1 Keep-Alive Cron (GitHub Actions)

```yaml
# .github/workflows/keep-alive.yml
name: Keep Alive
on:
  schedule:
    - cron: '0 */12 * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - run: curl -s ${{ secrets.APP_URL }}/api/health
```

### 5.2 Aggressive Caching

```typescript
// src/lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedSchemes = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('schemes')
      .select('*')
      .eq('status', 'active');
    return data;
  },
  ['schemes-list'],
  { revalidate: 3600, tags: ['schemes'] }
);
```

---

## Decisions Made (All Finalized)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Scope** | Karnataka only | Gruha Lakshmi, Yuva Nidhi, Shakti - focused MVP |
| **Languages** | English + Kannada | Matches Karnataka scope |
| **AI Focus** | RAG Document Q&A | High value, proven tech |
| **AI Provider** | Gemini + Supabase Edge | Zero API cost |
| **Admin Auth** | Supabase Auth | Built-in, magic links |
| **Deployment** | Vercel free tier | *.vercel.app domain |

---

## CRITICAL RISK ANALYSIS (Post-Audit)

### SHOWSTOPPERS IDENTIFIED & MITIGATED

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | Jina free tier = 31 queries/day | CRITICAL | Use Supabase Edge (unlimited) |
| 2 | No legal disclaimer/ToS | CRITICAL | ToS, Privacy, Disclaimers required |
| 3 | No monitoring/alerting | CRITICAL | Health checks + Telegram alerts |
| 4 | Volunteer 90-day burnout | CRITICAL | Succession planning required |
| 5 | Overconfident messaging | HIGH | "may be eligible" not "eligible" |

### FREE TIER REALITY CHECK

| Service | Limit | Actual Capacity | Verdict |
|---------|-------|-----------------|---------|
| **Gemini** | 1.5M tokens/day | ~600 queries/day | Acceptable |
| **Supabase Edge** | Unlimited | Unlimited | Perfect |
| **Supabase DB** | 500MB storage | ~143K chunks | Fine for MVP |
| **Vercel** | 100GB bandwidth | Sufficient | Fine |

### LEGAL REQUIREMENTS (Non-Negotiable)

1. **Disclaimer Banner** (every page):
   ```
   ⚠️ This is NOT a government website. Information is for guidance only.
   Always verify eligibility on official portals before applying.
   ```

2. **Terms of Service:**
   - "Information only, not legal/financial advice"
   - "No guarantee of accuracy or completeness"
   - "User assumes all risk of reliance"

3. **Branding Rules:**
   - NO government logos/emblems
   - Clear "Independent Citizen Initiative" label
   - App name: "SchemeHelper" or "Yojana Sahayak"

### TRUST-BUILDING MESSAGING

**WRONG:** "You are eligible for Gruha Lakshmi!"

**RIGHT:** "Based on the criteria you provided, you may meet the basic eligibility requirements. However, additional criteria may apply. Always verify on the official Seva Sindhu portal."

---

## Implementation Order (REVISED)

### Phase 1: Foundation + Legal (Week 1)
1. Project scaffold - Next.js + Supabase + shadcn/ui
2. Database schema - Migrations + seed data
3. Legal framework - ToS, Privacy Policy, Disclaimer Banner
4. Health check API - Monitoring foundation

### Phase 2: Core Features (Week 2-3)
5. Rejection Debugger - Decision tree wizard + validation
6. RAG pipeline - Supabase Edge embeddings + Gemini
7. Document ingestion - PDF upload + chunking

### Phase 3: Admin + Polish (Week 3-4)
8. Admin dashboard - Decision tree editor with validation
9. Monitoring & alerts - Telegram bot, health checks
10. i18n - English + Kannada

### Phase 4: Launch Prep (Week 4)
11. Content seeding - 3 Karnataka schemes fully populated
12. User testing - 10 real users test all flows
13. Deploy - Vercel + production Supabase

---

## MANDATORY LAUNCH CHECKLIST

**Legal (BLOCKING):**
- [ ] Disclaimer banner on EVERY page
- [ ] Terms of Service page published
- [ ] Privacy Policy page published
- [ ] "NOT A GOVERNMENT WEBSITE" visible above fold
- [ ] No government logos/emblems anywhere

**Technical (BLOCKING):**
- [ ] Health check endpoint returning 200
- [ ] Monitoring alerts configured (Telegram)
- [ ] All decision trees pass validation
- [ ] Rate limiting on AI endpoints
- [ ] Error boundaries on all pages

**Content (BLOCKING):**
- [ ] At least 3 schemes fully populated
- [ ] All Kannada text reviewed by native speaker
- [ ] Source PDFs attached to each decision tree
- [ ] "Last verified" dates on all scheme pages

**Operations (BLOCKING):**
- [ ] 2+ people can deploy changes
- [ ] Runbook documented for common scenarios
- [ ] Shared credentials in password manager
- [ ] Volunteer communication channel set up

---

## CRITICAL FILES TO CREATE

| File | Purpose | Priority |
|------|---------|----------|
| `src/components/disclaimer-banner.tsx` | Legal protection on every page | P0 |
| `src/app/api/health/route.ts` | Monitoring endpoint | P0 |
| `src/lib/decision-tree/validator.ts` | JSONB schema validation | P0 |
| `src/lib/rag/embedding-service.ts` | Abstracted embedding with fallback | P0 |
| `src/middleware.ts` | Rate limiting + error handling | P1 |
| `src/app/(public)/terms/page.tsx` | Terms of Service | P0 |
| `src/app/(public)/privacy/page.tsx` | Privacy Policy | P0 |
| `supabase/functions/embed/index.ts` | Supabase Edge embedding function | P0 |

---

## Reference Repositories

| Category | Repository | Use Case |
|----------|------------|----------|
| **GovTech Platform** | [DIGIT-Core](https://github.com/egovernments/Digit-Core) | Microservices patterns |
| **Scheme Eligibility** | [Scheme Seva](https://github.com/9582anupam/scheme-seva) | India-focused scheme discovery |
| **Rule Engine** | [nested-rules-engine](https://github.com/ayonious/nested-rules-engine) | JSON decision trees |
| **RAG Pipeline** | [RAGFlow](https://github.com/infiniflow/ragflow) | Production RAG reference |
| **Vector Search** | [pgvector](https://github.com/pgvector/pgvector) | Postgres-native vectors |
| **AI Chatbot** | [Jugalbandi-Manager](https://github.com/OpenNyAI/Jugalbandi-Manager) | Multilingual, Bhashini |
| **Next.js Starter** | [nextbase](https://github.com/imbhargav5/nextbase-nextjs-supabase-starter) | Modern stack template |
| **SaaS Template** | [supabase-nextjs-template](https://github.com/Razikus/supabase-nextjs-template) | Production-ready + i18n |

---

## Quick Start Commands

```bash
# Initialize project
npx create-next-app@latest samgov --typescript --tailwind --eslint --app --src-dir

# Add dependencies
npm install @supabase/supabase-js @google/generative-ai zod react-flow-renderer

# Initialize Supabase
npx supabase init
npx supabase start

# Add shadcn/ui
npx shadcn-ui@latest init

# Run dev server
npm run dev
```

---

**Plan Status:** Verified & Ready for Implementation
**Last Updated:** 2026-02-03
