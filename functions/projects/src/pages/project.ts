import { Hono } from 'hono';
import { PORTFOLIO_COLLECTION_ID, database_service } from '../lib/appwrite.js';

export function Portfolio(app: Hono, cacheDuration: number = 1440) {
  app.get('/portfolio/:id', async (c) => {
    const id = c.req.param('id');

    const response = await database_service.get(PORTFOLIO_COLLECTION_ID, id);

    return c.json(response, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });
}
