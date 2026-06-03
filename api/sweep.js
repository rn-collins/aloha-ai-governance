import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// --- Congress.gov: AI-related bills ---
async function fetchAIBills() {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return [];

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const sinceStr = since.toISOString().split('T')[0];

  const url = `https://api.congress.gov/v3/bill?query=artificial+intelligence&fromDateTime=${sinceStr}T00:00:00Z&sort=updateDate+desc&limit=50&api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.bills || []).map(b => ({
    source: 'Congress',
    category: 'AI Legislation',
    title: b.title || 'Untitled Bill',
    id: `${b.type}${b.number}-${b.congress}`,
    date: (b.latestAction?.actionDate || b.updateDate || '').slice(0, 10),
    status: b.latestAction?.text || b.type,
    url: b.url || `https://www.congress.gov/bill/${b.congress}th-congress/${b.type?.toLowerCase()}-bill/${b.number}`,
    congress: b.congress,
    abstract: b.latestAction?.text || '',
  }));
}

// --- FTC: AI enforcement press releases via RSS ---
async function fetchFTCReleases() {
  const res = await fetch('https://www.ftc.gov/feeds/press-release.xml');
  if (!res.ok) return [];
  const xml = await res.text();

  const AI_TERMS = ['artificial intelligence', 'ai ', ' ai,', 'machine learning',
    'algorithm', 'automated decision', 'generative', 'chatbot', 'deepfake'];

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  const results = [];

  for (const [, body] of items) {
    const title = (body.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                   body.match(/<title>(.*?)<\/title>/))?.[1] || '';
    const desc = (body.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                  body.match(/<description>(.*?)<\/description>/))?.[1]?.replace(/<[^>]+>/g, '') || '';
    const link = body.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = body.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';

    const combined = `${title} ${desc}`.toLowerCase();
    if (!AI_TERMS.some(t => combined.includes(t))) continue;

    const d = pubDate ? new Date(pubDate) : null;
    const since = new Date();
    since.setDate(since.getDate() - 180);
    if (d && d < since) continue;

    results.push({
      source: 'FTC',
      category: 'FTC AI Enforcement',
      title,
      id: link,
      date: d ? d.toISOString().slice(0, 10) : '',
      status: 'Press Release',
      url: link,
      abstract: desc.slice(0, 300),
    });
  }
  return results;
}

function parseRedisVal(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return []; } }
  return val;
}

export default async function handler(req, res) {
  try {
    const [bills, ftc] = await Promise.all([fetchAIBills(), fetchFTCReleases()]);
    const all = [...bills, ...ftc].sort((a, b) => b.date.localeCompare(a.date));

    const previous = parseRedisVal(await redis.get('ai_gov:documents'));
    const prevIds = new Set(previous.map(d => d.id));
    const newItems = all.filter(d => !prevIds.has(d.id));

    await redis.set('ai_gov:documents', all);
    await redis.set('ai_gov:last_sweep', new Date().toISOString());
    await redis.set('ai_gov:bill_count', bills.length);
    await redis.set('ai_gov:ftc_count', ftc.length);

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

    res.json({ ok: true, bills: bills.length, ftc: ftc.length, total: all.length, new_this_sweep: newItems.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
