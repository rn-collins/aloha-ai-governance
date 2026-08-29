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
  if (!key) throw new Error('EXA_API_KEY is not configured');

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const sinceStr = since.toISOString().split('T')[0];

  const seen = new Set();
  const allItems = [];
  const failed = [];

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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    } catch (error) {
      failed.push({ category, message: error.message });
    }
  }));

  // Sort by date descending
  allItems.sort((a, b) => b.date.localeCompare(a.date));

  if (failed.length === EXA_SEARCHES.length) throw new Error('Every discovery search failed');
  if (allItems.length === 0) throw new Error('Discovery returned zero records; previous dataset retained');

  return {
    items: allItems,
    failed,
    debug: {
      total: allItems.length,
      failed_searches: failed,
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
  // Writes must not be triggerable by anonymous callers. Vercel strips inbound
  // x-vercel-* headers and sets x-vercel-cron on its own scheduled invocations,
  // so the cron keeps working whether or not CRON_SECRET has been configured.
  const secret = process.env.CRON_SECRET;
  const fromCron = Boolean(req.headers['x-vercel-cron']);
  const authorised = fromCron || (secret && req.headers.authorization === `Bearer ${secret}`);
  if (!authorised) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const attemptedAt = new Date().toISOString();
  await redis.set('ai_gov:last_attempt', attemptedAt);

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
    await redis.set('ai_gov:last_sweep', attemptedAt);
    await redis.set('ai_gov:last_error', '');
    await redis.set('ai_gov:failed_searches', result.failed.length);
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
      failed_searches: result.failed.length,
      categories,
      debug: result.debug,
    });
  } catch (err) {
    // Never overwrite a good dataset with a failed run, and never stamp a fresh
    // last_sweep date for work that did not happen.
    await redis.set('ai_gov:last_error', err.message);
    res.status(503).json({
      ok: false,
      error: 'Source refresh failed; the previously collected dataset was retained.',
      detail: err.message,
      attempted_at: attemptedAt,
    });
  }
}
