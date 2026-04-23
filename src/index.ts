import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { addressSchema } from './schema';
import { formatAddress } from './formatter';
import { getSupportedCountries } from './templates';
import { getAllCountryMetadata, getCountryMetadata } from './metadata';

const app = new Hono();
const VERSION = '1.0.0';

// ---------- Middleware ----------

// CORS — allow browser apps to call the API directly (also helps RapidAPI docs page)
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, X-RapidAPI-Proxy-Secret, X-RapidAPI-Key');
  if (c.req.method === 'OPTIONS') return c.body(null, 204);
  await next();
});

// RapidAPI proxy-secret check.
// RapidAPI sends every legitimate request with header X-RapidAPI-Proxy-Secret = <your secret>.
// If RAPIDAPI_PROXY_SECRET is set in env, reject any request without the matching header.
// This prevents people from hitting your Render URL directly and bypassing RapidAPI billing.
// Skipped for public info endpoints (/, /health) so monitoring still works.
app.use('/v1/*', async (c, next) => {
  const expected = process.env.RAPIDAPI_PROXY_SECRET;
  if (!expected) {
    // No secret configured (e.g. local dev) — allow through
    return next();
  }
  const provided = c.req.header('X-RapidAPI-Proxy-Secret');
  if (provided !== expected) {
    return c.json(
      { error: 'Unauthorized — please subscribe via RapidAPI to use this API' },
      401
    );
  }
  await next();
});

// ---------- Public endpoints ----------

// Health check — Render and RapidAPI both poll this
app.get('/health', (c) => c.json({ status: 'ok', version: VERSION }));

// Info endpoint
app.get('/', (c) =>
  c.json({
    name: 'AddressFormat API',
    version: VERSION,
    description: 'Format addresses into country-conformant shipping labels for 30+ countries.',
    supported_countries: getSupportedCountries(),
    country_count: getSupportedCountries().length,
    endpoints: [
      'POST /v1/format',
      'POST /v1/format/batch',
      'GET  /v1/countries',
      'GET  /v1/countries/:code',
    ],
    docs: 'https://rapidapi.com/your-handle/api/addressformat',
  })
);

// ---------- API endpoints ----------

// Single address
app.post('/v1/format', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      400
    );
  }

  try {
    const result = formatAddress(parsed.data);
    return c.json(result);
  } catch (err) {
    return c.json({ error: (err as Error).message }, 400);
  }
});

// Batch endpoint — array of addresses
app.post('/v1/format/batch', async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  if (!Array.isArray(body?.addresses)) {
    return c.json({ error: 'addresses must be an array' }, 400);
  }
  if (body.addresses.length === 0) {
    return c.json({ error: 'addresses array is empty' }, 400);
  }
  if (body.addresses.length > 1000) {
    return c.json({ error: 'max 1000 addresses per batch' }, 400);
  }

  const results = body.addresses.map((addr: unknown, index: number) => {
    const parsed = addressSchema.safeParse(addr);
    if (!parsed.success) {
      return {
        index,
        error: 'Validation failed',
        details: parsed.error.flatten(),
      };
    }
    try {
      return { index, ...formatAddress(parsed.data) };
    } catch (err) {
      return { index, error: (err as Error).message };
    }
  });

  return c.json({ count: results.length, results });
});

// List all supported countries with their metadata.
// Useful for building dynamic checkout forms: which fields to show per country,
// postcode regex for client-side validation, examples for tooltips, etc.
app.get('/v1/countries', (c) => {
  const all = getAllCountryMetadata();
  return c.json({
    count: all.length,
    countries: all,
  });
});

// Metadata for a single country
app.get('/v1/countries/:code', (c) => {
  const code = c.req.param('code').toUpperCase();
  const meta = getCountryMetadata(code);
  if (!meta) {
    return c.json(
      { error: `Country "${code}" is not supported`, supported: getSupportedCountries() },
      404
    );
  }
  return c.json(meta);
});

const port = Number(process.env.PORT) || 3000;
console.log(`AddressFormat API v${VERSION} listening on http://localhost:${port}`);
console.log(`Supported countries: ${getSupportedCountries().length}`);
console.log(`RapidAPI proxy check: ${process.env.RAPIDAPI_PROXY_SECRET ? 'ENABLED' : 'disabled (set RAPIDAPI_PROXY_SECRET to enable)'}`);
serve({ fetch: app.fetch, port });
