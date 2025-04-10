import {
  INFORMATION_DESCRIPTION_MAX_LENGTH,
  INFORMATION_TITLE_MAX_LENGTH,
} from "@/constants/information.constants";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
} from "@/constants/project.constants";

import { z } from "zod";

export const addProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
  teamId: z.string().min(1),
});

export type AddProjectFormData = z.infer<typeof addProjectSchema>;

export const deleteProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
});

export type DeleteProjectFormData = z.infer<typeof deleteProjectSchema>;

export const editProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditProjectFormData = z.infer<typeof editProjectSchema>;

const linkSchema = z.object({
  label: z.string().url(),
  value: z.string().url(),
  disable: z.boolean().optional(),
});

export const editInformationSchema = z.object({
  title: z.string().min(1).max(INFORMATION_TITLE_MAX_LENGTH),
  description: z.string().max(INFORMATION_DESCRIPTION_MAX_LENGTH).optional(),
  socials: z.array(linkSchema).optional(),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditInformationFormData = z.infer<typeof editInformationSchema>;
