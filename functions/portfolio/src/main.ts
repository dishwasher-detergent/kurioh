import { Hono } from 'hono';
import { cors } from 'hono/cors';

import {
  requestFromContext,
  responseForContext,
  throwIfMissing,
} from './lib/utils.js';
import { Home } from './pages/home.js';
import { KeepWarm } from './pages/keepWarm.js';
import { Portfolios } from './pages/portfolio.js';
import { Projects } from './pages/project.js';
import { Context } from './types/types.js';

const cache = 1440; //24 hours in seconds

const app = new Hono();

app.use('*', cors());

// Error Handling
app.onError((err, c) => {
  return c.json(err, 500);
});

// Post requests
KeepWarm(app);

// API Routes
Home(app, cache);
Portfolios(app, cache);
Projects(app, cache);

export default async (context: Context) => {
  throwIfMissing(process.env, [
    'APPWRITE_ENDPOINT',
    'APPWRITE_PROJECT_ID',
    'DATABASE_ID',
    'INFORMATION_COLLECTION_ID',
    'PROJECTS_COLLECTION_ID',
    'ARTICLES_COLLECTION_ID',
    'PROTFOLIO_COLLECTION_ID',
    'PORTFOLIO_BUCKET_ID',
    'PROJECTS_BUCKET_ID',
  ]);

  const request = requestFromContext(context);
  const response = await app.request(request);

  return await responseForContext(context, response);
};
