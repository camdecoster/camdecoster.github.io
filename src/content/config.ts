import { defineCollection, z } from "astro:content";
import { AUTHOR } from "../consts";

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: ({ image }) => z.object({
    author: z.string().default(AUTHOR).optional(),
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: image().optional(),
    tags: z.array(z.string()).default([]).optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog };
