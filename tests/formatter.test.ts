import { describe, it, expect } from 'vitest';
import { formatAddress } from '../src/formatter';

describe('Netherlands (NL)', () => {
  it('formats a domestic Dutch address', () => {
    const result = formatAddress({
      recipient: 'Jan de Vries',
      street: 'Damrak',
      house_number: '70',
      postal_code: '1012LG',
      city: 'Amsterdam',
      country: 'NL',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Jan de Vries',
      'Damrak 70',
      '1012 LG  Amsterdam',
    ]);
  });

  it('formats international NL mail sent from Germany', () => {
    const result = formatAddress({
      recipient: 'Jan de Vries',
      street: 'Damrak',
      house_number: '70',
      postal_code: '1012LG',
      city: 'Amsterdam',
      country: 'NL',
      source_country: 'DE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Jan de Vries',
      'Damrak 70',
      '1012 LG  AMSTERDAM',
      'NIEDERLANDE',
    ]);
  });

  it('cleans up messy postcode input', () => {
    const result = formatAddress({
      recipient: 'Test',
      street: 'Teststraat',
      house_number: '1',
      postal_code: '1012 lg',
      city: 'Amsterdam',
      country: 'NL',
      output: 'label',
    });
    expect(result.lines[2]).toBe('1012 LG  Amsterdam');
  });

  it('includes company line when provided', () => {
    const result = formatAddress({
      recipient: 'Jan de Vries',
      company: 'Acme BV',
      street: 'Damrak',
      house_number: '70',
      postal_code: '1012LG',
      city: 'Amsterdam',
      country: 'NL',
      output: 'label',
    });
    expect(result.lines[1]).toBe('Acme BV');
  });
});

describe('Germany (DE)', () => {
  it('formats a domestic German address', () => {
    const result = formatAddress({
      recipient: 'Max Mustermann',
      street: 'Musterstraße',
      house_number: '12',
      postal_code: '10115',
      city: 'Berlin',
      country: 'DE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Max Mustermann',
      'Musterstraße 12',
      '10115 Berlin',
    ]);
  });

  it('formats international DE from NL with Dutch country name', () => {
    const result = formatAddress({
      recipient: 'Max Mustermann',
      street: 'Musterstraße',
      house_number: '12',
      postal_code: '10115',
      city: 'Berlin',
      country: 'DE',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines[3]).toBe('DUITSLAND');
    expect(result.lines[2]).toBe('10115 BERLIN');
  });
});

describe('United States (US)', () => {
  it('formats a domestic US address in uppercase', () => {
    const result = formatAddress({
      recipient: 'John Smith',
      street: 'Pennsylvania Avenue NW',
      house_number: '1600',
      postal_code: '20500',
      city: 'Washington',
      state_region: 'DC',
      country: 'US',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'JOHN SMITH',
      '1600 PENNSYLVANIA AVENUE NW',
      'WASHINGTON, DC 20500',
    ]);
  });

  it('throws when state_region missing for US', () => {
    expect(() =>
      formatAddress({
        recipient: 'John Smith',
        street: 'Main St',
        house_number: '1',
        postal_code: '10001',
        city: 'New York',
        country: 'US',
        output: 'label',
      })
    ).toThrow(/state_region is required/);
  });
});

describe('Output formats', () => {
  const base = {
    recipient: 'Jan de Vries',
    street: 'Damrak',
    house_number: '70',
    postal_code: '1012LG',
    city: 'Amsterdam',
    country: 'NL',
  };

  it('label uses newlines', () => {
    const r = formatAddress({ ...base, output: 'label' });
    expect(r.formatted).toContain('\n');
  });

  it('html uses <br> tags', () => {
    const r = formatAddress({ ...base, output: 'html' });
    expect(r.formatted).toContain('<br>');
    expect(r.formatted).not.toContain('\n');
  });

  it('oneline uses comma separators', () => {
    const r = formatAddress({ ...base, output: 'oneline' });
    expect(r.formatted).toContain(', ');
    expect(r.formatted).not.toContain('\n');
  });
});

describe('Belgium (BE)', () => {
  it('formats a domestic Belgian address', () => {
    const result = formatAddress({
      recipient: 'Pieter Janssens',
      street: 'Grote Markt',
      house_number: '1',
      postal_code: '1000',
      city: 'Brussel',
      country: 'BE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Pieter Janssens',
      'Grote Markt 1',
      '1000 Brussel',
    ]);
  });

  it('uppercases city for international BE and uses sender language', () => {
    const result = formatAddress({
      recipient: 'Pieter Janssens',
      street: 'Grote Markt',
      house_number: '1',
      postal_code: '1000',
      city: 'Brussel',
      country: 'BE',
      source_country: 'DE',
      output: 'label',
    });
    expect(result.lines[2]).toBe('1000 BRUSSEL');
    expect(result.lines[3]).toBe('BELGIEN');
  });
});

describe('France (FR)', () => {
  it('puts house number before street and uppercases city', () => {
    const result = formatAddress({
      recipient: 'Marie Dupont',
      street: 'Rue du Faubourg Saint-Honoré',
      house_number: '55',
      postal_code: '75008',
      city: 'Paris',
      country: 'FR',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Marie Dupont',
      '55 Rue du Faubourg Saint-Honoré',
      '75008 PARIS',
    ]);
  });

  it('keeps city uppercase even for international', () => {
    const result = formatAddress({
      recipient: 'Marie Dupont',
      street: 'Rue du Faubourg Saint-Honoré',
      house_number: '55',
      postal_code: '75008',
      city: 'Paris',
      country: 'FR',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines[2]).toBe('75008 PARIS');
    expect(result.lines[3]).toBe('FRANKRIJK');
  });
});

describe('United Kingdom (UK / GB)', () => {
  it('formats a UK address with postcode on own line', () => {
    const result = formatAddress({
      recipient: 'Mr James Brown',
      street: 'Downing Street',
      house_number: '10',
      postal_code: 'SW1A2AA',
      city: 'London',
      country: 'UK',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Mr James Brown',
      '10 Downing Street',
      'LONDON',
      'SW1A 2AA',
    ]);
  });

  it('accepts GB as alias for UK', () => {
    const result = formatAddress({
      recipient: 'Mr James Brown',
      street: 'Downing Street',
      house_number: '10',
      postal_code: 'SW1A2AA',
      city: 'London',
      country: 'GB',
      output: 'label',
    });
    expect(result.lines[3]).toBe('SW1A 2AA');
  });

  it('normalises messy postcode input', () => {
    const result = formatAddress({
      recipient: 'Test',
      street: 'Test St',
      house_number: '1',
      postal_code: 'm1 1ae',
      city: 'Manchester',
      country: 'UK',
      output: 'label',
    });
    expect(result.lines[3]).toBe('M1 1AE');
  });

  it('adds country line for international UK mail', () => {
    const result = formatAddress({
      recipient: 'Mr James Brown',
      street: 'Downing Street',
      house_number: '10',
      postal_code: 'SW1A2AA',
      city: 'London',
      country: 'UK',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines[4]).toBe('VERENIGD KONINKRIJK');
  });
});

describe('Italy (IT)', () => {
  it('formats a domestic Italian address with province', () => {
    const result = formatAddress({
      recipient: 'Mario Rossi',
      street: 'Via Roma',
      house_number: '12',
      postal_code: '00184',
      city: 'Roma',
      state_region: 'RM',
      country: 'IT',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Mario Rossi',
      'Via Roma, 12',
      '00184 Roma RM',
    ]);
  });

  it('drops province for international per UPU and uppercases city', () => {
    const result = formatAddress({
      recipient: 'Mario Rossi',
      street: 'Via Roma',
      house_number: '12',
      postal_code: '00184',
      city: 'Roma',
      state_region: 'RM',
      country: 'IT',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Mario Rossi',
      'Via Roma, 12',
      '00184 ROMA',
      'ITALIË',
    ]);
  });

  it('works without province for international mail', () => {
    const result = formatAddress({
      recipient: 'Mario Rossi',
      street: 'Via Roma',
      house_number: '12',
      postal_code: '00184',
      city: 'Roma',
      country: 'IT',
      output: 'label',
    });
    expect(result.lines[2]).toBe('00184 Roma');
  });
});

describe('Spain (ES)', () => {
  it('formats a domestic Spanish address with comma before number', () => {
    const result = formatAddress({
      recipient: 'Juan García',
      street: 'Calle Mayor',
      house_number: '12',
      postal_code: '28013',
      city: 'Madrid',
      country: 'ES',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Juan García',
      'Calle Mayor, 12',
      '28013 Madrid',
    ]);
  });

  it('adds province on its own line when different from city', () => {
    const result = formatAddress({
      recipient: 'Pedro López',
      street: 'Calle Sevilla',
      house_number: '5',
      postal_code: '41001',
      city: 'Sevilla',
      state_region: 'Andalucía',
      country: 'ES',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Pedro López',
      'Calle Sevilla, 5',
      '41001 Sevilla',
      'Andalucía',
    ]);
  });

  it('uses Italian country name when sent from Italy', () => {
    const result = formatAddress({
      recipient: 'Juan García',
      street: 'Calle Mayor',
      house_number: '12',
      postal_code: '28013',
      city: 'Madrid',
      country: 'ES',
      source_country: 'IT',
      output: 'label',
    });
    expect(result.lines[2]).toBe('28013 MADRID');
    expect(result.lines[3]).toBe('SPAGNA');
  });
});

describe('Portugal (PT)', () => {
  it('normalises postal code to NNNN-NNN format', () => {
    const result = formatAddress({
      recipient: 'João Silva',
      street: 'Rua Augusta',
      house_number: '100',
      postal_code: '1100053',
      city: 'Lisboa',
      country: 'PT',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'João Silva',
      'Rua Augusta, 100',
      '1100-053 Lisboa',
    ]);
  });

  it('accepts already-formatted postal code', () => {
    const result = formatAddress({
      recipient: 'Test',
      street: 'Rua Test',
      house_number: '1',
      postal_code: '1100-053',
      city: 'Lisboa',
      country: 'PT',
      output: 'label',
    });
    expect(result.lines[2]).toBe('1100-053 Lisboa');
  });

  it('uppercases city for international Portuguese mail', () => {
    const result = formatAddress({
      recipient: 'João Silva',
      street: 'Rua Augusta',
      house_number: '100',
      postal_code: '1100053',
      city: 'Lisboa',
      country: 'PT',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines[2]).toBe('1100-053 LISBOA');
    expect(result.lines[3]).toBe('PORTUGAL');
  });
});

describe('Ireland (IE)', () => {
  it('formats with Eircode normalised on its own line', () => {
    const result = formatAddress({
      recipient: 'John Murphy',
      street: 'Main Street',
      house_number: '123',
      postal_code: 'd02x285',
      city: 'Dublin 2',
      country: 'IE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'John Murphy',
      '123 Main Street',
      'Dublin 2',
      'D02 X285',
    ]);
  });

  it('includes county when provided', () => {
    const result = formatAddress({
      recipient: 'Mary Walsh',
      street: 'Patrick Street',
      house_number: '42',
      postal_code: 'T12 ABCD',
      city: 'Cork',
      state_region: 'Co. Cork',
      country: 'IE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Mary Walsh',
      '42 Patrick Street',
      'Cork',
      'Co. Cork',
      'T12 ABCD',
    ]);
  });

  it('adds country line for international Irish mail', () => {
    const result = formatAddress({
      recipient: 'John Murphy',
      street: 'Main Street',
      house_number: '123',
      postal_code: 'D02X285',
      city: 'Dublin 2',
      country: 'IE',
      source_country: 'DE',
      output: 'label',
    });
    expect(result.lines[result.lines.length - 1]).toBe('IRLAND');
  });
});

describe('Error handling', () => {
  it('throws for unsupported country', () => {
    expect(() =>
      formatAddress({
        recipient: 'X',
        street: 'Y',
        house_number: '1',
        postal_code: '00000',
        city: 'Z',
        country: 'XX',
        output: 'label',
      })
    ).toThrow(/not supported/);
  });
});

// ============================================================
// NEW COUNTRIES (v1.0.0)
// ============================================================

describe('Austria (AT)', () => {
  it('formats a domestic Austrian address', () => {
    const result = formatAddress({
      recipient: 'Anna Huber',
      street: 'Stephansplatz',
      house_number: '3',
      postal_code: '1010',
      city: 'Wien',
      country: 'AT',
      output: 'label',
    });
    expect(result.lines).toEqual(['Anna Huber', 'Stephansplatz 3', '1010 Wien']);
  });
});

describe('Switzerland (CH)', () => {
  it('formats a domestic Swiss address', () => {
    const result = formatAddress({
      recipient: 'Lukas Meier',
      street: 'Bahnhofstrasse',
      house_number: '42',
      postal_code: '8001',
      city: 'Zürich',
      country: 'CH',
      output: 'label',
    });
    expect(result.lines).toEqual(['Lukas Meier', 'Bahnhofstrasse 42', '8001 Zürich']);
  });
});

describe('Luxembourg (LU)', () => {
  it('formats with L- prefix', () => {
    const result = formatAddress({
      recipient: 'Pierre Weber',
      street: 'Avenue de la Liberté',
      house_number: '19',
      postal_code: '1931',
      city: 'Luxembourg',
      country: 'LU',
      output: 'label',
    });
    expect(result.lines).toEqual(['Pierre Weber', 'Avenue de la Liberté 19', 'L-1931 Luxembourg']);
  });
});

describe('Poland (PL)', () => {
  it('adds ul. prefix and formats postcode NN-NNN', () => {
    const result = formatAddress({
      recipient: 'Anna Kowalska',
      street: 'Marszałkowska',
      house_number: '100',
      postal_code: '00001',
      city: 'Warszawa',
      country: 'PL',
      output: 'label',
    });
    expect(result.lines).toEqual(['Anna Kowalska', 'ul. Marszałkowska 100', '00-001 Warszawa']);
  });

  it('does not double-prefix if ul. already present', () => {
    const result = formatAddress({
      recipient: 'Anna Kowalska',
      street: 'ul. Marszałkowska',
      house_number: '100',
      postal_code: '00-001',
      city: 'Warszawa',
      country: 'PL',
      output: 'label',
    });
    expect(result.lines[1]).toBe('ul. Marszałkowska 100');
  });
});

describe('Czechia (CZ)', () => {
  it('formats postcode "NNN NN"', () => {
    const result = formatAddress({
      recipient: 'Jan Novák',
      street: 'Václavské náměstí',
      house_number: '1',
      postal_code: '11000',
      city: 'Praha',
      country: 'CZ',
      output: 'label',
    });
    expect(result.lines).toEqual(['Jan Novák', 'Václavské náměstí 1', '110 00 Praha']);
  });
});

describe('Hungary (HU)', () => {
  it('puts city above street, postcode last', () => {
    const result = formatAddress({
      recipient: 'Nagy Péter',
      street: 'Kossuth Lajos utca',
      house_number: '10',
      postal_code: '1051',
      city: 'Budapest',
      country: 'HU',
      output: 'label',
    });
    expect(result.lines).toEqual(['Nagy Péter', 'Budapest', 'Kossuth Lajos utca 10', '1051']);
  });
});

describe('Sweden (SE)', () => {
  it('domestic: "NNN NN City"', () => {
    const result = formatAddress({
      recipient: 'Erik Andersson',
      street: 'Drottninggatan',
      house_number: '1',
      postal_code: '11451',
      city: 'Stockholm',
      country: 'SE',
      output: 'label',
    });
    expect(result.lines).toEqual(['Erik Andersson', 'Drottninggatan 1', '114 51 Stockholm']);
  });

  it('international: "SE-NNNNN CITY" + country', () => {
    const result = formatAddress({
      recipient: 'Erik Andersson',
      street: 'Drottninggatan',
      house_number: '1',
      postal_code: '11451',
      city: 'Stockholm',
      country: 'SE',
      source_country: 'NL',
      output: 'label',
    });
    expect(result.lines).toEqual(['Erik Andersson', 'Drottninggatan 1', 'SE-11451 STOCKHOLM', 'ZWEDEN']);
  });
});

describe('Denmark (DK)', () => {
  it('international uses DK- prefix', () => {
    const result = formatAddress({
      recipient: 'Anders Jensen',
      street: 'Strøget',
      house_number: '12',
      postal_code: '1050',
      city: 'København',
      country: 'DK',
      source_country: 'DE',
      output: 'label',
    });
    expect(result.lines[2]).toBe('DK-1050 KØBENHAVN');
    expect(result.lines[3]).toBe('DÄNEMARK');
  });
});

describe('Norway (NO)', () => {
  it('international uses NO- prefix', () => {
    const result = formatAddress({
      recipient: 'Ola Nordmann',
      street: 'Karl Johans gate',
      house_number: '1',
      postal_code: '0154',
      city: 'Oslo',
      country: 'NO',
      source_country: 'UK',
      output: 'label',
    });
    expect(result.lines[2]).toBe('NO-0154 OSLO');
    expect(result.lines[3]).toBe('NORWAY');
  });
});

describe('Finland (FI)', () => {
  it('international uses FI- prefix', () => {
    const result = formatAddress({
      recipient: 'Matti Virtanen',
      street: 'Mannerheimintie',
      house_number: '1',
      postal_code: '00100',
      city: 'Helsinki',
      country: 'FI',
      source_country: 'DE',
      output: 'label',
    });
    expect(result.lines[2]).toBe('FI-00100 HELSINKI');
    expect(result.lines[3]).toBe('FINNLAND');
  });
});

describe('Canada (CA)', () => {
  it('formats postcode and requires province', () => {
    const result = formatAddress({
      recipient: 'Jane Tremblay',
      street: 'Queen Street',
      house_number: '200',
      postal_code: 'K1A0B1',
      city: 'Ottawa',
      state_region: 'ON',
      country: 'CA',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'JANE TREMBLAY',
      '200 QUEEN STREET',
      'OTTAWA ON  K1A 0B1',
    ]);
  });

  it('throws without province', () => {
    expect(() =>
      formatAddress({
        recipient: 'X',
        street: 'Y',
        house_number: '1',
        postal_code: 'K1A0B1',
        city: 'Ottawa',
        country: 'CA',
        output: 'label',
      })
    ).toThrow(/state_region is required/);
  });
});

describe('Brazil (BR)', () => {
  it('formats with city - state and CEP', () => {
    const result = formatAddress({
      recipient: 'Ana Silva',
      street: 'Avenida Paulista',
      house_number: '1578',
      postal_code: '01310200',
      city: 'São Paulo',
      state_region: 'SP',
      country: 'BR',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Ana Silva',
      'Avenida Paulista, 1578',
      'São Paulo - SP',
      '01310-200',
    ]);
  });
});

describe('Mexico (MX)', () => {
  it('formats CP city, state', () => {
    const result = formatAddress({
      recipient: 'Carlos Hernández',
      street: 'Avenida Reforma',
      house_number: '222',
      postal_code: '06600',
      city: 'Ciudad de México',
      state_region: 'CDMX',
      country: 'MX',
      output: 'label',
    });
    expect(result.lines[2]).toBe('06600 Ciudad de México, CDMX');
  });
});

describe('Australia (AU)', () => {
  it('formats CITY STATE POSTCODE', () => {
    const result = formatAddress({
      recipient: 'Emma Wilson',
      street: 'George Street',
      house_number: '200',
      postal_code: '2000',
      city: 'Sydney',
      state_region: 'NSW',
      country: 'AU',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Emma Wilson',
      '200 George Street',
      'SYDNEY NSW 2000',
    ]);
  });
});

describe('New Zealand (NZ)', () => {
  it('formats suburb + city postcode', () => {
    const result = formatAddress({
      recipient: 'Oliver Thompson',
      street: 'Lambton Quay',
      house_number: '100',
      postal_code: '6011',
      city: 'Wellington',
      state_region: 'Pipitea',
      country: 'NZ',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Oliver Thompson',
      '100 Lambton Quay',
      'Pipitea',
      'Wellington 6011',
    ]);
  });
});

describe('Japan (JP)', () => {
  it('formats romanised with prefecture + postcode', () => {
    const result = formatAddress({
      recipient: 'Yuki Tanaka',
      street: 'Chiyoda',
      house_number: '1-1',
      postal_code: '1000001',
      city: 'Chiyoda-ku',
      state_region: 'Tokyo',
      country: 'JP',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Yuki Tanaka',
      '1-1 Chiyoda',
      'Chiyoda-ku, Tokyo 100-0001',
    ]);
  });

  it('normalises postcode with hyphen already present', () => {
    const result = formatAddress({
      recipient: 'Yuki Tanaka',
      street: 'Chiyoda',
      house_number: '1-1',
      postal_code: '100-0001',
      city: 'Chiyoda-ku',
      state_region: 'Tokyo',
      country: 'JP',
      output: 'label',
    });
    expect(result.lines[2]).toContain('100-0001');
  });
});

describe('Singapore (SG)', () => {
  it('formats SINGAPORE + 6-digit postcode', () => {
    const result = formatAddress({
      recipient: 'Wei Ming Tan',
      street: 'Orchard Road',
      house_number: '2',
      apartment: '12-34',
      postal_code: '238823',
      city: 'Singapore',
      country: 'SG',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Wei Ming Tan',
      '2 Orchard Road #12-34',
      'SINGAPORE 238823',
    ]);
  });
});

describe('Hong Kong (HK)', () => {
  it('formats without postcode in output', () => {
    const result = formatAddress({
      recipient: 'Chan Tai Man',
      street: 'Queens Road Central',
      house_number: '1',
      apartment: '1001',
      postal_code: '000000',
      city: 'Hong Kong Island',
      state_region: 'Central',
      country: 'HK',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Chan Tai Man',
      'Flat 1001, 1 Queens Road Central',
      'Central',
      'Hong Kong Island',
    ]);
  });
});

describe('India (IN)', () => {
  it('formats city - PIN on its own line + state', () => {
    const result = formatAddress({
      recipient: 'Priya Sharma',
      street: 'Connaught Place',
      house_number: '15',
      postal_code: '110001',
      city: 'New Delhi',
      state_region: 'Delhi',
      country: 'IN',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Priya Sharma',
      '15 Connaught Place',
      'New Delhi - 110001',
      'Delhi',
    ]);
  });
});

describe('Israel (IL)', () => {
  it('formats city + 7-digit postcode on last line', () => {
    const result = formatAddress({
      recipient: 'David Cohen',
      street: 'Dizengoff',
      house_number: '50',
      postal_code: '6433222',
      city: 'Tel Aviv',
      country: 'IL',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'David Cohen',
      'Dizengoff 50',
      'Tel Aviv 6433222',
    ]);
  });
});

describe('South Africa (ZA)', () => {
  it('formats with suburb + 4-digit postcode last', () => {
    const result = formatAddress({
      recipient: 'Thandi Nkosi',
      street: 'Long Street',
      house_number: '100',
      postal_code: '8001',
      city: 'Cape Town',
      state_region: 'City Bowl',
      country: 'ZA',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Thandi Nkosi',
      '100 Long Street',
      'City Bowl',
      'Cape Town',
      '8001',
    ]);
  });
});

describe('Greece (GR)', () => {
  it('formats postcode "NNN NN"', () => {
    const result = formatAddress({
      recipient: 'Nikos Papadopoulos',
      street: 'Ermou',
      house_number: '12',
      postal_code: '10431',
      city: 'Athens',
      country: 'GR',
      output: 'label',
    });
    expect(result.lines).toEqual(['Nikos Papadopoulos', 'Ermou 12', '104 31 Athens']);
  });
});

describe('UAE (AE)', () => {
  it('formats with emirate on last line', () => {
    const result = formatAddress({
      recipient: 'Ahmed Al Maktoum',
      street: 'Sheikh Zayed Road',
      house_number: '1',
      postal_code: '00000',
      city: 'Dubai',
      state_region: 'Dubai',
      country: 'AE',
      output: 'label',
    });
    expect(result.lines).toEqual([
      'Ahmed Al Maktoum',
      '1 Sheikh Zayed Road',
      'Dubai',
      'Dubai',
    ]);
  });
});
