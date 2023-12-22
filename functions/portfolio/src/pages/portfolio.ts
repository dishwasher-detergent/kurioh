import { Hono } from 'hono';
import { PORTFOLIO_COLLECTION_ID, database_service } from '../lib/appwrite.js';

export function Portfolios(app: Hono, cacheDuration: number = 1440) {
  app.get('/portfolios/:slug', async (c) => {
    const slug = c.req.param('slug');

    const response = await database_service.get(PORTFOLIO_COLLECTION_ID, slug);

    return c.json(response, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });
}
