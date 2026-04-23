# Deploying + selling on RapidAPI

This guide walks from "code on your laptop" to "API making money on RapidAPI" in about 30 minutes, plus advice on positioning and pricing to maximise conversions.

Three steps:
1. Push to GitHub
2. Deploy to Render (public URL)
3. List on RapidAPI (which proxies to your Render URL and handles billing)

---

## Step 1 — Push to GitHub

```bash
cd addressformat-api
git init
git add .
git commit -m "v1.0.0 — 35 countries"
```

Create a new empty repo on github.com and push.

---

## Step 2 — Deploy to Render

1. Sign up at [render.com](https://render.com) (free).
2. **New +** → **Web Service** → connect your GitHub repo.
3. Render reads `render.yaml` automatically.
4. Generate a long random string — your **proxy secret**:
   ```bash
   openssl rand -hex 32
   ```
5. In Render: **Environment** → **Add Environment Variable**:
   - Key: `RAPIDAPI_PROXY_SECRET`
   - Value: the random string from step 4
6. **Manual Deploy** → **Deploy latest commit**.
7. After ~2 minutes test it:
   ```bash
   curl https://addressformat-api.onrender.com/health
   # { "status": "ok", "version": "1.0.0" }
   ```

> **Free tier**: sleeps after 15 min of inactivity. First request after sleep takes ~30 seconds. Fine for launch — upgrade to Starter ($7/mo) when you have paying users who complain about cold starts.

---

## Step 3 — List on RapidAPI

### 3a. Create the listing

1. Go to [rapidapi.com/provider](https://rapidapi.com/provider), sign in.
2. **Add New API**.
3. Fill in:
   - **API Name**: `AddressFormat`
   - **Category**: Data (or eCommerce)
   - **Short description**: "Format shipping addresses into country-conformant labels for 35+ countries. Local postcode rules, UPU-correct country names, bulk endpoint up to 1000 addresses."

### 3b. Write a listing that converts

This is the single most important step for sales. The listing is where developers decide in ~30 seconds whether to subscribe.

**Do:**
- Lead with the specific problem: "Every country formats addresses differently. Get it wrong and your packages come back."
- Quantify: "35 countries. 1 API call."
- Name the countries explicitly in the long description — it's searchable on RapidAPI, and when someone searches for "Brazilian address format API" they should find you.
- Paste a before/after: show the raw input fields, show the formatted label.
- Link to `GET /v1/countries` as a "try me" — it works without auth if you haven't enabled the proxy secret yet, and shows the breadth immediately.

**Don't:**
- Don't say "address API" generically — be specific about *formatting*, because competitors do validation/parsing/autocomplete and you'd get lost.
- Don't promise features you don't have (autocomplete, validation, geocoding).

### 3c. Connect your backend

1. **Settings** → **General** → **Base URL**: `https://addressformat-api.onrender.com`
2. **Settings** → **Code-Level Settings** → add static header:
   - Header name: `X-RapidAPI-Proxy-Secret`
   - Header value: the same random string from Render

This is the security layer. Without it, anyone who finds your Render URL can bypass RapidAPI and avoid paying. With it, your backend rejects anything that doesn't come through RapidAPI.

### 3d. Define the endpoints

Add all four. The first three carry the product, the fourth is the conversion driver (it shows developers the scope and helps them build without subscribing first — which means they'll subscribe once they start using it for real).

**Endpoint 1: Format single address**
- `POST /v1/format`
- "Format one address into a country-conformant shipping label."

**Endpoint 2: Format batch**
- `POST /v1/format/batch`
- "Format up to 1000 addresses in one call. Use this for catalogue imports, bulk label printing, or nightly CSV ingestion."

**Endpoint 3: List countries + metadata**
- `GET /v1/countries`
- "Get required fields, postcode regex, and examples for all 35 supported countries. Use this to build dynamic checkout forms."

**Endpoint 4: Single country metadata**
- `GET /v1/countries/:code`
- "Get the required fields and postcode format for one specific country."

For each endpoint, fill in a **working example request** in the RapidAPI UI. This is important — developers click "Test Endpoint" in the browser before they commit. If the example doesn't work, they bounce.

### 3e. Pricing

Recommended pricing structure. It's designed so every serious user ends up on PRO or ULTRA:

| Plan    | Price/mo  | Quota            | Overage         | Target user                                  |
|---------|-----------|------------------|-----------------|----------------------------------------------|
| BASIC   | Free      | 500 requests     | hard cap        | Tire-kickers, side projects                  |
| PRO     | $9        | 50,000 requests  | $0.0002/req     | Small stores, indie SaaS                     |
| ULTRA   | $29       | 500,000 requests | $0.0001/req     | Mid-size e-commerce, label-printing services |
| MEGA    | $99       | 5M requests      | $0.00005/req    | Marketplaces, 3PL operators                  |

**Rationale:**
- Free tier at **500** (not 1,000) because checkout volume eats this in a single weekend — nudges real users to PRO fast.
- PRO at $9 is an impulse-purchase price; developers expense it without thinking.
- ULTRA at $29 is the sweet spot for scaled e-commerce — one small online store processing 15k orders a month will land here.
- MEGA at $99 doesn't expect many subscribers, but anchors ULTRA as "the reasonable choice".

After 60 days of real traffic, revisit:
- If almost everyone is on BASIC and churning → lower the free cap to 200.
- If PRO users are consistently hitting overage at ~$15/mo extra → bump PRO quota to 100k and raise to $12.

### 3f. Publish

**Make Public**. RapidAPI reviews new APIs (typically 1–3 business days).

---

## What drives sales on RapidAPI

Based on how the marketplace actually works:

1. **Search discoverability.** RapidAPI's internal search matches on name, description, and tag. Your description should contain "address format", "shipping label", "postal code", "international mail", every country name ("format Japanese address", "format German address"), and "bulk" / "batch".

2. **The first code example.** RapidAPI renders a JavaScript snippet on every listing page. Make sure your example uses realistic data (not `"street": "string"`) — developers copy-paste, see it work, subscribe.

3. **Working test calls.** The "Test Endpoint" button must succeed for the BASIC tier out of the box. If RapidAPI's default test ever returns 400/500, you lose conversions.

4. **Obvious pricing value.** At $9/mo for 50k requests, the PRO tier prices out at $0.00018/request. Developers compare this mentally against "how long would it take me to build this?" — 35 countries of formatting logic is obviously more than one day of dev work, so $9 looks cheap.

5. **Country breadth as a moat.** Competitors on RapidAPI do address validation or autocomplete, not formatting. The `GET /v1/countries` endpoint demonstrates breadth immediately — make sure developers see it in the first 10 seconds on your listing.

---

## How users will call your API

Once approved, users see a code snippet like:

```javascript
const response = await fetch(
  'https://addressformat.p.rapidapi.com/v1/format',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'their-personal-key',
      'X-RapidAPI-Host': 'addressformat.p.rapidapi.com'
    },
    body: JSON.stringify({
      recipient: 'Jan de Vries',
      street: 'Damrak',
      house_number: '70',
      postal_code: '1012LG',
      city: 'Amsterdam',
      country: 'NL'
    })
  }
);
const data = await response.json();
```

Flow:
1. User's app calls `addressformat.p.rapidapi.com` (RapidAPI's proxy).
2. RapidAPI checks their API key and quota.
3. RapidAPI forwards to your Render URL, adding `X-RapidAPI-Proxy-Secret`.
4. Your backend verifies the secret, formats, returns.
5. RapidAPI logs the call, bills at month-end.
6. You get paid out (RapidAPI takes ~20%).

You never touch billing, keys, or rate limits. Your backend only needs to be reachable, verify the proxy secret, and return the formatted address.

---

## Local development

Proxy secret check is **disabled** when `RAPIDAPI_PROXY_SECRET` is unset.

```bash
npm run dev
# RapidAPI proxy check: disabled
```

To test production behaviour locally:

```bash
RAPIDAPI_PROXY_SECRET=test123 npm run dev

# Fails (401):
curl -X POST http://localhost:3000/v1/format ...

# Works:
curl -X POST http://localhost:3000/v1/format \
  -H "X-RapidAPI-Proxy-Secret: test123" ...
```

---

## Monitoring + costs

- **Render free**: free, sleeps after 15min idle. Fine for launch.
- **Render Starter**: $7/mo, never sleeps, 0.5GB RAM. Switch at steady traffic.
- **RapidAPI fees**: ~20% of revenue + per-transaction fee. No upfront cost.

Check regularly:
- Render dashboard → request volume + bandwidth
- RapidAPI provider dashboard → subscribers per plan, request volume, monthly revenue

If one subscriber hammers past their plan and Render slows down:
1. Bump Render plan (instant, +$7/mo).
2. Add per-IP rate-limit middleware.
3. Lower the BASIC quota to push freeloaders to PRO.

---

## Shipping updates without breaking subscribers

Push to GitHub → Render auto-deploys. RapidAPI listing doesn't need re-publishing.

For **breaking** changes, version the route: add `/v2/format` and keep `/v1/format` running for at least 6 months. Announce in the listing changelog so subscribers can migrate before you cut the old version.

Adding new countries is a **non-breaking** change — ship them continuously. Each new country is a marketing moment: "Now supporting Thailand" → update listing description → run a RapidAPI newsletter blast (if available in your tier) → social post. Countries added post-launch are the cheapest way to stay on the listing's "recently updated" surface.
