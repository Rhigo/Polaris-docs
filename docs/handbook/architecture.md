# Architecture

## What runs today

Polaris is a pnpm workspace. `apps/web` combines the Next.js 15 / React 19 interface, authenticated API routes, provider adapters and chat orchestration. PostgreSQL stores application state through Drizzle. Nginx fronts the app. Separate source workers process saved text tasks, sequential workflows, one-off reminders, optional Inbox sync and the public-browser pilot. Their durable claims and events are in PostgreSQL; Redis is not their recovery source.

```text
Browser ── HTTPS/SSE ── Next.js UI/API ── PostgreSQL
  │                         │                │
  │                   provider adapters   durable workers
  │                         │                │
  │                   model providers    bounded requests
  │
  └─ separate-origin viewer ── manual desktop gateway ── Xfce guest

Tool clients ── external execution broker ── fresh per-run containers
Browser pilot ── separate browser broker ── isolated Chromium
```

These three computer paths have different authority and lifetimes. Per-run code execution cleans temporary workloads. The browser pilot supports a reviewed public research flow. The persistent manual desktop retains its guest profile/files and exposes no agent role. None falls back to the host shell or grants access to personal host folders.

## Normal chat and continuous Pal

Chat resolves the selected model and current owner/group permissions, builds bounded context, streams a provider response, executes permitted tools and persists messages/usage. Temporary chat has a separate stateless retention contract; saved normal chats retain their supported provider continuation.

Migration 0016 adds an owner-unique Pal and conversation plus scoped reactions. First-open locks/rechecks the active account; uniqueness prevents two tabs creating two threads. Normal conversation/search/archive APIs exclude that thread. Its history pages retain microsecond ordering, while model context is limited to 200 recent records. Previous reasoning, tools and provider continuation do not replay as Pal history. Owned attachments still pass hydration/expiry checks.

The reaction tool receives trusted owner/Pal/current-user-message IDs from orchestration. The caller cannot choose an actor or target. Assistant/tool rows retain the user parent, so simultaneous turns, cancellation and reload cannot attach a result to another prompt. User reactions use cookie-authenticated owner routes and require no model request.

## Manual desktop authority

Migration 0017 adds immutable resource policies, per-owner selection and one logical desktop with a retained runtime reservation. A composite Pal/owner foreign key and unique runtime key prevent cross-owner binding. The application record exists independently of the operator VM; materializing it does not allocate hardware.

The web process alone holds the private runtime URL/key. It verifies runtime identity and the fixed profile, records binding intent before dispatch and retains uncertain outcomes. A lost response does not free the slot. A bound runtime cannot be reassigned by clearing application state; account deletion is blocked while a retained reservation exists.

The browser receives a transient 20-second, one-use fragment ticket for a separate origin. The gateway enforces RFB observation/input restrictions, an exclusive writer, boot generation and bounded leases. App renewals recheck the current account. Closing a panel releases only its captured viewer ID, never a newer controller. The UI compares the proxy's exact-origin marker; artifact restrictions and PWA public-only caching remain separate.

The docked/modal shell changes focus behavior with width while preserving one iframe. The desktop's F8 release returns keyboard focus to its own toolbar, then back into the application. There is no autonomous desktop dispatcher, general PTY API, pooled allocator or verified snapshot-restore witness in this slice.

## Source map

| Path | Responsibility |
| --- | --- |
| `apps/web/auth.ts`, `lib/auth` | Current-account and credentials/Entra boundaries |
| `apps/web/lib/orchestration`, `lib/providers` | Context, provider contracts, tools and nullable usage provenance |
| `apps/web/lib/pal/thread`, `components/pal` | Continuous thread, reactions, appearance, activities and desktop UI |
| `apps/web/lib/pal/desktops` | Owner API, retained binding, resource policy and viewer lifecycle |
| `apps/web/lib/pal/runs`, `lib/workflows`, `lib/connectors` | Durable text work, reminders and scoped connection lifecycle |
| `apps/web/db/schema.ts`, `db/migrations/meta/_journal.json` | Reviewed schema and ordered migrations |
| `services/sandbox` | Per-run execution broker, workload and independent cleanup |
| `services/computer` | Separate isolated browser and public research protocol |
| `services/desktop` | Manual Debian/Xfce gateway, RFB authority and reversible appearance |
| `docker-compose.yml`, `nginx`, `scripts/install.sh` | App deployment, exact viewer policy and bootstrap |

## Next boundaries

Chat-to-desktop file transfer, durable multi-step desktop orchestration, approvals, budgets, general recurring responsibilities and pooled admission remain separate work. External writes need idempotency and explicit uncertain-outcome handling; a restarted queue must not replay them blindly. Full DB/disk restore must reconcile identities and authority before either workers or desktops resume.

The ongoing SEC-06 review retains parser resource containment and file/database storage reconciliation as open gates. Upload byte limits alone prove neither. A passing narrow fixture is not a blanket security or multi-tenant certification.
