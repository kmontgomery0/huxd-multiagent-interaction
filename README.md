## 🕊️ news nest

A cozy, unbiased news chatbot that delivers current-event insights through multiple bird-themed "voices." Each voice reflects different ways of relating to information — not political bias, but human orientation toward news (curiosity, reflection, skepticism, care).

### Mission

Keep users informed without overwhelming them. Like a morning songbird or night owl, this chatbot delivers short, digestible insights that feel conversational, calming, and ritualistic — a gentle way to start or end your day.

### ✨ Key Features

- **Time-Based Atmosphere**: Dynamic gradient backgrounds shift throughout the day (sunrise → midday → sunset → dusk → night) with a manual slider to adjust the ambiance
- **Visual Bird Identity**: Each response shows a colored circle with the bird's emoji:
  - 🕊️ Dove (amber) for uplifting perspectives
  - 🦉 Owl (purple) for reflective wisdom
  - 🐦 Wren (blue) for factual clarity
  - 🐦 Robin (red) for relatable connections
- **Pie Chart Visualization**: Blended responses show a pie chart circle divided by bird colors
- **Smart Greeting**: Initial time-appropriate welcome message that disappears after first query
- **No Greetings in Responses**: All bird responses jump straight to news content — no "Good morning" or pleasantries

---

### System Overview

**🐦 The Four Birds (each with distinct SPEAKING frame):**

| Bird | Role | Focus | When Selected |
|------|------|-------|---------------|
| **🕊️ Dove** (Morning Dove) | Optimist/Connector | Uplifting tone, collective progress | Morning updates, worried users, community stories |
| **🦉 Owl** | Reflective Analyst | Contextualizes with balanced wisdom | Evening updates, complex topics, "why does this matter?" |
| **🐦 Wren** | Curious Fact-Finder | Crisp facts, verifies information | All updates (factual backbone), "what happened?" |
| **🐦 Robin** | Everyday Citizen | Relates news to ordinary life | Personal relevance, "how does this affect me?" |

**🎼 Two Orchestration Modes:**

1. **Single Voice (Router)**: Selects ONE bird based on:
   - Time of day (morning → Dove/Wren; evening → Owl)
   - User mood/keywords ("worried" → Dove; "confused" → Owl; "curious" → Wren)
   - Topic type (policy → Wren/Owl; community → Dove/Robin)

2. **Blended Tweet (Synthesizer)**: Combines 2-3 birds into one cozy message:
   - Always includes Wren for factual backbone
   - Adds Dove (morning uplift) or Owl (evening reflection)
   - Creates short, tweet-like messages with natural transitions

---

### Response Style

- **Length**: 1-2 sentences, like a tweet or haiku
- **Voice**: Warm, conversational, trustworthy — but NO greetings after the initial welcome
- **Visual Identity**: Each bird response shows a colored circle indicator (single bird) or pie chart (blended)
- **Aesthetic**: Natural metaphors (weather, birds, time of day), minimal emojis (🕊️ 🌙 🌅 🌱)
- **Bias Strategy**: Frame differences (tone, focus, relevance) — not ideological divides
- **Emotion Regulation**: Gently acknowledges worry without being dismissive
- **Initial Greeting**: Time-appropriate welcome ("good morning! 🌅 what would you like to explore today?") appears only on first load

---

### Implementation Structure

```
src/lib/
├── agents/
│   ├── DoveAgent.js    (🕊️ Optimist/Connector)
│   ├── OwlAgent.js     (🦉 Reflective Analyst)
│   ├── WrenAgent.js    (🐦 Curious Fact-Finder)
│   └── RobinAgent.js   (🐦 Everyday Citizen)
└── orchestrators/
    ├── RouterOrchestrator.js      (Single Voice selector)
    └── SynthesizerOrchestrator.js (Blended Tweet creator)
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up API Key

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_key_here
```

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:5173
```

---

## 🧪 Testing Your Songbird Companion

### UI Features to Explore

1. **Time-of-Day Slider**: Adjust the atmosphere (sunrise/midday/sunset/dusk/night) — background gradients change
2. **Bird Legend**: Hover over the colored bird circles next to mode buttons to see descriptions
3. **Mode Tooltips**: Hover over "single voice" and "blended tweet" buttons for explanations
4. **Initial Greeting**: Refresh the page to see the time-appropriate welcome message
5. **Visual Indicators**: Watch for colored circles (single voice) or pie charts (blended) next to responses

### Single Voice Mode (Router)

Try these prompts at different times of day:

**Morning (should select Dove or Wren):**
- "What's happening with climate negotiations?" → 🕊️ amber circle or 🐦 blue circle
- "Tell me something good in the news today" → 🕊️ amber circle

**Evening (should select Owl):**
- "What happened with the policy vote today?" → 🦉 purple circle
- "Why does the new regulation matter?" → 🦉 purple circle

**Mood-based routing:**
- "I'm worried about the economy" → 🕊️ Dove (uplifting)
- "I'm curious what happened" → 🐦 Wren (facts)
- "I'm confused about this issue" → 🦉 Owl (context)
- "How does this affect my daily life?" → 🐦 Robin (relevance)

### Blended Tweet Mode (Synthesizer)

Try questions that benefit from multiple perspectives:
- "What's the latest on renewable energy?"
- "Tell me about the community initiative that launched today"
- "What should I know about today's news?"

Expected: Short, tweet-like messages (2-3 sentences) with a **pie chart circle** showing which birds contributed (divided into colored segments).

---

## 📱 Example Outputs

**Initial Greeting (appears only on page load):**
> "good morning! 🌅 what would you like to explore today?"
> 
> *(Center-aligned, italic, subtle amber border — disappears after first query)*

**Single Voice - Dove (amber circle):**
> "Communities are coming together to rebuild — small signs of resilience emerging. 🌱"

**Single Voice - Owl (purple circle):**
> "This policy shift echoes earlier privacy debates — tech and trust evolve together. 🌙"

**Single Voice - Wren (blue circle):**
> "Confirmed: new regulations begin in 2026, pending Senate review."

**Blended Tweet - Synthesizer (pie chart of bird colors):**
> "New climate commitments announced today, with over 40 nations joining. Small steps forward — collective action still happens, one agreement at a time. 🌱"

**Visual Indicators:**
- Single voice responses show a colored circle (36px) with the bird emoji on the left
- Blended responses show a pie chart divided into segments by participating bird colors
- Hover over bird circles in the toolbar to see descriptions

---

## 🎯 Assignment Goals

This chatbot demonstrates:

✅ **4 distinct agents** with differentiated frames using SPEAKING model  
✅ **Router orchestrator** that selects single bird based on context  
✅ **Synthesizer orchestrator** that blends multiple perspectives  
✅ **Frame-sensitive design** focusing on tone/focus rather than political bias  
✅ **Cozy UX** designed to reduce news anxiety and doomscrolling  
✅ **Visual design system** with time-based gradients, bird color indicators, and pie chart synthesis  
✅ **Thoughtful greeting UX** that welcomes users once, then focuses purely on content

---

## Setup and Running the App (Detailed)

Install required tools (choose per OS):
- Node.js 20.x (includes npm)
  - macOS: `brew install node` (Homebrew), or download from nodejs.org
  - Windows: install Node LTS from nodejs.org (includes npm)
  - Linux: use your package manager or NodeSource installers
- Git (to clone and manage the repo)
- An editor (Cursor recommended)

## Getting Started with the Gemini API

Per the instructions in Canvas, add Google API credits to a personal Google account. 

Important: While you will use your `@mit.edu` email to get a coupon code for Gemini credits, do NOT claim credits using your `@mit.edu` email. Instead, use a personal Google account to avoid institutional billing/limits.

Once you have credits added, you can create an API key in Google AI Studio and add it to `.env`.

Steps:
- Go to Google AI Studio (https://aistudio.google.com/)
- Click Get API Key
- Click Create API Key
- Copy your key and set environment values in `.env`:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Restart `npm run dev` after changing `.env`.

## Safely Deploy to Vercel

After implementing the agents and orchestrators, you can set up Vercel and deploy your application without exposing secrets.

Reminder: do not commit `.env` or any API keys to Git.

Steps:
- Create a Vercel account and import your GitHub repo as a new project
- In Vercel Project Settings → Environment Variables, add:
  - `GEMINI_API_KEY` 
  - `GEMINI_MODEL` (e.g., `gemini-2.5-flash`)
- Trigger a deploy (Vercel builds and hosts your app)
- Verify the app works at your Vercel URL

Safety reminders:
- Ensure `.env` is in `.gitignore` (already included)
- Never push secrets to Git; use Vercel Environment Variables only
- Optionally rotate keys after testing

## Quick Dev Reference

- Start dev server: `npm run dev` (http://localhost:5173)
- Build: `npm run build`
