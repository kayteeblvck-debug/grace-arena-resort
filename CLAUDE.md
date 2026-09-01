# Grace Arena Resort — working notes

Website for Grace Arena Resorts, a hospitality and event destination in Onimangoro, Igbo-Ora, Oyo
State, Nigeria. Monorepo: Spring Boot REST API in `backend/`, React SPA in `frontend/`. See
`README.md` for the full layout, endpoint table and run instructions.

## Commands

```bash
./scripts/dev.sh                 # both dev servers
cd backend  && ./gradlew bootRun # API on http://localhost:8080/api
cd backend  && ./gradlew build   # compile + test
cd frontend && npm run dev       # site on http://localhost:5173
cd frontend && npm run build     # type-check + build
cd frontend && npm run lint
```

## Conventions

**Backend** (`com.gracearena.resort`)

- Package by feature, not by layer: `room/`, `booking/`, `user/`, `enquiry/`, `availability/`. A
  feature owns its entity, repository, service, controller and DTOs. Add new features as sibling
  packages, not as new layer folders. `common/`, `config/`, `security/` and `email/` are the
  cross-cutting exceptions.
- Every endpoint returns `ApiResponse<T>` (`success` / `message` / `data`) — including 401 and 403,
  which `RestAuthErrorHandler` writes in the same shape. Errors go through
  `GlobalExceptionHandler`; throw `ResourceNotFoundException`, `BadRequestException` or
  `EmailNotVerifiedException` from services rather than returning error responses by hand.
- Request DTOs are records with Jakarta validation annotations; controllers use `@Valid`. Where a
  feature has several, they are grouped in one `XxxDtos` holder class.
- Entities use Lombok (`@Getter/@Setter/@Builder`). Responses are plain records with a `from(...)`
  or `of(...)` factory.
- Services are `@Transactional(readOnly = true)` at the class level, with `@Transactional` on the
  write methods.
- Controllers are versioned: `/v1/...` under the `/api` context path.
- Authorisation lives in two places on purpose: coarse path rules in `SecurityConfig`, and
  `@PreAuthorize("hasRole('ADMIN')")` on the staff endpoints. Ownership checks ("is this your
  booking?") belong in the service, and answer 404 rather than 403 so references cannot be probed.
- `EmailSender` implementations must never throw. A mail outage degrades to a log line; it does not
  fail a registration or a booking.

**Frontend**

- All network calls go through `src/api/client.ts` — do not call `fetch` from components. Add a
  method to the `api` object and a type to `src/api/types.ts`. The client attaches the bearer token
  itself; components never handle it.
- `useApiResource(key, fetcher)` handles loading/error/cancellation for reads. The `key` string
  identifies the request; changing it re-fetches. It also returns `reload()` (re-run) and
  `mutate(next)` (replace in place after a mutation).
- Auth state comes from `useAuth()`. Route protection is `<ProtectedRoute>`; it holds the route
  while the stored token is being checked rather than redirecting.
- **All standing copy lives in `src/content/resort.ts`**, not in components. Pages are layout.
- Images go through `<ResortImage>`, never a bare `<img>` for content. Missing files fall back to a
  generated on-brand panel, so real photography can be dropped into `public/images/` later with no
  code change. Use `variant="backdrop"` when the image sits behind headline text.
- Plain CSS, no framework. `src/index.css` only imports `src/styles/{tokens,base,layout,components,
  pages}.css` — one stylesheet had stopped being navigable. Start at `tokens.css`.
- Routes are declared in `src/App.tsx`; pages live in `src/pages/`.

## Design

Taken from the logo: near-black (`--ink`), a warm amber gold (`--gold`), and warmed white
(`--ivory`). Two golds on purpose — `--gold` is the logo colour, used on dark grounds and as a
graphic element; `--gold-deep` is for gold *text* on ivory, where the logo colour has too little
contrast. Corners are square throughout. Display type is Cormorant Garamond, UI type is Jost.
Sections on ink get `.on-dark`, which flips the borders and the logo.

## Current state

Working end to end: the public site, accounts with SMTP email confirmation, availability search,
booking with real overlap enforcement, cancellation, enquiries, and an admin reservations desk.
Backed by an in-memory H2 database seeded with six room types and an admin account.

Deliberately not built yet — design these before extending:

- **No payments.** Bookings are confirmed by the reservations desk; nothing is charged online.
- **No password reset.** An address can be confirmed but a forgotten password cannot be recovered.
- H2 in-memory with `ddl-auto: update` — data is lost on restart. Move to a real database with
  Flyway/Liquibase migrations before storing anything that matters.
- Room content is seeded in `DataSeeder` and site copy is a TypeScript file. No CMS.
- No CI and no deployment config.

## Dev-only defaults that must be changed before deploying

These are convenient locally and dangerous in production. `README.md` has the full checklist.

- `app.mail.expose-verification-link` defaults to **true** — it returns the confirmation link in the
  API response so the flow can be finished without a mail server.
- `DataSeeder` creates an admin account with a known password.
- `app.jwt.secret` has a built-in development value. The app logs a warning for both.

## Content placeholders

Phone numbers, email addresses, distances, the map pin and every testimonial are placeholders,
flagged in a comment at the top of `frontend/src/content/resort.ts`. Photography is a generated
fallback panel everywhere except the one supplied photograph.
