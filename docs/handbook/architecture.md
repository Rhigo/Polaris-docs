# Architecture

## What runs today

Polaris is a pnpm workspace. `apps/web` combines the Next.js 15 / React 19 interface, authenticated API routes, provider adapters and chat orchestration. PostgreSQL stores users, conversations, messages, projects, files, configuration, memory and usage through Drizzle. Nginx fronts the app. A Python/FastAPI service executes code; optional Compose services include Ollama and SearXNG. Redis is configured but durable job processing is not implemented.

```text
Browser ── HTTPS / SSE ── Next.js UI + API
                             │
                Auth + model/tool policy
                             │
                    Chat orchestration
                   /         │          \
          PostgreSQL     AI providers   Local tools
             │                 │             │
       Messages/files    Native tools     Sandbox
```

Chat selects the effective base or virtual model, resolves allowed custom functions, builds history/project/file context, streams a provider response, invokes tools and persists messages and usage. Artifacts are materialised for preview/download. Realtime currently uses a separate WebRTC setup and tool bridge; unifying its context and permissions is part of M3.

## Source map

| Path | Responsibility |
| --- | --- |
| `apps/web/app/(app)` | Chat, projects, settings and administration screens |
| `apps/web/app/api` | Authenticated internal HTTP routes |
| `apps/web/auth.ts` | Credentials and Microsoft Entra authentication |
| `apps/web/db/schema.ts` | Persistent model and relationships |
| `apps/web/db/migrations/meta/_journal.json` | Applied migration sequence |
| `apps/web/lib/orchestration/engine.ts` | Context assembly, provider loop, tool execution and persistence |
| `apps/web/lib/providers` | Provider adapters, capability heuristics and estimated costs |
| `apps/web/lib/functions/runtime.ts` | OpenAI/webhook/MCP function execution |
| `apps/web/components/chat` | Chat, composer, voice, artifacts and navigation |
| `services/sandbox` | Python execution boundary |
| `docker-compose.yml`, `nginx`, `scripts/install.sh` | Deployment services and bootstrap |

## Proposed evolution

Keep the working application and extract narrow services behind tested interfaces. A wholesale rewrite would make the existing file/tool behaviour harder to preserve.

1. **Principal and policy service:** current user status, group/model access, project ownership and effective tool permissions. Used by chat, voice, API keys and background runs.
2. **Context service:** normalised messages, files, project instructions, memory, token budgets, compaction and provider state. Keep retention/deletion policy explicit.
3. **Provider registry:** versioned capabilities and contract adapters. Account model discovery does not by itself prove support for every parameter or tool.
4. **Run service:** durable state, event cursor, checkpoints, leases, cancellation and usage reservations. The web process renders/subscribes; a separate worker executes.
5. **Tool gateway:** typed input/output, credential references, approvals, retry/idempotency and audit records. Pipelines and connectors share it.
6. **Execution adapters:** local isolated jobs, managed agent environments and cloud browsers behind resource and ownership boundaries.

Proposed records include `api_keys`, `runs`, `run_events`, `run_checkpoints`, `schedules`, `approvals`, `credential_refs`, `connections`, `sync_cursors`, `pipeline_versions`, `execution_sessions` and `usage_reservations`. These are design targets, not existing tables. Add them using additive, reviewed migrations with upgrade fixtures.

For background side effects, an outbox and idempotency keys are essential: a queue retry must not send another email or create another calendar event. A run should move through queued → running → waiting/needs input → succeeded/failed/cancelled, retaining enough evidence to resume or explain failure.
