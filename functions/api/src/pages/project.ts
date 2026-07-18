import { and, eq } from 'drizzle-orm';
import { Context, Hono } from 'hono';

import { db } from '../lib/db.js';
import { organization, project } from '../lib/schema.js';
import { getStorageFileUrl } from '../lib/storage.js';
import { NotFoundError } from '../lib/utils.js';

function handleError(c: Context, error: unknown, fallbackMessage: string) {
  if (error instanceof NotFoundError) {
    return c.json({ error: error.message }, 404);
  }

  console.error(error);
  return c.json({ error: fallbackMessage }, 500);
}

export function Projects(app: Hono, cacheDuration: number = 1440) {
  app.get('/teams/:team_id/projects', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const projects = await db
        .select()
        .from(project)
        .where(and(eq(project.teamId, team_id), eq(project.published, true)));

      const formattedProjects = projects
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((p) => ({
          id: p.id,
          team: p.teamId,
          title: p.name,
          shortDescription: p.shortDescription,
          description: p.description,
          images: p.images,
          tags: p.tags,
          links: p.links,
        }));

      return c.json(formattedProjects, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      return handleError(c, error, 'Failed to fetch projects data.');
    }
  });

  app.get('/teams/:team_id/projects/:project_id', async (c) => {
    try {
      const team_id = c.req.param('team_id');
      const project_id = c.req.param('project_id');

      const [org] = await db
        .select()
        .from(organization)
        .where(eq(organization.id, team_id));

      if (!org) {
        throw new NotFoundError('Team not found');
      }

      const [p] = await db
        .select()
        .from(project)
        .where(eq(project.id, project_id));

      if (!p) {
        throw new NotFoundError('Project not found');
      }

      const formattedProject = {
        id: p.id,
        team: p.teamId,
        title: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        description: p.description,
        images: p.images,
        tags: p.tags,
        links: p.links,
      };

      return c.json(formattedProject, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      return handleError(c, error, 'Failed to fetch project data.');
    }
  });

  app.get(
    '/teams/:team_id/projects/:project_id/images/:image_id',
    async (c) => {
      try {
        const team_id = c.req.param('team_id');
        const project_id = c.req.param('project_id');
        const image_id = c.req.param('image_id');

        const [org] = await db
          .select()
          .from(organization)
          .where(eq(organization.id, team_id));

        if (!org) {
          throw new NotFoundError('Team not found');
        }

        const [p] = await db
          .select()
          .from(project)
          .where(eq(project.id, project_id));

        if (!p) {
          throw new NotFoundError('Project not found');
        }

        const image = (p.images ?? []).find((x) => x === image_id);

        if (!image) {
          return c.json({ error: 'Image not found' }, 404);
        }

        c.header('Cache-Control', `public, max-age=${cacheDuration}`);
        return c.redirect(getStorageFileUrl(image), 302);
      } catch (error) {
        return handleError(c, error, 'Failed to fetch image.');
      }
    }
  );
}
