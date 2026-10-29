# Current status

Updated **29 October 2026**. The reviewed baseline is `f50ff4fba09999bb8799ca8c8887e688c7f9d561`; the documentation milestone is merged in [PR1](https://github.com/Rhigo/Polaris/pull/1). [PR2](https://github.com/Rhigo/Polaris/pull/2) merged the foundation repairs at `c92852e`; a named checkpoint branch preserves that revision. This page supersedes the historical completion percentages.

“Implemented” means code and UI exist. It does not imply every provider integration has passed a live account test. No paid model requests were made during this baseline review.

| Area | Current implementation | Remaining work |
| --- | --- | --- |
| Multi-provider chat | OpenAI Responses, Anthropic and Ollama adapters; streaming and tool events | Reviewed OpenAI capability registry and pinned SDK added; provider breadth, broader fee coverage and account-specific native-tool tests remain |
| Projects and files | Projects, instructions, uploads, extraction and OpenAI vector-store integration | Ownership guards added in foundation; lifecycle cleanup and provider-neutral retrieval remain |
| Artifacts | Generated files, HTML/code previews and downloads | Mobile workflow, isolation, versions and deterministic regression coverage |
| Personalisation | User settings, memories, custom models, skills and functions | Memory controls, assistant packaging and traceability |
| Voice | Dictation, read-aloud and a WebRTC realtime panel with a browser tool bridge | Transcript validation/retry identity and call lifecycle guards added; shared policy, durable tool outcomes, reconnect and usage remain |
| Administration | Providers, models, users/groups, features, usage and Microsoft Entra configuration | Current-account authorization and serialized user mutations added; mobile usability and live SSO verification remain |
| Mobile | Responsive chat shell, drawer and composer | Full mobile product testing, settings/admin redesign and installable PWA |
| Extensibility | Webhook/OpenAI functions and basic MCP calls | Negotiated MCP discovery, credential vault, pipeline execution and editor |
| Background assistants | Saved bounded text tasks, separate local worker, fenced claims, persisted activity/results and cancellation | Multi-step runs, schedules, action outcomes, approval flows, spend budgets and computer control |
| Public API | Scoped expiring keys, rotation/revocation, rate limits, model/profile reads and OpenAPI contract | Streaming chat, per-user/spend budgets, usage dashboard and broader SDK coverage |
| Connected accounts | Microsoft sign-in configuration | Mail/calendar/Teams, Telegram, Discord, WhatsApp, iCloud and Google connectors |
| Cloud workspaces | Local sandbox service and provider-native tools | Per-run cloud compute, browser sessions, cleanup and billing controls |

## Verified baseline

- All **22 existing unit tests** passed, as did TypeScript checking and a production build.
- Journalled migrations succeeded against a fresh, isolated PostgreSQL database. Seeding worked using the corrected Node loader described in [development setup](./development).
- Chromium exercised login, a seeded conversation, projects and administration. The 390px chat view had no page-wide horizontal overflow. No page exceptions were observed on those paths.
- Five screenshots capture actual app screens with synthetic accounts and content. These are baseline screenshots, not redesign mockups.
- Targeted local negative tests exposed access and input-validation defects. These are tracked at the start of M1; detailed evidence stays in the repository's private review notes.

## Foundation verification

The current foundation branch passes 42 unit tests, TypeScript checking, a production build and 14 authenticated HTTP test records. Tests cover current roles/disablement/deletion, concurrent admin mutations, cross-user context, malformed realtime input and simultaneous transcript retries. Database lifecycle tests cover fresh setup, upgrade, repeated/concurrent initialization, preserved accounts/configuration, readiness failures and forced initializer termination with rollback.

The sandbox has 27 passing host-safe tests; 6 execution cases are reserved for restricted Linux containers. Its resource/artifact hardening is implemented, but shared process identity and filesystem access still prevent a claim of tenant isolation.

The Pal/interface milestone has saved appearance controls, shared light/dark tokens, responsive navigation, mobile Settings and consistent chat/Projects/admin surfaces. Its application source matches the production QA build: 48 unit tests passed, with two live suites deliberately skipped; 390/768/1440 Chrome checks covered focus restoration, appearance reloads and composer limits. Its computer surfaces remain disconnected. The later saved-text-task slice provides persisted work; browser control, terminal and file execution remain planned. See [Pal](./pal) and [runtime decision](./pal-runtime).

Two minimal live OpenAI contract checks succeeded: a bounded GPT-6 Luna Responses request and a synthetic Decisions predicate. Model-list access also confirmed current voice/image identifiers. This does not validate full chat, voice, image or managed-agent integration.

## Not yet verified

The Mac review used Node 24.19.0 and an isolated PostgreSQL 18 test instance. The CI matrix passed at `c2924c1` on Node 22/24 and PostgreSQL 16, including standalone Compose/HTTPS and restricted Linux sandbox checks. Subsequent changes must pass their own exact-head checks. Docker was unavailable locally. Full provider streaming, microphone calls, native OCR/canvas builds, per-run sandbox isolation and third-party account flows remain unverified. Synthetic SSO-linked JWT tests exercise current-account authorization; they do not substitute for a real Entra sign-in. Re-enabling an account permits an otherwise valid unexpired JWT to work again; per-device token revocation is separate future work.

## First release gate

Before broadening access or enabling unattended external actions, finish installation/readiness, session revocation, ownership checks, realtime validation and sandbox isolation. The [milestones](./roadmap) make those dependencies explicit.

## Artifact preview boundary

Generated HTML now runs inside a restricted nested frame, including when opened in a new tab. Raw Markdown is sanitized, active downloads are normalized and forced to attachment, and PDF previews verify response MIME/signature before creating a Blob. Unit and real-browser checks cover storage/origin isolation, blocked network/frames/forms, source-checked messages and working SVG/canvas charts. Native browser policy blocked observing one actual application Blob popup; that precise limitation is recorded in [artifact security](./artifacts-security).

## API and recovery verification

The recovery milestone passed Node 22/24 with PostgreSQL 16, including restoration through the Compose service. API key implementation passes 14 HTTP tests and desktop/mobile browser checks; its final GitHub gates are tracked in the pull request. Recovery fixtures also verify key hashes, scopes, revocation state, rate buckets and lifecycle records under migration 0007. See [Developer API](./api) and [recovery](./recovery) for the precise supported scope.

## Audio integration

Current OpenAI dictation, read-aloud and Realtime adapters now have bounded lifecycle handling and production standalone HTTP/WebSocket coverage. Tests use a trusted local TLS provider fixture and synthetic audio; they do not claim physical microphone or live-provider validation. See [Voice and audio](./voice) for limitations, including unfinished temporary voice, context parity and metering.

## Saved text tasks and token estimates

Pal now has a bounded saved-text workflow: one model request, current owner/account/model checks, a separate worker, fenced leases, ordered saved events, cancellation and partial/completed results after reload. Interrupted claims are reconciled without automatic replay. The CLI must run from the matching source release; the web-only image does not start or package it. Browser/terminal/files, actions, schedules and dollar budgets remain outside this workflow. See [saved text tasks](./pal-tasks).

Usage accounting keeps missing usage and unverified prices null, stores a dated cost basis, and separates known subtotals from unpriced requests. Migration `0009` preserves historical amounts without inventing provenance. Reviewed token estimates exclude audio, images, tools and other charges; they are not a bill or spend cap. See [token usage estimates](./token-accounting). AI-05 and RUN-01/03/04 remain in progress because their broader acceptance criteria are not complete.
