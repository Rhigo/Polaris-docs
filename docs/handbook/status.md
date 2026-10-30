# Current status

Updated **30 October 2026**. This page describes current source and its verification boundaries. Installation configuration, account access and a running worker determine which features are available in a particular deployment. The [work log](./worklog) records release revisions and test results; the [backlog](./backlog) tracks unfinished acceptance criteria.

| Area | Implemented and tested scope | Remaining work |
| --- | --- | --- |
| Chat | Streaming OpenAI Responses, model selection, citations, owned attachments and temporary history | Richer editing/branching and broader device coverage |
| Charts and tables | Incremental validated data blocks, bar/line charts, accessible tables and CSV/JSON exports; synthetic production HTTP and desktop/mobile checks | Broader model evaluations, physical-device coverage and additional chart types; see [data guide](./rich-data) |
| Models | Pinned OpenAI SDK 7.45.1, capability-based request validation and recorded reply identities; Anthropic/Ollama adapters | Broader live account/model coverage and provider-specific capability parity |
| Images | Configurable generation, owned downloads and follow-up edits; a bounded live OpenAI generation/edit check passed | Masks/variations, partial previews and broader live coverage; see [images](./images) |
| Voice | Dictation, read-aloud and experimental WebRTC calls; standalone HTTP/WebSocket fixtures and a bounded live speech/transcription round trip | Physical microphone/speaker tests, reconnect, context parity and complete metering; see [voice](./voice) |
| Saved Pal tasks | One bounded text-model request, current owner/model checks, fenced worker claims, persisted events/results and cancellation | Tool-using multi-step runs, spend budgets and durable external-action outcomes; see [tasks](./pal-tasks) |
| Reminders | Explicit date/time/zone scheduling, one-off worker delivery, durable owned inbox, acknowledgement, cancellation and terminal removal | Natural-language scheduling, recurrence, quiet hours, snooze and external channels; see [reminders](./reminders) |
| Local execution | Bounded workload containers, a persistent allocation ledger, native-ABI socket restrictions and owned exports; restart and x86 compatibility gates pass | A quiesced operator upgrade and verification of the deployed images are required; the local demo remains held during rollout; see [execution isolation](./execution-isolation) |
| Browser workspace | Isolated ephemeral Chromium, explicit public-HTTPS destinations, watched frames, exclusive human control and owned exports | Autonomous agent control, terminal/file editing, durable profiles and cloud tenancy remain separate; see [workspace guide](./computer-workspace) |
| Developer access | Scoped expiring keys, model/profile reads, owned saved-text task submission/inspection/cancellation, current-key dispatch checks and OpenAPI | Streaming chat, dollar spend budgets and broader SDK coverage; see [API](./api) |
| Recovery | Protected database/files/configuration bundles, immutable source checkpoints and restoration into new targets | Operator review and reconciliation remain necessary before resuming restored work; see [recovery](./recovery) |
| Search and history | Owned title/message prefix search, explicit archive filtering, precise cursor pagination and incremental sidebar/project lists | Semantic ranking and text beyond the documented indexed prefix are not included; see [history guide](./conversation-history) |
| Interface | Shared light/dark surfaces, saved Pal appearance, responsive chat/navigation, settings and administration | Physical iOS/Android testing, virtual keyboards, landscape/voice transitions and an installable PWA |
| Projects and artifacts | Project context, uploads, generated files and restricted HTML/code previews | Provider-neutral retrieval, lifecycle cleanup, artifact versions and fuller mobile workflows |
| Security and identity | Current-account authorization, ownership checks, bounded inputs and session-role regression tests | Real Entra sign-in validation, per-device token revocation and ongoing review |
| Extensibility | Administrator function configuration, model profiles and a manual MCP HTTP call path | Protocol interoperability, encrypted connection lifecycle and the versioned workflow editor/runtime remain incomplete; see [extension contracts](./extensions) |
| Connected accounts | Microsoft sign-in configuration | Mail/calendar, Teams, Google, Telegram, Discord, WhatsApp and iCloud connectors |

## What the tests establish

Routine tests use synthetic accounts, isolated PostgreSQL databases and loopback provider fixtures. They cover authorization, migration/seed lifecycle, cancellation, output validation and production standalone packaging. CI runs Node 22/24 with PostgreSQL 16; local database checks use PostgreSQL 18.4. Exact counts vary by revision and are recorded in the work log.

Execution isolation has been exercised in a separate Linux VM and in CI, including actual container lifecycle, limits, ownership and cleanup. Further adversarial review reopened SEC-04. The revised source now passes persistent-quarantine, late-resource, restart, native-socket and x86 compatibility tests. New code-execution requests remain disabled in the local demo while the operator upgrades and verifies its dedicated runtime; application data remains intact. The application has no host-shell or shared-container fallback. Earlier passing checks retain their stated scope and do not certify the reopened criteria or a different runtime.

Chrome checks cover representative 390/768/1440-pixel layouts, themes, focus, streaming transitions and reloads. They do not establish physical iOS Safari, Android keyboard or microphone compatibility. Screenshots use synthetic content and identify their scope in the [gallery](./screenshots).

Live OpenAI checks are deliberately small. They establish specific Responses/Decisions, audio and image contracts; they are not a blanket certification of every model, tool, region or account. Application validation remains necessary even when a provider supports structured output.

## Release and recovery evidence

The reminder release merged in [PR #15](https://github.com/Rhigo/Polaris/pull/15) at `a5be1bd` after all required checks passed on its final head. Its local demo upgrade stopped both web and worker, captured a fresh verified backup, rehearsed restoration and migration in separate targets, and preserved every existing column across 28 tables. Ten authenticated/readiness checks passed after cutover. The worker now services one-off reminders as well as bounded saved text tasks.

Chat [PR #18](https://github.com/Rhigo/Polaris/pull/18) merged at `b290c66` after every required head check passed. Its no-migration demo cutover captured another verified backup, preserved all 29 tables and passed ten live HTTP checks before the matching saved-task/reminder worker resumed. The execution hold stayed active.

The next combined release joins the independently verified execution, browser, API and history feature heads. Their local integration passes 253 web tests, eight recovery tests, 38 browser-service tests, 56 host-safe execution tests and 131 records across 19 database/HTTP/lifecycle files. Nine Linux-only tests are skipped on the Mac; the exact feature images passed separate Linux CI. The combined release still requires its own GitHub gate and controlled deployment.

The [public handbook](https://rhigo.github.io/Polaris-docs/) is exported from reviewed source with a revision/hash manifest and its own publication checks. The [wiki](https://github.com/Rhigo/Polaris-docs/wiki) indexes that handbook. A merged source feature and a deployed instance are separate states; source updates do not automatically upgrade an operator's installation.

## Important boundaries

Generated HTML uses restricted frames; active file downloads and PDF inputs have explicit policies. Browser policy prevented inspection of one application Blob popup during earlier testing; that precise limitation remains in [artifact security](./artifacts-security).

Temporary chat keeps continuation state in the tab and disables provider storage for the supported stateless path. Independently saved files, usage accounting and already completed tool actions have separate retention boundaries. Cancellation stops transport/work where supported; it cannot undo an external action. See [privacy](./privacy).

Unknown or unverified token costs remain unknown. Token estimates exclude other fees and are not a bill or a dollar spend cap. See [token accounting](./token-accounting).

General proactive responsibilities, autonomous browser orchestration, cloud provisioning and connected-account delivery remain unfinished. They must pass their own authorization, isolation, lifecycle and live-account gates before being advertised as available.
