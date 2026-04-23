import { AddressInput } from './schema';

// A formatter takes the address, the country name (already translated for UPU),
// and whether it's international mail — returns the label as an array of lines.
export type Formatter = (
  input: AddressInput,
  countryName: string,
  isInternational: boolean
) => string[];

// ---------- Postcode formatters ----------

// NL: "1012LG" or "1012 lg" -> "1012 LG"
function nlPostcode(pc: string): string {
  const clean = pc.replace(/\s/g, '').toUpperCase();
  if (/^\d{4}[A-Z]{2}$/.test(clean)) return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  return clean;
}

// UK: "SW1A2AA" -> "SW1A 2AA"  (inward code is always the last 3 chars)
function ukPostcode(pc: string): string {
  const clean = pc.replace(/\s/g, '').toUpperCase();
  if (/^[A-Z0-9]{5,7}$/.test(clean)) {
    return `${clean.slice(0, -3)} ${clean.slice(-3)}`;
  }
  return clean;
}

// PT: "1100053" -> "1100-053"
function ptPostcode(pc: string): string {
  const clean = pc.replace(/[\s-]/g, '');
  if (/^\d{7}$/.test(clean)) return `${clean.slice(0, 4)}-${clean.slice(4)}`;
  return clean;
}

// IE Eircode: "D02X285" -> "D02 X285"
function ieEircode(pc: string): string {
  const clean = pc.replace(/\s/g, '').toUpperCase();
  if (/^[A-Z0-9]{7}$/.test(clean)) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return clean;
}

// PL: "00123" -> "00-123"
function plPostcode(pc: string): string {
  const clean = pc.replace(/[\s-]/g, '');
  if (/^\d{5}$/.test(clean)) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  return clean;
}

// CA: "K1A0B1" -> "K1A 0B1"
function caPostcode(pc: string): string {
  const clean = pc.replace(/\s/g, '').toUpperCase();
  if (/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(clean)) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return clean;
}

// CZ: "12000" -> "120 00"
function czPostcode(pc: string): string {
  const clean = pc.replace(/\s/g, '');
  if (/^\d{5}$/.test(clean)) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return clean;
}

// BR CEP: "01310100" -> "01310-100"
function brCep(pc: string): string {
  const clean = pc.replace(/[\s-]/g, '');
  if (/^\d{8}$/.test(clean)) return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  return clean;
}

// JP: "1000001" -> "100-0001"
function jpPostcode(pc: string): string {
  const clean = pc.replace(/[\s〒-]/g, '');
  if (/^\d{7}$/.test(clean)) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  return clean;
}

// ---------- Formatters ----------

export const formatters: Record<string, Formatter> = {
  // ============================================================
  // EUROPE
  // ============================================================

  // NETHERLANDS — PostNL convention: DOUBLE space between postcode and city
  NL: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `-${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${nlPostcode(a.postal_code)}  ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // BELGIUM — 4-digit postcode, single space
  BE: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += ` ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // LUXEMBOURG — "L-1234 City" convention
  LU: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const pc = a.postal_code.replace(/[\sL-]/gi, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`L-${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // GERMANY
  DE: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // AUSTRIA — same structure as Germany, 4-digit postcode
  AT: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // SWITZERLAND — 4-digit postcode, Germanic structure
  CH: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // FRANCE — house number BEFORE street, city ALWAYS uppercase
  FR: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${a.city.toUpperCase()}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // MONACO — same convention as France
  MC: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    lines.push(`${a.postal_code.replace(/\s/g, '')} ${a.city.toUpperCase()}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // UNITED KINGDOM — Royal Mail: town uppercase, postcode on own line
  UK: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}, ${street}`;
    lines.push(street);
    lines.push(a.city.toUpperCase());
    lines.push(ukPostcode(a.postal_code));
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // IRELAND — Eircode on its own line above country
  IE: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}, ${street}`;
    lines.push(street);
    lines.push(a.city);
    if (a.state_region) lines.push(a.state_region);
    lines.push(ieEircode(a.postal_code));
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // ITALY — "Via X, 12" / postcode + city + province sigla (drop province for intl)
  IT: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street}, ${a.house_number}`;
    if (a.apartment) street += ` int. ${a.apartment}`;
    lines.push(street);
    const pc = a.postal_code.replace(/\s/g, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    let cityLine = `${pc} ${city}`;
    if (a.state_region && !isIntl) cityLine += ` ${a.state_region.toUpperCase()}`;
    lines.push(cityLine);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // SPAIN — "Calle X, 5" / postcode + city / optional province on own line
  ES: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street}, ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const pc = a.postal_code.replace(/\s/g, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}`);
    if (a.state_region && a.state_region.toLowerCase() !== a.city.toLowerCase()) {
      lines.push(isIntl ? a.state_region.toUpperCase() : a.state_region);
    }
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // PORTUGAL — postcode NNNN-NNN + city
  PT: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street}, ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${ptPostcode(a.postal_code)} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // GREECE — 5-digit postcode in "NNN NN" form
  GR: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const clean = a.postal_code.replace(/\s/g, '');
    const pc = /^\d{5}$/.test(clean) ? `${clean.slice(0, 3)} ${clean.slice(3)}` : clean;
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // POLAND — postcode "NN-NNN" before city; street auto-prefix "ul." if missing
  PL: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    const streetPrefix = /^(ul\.?|al\.?|pl\.?)/i.test(a.street) ? '' : 'ul. ';
    let street = `${streetPrefix}${a.street} ${a.house_number}`;
    if (a.apartment) street += `/${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${plPostcode(a.postal_code)} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // CZECHIA — postcode "NNN NN" before city
  CZ: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `/${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${czPostcode(a.postal_code)} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // HUNGARY — unique order: city, then street+number, then 4-digit postcode last
  HU: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(city);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    lines.push(a.postal_code.replace(/\s/g, ''));
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // SWEDEN — domestic "NNN NN City", intl uses "SE-NNNNN CITY"
  SE: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const clean = a.postal_code.replace(/[\sSE-]/gi, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    const pc = isIntl
      ? `SE-${clean}`
      : (/^\d{5}$/.test(clean) ? `${clean.slice(0, 3)} ${clean.slice(3)}` : clean);
    lines.push(`${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // DENMARK — 4-digit postcode; "DK-" prefix for intl
  DK: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const clean = a.postal_code.replace(/[\sDK-]/gi, '');
    const pc = isIntl ? `DK-${clean}` : clean;
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // NORWAY — 4-digit postcode
  NO: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const clean = a.postal_code.replace(/[\sNO-]/gi, '');
    const pc = isIntl ? `NO-${clean}` : clean;
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // FINLAND — "FI-" prefix for intl
  FI: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += ` ${a.apartment}`;
    lines.push(street);
    const clean = a.postal_code.replace(/[\sFI-]/gi, '');
    const pc = isIntl ? `FI-${clean}` : clean;
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // ============================================================
  // AMERICAS
  // ============================================================

  // USA — USPS: everything uppercase, city, STATE ZIP
  US: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for US addresses (e.g. "CA", "NY")');
    }
    const lines: string[] = [a.recipient.toUpperCase()];
    if (a.company) lines.push(a.company.toUpperCase());
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += ` APT ${a.apartment}`;
    lines.push(street.toUpperCase());
    const zip = a.postal_code.replace(/\s/g, '');
    lines.push(`${a.city.toUpperCase()}, ${a.state_region.toUpperCase()} ${zip}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // CANADA — Canada Post: like US but postcode "K1A 0B1" and province required
  CA: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Canadian addresses (e.g. "ON", "QC")');
    }
    const lines: string[] = [a.recipient.toUpperCase()];
    if (a.company) lines.push(a.company.toUpperCase());
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}-${street}`;
    lines.push(street.toUpperCase());
    lines.push(`${a.city.toUpperCase()} ${a.state_region.toUpperCase()}  ${caPostcode(a.postal_code)}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // BRAZIL — Correios: street+number / city - state / CEP
  BR: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Brazilian addresses (e.g. "SP", "RJ")');
    }
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street}, ${a.house_number}`;
    if (a.apartment) street += ` - ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${city} - ${a.state_region.toUpperCase()}`);
    lines.push(brCep(a.postal_code));
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // MEXICO — Correos de México: CP + city, state
  MX: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Mexican addresses (e.g. "CDMX", "JAL")');
    }
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += ` Int. ${a.apartment}`;
    lines.push(street);
    const pc = a.postal_code.replace(/\s/g, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${pc} ${city}, ${isIntl ? a.state_region.toUpperCase() : a.state_region}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // ============================================================
  // ASIA-PACIFIC
  // ============================================================

  // AUSTRALIA — Australia Post: CITY STATE POSTCODE
  AU: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Australian addresses (e.g. "NSW", "VIC")');
    }
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}/${street}`;
    lines.push(street);
    const pc = a.postal_code.replace(/\s/g, '');
    lines.push(`${a.city.toUpperCase()} ${a.state_region.toUpperCase()} ${pc}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // NEW ZEALAND — NZ Post: city + 4-digit postcode on last address line
  NZ: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}/${street}`;
    lines.push(street);
    if (a.state_region) lines.push(a.state_region); // suburb
    const pc = a.postal_code.replace(/\s/g, '');
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${city} ${pc}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // JAPAN — romanised intl format (prefecture in state_region, city + postcode)
  JP: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Japanese addresses (prefecture, e.g. "Tokyo")');
    }
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    const pref = isIntl ? a.state_region.toUpperCase() : a.state_region;
    lines.push(`${city}, ${pref} ${jpPostcode(a.postal_code)}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // SINGAPORE — 6-digit postcode, "SINGAPORE NNNNNN" on last line
  SG: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += ` #${a.apartment}`;
    lines.push(street);
    lines.push(`SINGAPORE ${a.postal_code.replace(/\s/g, '')}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // HONG KONG — no postcode; district + city/region on last lines
  HK: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `Flat ${a.apartment}, ${street}`;
    lines.push(street);
    if (a.state_region) lines.push(a.state_region); // district
    lines.push(a.city); // Kowloon / Hong Kong Island / New Territories
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // INDIA — India Post: street / city - PIN / state
  IN: (a, countryName, isIntl) => {
    if (!a.state_region) {
      throw new Error('state_region is required for Indian addresses (e.g. "Maharashtra", "Delhi")');
    }
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment}, ${street}`;
    lines.push(street);
    lines.push(`${a.city} - ${a.postal_code.replace(/\s/g, '')}`);
    lines.push(isIntl ? a.state_region.toUpperCase() : a.state_region);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // ============================================================
  // MIDDLE EAST + AFRICA
  // ============================================================

  // UAE — no standard postcode; emirate in state_region
  AE: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street += `, ${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(city);
    if (a.state_region) lines.push(isIntl ? a.state_region.toUpperCase() : a.state_region);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // ISRAEL — 7-digit postal code + city on last line
  IL: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.street} ${a.house_number}`;
    if (a.apartment) street += `/${a.apartment}`;
    lines.push(street);
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(`${city} ${a.postal_code.replace(/[\s-]/g, '')}`);
    if (isIntl) lines.push(countryName);
    return lines;
  },

  // SOUTH AFRICA — SAPO: street / suburb / city / 4-digit postcode
  ZA: (a, countryName, isIntl) => {
    const lines: string[] = [a.recipient];
    if (a.company) lines.push(a.company);
    let street = `${a.house_number} ${a.street}`;
    if (a.apartment) street = `${a.apartment} ${street}`;
    lines.push(street);
    if (a.state_region) lines.push(a.state_region); // suburb
    const city = isIntl ? a.city.toUpperCase() : a.city;
    lines.push(city);
    lines.push(a.postal_code.replace(/\s/g, ''));
    if (isIntl) lines.push(countryName);
    return lines;
  },
};

// GB is the official ISO-3166 code but "UK" is what most users type. Alias them.
formatters.GB = formatters.UK;

export function getSupportedCountries(): string[] {
  return Object.keys(formatters).sort();
}
