import { z } from "zod";

const linkSchema = z.object({
  label: z.string().url(),
  value: z.string().url(),
  disable: z.boolean().optional(),
});

export const titleMaxLength = 64;
export const descriptionMaxLength = 512;
export const maxFileSize = 5000000;

function checkFileType(file: File) {
  return file.type.includes("image");
}

const informationSchema = z.object({
  title: z.string().min(1).max(titleMaxLength),
  description: z.string().max(descriptionMaxLength).optional(),
  socials: z.array(linkSchema).optional(),
  image_id: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size < maxFileSize, "Max size is 5MB.")
        .refine(
          (file) => checkFileType(file),
          "Only image formats are supported.",
        )
        .optional(),
      z.string().optional(),
    ])
    .nullable(),
});

export default informationSchema;
