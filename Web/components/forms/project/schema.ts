import { z } from "zod";

const tagSchema = z.object({
  label: z.string().max(32),
  value: z.string().max(32),
  disable: z.boolean().optional(),
});

const linkSchema = z.object({
  label: z.string().url(),
  value: z.string().url(),
  disable: z.boolean().optional(),
});

export const titleMaxLength = 64;
export const descriptionMaxLength = 1024;
export const shortDescriptionMaxLength = 128;
export const maxFileSize = 5000000;

function checkFileType(file: File) {
  return file.type.includes("image");
}

const projectSchema = z.object({
  title: z.string().min(1).max(titleMaxLength),
  description: z.string().max(descriptionMaxLength).optional(),
  short_description: z.string().max(shortDescriptionMaxLength).optional(),
  tags: z.array(tagSchema).optional(),
  links: z.array(linkSchema).optional(),
  image_ids: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine((file) => file.size < maxFileSize, "Max size is 5MB.")
          .refine(
            (file) => checkFileType(file),
            "Only image formats are supported.",
          ),
        z.string(),
      ]),
    )
    .optional(),
});

export default projectSchema;
