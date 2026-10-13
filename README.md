# Hathor Nodes

A redesign of [hathornodes.com](https://web.archive.org/web/20241224093611/https://hathornodes.com/). Hathor Nodes leads with **AI consulting for crypto teams**: risk analysis, on-chain data science and AI integrations. Its validator operations and public dashboards serve as proof of its data work. Service copy lives in `src/lib/services.ts`. **It's front end only:** every number on the dashboards is generated demo data.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) with a static export (`output: 'export'`)
- React 19 and TypeScript
- Tailwind CSS v4 (design tokens are in `src/app/globals.css`)
- [Recharts](https://recharts.org) for the charts and [TanStack Table](https://tanstack.com/table) for the data tables
- [Lucide](https://lucide.dev) for icons, and Geist, Geist Mono and Instrument Serif fonts via `next/font`

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm start          # serve ./out locally
npm run typecheck
```

`out/` is plain static files, so it can be hosted anywhere (Vercel, Netlify, Cloudflare Pages, S3 and so on).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Consulting hero, services, process, dashboard previews, FAQ |
| `/services` | Offerings, who we help, engagement models, principles |
| `/about_us` | Story and the four commitments |
| `/delegate` | The chains Hathor Nodes validates on (Osmosis, Stargaze, Bitsong, Lum) |
| `/contact_us` | Contact form (the submit is simulated) |
| `/blog`, `/blog/*` | Three long-form posts with interactive charts |
| `/resources/[chain]` | Dashboard hub for Osmosis, Juno, Bitsong and Stargaze |
| `/governance/[chain]` | Validator voting habits and participation, on all four chains |
| `/validator_voting_history/osmosis` | Vote-by-vote matrix for every validator and proposal |
| `/liquidity_provider/osmosis` | Token liquidity breakdown |
| `/super_fluid_staking/osmosis` | SuperFluid staking adoption |
| `/incentives_research/osmosis` | Incentives research and a budget simulator |
| `/value_accrual/juno` | Juno fee breakdown (beta) |

## Demo data

All data lives in `src/lib/mock/`. It is produced by seeded random generators (`random.ts`), so the numbers are the same on every build and every visit. Dashboard data runs up to **`DATA_END` in `src/lib/mock/dates.ts`** (currently 2026-09-30). Change that date to move every time series. Validator and contract names are made up.

To connect real data later, swap the `get*()` functions in `src/lib/mock/` for API calls that return the same shapes.

## Project layout

```
src/
  app/                 routes (one folder per page)
  components/
    charts/            themed Recharts wrappers (client)
    dashboard/         dashboard header, tables, voting matrix, simulator
    blog/              article layout and blog charts
    ui/                primitives (Card, StatCard, Button, …) and DataTable
  lib/
    chains.ts          chain registry and dashboard list
    mock/              demo data generators
    palette.ts         chart colours (safe to import in server components)
```
