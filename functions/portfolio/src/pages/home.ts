import { Hono } from 'hono';

export function Home(app: Hono, cacheDuration: number = 1440) {
  app.get('/', async (c) => {
    const response = {
      routes: [
        {
          name: 'portfolios',
          description: 'Get all information about a specific portfolio.',
          path: '/portfolios/:slug',
        },
        {
          name: 'projects',
          description: 'Get all information about a specific project.',
          path: '/portfolios/:portfolio_slug/projects/:project_slug',
        },
      ],
    };

    return c.json(response, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });
}
