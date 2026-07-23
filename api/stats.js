import { fetchGithubData, calcStars, calcRank } from '../lib/github.js';

export default async function handler(req, res) {
  const { username = 'MR1229' } = req.query;

  try {
    const user = await fetchGithubData(username);
    const stars = calcStars(user);
    const commits = user.contributionsCollection.totalCommitContributions;
    const prs = user.pullRequests.totalCount;
    const issues = user.issues.totalCount;
    const contributed = user.repositoriesContributedTo.totalCount;
    const rank = calcRank({ stars, commits, prs, issues, contributed });

    const coral = '#FF6B5B';
    const teal = '#2EC4B6';
    const gold = '#FFC145';
    const bg = '#12141A';
    const border = '#262A34';
    const text = '#F4F4F5';
    const label = '#9CA3AF';

    const ringPct = 100 - rank;
    const circumference = 2 * Math.PI * 44;
    const dashoffset = circumference - (circumference * ringPct) / 100;

    const rows = [
      { label: 'Total Stars', value: stars, color: gold },
      { label: 'Commits (last yr)', value: commits, color: teal },
      { label: 'Total PRs', value: prs, color: coral },
      { label: 'Total Issues', value: issues, color: gold },
      { label: 'Contributed To', value: contributed, color: teal }
    ];

    const rowsSvg = rows.map((r, i) => `
      <g class="fade-row" style="animation-delay:${i * 0.08}s" transform="translate(30, ${58 + i * 26})">
        <circle cx="4" cy="-5" r="4" fill="${r.color}"/>
        <text x="18" y="0" class="rowlabel">${r.label}</text>
        <text x="270" y="0" text-anchor="end" class="rowvalue">${r.value.toLocaleString()}</text>
      </g>`).join('');

    const svg = `
<svg width="420" height="240" viewBox="0 0 420 240" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: 700 16px 'Segoe UI', sans-serif; fill: ${text}; }
    .rowlabel { font: 500 13px 'Segoe UI', sans-serif; fill: ${label}; }
    .rowvalue { font: 700 13px 'Segoe UI', sans-serif; fill: ${text}; }
    .ranklabel { font: 700 20px 'Segoe UI', sans-serif; fill: ${text}; }
    .ranksub { font: 600 10px 'Segoe UI', sans-serif; fill: ${label}; letter-spacing: 1px; }
    .fade-row { opacity: 0; animation: fadeIn 0.5s ease forwards; }
    @keyframes fadeIn { to { opacity: 1; } }
    .ring { animation: growRing 1.2s ease forwards; }
    @keyframes growRing { from { stroke-dashoffset: ${circumference}; } to { stroke-dashoffset: ${dashoffset}; } }
  </style>
  <rect x="0.5" y="0.5" width="419" height="239" rx="14" fill="${bg}" stroke="${border}"/>
  <text x="30" y="34" class="title">${username}'s GitHub Stats</text>
  ${rowsSvg}
  <g transform="translate(360, 120)">
    <circle r="44" fill="none" stroke="${border}" stroke-width="7"/>
    <circle r="44" fill="none" stroke="${teal}" stroke-width="7" stroke-linecap="round"
      stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"
      transform="rotate(-90)" class="ring"/>
    <text y="-2" text-anchor="middle" class="ranklabel">${ringPct.toFixed(1)}%</text>
    <text y="16" text-anchor="middle" class="ranksub">RANK</text>
  </g>
</svg>`.trim();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(svg);
  } catch (err) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(`<svg width="420" height="60"><rect width="420" height="60" fill="#12141A"/><text x="20" y="35" fill="#FF6B5B" font-family="sans-serif" font-size="13">Error: ${err.message}</text></svg>`);
  }
}
