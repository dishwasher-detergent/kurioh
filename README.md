# Kurioh - Portfolio Headless CMS

Kurioh is a modern headless CMS designed specifically for portfolio websites. Keep your portfolio up-to-date with all your latest and greatest creations!

## Overview

Kurioh enables developers and creatives to easily showcase their work through a customizable portfolio system. The headless architecture allows you to focus on your content while providing flexible ways to display your projects, education history, and work experience.

## Features

- 📂 **Project Management**: Organize and showcase your projects with images, descriptions, tags, and links
- 👤 **Team Collaboration**: Invite team members to collaborate on your portfolio projects
- 📊 **Experience Tracking**: Document your professional experience with company, role, and skills
- 🎓 **Education History**: Display your educational background with institutions, degrees, and dates
- 🌐 **API-First**: Simple API to integrate your portfolio data anywhere
- 🔄 **Real-time Updates**: Content changes reflect immediately through Appwrite's realtime subscriptions
- 🖼️ **Image Management**: Upload and manage portfolio project images

## Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Appwrite (Authentication, Database, Storage, Functions)
- **Deployment**: Appwrite Cloud

## Prerequisites

- [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation) installed

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/kurioh.git
cd kurioh
```

2. Install dependencies:

```bash
cd web
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the web directory
   - Update with your Appwrite credentials

## Deployment Options

### Using Appwrite Cloud

Appwrite Cloud is the easiest way to get started, but note that as of the current version, it doesn't support relationships. You will need to use self-hosted Appwrite for full functionality.

1. Sign up for an [Appwrite Cloud account](https://cloud.appwrite.io/register)

2. Log in to Appwrite CLI:

```bash
appwrite login
```

3. Deploy the everything:

```bash
appwrite push all
```

### Function Deployment Details

For proper function deployment and configuration:

1. Deploy the API function:

   ```bash
   appwrite push function
   ```

2. After deployment, set these environment variables in the Appwrite Console:

   - `DATABASE_ID`: Your Appwrite database ID (typically "portfolio")
   - `EXPERIENCE_COLLECTION_ID`: Your experience collection ID
   - `ORGANIZATION_COLLECTION_ID`: Your team collection ID
   - `PROJECTS_COLLECTION_ID`: Your project collection ID
   - `PROJECTS_BUCKET_ID`: Your storage bucket ID for project images

3. Update `NEXT_PUBLIC_API_ENDPOINT` in the web application with your deployed function endpoint.

4. Deploy your web application to your preferred hosting provider (Vercel, Netlify, etc.)

## Development

To run the project locally:

```bash
# Start the web application
cd web
pnpm dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source, see the LICENSE file for details.
