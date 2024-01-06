import { Hono } from 'hono';
import {
  PORTFOLIO_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  database_service,
  storage_service,
} from '../lib/appwrite.js';
import { Portfolios } from '../types/types.js';

export function Projects(app: Hono, cacheDuration: number = 1440) {
  app.get('/portfolios/:portfolio_slug/projects/:project_slug', async (c) => {
    const portfolio_slug = c.req.param('portfolio_slug');
    const project_slug = c.req.param('project_slug');

    const response = await database_service.get<Portfolios>(
      PORTFOLIO_COLLECTION_ID,
      portfolio_slug
    );

    if (!response) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    const project = response.projects.filter((x) => x.slug === project_slug)[0];

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json(project, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });

  app.get(
    '/portfolios/:portfolio_slug/projects/:project_slug/image/:image_id',
    async (c) => {
      const portfolio_slug = c.req.param('portfolio_slug');
      const project_slug = c.req.param('project_slug');
      const image_id = c.req.param('image_id');

      const response = await database_service.get<Portfolios>(
        PORTFOLIO_COLLECTION_ID,
        portfolio_slug
      );

      if (!response) {
        return c.json({ error: 'Portfolio not found' }, 404);
      }

      const project = response.projects.filter(
        (x) => x.slug === project_slug
      )[0];

      if (!project) {
        return c.json({ error: 'Project not found' }, 404);
      }

      const image = project.images.filter((x) => x === image_id)[0];

      if (!image) {
        return c.json({ error: 'Image not found' }, 404);
      }

      const file = await storage_service.getFilePreview(
        PROJECTS_BUCKET_ID,
        image,
        {
          quality: 50,
          width: 800,
          output: 'png',
        }
      );

      c.header('Content-Type', `image/png`);
      c.header('Cache-Control', `public, max-age=${cacheDuration}`);
      return c.body(file);
    }
  );
}
