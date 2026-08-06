# Frontend release gate

Run the complete local gate with:

```sh
npm run test:release
```

The Playwright portion starts Vite on `127.0.0.1:4173`, injects an isolated
session token, and intercepts requests to `http://observerr-api.test`. It never
contacts the backend. Tests run in desktop Chrome and a Pixel 5-sized Chromium
context and cover:

- public landing, sign-in/sign-up aliases, keyboard focus, and unknown routes;
- student dashboard, exams, exam deep link, results, result deep link,
  notifications, settings, and profile;
- lecturer dashboard, exams, exam results, live monitoring, students,
  integrity reports, proctoring, and settings;
- anonymous and cross-role guards;
- representative loading, empty, and API-error responses;
- serious/critical WCAG 2 A/AA axe scans on public and authenticated shells.

Artifacts for failures are written to `test-results/`; the HTML report is
written to `playwright-report/`. Both are ignored by Git.

## Deliberate boundary

This suite does **not** claim to automate real camera capture, MediaPipe model
quality, LiveKit/WebRTC connectivity, multi-participant media, OS permission
prompts, push delivery, or production backend integration. Chromium can fake
media devices, but that does not validate physical hardware, network traversal,
stream quality, or the production signaling service.

Before release, run those checks manually or in a dedicated integrated
environment with real backend credentials, configured Web Push (VAPID), a LiveKit room,
camera/microphone hardware, and at least two participants. Also verify the
production API CORS/cookie policy and one end-to-end student submission through
lecturer result release.

## Dependency audit exception

`npm audit` currently reports React Router twice for one high-severity advisory
(`GHSA-qwww-vcr4-c8h2`). The advisory is limited to React Server Components
action handling. Observerr is a client-only Vite SPA using `BrowserRouter`; it
does not enable React Server Components, framework actions, or a React Router
server runtime, so that vulnerable path is not present. React Router is pinned
to `7.18.2`, which contains the available browser-router security fixes. Remove
this exception and upgrade when a non-vulnerable compatible release is
published.
