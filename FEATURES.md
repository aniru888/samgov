# SamGov Features Documentation

> Domain features, implementation status, and technical details.
> This file grows as features are built. Update after completing each feature.

---

## Feature Status Overview

| Domain | Feature | Status | Priority |
|--------|---------|--------|----------|
| @schemes | Scheme Information Pages | Not Started | P0 |
| @schemes | ISR Caching | Not Started | P1 |
| @debugger | Rejection Debugger Wizard | Complete | P0 |
| @debugger | Decision Tree Validation | Complete | P0 |
| @rag | Document Q&A Query Pipeline | Complete | P0 |
| @rag | Document Ingestion Pipeline | In Progress | P0 |
| @rag | Source Citations | Complete | P0 |
| @admin | Admin Dashboard | Not Started | P1 |
| @admin | Decision Tree Editor | Not Started | P1 |
| @admin | Document Upload API | In Progress | P1 |
| @legal | Disclaimer Banner | Complete | P0 |
| @legal | Terms of Service | Not Started | P0 |
| @legal | Privacy Policy | Not Started | P0 |
| @i18n | English Content | Complete | P0 |
| @i18n | Kannada Content | Not Started | P1 |
| @monitoring | Health Check API | Not Started | P0 |
| @monitoring | Telegram Alerts | Not Started | P2 |

**Legend:** Not Started | In Progress | Complete | Blocked

---

## @schemes - Scheme Information

### Overview
Public-facing pages displaying Karnataka government scheme information with eligibility summaries, application links, and helpline numbers.

### Database Schema
```sql
CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,        -- URL-friendly identifier
  name_en TEXT NOT NULL,            -- English name
  name_kn TEXT,                     -- Kannada name
  state TEXT NOT NULL,              -- 'karnataka'
  ministry TEXT,                    -- Administering ministry
  status TEXT DEFAULT 'active',     -- 'active', 'suspended', 'discontinued'
  summary_en TEXT,                  -- Brief description
  eligibility_summary TEXT,         -- Who can apply
  benefits_summary TEXT,            -- What you get
  application_url TEXT,             -- Official application portal
  helpline TEXT,                    -- Contact number
  last_verified_at TIMESTAMPTZ,     -- When rules were last checked
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Initial Schemes (Karnataka)

| Scheme | Slug | Target Beneficiaries |
|--------|------|---------------------|
| Gruha Lakshmi | `gruha-lakshmi` | Women heads of household |
| Yuva Nidhi | `yuva-nidhi` | Unemployed graduates |
| Shakti | `shakti` | Women (free bus travel) |

### Routes
- `GET /schemes` - List all active schemes
- `GET /schemes/[slug]` - Individual scheme page (ISR cached)

### Implementation Notes
- Use ISR with `revalidate = 3600` (1 hour)
- Call `revalidatePath()` after admin updates
- Always display "Last verified" date
- Link to official portal prominently

### Status: Not Started

---

## @debugger - Rejection Debugger

### Overview
Interactive wizard that helps users understand why their scheme application was rejected and what they can do to fix it.

### Database Schema
```sql
CREATE TABLE decision_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES schemes(id),
  version INTEGER DEFAULT 1,
  tree JSONB NOT NULL,              -- Decision tree structure
  is_active BOOLEAN DEFAULT true,
  source_document TEXT,             -- GO/circular reference
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Decision Tree JSONB Structure
```json
{
  "root": "q1",
  "nodes": {
    "q1": {
      "type": "question",
      "text_en": "Is your household income below ₹2 lakh per annum?",
      "text_kn": "ನಿಮ್ಮ ಕುಟುಂಬದ ಆದಾಯ ವಾರ್ಷಿಕ ₹2 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆಯೇ?",
      "options": [
        {"label_en": "Yes", "label_kn": "ಹೌದು", "next": "q2"},
        {"label_en": "No", "label_kn": "ಇಲ್ಲ", "next": "r_income_reject"}
      ]
    },
    "r_income_reject": {
      "type": "result",
      "status": "ineligible",
      "reason_en": "Income exceeds ₹2 lakh annual limit",
      "reason_kn": "ಆದಾಯ ವಾರ್ಷಿಕ ₹2 ಲಕ್ಷ ಮಿತಿ ಮೀರಿದೆ",
      "fix_en": "If you recently lost income, obtain updated income certificate from Tahsildar office",
      "fix_kn": "ನೀವು ಇತ್ತೀಚೆಗೆ ಆದಾಯ ಕಳೆದುಕೊಂಡಿದ್ದರೆ, ತಹಶೀಲ್ದಾರ್ ಕಚೇರಿಯಿಂದ ನವೀಕರಿಸಿದ ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಿರಿ",
      "documents": ["income_certificate"]
    }
  }
}
```

### Validation Rules
1. All `next` references must point to existing nodes
2. Every path must terminate in a `result` node
3. No orphan nodes (unreachable from root)
4. No cycles in the graph
5. All text fields must have `_en` version at minimum

### User Flow
1. User selects scheme from list
2. System loads active decision tree
3. User answers questions step-by-step
4. Progress indicator shows completion %
5. Result shows: status + reason + fix + required documents
6. Link to official portal for next steps

### Routes
- `GET /debug/[slug]` - Start debugger for scheme
- `POST /api/debug/evaluate` - Evaluate single step (stateless)

### Status: Complete
- Decision tree wizard UI with step-by-step navigation
- Zod schema validation for all trees
- 8 Karnataka schemes with decision trees seeded
- Graph integrity checks (no orphans, no cycles, all paths terminate)

---

## @rag - AI Document Q&A

### Overview
RAG pipeline allowing users to ask natural language questions about scheme documents, with cited sources.

### Database Schema
```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES schemes(id),
  document_name TEXT NOT NULL,      -- Original filename
  document_type TEXT,               -- 'go', 'faq', 'guidelines'
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(384),            -- gte-small dimensions
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,  -- Anonymous tracking
  scheme_id UUID REFERENCES schemes(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),
  role TEXT NOT NULL,               -- 'user', 'assistant'
  content TEXT NOT NULL,
  sources JSONB,                    -- Retrieved chunk references
  confidence FLOAT,                 -- Retrieval confidence score
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Pipeline Architecture (ACTUAL - Updated Feb 2026)
```
User Query
    ↓
Sanitize (prompt injection detection, PII redaction)
    ↓
Check semantic cache (0.94 similarity threshold)
    ↓ (cache miss)
Embed with Cohere embed-multilingual-v3 (1024 dims)
    ↓
Hybrid search: pgvector semantic + full-text keyword (RRF fusion)
    ↓
Confidence scoring (HIGH ≥0.80, MEDIUM ≥0.65)
    ↓
Gemini 2.5 Flash generation (0.3 temp, citation enforcement)
    ↓
Response validation (no forbidden certainty language)
    ↓
Cache response + return with source citations
```

### Document Ingestion Pipeline (In Progress)
```
PDF Upload (admin API)
    ↓
Tier 1: pdf-parse (digital PDFs - instant, free)
    ↓ (if no text found)
Tier 2: LlamaParse (scanned/Kannada PDFs - 10K credits/month)
    ↓
Markdown-aware chunking (~500 tokens)
    ↓
Cohere embed (batch 96, 1024-dim)
    ↓
Store in Supabase pgvector
```

### System Prompt
```
You are a helpful assistant for Indian government welfare schemes.
You ONLY answer questions based on the provided context.
If the context doesn't contain the answer, say "I don't have information about that in the documents I've reviewed."
Always cite which document your answer comes from.
Never make up information about eligibility criteria, deadlines, or required documents.
If asked about current status of applications, direct users to the official portal.
```

### Safety Measures
- Retrieval threshold: 0.7 (below = "I'm not sure")
- Always show source documents
- Rate limit: 1 query per 5 seconds per session
- Daily limit tracking per session
- Fallback to "check official portal" for critical queries

### Routes
- `POST /api/ask` - Submit question
- `GET /api/ask` - Rate limit status
- `POST /api/documents` - Upload document (in progress)
- `GET /api/documents` - List documents (in progress)

### Status: Query Pipeline Complete, Ingestion In Progress

---

## @admin - Admin Dashboard

### Overview
Protected interface for volunteers to manage schemes, decision trees, and documents.

### Database Schema
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'editor',       -- 'admin', 'editor', 'viewer'
  states TEXT[],                    -- States they can edit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL,             -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Role Permissions

| Role | View | Edit | Delete | Manage Users |
|------|------|------|--------|--------------|
| viewer | Yes | No | No | No |
| editor | Yes | Yes | No | No |
| admin | Yes | Yes | Yes | Yes |

### Features
1. **Scheme Management** - Add/edit scheme information
2. **Decision Tree Editor** - Visual node editor (React Flow)
3. **Document Upload** - PDF upload with automatic chunking
4. **Audit Log** - View all changes with rollback capability
5. **User Management** - Invite/remove admin users (admin only)

### Routes
- `/admin/dashboard` - Overview stats
- `/admin/schemes` - Scheme list
- `/admin/rules/[schemeId]` - Decision tree editor
- `/admin/documents` - Document management
- `/admin/users` - User management (admin only)
- `/admin/audit` - Audit log

### Authentication
- Supabase Auth with magic links
- No password storage
- Session-based with secure cookies
- MFA optional but recommended for admins

### Status: Not Started

---

## @legal - Legal Framework

### Overview
Required legal pages and components for compliance and trust.

### Components

#### 1. Disclaimer Banner (P0)
```tsx
// Must appear on EVERY page
<div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm">
  <p className="text-amber-800">
    ⚠️ This is <strong>NOT</strong> a government website.
    Information is for guidance only.
    Always verify on official portals before applying.
  </p>
</div>
```

#### 2. Terms of Service (P0)
Key clauses required:
- "Information only, not legal/financial advice"
- "No guarantee of accuracy or completeness"
- "User assumes all risk of reliance"
- "We are not liable for application outcomes"
- "Content may be outdated - verify official sources"

#### 3. Privacy Policy (P0)
Must disclose:
- No PII collected
- Anonymous session tracking only
- Data retention: 7 days max for chat history
- No third-party data sharing
- Cookie usage (session token only)

### Branding Rules (MANDATORY)
- NO government logos, emblems, or seals
- NO official color schemes (saffron/green/blue government palette)
- Clear "Independent Citizen Initiative" label
- App name: "SchemeHelper" or "Yojana Sahayak"
- NOT: "Karnataka Scheme Portal", "Government Scheme Checker"

### Status: Disclaimer Banner Complete, ToS and Privacy Not Started

---

## @i18n - Internationalization

### Overview
Multi-language support starting with English and Kannada.

### Supported Locales
| Code | Language | Status |
|------|----------|--------|
| `en` | English | Primary |
| `kn` | Kannada | Secondary |

### Translation Strategy
1. **Static content** - JSON translation files in `public/locales/`
2. **Decision trees** - `_en` and `_kn` suffixed fields
3. **Scheme data** - `name_en`, `name_kn` columns
4. **AI responses** - Detect query language, respond in same

### File Structure
```
public/locales/
├── en/
│   ├── common.json
│   ├── debugger.json
│   └── schemes.json
└── kn/
    ├── common.json
    ├── debugger.json
    └── schemes.json
```

### Kannada Quality Rules
- All Kannada MUST be reviewed by native speaker
- No machine translation shipped to production
- Government terminology must match official usage
- Provide English fallback for technical terms

### Status: English Complete, Kannada Not Started
- i18n context provider with English/Kannada toggle implemented
- English translation files complete
- Kannada translation files have placeholder content (needs native review)

---

## @monitoring - System Monitoring

### Overview
Health checks and alerting to catch issues before users do.

### Health Check Endpoint
```typescript
// GET /api/health
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2026-02-04T10:00:00Z",
  "checks": {
    "database": { "status": "ok", "latency_ms": 45 },
    "gemini": { "status": "ok", "latency_ms": 230 },
    "embedding": { "status": "ok" },
    "decision_trees": { "status": "ok", "valid_count": 3 }
  }
}
```

### Alert Triggers
| Condition | Severity | Action |
|-----------|----------|--------|
| Health check fails | Critical | Telegram alert |
| Error rate > 5% | High | Telegram alert |
| Gemini rate limit hit | Medium | Log + queue |
| Decision tree invalid | High | Block + alert |
| No queries in 24h | Low | Daily digest |

### Keep-Alive Cron
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
      - run: curl -sf ${{ secrets.APP_URL }}/api/health || exit 1
```

### Status: Not Started

---

## Scheme-Specific Documentation

### Gruha Lakshmi

**Official Name:** Gruha Lakshmi Scheme
**State:** Karnataka
**Ministry:** Women and Child Development
**Benefit:** ₹2,000/month to women head of household

**Eligibility Criteria:**
- Woman must be head of household
- Family income below ₹2 lakh/year
- Must have ration card (BPL/APL)
- No family member in government employment
- GST registration disqualifies (changed in 2024)

**Required Documents:**
- Aadhaar card
- Ration card
- Income certificate
- Bank account details
- Voter ID (optional)

**Decision Tree Nodes:** ~15
**Source Documents:** GO dated [TBD], FAQ from seva sindhu

**Status:** Not Started

---

### Yuva Nidhi

**Official Name:** Yuva Nidhi Scheme
**State:** Karnataka
**Ministry:** Higher Education
**Benefit:** ₹3,000/month for unemployed graduates

**Eligibility Criteria:**
- Graduate from Karnataka
- Age 18-25
- Unemployed (registered with Employment Exchange)
- Family income below ₹2.5 lakh/year
- Not receiving other unemployment benefits

**Required Documents:**
- Degree certificate
- Aadhaar card
- Income certificate
- Employment Exchange registration
- Bank account details

**Decision Tree Nodes:** ~12
**Source Documents:** GO dated [TBD]

**Status:** Not Started

---

### Shakti (Free Bus)

**Official Name:** Shakti Scheme
**State:** Karnataka
**Ministry:** Transport
**Benefit:** Free travel on KSRTC buses for women

**Eligibility Criteria:**
- Woman resident of Karnataka
- Valid ID proof

**Required Documents:**
- Aadhaar card OR
- Voter ID OR
- Any government ID

**Decision Tree Nodes:** ~8
**Source Documents:** Transport Dept notification [TBD]

**Status:** Not Started

---

## Changelog

### 2026-02-05
- Updated feature statuses to reflect actual implementation state
- Updated RAG pipeline docs (gte-small→Cohere, 384→1024 dims)
- Added document ingestion pipeline architecture (pdf-parse + LlamaParse)

### 2026-02-04
- Initial FEATURES.md created
- Documented all planned features
- Added scheme-specific documentation templates

---

## Contributing

When adding/updating features:

1. Update the **Feature Status Overview** table
2. Add/update the relevant **@domain** section
3. Include:
   - Database schema changes
   - Route definitions
   - Implementation notes
   - Current status
4. For schemes: add to **Scheme-Specific Documentation**
5. Add entry to **Changelog**
