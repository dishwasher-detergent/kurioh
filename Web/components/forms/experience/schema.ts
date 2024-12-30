import { z } from "zod";

const skillSchema = z.object({
  label: z.string().max(32),
  value: z.string().max(32),
  disable: z.boolean().optional(),
});

export const titleMaxLength = 64;
export const descriptionMaxLength = 512;
export const companyMaxLength = 128;

export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(titleMaxLength),
  description: z.string().max(descriptionMaxLength),
  start_date: z.date(),
  end_date: z.date().optional(),
  company: z.string().min(1).max(companyMaxLength),
  skills: z.array(skillSchema).optional(),
  website: z.union([z.string().url(), z.string().optional()]),
});

const experienceArraySchema = z.object({
  experience: z.array(experienceSchema),
});

export default experienceArraySchema;
