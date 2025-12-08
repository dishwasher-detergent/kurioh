import { Hono } from 'hono';
import { ImageFormat, Query } from 'node-appwrite';
import {
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  database_service,
  storage_service,
} from '../lib/appwrite.js';
import { Project, Team } from '../types/types.js';

export function Projects(app: Hono, cacheDuration: number = 1440) {
  app.get('/teams/:team_id/projects', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const projects = await database_service.list<Project>(
        PROJECTS_COLLECTION_ID,
        [
          Query.equal('teamId', team_id),
          Query.orderAsc('ordinal'),
          Query.equal('published', true),
        ]
      );

      const formattedProjects = projects.documents.map((project) => ({
        id: project.$id,
        team: project.team_id,
        title: project.title,
        shortDescription: project.short_description,
        description: project.description,
        images: project.images,
        tags: project.tags,
        links: project.links,
      }));

      return c.json(formattedProjects, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch projects data.' }, 500);
    }
  });

  app.get('/teams/:team_id/projects/:project_id', async (c) => {
    try {
      const team_id = c.req.param('team_id');
      const project_id = c.req.param('project_id');

      await database_service.get<Team>(ORGANIZATION_COLLECTION_ID, team_id);

      const project = await database_service.get<Project>(
        PROJECTS_COLLECTION_ID,
        project_id
      );

      const formattedProject = {
        id: project.$id,
        team: project.team_id,
        title: project.title,
        slug: project.slug,
        shortDescription: project.short_description,
        description: project.description,
        images: project.images,
        tags: project.tags,
        links: project.links,
      };

      return c.json(formattedProject, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch project data.' }, 500);
    }
  });

  app.get(
    '/teams/:team_id/projects/:project_id/images/:image_id',
    async (c) => {
      try {
        const team_id = c.req.param('team_id');
        const project_id = c.req.param('project_id');
        const image_id = c.req.param('image_id');

        await database_service.get<Team>(ORGANIZATION_COLLECTION_ID, team_id);

        const project = await database_service.get<Project>(
          PROJECTS_COLLECTION_ID,
          project_id
        );

        const image = project.images.filter((x) => x === image_id)[0];

        if (!image) {
          return c.json({ error: 'Image not found' }, 404);
        }

        const file = await storage_service.getFileView(
          PROJECTS_BUCKET_ID,
          image
        );

        if (!file) {
          return c.json({ error: 'Failed to fetch image.' }, 500);
        }

        c.header('Content-Type', `image/${ImageFormat.Png}`);
        c.header('Cache-Control', `public, max-age=${cacheDuration}`);
        return c.body(file);
      } catch (error) {
        console.error(error);

        return c.json({ error: 'Failed to fetch image.' }, 500);
      }
    }
  );
}
