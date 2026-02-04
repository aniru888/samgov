# SamGov UI/UX Design Document

> Karnataka Welfare Scheme Guide - Trustworthy & Accessible Design System
> **Date**: 2026-02-04
> **Status**: Ready for Implementation

---

## 1. Target Users

### Primary Persona: Rural Karnataka Residents
- **Age**: 25-60 years
- **Tech Literacy**: Low to moderate
- **Devices**: Budget Android phones (5-6" screens)
- **Connectivity**: Variable (2G-4G, often unstable)
- **Languages**: Kannada primary, basic English

### Key Needs
- Simple, guided interactions
- Voice input support (hands may be busy/calloused)
- Large touch targets
- Clear visual feedback
- Offline capability for saved data

---

## 2. Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Trustworthy** | Official-looking but clearly NOT government |
| **Accessible** | WCAG AA, large text, high contrast |
| **Mobile-First** | 320px minimum, touch-optimized |
| **Forgiving** | Clear errors, easy recovery, undo support |
| **Bilingual** | Kannada/English with easy toggle |

---

## 3. Design Tokens

### Colors

```css
:root {
  /* Primary - Teal (Trust, Government-adjacent) */
  --color-primary-50: #f0fdfa;
  --color-primary-100: #ccfbf1;
  --color-primary-200: #99f6e4;
  --color-primary-300: #5eead4;
  --color-primary-400: #2dd4bf;
  --color-primary-500: #14b8a6;
  --color-primary-600: #0d9488;
  --color-primary-700: #0f766e;
  --color-primary-800: #115e59;
  --color-primary-900: #134e4a;

  /* Secondary - Warm Orange (Approachable, Action) */
  --color-secondary-50: #fff7ed;
  --color-secondary-100: #ffedd5;
  --color-secondary-200: #fed7aa;
  --color-secondary-300: #fdba74;
  --color-secondary-400: #fb923c;
  --color-secondary-500: #f97316;
  --color-secondary-600: #ea580c;
  --color-secondary-700: #c2410c;

  /* Semantic Colors */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-info: #0284c7;

  /* Neutrals */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;

  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-sans: "Inter", "Noto Sans Kannada", system-ui, sans-serif;
  --font-display: "Inter", "Noto Sans Kannada", system-ui, sans-serif;

  /* Font Sizes (Mobile-first, larger base) */
  --text-xs: 0.875rem;    /* 14px */
  --text-sm: 1rem;        /* 16px */
  --text-base: 1.125rem;  /* 18px - larger base for accessibility */
  --text-lg: 1.25rem;     /* 20px */
  --text-xl: 1.5rem;      /* 24px */
  --text-2xl: 1.875rem;   /* 30px */
  --text-3xl: 2.25rem;    /* 36px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing

```css
:root {
  /* 8px grid system */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### Touch Targets & Radii

```css
:root {
  /* Minimum touch target: 48px (WCAG AAA) */
  --touch-target-min: 48px;
  --touch-target-comfortable: 56px;

  /* Border Radii */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;
}
```

### Shadows & Z-Index

```css
:root {
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 800;
  --z-max: 999;
}
```

---

## 4. Component Specifications

### 4.1 Buttons

```
Primary Button:
- Background: teal-600
- Text: white, font-medium, text-base
- Padding: 16px 24px (ensures 48px height)
- Border-radius: radius-lg (12px)
- Hover: teal-700
- Active: teal-800, scale(0.98)
- Disabled: gray-300, cursor-not-allowed

Secondary Button:
- Background: white
- Border: 2px solid teal-600
- Text: teal-700
- Same dimensions as primary

Icon Button (Voice, etc):
- Size: 56px x 56px (comfortable touch)
- Border-radius: radius-full
- Background: teal-600 (or recording state: red-500)
```

### 4.2 Cards

```
Scheme Card:
- Background: white
- Border: 1px solid gray-200
- Border-radius: radius-xl (16px)
- Padding: space-5 (20px)
- Shadow: shadow-sm, hover: shadow-md
- Min-height: 120px

Content sections:
- Icon/Emoji: 32px, top-left
- Title: text-lg, font-semibold, gray-900
- Description: text-base, gray-600, 2-line clamp
- CTA: text-sm, teal-600, underline on hover
```

### 4.3 Form Inputs

```
Text Input:
- Height: 56px (comfortable touch)
- Padding: 16px
- Border: 2px solid gray-300
- Border-radius: radius-lg
- Focus: border-teal-500, ring-2 ring-teal-200
- Font-size: text-base (18px)
- Placeholder: gray-400

Radio/Checkbox (for wizard):
- Size: 24px x 24px indicator
- Touch area: 48px x 48px minimum
- Gap between indicator and label: space-3
- Label: text-base, gray-800
```

### 4.4 Navigation

```
Bottom Navigation:
- Height: 64px + safe-area-inset-bottom
- Background: white
- Border-top: 1px solid gray-200
- Items: 5 max (Home, Schemes, Check, Chat, Profile)
- Item: icon (24px) + label (text-xs)
- Active: teal-600, inactive: gray-500

Header:
- Height: 56px
- Background: white
- Border-bottom: 1px solid gray-200
- Title: text-lg, font-semibold, center
- Back button: left, 48px touch target
- Language toggle: right
```

### 4.5 Wizard Steps

```
Progress Indicator:
- Height: 4px bar with segments
- Active: teal-600
- Complete: teal-400
- Pending: gray-200
- Step counter: "Step X of Y" text-sm gray-500

Question Card:
- Full width, centered content
- Question: text-xl, font-semibold, gray-900
- Options: vertical stack, 12px gap
- Each option: 56px height card with radio

Navigation:
- Fixed bottom: Back (left), Next (right)
- Back: secondary button
- Next: primary button
- Both: full width on mobile, 48% on tablet+
```

### 4.6 Chat Interface

```
Message Bubble:
- User: teal-100 bg, right-aligned, radius-2xl
- Bot: white bg, gray-200 border, left-aligned
- Max-width: 85%
- Padding: space-4
- Text: text-base

Input Area:
- Fixed bottom (above nav)
- Height: auto, min 56px
- Text input: flex-grow
- Voice button: 48px, right side
- Send button: 48px, teal-600

Citations:
- Collapsible section below bot message
- "Source: [document name]" text-sm gray-500
- Expandable to show context
```

### 4.7 Disclaimer Banner

```
Position: Fixed top (below header)
Height: auto (content-based)
Background: amber-50
Border: 1px solid amber-300
Text: amber-800, text-sm
Icon: warning triangle, amber-600
Dismiss: X button, right side
Z-index: z-sticky (200)

Collapsed state (after dismiss):
- Small floating badge: "Show Disclaimer"
- Position: fixed, top-right
- Click to expand
```

---

## 5. Page Layouts

### 5.1 Homepage

```
┌─────────────────────────────┐
│ Header (Logo + Lang Toggle) │
├─────────────────────────────┤
│ Disclaimer Banner           │
├─────────────────────────────┤
│                             │
│  Hero Section               │
│  "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ"    │
│  [🎤 Voice Search Button]   │
│                             │
├─────────────────────────────┤
│  Quick Actions (3 cards)    │
│  ┌───┐ ┌───┐ ┌───┐         │
│  │📋 │ │🔍 │ │💬 │         │
│  │List│ │Check│ │Ask│      │
│  └───┘ └───┘ └───┘         │
├─────────────────────────────┤
│  Popular Schemes            │
│  [Scheme Card 1]            │
│  [Scheme Card 2]            │
│  [Scheme Card 3]            │
├─────────────────────────────┤
│  Trust Section              │
│  "Not a government website" │
│  Privacy badges             │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘
```

### 5.2 Scheme Listing

```
┌─────────────────────────────┐
│ Header (Back + "Schemes")   │
├─────────────────────────────┤
│ Search Bar + Voice          │
├─────────────────────────────┤
│ Category Tabs (scrollable)  │
│ [All] [Women] [Food] [More] │
├─────────────────────────────┤
│                             │
│  [Scheme Card]              │
│  [Scheme Card]              │
│  [Scheme Card]              │
│  ... (virtualized list)     │
│                             │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘
```

### 5.3 Scheme Detail

```
┌─────────────────────────────┐
│ Header (Back + Share)       │
├─────────────────────────────┤
│ Scheme Header               │
│ 🏠 Gruha Lakshmi            │
│ ₹2000/month                 │
├─────────────────────────────┤
│ Tab Bar                     │
│ [Overview] [Eligibility]    │
│ [Documents] [Apply]         │
├─────────────────────────────┤
│                             │
│  Tab Content Area           │
│  (scrollable)               │
│                             │
├─────────────────────────────┤
│ Sticky CTA                  │
│ [Check My Eligibility]      │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘
```

### 5.4 Debugger Wizard

```
┌─────────────────────────────┐
│ Header (X close)            │
├─────────────────────────────┤
│ Progress Bar                │
│ ████████░░░░ Step 3 of 5    │
├─────────────────────────────┤
│                             │
│  Question                   │
│  "What is your household    │
│   monthly income?"          │
│                             │
│  ○ Below ₹1 lakh/year       │
│  ○ ₹1-2 lakh/year           │
│  ○ ₹2-3 lakh/year           │
│  ○ Above ₹3 lakh/year       │
│                             │
├─────────────────────────────┤
│ [← Back]        [Next →]    │
└─────────────────────────────┘
```

### 5.5 Debugger Result

```
┌─────────────────────────────┐
│ Header (X close)            │
├─────────────────────────────┤
│                             │
│  Result Icon                │
│  ✅ or ⚠️ or ❌             │
│                             │
│  "You MAY be eligible"      │
│  (or issue identified)      │
│                             │
│  ─────────────────────────  │
│                             │
│  Summary Card               │
│  • Criteria met: 4/5        │
│  • Issue: Income exceeds    │
│                             │
│  Recommended Actions        │
│  1. [Action card]           │
│  2. [Action card]           │
│                             │
│  Required Documents         │
│  □ Aadhaar Card             │
│  □ Income Certificate       │
│  □ Ration Card              │
│                             │
│  ─────────────────────────  │
│  ⚠️ Disclaimer text         │
│                             │
├─────────────────────────────┤
│ [Save] [Share] [Apply →]    │
└─────────────────────────────┘
```

### 5.6 AI Chat (Ask)

```
┌─────────────────────────────┐
│ Header (Back + "Ask")       │
├─────────────────────────────┤
│                             │
│  Welcome Message            │
│  "ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ     │
│   ಮಾಡಬಹುದು?"                 │
│                             │
│  Suggested Questions        │
│  [Gruha Lakshmi docs?]      │
│  [Anna Bhagya eligibility?] │
│                             │
│  ─────────────────────────  │
│                             │
│  Chat Messages              │
│  (scrollable)               │
│                             │
│       [User message]  👤    │
│  🤖  [Bot response]         │
│       [Source: PDF name]    │
│                             │
├─────────────────────────────┤
│ [🎤] [Type message...]  [→] │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘
```

### 5.7 Profile Hub

```
┌─────────────────────────────┐
│ Header ("My Profile")       │
├─────────────────────────────┤
│ User Avatar + Name          │
│ Preferred Language: ಕನ್ನಡ   │
│ [Edit Preferences]          │
├─────────────────────────────┤
│                             │
│ Menu Items                  │
│ ┌─────────────────────────┐ │
│ │ 📜 History              │ │
│ │ Chats & checks          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ⭐ Saved                │ │
│ │ Bookmarked schemes      │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 📄 My Documents         │ │
│ │ Uploaded files          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ❓ Help                 │ │
│ │ How to use this app     │ │
│ └─────────────────────────┘ │
│                             │
├─────────────────────────────┤
│ Bottom Navigation           │
└─────────────────────────────┘
```

---

## 6. Interaction Patterns

### 6.1 Voice Input

**Trigger Points:**
- Homepage hero search
- Chat input (microphone button)
- Scheme search bar
- Wizard question (optional voice answer)

**States:**
1. **Idle**: Mic icon (teal-600)
2. **Listening**: Pulsing red circle, "Listening..." text
3. **Processing**: Spinner, "Processing..." text
4. **Result**: Transcript appears in input field
5. **Error**: Error message, retry option

**Implementation:**
```
Primary: Web Speech API (navigator.mediaDevices + SpeechRecognition)
- Language: kn-IN for Kannada, en-IN for English
- Requires internet connection

Fallback: Whisper.cpp WASM
- Triggered when: offline OR Web Speech fails
- Model: ggml-tiny-q5_1.bin (~31MB, cached in IndexedDB)
- First use: Download prompt with progress bar
```

### 6.2 Language Toggle

**Location:** Header (right side), always visible

**Behavior:**
- Default: Detect device language (navigator.language)
- Toggle: Kannada ↔ English
- Persist: localStorage + IndexedDB (for offline)
- Instant switch: No page reload, React context update

**Visual:**
```
[ಕ] toggle to [EN]
- Active language: filled background
- Inactive: outlined
- Touch target: 48px
```

### 6.3 Offline Support

**Cached Content:**
- Scheme list (names, summaries)
- User's saved schemes
- Chat history
- Decision tree structures
- Whisper model (on first voice use)

**Offline Indicators:**
- Banner: "You're offline. Some features limited."
- Disabled states: AI chat send button, apply links
- Available: Browse saved, view history, run cached debugger

### 6.4 Loading States

**Skeleton Loaders:**
- Scheme cards: Gray rectangles with pulse animation
- Chat messages: Typing indicator (3 dots)
- Page transitions: Top progress bar

**Minimum Display Times:**
- Skeleton: 300ms minimum (prevent flash)
- Success toast: 2000ms
- Error toast: 4000ms (more time to read)

### 6.5 Error Handling

**Error Display:**
- Inline errors: Below input, red-600 text
- Toast errors: Bottom of screen, dismissible
- Full-page errors: Friendly illustration + retry button

**Error Messages (Examples):**
```
Network error: "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಇಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
Rate limit: "ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯ ಕಾಯಿರಿ."
Voice failed: "ಧ್ವನಿ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಮಾತನಾಡಿ."
```

---

## 7. Data Storage Strategy

### 7.1 Local-First Architecture

```
┌─────────────────────────────────────────┐
│                Browser                   │
│  ┌─────────────────────────────────┐    │
│  │         IndexedDB               │    │
│  │  ├── user_profile              │    │
│  │  ├── saved_schemes             │    │
│  │  ├── chat_history              │    │
│  │  ├── debug_sessions            │    │
│  │  ├── uploaded_documents        │    │
│  │  └── whisper_model (blob)      │    │
│  └─────────────────────────────────┘    │
│                  │                       │
│                  │ Sync (when online)    │
│                  ▼                       │
└──────────────────┼──────────────────────┘
                   │
         ┌─────────▼─────────┐
         │     Supabase      │
         │  (Optional Sync)  │
         │  ├── profiles     │
         │  ├── saved_items  │
         │  └── chat_logs    │
         └───────────────────┘
```

### 7.2 Storage Schema

```typescript
// IndexedDB Schema
interface UserProfile {
  id: string; // UUID, generated locally
  name?: string;
  preferredLanguage: 'en' | 'kn';
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date; // null = never synced
}

interface SavedScheme {
  id: string;
  schemeSlug: string;
  savedAt: Date;
  notes?: string;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  schemeContext?: string;
  createdAt: Date;
}

interface DebugSession {
  id: string;
  schemeSlug: string;
  answers: Record<string, string>;
  result: DebugResult;
  completedAt: Date;
}
```

### 7.3 Sync Strategy

**When Connected:**
1. Auto-sync on app open (if >1 hour since last sync)
2. Sync on significant action (save scheme, complete debug)
3. Manual sync button in Profile

**Conflict Resolution:**
- Last-write-wins for simple fields
- Merge arrays (saved schemes, chat history)
- Server-authoritative for scheme data

**Privacy:**
- No PII required for local use
- Optional account creation for cross-device sync
- Clear data option always available

---

## 8. Voice API Implementation

### 8.1 Web Speech API (Primary)

```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'kn-IN'; // Kannada
recognition.continuous = false;
recognition.interimResults = true;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Use transcript
};

recognition.onerror = (event) => {
  if (event.error === 'network' || event.error === 'not-allowed') {
    // Fall back to Whisper.cpp WASM
    useWhisperFallback();
  }
};
```

### 8.2 Whisper.cpp WASM (Fallback)

```typescript
// Model loading (one-time, cached in IndexedDB)
const modelUrl = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny-q5_1.bin';

async function loadWhisperModel() {
  // Check IndexedDB cache first
  const cached = await getFromIndexedDB('whisper_model');
  if (cached) return cached;

  // Download and cache
  const response = await fetch(modelUrl);
  const modelData = await response.arrayBuffer();
  await saveToIndexedDB('whisper_model', modelData);
  return modelData;
}

// Usage with whisper.cpp WASM
async function transcribeAudio(audioBlob: Blob) {
  const model = await loadWhisperModel();
  // Initialize WASM module and transcribe
  // Returns: { text: string, language: string }
}
```

### 8.3 Voice Button Component

```tsx
function VoiceButton({ onTranscript, language }) {
  const [state, setState] = useState<'idle' | 'listening' | 'processing'>('idle');

  return (
    <button
      className={cn(
        "w-14 h-14 rounded-full flex items-center justify-center",
        state === 'idle' && "bg-teal-600 text-white",
        state === 'listening' && "bg-red-500 text-white animate-pulse",
        state === 'processing' && "bg-gray-400 text-white"
      )}
      onClick={toggleRecording}
      disabled={state === 'processing'}
    >
      {state === 'idle' && <MicIcon />}
      {state === 'listening' && <StopIcon />}
      {state === 'processing' && <Spinner />}
    </button>
  );
}
```

---

## 9. Accessibility Checklist

### Visual
- [x] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [x] No color-only information conveyance
- [x] Focus indicators visible (2px teal-500 ring)
- [x] Text scalable to 200% without loss
- [x] Reduced motion support (@media prefers-reduced-motion)

### Motor
- [x] Touch targets ≥ 48px
- [x] Adequate spacing between targets (8px min)
- [x] No time-limited interactions
- [x] Alternative to drag gestures (swipe = button)

### Cognitive
- [x] Simple, predictable layouts
- [x] One primary action per screen
- [x] Progress indicators for multi-step flows
- [x] Clear error messages with recovery steps
- [x] Consistent navigation patterns

### Technical
- [x] Semantic HTML (landmarks, headings)
- [x] ARIA labels for icons/buttons
- [x] Form labels associated with inputs
- [x] Skip links for keyboard navigation
- [x] Screen reader announcements for dynamic content

---

## 10. Implementation Checklist

### Phase 1: Design System Setup
- [ ] Install shadcn/ui with custom theme
- [ ] Create design tokens CSS file
- [ ] Configure Tailwind with custom tokens
- [ ] Create base components (Button, Card, Input)
- [ ] Test on mobile viewport (320px)

### Phase 2: Layout & Navigation
- [ ] Implement Header component
- [ ] Implement Bottom Navigation
- [ ] Implement Disclaimer Banner
- [ ] Create page layout wrapper
- [ ] Add language toggle

### Phase 3: Core Pages
- [ ] Redesign Homepage
- [ ] Redesign Scheme Listing
- [ ] Redesign Scheme Detail
- [ ] Build Debugger Wizard
- [ ] Build AI Chat interface

### Phase 4: Profile & Data
- [ ] Build Profile Hub
- [ ] Implement IndexedDB storage
- [ ] Add History view
- [ ] Add Saved Schemes view
- [ ] Add Documents view

### Phase 5: Voice & Offline
- [ ] Implement Web Speech API integration
- [ ] Add Whisper.cpp WASM fallback
- [ ] Test Kannada recognition
- [ ] Implement offline indicators
- [ ] Add service worker for caching

---

## Appendix: Research References

### GovTech Design Patterns
- **GOV.UK Design System**: Clear hierarchy, plain language, accessibility-first
- **DigiLocker**: Trust indicators, minimal UI, government color palette
- **UMANG**: Mobile-first, bottom navigation, vernacular support

### Accessibility Standards
- WCAG 2.1 AA (minimum)
- Mobile Accessibility Guidelines (BBC)
- India's GIGW 3.0 guidelines

### Voice Technology
- Web Speech API (Chrome): kn-IN support confirmed
- Whisper.cpp: MIT license, WASM support, 99 languages
- AI4Bharat IndicWhisper: Optimized for Indian languages

---

**Document Version**: 1.0
**Author**: Claude Code (assisted)
**Review Status**: Ready for implementation
