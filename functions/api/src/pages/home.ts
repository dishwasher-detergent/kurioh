import { Hono } from 'hono';

export function Home(app: Hono, cacheDuration: number = 1440) {
  app.get('/', async (c) => {
    const response = {
      routes: [
        {
          name: 'organizations',
          description: 'Get all information about a specific organization.',
          path: '/organizations/:organization_slug',
          children: [
            {
              name: 'favicon',
              description: 'Get the image for your organization.',
              path: '/organizations/:organization_slug/favicon',
            },
            {
              name: 'image',
              description: 'Get the image for your organization.',
              path: '/organizations/:organization_slug/image',
            },
          ],
        },
        {
          name: 'projects',
          description: 'Get all information about a specific project.',
          path: '/organizations/:organization_slug/projects/:project_slug',
          children: [
            {
              name: 'images',
              description: 'Get all images for a specific project.',
              path: '/organizations/:organization_slug/projects/:project_slug/images/:image_id',
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
