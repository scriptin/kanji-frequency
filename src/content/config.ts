import { z, defineCollection } from 'astro:content';

const cardSchema = z.object({
  title: z.string(),
  order: z.number().int().positive(),
  url: z.string(),
  csvPrefix: z.string().optional(),
});

export type Card = z.infer<typeof cardSchema>;

export const collections = {
  cards: defineCollection({
    schema: cardSchema,
  }),
};
