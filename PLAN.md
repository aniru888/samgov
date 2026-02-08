# SamGov: Phase 3 Implementation Plan

> **Plan Version:** 3.0 | **Updated:** 2026-02-08 | **Status:** Week 1 Complete, Week 2 Active

## Project Summary

AI-powered welfare scheme navigator for Karnataka citizens. Helps citizens find schemes, debug rejections, prepare documents — in English and Kannada.

## Current State

| Metric | Value |
|--------|-------|
| Schemes | 51 (32 Karnataka + 15 central + 4 additional) |
| Decision Trees | 8 (107 validated nodes) |
| Document Guides | 20 types (bilingual) |
| Tests | 365/365 passing (33 files) |
| Migrations | 11 applied |
| Languages | English + Kannada |

### What's Built (All Committed)
- Profile-based scheme matching (4-question wizard + `/api/screen`)
- Rejection debugger (8 decision trees, interactive wizard)
- AI Q&A (Cohere embeddings + pgvector + Gemini 2.5 Flash)
- Document preparation guides (20 documents, bilingual)
- Voice I/O (Kannada STT/TTS via Web Speech API)
- PWA + offline caching, WhatsApp share, CSC locator
- Anonymous rejection analytics (`wizard_completions` table)
- Print-friendly results + QR codes
- SEO FAQ sections from decision trees (JSON-LD)
- Full bilingual support (EN/KN)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React, Tailwind, shadcn/ui |
| Database | Supabase (PostgreSQL + pgvector) |
| AI/LLM | Gemini 2.5 Flash (Q&A), Cohere embed-multilingual-v3.0 (embeddings) |
| Vector Search | pgvector (1024-dim cosine similarity) |
| Deployment | Vercel + Supabase Cloud |

---

## Phase 3 Roadmap (3 Weeks)

### Week 1: Foundation — COMPLETE
| # | Feature | Status | Tests |
|---|---------|--------|-------|
| 1 | Profile Wizard UI | Done | 22 tests |
| 2 | Document Preparation Guides | Done | 18 tests |
| 3 | Rejection Analytics | Done | 20 tests |
| 4 | Print-friendly Results + QR | Done | 11 tests |
| 5 | SEO FAQ Sections | Done | 21 tests |

### Week 2: Depth — ACTIVE
| # | Feature | Est. Hours | Status |
|---|---------|-----------|--------|
| 6 | CSC Operator Mode | 6-8 | Planned |
| 7 | 6 New Decision Trees (8→14) | 24-36 | Planned |

### Week 3: Growth + Agent
| # | Feature | Est. Hours | Status |
|---|---------|-----------|--------|
| 8 | Post-Rejection Troubleshooter | 6-8 | Planned |
| 9 | Scheme Health Dashboard | 6-8 | Planned |
| 10 | Conversational Router | 4-6 | Planned |

---

## Feature Details

### Feature 6: CSC Operator Mode
- `/csc` route with batch-screening loop
- Reuses Profile Wizard (#1) + Print (#4) components
- "Next Citizen" flow with session counter
- Larger touch targets, high contrast, minimal chrome

### Feature 7: 6 New Decision Trees
Target schemes (highest usage / most rejections):
1. Gruha Jyothi (free electricity)
2. PM-KISAN (farmer income support)
3. Ayushman Bharat / PMJAY (health insurance)
4. PMAY (housing)
5. Vidya Siri / Fee Reimbursement (students)
6. Bhagyalakshmi (girl child birth)

Each tree requires: official rule research, node writing, Kannada text, Zod validation, seeding.

### Feature 8: Post-Rejection Troubleshooter
- Different from debugger: handles "I applied and got rejected"
- Maps common rejection phrases to decision tree terminal nodes
- Falls back to RAG Q&A for schemes without trees

### Feature 9: Scheme Health Dashboard
- Aggregate stats from wizard_completions
- Charts: completion counts, pass/fail distribution, top rejection reasons
- Prerequisite: Feature 3 data accumulation

### Feature 10: Conversational Router
- Single Gemini call classifies user intent
- Routes to existing deterministic flows
- Foundation for future WhatsApp bot

---

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

---

**Last Updated:** 2026-02-08
