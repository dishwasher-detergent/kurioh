import { Hono } from 'hono';
import { PORTFOLIO_COLLECTION_ID, database_service } from '../lib/appwrite.js';
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
}
