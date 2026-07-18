import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { db } from '../lib/db.js';
import {
  education,
  experience,
  organization,
  project,
  teamProfile,
} from '../lib/schema.js';
import { getStorageFileUrl } from '../lib/storage.js';

export function Teams(app: Hono, cacheDuration: number = 1440) {
  app.get('/teams/:team_id', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const [org] = await db
        .select()
        .from(organization)
        .where(eq(organization.id, team_id));

      if (!org) {
        return c.json({ error: 'Team not found.' }, 404);
      }

      const [teamProfileRow] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, team_id));

      const projects = await db
        .select()
        .from(project)
        .where(eq(project.teamId, team_id));

      const experiences = await db
        .select()
        .from(experience)
        .where(eq(experience.teamId, team_id));

      const educations = await db
        .select()
        .from(education)
        .where(eq(education.teamId, team_id));

      const formattedProject = projects
        .filter((p) => p.published)
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((p) => ({
          id: p.id,
          title: p.name,
          shortDescription: p.shortDescription,
          description: p.description,
          images: p.images,
          tags: p.tags,
          links: p.links,
        }));

      const formattedExperience = experiences.map((exp) => ({
        title: exp.title,
        description: exp.description,
        skills: exp.skills,
        startDate: exp.startDate,
        endDate: exp.endDate,
        company: exp.company,
        type: exp.type,
        website: exp.website,
      }));

      const formattedEducation = educations.map((edu) => ({
        institution: edu.institution,
        type: edu.type,
        fieldOfStudy: edu.fieldOfStudy,
        degree: edu.degree,
        startDate: edu.startDate,
        graduationDate: edu.endDate,
      }));

      const prunedResponse = {
        id: org.id,
        name: org.name,
        title: teamProfileRow?.title ?? '',
        description: teamProfileRow?.description ?? '',
        socials: teamProfileRow?.socials ?? [],
        image: teamProfileRow?.image ?? '',
        favicon: teamProfileRow?.favicon ?? '',
        projects: formattedProject,
        experience: formattedExperience,
        education: formattedEducation,
      };

      return c.json(prunedResponse, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch team data.' }, 500);
    }
  });

  app.get('/teams/:team_id/image', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const [teamProfileRow] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, team_id));

      if (!teamProfileRow?.image) {
        return c.json({ error: 'Image not found' }, 404);
      }

      c.header('Cache-Control', `public, max-age=${cacheDuration}`);
      return c.redirect(getStorageFileUrl(teamProfileRow.image), 302);
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch image.' }, 500);
    }
  });

  app.get('/teams/:team_id/favicon', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const [teamProfileRow] = await db
        .select()
        .from(teamProfile)
        .where(eq(teamProfile.id, team_id));

      if (!teamProfileRow?.favicon) {
        return c.json({ error: 'Favicon not found' }, 404);
      }

      c.header('Cache-Control', `public, max-age=${cacheDuration}`);
      return c.redirect(getStorageFileUrl(teamProfileRow.favicon), 302);
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch favicon.' }, 500);
    }
  });
}
