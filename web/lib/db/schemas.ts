import {
  EDUCATION_DEGREE_MAX_LENGTH,
  EDUCATION_MAJOR_MAX_LENGTH,
  EDUCATION_SCHOOL_MAX_LENGTH,
} from "@/constants/education.constants";
import {
  EXPERIENCE_COMPANY_MAX_LENGTH,
  EXPERIENCE_DESCRIPTION_MAX_LENGTH,
  EXPERIENCE_TITLE_MAX_LENGTH,
} from "@/constants/experience.constants";
import {
  INFORMATION_DESCRIPTION_MAX_LENGTH,
  INFORMATION_TITLE_MAX_LENGTH,
} from "@/constants/information.constants";
import {
  DESCRIPTION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  SHORT_DESCRIPTION_MAX_LENGTH,
} from "@/constants/project.constants";

import { z } from "zod";

const linkSchema = z.object({
  label: z.string().url(),
  value: z.string().url(),
  disable: z.boolean().optional(),
});

const tagSchema = z.object({
  label: z.string().max(32),
  value: z.string().max(32),
  disable: z.boolean().optional(),
});

export const addProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH),
  teamId: z.string().min(1),
});

export type AddProjectFormData = z.infer<typeof addProjectSchema>;

export const deleteProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
});

export type DeleteProjectFormData = z.infer<typeof deleteProjectSchema>;

export const editProjectSchema = z.object({
  name: z.string().min(1).max(NAME_MAX_LENGTH),
  description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
  short_description: z.string().max(SHORT_DESCRIPTION_MAX_LENGTH).optional(),
  tags: z.array(tagSchema).optional(),
  links: z.array(linkSchema).optional(),
  images: z
    .array(z.union([z.string(), z.instanceof(File), z.null()]))
    .optional(),
  ordinal: z.preprocess((val) => {
    if (typeof val === "string") {
      return isNaN(Number(val)) ? 0 : Number(val);
    }
    return val;
  }, z.number().min(0)),
});

export type EditProjectFormData = z.infer<typeof editProjectSchema>;

export const editInformationSchema = z.object({
  title: z.string().min(1).max(INFORMATION_TITLE_MAX_LENGTH),
  description: z.string().max(INFORMATION_DESCRIPTION_MAX_LENGTH).optional(),
  socials: z.array(linkSchema).optional(),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type EditInformationFormData = z.infer<typeof editInformationSchema>;

export const editExperienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(EXPERIENCE_TITLE_MAX_LENGTH),
  description: z.string().max(EXPERIENCE_DESCRIPTION_MAX_LENGTH),
  start_date: z.date(),
  end_date: z.date().optional(),
  company: z.string().min(1).max(EXPERIENCE_COMPANY_MAX_LENGTH),
  skills: z.array(tagSchema).optional(),
  website: z.union([z.string().url(), z.string().optional()]).optional(),
});

export type EditExperienceFormData = z.infer<typeof editExperienceSchema>;

export const editExperienceArraySchema = z.object({
  experience: z.array(editExperienceSchema),
});

export type EditExperienceArrayFormData = z.infer<
  typeof editExperienceArraySchema
>;

export const editEducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1).max(EDUCATION_SCHOOL_MAX_LENGTH),
  type: z.string().optional(),
  fieldOfStudy: z.string().min(1).max(EDUCATION_MAJOR_MAX_LENGTH),
  degree: z.string().min(1).max(EDUCATION_DEGREE_MAX_LENGTH),
  start_date: z.date(),
  end_date: z.date().optional(),
});

export type EditEducationFormData = z.infer<typeof editEducationSchema>;

export const editEducationArraySchema = z.object({
  education: z.array(editEducationSchema),
});

export type EditEducationArrayFormData = z.infer<
  typeof editEducationArraySchema
>;
