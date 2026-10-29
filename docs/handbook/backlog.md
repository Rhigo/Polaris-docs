# Feature backlog

Updated 2026-10-29. 102 work items. Generated from `backlog.json`; run `pnpm roadmap:generate` after editing the source.

P1 is required for the relevant release gate; P2 extends the product after its dependencies are proven. Planned features are not advertised as shipped. See [milestones](./roadmap) and [execution protocol](./execution).

## M0

### DOC-01 · Publish the canonical status, audit and execution plan

**P1 · done** · Depends on: —

Acceptance: Current source, historic notes and observed tests are distinguished; findings have evidence and linked work items.

### DOC-02 · Build the documentation hub and refresh README

**P1 · done** · Depends on: DOC-01

Acceptance: Pages build passes, local search works, desktop/mobile layouts are checked and private notes stay outside the published tree.

### DOC-03 · Capture the existing product

**P2 · done** · Depends on: DOC-01

Acceptance: Real desktop/mobile screenshots use synthetic content and record viewport, source revision and limitations.

## M1

### REL-01 · Repair fresh installation and readiness

**P1 · done** · Depends on: DOC-01

Acceptance: On PostgreSQL 16, a clean Compose install applies journal migrations, seeds one admin idempotently and reports unavailable until schema is ready.

### SEC-01 · Revoke stale user and admin sessions

**P1 · done** · Depends on: DOC-01

Acceptance: Existing sessions lose privileges after demotion, disablement or deletion; auth integration tests prove both credentials and SSO behaviour.

### SEC-02 · Enforce ownership consistently

**P1 · done** · Depends on: SEC-01

Acceptance: Two-user tests reject foreign projects, conversations, files and tool contexts on create, move, chat and realtime routes.

### SEC-03 · Validate realtime messages and event identity

**P1 · done** · Depends on: DOC-01

Acceptance: Invalid JSON, roles, IDs and oversized text return 4xx; retries of one provider event produce one persisted message.

### SEC-04 · Bound and isolate code execution

**P1 · in progress** · Depends on: DOC-01

Acceptance: Per-run isolation rejects cross-user files, symlinks, unbounded output and orphan subprocesses in Linux integration tests; no host execution fallback.

### REL-02 · Add database and browser regression CI

**P1 · in progress** · Depends on: REL-01

Acceptance: Clean migration, upgrade fixture, seed rerun, two-user auth and chat smoke tests run against real PostgreSQL 16 in CI.

### REL-03 · Propagate cancellation and handle interrupted streams

**P1 · in progress** · Depends on: REL-02

Acceptance: Stop or disconnect releases upstream work and tool processes; reconnect cannot duplicate committed messages or charges.

### REL-04 · Add backup, restore and migration release gates

**P1 · done** · Depends on: REL-01

Acceptance: A disposable restore recovers users, encrypted settings and artifacts; release notes identify backward compatibility and rollback steps.

### REL-05 · Repair seed runtime and developer commands

**P2 · in progress** · Depends on: DOC-01

Acceptance: Seed runs with supported Node versions and reruns without resetting accounts; lint, typecheck and documented commands have real CI coverage.

### REL-06 · Make logs, errors and health operationally useful

**P2 · in progress** · Depends on: REL-02

Acceptance: Request IDs connect API, provider and worker events; secrets are redacted; health separates liveness from DB/worker readiness.

## M2

### UX-01 · Create the Polaris design system

**P1 · done** · Depends on: REL-02

Acceptance: Typography, spacing, colour, focus, surfaces and icon labels work in both themes; screenshot review covers 390, 768 and 1440px.

### UX-02 · Redesign navigation and the home screen

**P1 · in progress** · Depends on: UX-01

Acceptance: Projects, chats, tasks and connections have clear destinations; keyboard navigation and empty/loading/error states are tested.

### UX-03 · Refine composer and conversation reading

**P1 · in progress** · Depends on: UX-01

Acceptance: Attachments, tool choices, model details, stop/retry, citations and copy controls remain usable at 200% zoom and narrow widths.

### UX-04 · Complete the mobile web interface

**P1 · in progress** · Depends on: UX-02, UX-03

Acceptance: iOS Safari and Android Chrome tests cover virtual keyboard, safe areas, drawers, uploads, long tables, landscape and voice transitions.

### UX-05 · Add an installable PWA

**P2 · planned** · Depends on: UX-04

Acceptance: Manifest, icons and update UX pass install checks; offline screen is honest and authenticated messages are not cached by a generic service worker.

### UX-06 · Add full conversation search and pagination

**P2 · planned** · Depends on: REL-02, UX-02

Acceptance: Search matches message content with owner filtering; large histories load incrementally and maintain scroll position.

### UX-07 · Add edit, branch, regenerate and compare

**P2 · planned** · Depends on: REL-03, UX-03

Acceptance: Branch ancestry preserves original messages and usage; failed or retried generations cannot overwrite siblings.

### UX-08 · Improve settings and administration on mobile

**P2 · in progress** · Depends on: UX-01, UX-04

Acceptance: Provider, model, user/group and usage screens work at 390px with labelled inputs and no page-wide horizontal overflow.

### UX-09 · Improve artifacts and accessible previews

**P2 · planned** · Depends on: UX-03, SEC-04

Acceptance: Preview, source, version history and download work for code, HTML and files; executable previews are isolated and usable on small screens.

### UX-10 · Refresh screenshots and user guides

**P2 · in progress** · Depends on: UX-04, UX-08

Acceptance: Versioned screenshots come from deterministic demo fixtures and show new behaviour without credentials or real conversations.

### PAL-01 · Customise the Polaris Pal companion

**P1 · done** · Depends on: UX-01

Acceptance: Appearance persists per user; shape, colour, eyes and accessories render on mobile and desktop, with keyboard labels and reduced-motion support.

### PAL-02 · Build the Pal home and workspace shell

**P1 · in progress** · Depends on: PAL-01, UX-02

Acceptance: Owned activity, attention and computer surfaces have useful empty states; disconnected tools never pretend to execute tasks; mobile navigation is verified.

## M3

### AI-01 · Create a versioned provider capability registry

**P1 · in progress** · Depends on: REL-02

Acceptance: Model snapshots define modalities, tools, reasoning, limits and parameter support; unknown IDs require explicit configuration instead of guessed support.

### AI-02 · Update SDKs and Responses contracts

**P1 · in progress** · Depends on: AI-01

Acceptance: Recorded streaming fixtures cover text, reasoning summaries, refusal, tool calls, citations, artifacts, cancellation and schema evolution.

### AI-03 · Unify context and retention policy

**P1 · in progress** · Depends on: AI-02

Acceptance: Projects, memory, attachments and tool results use one context builder across chat/voice/jobs; retention and remote deletion are explicitly tested.

### AI-04 · Integrate provider compaction and token budgets

**P1 · planned** · Depends on: AI-03

Acceptance: Long sessions retain required tool pairs and instructions; opaque compaction state is preserved and token estimates do not silently truncate user instructions.

### AI-05 · Track actual usage and model retirement

**P1 · planned** · Depends on: AI-01

Acceptance: Unknown pricing displays unknown; cached/reasoning/audio/tool/container usage is separate; dated price sources and retirement notices drive admin alerts.

### AI-06 · Finish native search, retrieval and structured outputs

**P2 · planned** · Depends on: AI-02, AI-03

Acceptance: Citations open the correct source, retrieval respects owner boundaries and structured results validate against declared schemas.

### AI-07 · Modernise image generation and editing

**P2 · planned** · Depends on: AI-02

Acceptance: Image inputs, masks where supported, variations, partial/final events and artifact download use supported model contracts and explicit usage limits.

### AI-08 · Add long research and document analysis

**P2 · planned** · Depends on: RUN-01, AI-06

Acceptance: Multi-step research resumes after restart, preserves source citations and produces downloadable reports with evidence of tool failures.

### VOICE-01 · Refactor voice into testable session states

**P1 · in progress** · Depends on: REL-02

Acceptance: Connecting, listening, speaking, interrupted, reconnecting and ended states have deterministic event tests and accessible controls.

### VOICE-02 · Share context and tool permissions with voice

**P1 · in progress** · Depends on: VOICE-01, AI-03, SEC-02, SEC-03

Acceptance: Voice receives the selected project/model context and cannot invoke tools outside the same effective policy as text chat.

### VOICE-03 · Handle duplex speech, interruptions and reconnects

**P1 · in progress** · Depends on: VOICE-02

Acceptance: Mock event replay and an opt-in real WebRTC test cover barge-in, echo, mute, route changes, reconnect and transcript ordering.

### VOICE-04 · Evaluate GPT-Live alongside Realtime

**P2 · in progress** · Depends on: VOICE-03, AI-02

Acceptance: An ADR compares latency, delegation, tool controls, model support, retention and duration costs; adapters expose one UI contract.

### VOICE-05 · Add voice metering and audio model migrations

**P1 · in progress** · Depends on: VOICE-03, AI-05

Acceptance: Session duration caps, usage reconciliation and idle shutdown work; deprecated transcription/TTS paths have tested replacements.

### VOICE-06 · Enable optional screen, camera and file context

**P2 · planned** · Depends on: VOICE-02, UX-04

Acceptance: Users explicitly share and stop each source; permissions denied and revoked states work without retaining unintended media.

### AI-09 · Stream accessible charts and tables into chat

**P2 · planned** · Depends on: AI-02, UX-09

Acceptance: Validated chart/table specs update incrementally with source links and export; malicious specs never execute application-origin script and mobile/keyboard fallbacks are tested.

### PAL-10 · Import and generate animated companion assets

**P2 · planned** · Depends on: PAL-01, AI-07

Acceptance: Custom companions have a validated versioned sprite/asset format, bounded uploads, accessible state labels, reduced-motion fallback and ownership; generation/editing is tested with current image APIs.

## M4

### API-01 · Create scoped user API keys

**P1 · done** · Depends on: SEC-01, SEC-02

Acceptance: Keys are random, hashed at rest, revealed once, scoped and expiring; rotate/revoke and owner restrictions pass negative tests.

### API-02 · Ship a versioned API and OpenAPI specification

**P1 · in progress** · Depends on: API-01, AI-02

Acceptance: Models and streaming chat endpoints have schema validation, request IDs and documented error/cancellation semantics; compatibility scope is explicit.

### API-03 · Apply API quotas and audit trails

**P1 · in progress** · Depends on: API-02, AI-05

Acceptance: Per-key/user rate and spend limits are enforced under concurrent requests; logs exclude bearer secrets and sensitive message bodies by default.

### API-04 · Add SDK examples and a key management UI

**P2 · in progress** · Depends on: API-03, UX-08

Acceptance: Copyable curl, Python and TypeScript examples pass against a disposable server; users can see usage and revoke a key.

### EXT-01 · Build a credential vault and connector registry

**P1 · planned** · Depends on: SEC-01, SEC-02

Acceptance: Encrypted credentials are referenced by ID with owner, scope and expiry; rotation and disconnect revoke access without exposing secrets in exports.

### EXT-02 · Implement a versioned pipeline runtime

**P1 · planned** · Depends on: REL-03, EXT-01

Acceptance: Model, tool, transform, branch, bounded parallel, approval and output nodes validate a versioned DAG and emit trace events; cycles and resource overruns fail clearly.

### EXT-03 · Build a visual pipeline editor

**P1 · planned** · Depends on: EXT-02, UX-01

Acceptance: Users can create, validate, dry-run, inspect, version and roll back a workflow; JSON import/export round-trips without credentials.

### EXT-04 · Support OpenWebUI-style extension contracts

**P2 · planned** · Depends on: EXT-02, SEC-04

Acceptance: Documented Pipe/Filter/Action/Event semantics and Valves/UserValves examples pass conformance fixtures; unsupported Python plugins are rejected honestly.

### EXT-05 · Complete MCP protocol support

**P1 · planned** · Depends on: EXT-01, AI-02

Acceptance: Pinned stable protocol, initialize, discovery, schemas, transport/session handling, cancellation and reconnect interoperate with two real test servers.

### EXT-06 · Repair custom functions and add OpenAPI tools

**P1 · planned** · Depends on: EXT-01, AI-02

Acceptance: Model IDs are distinct from response IDs; webhook and OpenAPI inputs/outputs validate, secrets remain server-side and endpoint policy survives DNS redirects.

### EXT-07 · Add a reviewed template and extension library

**P2 · planned** · Depends on: EXT-03, EXT-04, EXT-05

Acceptance: Templates declare version, permissions, credentials, resource needs and tests; install/update/disable has an audit trail.

## M5

### RUN-01 · Create durable runs and a separate worker

**P1 · planned** · Depends on: REL-03, REL-06, AI-03

Acceptance: A run survives web/worker restart with persisted cursor, attempts, leases and checkpoints; duplicate delivery never duplicates external effects.

### RUN-02 · Add schedules and event triggers

**P1 · planned** · Depends on: RUN-01

Acceptance: Timezone, DST, missed schedules, retries and overlapping runs have explicit policy and integration tests; inactive users cannot start work.

### RUN-03 · Build task progress, steering and approvals

**P1 · planned** · Depends on: RUN-01, UX-02

Acceptance: Users can inspect evidence, pause/cancel, add context and approve a concrete external action; stale approvals cannot authorize changed payloads. Rule creation/edit/delete, precedence and distinct run/schedule/proactivity stop scopes are tested.

### RUN-04 · Enforce run budgets and concurrency

**P1 · planned** · Depends on: RUN-01, AI-05

Acceptance: Step, duration, token, tool, container and daily spend ceilings stop work predictably; reservations reconcile on failure.

### RUN-05 · Add persistent assistant identity and memory

**P2 · in progress** · Depends on: RUN-03, AI-03

Acceptance: User-controlled memory provenance, project boundaries, inspect/edit/forget and temporary mode persist consistently across supported channels.

### RUN-06 · Add proactive updates and notifications

**P2 · planned** · Depends on: RUN-02, RUN-03

Acceptance: Quiet hours, opt-in channels, meaningful-change suppression and delivery retries avoid duplicate or noisy updates.

### RUN-07 · Evaluate the managed Agents API

**P1 · planned** · Depends on: RUN-01, EXT-01

Acceptance: A time/cost-bounded spike compares managed and self-hosted execution, data location, retention, artifacts and recovery; documented eligibility gates choose the adapter.

### PAL-03 · Talk to Pal while delegated work continues

**P1 · planned** · Depends on: RUN-01, RUN-03, VOICE-04

Acceptance: A synthetic voice call can inspect, steer and stop a separate durable run without blocking speech or losing task context after a tab reconnect.

### PAL-04 · Build an attention inbox and notification controls

**P1 · planned** · Depends on: RUN-06

Acceptance: Important findings have evidence and deduplicated delivery; urgency, quiet hours, snooze and per-responsibility unsubscribe are tested with synthetic events.

### PAL-05 · Add natural wake, sleep and responsibility controls

**P1 · planned** · Depends on: RUN-02, RUN-04

Acceptance: Saved responsibilities record timezone, sources, permissions, budget and notification rule; stopping a current run and cancelling future occurrences have distinct tested effects.

### PAL-08 · Expose saved notes and memory provenance

**P1 · planned** · Depends on: RUN-05, AI-03

Acceptance: Users can inspect, edit, delete and export saved assistant notes; source and audience are visible and deleted notes stop entering subsequent context.

### RUN-08 · Pilot a pinned local Codex runtime adapter

**P2 · planned** · Depends on: RUN-01, SEC-04

Acceptance: A disabled-by-default adapter pins App Server protocol/schema and tests handshake, resume, steer, cancel and approvals; experimental support and production release decision are explicit.

### AI-10 · Evaluate Decisions for bounded routing and urgency

**P2 · planned** · Depends on: AI-01, RUN-04

Acceptance: Predicate/choice/score contracts are tested on synthetic cases, cost and uncertainty are recorded, and model outputs cannot override deterministic permissions or spending limits.

### PAL-09 · Add opt-in read-only proactive research

**P2 · planned** · Depends on: RUN-06, EXT-01

Acceptance: User-selected read scopes produce attributed private findings; tests prove research cannot write connected services, control computers or create monitoring subscriptions by itself.

## M6

### CLOUD-01 · Define interchangeable execution providers

**P1 · planned** · Depends on: SEC-04, RUN-04, RUN-07

Acceptance: Local isolated worker and one cloud provider implement the same job/artifact contract with owner isolation and explicit resource ceilings.

### CLOUD-02 · Add cloud compute workspaces

**P1 · planned** · Depends on: CLOUD-01

Acceptance: Run-scoped files, package installation, expiry, snapshots and artifact export survive reconnect and are deleted on expiry; quota tests include failure paths.

### CLOUD-03 · Add isolated browser sessions

**P1 · planned** · Depends on: CLOUD-01, EXT-01

Acceptance: Per-user browser state, live preview, sign-in handoff, domain policy, idle shutdown and cleanup work without sharing cookies between users.

### CLOUD-04 · Add computer-use action controls

**P1 · planned** · Depends on: CLOUD-03, RUN-03

Acceptance: External page instructions cannot widen permissions; submissions/purchases require the user's applicable action policy and concrete review when needed. Watching, human takeover, agent return-control and access revocation have distinct verified effects.

### CLOUD-05 · Add deployable artifact previews

**P2 · planned** · Depends on: CLOUD-02, UX-09

Acceptance: Preview URLs expire, artifacts carry provenance, credentials never enter public bundles and users can export reproducible source.

### CLOUD-06 · Add cloud operations and cost visibility

**P2 · planned** · Depends on: CLOUD-02, CLOUD-03

Acceptance: Orphan resources are reconciled, expiry is enforced after worker crashes and actual compute/browser usage appears per user/run.

### PAL-06 · Add private sign-in and explicit control handoff

**P1 · planned** · Depends on: CLOUD-04, EXT-01

Acceptance: Credentials remain outside model-visible events; private browser sign-in, session expiry, sign-out and return-control are tested without recording secrets. Optional saved logins require explicit confirmation before reuse.

### LOC-01 · Run an isolated local computer provider

**P1 · planned** · Depends on: SEC-04, CLOUD-01

Acceptance: A per-workspace Linux container or VM runs on the local host with no host-shell fallback, scoped mounts, credential separation, resource caps and verified teardown.

### LOC-02 · Watch and take over the local browser

**P1 · planned** · Depends on: LOC-01, CLOUD-03

Acceptance: Chrome/Chromium tabs and a live view are owner-authenticated; two-client tests prove exclusive input lease, agent pause on takeover and fresh observation after return-control.

### LOC-03 · Add a visible interactive terminal

**P1 · planned** · Depends on: LOC-01, RUN-03

Acceptance: PTY output, input, resize, interrupt and reconnect work only in the owned isolated workspace; output backpressure and process-tree cleanup are verified.

### LOC-04 · Add a workspace file explorer and editor

**P1 · planned** · Depends on: LOC-01, UX-09

Acceptance: Owned directory listing, preview, edit, upload and download reject symlink traversal, cross-user references, oversized files and stale overwrite versions.

### LOC-05 · Pair a personal-computer bridge with explicit access grants

**P2 · planned** · Depends on: LOC-01, API-01

Acceptance: Pairing binds one user and device, narrowly scoped folders/apps, authenticated heartbeat and immediate revocation; it grants no implicit access to personal browser sessions or unrelated chats. Browser-history access requires its own visible opt-in grant and revocation path.

## M7

### CON-01 · Build OAuth, webhooks and sync infrastructure

**P1 · planned** · Depends on: EXT-01, RUN-01

Acceptance: OAuth state/PKCE, refresh races, webhook signature/replay checks, subscription renewal and idempotent delta cursors pass provider fixtures.

### CON-02 · Add Microsoft 365 mail and calendar

**P1 · planned** · Depends on: CON-01

Acceptance: Graph delegated read/search, drafts and calendar operations pass against a test tenant; send/write scopes are separate and admin consent is documented.

### CON-03 · Add Teams conversations and notifications

**P2 · planned** · Depends on: CON-02, RUN-06

Acceptance: Bot installation and supported Graph permissions are tested in a tenant; no migration-only permission is used as a general send-as-user mechanism.

### CON-04 · Add Gmail and Google Calendar

**P1 · planned** · Depends on: CON-01

Acceptance: Read/search, drafts, opted-in sends and calendar sync handle token revocation and quota errors; required verification is complete before general release.

### CON-05 · Add Telegram as an assistant channel

**P2 · planned** · Depends on: CON-01, RUN-05

Acceptance: A one-time account linking flow binds bot chat to the correct user; webhook secrets, duplicate updates and unlink are tested.

### CON-06 · Add Discord commands and conversations

**P2 · planned** · Depends on: CON-01, RUN-05

Acceptance: OAuth bot install, guild/channel allowlists, interaction verification and per-user linking work; required intents are documented.

### CON-07 · Validate and add WhatsApp business messaging

**P2 · planned** · Depends on: CON-01, RUN-05

Acceptance: Confirm current Meta eligibility and messaging rules first; official test-number webhooks, templates and opt-outs pass before enabling real delivery.

### CON-08 · Add iCloud Mail

**P2 · planned** · Depends on: CON-01

Acceptance: IMAP/SMTP credential handling, folder sync, reconnect and revocation pass with a dedicated test mailbox; primary Apple passwords are never stored.

### CON-09 · Validate and add iCloud Calendar

**P2 · planned** · Depends on: CON-01

Acceptance: Prove supported authorization and CalDAV discovery/ETag sync with a test account; recurrence, timezone and conflicting writes have fixtures.

### CON-10 · Add OneDrive, SharePoint and Google Drive retrieval

**P2 · planned** · Depends on: CON-02, CON-04, AI-06

Acceptance: Indexing preserves source ACLs, deletions and citations; revoked permissions promptly remove accessible content.

### CON-11 · Add a connections centre and action ledger

**P1 · planned** · Depends on: CON-02, CON-04, UX-08

Acceptance: Users inspect permissions, last sync, actions and errors, disconnect accounts and separately enable reads, drafts and sends.

### PAL-07 · Preserve Pal identity across audience-bound channels

**P1 · planned** · Depends on: RUN-05, CON-01

Acceptance: One assistant retains relevant private notes across connected channels while authorization tests prevent disclosure into a different user or group audience.

### CON-12 · Add Slack as a Pal messaging channel

**P2 · planned** · Depends on: CON-01, PAL-07

Acceptance: OAuth scopes, direct messages, audience separation, webhook replay and revoke tests pass with a dedicated Slack test workspace.

### CON-13 · Evaluate supported phone channels and iMessage feasibility

**P2 · planned** · Depends on: CON-01, PAL-07

Acceptance: Document supported RCS/SMS provider contracts, identity verification and geography; identify any missing public iMessage API explicitly and never advertise unsupported parity.

### CON-14 · Integrate GitHub work and review evidence

**P2 · planned** · Depends on: CON-01, RUN-08

Acceptance: Repository-scoped access supports issues, branches, PRs and check results with explicit write authority, idempotent submission and reviewable test/video artifacts; credentials never enter task logs.

## M8

### PAR-01 · Add share links and workspace collaboration

**P2 · planned** · Depends on: SEC-02, UX-07

Acceptance: Explicit access modes, expiry, revoke and redaction work; shared links never leak private files, system instructions or other users' memory.

### PAR-02 · Add custom assistants and reusable skills

**P2 · planned** · Depends on: EXT-03, RUN-05

Acceptance: Assistants package instructions, models, skills, knowledge and allowed tools; versioning and publish/install permissions are enforced.

### PAR-03 · Add portable import, export and deletion

**P2 · planned** · Depends on: AI-03, CON-11

Acceptance: Account export contains portable chats/files/configuration without credentials; deletion reconciles local and provider-side resources and reports failures.

### PAR-04 · Add feedback and evaluation suites

**P2 · planned** · Depends on: AI-02, VOICE-03

Acceptance: Versioned golden tasks measure grounded answers, tool choice, refusal, latency and cost; releases compare against a recorded baseline.

### PAR-05 · Add multimodal feature parity spikes

**P2 · planned** · Depends on: AI-07, VOICE-06

Acceptance: Screen/video, richer canvas editing and document authoring each have an API feasibility and cost experiment before becoming release commitments.

### PAR-06 · Add localisation and accessibility release gates

**P2 · planned** · Depends on: UX-04

Acceptance: Key journeys pass keyboard/screen-reader review, WCAG-oriented automated checks, RTL layout and translated string coverage.

### OPS-01 · Prepare the first supported platform release

**P1 · planned** · Depends on: REL-04, CLOUD-06, PAR-04

Acceptance: Version tag, changelog, migration/restore rehearsal, dependency review, load tests and support matrix identify every supported and experimental capability.

### UX-11 · Add native iOS widget and shortcut entrypoints

**P2 · planned** · Depends on: UX-05, API-02

Acceptance: A supported native integration can open or start an authorized Pal interaction from widget, Shortcuts and Action button; account consent, deep links and device tests are recorded.

### ART-01 · Add native document, sheet, slide and LaTeX artifact editing

**P2 · planned** · Depends on: UX-09, API-02

Acceptance: Supported document/spreadsheet/presentation/LaTeX formats have editable state, previews, version history and export; formulas, malformed files, cross-user access and delivery are tested separately.
