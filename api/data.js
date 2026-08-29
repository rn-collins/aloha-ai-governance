import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function parseRedisVal(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return val; } }
  return val;
}

// The sweep is scheduled weekly. Anything older than two cycles is overdue and
// must be shown as overdue rather than presented as the current picture.
const STALE_AFTER_MS = 14 * 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  try {
    const [docsRaw, lastSweep, lastAttempt, lastError, failedSearches, billCount, ftcCount] = await Promise.all([
      redis.get('ai_gov:documents'),
      redis.get('ai_gov:last_sweep'),
      redis.get('ai_gov:last_attempt'),
      redis.get('ai_gov:last_error'),
      redis.get('ai_gov:failed_searches'),
      redis.get('ai_gov:bill_count'),
      redis.get('ai_gov:ftc_count'),
    ]);

    const docs = parseRedisVal(docsRaw) || [];
    const categories = {};
    for (const d of docs) {
      categories[d.category] = (categories[d.category] || 0) + 1;
    }

    const ageMs = lastSweep ? Date.now() - new Date(lastSweep).getTime() : null;
    const stale = !lastSweep || !Number.isFinite(ageMs) || ageMs > STALE_AFTER_MS;
    const newest = docs.map(d => d.date).filter(Boolean).sort().pop() || null;

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      ok: true,
      last_sweep: lastSweep,
      total: docs.length,
      bill_count: billCount || 0,
      ftc_count: ftcCount || 0,
      categories,
      collection_health: {
        status: stale ? 'stale' : (lastError ? 'degraded' : 'current'),
        last_collection: lastSweep || null,
        last_attempt: lastAttempt || null,
        age_days: Number.isFinite(ageMs) ? Math.round(ageMs / 86400000) : null,
        stale,
        cadence: 'Weekly · Mondays 09:00 UTC',
        failed_searches: Number(failedSearches) || 0,
        newest_item_date: newest,
        error: lastError || null,
      },
      documents: docs,
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      error: 'Collection data is temporarily unavailable.',
      collection_health: { status: 'failed', stale: true, last_collection: null },
    });
  }
}
