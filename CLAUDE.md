# Grace Arena Resort — working notes

Website for Grace Arena Resort. Monorepo: Spring Boot REST API in `backend/`, React SPA in
`frontend/`. See `README.md` for the full layout, endpoint table and run instructions.

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

- Package by feature, not by layer: `room/`, `booking/`. A feature owns its entity, repository,
  service, controller and DTOs. Add new features as sibling packages, not as new layer folders.
- Every endpoint returns `ApiResponse<T>` (`success` / `message` / `data`). Errors go through
  `GlobalExceptionHandler` — throw `ResourceNotFoundException` or `BadRequestException` from
  services rather than returning error responses by hand.
- Request DTOs are records with Jakarta validation annotations; controllers use `@Valid`.
- Entities use Lombok (`@Getter/@Setter/@Builder`). Responses are plain records with a `from(...)`
  factory or built in the service.
- Services are `@Transactional(readOnly = true)` at the class level, with `@Transactional` on the
  write methods.
- Controllers are versioned: `/v1/...` under the `/api` context path.

**Frontend**

- All network calls go through `src/api/client.ts` — do not call `fetch` from components. Add a
  method to the `api` object and a type to `src/api/types.ts`.
- `useApiResource(key, fetcher)` handles loading/error/cancellation for reads. The `key` string
  identifies the request; changing it re-fetches.
- Plain CSS in `src/index.css` using the CSS variables at the top. No CSS framework is installed.
- Routes are declared in `src/App.tsx`; pages live in `src/pages/`.

## Current state

Working end to end: room listing/detail and booking creation, backed by an in-memory H2 database
seeded with four placeholder rooms.

Deliberately not built yet — design these before extending:

- **Availability is not enforced.** `BookingService.create` checks the room's `available` flag and
  capacity, but never checks whether the dates overlap an existing booking. Any real booking flow
  needs this first.
- No auth, no admin area, no authorization anywhere.
- No payments, no email or SMS confirmation.
- H2 in-memory with `ddl-auto: update` — data is lost on restart. Move to a real database with
  Flyway/Liquibase migrations before storing anything that matters.
- Images are placehold.co URLs; copy is filler.
- No CI and no deployment config.
