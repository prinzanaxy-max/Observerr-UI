# Observerr UI — Project Overview

Observerr UI is the frontend application for the Observerr academic integrity platform. The repository contains a React + TypeScript + Vite web application that provides the public landing experience, authentication flow, protected dashboards, and role-based routes for students and lecturers.

## Project Purpose

Observerr is designed to support exam integrity and proctoring workflows for educational institutions. The UI is responsible for:

- presenting the Observerr landing page and product positioning
- enabling user registration and login
- storing and restoring authentication state in the browser
- protecting pages based on authentication status
- redirecting users into student or lecturer-specific experiences
- communicating with the backend API using token-based authentication and refresh handling

## Technology Stack

This repo is built with the following core technologies:

- React 19
- TypeScript
- Vite
- React Router
- Zustand for global auth state
- Axios for HTTP requests
- Tailwind CSS for layout and styling
- ESLint for code quality checks

## Application Behavior

The app uses client-side routing to expose a clean user experience:

- `/` → landing page
- `/auth` → authentication page
- `/login` and `/register` → redirected to the auth page
- `/dashboard` → authenticated user area
- `/student` → student-only area
- `/lecturer` → lecturer-only area
- `/403` → access denied page
- `*` → not found page

The route structure is defined in the main application entry file and uses both protected-route guards and role-based guards.

## Authentication Model

The frontend uses a lightweight auth architecture based on local storage and a Zustand store:

- access token and refresh token are stored in browser storage
- the auth store hydrates persisted state on app startup
- API calls are sent through a shared Axios client
- a response interceptor automatically attempts token refresh on 401 errors
- unauthenticated or invalid-session states are redirected back to the auth page

This means the frontend is tightly coupled to a backend authentication service that exposes endpoints such as:

- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/refresh`
- `/api/auth/me`

## Repository Structure

The repository is organized as follows:

- `src/App.tsx` — route configuration and top-level application composition
- `src/main.tsx` — React bootstrap entry point
- `src/pages/` — page-level views for landing, auth, dashboards, and error states
- `src/components/` — route guards and UI components
- `src/services/` — API service layer, especially auth service logic
- `src/store/` — Zustand stores for global state
- `src/lib/` — shared client-side utilities, including the Axios instance
- `src/types/` — TypeScript domain types
- `public/` — static assets
- `index.html` — frontend HTML entry
- `vite.config.ts` — Vite configuration
- `tailwind.config.js` and `postcss.config.js` — styling pipeline configuration

## Key Files

### Environment Configuration

The repository includes an `.env.example` file with:

```env
VITE_PORT=5173
VITE_API_BASE_URL=http://localhost:8080
```

These values indicate that the frontend expects a local backend running on port 8080 by default.

### Package Scripts

The app provides the following scripts in `package.json`:

- `npm run dev` — starts the Vite development server
- `npm run build` — runs TypeScript compilation and production build
- `npm run lint` — runs ESLint on the project
- `npm run preview` — serves the built production bundle for preview

## Development Workflow

To run the frontend locally:

1. Open the repository folder.
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file if needed:

```bash
copy .env.example .env
```

4. Update the API base URL if your backend runs elsewhere.
5. Start the development server:

```bash
npm run dev
```

## Suggested Backend Relationship

This repository is the UI layer of a larger application. The frontend expects a backend service that provides:

- authentication and session management
- user roles such as STUDENT and LECTURER
- protected APIs for dashboard functionality
- proctoring or academic integrity data endpoints

The base URL is configured through the environment variable `VITE_API_BASE_URL`, which defaults to the deployed backend endpoint if not overridden.

## Repository Notes

The current README in the repository is minimal and appears to be the standard Vite starter template, so this document acts as a more practical and project-specific overview of what the repository actually contains and how it is intended to work.

## Summary

Observerr UI is a role-aware, secure, React-based frontend for an academic integrity platform. It is centered around authentication, protected routing, and role-specific dashboards for students and lecturers, and it is designed to communicate with a backend API over a token-based auth flow.
