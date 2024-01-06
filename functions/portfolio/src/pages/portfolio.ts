import { Hono } from 'hono';
import {
  PORTFOLIO_BUCKET_ID,
  PORTFOLIO_COLLECTION_ID,
  database_service,
  storage_service,
} from '../lib/appwrite.js';
import { Portfolios } from '../types/types.js';

export function Portfolios(app: Hono, cacheDuration: number = 1440) {
  app.get('/portfolios/:slug', async (c) => {
    const slug = c.req.param('slug');

    const response = await database_service.get<Portfolios>(
      PORTFOLIO_COLLECTION_ID,
      slug
    );

    const information = response.information[0];

    const formattedInformation = {
      title: information.title,
      description: information.description,
      icon: information.icon,
      social: information.social.map((social) => JSON.parse(social)),
    };

    const formattedProject = response.projects.map((project) => ({
      title: project.title,
      slug: project.slug,
      short_description: project.short_description,
      description: project.description,
      images: project.images,
      position: project.position,
      tags: project.tags,
      color: project.color,
      links: project.links,
    }));

    const prunedResponse = {
      title: response.title,
      slug: response.$id,
      information: formattedInformation,
      projects: formattedProject,
    };

    return c.json(prunedResponse, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });

  app.get('/portfolios/:portfolio_slug/image', async (c) => {
    const portfolio_slug = c.req.param('portfolio_slug');
    const queryParams = c.req.query();

    const response = await database_service.get<Portfolios>(
      PORTFOLIO_COLLECTION_ID,
      portfolio_slug
    );

    if (!response) {
      return c.json({ error: 'Portfolio not found' }, 404);
    }

    const information = response.information[0];

    if (!information) {
      return c.json({ error: 'Information not found' }, 404);
    }

    if (!information.icon) {
      return c.json({ error: 'Image not found' }, 404);
    }

    const file = await storage_service.getFilePreview(
      PORTFOLIO_BUCKET_ID,
      information.icon,
      {
        ...queryParams,
      }
    );

    c.header('Content-Type', `image/png`);
    c.header('Cache-Control', `public, max-age=${cacheDuration}`);
    return c.body(file);
  });
}
