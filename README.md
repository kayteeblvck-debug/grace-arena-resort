# Grace Arena Resorts

Website for Grace Arena Resorts — a hospitality and event destination in Onimangoro, Igbo-Ora,
Ibarapa Central, Oyo State, Nigeria.

A Java (Spring Boot) REST backend and a React (Vite + TypeScript) frontend in one repository. The
site is informational (rooms, experiences, events, gallery, story, contact) and transactional:
visitors create an account, confirm their email, check real availability and reserve a suite, then
sign in to see and cancel their stays.

## What works today

- **Public site** — home, accommodation, room detail, experiences, events, gallery, our story,
  contact. All copy lives in `frontend/src/content/resort.ts`.
- **Accounts** — registration, SMTP email confirmation, sign-in, resend-confirmation. An
  unconfirmed account cannot sign in.
- **Availability** — a date/guest search that returns every room type priced for the stay, with
  how many units are left and, when a room is not offered, why.
- **Bookings** — reserve a suite, see your stays, cancel before arrival. Overlapping bookings are
  refused once a room type is sold out for those dates.
- **Enquiries** — a contact/events form that stores the enquiry and emails both the sender and the
  resort.
- **Reservations desk** — an admin-only view of every booking and enquiry, with status changes.

## Layout

```
grace-arena-resort/
├── backend/            Spring Boot 3.5 REST API (Java 21, Gradle)
│   └── src/main/java/com/gracearena/resort/
│       ├── common/       ApiResponse envelope, exceptions, global error handler, health
│       ├── config/       CORS, mail transport selection, dev data seeder
│       ├── security/     JWT issue/parse, bearer filter, authorisation rules
│       ├── user/         User, roles, confirmation tokens, auth service + controller
│       ├── email/        Message composition and the SMTP / logging transports
│       ├── room/         Room types, gallery, amenities
│       ├── booking/      Bookings, overlap queries, cancellation
│       ├── availability/ Date-range search across every room type
│       └── enquiry/      Event and general enquiries
└── frontend/           React 19 + TypeScript + Vite
    └── src/
        ├── api/         Typed fetch client, bearer token handling, shared types
        ├── auth/        AuthProvider, context, useAuth
        ├── components/  Layout, Logo, ResortImage, forms, cards, lightbox
        ├── content/     All standing site copy
        ├── lib/         Formatting helpers, useApiResource hook
        ├── pages/       One file per route
        └── styles/      tokens / base / layout / components / pages
```

## Requirements

- Java 21 (`java -version`)
- Node 20+ (`node -v`)

Gradle comes with the wrapper — no separate install needed.

## Running it

```bash
./scripts/dev.sh                  # both servers
```

Or in two terminals:

```bash
cd backend  && ./gradlew bootRun  # API on http://localhost:8080/api
cd frontend && npm install && npm run dev   # site on http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend, so there is no CORS
setup needed in development.

### Trying the booking flow locally

No mail server is configured out of the box, so:

1. Create an account. The confirmation link is **printed to the backend log**, and — because
   `app.mail.expose-verification-link` defaults to `true` in development — also shown on screen with
   a "Confirm my email now" button.
2. Confirm, and you are signed in.
3. Search dates, choose a suite, and book. The booking appears under **My account**.

A seeded admin account gives access to `/reservations-desk`:

```
admin@gracearenaresort.com  /  GraceArena!2026
```

Both of those are development conveniences. See **Before deploying** below.

## API

Base path: `http://localhost:8080/api`. Every response uses the same envelope:

```json
{ "success": true, "message": "OK", "data": {} }
```

Errors return the same shape with `success: false` and a `message`, mapped by
`GlobalExceptionHandler`.

| Method | Path                                | Auth  | Description                                  |
| ------ | ----------------------------------- | ----- | -------------------------------------------- |
| GET    | `/v1/health`                        | —     | Liveness check                               |
| GET    | `/v1/rooms?availableOnly=`          | —     | Room catalogue                               |
| GET    | `/v1/rooms/{slug}`                  | —     | One room, with gallery and amenities         |
| GET    | `/v1/availability?checkIn&checkOut&guests` | — | What is free over a date range, priced   |
| POST   | `/v1/auth/register`                 | —     | Create an account, send a confirmation link  |
| POST   | `/v1/auth/verify`                   | —     | Confirm an address; returns a bearer token   |
| POST   | `/v1/auth/resend-verification`      | —     | Send a fresh link                            |
| POST   | `/v1/auth/login`                    | —     | Sign in; 403 if the address is unconfirmed   |
| GET    | `/v1/auth/me`                       | Guest | The signed-in account                        |
| POST   | `/v1/bookings`                      | Guest | Reserve a suite                              |
| GET    | `/v1/bookings/me`                   | Guest | The caller's own stays                       |
| GET    | `/v1/bookings/{reference}`          | Guest | One booking — own only, unless admin         |
| POST   | `/v1/bookings/{reference}/cancel`   | Guest | Cancel before arrival                        |
| GET    | `/v1/bookings`                      | Admin | Every booking                                |
| PATCH  | `/v1/bookings/{reference}/status`   | Admin | Move a booking through its lifecycle         |
| POST   | `/v1/enquiries`                     | —     | Contact / events form                        |
| GET    | `/v1/enquiries`                     | Admin | Every enquiry                                |
| PATCH  | `/v1/enquiries/{reference}/status`  | Admin | Triage an enquiry                            |

Authentication is a bearer token: `Authorization: Bearer <jwt>`, issued on sign-in and on email
confirmation, valid for seven days by default.

### How availability is decided

A room is a *type* with `totalUnits` identical rooms. Two stays overlap when each starts before the
other ends — check-out day is not counted, so a booking ending on the 10th does not block one
starting on the 10th. A booking is refused once the number of overlapping, non-cancelled bookings
reaches `totalUnits`. The room row is locked for the transaction first, so two simultaneous requests
for the last unit cannot both succeed.

## Email

Spring Boot only builds a mail sender when `spring.mail.host` is set. Without it the app uses
`LoggingEmailSender`, which prints each message to the log — that is the development default.

To send for real:

```bash
export SPRING_MAIL_HOST=smtp.zoho.com
export SPRING_MAIL_USERNAME=no-reply@gracearenaresort.com
export SPRING_MAIL_PASSWORD=...
export APP_MAIL_FROM=no-reply@gracearenaresort.com
export APP_MAIL_RESERVATIONS=reservations@gracearenaresort.com
export APP_EXPOSE_VERIFICATION_LINK=false
```

Messages sent: email confirmation, welcome, booking received (to the guest and to the reservations
desk), enquiry acknowledgement and enquiry notification.

## Configuration

| Variable                        | Default                        | Notes                                    |
| ------------------------------- | ------------------------------ | ---------------------------------------- |
| `APP_FRONTEND_URL`              | `http://localhost:5173`        | Used to build links inside emails        |
| `APP_CORS_ALLOWED_ORIGINS`      | `http://localhost:5173`        | Comma separated                          |
| `APP_JWT_SECRET`                | a dev-only string              | **Must** be replaced; ≥32 characters     |
| `APP_JWT_EXPIRATION_MS`         | `604800000` (7 days)           |                                          |
| `APP_EXPOSE_VERIFICATION_LINK`  | `true`                         | **Set to `false` outside development**   |
| `APP_VERIFICATION_TTL_HOURS`    | `24`                           | Confirmation link lifetime               |
| `SPRING_MAIL_*`                 | unset                          | Unset means "log, do not send"           |
| `app.seed.demo-accounts`        | `true`                         | Set `false` to skip the seeded admin     |
| `APP_SEED_ADMIN_PASSWORD`       | `GraceArena!2026`              | Change before any persistent database    |

The frontend takes `VITE_API_BASE_URL` for deployed builds; see `frontend/.env.example`.

## Database

Development uses an in-memory H2 database, recreated on every restart and seeded by `DataSeeder`
with six room types and an admin account. The H2 console is at
http://localhost:8080/api/h2-console (JDBC URL `jdbc:h2:mem:grace_arena`, user `sa`, no password).

Swapping in PostgreSQL means changing the `runtimeOnly` driver in `backend/build.gradle` and the
`spring.datasource` block in `application.yaml`. Move off `ddl-auto: update` to Flyway or Liquibase
before there is real data to protect.

## Checks

```bash
cd backend  && ./gradlew build   # compiles + runs 36 tests
cd frontend && npm run build     # type-checks + production build
cd frontend && npm run lint
```

The backend tests cover the whole account flow, the booking overlap rule, cancellation releasing a
room, per-guest booking isolation, and the admin-only endpoints.

## Content and imagery — what still needs replacing

The writing is real and usable, but these are placeholders the resort has to confirm. They are all
in one place, flagged at the top of `frontend/src/content/resort.ts`:

- Telephone numbers, email addresses and the WhatsApp line
- Driving times and distances (approximate — check against a real route)
- The map pin (currently the Igbo-Ora town centre, not the resort itself)
- Every testimonial — written as examples, not real guests
- Room rates, unit counts and descriptions in `DataSeeder`
- **All photography.** The one real photograph supplied is used for the hero and the story page.
  Everywhere else, `ResortImage` falls back to a generated on-brand panel captioned "photography to
  follow". Dropping real files into `frontend/public/images/` at the paths already referenced needs
  no code change at all.

The logo has been redrawn as SVG in `frontend/src/components/Logo.tsx` so it stays crisp and can
invert onto the dark header. The original supplied artwork is kept at
`frontend/public/images/brand/logo-original.jpg` — swap in the real vector when there is one.

## Before deploying

- [ ] Set `APP_JWT_SECRET` to a long random value
- [ ] Set `APP_EXPOSE_VERIFICATION_LINK=false`
- [ ] Set `app.seed.demo-accounts=false`, or change the seeded admin password
- [ ] Configure SMTP
- [ ] Move to a persistent database with migrations
- [ ] Add production origins to `APP_CORS_ALLOWED_ORIGINS`
- [ ] Serve over HTTPS — the bearer token is held in `localStorage`

## Not built yet

- Payments. Bookings are confirmed by the reservations desk; nothing is charged online.
- Password reset. Guests can confirm an address but cannot yet recover a forgotten password.
- Editing a booking's dates (cancel and rebook instead).
- A CMS. Room content is seeded in code and site copy is a TypeScript file.
- CI, deployment config, and analytics.
