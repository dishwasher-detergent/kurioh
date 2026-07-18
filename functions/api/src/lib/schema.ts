import {
  boolean,
  integer,
  jsonb,
  pgSchema,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

/**
 * Neon Auth (Managed Better Auth) manages this schema directly — mapped
 * here read-only so this public API can resolve an organization's name
 * without depending on the auth service itself.
 */
const neonAuthSchema = pgSchema('neon_auth');

export const organization = neonAuthSchema.table('organization', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const teamProfile = pgTable('team_profile', {
  id: text('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  image: text('image'),
  favicon: text('favicon'),
  socials: jsonb('socials').$type<string[]>().default([]),
  skills: jsonb('skills').$type<string[]>().default([]),
});

export const project = pgTable('project', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  description: text('description'),
  images: jsonb('images').$type<string[]>().default([]),
  tags: jsonb('tags').$type<string[]>().default([]),
  links: jsonb('links').$type<string[]>().default([]),
  slug: text('slug').notNull(),
  teamId: text('team_id').notNull(),
  userId: text('user_id').notNull(),
  ordinal: integer('ordinal').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const experience = pgTable('experience', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  company: text('company').notNull(),
  website: text('website'),
  skills: jsonb('skills').$type<string[]>().default([]),
  userId: text('user_id').notNull(),
  teamId: text('team_id').notNull(),
  type: text('type'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const education = pgTable('education', {
  id: text('id').primaryKey(),
  institution: text('institution').notNull(),
  fieldOfStudy: text('field_of_study').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  userId: text('user_id').notNull(),
  teamId: text('team_id').notNull(),
  degree: text('degree').notNull(),
  type: text('type'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
