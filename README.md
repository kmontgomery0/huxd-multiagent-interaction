## 🕊️ news nest

A cozy, unbiased news chatbot that delivers current-event insights through multiple bird-themed "voices." Each voice reflects different ways of relating to information — not political bias, but human orientation toward news (curiosity, reflection, skepticism, care).

### Mission

Keep users informed without overwhelming them. Like a morning songbird or night owl, this chatbot delivers short, digestible insights that feel conversational, calming, and ritualistic — a gentle way to start or end your day.

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
- **Voice**: Warm, conversational, trustworthy
- **Aesthetic**: Natural metaphors (weather, birds, time of day)
- **Bias Strategy**: Frame differences (tone, focus, relevance) — not ideological divides
- **Emotion Regulation**: Gently acknowledges worry, e.g., "Let's take this in slowly"

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

### Single Voice Mode (Router)

Try these prompts at different times of day:

**Morning (should select Dove or Wren):**
- "What's happening with climate negotiations?"
- "Tell me something good in the news today"

**Evening (should select Owl):**
- "What happened with the policy vote today?"
- "Why does the new regulation matter?"

**Mood-based routing:**
- "I'm worried about the economy" → Dove (uplifting)
- "I'm curious what happened" → Wren (facts)
- "I'm confused about this issue" → Owl (context)
- "How does this affect my daily life?" → Robin (relevance)

### Blended Tweet Mode (Synthesizer)

Try questions that benefit from multiple perspectives:
- "What's the latest on renewable energy?"
- "Tell me about the community initiative that launched today"
- "What should I know about today's news?"

Expected: Short, cozy tweet-like messages (2-3 sentences) that blend factual info with uplifting or reflective context.

---

## 📱 Example Outputs

**Single Voice - Dove (Morning):**
> "Amidst tensions, communities are coming together to rebuild — a small sign of resilience. 🌱"

**Single Voice - Owl (Evening):**
> "Tonight's policy shift echoes earlier debates about privacy — a reminder that tech and trust evolve together. 🌙"

**Single Voice - Wren:**
> "Here's what's confirmed so far: new regulations will begin in 2026, pending Senate review."

**Blended Tweet - Synthesizer:**
> "Good evening. 🌙 New climate commitments announced today, with over 40 nations joining. Small steps forward — a reminder that collective action still happens, one agreement at a time."

---

## 🎯 Assignment Goals

This chatbot demonstrates:

✅ **4 distinct agents** with differentiated frames using SPEAKING model
✅ **Router orchestrator** that selects single bird based on context
✅ **Synthesizer orchestrator** that blends multiple perspectives
✅ **Frame-sensitive design** focusing on tone/focus rather than political bias
✅ **Cozy UX** designed to reduce news anxiety and doomscrolling

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
