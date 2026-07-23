# GitHub Stats SVG

Self-hosted, animated GitHub stats and top-languages cards for your profile README. Built as a brighter, more distinctive alternative to the typical blue-on-navy stats widgets — and self-hosted so it never depends on a shared public server going down.

<p align="center">
  <img height="240" src="https://your-project-name.vercel.app/api/stats?username=MR1229" />
</p>
<p align="center">
  <img src="https://your-project-name.vercel.app/api/langs?username=MR1229" />
</p>

## Why this exists

Popular stats-card services run on one free server shared by huge numbers of profiles, so they constantly hit rate limits and break. This project is a small serverless function you deploy under your own account — it only ever serves your own traffic, so it can't go down from someone else's popularity.

## Use it right now — no setup

Drop these into your README, swapping in your own GitHub username:

```markdown
<img height="240" src="https://your-project-name.vercel.app/api/stats?username=YOUR_USERNAME" />
<img src="https://your-project-name.vercel.app/api/langs?username=YOUR_USERNAME" />
```

This pulls live from the hosted instance above — nothing to fork or deploy.

## Deploy your own instance instead

1. **Fork this repo**
2. **Import it on [Vercel](https://vercel.com)**
3. Add one environment variable:
   - `GH_TOKEN` — a [personal access token](https://github.com/settings/tokens/new) with the `read:user` scope (public data only)
4. **Deploy**
5. Use your own deployed domain the same way as above

## What each card shows

**Stats card** — total stars earned, commits in the last year, total PRs, total issues, repos contributed to, and an overall rank shown as a percentage ring (lower % = stronger rank).

**Languages card** — your top 6 languages by code volume across your owned, non-fork repositories, shown as a proportional bar plus a percentage breakdown.

## Design

- Coral / teal / gold palette instead of the default blue theme most stats cards use
- Small load-in animations: rows fade in, the language bar grows left to right, the rank ring draws itself
- No external dependencies, no database — computed fresh from GitHub's GraphQL API on each request

## Parameters

| Parameter | Description | Required |
|---|---|---|
| `username` | any GitHub username | yes |

## Tech

Node.js serverless functions on Vercel. Zero npm dependencies.

## Contributing

PRs welcome — more themes, additional stat types, or layout variants are all fair
