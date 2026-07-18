# Kurioh - Portfolio Headless CMS

Kurioh is a modern headless CMS designed specifically for portfolio websites. Keep your portfolio up-to-date with all your latest and greatest creations.

## Overview

Kurioh enables developers and creatives to easily showcase their work through a customizable portfolio system. The headless architecture allows you to focus on your content while providing flexible ways to display your projects, education history, and work experience.

## Repository layout

- `web/` - the Next.js application: sign-up/sign-in, team management, and the portfolio content editor. See `web/README.md`.
- `functions/api/` - a standalone Hono API service that exposes published portfolio content (teams, projects, experience, education, images) over HTTP for consumption by external sites. See `functions/api/README.md`.

## Features

- **Project Management**: Organize and showcase your projects with images, descriptions, tags, and links
- **Team Collaboration**: Invite team members to collaborate on your portfolio projects
- **Experience Tracking**: Document your professional experience with company, role, and skills
- **Education History**: Display your educational background with institutions, degrees, and dates
- **API-First**: Simple API to integrate your portfolio data anywhere
- **Image Management**: Upload and manage portfolio project images

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Database**: Neon Postgres (via Drizzle ORM)
- **Authentication**: Neon Auth (Managed Better Auth), including the Organization plugin for team roles
- **File Storage**: Neon Object Storage (S3-compatible, `public_read` bucket)
- **Public API**: Hono, deployed separately (see `functions/api/`)

## Prerequisites

- Node.js 22.x or later
- pnpm (for `web/`) and npm (for `functions/api/`)
- A [Neon](https://neon.tech) project with Neon Auth (Managed Better Auth), the Organization plugin, and an Object Storage bucket enabled

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/kurioh.git
cd kurioh
```

2. Set up the web application - see `web/README.md` for full details:

```bash
cd web
pnpm install
cp .env.example .env # fill in your Neon credentials
pnpm db:migrate
pnpm dev
```

3. (Optional) Set up the public API service - see `functions/api/README.md` for full details:

```bash
cd functions/api
npm install
cp .env.example .env # fill in DATABASE_URL and STORAGE_URL
npm run dev
```

## Deployment

- `web/` deploys as a standard Next.js application (Vercel, or any Node hosting).
- `functions/api/` deploys as a Docker container (see its README for the Coolify-based deployment flow).
- Database, authentication, and file storage are all managed by Neon - there is no separate infrastructure to provision beyond a Neon project.

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## License

This project is open-source, see the LICENSE file for details.
