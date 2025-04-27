import { Hono } from 'hono';

export function Home(app: Hono, cacheDuration: number = 1440) {
  app.get('/', async (c) => {
    const response = {
      routes: [
        {
          name: 'teams',
          description: 'Get all information about a specific team.',
          path: '/teams/:team_id',
          children: [
            {
              name: 'favicon',
              description: 'Get the image for your team.',
              path: '/teams/:team_id/favicon',
            },
            {
              name: 'image',
              description: 'Get the image for your team.',
              path: '/teams/:team_id/image',
            },
          ],
        },
        {
          name: 'projects',
          description: 'Get all information about a specific project.',
          path: '/teams/:team_id/projects/:project_id',
          children: [
            {
              name: 'images',
              description: 'Get all images for a specific project.',
              path: '/teams/:team_id/projects/:project_id/images/:image_id',
            },
          ],
        },
      ],
    };

    return c.json(response, 200, {
      'Cache-Control': `public, max-age=${cacheDuration}`,
    });
  });
}
