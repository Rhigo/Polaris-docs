# Work log

## 2026-10-29 · Baseline and documentation milestone

**Source baseline:** `f50ff4fba09999bb8799ca8c8887e688c7f9d561`.

Reviewed the source, deployment configuration, tests, historical project status/changelog and both development chat logs. Compared current implementation with official OpenAI, OpenWebUI, MCP and connector documentation. Historical notes remain preserved as historical evidence.

Produced the current capability inventory, private technical audit, nine-stage roadmap, 79 acceptance-driven backlog items, architecture plan, connector feasibility matrix and unattended execution protocol. Built a curated GitHub Pages documentation source and refreshed the repository entry point.

Baseline validation: 22 unit tests, TypeScript checking and production build passed. Fresh journal migrations and seed were exercised against an isolated PostgreSQL instance. The original seed loader failed on Node 24; the corrected loader succeeded. Local browser checks and five real screenshots used synthetic data. Negative authorization/input checks identified M1 work; no paid provider calls were made.

**Delivery status:** documentation and seed-loader changes were merged through [PR1](https://github.com/Rhigo/Polaris/pull/1), merge commit `1a50fc3`. Pages enablement and live publication remain separate actions. The new documentation workflow validates builds before any Pages deployment.

**Next:** `REL-01` fresh install/readiness and the `SEC-01`–`SEC-04` release blockers, with database/browser regression CI. Product redesign and new agent/connector features remain planned.

See the PR's checks and the repository review report for the final validation results for this branch.

## 2026-10-29 · Foundation implementation

[PR2](https://github.com/Rhigo/Polaris/pull/2) separates the work into three source commits: authorization/ownership/realtime (`3311df5`), sandbox resource/artifact hardening (`1c54fd7`), and atomic install/readiness/CI (`c2924c1`). The active migration 0006 adds account availability and per-conversation realtime event identity; its snapshot aligns the complete existing schema for future migration generation.

Current account state is checked on session reads. Administrative user creation, edits, deletion and group assignments serialize, recheck the actor and commit atomically. Ownership checks precede chat/provider/tool work. Transcript retries share a database unique key. Voice lifecycle fixes cover pending-permission mute, late callbacks, interleaved/replayed transcripts and duplicate tool events within one call. Durable tool-result recovery across restarts remains open.

Initialization now holds one transaction-level lock across journal migration and seed. Failed or terminated initialization rolls back. Existing passwords, settings and deleted/demoted/disabled bootstrap accounts remain preserved. Readiness checks database/history/schema/active administration; the installer waits for the HTTPS proxy too.

Local evidence: Node 24.19.0/PostgreSQL 18.4, 42 unit tests, 14 HTTP test records, TypeScript and production build passed. Database tests proved upgrade, concurrent rerun, rollback, corrupted history rejection and outage behavior. Sandbox 27 host-safe tests passed; 6 cases require restricted Linux execution. No generated code ran on the Mac. Node 22/PostgreSQL 16/Compose checks are tracked on the exact PR head in GitHub Actions.

Research expanded the Pal architecture comparison across Agents API, Codex SDK/App Server, Responses and Decisions. The first two bounded live model/API checks succeeded on synthetic input; routine tests use fixtures. Voice/image sessions, managed agents and external account actions have not been live-verified.

A separate local preview implements the Pal home/customizer and honest disconnected computer panels. Browser testing caught and fixed an SVG title hydration mismatch. Appearance persistence was verified through the visible application. Shared design and mobile work continues separately from the foundation commits.

**Scope and operating direction:** the full product remains in scope, with OpenAI first and capability-based Claude/Ollama foundations. Maintain a consistent visual system, portable handoffs, focused PRs, rollback checkpoints, screenshots and 30-minute progress roundups. A separately configured development continuation task is active; it is not the future Pal scheduler. Local preview/development requires the host and app to remain available.

**Remaining release gates:** per-run isolation, durable cancellation/outcome reconciliation, backup/restore rehearsal, live provider/device/account checks and the rest of the feature programme. Do not mark a mocked or scaffolded journey complete.

**Linux CI evidence:** all checks passed at `c2924c1`: Node 22 and 24 with PostgreSQL 16, restricted sandbox execution, documentation build and standalone Compose/HTTPS initialization. Pages deployment was correctly skipped because publishing is not enabled. The expanded plan now has 102 work items and a 94-row Dots capability inventory.

**Publishing dependency:** repository metadata reports Wiki and Pages disabled. Curated site and wiki-index sources are prepared; the connector has no repository-settings controls and the available GitHub browser is signed out. Source/PR updates continue normally. Public deployment and wiki publication are not claimed complete.

## 2026-10-29 · Pal and shared interface

Foundation PR2 merged at `c92852e` after every final-head check passed; `checkpoints/2026-10-29-foundation-c92852e` is the named source checkpoint. Pal and shared-interface changes are separate source commits. Saved appearance controls, themes, navigation, mobile Settings, Projects states and composer guards were exercised in an isolated Chrome session/database, preserving the user’s live preview.

Production QA covered 390/768/1440 pixels, both themes, drawer/dialog focus return, full-reload appearance persistence and composer length/keyboard behavior. Browser review found and repaired clipped settings fields, missing opener focus and CSS reset precedence. The final app source passed its production build and 48 unit tests; two opt-in live integration suites were skipped. Eighteen real screenshots were captured; seven are included in the curated public gallery. Physical Safari/Android, provider calls and microphone sessions are separate gates. No provider credentials were used for these UI checks.

The current OpenAI adapter has separately passed three bounded live Luna probes: text streaming, strict JSON and function-call argument normalization. The real recovery rehearsal and scoped API-key implementation are being tested and published as separate changes.

## 2026-10-29 · OpenAI model contracts

Pal/interface PR3 merged at `9c62fcb` after every final-head check passed, with named checkpoint `checkpoints/2026-10-29-interface-9c62fcb`. The next source slice pins OpenAI SDK 7.45.1, replaces model-name guesses with sourced capability records, modernizes typed Responses event normalization and preserves administrator catalogue edits. Missing local-model choices stay unavailable, and local/other-provider messages no longer enter OpenAI-only auxiliary helpers.

Merged interface/provider source passes production build and 67 unit tests (two opt-in HTTP suites skipped). A disposable PostgreSQL 18 lifecycle run verified catalogue and configuration preservation. Three actual-adapter Luna probes passed: streamed text, strict JSON and one synthetic function call; 106 input/41 output tokens, no real external action. See [model contracts](./models) for exact limits, retention and remaining pricing work.

## Protected recovery tooling — 29 October 2026

Added immutable release checkpoints, private backup bundles, checksum/inventory verification, schema compatibility assessment and restoration into new database/file/config targets. Configuration preserves the encryption key while disabling the copied database URL until an operator selects the new application connection. Eight safety tests and a real PostgreSQL 18.4 roundtrip passed locally. CI now exercises the roundtrip on PostgreSQL 16 with local clients and through the application Compose service; those results remain pending until this revision runs. Downgrades, data reconciliation and traffic cutover remain explicit operator decisions.
The first container acceptance run caught a packaging omission: the initializer copied database sources but not the new capability registry imported by seeding. The initializer now includes that dependency explicitly. Node 22/24 application and database tests passed on the first head; the corrected container image must pass a fresh CI run before merge.

## Artifact isolation — 29 October 2026

Closed generated-HTML origin inheritance in new windows with a trusted wrapper and an opaque inner frame. Added source-checked height messaging, raw-Markdown sanitization, normalized active-file download policies and PDF MIME/signature validation. The isolated application fixture passed file ownership/MIME tests and chart interaction; 24 focused security tests passed. A browser-policy restriction prevented inspection of the actual application Blob popup after opening, and no workaround was attempted. Separate synthetic popup tests had already observed the boundary; the application popup limitation is preserved in the verification record.

## Scoped API access — 29 October 2026

Added migration 0007, one-time random secrets stored as hashes, owner-only key management, atomic rotation/revocation, expiry, current-account checks, scoped model/profile reads and an OpenAPI document. Fixed two regressions found by adversarial HTTP tests: old active keys hidden by revoked history and expiry measured before a database-lock wait. Fourteen real HTTP tests now pass, along with 70 web unit tests, typechecking and production build. Chrome desktop/390px checks verified creation, scope validation, rotation, cancel/revoke, persistence and focus restoration; no page-wide mobile overflow or console errors were observed. Synthetic keys were revoked after screenshots. Streaming chat and spend budgets remain separate work.

## Audio contracts and production packaging — 29 October 2026

Implemented separate current-model adapters for dictation, read-aloud and Realtime calls, preserving administrator choices. Production HTTP tests caught two defects: Next middleware truncated multipart bodies above 10 MiB, and bundling ws broke its optional native-module resolution. Exact authenticated upload-route exclusions, bounded streamed parsing and externalized ws resolve these findings. Fourteen relocated standalone HTTP tests cover the real SDK WebSocket exchange, cancellation, ownership and upload limits. All Node 22/24, PostgreSQL 16, Compose and documentation CI checks passed before merge. A bounded live OpenAI speech/transcription roundtrip returned the exact synthetic sentence. Physical microphone/speaker behavior and continuous browser calls remain unverified.

## Public documentation and temporary history — 29 October 2026

Published the reviewed handbook and wiki in Polaris-docs while keeping application development private. Public CI passed, the live site returned HTTP 200, and desktop/mobile navigation and search were exercised. Phone testing found a doubled repository name in edit links; the export rule was corrected and build-time checks now verify all rendered links/assets, edit destinations and export hashes.

Temporary text/voice context now stays in tab memory with authenticated encrypted continuation. Provider storage, automatic memories, document upload caching and starter prompts have explicit temporary/local boundaries. Cancellation reaches provider/tool transports; uncertain tool outcomes terminate the loop. The privacy guide records retained independent files, usage accounting and the limits of cancellation.

The integrated privacy revision passes 134 web unit tests (three existing opt-in suites skipped), eight recovery safety tests, 11 standalone privacy HTTP cases and all 14 audio HTTP regressions. Production build, typecheck and documentation build/checks pass. GitHub CI must pass on the published head before merge. REL-03, AI-03 and RUN-05 remain in progress because transport cancellation is not workload rollback and full channel/retention parity is unfinished.

CI caught an older ownership fixture sending temporary requests without the newly required context. The fixture now distinguishes malformed requests from valid foreign project/file access, and proves owned temporary context reaches model resolution without persisting history. All ten ownership HTTP checks pass locally; fresh Node 22/24 CI remains the merge gate.

### Isolated execution integration — 29 October 2026

The application no longer starts or discovers the legacy shared sandbox by default. Operators must supply an explicit external execution broker URL and secret. The broker runs fresh per-request workload containers with bounded tmpfs-backed volumes, resource limits, no network, trusted principal limits, verified cleanup and no host workspace mounts. The accepted 21-file service source exactly matches the isolated Linux acceptance artifact: 37 host tests and eight real Linux scenarios passed. Integration against the merged privacy release passed 136 web tests, 11 standalone temporary-chat/cancellation HTTP checks, production build, typecheck and handbook build. GitHub repeats the real Linux harness before merge; a stable broker deployment and the live-demo cutover remain separate operations. Browser/terminal takeover and general agent workspaces remain unfinished.

## Pricing provenance and saved Pal text tasks — 29 October 2026

Prepared the saved-task and pricing slice on top of main `43085b0` (privacy `04bd033` plus isolated execution), preserving the tested audio/privacy adapters. Migration `0008` adds owned runs/events; `0009` adds nullable usage cost provenance and removes the old zero default without rewriting historical amounts. Verified model token estimates distinguish unknown prices, missing usage and legacy provenance from genuine known zero. Admin totals expose a known subtotal and unpriced count; reviewed scope and exclusions are documented in [token estimates](./token-accounting).

Pal now accepts a bounded saved text task, records activity/partial results, supports cancellation and reconstructs results after reload. The separate local source-checkout worker makes one stateless model request with current account/model checks, global/per-owner admission and fenced leases. It never automatically replays an interrupted claim and has no tools, computer control, schedules or notifications. The web-only deployment does not start or package this worker. [Worker operations](./pal-tasks) include migration order, limits, retention and rollback boundaries. AI-05 and RUN-01/03/04 remain in progress.

Final local release preparation passed a production build, TypeScript, eight recovery unit tests, 168 web tests (five opt-in HTTP tests skipped), twelve Pal database test records, both pricing migration/admin HTTP tests inside the new standalone harness, and eleven privacy HTTP records. The pricing harness also passes a forced-timeout check that kills descendants and removes the related orphan migration database; its server is relocated outside the checkout to expose missing packaged dependencies. Both new entry points also skipped cleanly with no database environment or opt-in. Documentation checks/build passed. Local database checks used disposable PostgreSQL 18.4 with Node 24.19.0; the added CI gates target Node 22/24 and PostgreSQL 16 and still require exact-head results before publication. No provider credentials or paid calls were used.

Prior source-identical Chrome checks verified saved-task completion/cancellation across reload, escaped output and 390px layout; pricing UI error/recovery checks and temporary-chat reset/reload controls are recorded separately. Live provider behavior, physical devices and automatic worker deployment are not claimed by these synthetic checks. Fixture databases/processes were removed; the live preview and execution VM were unchanged.

### Verified releases and live rehearsal — 29 October 2026

Privacy PR #9 and isolated execution PR #10 passed exact-head Node 22/24, Compose, sandbox and documentation checks before merge. The Linux job ran all eight real container scenarios successfully in 104.521 seconds after 37 host checks. Main 43085b0 was then deployed as an immutable local production bundle following a consistent private backup, restore into a new database/storage tree, forward-migration rehearsal and byte-equivalence checks for existing accounts, history and encrypted settings. Six authenticated/readiness HTTP checks passed on the restored copy and live build. Execution remains disabled until its separate broker deployment is verified. Public documentation PR #3 deployed the voice/privacy guides; the wiki index and synthetic screenshots are maintained separately.

## 2026-10-29 — attachment release and real image contract check

- Merged attachment lifecycle PR #12 at `cb23d63d829d93fdaac93f7863ad961d570386e9` after Node 22/24, application build, Compose and Linux isolation checks passed. Saved the matching rollback checkpoint.
- The integrated image source `3c70c5e0735f67796c1259042bdd7a1eda293a88` passed 188 web tests, 8 recovery tests, 14 image HTTP cases, 11 privacy HTTP cases and 2 attachment journeys, plus type, production-build and documentation checks.
- A separate bounded live API probe generated a blue-circle PNG and edited it to green through the actual OpenAI adapter and raster validator. Both were 1024 × 1024 PNGs using GPT Image 2.5 Flare with GPT-6 Luna, stateless responses, no SDK retry and a one-tool-call probe cap. This was adapter-level evidence; the HTTP ownership/storage and temporary-state cases above used synthetic local providers. No physical microphone or partial-image streaming claim is added.
- The existing live demo remains on the verified isolation release while later migrations and the worker receive a separate backup/restore rehearsal. The isolated execution broker has now been connected after successful owned-export and fail-closed application checks.

## 2026-10-29 — verified image release, live upgrade and published guides

- Image PR #13 merged at `0e7e8ff727066e1fdb246286194a497b4c4abaf0` after every required check passed for exact head `9a4f4d9c4dab4e6d588142123f92090d4f904f25`. Its runtime matches the frozen, tested source `3c70c5e0735f67796c1259042bdd7a1eda293a88`; the later delta contains documentation only.
- Quiesced the previous demo, captured a verified PostgreSQL 18 backup with both stored files, restored into new targets, and rehearsed migrations 0008/0009. Real credential login and nine authenticated/readiness routes passed without provider calls. A fresh stopped-writer backup preceded the actual cutover. All existing columns in all 26 pre-upgrade public tables retained identical row counts and canonical content hashes.
- The production demo now serves the image/attachment/Pal release. A separate worker runs bounded saved text tasks; its source and dependencies match the verified release. The accepted execution broker remains connected. The earlier runtime, checkpoints, backups and isolated restored database remain available; no downgrade or journal deletion was used.
- Public documentation PR #4 deployed successfully at `ca4da1ce87a986667e84930681ccacdf6514b8bd` (Actions run `40957390168`): 29 rendered pages, 27 public edit links and 54 exported file hashes. New guides cover images, attachments, saved Pal tasks, token accounting and execution isolation.
- SEC-04 is complete against its stated Linux isolation/output/cleanup/no-host-fallback acceptance criteria, with the separate application owner/export/failure checks also passed. AI-07 remains in progress: final-image generation/editing and owned downloads are tested, while mask/variation controls and partial-preview support are not complete. RUN-02, RUN-06 and PAL-04 are in progress in the separate reminder branch; recurring responsibilities, external channels, quiet hours, snooze and findings are not released.

## 2026-10-29 — one-off reminder release integration

Integrated the frozen reminder implementation `4377754` with verified main `bd465ec`. Explicit local date/time and IANA zones, DST gap/fold handling, owned pending/inbox/history views, cancellation, read state and terminal removal now share the existing Pal design. Independent worker loops deliver reminders without waiting for a text task. Migration 0010 is additive; 0008/0009 and earlier journal entries are unchanged.

Combined local checks passed: production build and typecheck; 198 web and 8 recovery unit tests (8 opt-in web tests skipped); 10 reminder database/HTTP wrapper records with its nested HTTP scenario; 12 saved-task database records; 11 temporary-chat HTTP records; 14 image HTTP records; and both attachment journeys in their relocated standalone wrapper. The initial combined attachment invocation skipped because its opt-in flag was absent; a separate explicit invocation ran both journeys successfully, and the reproduction script was corrected. Documentation validation and rendering passed. All integration databases and processes belonged to disposable fixtures; no paid provider call or live schema change was made.

Actual worker-timed browser checks passed in desktop dark and 390-pixel mobile light views, including unread updates, acknowledgement, reload, cancellation/removal and DST choice/rejection. Screenshots in the gallery use synthetic accounts. Recovery documentation now explains how older backups can restore removed/cancelled reminders or unread state, and why overdue restored entries require reconciliation before restarting the worker.

This completes the one-off inbox slice only. RUN-02, RUN-06 and PAL-04 remain in progress for recurrence, external triggers/channels, quiet hours, snooze and evidence-backed findings. The current live demo stays on its prior verified migration history until CI, backup and restore rehearsal gates pass.

GitHub CI on the first reminder PR head caught an outdated pricing-upgrade fixture: it assumed migration 0009 was the final journal entry. The fixture now finds that historical migration explicitly, builds the preceding 0008 schema, and upgrades through the complete current journal. The existing legacy-cost, unknown-provenance and removed-default assertions remain intact. The disposable pricing/admin HTTP suite and its forced-timeout cleanup probe passed after correction; Linux Node 22/24 checks must pass again on the updated head before merge.

## 2026-10-29 — rich-data integration and mobile correction

The combined reminder/rich-data build passed 212 web and 8 recovery unit tests (8 intentional opt-in skips), production build/typecheck, reminder and saved-task database/HTTP checks, privacy/image/attachment/pricing regressions and five rich-data HTTP records. A separate Chrome check at 390 by 844 pixels exposed a flex layout case missed by the earlier wide-table fixture: a chart title collapsed beside its export controls and made the card 1825 pixels tall. A shrinkable 12rem title basis now wraps the controls, producing a 24-pixel title and 485-pixel card with no document overflow. The rebuilt production fixture and HTTP checks passed. Mobile SVG axis labels still need readable geometry before this release is published; the current snapshot is not a completed mobile chart claim.

## 2026-10-29 — reminder deployment and recovery rehearsal

Reminder PR #15 merged at `a5be1bd` after the final `d965fdd` head passed every required CI check. A migration-fixture assumption discovered by CI was corrected to identify migration 0009 explicitly rather than treating it as the final journal entry.

The local demo deployment stopped both owned writers before each backup. A verified PostgreSQL 18 bundle was restored into a separate database and storage tree, then migrated through 0010 without starting its task worker. Every existing column across all 28 original tables retained its row count and canonical fingerprint. Ten authenticated/readiness routes passed; a synthetic generated-file round trip verified the restored storage root, anonymous denial and cleanup. A second fresh backup preceded the actual forward migration. The same 28-table preservation check and ten HTTP checks passed on the live build before normal use resumed. The new worker enables one-off reminders and bounded saved text tasks; no autonomous computer tools were enabled.

Public documentation PR #5 deployed the 30-page handbook from source `a5be1bd`, with 57 exported file hashes and 28 edit destinations checked. The native wiki Home and sidebar were synchronized with its published task, image, attachment and execution guides.

## 2026-10-29 — streamed data release preparation

Integrated the bounded data-format slice with the reminder release, then corrected two mobile defects found in browser review: export controls could collapse a chart title to one character per line, and a fixed SVG viewBox shrank axis text to about 5.5 pixels. Source `8d9928b` wraps the header and measures actual chart width, preserves 13px axis text, reduces category-label density, wraps long legends and offers a table fallback below 200px.

The final chart candidate passed 216 web unit tests, eight recovery tests, 15 focused rich-data tests, six standalone HTTP records, production build, typecheck and documentation checks/build. The earlier combined release run also passed reminder, saved-task, pricing, privacy, image and attachment regressions. Real Chrome checks at 390px and 1440px measured 15px rendered label boxes, bounded legends and no page-wide overflow. Focus, disclosure state and the same chart identity survived resize and streamed-row completion. These are synthetic-provider and emulated-viewport checks, not physical-device tests.

One bounded live GPT-6 Luna request used the production format instruction and parser with OpenAI SDK 7.45.1. It completed in 154 text deltas; observed rows progressed from zero through three, retaining the supplied negative and missing values without invented sources. Usage reported 436 input and 158 output tokens; tools and provider storage were disabled. This verifies the direct SDK/display-format path for one request, not the entire browser journey or all models. The temporary credential remained outside Git and within its expiry/test allowance.

README, current status, gallery and wiki source now describe the implemented scope instead of retaining outdated baseline warnings. AI-09 remains in progress while the separate first-conversation navigation/focus correction is integrated. The candidate still requires exact-head GitHub checks before merge; the live demo remains on the verified reminder release.

## 2026-10-29 — additional execution review and reversible demo hold

Further adversarial review reopened SEC-04 for recovery and platform isolation verification. The local demo now has both application broker settings disabled; only its owned web and task-worker processes were restarted. The broker, VM, database, storage, authentication and encryption configuration were left intact. The production configuration helper rejected new execution requests and ten login/readiness/feature HTTP checks passed after reload. The previous private configuration is retained for controlled recovery, but execution will remain disabled until the additional checks pass. Earlier Linux results remain evidence for their original scope. The separate browser workspace also remains disconnected from the live demo pending independent acceptance.

The first PR #16 documentation check rejected a mismatch between the reopened SEC-04 generated page and its canonical JSON entry. The JSON source is now updated and the roadmap regenerated. Local documentation validation and rendering were rerun; the updated GitHub head must pass all required checks before merge.

## 2026-10-29 — reply identity and first-conversation continuity

Integrated frozen reply identity `23a480a` and routing `5fe9f27` with the rich-data release. Model metadata is authored by the server, persists with each reply, distinguishes requested/resolved/provider-reported identifiers and cannot be injected through chat input. Older records remain explicitly unknown. Stable render keys preserve an open data table and keyboard focus as the first reply receives its saved URL; persisted message IDs remain separate. Navigation, project/account changes and unmounts fence late stream results.

Application source matches the frozen combined routing candidate except for package-script ordering. That candidate passed 229 web and eight recovery unit tests and desktop/mobile browser checks. The new release checkout also passed a fresh production build, five model-identity/persistence HTTP records, 11 privacy records, six rich-data records, both attachment journeys and 14 image records against isolated fixtures. No provider credential or live schema was used. The just-created view intentionally keeps local message instances until leave/reload; cross-tab additions appear then, and unsaved stopped output can disappear on reload.

AI-09 now meets the bounded charts/tables acceptance criteria, including first-conversation focus. Search/history is in progress in a separate checkout. The execution hold remains active. This candidate still needs GitHub checks and a controlled demo release before deployment.

## 2026-10-30 — imported-state provenance and request limits

Review found that an unsigned imported provider response ID could be forwarded as hosted continuation state, including legacy records with no provenance. New HTTP regressions reproduced both paths against a local provider fixture. Imports now discard these identifiers; conversation chaining requires the latest assistant reply to have valid server-authored OpenAI identity metadata. The import allowlist drops that metadata, and voice writes text only. Full owned history is replayed when provenance is absent or later voice/text exists. The normal trusted continuation positive control still passes. Independent review found no blocking issue in these audited writers; future writers must preserve the same rule.

Import bodies now enforce actual streamed byte budgets for JSON and multipart data. A subsequent regression exposed Next.js middleware truncation at its default 10 MiB before the application could apply the documented 50 MiB import limit. Its buffer ceiling is aligned to 55 MiB, while individual routes keep their own budgets and imports retain a 50 MiB file limit plus a 64 KiB multipart envelope. Chunked oversize requests, valid multipart input, malformed JSON and Unicode multipart round trips are covered. The initial failing cases are retained as private QA evidence. No real provider state or user data was accessed.

The final candidate passed 229 web and eight recovery unit tests, typecheck, a fresh production build, eight model/import HTTP records (including a valid file exactly at 50 MiB), 11 privacy records, six rich-data records, both attachment journeys and 14 image records. Eight opt-in web tests remain skipped in the default unit command; the relevant standalone suites were run separately. The documentation build now validates the canonical roadmap before rendering, preventing the earlier JSON/generated-page mismatch from reaching a successful local build.

## 2026-10-30 — combined API, history and computer release preparation

Joined the published heads of execution #17 (`41110f8`), browser #19 (`48ac4ed`), task API #20 (`e3a0dc0`) and history #21 (`5a12411`) on chat main `b290c66`. Each feature head passed its own required GitHub checks. The only merge conflict was the public documentation allowlist; both feature guides are retained. The combined release will have its own final GitHub check rather than relying solely on independent feature tests.

Local combined application source `9830ea6` passed production build/typecheck, 253 web and eight recovery unit tests, and all 131 records in 19 database/HTTP/lifecycle files. This includes current import provenance/byte limits, origin-key dispatch, history migration/cancellation, account ownership, realtime/audio, images/attachments, data blocks, reminders and real backup/restore. Browser-service tests passed 38 cases and typecheck; execution tests passed 56 host-safe cases with nine Linux-only skips. The exact feature images separately passed real Linux isolation gates; the Mac run did not repeat those real-image browser/export checks. All 525 tracked runtime files retained their initial combined hashes, and the disposable database, files and server processes were removed.

Release instructions now require all migrations through 0012 and stopping every older worker before the originating-key upgrade. New source-authored search/browser screenshots use synthetic content and state their scope. The native wiki refresh is pending a locked Mac; canonical documentation and GitHub work continue. The live demo remains on the verified chat release with execution held until the dedicated runtime rollout is accepted.

## 2026-10-30 — combined release accepted and deployed

PR #22 merged at `f1ac09d` with all six checks green on its exact final head `7fccdca`, including the combined execution and browser Linux jobs. Public documentation PR #7 then deployed source `f1ac09d`; the handbook, history, browser, API, status and screenshot pages returned HTTP 200. Canonical wiki indexes include the new guides; native wiki editing still awaits an unlocked Mac.

The dedicated execution runtime was upgraded only after admission stopped and the owned Docker daemon was quiesced. Immutable images and audited source files matched the accepted revision. The local ARM tests and x86 compatibility CI establish distinct platform evidence. A separate browser runtime passed its private-control-plane, lifecycle, renderer and export checks. Both services retained their controller state and had no leftover test workloads.

A restored application proved real browser route ownership, takeover, command deduplication, expiry and 179-byte export/download behavior. The release execution adapter calculated 42 and saved 35 exact bytes through the v2 broker; actual file routes returned owner 200, foreign 404 and anonymous 401. An initially wrong fixture assumption about passive text disposition was preserved, corrected and rerun; production code did not change. No provider or model-directed orchestration was exercised. Synthetic resources were removed, preserving all 29 original table counts and original storage hashes.

The live upgrade stopped the verified old web and worker, took a new verified backup, applied 0011–0012 and preserved all original-column fingerprints across 29 tables. Twelve live HTTP checks passed before the matching saved-text/reminder worker resumed. Both accepted brokers are connected; autonomous browser agents, terminal/file editing and cloud tenancy remain unfinished. Immutable source checkpoints, the pre-upgrade backup and private deployment/rehearsal evidence remain available for recovery.

## 2026-10-30 — installable app release preparation

UX-05 adds a manifest and icons from the existing Polaris mark, accessible installation help and explicit per-tab update controls. Its opt-in service worker verifies and stores exactly five bounded public files. It never caches authenticated documents, APIs, files, RSC or provider responses. Drafts, attachments, streaming, uploads, dictation and open voice calls prevent reload, including a second check after worker activation. Other tabs are never instructed to reload.

Frozen release `f26031d` passed production build/typecheck, 266 web units, 13 focused PWA cases and 36 relocated standalone HTTP records spanning audio, model identity/import, privacy and PWA routes. All 621 tracked-source hashes remained stable during validation. Chrome fixtures proved opt-in, exact public-cache contents, focus return, a draft guard, waiting updates, preservation of another controlled tab and an offline fallback after stopping only the disposable server. Later cache-failure paths were covered by unit/HTTP checks. Native installation was not attempted while the Mac was locked; physical iOS/Android, Safari and installed-window behavior remain unverified. The added Compose packaging check requires the final GitHub run.

Root integration includes the independently built rollout documentation for the already-deployed `f1ac09d` runtime. The PWA runtime files remain identical to `f26031d`; global README, status, backlog, wiki indexes and screenshot gallery now describe the feature and its limits. Publication and live upgrade are separate release steps.

## 2026-10-30 — PWA publication and live rollout

PR #23 merged at `37ac185` after all six checks passed on head `52e3e6e`, including the new Compose PWA asset check. The demo upgrade stopped the old web/worker, captured a verified backup and preserved all 29 table fingerprints without a migration. Ten core HTTP checks, seven exact public asset checks and search/browser availability passed before the matching worker resumed. Public documentation PR #8 deployed 34 handbook pages, 32 public edit links and 67 export hash records; installation, status, recovery and screenshot pages returned HTTP 200. The native wiki update remains pending an unlocked Mac.

## 2026-10-30 — versioned text workflow release preparation

Frozen source `16822fd` on PWA main adds the bounded native workflow contract: one to four sequential OpenAI text steps, immutable definitions/revisions, durable fenced runs, six explicit API scopes, JSON editing/import/export and an executable Node client. Migration 0013 adds four tables. All 23 prior migration files and 607 main files outside the 57-path feature delta were unchanged. General graphs, tools, transforms, branches, parallel/approval nodes and external plugin compatibility remain unfinished; EXT-02/03 stay in progress.

Final production/type/docs checks passed, alongside 292 web units and 57 real PostgreSQL/standalone HTTP records. Fixtures ran the actual worker against scripted OpenAI responses and verified stateless requests, cancellation, current model authority, originating-key denial, migration preservation and existing task/reminder/API/PWA behavior. No paid request was made. Exact final publication CI is a separate gate.

Chrome testing at 390/1200px covered save/revision selection, a completed two-step run and output scrolling. It exposed a dirty-state bug caused by PostgreSQL JSONB key ordering; schema-normalized comparison now preserves meaningful array order and keeps Publish disabled until a real edit. Both the initial failure and passing regression are retained. API/client JSON round trips, including a near-limit pretty-printed definition, pass. Native file-picker automation is unverified because the extension required file-URL access; permissions were not broadened. Synthetic fixtures were cleaned and source checkpoints remain frozen.

### Workflow CI correction — 2026-10-30

PR24 first head116090f failed an existing computer allocation test because its 30-iteration timer expired before the filesystem reached the durable-intent hook. Production behavior was unchanged. The fixture now awaits an explicit barrier, still requires zero Docker mutations before acknowledgement, and settles creation before temporary-directory cleanup even on failure. All38 computer tests and type checking pass locally;12 concurrent targeted invocations pass. The original failing job log is retained with the local release evidence. The corrected head must pass the full GitHub suite before merge.

### Workflow publication and live upgrade — 2026-10-30

PR24 merged 5f8e4f0 after all six required GitHub checks passed 571ed558. The explicit allocation-test barrier correction also passed 38 computer units and 12 concurrent targeted invocations. A restored-copy rehearsal preserved 29 original tables across 0013 and passed 16 HTTP checks without starting a worker or contacting a provider. The live upgrade then stopped both writers, made a fresh verified backup, preserved all 29 prior table fingerprints and passed 18 HTTP checks before the matching text/reminder/workflow worker resumed. Rollback checkpoint: checkpoint/workflows-5f8e4f0. The public handbook export from this source passed 35 page/70 export-hash checks and deployed through docs PR10. Its 7 synthetic browser fixture files retain a separate verified manifest.

### Provider credential expiry — 2026-10-30

Frozen release 90a7adba adds an optional UTC cutoff in existing configuration, fresh authority/binding checks for hosted SDK and audio dispatch, atomic preservation of omitted settings/secrets, and an admin cutoff control. Saved keys and endpoints cannot be replaced by ambient SDK credentials or headers. Real loopback requests verify OpenAI and Anthropic wire headers; no paid provider call or private credential was used.

Production build, typecheck, docs and 317 web units pass; 10 opt-in test placeholders are skipped in that unit command, and 54 explicitly enabled database/HTTP records pass separately with no skips. These cover retained clients, dispatch after a database wait, key changes, chat/images/audio, queued tasks and between-step workflow expiry. Browser checks cover UTC save/reload/removal, natural expired status, 390-pixel layout and a concurrent-admin preservation race. All fixture databases and tabs were cleaned up. The 26 existing migration files are unchanged.

Already-dispatched requests and established WebRTC calls can continue. This is not remote revocation or a spending cap. Pre-guard rollback requires disabling/removing or revoking affected credentials before older code starts. Root documentation adds the recovery boundary, capability status and inspected screenshots; final GitHub checks and deployment remain separate release gates.

## 2026-10-30 · Provider expiry deployment and voice context

Provider expiry [PR25](https://github.com/Rhigo/Polaris/pull/25) merged at `f0c96ad` after all six required checks passed on final head `4caf1a6`. A stopped-writer backup preceded the local upgrade; all 33 existing table fingerprints were preserved, no schema changed, and 20 live HTTP checks passed. A temporary operator-supplied credential was then stored encrypted with an explicit cutoff. A metadata-only provider check confirmed availability without inference. Pre-guard rollback requires disabling/removing or revoking that credential; compatible database schemas do not preserve the dispatch guard.

The next voice slice includes bounded recent final-text context from owned saved or temporary chats. Listening waits for exact context, buffer-clear and session-configuration acknowledgements. Explicit recovery settles idempotent transcript writes before starting a fresh call and does not replay audio or tools. Route/account changes fence old callbacks. The retained legacy SDP protocol remains compatible.

Frozen combined candidate `99ca046` passed 337 web units, eight recovery units, 65 explicitly enabled PostgreSQL/HTTP test records, TypeScript, production and documentation builds. Ten opt-in integration placeholders in the ordinary unit command were skipped; the stated 65 records ran explicitly. The combined transport adds an expiry-between-preflight-and-setup regression with zero denied provider dispatch. Synthetic Chrome fixtures cover permission timeout, cancellation, interrupted setup, save failure, temporary history, fresh-call retry and mobile layouts. Root integration preserves the 13 application/test files byte-for-byte and adds release documentation.

`VOICE-01`, `VOICE-02` and `VOICE-03` remain in progress: broader project/file context parity, physical-device audio and live WebRTC acceptance are still explicit gates. There is no database migration, spend cap or provider-session resumption in this slice.

A subsequent bounded live workflow used `gpt-6-luna` through the normal authenticated API and separate worker. Its single step returned the exact synthetic marker, recorded 68 input and eight output tokens, and completed in one dispatch with no tools. The application model-token estimate was $0.0000108, not a provider invoice; the private test ledger retained a conservative $0.02 reservation. Only the owned synthetic workflow/run were removed after checking that no newer revision or additional run existed.
