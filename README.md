# PlayConnect

A lightweight website for coordinating sports fields, teams, matches, and results in Kalobeyei. Phase 1 MVP — no server, no login, no build tools. Just HTML, CSS, and JavaScript, so it loads fast on weak connections and costs nothing to host.

## What's in this project

```
playconnect/
├── index.html      Home page — upcoming matches this week
├── fields.html     Field directory
├── teams.html      Team directory
├── matches.html    All fixtures (scheduled/completed/cancelled)
├── results.html    Results log + auto-calculated standings
├── css/style.css   All styling
├── js/data.js      ← THE DATABASE. Edit this file to update the site.
├── js/app.js       Rendering logic — you shouldn't need to touch this
└── README.md       This file
```

## How to update the site (no coding needed)

Everything you see on the site comes from **`js/data.js`**. To add a field, team, match, or result, open that file and copy the pattern of an existing entry, then change the details. For example, to add a new match:

```js
{ id: "m4", date: "2026-09-12", time: "15:30", fieldId: "f2", teamAId: "t3", teamBId: "t4", status: "scheduled", notes: "" },
```

- `id` — must be unique (m1, m2, m3, m4...)
- `date` — format `YYYY-MM-DD`
- `time` — 24-hour format `HH:MM`
- `fieldId` / `teamAId` / `teamBId` — must match an `id` already listed in the `fields` or `teams` list
- `status` — `"scheduled"`, `"completed"`, or `"cancelled"`

When a match finishes, change its status to `"completed"` and add a matching entry to the `results` list:

```js
{ matchId: "m4", scoreA: 3, scoreB: 2 },
```

The standings table updates automatically — no extra work needed.

## How to put this online (free, using GitHub Pages)

1. Create a new repository on GitHub (e.g. `playconnect`).
2. Upload all the files in this folder, keeping the same structure.
3. In the repository, go to **Settings → Pages**.
4. Under "Source," choose the `main` branch and `/ (root)` folder, then save.
5. GitHub will give you a link like `https://yourusername.github.io/playconnect/` — that's your live site.
6. Any time you edit `js/data.js` and push the change, the live site updates within a minute or two.

## Sharing with teams who don't have data or smartphones

The website is the source of truth, but for now, plan to also post key updates (this week's matches, field changes) to WhatsApp groups by hand. Phase 2 can automate this.

## What's next (see the full roadmap doc)

This build covers **Phase 1** only: field directory, team directory, match board, fixtures/results log. Phase 2 adds team self-registration and booking requests; Phase 3 adds deeper stats and an equipment board; Phase 4 adds cross-community and NGO coordination features. Nothing here needs to be rebuilt to add those later — the data structure was designed to grow.
