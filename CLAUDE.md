# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router alongside KeystoneJS for a drama club management system. The project allows students and parents to view timetables, check fees, and manage enrolments. Developed by Josh Calder at OpenSaasAU as a technical showcase and YouTube tutorial series.

**Key Technologies:**
- Next.js 15 with App Router and Server Components
- KeystoneJS 6 with `getContext` API (no separate server required)
- NextAuth v5 (beta) for authentication
- Neon DB (PostgreSQL with serverless driver adapters)
- Inngest for background tasks
- Tailwind CSS with shadcn/ui components
- gql.tada for type-safe GraphQL queries
- pnpm as package manager

## Development Commands

### Running the Development Environment
```bash
pnpm install              # Install dependencies
pnpm dev                  # Start both Next.js (port 3000) and Keystone Admin UI (port 4000)
pnpm dev:next             # Start only Next.js dev server on port 3000
pnpm dev:keystone         # Start only Keystone Admin UI on port 4000
```

### Building and Testing
```bash
pnpm build                # Build Next.js for production
pnpm build:keystone       # Build Keystone Admin UI
pnpm lint                 # Run ESLint, cspell, and TypeScript checks
pnpm format               # Format code with Prettier
```

### Database Operations
```bash
pnpm migrate:deploy       # Deploy Prisma migrations to database
pnpm seed-data            # Seed the database with test data
```

### Running a Single Test
This project does not currently have a test suite configured.

## Architecture

### Dual-Server Development Setup
The project uses Turbo to orchestrate two Next.js development servers:
1. **Main Site** (port 3000): The public website and dashboard
2. **Keystone Admin UI** (port 4000): The admin interface, proxied through `/admin` routes

The Keystone Admin UI is accessed at `/admin` via Next.js rewrites (configured in `next.config.ts`).

### KeystoneJS Integration with Next.js

**CRITICAL:** This project uses Keystone's `getContext` API, which embeds Keystone directly into Next.js without requiring a separate GraphQL server.

**Key Files:**
- `keystone.ts` - Keystone configuration (schema, database, UI settings)
- `src/keystone/context/index.ts` - Creates the Keystone context with Neon DB adapter
- `src/keystone/schema.ts` - Defines all Keystone lists (data models)
- `src/keystone/lists/` - Individual list configurations (Account, Student, Enrolment, Message)

**Accessing Keystone Context:**
```typescript
import { keystoneContext } from 'keystone/context'
import { getSessionContext } from 'keystone/context'

// Use sudo context (bypasses access control)
const result = await keystoneContext.sudo().db.User.findOne({ where: { id } })

// Use session context (respects access control)
const sessionCtx = await getSessionContext()
const result = await sessionCtx.query.User.findOne({ where: { id } })
```

### Authentication Flow

NextAuth v5 handles authentication with three providers:
- **Credentials**: Email/password with Keystone's password field
- **Google OAuth**: Social login with automatic user creation
- **Apple**: (Commented out but available)

**Key Files:**
- `src/lib/auth.ts` - NextAuth configuration, callbacks, and providers
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route handler

**Authentication Logic:**
1. Users authenticate via NextAuth
2. On sign-in, the JWT callback fetches user data from Keystone
3. Session callback merges user data into the session object
4. Session includes: `userId`, `allowAdminUI`, `data.accountId`, `data.role`

**Access Control:**
- Keystone lists use `isAdmin`, `isLoggedIn`, and `userFilter` helpers (in `src/keystone/helpers.ts`)
- GraphQL endpoint (`src/app/api/graphql/route.ts`) requires admin access
- NextAuth session determines permissions

### GraphQL API

**Endpoint:** `/api/graphql` (requires admin authentication)

The GraphQL API is served using graphql-yoga with Keystone's schema:
- **File:** `src/app/api/graphql/route.ts`
- **Authentication:** Only users with `allowAdminUI: true` can access
- **Context:** Automatically includes NextAuth session via `getSessionContext()`

**Type-Safe Queries:**
The project uses `gql.tada` for type-safe GraphQL queries with auto-generated types:
```typescript
import { graphql } from 'gql'

const GET_USER = graphql(`
  query GET_USER($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      email
      account { firstName surname }
    }
  }
`)
```

**GraphQL Schema Generation:**
- `schema.graphql` - Auto-generated from Keystone schema (run `pnpm postinstall`)
- `src/graphql-env.d.ts` - Type definitions for gql.tada (auto-generated)

### Background Jobs with Inngest

Inngest handles asynchronous tasks like sending emails and copying enrolments.

**Key Files:**
- `src/lib/inngest/client.ts` - Inngest client configuration
- `src/inngestFunctions/` - Event handlers (enrolment, lessonTerms, message)
- `src/app/api/inngest/route.ts` - Inngest webhook endpoint

**Common Events:**
- `app/enrolment.confirmed` - Send enrolment confirmation email
- `app/lessonTerm.confirmed` - Send lesson term notification
- `app/copyterm.confirmed` - Copy enrolments from previous term
- `app/term.completed` - Handle term completion tasks

**Triggering Events:**
Inngest events are triggered from Keystone hooks:
```typescript
// In src/keystone/schema.ts
hooks: {
  afterOperation: async ({ operation, context, item }) => {
    await inngest.send({
      name: 'app/enrolment.confirmed',
      data: { item, session: context.session }
    })
  }
}
```

### Database Schema (Keystone Lists)

**Core Models:**
- **User**: Authentication (credentials/OAuth), email, password, role
- **Account**: Parent/guardian contact details, students relationship
- **Student**: Student information, enrolments
- **LessonCategory**: Lesson types (e.g., Drama, Music)
- **Lesson**: Specific lesson details (time, day, cost, teachers)
- **Term**: Academic terms with status (DRAFT, UPCOMING, ENROL, PREVIOUS)
- **LessonTerm**: Junction between Lesson and Term with enrolments
- **Enrolment**: Student enrolment in a LessonTerm with status tracking
- **Message**: Announcements sent to lesson term participants
- **Teacher**: Staff information with bio and image
- **EmailSettings**: Singleton for email templates
- **ImportantDate**: Calendar events

**Key Relationships:**
- User → Account (one-to-one)
- Account → Students (one-to-many)
- Student → Enrolments (one-to-many)
- LessonTerm → Enrolments (one-to-many)
- Lesson → LessonTerms (one-to-many)
- Term → LessonTerms (one-to-many)

### App Router Structure

**Route Groups:**
- `(home)` - Landing page (`/`)
- `(website)` - Public pages (`/about`, `/timetable`, `/fees`, `/calendar`, `/staff`, `/contact`)
- `auth` - Authentication (`/auth/signin`, `/auth/register`)
- `dashboard` - Logged-in user area (`/dashboard/*`)
- `api` - API routes (`/api/graphql`, `/api/inngest`, `/api/auth`)

**Important Routes:**
- `/admin` - Proxied to Keystone Admin UI (port 4000)
- `/dashboard/students` - Manage students, view enrolments
- `/dashboard/students/chat` - AI-powered student creation (uses OpenAI)

### Custom Keystone Field: Image

**File:** `src/components/keystone/image.tsx`

Custom field for handling images with Vercel Blob storage integration. Used in the Teacher model.

## Important Implementation Details

### Neon DB with Prisma Driver Adapters

The project uses Neon's serverless PostgreSQL with Prisma driver adapters:
- Connection pooling via `@neondatabase/serverless`
- WebSocket support with `ws` package
- Custom `NeonPrismaClient` class in `src/keystone/context/index.ts`

### TypeScript Path Aliases

Base URL is set to `./src` in `tsconfig.json`:
```typescript
// Import from src/lib/auth.ts
import { auth } from 'lib/auth'

// Import from src/keystone/context/index.ts
import { keystoneContext } from 'keystone/context'
```

### Enrolment Workflow

1. Parent creates account and adds students
2. Parent enrolls student in a lesson term (status: `PENDING`)
3. Admin confirms enrolment in Keystone Admin (status: `ENROLED`)
4. Inngest sends confirmation email with lesson details

### Styling

- **Tailwind CSS** with custom config in `tailwind.config.js`
- **shadcn/ui components** in `src/components/ui/`
- **Custom components** in `src/components/`
- **Global styles** in `src/styles/`

## Environment Variables

Required environment variables (see `.env.local`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `KEYSTONE_URL` - URL for Keystone Admin UI (default: `http://localhost:4000`)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `NEXTAUTH_SECRET` - NextAuth encryption key
- `NEXTAUTH_URL` - Application URL
- `SENDGRID_API_KEY` - SendGrid for email sending
- `OPENAI_API_KEY` - OpenAI for AI features (student creation)
- `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` - Inngest credentials

## Common Gotchas

1. **Keystone Context in Server Components:** Always use `getSessionContext()` in Next.js server components to ensure session is attached. Use `keystoneContext.sudo()` only for operations that should bypass access control.

2. **GraphQL Schema Updates:** After modifying Keystone schema, run `pnpm postinstall` to regenerate `schema.graphql` and `src/graphql-env.d.ts`.

3. **Database Migrations:** Keystone auto-generates Prisma schema. Migrations are in `/migrations`. Deploy with `pnpm migrate:deploy`.

4. **Dual Development Servers:** The `pnpm dev` command runs both servers via Turbo. If only working on frontend, use `pnpm dev:next`.

5. **Admin UI Authentication:** Only users with `role: "ADMIN"` can access Keystone Admin UI and GraphQL endpoint.
