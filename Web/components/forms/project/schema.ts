import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).max(64),
  description: z.string().max(1024).optional(),
  short_description: z.string().max(128).optional(),
  tags: z.array(z.string().max(32)).optional(),
  links: z.array(z.string().url()).optional(),
  images_ids: z.array(z.string()).optional(),
});

export default projectSchema;
