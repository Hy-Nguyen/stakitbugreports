import { z } from 'zod';

export const BugSchema = z.object({
  title: z.string().max(255).min(1, 'Title is required'),
  author: z.string().max(255).min(1, 'Author is required'),
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string()).default([]),
  category: z.string().max(50).min(1, 'Category is required'),
  status: z.string().max(20).min(1, 'Status is required').default('open'),
});
