# GitHub Stats SVG

Self-hosted, animated GitHub stats and top-languages cards for your profile README. Built as a brighter, more distinctive alternative to the typical stats widgets — and self-hosted so it never depends on a shared public server going down.

<p align="center">
  <img height="240" src="https://github-stats-svg-eight.vercel.app/api/stats?username=MR1229" />
</p>
<p align="center">
  <img src="https://github-stats-svg-eight.vercel.app/api/langs?username=MR1229" />
</p>

## Why this exists

Most stats-card services run on one free server shared by thousands of profiles, so they hit rate limits constantly and randomly break. This project is a small serverless function you deploy under your own account — it only ever serves your own traffic, so someone else's profile going viral can't take yours down with it.

## Use it right now — no setup required

Just drop these into your README and swap in your own GitHub username:

```markdown
<img height="240" src="https://github-stats-svg-eight.vercel.app/api/stats?username=YOUR_USERNAME" />
<img src="https://github-stats-svg-eight.vercel.app/api/langs?username=YOUR_USERNAME" />
```

**Try it with any username right now** — this pulls live data, no auth needed on your end:
https://github-stats-svg-eight.vercel.app/api/stats?username=torvalds
https://github-stats-svg-eight.vercel.app/api/langs?username=torvalds

This runs off my hosted instance. If you'd rather not depend on someone else's deployment at all, deploy your own copy below.

## Deploy your own instance

1. **Fork this repo**
2. **Import it on [Vercel](https://vercel.com)**
3. Add one environment variable:
   - `GH_TOKEN` — a [personal access token](https://github.com/settings/tokens/new) with the `read:user` scope (public data only, nothing more needed)
4. **Deploy**
5. Use your own domain the same way:
```markdown
   <img height="240" src="https://your-project.vercel.app/api/stats?username=YOUR_USERNAME" />
   <img src="https://your-project.vercel.app/api/langs?username=YOUR_USERNAME" />
```

## What each card shows

**Stats card** — total stars earned, commits in the last year, total PRs, total issues, repos contributed to, and an overall rank shown as a percentage ring.

**Languages card** — your top 6 languages by code volume across your owned, non-fork repos, shown as a proportional bar with a percentage breakdown.

## Design

- Coral / teal / gold palette instead of the default blue theme most stats cards default to
- Small load-in animations — rows fade in staggered, the language bar grows left to right, the rank ring draws itself on load
- Zero database, zero stored state — computed fresh from GitHub's GraphQL API on every request

## Parameters

| Parameter | Description | Required |
|---|---|---|
| `username` | any public GitHub username | yes |

## Tech

Node.js serverless functions on Vercel. Zero npm dependencies — just the built-in `fetch`.

## Contributing

PRs welcome — more themes, additional stat types, layout variants, whatever improves it.

## License

MIT — fork it, modify it, deploy your own copy, or point straight at the hosted version above.
