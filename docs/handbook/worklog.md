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
