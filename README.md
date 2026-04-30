# Sister Iron 💪

Emma's 4-day recomp training plan — a clean, fun web app with persistent set logging, structured runs, macro targets, and a low-FODMAP food guide.

Built with **React + Vite + Tailwind CSS**.

---

## Features

- **Train tab** — 4-day strength plan with set/rep/weight logging that persists in your browser
- **Run tab** — Two structured easy runs + cardio finishers explained
- **Eat tab** — 1,880 kcal recomp targets · 120P / 225C / 55F · low FODMAP food lists
- **Week tab** — 7-day overview with today's session highlighted
- **Mobile-first** — works as a PWA, installable to home screen
- **Offline-friendly** — all data stored locally in the browser

---

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # production build → dist/
npm run preview    # serve the built version
```

---

## Deploy to Netlify (via GitHub)

### 1. Push to GitHub

Create a new repository on GitHub (e.g. `sister-iron`), then from this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sister-iron.git
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (with GitHub if you want)
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** and authorize Netlify
4. Pick your `sister-iron` repository
5. Netlify auto-detects the settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20
6. Click **Deploy**

That's it. Every push to `main` will trigger a new deploy.

### 3. Custom domain (optional)

In Netlify → **Site settings → Domain management**, add your custom domain. Netlify gives you free HTTPS via Let's Encrypt.

---

## Install on phone (PWA)

After deploying:
1. Open the URL in **Safari** (iOS) or **Chrome** (Android)
2. Tap the share/menu button → **Add to Home Screen**
3. The app installs with the nun mascot as its icon and runs full-screen

---

## Project structure

```
sister-iron/
├── public/
│   ├── favicon.svg          # browser tab icon (the mascot)
│   └── manifest.json        # PWA install metadata
├── src/
│   ├── App.jsx              # the entire app
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind + base styles
├── index.html
├── netlify.toml             # Netlify build config
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## Customizing the plan

All data lives in arrays at the top of `src/App.jsx`:

- `days` — exercises per training day (sets, reps, rest, form notes, cardio finisher)
- `runs` — easy run + long run details
- `macros` — calorie/protein/carbs/fat targets
- `fodmapSafe` / `fodmapAvoid` — food lists
- `week` — 7-day schedule

Edit, commit, push — Netlify rebuilds automatically.

---

## Tech notes

- **Storage**: browser `localStorage` under key `sister-iron-v1` — clears if she clears site data
- **Fonts**: Inter (body) + Bagel Fat One (the chunky brand title) via Google Fonts
- **Icons**: lucide-react
- **Styling**: Tailwind CSS with arbitrary value support

Built with care for Emma. Phase I: 4–6 weeks.
