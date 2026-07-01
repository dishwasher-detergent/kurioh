import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { throwIfMissing } from './lib/utils.js';
import { Home } from './pages/home.js';
import { Teams } from './pages/organization.js';
import { Projects } from './pages/project.js';

throwIfMissing(process.env, [
  'APPWRITE_ENDPOINT',
  'APPWRITE_PROJECT_ID',
  'KEY',
  'DB_ID',
  'EXPERIENCE_ID',
  'ORGANIZATION_ID',
  'PROJECTS_ID',
  'EDUCATION_ID',
  'BUCKET_ID',
]);

const cache = 0; //24 hours in seconds

const app = new Hono();

app.use('*', cors());

// Error Handling
app.onError((err, c) => {
  console.error(err);

  return c.json({ error: 'Internal server error' }, 500);
});

app.get('/health', (c) => c.json({ status: 'ok' }));

// API Routes
Home(app, cache);
Teams(app, cache);
Projects(app, cache);

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`[server] Running on port:${info.port}`);
});
