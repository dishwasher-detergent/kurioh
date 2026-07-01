# api

A standalone [Hono](https://hono.dev) API backend that reads content from Appwrite (databases + storage) and serves it over HTTP. Designed to be deployed as a Docker container on [Coolify](https://coolify.io).

## 🧰 Usage

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

## 💻 Local development

```bash
npm install
cp .env.example .env # fill in the values
npm run dev
```

The server starts on `http://localhost:3000` (or `PORT` if set).

## 🐳 Deploying on Coolify

This directory includes a `Dockerfile` that installs, builds (via `tsup`), and runs the API:

1. In Coolify, create a new **Dockerfile** based application/service pointing at this repo, with `functions/api` as the base directory.
2. Set the environment variables listed below in the Coolify application's environment settings.
3. Expose port `3000` (or set `PORT` and expose that instead).

## ⚙️ Environment Variables

| Variable              | Description                                    |
| ---------------------- | ----------------------------------------------- |
| `PORT`                  | Port the server listens on (default `3000`)     |
| `APPWRITE_ENDPOINT`     | Appwrite API endpoint, e.g. `https://cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID`   | Appwrite project ID                             |
| `KEY`                   | Appwrite API key with database/storage read access |
| `DB_ID`                 | Appwrite database ID                            |
| `EXPERIENCE_ID`         | Experience collection ID                        |
| `ORGANIZATION_ID`       | Team/organization collection ID                 |
| `PROJECTS_ID`           | Projects collection ID                          |
| `EDUCATION_ID`          | Education collection ID                         |
| `BUCKET_ID`             | Storage bucket ID for project/team images        |

See `.env.example` for a template.
