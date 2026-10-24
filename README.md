# AUverse Studio 🎭

A **social media AU (SMAU) maker** for fictional creativity — inspired by [austudio.my.id](https://austudio.my.id/), with more platforms and more control.

Build fake social-media moments (chats, posts, stories, lock screens), stack them into a story timeline, and export crisp **2× PNG screenshots** for your AU threads.

## What it does

**13 realistic platform mocks (2026 look):**

| | |
|---|---|
| 💬 iMessage (1-on-1 + group, tapbacks, voice notes, “Read” receipts) | 📱 WhatsApp (bubbles, ✓✓ checkmarks, doodle background) |
| ✈️ Telegram (blue read checks, online status) | 👻 Snapchat (chat **and** snap cards with yellow doodles) |
| 📸 Instagram Feed post | 🌅 Instagram Story |
| 💌 Instagram DM | 🎞️ Instagram Reel |
| 🐦 X (light/dark, threads, verified badge, metrics) | 🎵 TikTok (video UI + comments sheet) |
| 🟠 Reddit (post + comment thread) | 📘 Facebook (reactions, comments) |
| 🔒 iOS Lock Screen (notifications, wallpaper) | |

**Features**

- 👥 **Crew** — reusable characters with avatars, bios, platform handles, verified badges
- 📅 **Story timeline** — order moments, in-story time labels, private notes per AU and per moment
- 💾 **Saving (the important part)**
  - **Local:** everything autosaves to your phone the instant you change it (IndexedDB) — works offline
  - **Cloud:** a second later it also syncs to the studio server — open the same link on any device and it’s all there
  - **Backup:** download/restore a `.json` of your entire universe
- 🖼️ **Export** — any moment as a 2× Retina PNG, or the whole AU as a ZIP (all moments + story notes)
- 🎲 **Extras** — 3 starter AU templates, a drama prompt generator, image uploads (auto-compressed)

## Run it (if you ever need to)

```bash
npm install
npm run build   # type-check + build the frontend into dist/
npm start       # server on port 3000 (frontend + cloud API)
```

Dev mode with hot reload: `npm run dev` (port 3000, proxies `/api`).

## Project layout

- `src/` — React app (mobile-first, no framework CSS)
  - `store.tsx` — state + local/cloud autosave engine
  - `components/mocks/` — the 13 platform mocks
  - `components/MomentForms.tsx` — per-platform editors
- `server/index.js` — Express: serves `dist/` + the cloud state API (`GET/PUT /api/state`)
- `server-data/` — cloud storage (git-ignored)

## Disclaimer

AUverse Studio is for **fictional, self-indulgent creativity**. Every character, conversation, and metric you create is invented. Platform appearances are imitated for storytelling purposes only — not affiliated with Apple, Meta, X, TikTok, Telegram, WhatsApp, or Reddit.
