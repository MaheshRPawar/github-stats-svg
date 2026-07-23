import { fetchGithubData, calcLanguages } from '../lib/github.js';

export default async function handler(req, res) {
  const { username = 'MR1229' } = req.query;

  try {
    const user = await fetchGithubData(username);
    const langs = calcLanguages(user);

    const bg = '#12141A';
    const border = '#262A34';
    const text = '#F4F4F5';
    const label = '#9CA3AF';

    const barWidth = 340;
    let xOffset = 0;
    const segments = langs.map((l, i) => {
      const w = (l.pct / 100) * barWidth;
      const seg = `<rect class="seg" style="animation-delay:${i * 0.1}s" x="${xOffset}" y="0" width="${w}" height="12" fill="${l.color}"/>`;
      xOffset += w;
      return seg;
    }).join('');

    const rows = langs.map((l, i) => `
      <g class="fade-row" style="animation-delay:${0.4 + i * 0.08}s" transform="translate(30, ${100 + i * 24})">
        <circle cx="4" cy="-5" r="5" fill="${l.color}"/>
        <text x="18" y="0" class="rowlabel">${l.name}</text>
        <text x="360" y="0" text-anchor="end" class="rowvalue">${l.pct.toFixed(2)}%</text>
      </g>`).join('');

    const svg = `
<svg width="420" height="${100 + langs.length * 24 + 20}" viewBox="0 0 420 ${100 + langs.length * 24 + 20}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font: 700 16px 'Segoe UI', sans-serif; fill: ${text}; }
    .rowlabel { font: 500 13px 'Segoe UI', sans-serif; fill: ${label}; }
    .rowvalue { font: 700 13px 'Segoe UI', sans-serif; fill: ${text}; }
    .fade-row { opacity: 0; animation: fadeIn 0.5s ease forwards; }
    @keyframes fadeIn { to { opacity: 1; } }
    .seg { transform: scaleX(0); transform-origin: left; animation: grow 0.8s ease forwards; }
    @keyframes grow { to { transform: scaleX(1); } }
  </style>
  <rect x="0.5" y="0.5" width="419" height="${100 + langs.length * 24 + 20 - 1}" rx="14" fill="${bg}" stroke="${border}"/>
  <text x="30" y="34" class="title">Most Used Languages</text>
  <g transform="translate(30, 55)">
    <rect width="${barWidth}" height="12" rx="6" fill="${border}"/>
    <clipPath id="barclip"><rect width="${barWidth}" height="12" rx="6"/></clipPath>
    <g clip-path="url(#barclip)">${segments}</g>
  </g>
  ${rows}
</svg>`.trim();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(svg);
  } catch (err) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(`<svg width="420" height="60"><rect width="420" height="60" fill="#12141A"/><text x="20" y="35" fill="#FF6B5B" font-family="sans-serif" font-size="13">Error: ${err.message}</text></svg>`);
  }
}
