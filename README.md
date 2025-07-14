# Video Management App

A full-stack video management platform built with Next.js, Supabase, AWS S3, and a modern React UI.  
Features include user authentication (email/password & magic link), video upload to S3, admin/user roles, dashboard, and more.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Video Upload & Storage](#video-upload--storage)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (Sign up, Sign in, Magic Link, Sign out)
- User profile creation on signup
- Admin and user roles
- Video upload to AWS S3 with signed URLs
- Video listing, filtering, and deletion
- Dashboard for managing videos and users
- Responsive, modern UI with reusable components
- Email sending via Resend
- Secure backend-only Supabase communication

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Radix UI, Lucide Icons
- **Backend:** Next.js API routes, Supabase (Auth & Database), AWS S3 (video storage)
- **Database:** Supabase Postgres
- **Other:** Resend (email), dotenv, pg (Postgres client for scripts)

---

## Project Structure

```
video-management-app/
├── app/                # Next.js app directory (pages, API routes)
│   ├── api/            # API endpoints (auth, videos, etc.)
│   ├── auth/           # Auth pages (sign in, sign up)
│   ├── dashboard/      # Dashboard pages
│   └── ...             
├── components/         # Reusable React components (UI, video, admin, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries (Supabase, S3, helpers)
├── public/             # Static assets
├── scripts/            # Utility scripts (e.g., create-tables.js)
├── styles/             # Global and Tailwind styles
├── package.json        # Project metadata and dependencies
├── .env / .env.local   # Environment variables (not committed)
└── ...                 
```

---

## Setup & Installation

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd video-management-app
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` (create if missing).
   - Fill in all required values (see [Environment Variables](#environment-variables)).

4. **Create database tables:**
   ```sh
   node scripts/create-tables.js
   ```

5. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

---

## Environment Variables

Set these in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET_NAME=your-s3-bucket-name
AWS_CDN_URL=your-cdn-url (optional)

RESEND_API_KEY=your-resend-api-key
```

---

## Scripts

- `dev` - Start the development server
- `build` - Build for production
- `start` - Start the production server
- `lint` - Lint the codebase
- `node scripts/create-tables.js` - Create required database tables in Supabase

---

## Usage

- **Sign up / Sign in:**  
  Users can register and log in with email/password or magic link.
- **Dashboard:**  
  Authenticated users can upload, view, and delete videos.
- **Admin:**  
  Admins can manage users and see all videos.
- **Video Upload:**  
  Videos are uploaded to S3 and accessible via signed URLs.
- **Email:**  
  Magic link and notification emails are sent via Resend.

---

## API Endpoints

- `/api/auth/signup` - User registration (creates profile)
- `/api/auth/signin` - User login
- `/api/auth/signout` - User logout
- `/api/auth/magic-link` - Send magic link email
- `/api/videos` - List, filter, and delete videos
- `/api/videos/upload` - Upload a new video
- `/api/videos/[id]` - Video-specific actions (e.g., delete)
- `/api/videos?key=...` - Get a signed S3 URL for a video

---

## Authentication

- Uses Supabase Auth for secure user management.
- All Supabase communication is handled in backend API routes.
- User profile is created in the `profiles` table on signup.

---

## Video Upload & Storage

- Videos are uploaded to AWS S3 using signed URLs.
- S3 lifecycle rules can be set to auto-delete files after a period (e.g., 3 days).
- Video metadata is stored in the `videos` table in Supabase.

---

## Database Schema

**Profiles Table:**
- `id`, `user_id`, `email`, `full_name`, `role`, `created_at`, `updated_at`

**Videos Table:**
- `id`, `user_id`, `agent_id`, `call_id`, `title`, `description`, `user_name`, `s3_url`, `file_size`, `duration`, `status`, `created_at`, `updated_at`

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

[MIT](LICENSE) 