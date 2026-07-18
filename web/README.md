# 🚀 Kurioh

A Next.js web application backed by Neon Postgres (database), Neon Auth (authentication), and Neon Object Storage (files).

## 📚 Overview

This project provides everything you need to build a
modern web application with Next.js, Neon Postgres, and Neon Auth. It includes a
full authentication system, user profile management, and a clean,
responsive UI.

## ✨ Features

- 🔐 **Authentication Flows**
  - 📧 Email & Password Sign In/Sign Up
  - 🔄 Password Recovery Process
  - 🔑 OAuth Integration (GitHub, Google, etc.)
- 📊 **Data Management**
  - ✏️ Complete CRUD Operations Examples
  - 📁 File Storage Implementations
  - 🔄 Cache Invalidation
- 👥 **Team Management**
  - 🏢 Create and Manage Teams
  - 👥 Invite Team Members
  - 👑 Role-based Permissions (Owner, Admin, Member)
  - 🚪 Join/Leave Teams
  - 🔒 Team-specific Content Access
- 👤 **User Management**
  - 👨‍💻 Profile Editing & Customization
  - 🔗 Team Affiliations
- 📋 **General**
  - 🛡️ Protected Routes
  - 🎨 TailwindCSS
  - 📱 Responsive Design

## 📋 Prerequisites

- 📦 [Node.js 22.x or later](https://nodejs.org/en/download)
- 🔧 [pnpm](https://pnpm.io/)
- ☁️ A [Neon](https://neon.tech) project with Neon Auth (Managed Better Auth), the Organization plugin, and an Object Storage bucket (`public_read` access mode) enabled

## ⚙️ Installation

1. Clone this repository and navigate to the `web` directory.

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file based on `.env.example`:

   - `DATABASE_URL` — from the Neon Console (Connection Details).
   - `NEON_AUTH_BASE_URL` / `NEON_AUTH_COOKIE_SECRET` — from the Neon Console (Auth). Generate the secret with `openssl rand -base64 32`.
   - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_ENDPOINT_URL_S3` / `AWS_REGION` / `NEON_STORAGE_BUCKET` — S3-compatible credentials for your Neon Object Storage bucket (configure the bucket as `public_read` so uploaded images are directly viewable).
   - `NEXT_PUBLIC_STORAGE_URL` — the public base URL for reading objects (`<endpoint>/<bucket>`), used client-side to build image URLs.

4. Push the database schema:

```bash
pnpm db:migrate
```

5. Start the development server:

```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔑 Adding GitHub OAuth

GitHub OAuth is configured in Neon:

1. 🔗 Go to your [GitHub Developer Settings](https://github.com/settings/apps) and create a new App.

2. 🔄 Set the **Authorization callback URL** to your Neon Auth callback (see the Neon Console for the exact URL for your project).

3. 🔐 After creating the OAuth App, you'll receive a **Client ID** and need to generate a **Client Secret**.

4. ⚙️ In the Neon Console, navigate to **Auth** → **Providers**.

5. ✅ Enable the GitHub provider and enter the **Client ID** and **Client Secret** from GitHub.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
