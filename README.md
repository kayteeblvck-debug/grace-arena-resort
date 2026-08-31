# Grace Arena Resort

Website for Grace Arena Resort — a Java (Spring Boot) REST backend and a React (Vite + TypeScript)
frontend in one repository.

This is a starting scaffold. It runs end to end today with a small rooms + bookings slice; the real
site content and business rules are still to be built on top of it.

## Layout

```
grace-arena-resort/
├── backend/            Spring Boot 3.5 REST API (Java 21, Gradle)
│   └── src/main/java/com/gracearena/resort/
│       ├── common/     ApiResponse envelope, exceptions, global error handler, health endpoint
│       ├── config/     CORS config, dev data seeder
│       ├── room/       Room entity, repository, service, controller, DTO
│       └── booking/    Booking entity, repository, service, controller, DTOs
├── frontend/           React 19 + TypeScript + Vite
│   └── src/
│       ├── api/        Typed fetch client and shared API types
│       ├── components/ Layout shell, RoomCard
│       ├── lib/        Formatting helpers, useApiResource hook
│       └── pages/      Home, Rooms, Room detail, Booking, 404
└── scripts/dev.sh      Runs both servers together
```

## Requirements

- Java 21 (`java -version`)
- Node 20+ (`node -v`)

Gradle comes with the wrapper — no separate install needed.

## Running it

Both at once:

```bash
./scripts/dev.sh
```

Or in two terminals:

```bash
# terminal 1 — API on http://localhost:8080/api
cd backend && ./gradlew bootRun

# terminal 2 — site on http://localhost:5173
cd frontend && npm install && npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` to the backend, so there is no CORS
setup needed in development.

## API

Base path: `http://localhost:8080/api`

| Method | Path                       | Description                              |
| ------ | -------------------------- | ---------------------------------------- |
| GET    | `/v1/health`               | Liveness check                           |
| GET    | `/v1/rooms?availableOnly=` | List rooms, optionally available ones    |
| GET    | `/v1/rooms/{slug}`         | Single room by slug                      |
| POST   | `/v1/bookings`             | Create a booking request                 |
| GET    | `/v1/bookings`             | List bookings, newest first              |
| GET    | `/v1/bookings/{reference}` | Single booking by reference (`GAR-XXXX`) |

Every response uses the same envelope:

```json
{ "success": true, "message": "OK", "data": { } }
```

Errors return the same shape with `success: false` and a `message`, mapped by
`GlobalExceptionHandler`.

## Database

Development uses an in-memory H2 database, recreated on every restart and seeded with four
placeholder rooms by `RoomSeeder`. The H2 console is at http://localhost:8080/api/h2-console
(JDBC URL `jdbc:h2:mem:grace_arena`, user `sa`, no password).

Swapping in PostgreSQL or MySQL means changing the `runtimeOnly` driver in `backend/build.gradle`
and the `spring.datasource` block in `backend/src/main/resources/application.yaml`. Move off
`ddl-auto: update` to Flyway or Liquibase before there is real data to protect.

## Checks

```bash
cd backend  && ./gradlew build   # compiles + runs tests
cd frontend && npm run build     # type-checks + production build
cd frontend && npm run lint
```

## Not built yet

Deliberately left out of the scaffold — these are the next things to design:

- Authentication, an admin area, and any authorization
- Real availability logic (bookings never check for date overlaps yet)
- Payments, email/SMS confirmations
- A persistent database and migrations
- Real imagery, copy, and brand design
- Deployment and CI
