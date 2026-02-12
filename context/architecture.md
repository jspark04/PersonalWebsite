# Technical Architecture

## 1. System Overview
-   **Type**: Server-side Rendered (SSR) Web Application.
-   **Core Technologies**: Astro (Node.js Adapter), Tailwind CSS, TypeScript, PostgreSQL.
-   **Infrastructure**: Application via Docker (Synology NAS); Database via Neon (Serverless).

## 2. Component Diagram
-   **[Astro Runtime]**: RESPONSIBILITY: Handles routing, SSR, and API endpoints. INTERACTS WITH: PostgreSQL, GitHub API.
-   **[PostgreSQL (Neon)]**: RESPONSIBILITY: Persists 'Notes' (title, content, dates, slug, tags). MANAGED SERVICE: Serverless Postgres.
-   **[GitHub Integration]**: RESPONSIBILITY: Fetches repo metadata and READMEs. normalizing relative links.
-   **[Admin Auth]**: RESPONSIBILITY: Simple password check against `ADMIN_PASSWORD` env var; sets HTTP-only cookie.

## 3. Data Flow
-   **Portfolio View**: User Request -> Astro Page -> `github.ts` -> GitHub API -> HTML Response.
-   **Note Creation**: Admin -> Quill Editor -> POST `/api/notes` -> `db.ts` -> Neon (Postgres).
-   **Note Viewing**: User -> GET `/notes/[slug]` -> Astro (SSR) -> Neon (Postgres) -> HTML Response.

## 4. Key Decisions & Trade-offs
-   **Decision**: Use `postgres.js` directly instead of an ORM (Prisma/Drizzle).
    -   **Rationale**: Keep dependencies minimal and "closer to the metal" for simple schema needs.
-   **Decision**: Adoption of Neon (Serverless Postgres).
    -   **Rationale**: Offloads database management, provides branching for dev/test workflows, and scales to zero.
-   **Decision**: Astro SSR instead of Static Export.
    -   **Rationale**: Required for the dynamic Admin features and real-time Note updates without rebuilding.
-   **Decision**: Generic GitHub Token usage.
    -   **Rationale**: `GITHUB_TOKEN` is used to increase rate limits and access own repos via standard API.
-   **Decision**: Use `process.env` (not `import.meta.env`) for runtime secrets (`DATABASE_URL`, `ADMIN_PASSWORD`).
    -   **Rationale**: Astro/Vite inlines `import.meta.env` at build time. In Docker, secrets aren't available during build, so they must be read at runtime via `process.env`.
