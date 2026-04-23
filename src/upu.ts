// UPU rule: country name on last line, in the language of the SENDING country,
// in uppercase. So a parcel from Germany to NL shows "NIEDERLANDE".

export const countryNames: Record<string, Record<string, string>> = {
  // --- EUROPE ---
  NL: { en: 'NETHERLANDS', nl: 'NEDERLAND', de: 'NIEDERLANDE', fr: 'PAYS-BAS', it: 'PAESI BASSI', es: 'PAÍSES BAJOS', pt: 'PAÍSES BAIXOS' },
  BE: { en: 'BELGIUM', nl: 'BELGIË', de: 'BELGIEN', fr: 'BELGIQUE', it: 'BELGIO', es: 'BÉLGICA', pt: 'BÉLGICA' },
  LU: { en: 'LUXEMBOURG', nl: 'LUXEMBURG', de: 'LUXEMBURG', fr: 'LUXEMBOURG', it: 'LUSSEMBURGO', es: 'LUXEMBURGO', pt: 'LUXEMBURGO' },
  DE: { en: 'GERMANY', nl: 'DUITSLAND', de: 'DEUTSCHLAND', fr: 'ALLEMAGNE', it: 'GERMANIA', es: 'ALEMANIA', pt: 'ALEMANHA' },
  AT: { en: 'AUSTRIA', nl: 'OOSTENRIJK', de: 'ÖSTERREICH', fr: 'AUTRICHE', it: 'AUSTRIA', es: 'AUSTRIA', pt: 'ÁUSTRIA' },
  CH: { en: 'SWITZERLAND', nl: 'ZWITSERLAND', de: 'SCHWEIZ', fr: 'SUISSE', it: 'SVIZZERA', es: 'SUIZA', pt: 'SUÍÇA' },
  FR: { en: 'FRANCE', nl: 'FRANKRIJK', de: 'FRANKREICH', fr: 'FRANCE', it: 'FRANCIA', es: 'FRANCIA', pt: 'FRANÇA' },
  MC: { en: 'MONACO', nl: 'MONACO', de: 'MONACO', fr: 'MONACO', it: 'MONACO', es: 'MÓNACO', pt: 'MÓNACO' },
  UK: { en: 'UNITED KINGDOM', nl: 'VERENIGD KONINKRIJK', de: 'VEREINIGTES KÖNIGREICH', fr: 'ROYAUME-UNI', it: 'REGNO UNITO', es: 'REINO UNIDO', pt: 'REINO UNIDO' },
  GB: { en: 'UNITED KINGDOM', nl: 'VERENIGD KONINKRIJK', de: 'VEREINIGTES KÖNIGREICH', fr: 'ROYAUME-UNI', it: 'REGNO UNITO', es: 'REINO UNIDO', pt: 'REINO UNIDO' },
  IE: { en: 'IRELAND', nl: 'IERLAND', de: 'IRLAND', fr: 'IRLANDE', it: 'IRLANDA', es: 'IRLANDA', pt: 'IRLANDA' },
  IT: { en: 'ITALY', nl: 'ITALIË', de: 'ITALIEN', fr: 'ITALIE', it: 'ITALIA', es: 'ITALIA', pt: 'ITÁLIA' },
  ES: { en: 'SPAIN', nl: 'SPANJE', de: 'SPANIEN', fr: 'ESPAGNE', it: 'SPAGNA', es: 'ESPAÑA', pt: 'ESPANHA' },
  PT: { en: 'PORTUGAL', nl: 'PORTUGAL', de: 'PORTUGAL', fr: 'PORTUGAL', it: 'PORTOGALLO', es: 'PORTUGAL', pt: 'PORTUGAL' },
  GR: { en: 'GREECE', nl: 'GRIEKENLAND', de: 'GRIECHENLAND', fr: 'GRÈCE', it: 'GRECIA', es: 'GRECIA', pt: 'GRÉCIA' },
  PL: { en: 'POLAND', nl: 'POLEN', de: 'POLEN', fr: 'POLOGNE', it: 'POLONIA', es: 'POLONIA', pt: 'POLÓNIA' },
  CZ: { en: 'CZECHIA', nl: 'TSJECHIË', de: 'TSCHECHIEN', fr: 'TCHÉQUIE', it: 'CECHIA', es: 'CHEQUIA', pt: 'CHÉQUIA' },
  HU: { en: 'HUNGARY', nl: 'HONGARIJE', de: 'UNGARN', fr: 'HONGRIE', it: 'UNGHERIA', es: 'HUNGRÍA', pt: 'HUNGRIA' },
  SE: { en: 'SWEDEN', nl: 'ZWEDEN', de: 'SCHWEDEN', fr: 'SUÈDE', it: 'SVEZIA', es: 'SUECIA', pt: 'SUÉCIA' },
  DK: { en: 'DENMARK', nl: 'DENEMARKEN', de: 'DÄNEMARK', fr: 'DANEMARK', it: 'DANIMARCA', es: 'DINAMARCA', pt: 'DINAMARCA' },
  NO: { en: 'NORWAY', nl: 'NOORWEGEN', de: 'NORWEGEN', fr: 'NORVÈGE', it: 'NORVEGIA', es: 'NORUEGA', pt: 'NORUEGA' },
  FI: { en: 'FINLAND', nl: 'FINLAND', de: 'FINNLAND', fr: 'FINLANDE', it: 'FINLANDIA', es: 'FINLANDIA', pt: 'FINLÂNDIA' },

  // --- AMERICAS ---
  US: { en: 'UNITED STATES', nl: 'VERENIGDE STATEN', de: 'VEREINIGTE STAATEN', fr: 'ÉTATS-UNIS', it: 'STATI UNITI', es: 'ESTADOS UNIDOS', pt: 'ESTADOS UNIDOS' },
  CA: { en: 'CANADA', nl: 'CANADA', de: 'KANADA', fr: 'CANADA', it: 'CANADA', es: 'CANADÁ', pt: 'CANADÁ' },
  BR: { en: 'BRAZIL', nl: 'BRAZILIË', de: 'BRASILIEN', fr: 'BRÉSIL', it: 'BRASILE', es: 'BRASIL', pt: 'BRASIL' },
  MX: { en: 'MEXICO', nl: 'MEXICO', de: 'MEXIKO', fr: 'MEXIQUE', it: 'MESSICO', es: 'MÉXICO', pt: 'MÉXICO' },

  // --- ASIA-PACIFIC ---
  AU: { en: 'AUSTRALIA', nl: 'AUSTRALIË', de: 'AUSTRALIEN', fr: 'AUSTRALIE', it: 'AUSTRALIA', es: 'AUSTRALIA', pt: 'AUSTRÁLIA' },
  NZ: { en: 'NEW ZEALAND', nl: 'NIEUW-ZEELAND', de: 'NEUSEELAND', fr: 'NOUVELLE-ZÉLANDE', it: 'NUOVA ZELANDA', es: 'NUEVA ZELANDA', pt: 'NOVA ZELÂNDIA' },
  JP: { en: 'JAPAN', nl: 'JAPAN', de: 'JAPAN', fr: 'JAPON', it: 'GIAPPONE', es: 'JAPÓN', pt: 'JAPÃO' },
  SG: { en: 'SINGAPORE', nl: 'SINGAPORE', de: 'SINGAPUR', fr: 'SINGAPOUR', it: 'SINGAPORE', es: 'SINGAPUR', pt: 'SINGAPURA' },
  HK: { en: 'HONG KONG', nl: 'HONGKONG', de: 'HONGKONG', fr: 'HONG KONG', it: 'HONG KONG', es: 'HONG KONG', pt: 'HONG KONG' },
  IN: { en: 'INDIA', nl: 'INDIA', de: 'INDIEN', fr: 'INDE', it: 'INDIA', es: 'INDIA', pt: 'ÍNDIA' },

  // --- MIDDLE EAST + AFRICA ---
  AE: { en: 'UNITED ARAB EMIRATES', nl: 'VERENIGDE ARABISCHE EMIRATEN', de: 'VEREINIGTE ARABISCHE EMIRATE', fr: 'ÉMIRATS ARABES UNIS', it: 'EMIRATI ARABI UNITI', es: 'EMIRATOS ÁRABES UNIDOS', pt: 'EMIRADOS ÁRABES UNIDOS' },
  IL: { en: 'ISRAEL', nl: 'ISRAËL', de: 'ISRAEL', fr: 'ISRAËL', it: 'ISRAELE', es: 'ISRAEL', pt: 'ISRAEL' },
  ZA: { en: 'SOUTH AFRICA', nl: 'ZUID-AFRIKA', de: 'SÜDAFRIKA', fr: 'AFRIQUE DU SUD', it: 'SUDAFRICA', es: 'SUDÁFRICA', pt: 'ÁFRICA DO SUL' },
};

// Primary language per country — used to pick the right translation for country names
export const countryLanguages: Record<string, string> = {
  // Dutch-speaking
  NL: 'nl', BE: 'nl',
  // German-speaking
  DE: 'de', AT: 'de', CH: 'de', LU: 'fr', LI: 'de',
  // English-speaking
  US: 'en', UK: 'en', GB: 'en', IE: 'en', CA: 'en', AU: 'en', NZ: 'en',
  SG: 'en', HK: 'en', IN: 'en', ZA: 'en', AE: 'en', IL: 'en', JP: 'en',
  // French-speaking
  FR: 'fr', MC: 'fr',
  // Other Romance
  IT: 'it', ES: 'es', PT: 'pt', BR: 'pt', MX: 'es',
  // Greek / Slavic / Finno-Ugric — fall back to English for country names
  GR: 'en', PL: 'en', CZ: 'en', HU: 'en',
  // Nordic — use English
  SE: 'en', DK: 'en', NO: 'en', FI: 'en',
};

export function getCountryName(destinationISO: string, sourceISO?: string): string {
  const sourceLang = sourceISO ? countryLanguages[sourceISO] || 'en' : 'en';
  const translations = countryNames[destinationISO];
  if (!translations) return destinationISO;
  return translations[sourceLang] || translations.en || destinationISO;
}
