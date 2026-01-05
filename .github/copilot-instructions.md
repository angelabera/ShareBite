# GitHub Copilot / AI Agent Instructions for ShareBite

Short, focused guidance designed to get an AI coding agent productive quickly in this repository.

## Quick summary
- Full-stack static + Node/Mongo app: frontend is static HTML/CSS/vanilla JS in `frontend/`, backend is Express + Mongoose in `backend/src/`.
- Primary API prefixes: **/api/auth**, **/api/ngo**, **/api/food** (see `backend/src/routes/*`).
- Auth uses JWT with roles `user` or `ngo` (tokens created in controllers and consumed in `backend/src/middleware/authMiddleware.js`).

## How to run locally
- Backend (dev):
  - cd `backend` && `npm install` && `npm run dev` (uses `nodemon`)
  - Production: `npm start` (runs `node src/server.js`)
- Frontend: open `frontend/index.html` in a browser or serve the `frontend/` folder with any static server.
- For full end-to-end testing, point frontend `API_BASE_URL` (`frontend/js/api.js`) at backend (default `http://localhost:5000/api`).

## Important environment variables
- `MONGO_URI` — required (checked in `backend/src/config/db.js`) or server will exit
- `JWT_SECRET` — required (used to sign JWTs in `authController.js` and `ngoAuthController.js`)
- Optional rate-limiter overrides: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX` (configured in `server.js`)

## API & auth patterns to follow
- Protected routes use `Authorization: Bearer <token>` header; frontend stores token under `localStorage.sharebite_token` (`frontend/js/api.js`).
- Validation uses `express-validator` at the route level; controllers call `validationResult(req)` and return `400` with `errors` array for validation failures.
- Controller errors use: log via `console.error` and return `500` with `{ message: 'Server error' }` (keep this shape consistent).
- JWT payload includes `{ id, role }` and the `authMiddleware` will attempt to load either `User` or `Ngo` by id.

## Data model highlights
- `User` (`backend/src/models/User.js`): `{ name, email, password }` — password hashed via pre-save hook
- `Ngo` (`backend/src/models/Ngo.js`): `{ name, email, password, phone, address, nickname, availability }`
- `FoodListing` (`backend/src/models/FoodListing.js`): fields include `foodType, quantity, category, freshUntil (Date), pickupTime, pickupLocation, contactInfo, photos[], donorId (ref User), status` (enum `['available','reserved','completed']`)

## Rate limiting and routes
- Global limiter on `/api` and stricter limiter on `/api/auth` (see `server.js`). When adding endpoints, be mindful of per-route limits.

## Frontend-specific conventions
- Vanilla JS + no bundler. Files under `frontend/js/` are loaded directly from HTML.
- API helper: `frontend/js/api.js` centralizes requests and unwraps JSON; it throws objects like `{ status, message, errors }` on failure — follow this shape when changing endpoints.
- Auth token key: `sharebite_token`. Language key: `sharebite-lang` (see `frontend/js/i18n.js`).
- i18n: `frontend/js/i18n.js` exposes `window.i18n.t(key, vars)`, `setAppLanguage(lang)`, `currentLang()` and uses `data-i18n` attributes to mark elements for translation. To add a language, extend `bundledLocales` and add the option to the `#languageSelect` UI.

## Code-style & contribution rules (project-specific)
- Indentation and style: 2 spaces for JS/HTML/CSS (see `CONTRIBUTING.md`).
- Before starting work: **create an issue and get it assigned** (strict project rule; PRs without assignment may be rejected).
- One PR should address one issue; include screenshots for UI changes.

## Testing & CI notes
- There are no automated tests in the repo currently — rely on the manual testing checklist in `CONTRIBUTING.md` (open `index.html` in multiple browsers, check console, verify forms and animations).
- Consider adding unit/integration tests for controllers and API helper as an improvement.

## Common pitfalls and gotchas
- `JWT_SECRET` missing -> `generateToken` may throw or login/register will fail.
- `MONGO_URI` missing -> `connectDB()` will `process.exit(1)`.
- Server binds to `0.0.0.0` and starts before DB connect — if DB is not available, server still starts but will exit in `connectDB()` if connection fails.
- API expects responses to be JSON (frontend does `await res.json()` unconditionally). Maintain JSON shape for errors.

## Where to look for examples
- Route patterns & validation: `backend/src/routes/*.js`
- Auth implementation/logout: `backend/src/controllers/*AuthController.js` + `backend/src/middleware/authMiddleware.js`
- DB connect: `backend/src/config/db.js`
- API client & token usage: `frontend/js/api.js`
- i18n usage: `frontend/js/i18n.js` and `data-i18n` attributes in HTML files

---
If anything here is unclear or you'd like me to include code snippets or add CI/test instructions, tell me which section to expand and I will iterate. Thank you! 👩‍💻🚀