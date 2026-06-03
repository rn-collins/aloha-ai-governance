import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Terms that must appear in the TITLE to count as an AI bill
const AI_TITLE_TERMS = [
  'artificial intelligence', 'machine learning', 'algorithmic',
  'automated decision', 'generative ai', 'foundation model',
  'large language model', 'ai act', 'ai accountability',
  'ai transparency', 'ai safety', 'ai governance',
  'deepfake', 'facial recognition', 'automated system',
  'algorithmic accountability', 'ai liability',
];

// Broader terms OK in title if standalone (not inside other words)
const AI_ABBREVIATION = /\bai\b/i;

function isAIBill(title) {
  const lower = (title || '').toLowerCase();
  if (AI_ABBREVIATION.test(title)) return true;
  return AI_TITLE_TERMS.some(t => lower.includes(t));
}

// --- Congress.gov: AI-related bills ---
async function fetchAIBills() {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) return [];

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const sinceStr = since.toISOString().split('T')[0];

  // Fetch more results so filtering doesn't leave us empty
  const url = `https://api.congress.gov/v3/bill?query=artificial+intelligence&fromDateTime=${sinceStr}T00:00:00Z&sort=updateDate+desc&limit=100&api_key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();

  return (data.bills || [])
    .filter(b => isAIBill(b.title))
    .map(b => ({
      source: 'Congress',
      category: 'AI Legislation',
      title: b.title || 'Untitled Bill',
      id: `${b.type}${b.number}-${b.congress}`,
      date: (b.latestAction?.actionDate || b.updateDate || '').slice(0, 10),
      status: b.latestAction?.text || b.type,
      url: `https://www.congress.gov/bill/${b.congress}th-congress/${(b.type || '').toLowerCase()}-bill/${b.number}`,
      congress: b.congress,
      abstract: b.latestAction?.text || '',
    }));
}

// --- FTC: AI press releases ---
async function fetchFTCReleases() {
  // Try multiple FTC feed URLs
  const feeds = [
    'https://www.ftc.gov/feeds/press-release.xml',
    'https://www.ftc.gov/feeds/news.xml',
  ];

  const AI_TERMS = [
    'artificial intelligence', 'machine learning', 'algorithm',
    'automated decision', 'generative', 'chatbot', 'deepfake',
    'ai tool', 'ai system', 'facial recognition', 'biometric',
  ];

  for (const feedUrl of feeds) {
    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 Aloha-AI-Monitor/1.0' }
      });
      if (!res.ok) continue;
      const xml = await res.text();
      if (!xml.includes('<item>') && !xml.includes('<entry>')) continue;

      const results = [];
      const since = new Date();
      since.setDate(since.getDate() - 180);

      // Handle both RSS <item> and Atom <entry>
      const itemPattern = xml.includes('<item>') 
        ? /<item>([\s\S]*?)<\/item>/g 
        : /<entry>([\s\S]*?)<\/entry>/g;

      for (const [, body] of xml.matchAll(itemPattern)) {
        // Extract title — handle CDATA and plain
        const title = (
          body.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s) ||
          body.match(/<title[^>]*>(.*?)<\/title>/s)
        )?.[1]?.trim() || '';

        // Extract description/summary
        const desc = (
          body.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
          body.match(/<description[^>]*>([\s\S]*?)<\/description>/) ||
          body.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
        )?.[1]?.replace(/<[^>]+>/g, '').trim() || '';

        // Extract link
        const link = (
          body.match(/<link>(.*?)<\/link>/) ||
          body.match(/<link[^>]+href="([^"]+)"/)
        )?.[1]?.trim() || '';

        // Extract date
        const pubDate = (
          body.match(/<pubDate>(.*?)<\/pubDate>/) ||
          body.match(/<published>(.*?)<\/published>/) ||
          body.match(/<updated>(.*?)<\/updated>/)
        )?.[1]?.trim() || '';

        const combined = `${title} ${desc}`.toLowerCase();
        if (!AI_TERMS.some(t => combined.includes(t))) continue;

        const d = pubDate ? new Date(pubDate) : null;
        if (d && d < since) continue;

        results.push({
          source: 'FTC',
          category: 'FTC AI Enforcement',
          title: title || 'FTC Press Release',
          id: link || title,
          date: d ? d.toISOString().slice(0, 10) : '',
          status: 'Press Release',
          url: link,
          abstract: desc.slice(0, 300),
        });
      }

      if (results.length > 0 || xml.length > 1000) return results;
    } catch (e) {
      continue;
    }
  }
  return [];
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

    res.json({
      ok: true,
      bills: bills.length,
      ftc: ftc.length,
      total: all.length,
      new_this_sweep: newItems.length,
      sample_titles: all.slice(0, 3).map(d => d.title),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
