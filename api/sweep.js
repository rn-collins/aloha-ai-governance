import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Terms that must appear in the TITLE to count as an AI bill
// Deliberately strict — false positives are worse than false negatives for a client-facing dashboard
const AI_TITLE_TERMS = [
  'artificial intelligence', 'machine learning', 'algorithmic',
  'automated decision', 'generative ai', 'foundation model',
  'large language model', 'deepfake', 'facial recognition',
  'algorithmic accountability', 'ai liability', 'ai safety',
  'ai governance', 'ai transparency', 'ai accountability',
  'ai act', 'automated system accountability',
];

const AI_ABBREVIATION = /\bai\b/i;

function isAIBill(title) {
  if (!title) return false;
  const lower = title.toLowerCase();
  if (AI_ABBREVIATION.test(title)) return true;
  return AI_TITLE_TERMS.some(t => lower.includes(t));
}

async function fetchAIBills() {
  const key = process.env.CONGRESS_API_KEY;
  if (!key) {
    return { bills: [], debug: 'No API key found in env' };
  }

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const sinceStr = since.toISOString().split('T')[0];

  const url = `https://api.congress.gov/v3/bill?query=artificial+intelligence&fromDateTime=${sinceStr}T00:00:00Z&sort=updateDate+desc&limit=100&api_key=${key}`;

  let res, data;
  try {
    res = await fetch(url);
    data = await res.json();
  } catch (e) {
    return { bills: [], debug: `Fetch error: ${e.message}` };
  }

  if (!res.ok || data.error) {
    return { bills: [], debug: `API error: ${JSON.stringify(data.error || res.status)}` };
  }

  const rawBills = data.bills || [];
  const filtered = rawBills.filter(b => isAIBill(b.title));

  return {
    bills: filtered.map(b => ({
      source: 'Congress',
      category: 'AI Legislation',
      title: b.title || 'Untitled Bill',
      id: `${b.type}${b.number}-${b.congress}`,
      date: (b.latestAction?.actionDate || b.updateDate || '').slice(0, 10),
      status: b.latestAction?.text || b.type,
      url: `https://www.congress.gov/bill/${b.congress}th-congress/${(b.type || '').toLowerCase()}-bill/${b.number}`,
      congress: b.congress,
      abstract: b.latestAction?.text || '',
    })),
    debug: {
      total_returned: rawBills.length,
      passed_title_filter: filtered.length,
      sample_raw_titles: rawBills.slice(0, 5).map(b => b.title),
      sample_filtered_titles: filtered.slice(0, 5).map(b => b.title),
    }
  };
}

async function fetchFTCReleases() {
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
      const itemPattern = xml.includes('<item>')
        ? /<item>([\s\S]*?)<\/item>/g
        : /<entry>([\s\S]*?)<\/entry>/g;
      for (const [, body] of xml.matchAll(itemPattern)) {
        const title = (
          body.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/s) ||
          body.match(/<title[^>]*>(.*?)<\/title>/s)
        )?.[1]?.trim() || '';
        const desc = (
          body.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
          body.match(/<description[^>]*>([\s\S]*?)<\/description>/) ||
          body.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)
        )?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
        const link = (
          body.match(/<link>(.*?)<\/link>/) ||
          body.match(/<link[^>]+href="([^"]+)"/)
        )?.[1]?.trim() || '';
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
          source: 'FTC', category: 'FTC AI Enforcement', title,
          id: link || title, date: d ? d.toISOString().slice(0, 10) : '',
          status: 'Press Release', url: link, abstract: desc.slice(0, 300),
        });
      }
      if (xml.length > 1000) return results;
    } catch (e) { continue; }
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
    const [billResult, ftc] = await Promise.all([fetchAIBills(), fetchFTCReleases()]);
    const bills = billResult.bills;
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
      debug: billResult.debug,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
