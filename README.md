# Premier League table predictor

React app for ranking the 2026/27 Premier League. Drag clubs to set your finish, then click a team to see the manager, last season, and stadium details.

Club names, crests, and last-season standings are pulled from the same PulseLive API that powers [premierleague.com](https://www.premierleague.com). If that request fails, the app uses built-in 2025/26 data.

## Versions

| | |
| --- | --- |
| Season | 2026/27 (last completed table: 2025/26) |
| Node | 24.18.0 (see `.nvmrc`). 20.19+ also works. |

Library versions live in `package.json` / `package-lock.json` so they stay in sync with installs.

## Run locally

```bash
nvm use
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).
