AddressFormat API
Format structured address fields into country-conformant shipping labels.
v1.0.0 — supports 35 countries across Europe, the Americas, Asia-Pacific, the Middle East, and Africa.
Every country has its own local convention. The Netherlands puts the postcode before the city. France requires the city in uppercase. The UK puts the postcode on its own line. Japan reverses the order. Germany, Austria, and Switzerland share a structure but differ on postcode digits. This API knows all of that so your backend doesn't have to.
Supported countries (35)
Europe (22): NL, BE, LU, DE, AT, CH, FR, MC, UK, GB, IE, IT, ES, PT, GR, PL, CZ, HU, SE, DK, NO, FI
Americas (4): US, CA, BR, MX
Asia-Pacific (6): AU, NZ, JP, SG, HK, IN
Middle East + Africa (3): AE, IL, ZA
Quick start
```bash
npm install
npm test         # 59 tests
npm run dev      # http://localhost:3000
```
Try it
Domestic Dutch address:
```bash
curl -X POST http://localhost:3000/v1/format \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "Jan de Vries",
    "street": "Damrak",
    "house_number": "70",
    "postal_code": "1012LG",
    "city": "Amsterdam",
    "country": "NL"
  }'
```
```json
{
  "formatted": "Jan de Vries\nDamrak 70\n1012 LG  Amsterdam",
  "lines": ["Jan de Vries", "Damrak 70", "1012 LG  Amsterdam"],
  "warnings": []
}
```
International parcel Germany → Netherlands:
```bash
curl -X POST http://localhost:3000/v1/format \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "Jan de Vries",
    "street": "Damrak",
    "house_number": "70",
    "postal_code": "1012LG",
    "city": "Amsterdam",
    "country": "NL",
    "source_country": "DE"
  }'
```
City becomes uppercase, country name "NIEDERLANDE" is appended (German for Netherlands, per UPU rules).
Endpoints
`POST /v1/format`
Single address → formatted result.
`POST /v1/format/batch`
Up to 1000 addresses per call:
```json
{ "addresses": [ { ... }, { ... } ] }
```
`GET /v1/countries`
Returns metadata for all 35 countries: required fields, postcode regex, examples. Use this to build dynamic checkout forms — know exactly which fields to show for each destination, and validate postcodes client-side before hitting your server.
`GET /v1/countries/:code`
Metadata for a single country. Example response:
```json
{
  "code": "JP",
  "name": "Japan",
  "required_fields": ["recipient","street","house_number","postal_code","city","country","state_region"],
  "optional_fields": ["company","apartment","source_country"],
  "postal_code_regex": "^〒?\\d{3}-?\\d{4}$",
  "postal_code_example": "100-0001",
  "state_region_label": "Prefecture",
  "state_region_note": "Prefecture name required (Tokyo, Osaka, Kyoto, etc.).",
  "example_input": { ... }
}
```
`GET /health`
Health check. Used by infrastructure monitoring (Hostinger / RapidAPI uptime checks).
Input schema
Field	Required	Notes
recipient	yes	Person's name
company	no	Organisation line
street	yes	Street name
house_number	yes	Number / house identifier
apartment	no	Unit / apartment / flat
postal_code	yes (except HK/AE)	Any format — API normalises per country
city	yes	City / town
state_region	per-country	Province, prefecture, emirate, suburb — see metadata
country	yes	ISO-2 destination code
source_country	no	ISO-2 sender code — enables UPU-correct country name
output	no	`label` (default), `html`, `oneline`
Countries that require `state_region`: US, CA, BR, MX, AU, JP, IN.
Countries where it's optional but meaningful: IE (county), ES (province), IT (province sigla), NZ (suburb), HK (district), ZA (suburb), AE (emirate).
See `GET /v1/countries/:code` for exact per-country requirements.
Output formats
`label` — newline-separated (print-ready)
`html` — `<br>`-separated (email/webpages)
`oneline` — comma-separated (single-line displays)
Country-specific highlights
Japan (romanised for international carriers):
```
Yuki Tanaka
1-1 Chiyoda
CHIYODA-KU, TOKYO 100-0001
JAPAN
```
Poland (auto-prefixes `ul.` and formats postcode `NN-NNN`):
```
Anna Kowalska
ul. Marszałkowska 100
00-001 Warszawa
```
Brazil (CEP on its own line, state after city with hyphen):
```
Ana Silva
Avenida Paulista, 1578
São Paulo - SP
01310-200
```
Canada (everything uppercase, Canada Post postcode `A1A 1A1`):
```
JANE TREMBLAY
200 QUEEN STREET
OTTAWA ON  K1A 0B1
```
Sweden (domestic `NNN NN`, international gets `SE-NNNNN` prefix):
```
Erik Andersson
Drottninggatan 1
114 51 Stockholm
```
Hungary (unique order: city above street, postcode last):
```
Nagy Péter
Budapest
Kossuth Lajos utca 10
1051
```
Singapore (apartment becomes `#NN-NN`, `SINGAPORE NNNNNN` on last line):
```
Wei Ming Tan
2 Orchard Road #12-34
SINGAPORE 238823
```
Hong Kong (no postcode, region on last line):
```
Chan Tai Man
Flat 1001, 1 Queens Road Central
Central
Hong Kong Island
```
Selling on RapidAPI
See `RAPIDAPI.md` for the deployment + listing guide (VPS-based hosting on Hostinger).
Changelog
v1.0.0 — +23 countries (LU, AT, CH, MC, GR, PL, CZ, HU, SE, DK, NO, FI, CA, BR, MX, AU, NZ, JP, SG, HK, IN, AE, IL, ZA), new `/v1/countries` metadata endpoints, postcode normalisation for most countries, production-ready release.
v0.3.0 — IT, ES, PT, IE
v0.2.0 — BE, FR, UK/GB
v0.1.0 — NL, DE, US
Attribution
Address format conventions informed by the OpenCage address-formatting project (CC-BY), Universal Postal Union guidelines, and national postal operator documentation (PostNL, Deutsche Post, Royal Mail, USPS, Canada Post, Japan Post, Australia Post, et al.).
