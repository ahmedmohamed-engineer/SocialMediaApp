# SocialMediaApp — TypeScript Backend Training Project

> **Educational / training project.** This is a learning-focused REST API backend built as part of a coding course. It is **not** a production social network and is not deployed.

A layered **TypeScript + Express + PostgreSQL** backend that exposes RESTful CRUD endpoints for users, posts, comments, and likes/dislikes/saves actions.

## Overview

This project practices a clean layered architecture for a small social-style API:

- **Controllers** — parse the request and validate basic inputs
- **Repositories** — execute parameterized raw SQL against PostgreSQL
- **Models** — typed domain objects returned to callers
- **Views** — simple HTML/JSON rendering for the user endpoints
- **Database service** — a connection-pool singleton that also creates the tables on startup

The data model covers four entities: `Users`, `Posts`, `Comments`, and `Actions` (like / dislike / save). Actions can target either a post or a comment, enforced by a database check constraint.

> **Note:** this repository is the evolved version of the same training project lineage as the earlier `ProjectSmart` snapshot. It is treated here as the canonical copy — more endpoints (comments, actions) and richer seed scripts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5 (strict mode) |
| Runtime | Node.js (ES2020 target, CommonJS) |
| Web framework | Express 5 |
| Database | PostgreSQL |
| Database driver | `pg` (raw SQL, parameterized queries) |
| Development | `ts-node`, `nodemon`, `tsc` |

## Project Structure

```
SocialMediaApp/
├── data/
│   └── students.json              # Course data file (not used at runtime)
├── src/
│   ├── Server.ts                  # Express app + route registration
│   ├── main.ts                    # Entry point — starts the server on port 3004
│   ├── controllers/               # Request handling + basic validation
│   │   ├── UserController.ts
│   │   ├── PostController.ts
│   │   ├── CommentController.ts
│   │   └── ActionController.ts
│   ├── repositories/              # Database access (parameterized raw SQL)
│   │   ├── UserRepository.ts
│   │   ├── PostRepository.ts
│   │   ├── CommentRepository.ts
│   │   └── ActionRepository.ts
│   ├── models/                    # Typed domain models
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   ├── Comment.ts
│   │   └── UserAction.ts
│   ├── views/
│   │   └── UserView.ts            # HTML / JSON rendering for user endpoints
│   ├── services/
│   │   └── DatabaseService.ts     # pg Pool singleton + table initialization
│   └── scripts/
│       ├── populateDummyData.ts   # Insert dummy users/posts
│       ├── resetAndSeed.ts        # Truncate all data, recreate, reseed
│       └── seedDatabase.ts        # Upsert users + seed posts/comments/actions
├── .devContainer/                 # Dev container + PostgreSQL 16 compose setup
└── package.json
```

## Requirements

- Node.js (with npm)
- TypeScript
- A running PostgreSQL server (local, Docker, or the provided dev container)

## Environment Variables

Configuration is read from environment variables (defaults shown are the code defaults, **not** production credentials):

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_USER` | `user` | PostgreSQL user (matches dev container defaults) |
| `DB_PASSWORD` | `password` | PostgreSQL password (dev container default) |
| `DB_NAME` | `mydb` | Database name |
| `DB_PORT` | `5432` | PostgreSQL port |

Create a `.env` file (or export them in your shell) before running. The `.env` file is git-ignored.

## Database Setup

Tables are created automatically on first startup by `DatabaseService` (`CREATE TABLE IF NOT EXISTS`), so no manual migration step is required. The schema includes:

- **Users** — `id`, `name`, `email` (unique), `age`, `description`, `image`
- **Posts** — `id`, `title`, `content`, `type` (`text` | `video`), `UserId` (FK)
- **Comments** — `id`, `content`, `UserId` (FK), `PostId` (FK)
- **Actions** — `id`, `type` (`like` | `dislike` | `save`), `UserId` (FK), and exactly one of `PostId` / `CommentId` (FK), enforced by a `CHECK` constraint

Related indexes on `name`, `UserId`, `PostId`, and action `type` are also created.

### Seeding sample data

```bash
npm run resetAndSeed   # clears all rows, recreates tables, inserts sample data
npm run populate-db    # inserts another set of dummy users and posts
```

## Installation & Running

```bash
npm install
npm run build          # compiles TypeScript to ./dist
npm run dev            # tsc && node dist/main.js (or use watch)
```

The server starts on **port 3004**: `http://localhost:3004`.

## Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/main.js` | Start the compiled server |
| `dev` | `tsc && node dist/main.js` | Build & start |
| `watch` | `tsc --watch` | Type-check in watch mode |
| `populate-db` | `ts-node src/scripts/populateDummyData.ts` | Insert dummy data |
| `resetAndSeed` | `ts-node src/scripts/resetAndSeed.ts` | Reset & seed the database |

## API

All endpoints below were discovered directly from `src/Server.ts` and the controllers. There is **no authentication** — every route is public.

### Users

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users` | List all users (HTML list by default, or JSON with `?format=json`) |
| GET | `/users/:id` | Get one user (`?show_posts=true` includes their posts; `?format=json` returns JSON) |
| GET | `/users/:userId/posts` | Posts by a user |
| GET | `/users/:userId/comments` | Comments by a user |
| GET | `/users/:userId/actions` | Actions by a user |
| POST | `/users` | Create user — body: `name`, `email` (required); `age`, `description`, `image` (optional). Returns `409` if the email is already taken |
| PATCH | `/users/:id` | Update a user — body: `name`, `email`, `age`, `description`, `image` |
| DELETE | `/users/:id` | Delete a user (`204` on success) |

### Posts

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/posts` | List all posts |
| GET | `/posts/search?title=<term>` | Search posts by title (case-insensitive partial match) |
| GET | `/posts/:id` | Get one post |
| GET | `/posts/:postId/comments` | Comments for a post |
| GET | `/posts/:postId/actions` | Actions for a post |
| POST | `/posts` | Create post — body: `title`, `UserId`, `content`, `type` (`text` or `video`). Returns `400` for missing/invalid fields |
| PATCH | `/posts/:id` | Update post — body: `title`, `UserId`, `content`, `type` |
| DELETE | `/posts/:id` | Delete a post (`204` on success) |

### Comments

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/comments` | List all comments |
| GET | `/comments/:id` | Get one comment |
| GET | `/comments/:commentId/actions` | Actions for a comment |
| POST | `/comments` | Create comment — body: `content`, `UserId`, `PostId` (all required) |
| PATCH | `/comments/:id` | Update comment — body: `content`, `UserId`, `PostId` |
| DELETE | `/comments/:id` | Delete a comment (`204` on success) |

### Actions

An action (like / dislike / save) must target **either** a post or a comment, never both.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/actions` | List all actions |
| GET | `/actions/:id` | Get one action |
| POST | `/actions` | Create action — body: `type` (`like`, `dislike`, or `save`), `UserId`, and exactly one of `PostId` or `CommentId` |
| PATCH | `/actions/:id` | Update an action — same body rules as create |
| DELETE | `/actions/:id` | Delete an action (`204` on success) |

## Limitations

- **No authentication or authorization** — any client can create, update, or delete any record via the public API.
- **No frontend application** — only the `UserView` renders simple HTML for the user listing/detail endpoints; everything else returns JSON.
- **No automated tests.**
- **No deployment** — this runs locally only.
- **No migration framework** — tables are created at startup; schema changes require manual SQL or updates to `DatabaseService`.
- Basic request validation lives in the controllers; there is no separate validation layer (e.g. Zod) or rate limiting.

## Learning Goals

The project exercises:

- Layered backend architecture (controller → repository → model)
- Raw, parameterized SQL against PostgreSQL (safe from SQL injection)
- Singleton database connection management (`pg.Pool`)
- Basic REST CRUD design with correct HTTP status codes
- TypeScript classes, strict mode, and typed models

## Related Repository

`ProjectSmart` is the earlier snapshot of this same training project. This repository (`SocialMediaApp`) is the continued, feature-complete version and should be treated as the canonical one.