export async function fetchGithubData(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
        }
        repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW]) {
          totalCount
        }
        pullRequests { totalCount }
        issues { totalCount }
        repositories(first: 100, ownerAffiliation: OWNER, isFork: false, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            stargazerCount
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges { size node { name color } }
            }
          }
        }
      }
    }`;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { login: username } })
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data.user;
}

export function calcStars(user) {
  return user.repositories.nodes.reduce((sum, r) => sum + r.stargazerCount, 0);
}

export function calcLanguages(user) {
  const totals = {};
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      if (!totals[name]) totals[name] = { size: 0, color: edge.node.color || '#999' };
      totals[name].size += edge.size;
    }
  }
  const grandTotal = Object.values(totals).reduce((s, l) => s + l.size, 0);
  return Object.entries(totals)
    .map(([name, d]) => ({ name, color: d.color, pct: (d.size / grandTotal) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);
}

export function calcRank({ stars, commits, prs, issues, contributed }) {
  const norm = (val, mid) => 1 / (1 + Math.exp(-(val - mid) / (mid / 2 || 1)));
  const score =
    norm(stars, 50) * 0.35 +
    norm(commits, 200) * 0.30 +
    norm(prs, 20) * 0.15 +
    norm(issues, 10) * 0.10 +
    norm(contributed, 5) * 0.10;
  return Math.max(1, Math.round((1 - score) * 100 * 10) / 10);
}
