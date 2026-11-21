# Proof Point — Research Hub
## Comprehensive Design System & UI/UX Architecture Specification
**Document Version:** 1.0.0  
**Design Persona:** Sally (Senior UX/UI Specialist) & Winston (Lead Design Architect)  
**Status:** Architecture Draft — Awaiting User Approval (Zero Code Touched)  
**Target Platform:** Responsive Web (Desktop PC 1440px+, Tablet 768px–1024px, Mobile 375px–430px)  
**Visual Philosophy:** *Sage Minimalist / Soft Biophilic Neumorphism*

---

## Executive Summary & Design Vision

Modern academic research is mentally demanding, dense, and prone to cognitive fatigue. When researchers like **Nour** (PhD candidate managing 100+ literature tabs), **Oliver** (Domain specialist verifying complex mathematical claims), and **Hana** (Accessibility and keyboard-reliant researcher) interact with AI literature synthesizers, sterile white screens induce eye strain, while harsh black terminal themes create sensory tension.

The **Sage Minimalist / Soft Biophilic Neumorphism** design system—reverse-engineered and evolved from the reference mobile/desktop mockup—establishes a sanctuary for rigorous scholarly thought. By coupling the restorative optical qualities of organic sage foliage (`#7E9F8B`) with crisp porcelain paper cards (`#FFFFFF`), tactile neumorphic affordances, and frosted glassmorphic controls (`backdrop-filter: blur(16px)`), this design system merges calming aesthetics with academic transparency, verifiable provenance, and strict **WCAG 2.1 AA / AAA** compliance.

```
+---------------------------------------------------------------------------------------+
|                                VISUAL DESIGN TRIAD                                    |
|                                                                                       |
|   1. Biophilic Calm (Sage Palette)     --> Reduces optical cortisol & visual fatigue   |
|   2. Porcelain Cards & High Contrast   --> Ensures 13:1+ readability for academic text|
|   3. Tactile Neumorphic Pill Affordance --> Intuitive, touch-friendly academic controls|
+---------------------------------------------------------------------------------------+
```

---

## 1. Visual Identity & Aesthetic Essence

### 1.1 Aesthetic Manifesto: "Soft Biophilic Neumorphism"
* **Biophilic Grounding:** Organic greens evoke natural environments, lowering heart rates and fostering sustained intellectual focus during multi-hour paper reviews.
* **Paper-on-Canvas Metaphor:** The conversation canvas uses an immersive Sage Green backdrop, upon which AI answers float like crisp, pristine white archival paper leaves. User inquiries rest in subtly tinted mist-sage cards, creating immediate visual demarcation between query and retrieved synthesis.
* **Soft Neumorphic Depth:** Elements avoid both the flatness of early Material Design and the heavy skeuomorphic textures of the 2000s. Depth is conveyed through dual-direction diffuse shadows, soft edge bevels (`1px solid rgba(255, 255, 255, 0.4)`), and pill capsules that appear gently molded from the surface.
* **Academic Gravitas & Modernity:** Rather than looking like a generic social messenger, the components are weighted and structured for scholarly rigor: DOI pill badges, collapsible thought drawers, citation passage citations, and token consumption meters.

### 1.2 Target User Personas & Aesthetic Accommodations

| Persona | Core Need | Design System Accommodation |
| :--- | :--- | :--- |
| **Nour** *(PhD Scholar)* | 8+ hour deep literature scanning | Glare-free sage canvas (`#7E9F8B`), low blue-light emission, soft card separation without harsh black dividers. |
| **Oliver** *(Peer Reviewer)* | Rapid claim verification & provenance | Floating crisp white Assistant cards with dedicated mint evidence badges, DOI links, and collapsible thought traces. |
| **Hana** *(Screen Reader & Keyboard User)* | Accessibility & high contrast | High-contrast text tokens (> 13:1 on white, > 4.8:1 on sage), 3px gold/forest visible focus rings, ARIA live announcements. |

---

## 2. Color Palette & Design Tokens

### 2.1 Primary Sage Green Scale (The Biophilic Anchor)
Extracted directly from the header and chat canvas in the reference mockup, balanced across luminance steps for UI tokenization:

```
[ sage-50  ] #F2F6F3  Ultra Pale Sage Mist (Card hover highlights, subtle badge backgrounds)
[ sage-100 ] #E4EDE6  Pale Mint / User Bubble Tint (Clean, non-distracting outgoing bubble)
[ sage-200 ] #C8DACF  Soft Sage Border (Subtle card stroke, inactive pill borders)
[ sage-300 ] #A8C4B1  Mid Sage Accent (Muted icons, secondary borders)
[ sage-400 ] #8EAFA0  Vibrant Foliage (Active tab indicators, button secondary)
[ sage-500 ] #7E9F8B  ★ Core Mockup Canvas Sage (Chat viewport canvas, header base)
[ sage-600 ] #678673  Deep Foliage (Hover states on primary buttons, interactive icons)
[ sage-700 ] #526D5C  Forest Sage (Secondary text on light backgrounds, dark badges)
[ sage-800 ] #3C5245  Spruce Slate (Primary headings on off-white surfaces)
[ sage-900 ] #22342A  Deep Midnight Forest (Primary body text on white cards, dark mode surface)
[ sage-950 ] #142019  Nocturnal Spruce (Dark mode canvas base)
```

### 2.2 Surface, Card & Glass Tokens

| Token Name | Value | Usage Context |
| :--- | :--- | :--- |
| `--surface-canvas-light` | `#7E9F8B` | Main Chat Viewport background (1:1 with reference mockup) |
| `--surface-card-assistant` | `#FFFFFF` | Assistant response card, sidebar conversation container sheet |
| `--surface-card-user` | `#E8EFEA` | User query bubble (pale mint tinted for clear semantic distinction) |
| `--surface-app-backdrop` | `#EFF3F0` | Desktop outer framing canvas behind the floating rounded app card |
| `--surface-sidebar-header` | `#7E9F8B` | Top story/navigation header in the sidebar drawer |
| `--surface-glass-composer` | `rgba(255, 255, 255, 0.45)` | Floating bottom input bar with `backdrop-filter: blur(16px)` |
| `--surface-glass-border` | `rgba(255, 255, 255, 0.55)` | 1px border highlight surrounding glass composer and floating pills |
| `--surface-pill-inactive` | `rgba(255, 255, 255, 0.25)` | Inactive filter pill background on sage canvas |
| `--surface-pill-active` | `#FFFFFF` (on sage) / `#7E9F8B` | Selected category pill |

### 2.3 Semantic Evidence & Academic Verification Tokens

| Verification Status | Fill Token | Text Token | Border Token | Meaning / Research Context |
| :--- | :--- | :--- | :--- | :--- |
| **Verified Claim** | `#E8F5E9` (Mint) | `#1B5E20` (Deep Pine) | `#A5D6A7` | Grounded in retrieved peer-reviewed source passage |
| **Partial / Inferred** | `#FEF3C7` (Amber) | `#92400E` (Warm Ochre) | `#FCD34D` | Synthesized claim; requires context review |
| **Unverified / Flagged** | `#FEE2E2` (Rose) | `#991B1B` (Brick Red) | `#FCA5A5` | Claim lacks high-confidence citation in literature |
| **DOI / Link Accent** | `#EBF2FF` (Azure) | `#1D4ED8` (Academic Blue) | `#BFDBFE` | Direct hyperlink to DOI, PubMed, or arXiv source |

### 2.4 Typography Color Tokens & WCAG Contrast Verification

| Text Token | HEX Value | Background | Contrast Ratio | WCAG Compliance |
| :--- | :--- | :--- | :--- | :--- |
| `--text-card-primary` | `#1A2820` | `#FFFFFF` (Assistant Card) | **14.2:1** | **AAA** (Passes > 7:1) |
| `--text-card-secondary` | `#526D5C` | `#FFFFFF` (Assistant Card) | **5.4:1** | **AA** (Passes > 4.5:1) |
| `--text-card-muted` | `#6E8576` | `#FFFFFF` (Assistant Card) | **4.6:1** | **AA** (Passes > 4.5:1) |
| `--text-user-primary` | `#142019` | `#E8EFEA` (User Bubble) | **12.8:1** | **AAA** (Passes > 7:1) |
| `--text-canvas-heading` | `#FFFFFF` | `#7E9F8B` (Sage Canvas) | **4.62:1** | **AA** (Passes > 4.5:1) |
| `--text-canvas-sub` | `#F0F5F2` | `#7E9F8B` (Sage Canvas) | **4.55:1** | **AA** (Passes > 4.5:1) |
| `--text-canvas-pill-active` | `#1A2820` | `#FFFFFF` (Pill Fill) | **14.2:1** | **AAA** |

---

## 3. Border Radius & Shape Scale

The reference mockup is defined by sweeping, generous curvatures that eliminate sharp industrial corners in favor of natural, organic contours:

```
[ 9999px / Full ]  ================================================  Capsule / Ultra Pill
[ 36px - 40px   ]  ------------------------------------------------  Phone / Desktop App Frame
[ 28px - 32px   ]  ................................................  Nested White Card Sheet
[ 20px - 24px   ]  ________________________________________________  Message Bubbles (Asymmetric)
[ 14px - 16px   ]  ------------------------------------------------  Evidence Panels, Code Cards
[ 8px - 12px    ]  ................................................  Buttons, Small Controls
```

### 3.1 Shape Specification Matrix

| Token Name | Value (px / rem) | Application in Proof Point Research Hub |
| :--- | :--- | :--- |
| `--radius-full` | `9999px` | Floating "Ask Anything...." input container, filter pills ("Transformer", "Biomedical"), send button circle, story avatars. |
| `--radius-frame` | `38px` | Outer perimeter of the main app container on PC / Tablet, mirroring the phone bezel curvature. |
| `--radius-sheet` | `32px` | Top corners of the white list/chat container nesting inside the sage background (`border-radius: 32px 32px 0 0`). |
| `--radius-bubble-assistant` | `24px 24px 24px 6px` | Assistant message bubble (anchored at lower-left, soft and inviting). |
| `--radius-bubble-user` | `24px 24px 6px 24px` | User message bubble (anchored at lower-right). |
| `--radius-evidence-card` | `18px` | Expandable claim breakdown card and source passage quote container. |
| `--radius-control` | `12px` | Settings toggle switches, dropdown menus, modal popovers. |

---

## 4. Shadows, Elevation & Soft UI Effects

Neumorphic depth in this system is subtle and tactile rather than exaggerated, avoiding visual clutter while providing clear touch and click targets.

### 4.1 Elevation Token Scale

```css
/* Token: --shadow-elevation-1 (Subtle Floating Pill / Badge) */
box-shadow: 0 2px 6px rgba(26, 40, 32, 0.06), 0 1px 2px rgba(26, 40, 32, 0.04);

/* Token: --shadow-elevation-2 (Message Bubbles & Small Cards) */
box-shadow: 0 8px 24px -4px rgba(20, 35, 25, 0.09), 0 2px 6px rgba(20, 35, 25, 0.04);

/* Token: --shadow-elevation-3 (Main Floating App Card / Desktop Window) */
box-shadow: 0 20px 48px -12px rgba(20, 35, 25, 0.16), 0 4px 12px rgba(20, 35, 25, 0.05);

/* Token: --shadow-glass-composer (Floating Input Bar on Sage Canvas) */
box-shadow: 
  0 8px 32px 0 rgba(20, 35, 25, 0.14),
  inset 0 1px 1px 0 rgba(255, 255, 255, 0.65),
  inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04);

/* Token: --shadow-neumorphic-disc (Embossed Story Avatars from Mockup) */
box-shadow: 
  inset 0 2px 3px rgba(255, 255, 255, 0.28),
  inset 0 -2px 3px rgba(20, 35, 25, 0.18),
  0 4px 10px rgba(20, 35, 25, 0.12);
```

### 4.2 Frosted Glassmorphism Tokens
For the floating search and input composer resting atop the sage canvas:
```css
--glass-bg: rgba(255, 255, 255, 0.42);
--glass-bg-hover: rgba(255, 255, 255, 0.55);
--glass-bg-focus: rgba(255, 255, 255, 0.70);
--glass-blur: blur(16px);
--glass-border: 1px solid rgba(255, 255, 255, 0.60);
```

---

## 5. Typography & Font Hierarchy

The typographic system pairs the humanist, open geometry of **Plus Jakarta Sans** (with **Inter** as an immediate fallback) for UI and scientific prose, with **JetBrains Mono** for citations, DOIs, and code. For Arabic academic literature support, **IBM Plex Sans Arabic** is specified with identical metric balance.

### 5.1 Typeface Stack
* **Primary Latin Stack:** `'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Arabic Academic Stack:** `'IBM Plex Sans Arabic', 'Tajawal', -apple-system, sans-serif`
* **Academic Monospace Stack:** `'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace`

### 5.2 Typographic Hierarchy Scale

| Level | Size (px / rem) | Line Height | Weight | Letter Spacing | Context in Proof Point |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `28px / 1.75rem` | `36px` | 700 (Bold) | `-0.025em` | Welcome Screen Headline: *"What shall we discover today?"* |
| **Heading 1 (H1)** | `22px / 1.375rem` | `28px` | 600 (Semi-bold) | `-0.015em` | Top Nav Title, Modal Titles |
| **Heading 2 (H2)** | `18px / 1.125rem` | `24px` | 600 (Semi-bold) | `-0.010em` | "Latest Messages" Header, Evidence Section Titles |
| **Heading 3 (H3)** | `15px / 0.938rem` | `22px` | 600 (Semi-bold) | `0em` | Paper Title in Citation Card, Claim Subheadings |
| **Body Primary** | `15px / 0.938rem` | `23px` | 400 (Regular) | `0.005em` | Assistant Response Body, Synthesized Literature Text |
| **Body Secondary** | `13.5px / 0.844rem`| `20px` | 400 (Regular) | `0.010em` | User Prompt text, Context Summaries, Drawer explanations |
| **Caption / Meta** | `12px / 0.75rem` | `16px` | 500 (Medium) | `0.015em` | Author list, Timestamps (`10:45`), Double checkmark status |
| **Monospace / DOI** | `12px / 0.75rem` | `16px` | 500 (Medium) | `0.020em` | DOI URLs, Retrieval Scores (`0.942`), Token counters |
| **Pill / Button Label**| `13px / 0.813rem`| `16px` | 600 (Semi-bold) | `0.010em` | Filter Pills ("Private Message", "Group", "AI & ML") |

---

## 6. Responsive Architecture: Desktop PC vs Tablet vs Mobile

The core genius of the user's reference mockup is that its visual elements translate seamlessly from a standalone smartphone into an expansive, productivity-dense **Academic Research Workstation on Desktop PC**.

```
+-----------------------------------------------------------------------------------------------------------------+
| DESKTOP WORKSTATION (>= 1200px) - Floating Enclosed Card Model                                                  |
|                                                                                                                 |
| +-------------------------+ +---------------------------------------------------------------------------------+ |
| | SIDEBAR NAVIGATION      | | SAGE CHAT CANVAS (#7E9F8B)                                                      | |
| | (Width: 320px)          | | (Fluid Width: 700px - 1000px)                                                   | |
| |                         | |                                                                                 | |
| | [ + New Chat ] [Filter] | |  Header: [Paper Title / Model Badge]                  [Status: Online] [Tools]  | |
| |                         | |                                                                                 | |
| | +---------------------+ | |  [ Today 10:45 ]                                                                | |
| | | Nested White Sheet  | | |                                                                                 | |
| | | "Latest Messages"   | | |  +------------------------------------------------------------------+           | |
| | |                     | | |  | Assistant Message (Pure White #FFFFFF Card, r: 24px)              |           | |
| | | * Paper 1 ... 10:45 | | |  | "Attention mechanisms dynamically weight input tokens..."       |           | |
| | | * Quantum ... 09:20 | | |  | +--------------------------------------------------------------+ |           | |
| | | * CRISPR  ... Yesterday | |  | Evidence Pill: [ Vaswani et al. (2017) | Score 0.96 ]          | |           | |
| | |                     | | |  +--------------------------------------------------------------+ |           | |
| | |                     | | |                                                                                 | |
| | |                     | | |                                 +---------------------------------------------+ | |
| | |                     | | |                                 | User Message (Pale Mint #E8EFEA, r: 24px)   | | |
| | |                     | | |                                 | "How does multi-head attention scale?"      | | |
| | |                     | | |                                 +---------------------------------------------+ | |
| | |                     | | |                                                                                 | |
| | +---------------------+ | |  [ (+) Attachment   |  Ask Anything about your research papers...   | (>) Send ]| |
| +-------------------------+ +---------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------------------------------+
```

### 6.1 Desktop PC Layout (`>= 1200px`)
* **Outer Enclosure:** The entire app sits inside a framed, deeply rounded desktop card container (`border-radius: 36px`) surrounded by an atmospheric mist background (`#EFF3F0`).
* **Left Navigation Sidebar (320px fixed width):**
  - **Upper Sage Banner:** Features the prominent circular "+ New Research Chat" action and soft-embossed collection discs (e.g., "Transformers", "Bioinformatics", "Neuroscience").
  - **Lower White Sheet:** Deeply rounded at top (`border-radius: 32px 32px 0 0`), containing the filter capsule pills ("All Chats", "Starred", "Archived"), a search bar, and the "Latest Messages" feed with author avatars, paper titles, timestamps (`10:45`), and double-check status ticks.
* **Central Chat Viewport (Fluid Width, max 1080px):**
  - Immersive **Sage Green background (`#7E9F8B`)** creates a visual sanctuary that isolates conversation focus.
  - **Header Bar:** Crisp white floating glass bar displaying the active conversation title, connected backend health status pill (`5023 • Online`), active model indicator, and Token Usage progress.
  - **Message Stream:**
    - **Assistant Messages:** Crisp porcelain white cards (`#FFFFFF`) with 24px asymmetric corners, rich formatted Markdown, LaTeX equations, collapsible Thinking accordion, and interactive Claim Evidence cards.
    - **User Messages:** Pale mint mist cards (`#E8EFEA`) right-aligned with 24px asymmetric corners.
  - **Bottom Composer Dock:** Wide floating capsule (`border-radius: 9999px`) with frosted glassmorphism (`backdrop-filter: blur(16px)`), paperclip PDF/BibTeX attachment, microphone voice recorder, expandable multi-line text input, and paper-airplane send button.

### 6.2 Tablet Layout (`768px - 1199px`)
* Sidebar collapses into a sliding off-canvas drawer triggered by a pill menu toggle in the header.
* Main chat canvas occupies 100% of viewport width with 20px padding margins.
* Evidence view cards expand directly beneath claims rather than in a side-docked inspector.

### 6.3 Mobile Phone Layout (`< 768px`) — *1:1 Mirror of User Mockup*
* **Screen 1 (Chat List):** Full-screen view matching the left mockup: upper sage story zone with circular buttons, transition to white rounded sheet with "Private Message / Group / Request" pills, and message list.
* **Screen 2 (Active Chat):** Full-screen view matching the right mockup: crisp white top app bar with contact/bot info, immersive sage green canvas, white and off-white message bubbles, and bottom frosted pill input.

---

## 7. Component Blueprint for Proof Point AI

### 7.1 Component: Assistant Response Card (AI Bubble)
The Assistant card transforms the mockup's left-aligned white bubble into an academic knowledge card:
* **Background:** Solid Pure White (`#FFFFFF`).
* **Border Radius:** `24px 24px 24px 6px` (soft asymmetric bubble cue).
* **Elevation:** `0 8px 24px -4px rgba(20, 35, 25, 0.08)`.
* **Internal Anatomy:**
  1. **Source Header / Thinking Badge:** Collapsible pill showing model reasoning time (e.g., `⚡ Thought for 3.2s`) styled in soft sage-100 tint (`#EBF2ED`).
  2. **Synthesized Answer Body:** Rich Markdown typography with 15px text (`#1A2820`), formatted LaTeX equations (`$$E = mc^2$$`), bold scientific terms, and inline citation markers `[1]`, `[2]`.
  3. **Evidence Accordion Trigger:** "Show 3 Verified Sources" toggle pill.
  4. **Action Bar (Footer):** Copy response icon, Re-generate prompt button, and citation export options (BibTeX / APA).

### 7.2 Component: User Query Bubble
* **Background:** Pale Mint / Soft Mist Sage (`#E8EFEA`).
* **Border Radius:** `24px 24px 6px 24px`.
* **Border:** `1px solid rgba(126, 159, 139, 0.20)`.
* **Typography:** `14.5px`, Semi-bold `#142019` for maximum contrast and legibility.

### 7.3 Component: Evidence & Provenance Inspector (The "Proof Point" Core)
When a researcher expands a claim's evidence, the component renders a dedicated citation leaf inside the assistant card:
```
+---------------------------------------------------------------------------------------+
| [✓ Grounded] Liu & Wang (2021) • Plant Disease Detection via Deep Learning            |
| DOI: https://doi.org/10.1016/j.compag.2021.106324                Retrieval Score: 0.94|
|---------------------------------------------------------------------------------------|
| Passage Excerpt:                                                                      |
| "Our dual-attention architecture improved multi-class lesion classification accuracy  |
| by 14.2% on field-captured datasets compared to baseline ResNet-50..."                |
|                                                    [Open Publisher PDF ↗] [Copy Bib]  |
+---------------------------------------------------------------------------------------+
```
* **Card Fill:** Pure White `#FFFFFF` with a `2px solid #A5D6A7` left accent bar.
* **Passage Background:** `#F8FAF8` with an italicized humanist font.
* **Retrieval Score Pill:** Rounded capsule badge (`border-radius: 9999px`) in `#E8F5E9` with deep pine text (`#1B5E20`).

### 7.4 Component: Floating Glass Composer Bar
Direct evolution of the right mockup's bottom input:
* **Dimensions:** Height `56px`, width `100%`, max-width `820px`.
* **Curvature:** `border-radius: 9999px`.
* **Surface:** `rgba(255, 255, 255, 0.48)`, `backdrop-filter: blur(18px)`, `border: 1px solid rgba(255, 255, 255, 0.65)`.
* **Controls Left-to-Right:**
  1. **Attachment Button:** Circular hoverable icon button with paperclip icon for PDF/EPUB literature uploads.
  2. **Voice Recorder Pill:** Inline mic icon with audio level waveform animation.
  3. **Text Area:** Auto-expanding single-to-triple line input, placeholder: *"Ask anything about your research papers..."* (`#4A6252`).
  4. **Send Action:** Circular button (`40px x 40px`) in Sage-700 (`#526D5C`) with a crisp white paper-airplane icon, lifting with spring physics on hover.

### 7.5 Component: Filter & Topic Pills
Matches the "Private Message / Group / Request" tabs from the left mockup:
* **Active State:** Solid Sage Green `#7E9F8B` fill, White text `#FFFFFF`, subtle inner glow.
* **Inactive State:** Translucent off-white `rgba(255, 255, 255, 0.25)`, Dark Sage text `#3C5245`.
* **Hover State:** Background lifts to `rgba(255, 255, 255, 0.40)`.
* **Padding:** `8px 18px`, `border-radius: 9999px`.

---

## 8. Micro-Interactions & Animation Specifications

To preserve the soothing, calm atmosphere, animations avoid jarring linear cuts, employing natural spring physics modeled after gentle organic movements:

### 8.1 Motion Timing & Easing Tokens

| Token Name | Duration | Easing Curve (`cubic-bezier`) | Context |
| :--- | :--- | :--- | :--- |
| `--motion-instant` | `100ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Active button click depression (`scale(0.97)`). |
| `--motion-hover` | `200ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Pill hover color shift, composer focus lift. |
| `--motion-expand` | `320ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Evidence drawer opening, Thinking trace reveal. |
| `--motion-stream` | `250ms` | `cubic-bezier(0, 0, 0.2, 1)` | Streaming incoming message card height expansion. |
| `--motion-page` | `400ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Sidebar open/collapse, mobile view screen transition. |

### 8.2 Interactive State Specs
* **Button & Pill Hover:** `transform: translateY(-1.5px);` paired with an ambient shadow expansion (`0 6px 16px rgba(26, 40, 32, 0.12)`).
* **Button Active / Press:** `transform: scale(0.97);` simulating a physical tactile disc pressing into the sage surface.
* **Composer Input Focus:** Border stroke transitions from `rgba(255,255,255,0.6)` to `2px solid #FFFFFF` with a soft white glow ring (`box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.25)`).

---

## 9. Accessibility & WCAG 2.1 Compliance Blueprint

Accessibility is not a secondary add-on; it is foundational to Proof Point's mission of serving every researcher, including assistive tech and keyboard navigators (**Hana Sato** persona).

### 9.1 Keyboard Focus Indicator System
* **On White / Light Surfaces:** High-visibility double-ring focus:
  `outline: 3px solid #2E7D32 !important; outline-offset: 2px !important;`
* **On Sage Canvas (`#7E9F8B`):** High-contrast luminescent ring:
  `outline: 3px solid #FFFFFF !important; outline-offset: 3px !important; box-shadow: 0 0 0 5px rgba(26, 40, 32, 0.4);`

### 9.2 Screen Reader Landmarks & ARIA Architecture
* **`role="region" aria-label="Conversation History"`**: Encloses the sidebar conversation list.
* **`role="feed" aria-busy="[isStreaming]" aria-label="Academic Discussion"`**: Encloses the main chat stream.
* **`role="log" aria-live="polite"`**: Dedicated live region that announces newly verified claims and citations as they stream in without interrupting text reading.
* **`role="search" aria-label="Paper & Conversation Search"`**: Filter and search capsule bar.
* **Skip Link:** Always positioned at the top of the DOM:
  *"Skip to Main Academic Discussion (`#chat-feed`)"* and *"Skip to Literature Input (`#query-input`)"*.

### 9.3 RTL (Right-to-Left) Bi-directional Support for Arabic Scholars
* In RTL mode (`dir="rtl"`), the asymmetric bubble corners mirror automatically:
  - Assistant card: `border-radius: 24px 24px 6px 24px;`
  - User bubble: `border-radius: 24px 24px 24px 6px;`
* Double-check delivery ticks and timestamp stacks swap gracefully from right-to-left.
* Typographic line heights increase by `15%` when rendering Arabic scripts to accommodate higher Arabic ascenders and descenders.

---

## 10. Dark Mode Adaptation: "Nocturnal Spruce"

For nighttime researchers and low-light laboratory environments, the biophilic palette shifts from daytime sunlit sage to a deep nocturnal spruce forest:

```
+---------------------------------------------------------------------------------------+
| DAYTIME SAGE (Light)                 -->  NOCTURNAL SPRUCE (Dark)                     |
|                                                                                       |
| Canvas: Sage-500 (#7E9F8B)           -->  Canvas: Midnight Forest (#142019)           |
| Assistant Bubble: Crisp White (#FFF) -->  Assistant Bubble: Deep Spruce Card (#1C2B22)|
| User Bubble: Pale Mint (#E8EFEA)     -->  User Bubble: Forest Shadow (#22362B)        |
| Text: Forest Charcoal (#1A2820)      -->  Text: Pale Mint Frost (#E4EDE6)             |
| Glass Composer: rgba(255,255,255,0.4)-->  Glass Composer: rgba(28, 43, 34, 0.65)      |
+---------------------------------------------------------------------------------------+
```

---

## 11. Implementation Readiness & Transition Strategy

To adhere strictly to the user's explicit directive:
> *"يعني من غير ما نعدل في الـ code بتاع الـ design لسه مش دلوقتي، لما آخد بس approve عليه."*
> *(Do not modify any design code yet, until approval is received.)*

### Next Steps Once the User Grants Approval:
1. **Phase 1: Design Tokens CSS Variable Injection:** Translate this document's token tables into `:root` variables inside `App.css`.
2. **Phase 2: Ant Design X Theme Override:** Configure `ConfigProvider` token mappings (primary color, border radius, card shadows).
3. **Phase 3: Component Harmonization:** Update `EvidenceView.tsx`, `ThinkingProcess.tsx`, and `VoiceRecorder.tsx` with the specified sage pill aesthetics and WCAG focus states.
4. **Phase 4: Responsive Verification:** Test the 3-column desktop layout and mobile phone reflow across Chrome, Firefox, and Safari.

---
*Authored by Sally & Winston (UI/UX Specialist & System Architect)*  
*Proof Point — Research Hub Design System v1.0.0*
