# SamGov

**AI-powered welfare scheme navigator for Karnataka citizens**

SamGov helps citizens find government schemes they qualify for, understand eligibility requirements, and prepare the right documents - in English and Kannada.

---

## The Problem

India has 700+ central and state welfare schemes, but citizens don't know which ones they're eligible for. Current portals (MyScheme, Seva Sindhu) list schemes but don't help with:
- **Discovery**: "I'm a 28-year-old farmer - what schemes exist for me?"
- **Eligibility debugging**: "I applied for Gruha Lakshmi and got rejected - why?"
- **Document preparation**: "I need an Income Certificate - where do I get it?"
- **Language access**: Most tools are English-only; 60%+ of Karnataka's rural population is Kannada-first

## What SamGov Does

### 1. Profile-Based Scheme Matching
4-question wizard (gender, age, occupation, category) instantly matches citizens against 51 schemes with "Likely Match" / "Possible Match" confidence levels.

### 2. Rejection Debugger (Decision Trees)
Interactive step-by-step eligibility checker for 8 Karnataka schemes. Walks citizens through actual government criteria and tells them exactly why they're eligible or not - with fixes for common issues.

### 3. AI-Powered Q&A
Ask questions in plain language (English or Kannada) about any scheme. RAG pipeline retrieves from official documents and generates cited answers using Gemini 2.5 Flash.

### 4. Document Preparation Guides
For 20 common documents (Aadhaar, Income Certificate, Caste Certificate, Land Records, etc.), shows: where to get it, how to apply, timeline, cost, and links to online portals (Nadakacheri, Bhoomi, etc.).

### 5. Voice I/O (Kannada)
Speech-to-text input and text-to-speech output for low-literacy users. Uses Web Speech API with `kn-IN` locale.

### 6. Full Bilingual Support
Every screen works in English and Kannada with one-tap language toggle.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React, Tailwind CSS, shadcn/ui |
| Database | Supabase (PostgreSQL + pgvector) |
| AI/LLM | Google Gemini 2.5 Flash (Q&A), Cohere embed-multilingual-v3 (embeddings) |
| Vector Search | pgvector (1024-dim cosine similarity) |
| Document Parsing | LlamaParse + pdf-parse |
| Deployment | Vercel + Supabase Cloud |

**Runs entirely on free tiers** - zero infrastructure cost.

## Scheme Coverage

- **51 schemes** (32 Karnataka state + 15 central + 4 additional)
- **8 decision trees** with 107 validated nodes
- **20 document preparation guides** with Karnataka-specific portal links
- Categories: Agriculture, Education, Women & Children, Health, Housing, Self-Employment, Social Welfare, Pension

## Architecture

```
User Input (text/voice)
    |
    v
[Profile Wizard]          [AI Q&A]           [Scheme Browser]
    |                         |                     |
    v                         v                     v
/api/screen              /api/ask             /schemes/[slug]
(attribute matching)     (RAG pipeline)       (ISR cached)
    |                    /    |    \                |
    v                   v     v     v               v
 51 schemes        Cohere  pgvector  Gemini    Document Guides
 in Supabase       embed   search    generate  (static, bilingual)
```

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Run development server
npm run dev

# Run tests (313 tests across 27 files)
npx vitest run

# Type check
npx tsc --noEmit

# Production build
npm run build
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
COHERE_API_KEY=
LLAMA_CLOUD_API_KEY=
```

## Project Structure

```
src/
  app/              # Next.js App Router (pages + API routes)
  components/       # React components (scheme, debugger, chat, documents, screener)
  lib/              # Core logic (rules-engine, RAG pipeline, recommendations, i18n)
  types/            # Shared TypeScript types
supabase/
  migrations/       # 10 PostgreSQL migrations
scripts/            # Seed data, embedding scripts, scheme manifest
```

## Roadmap

- [ ] 6 more decision trees (PM-KISAN, PMAY, Ayushman Bharat, etc.)
- [ ] CSC operator mode for batch citizen screening
- [ ] Anonymous completion analytics for policy insights
- [ ] Print-friendly results with QR codes
- [ ] Conversational agent router (intent classification + deterministic dispatch)

## Disclaimer

SamGov is **NOT** an official government website. Information is for guidance only. Always verify eligibility on official Karnataka government portals before applying.

---

Built by [Anirudh Mohan](https://github.com/aniru888)
