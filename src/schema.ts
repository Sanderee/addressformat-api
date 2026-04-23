import { z } from 'zod';

export const addressSchema = z.object({
  recipient: z.string().min(1, 'recipient is required'),
  company: z.string().optional(),
  street: z.string().min(1, 'street is required'),
  house_number: z.string().min(1, 'house_number is required'),
  apartment: z.string().optional(),
  postal_code: z.string().min(1, 'postal_code is required'),
  city: z.string().min(1, 'city is required'),
  state_region: z.string().optional(),
  country: z.string().length(2, 'country must be a 2-letter ISO code'),
  source_country: z.string().length(2).optional(),
  output: z.enum(['label', 'html', 'oneline']).default('label'),
});

export type AddressInput = z.infer<typeof addressSchema>;
