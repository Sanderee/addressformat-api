import { AddressInput } from './schema';
import { formatters } from './templates';
import { getCountryName } from './upu';

export interface FormatResult {
  formatted: string;
  lines: string[];
  warnings: string[];
}

export function formatAddress(input: AddressInput): FormatResult {
  const warnings: string[] = [];
  const destCountry = input.country.toUpperCase();
  const sourceCountry = input.source_country?.toUpperCase();
  const isInternational = Boolean(sourceCountry && sourceCountry !== destCountry);

  const formatter = formatters[destCountry];
  if (!formatter) {
    throw new Error(`Country "${destCountry}" is not supported yet`);
  }

  const countryName = getCountryName(destCountry, sourceCountry);
  const lines = formatter(input, countryName, isInternational);

  // Helpful non-blocking warnings
  if (isInternational && !sourceCountry) {
    warnings.push('source_country not provided — country name defaulting to English');
  }

  let formatted: string;
  switch (input.output) {
    case 'html':
      formatted = lines.join('<br>');
      break;
    case 'oneline':
      formatted = lines.join(', ');
      break;
    case 'label':
    default:
      formatted = lines.join('\n');
      break;
  }

  return { formatted, lines, warnings };
}
