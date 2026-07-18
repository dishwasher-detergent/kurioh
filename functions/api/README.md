# api

A standalone [Hono](https://hono.dev) API backend that reads content from Neon Postgres and serves it over HTTP, with images served from Neon Object Storage. Designed to be deployed as a Docker container on [Coolify](https://coolify.io).

## Usage

### GET /health

- Health check used by Coolify's healthcheck / load balancer.

### GET /

- Lists the available routes.

### GET /teams/:team_id

- Returns team info along with its projects, experience, and education.

### GET /teams/:team_id/image

### GET /teams/:team_id/favicon

### GET /teams/:team_id/projects

### GET /teams/:team_id/projects/:project_id

### GET /teams/:team_id/projects/:project_id/images/:image_id

## Local development

```bash
npm install
cp .env.example .env # fill in the values
npm run dev
```

The server starts on `http://localhost:3000` (or `PORT` if set).

## Deploying on Coolify

This directory includes a `Dockerfile` that installs, builds (via `tsup`), and runs the API:

1. In Coolify, create a new **Dockerfile** based application/service pointing at this repo, with `functions/api` as the base directory.
2. Set the environment variables listed below in the Coolify application's environment settings.
3. Expose port `3000` (or set `PORT` and expose that instead).

## Environment Variables

| Variable       | Description                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`         | Port the server listens on (default `3000`)                                                                                                              |
| `DATABASE_URL` | Neon Postgres connection string                                                                                                                          |
| `STORAGE_URL`  | Public base URL for reading objects from the Neon Object Storage bucket (`public_read`), i.e. `<endpoint>/<bucket>` - image/favicon routes redirect here |

See `.env.example` for a template.
