# Current status

Updated **30 October 2026**. This page describes current source and its verification boundaries. Installation configuration, account access and a running worker determine which features are available in a particular deployment. The [work log](./worklog) records release revisions and test results; the [backlog](./backlog) tracks unfinished acceptance criteria.

| Area | Implemented and tested scope | Remaining work |
| --- | --- | --- |
| Chat | Streaming OpenAI Responses, model selection, citations, owned attachments and temporary history | Richer editing/branching and broader device coverage |
| Charts and tables | Incremental validated data blocks, bar/line charts, accessible tables and CSV/JSON exports; synthetic production HTTP and desktop/mobile checks | Broader model evaluations, physical-device coverage and additional chart types; see [data guide](./rich-data) |
| Models | Pinned OpenAI SDK 7.45.1, capability-based request validation and recorded reply identities; Anthropic/Ollama adapters | Broader live account/model coverage and provider-specific capability parity |
| Images | Configurable generation, owned downloads and follow-up edits; a bounded live OpenAI generation/edit check passed | Masks/variations, partial previews and broader live coverage; see [images](./images) |
| Voice | Dictation, read-aloud and experimental WebRTC calls with bounded recent text context and explicit fresh-call recovery; synthetic transport/browser tests and a bounded live speech/transcription round trip | Physical microphone/speaker tests, broader context parity, live WebRTC acceptance and complete metering; see [voice](./voice) |
| Saved Pal tasks | One bounded text-model request, current owner/model checks, fenced worker claims, persisted events/results and cancellation | Tool-using multi-step runs, spend budgets and durable external-action outcomes; see [tasks](./pal-tasks) |
| Text workflows | One to four sequential OpenAI text steps, immutable revisions, native JSON import/export, owned durable runs and six explicit API permissions | General graphs, tools, transforms, parallel/approval nodes and a visual graph editor remain separate; see [workflow guide](./workflows) |
| Reminders | Explicit date/time/zone scheduling, one-off worker delivery, durable owned inbox, acknowledgement, cancellation and terminal removal | Natural-language scheduling, recurrence, quiet hours, snooze and external channels; see [reminders](./reminders) |
| Local execution | Bounded workload containers, a persistent allocation ledger, native-ABI socket restrictions and owned exports; restart and x86 compatibility gates pass | The local runtime passed quiesced upgrade and exact-image acceptance; other installations require their own operator verification; see [execution isolation](./execution-isolation) |
| Browser workspace | Isolated ephemeral Chromium, explicit public-HTTPS destinations, watched frames, exclusive human control and owned exports | Autonomous agent control, terminal/file editing, durable profiles and cloud tenancy remain separate; see [workspace guide](./computer-workspace) |
| Developer access | Scoped expiring keys, model/profile reads, owned saved-text task submission/inspection/cancellation, current-key dispatch checks and OpenAPI | Streaming chat, dollar spend budgets and broader SDK coverage; see [API](./api) |
| Recovery | Protected database/files/configuration bundles, immutable source checkpoints and restoration into new targets | Operator review and reconciliation remain necessary before resuming restored work; see [recovery](./recovery) |
| Search and history | Owned title/message prefix search, explicit archive filtering, precise cursor pagination and incremental sidebar/project lists | Semantic ranking and text beyond the documented indexed prefix are not included; see [history guide](./conversation-history) |
| Interface | Shared light/dark surfaces, saved Pal appearance, responsive chat/navigation, settings and administration | Physical iOS/Android testing, virtual keyboards and landscape/voice transitions |
| Installable app | Manifest/icons, installation help, public-only offline notice and explicit updates with draft/call guards; real Chrome lifecycle checks | Physical installation, Safari and installed-window testing; offline chat, push and sync are absent; see [PWA guide](./pwa) |
| Projects and artifacts | Project context, uploads, generated files and restricted HTML/code previews | Provider-neutral retrieval, lifecycle cleanup, artifact versions and fuller mobile workflows |
| Security and identity | Current-account authorization, ownership checks, bounded inputs and session-role regression tests | Real Entra sign-in validation, per-device token revocation and ongoing review |
| Provider credential expiry | Optional UTC cutoff for new OpenAI/Anthropic dispatch, fresh checks for retained clients, atomic settings updates and synthetic wire-header tests | Already-dispatched requests and established WebRTC calls may continue; no provider-side revocation or dollar cap; see [credential boundaries](./provider-credentials) |
| Extensibility | Administrator function configuration, model profiles, a manual MCP HTTP call path and native sequential text workflows | MCP interoperability, encrypted connection lifecycle, general workflow graphs and external framework compatibility remain incomplete; see [extension contracts](./extensions) |
| Connected accounts | Microsoft sign-in configuration | Mail/calendar, Teams, Google, Telegram, Discord, WhatsApp and iCloud connectors |

## What the tests establish

Routine tests use synthetic accounts, isolated PostgreSQL databases and loopback provider fixtures. They cover authorization, migration/seed lifecycle, cancellation, output validation and production standalone packaging. CI runs Node 22/24 with PostgreSQL 16; local database checks use PostgreSQL 18.4. Exact counts vary by revision and are recorded in the work log.

Execution isolation passed real Linux lifecycle, limits, ownership, persistent-quarantine, late-resource, restart and socket-policy checks. The x86 CI runner exercised compatibility ABIs; the local ARM runtime passed its separate native-ABI checks. After a stopped-admission daemon upgrade, source/image audit and restored-application adapter/export checks, the local demo connected the accepted execution runtime. SEC-04 is closed for this tested scope. Other installations need their own quiesced upgrade and deployed-image verification. The application has no host-shell or shared-container fallback; these results do not certify a different image or platform.

Chrome checks cover representative 390/768/1440-pixel layouts, themes, focus, streaming transitions and reloads. They do not establish physical iOS Safari, Android keyboard or microphone compatibility. Screenshots use synthetic content and identify their scope in the [gallery](./screenshots).

Live OpenAI checks are deliberately small. They establish specific Responses/Decisions, audio and image contracts; they are not a blanket certification of every model, tool, region or account. Application validation remains necessary even when a provider supports structured output.

## Release and recovery evidence

The reminder release merged in [PR #15](https://github.com/Rhigo/Polaris/pull/15) at `a5be1bd` after all required checks passed on its final head. Its local demo upgrade stopped both web and worker, captured a fresh verified backup, rehearsed restoration and migration in separate targets, and preserved every existing column across 28 tables. Ten authenticated/readiness checks passed after cutover. The worker now services one-off reminders as well as bounded saved text tasks.

Chat [PR #18](https://github.com/Rhigo/Polaris/pull/18) merged at `b290c66` after every required head check passed. Its no-migration demo cutover captured another verified backup, preserved all 29 tables and passed ten live HTTP checks before the matching saved-task/reminder worker resumed. The execution hold stayed active.

Combined [PR #22](https://github.com/Rhigo/Polaris/pull/22) merged at `f1ac09d` after all six final GitHub checks passed. Local integration passed 253 web tests, eight recovery tests, 38 browser-service tests, 56 host-safe execution tests and 131 records across 19 database/HTTP/lifecycle files. Nine Linux-only tests were skipped on the Mac; the exact combined head passed both real Linux isolation jobs.

The controlled demo upgrade stopped the old web and worker, captured a fresh verified backup and applied migrations 0011–0012. All original columns and rows across 29 tables retained their fingerprints. Ten core HTTP checks plus search and browser availability passed before the matching worker resumed. The accepted execution and browser services are connected. Separate restored-app tests exercised real browser routes, takeover, ownership and export expiry; direct execution-adapter tests produced an owned download. These checks made no provider call and do not claim model-directed orchestration.

Installable-app [PR #23](https://github.com/Rhigo/Polaris/pull/23) merged at `37ac185` with all six required GitHub checks green, including public-asset checks inside Compose. Its demo rollout took another stopped-writer backup, changed no schema, preserved all 29 table fingerprints and passed 19 HTTP checks before the matching worker resumed. Native operating-system installation and physical-device testing remain unverified.

Workflow [PR #24](https://github.com/Rhigo/Polaris/pull/24) merged at `5f8e4f0` after all six required checks passed its corrected head. An existing allocation-test scheduling assumption was replaced by an explicit barrier without weakening its pre-dispatch assertion. The isolated restore rehearsal preserved all 29 original tables and passed 16 HTTP checks without a worker or provider call. The live rollout then took a fresh stopped-writer backup, applied migration 0013, preserved those tables and passed 18 HTTP checks before starting the matching worker. The bounded workflow interface is live; provider setup remains an operator prerequisite.

The [public handbook](https://rhigo.github.io/Polaris-docs/) is exported from reviewed source with a revision/hash manifest and its own publication checks. The [wiki](https://github.com/Rhigo/Polaris-docs/wiki) indexes that handbook. A merged source feature and a deployed instance are separate states; source updates do not automatically upgrade an operator's installation.

## Important boundaries

Generated HTML uses restricted frames; active file downloads and PDF inputs have explicit policies. Browser policy prevented inspection of one application Blob popup during earlier testing; that precise limitation remains in [artifact security](./artifacts-security).

Temporary chat keeps continuation state in the tab and disables provider storage for the supported stateless path. Independently saved files, usage accounting and already completed tool actions have separate retention boundaries. Cancellation stops transport/work where supported; it cannot undo an external action. See [privacy](./privacy).

Unknown or unverified token costs remain unknown. Token estimates exclude other fees and are not a bill or a dollar spend cap. See [token accounting](./token-accounting).

General proactive responsibilities, autonomous browser orchestration, cloud provisioning and connected-account delivery remain unfinished. They must pass their own authorization, isolation, lifecycle and live-account gates before being advertised as available.
