import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const EXA_SEARCHES = [
  { query: 'artificial intelligence legislation Congress bill 2026', category: 'AI Legislation' },
  { query: 'FTC artificial intelligence enforcement action 2026', category: 'FTC AI Enforcement' },
  { query: 'state bar association AI ethics guidance opinion 2026', category: 'Bar Ethics Guidance' },
  { query: 'EU AI Act compliance legal platform 2026', category: 'EU AI Act' },
  { query: 'ABA artificial intelligence model rules guidance 2026', category: 'ABA Guidance' },
];

async function fetchExa() {
  const key = process.env.EXA_API_KEY;
  if (!key) return { items: [], debug: 'No EXA_API_KEY found' };

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const sinceStr = since.toISOString().split('T')[0];

  const seen = new Set();
  const allItems = [];

  await Promise.all(EXA_SEARCHES.map(async ({ query, category }) => {
    try {
      const res = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
        },
        body: JSON.stringify({
          query,
          numResults: 10,
          startPublishedDate: sinceStr,
          useAutoprompt: true,
          type: 'neural',
        }),
      });

      if (!res.ok) return;
      const data = await res.json();

      for (const r of (data.results || [])) {
        if (seen.has(r.url)) continue;
        seen.add(r.url);
        allItems.push({
          source: category.split(' ')[0],
          category,
          title: r.title || 'Untitled',
          id: r.url,
          date: (r.publishedDate || '').slice(0, 10),
          status: '',
          url: r.url,
          abstract: (r.text || r.snippet || '').slice(0, 300),
        });
      }
    } catch { /* skip failed searches */ }
  }));

  // Sort by date descending
  allItems.sort((a, b) => b.date.localeCompare(a.date));

  return {
    items: allItems,
    debug: {
      total: allItems.length,
      by_category: EXA_SEARCHES.reduce((acc, { category }) => {
        acc[category] = allItems.filter(i => i.category === category).length;
        return acc;
      }, {}),
      sample_titles: allItems.slice(0, 5).map(i => i.title),
    }
  };
}

function parseRedisVal(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
  return val;
}

export default async function handler(req, res) {
  try {
    const result = await fetchExa();
    const items = result.items;

    const previous = parseRedisVal(await redis.get('ai_gov:documents'));
    const prevIds = new Set(previous.map(d => d.id));
    const newItems = items.filter(d => !prevIds.has(d.id));

    const categories = {};
    for (const item of items) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    }

    await redis.set('ai_gov:documents', items);
    await redis.set('ai_gov:last_sweep', new Date().toISOString());
    await redis.set('ai_gov:bill_count', items.filter(i => i.category === 'AI Legislation').length);
    await redis.set('ai_gov:ftc_count', items.filter(i => i.category === 'FTC AI Enforcement').length);

    if (newItems.length > 0 && process.env.SLACK_WEBHOOK_URL) {
      const top = newItems[0];
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*AI Governance Tracker* — ${newItems.length} new item${newItems.length > 1 ? 's' : ''}\n*${top.category}:* ${top.title}\n${top.url}`
        })
      });
    }

    res.json({
      ok: true,
      total: items.length,
      new_this_sweep: newItems.length,
      categories,
      debug: result.debug,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
