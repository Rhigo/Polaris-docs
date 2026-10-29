# The Polaris update programme

The goal is a coherent, self-hosted AI workspace with a polished mobile experience, modern provider APIs and persistent assistants that can complete bounded work. Feature parity is tracked as user journeys; no single API call supplies the whole ChatGPT product.

## Release sequence

| Stage | Outcome | Release evidence |
| --- | --- | --- |
| **M0 · Establish the baseline** | Current documentation, audit, research, screenshots and a tracked backlog | Docs build, verified baseline tests, private/public content separation |
| **M1 · Make the foundation dependable** | Reliable install/upgrade, access controls, input validation, bounded execution and regression CI | Clean install + upgrade on PostgreSQL 16; negative auth tests; restore rehearsal |
| **M2 · Make Polaris pleasant everywhere** | Design system, navigation, composer, mobile/PWA, search and artifact UX | Desktop/mobile browser tests, keyboard checks and before/after screenshots |
| **M3 · Modernise AI and voice** | Capability registry, current Responses contracts, shared context, compaction and robust realtime voice | Provider fixtures + explicit live smoke tests; voice interruption/reconnect and usage checks |
| **M4 · Make it programmable** | Scoped API keys, documented API, credential vault, pipelines, OpenAPI and MCP | Contract tests, extension conformance and negative permissions tests |
| **M5 · Let work continue** | Durable runs, schedules, checkpoints, memory, steering, approvals and proactive updates | Restart/retry/replay tests; predictable budgets and no duplicated external actions |
| **M6 · Give Pal a computer** | Local and optional cloud compute, browser/terminal/files, takeover and resource cleanup | Cross-user isolation, expiry, network policy, sign-in handoff and cost reconciliation |
| **M7 · Connect everyday tools** | Microsoft, Google and messaging/calendar channels | Provider test accounts, OAuth/webhook checks, revoke/delete tests and account verification |
| **M8 · Complete the product** | Collaboration, assistant templates, portable data, evaluations and a supported release | End-to-end evaluation set, load/accessibility checks, upgrade and recovery runbooks |

Stages describe release boundaries, not an instruction to postpone every user-visible improvement until all infrastructure exists. M2 can follow the first reliable regression harness; the model-retirement work in M3 should be pulled forward ahead of documented shutdown dates. M4's vault and M5's run engine must precede connected external actions.

OpenAI is the first implementation target. Shared interfaces must describe actual provider capabilities so Claude and Ollama/local models can participate where supported. An unsupported local capability must not silently send content to a cloud provider.

## The first implementation batch

1. Fix fresh install and readiness (`REL-01`) and turn that scenario into CI.
2. Fix immediate access revocation and ownership (`SEC-01`, `SEC-02`).
3. Harden realtime ingestion (`SEC-03`) and validate the same policy across text and voice.
4. Isolate execution (`SEC-04`) before expanding cloud or plugin capabilities.
5. Add browser/database regression coverage (`REL-02`), then start the design system and mobile shell.

Each item is a focused branch/PR with its own tests, documentation and rollback notes. Security fixes can be separate from install fixes to keep review and reverts small.

## The full feature list

The [102-item backlog](./backlog) contains stable IDs, priorities, dependencies and measurable acceptance criteria. `docs/handbook/backlog.json` is the source of truth; the readable list is generated and checked in CI. “Done” refers to the current branch deliverable; a deployment or release is recorded separately in the [work log](./worklog).

Effort is deliberately not presented as a guaranteed calendar estimate. OAuth reviews, provider access, live voice/device testing and cloud infrastructure can dominate elapsed time. Each larger feature starts with a narrow vertical slice and a feasibility checkpoint.

## Pal product direction

The [Pal experience](./pal) makes the browser, terminal, file explorer, custom appearance, proactive responsibilities and voice orchestration explicit. The [runtime decision](./pal-runtime) separates local Codex integration, managed Agents sessions, direct Responses and Decisions classification. Local computer support is a first-class target; paid cloud execution is optional.

## Decisions needed at the relevant stage

| Decision | Working assumption | When it becomes necessary |
| --- | --- | --- |
| Product audience | Multi-user self-hosted installation | Before API quotas, billing or public onboarding |
| Mobile delivery | Responsive web + PWA first | Before a native iOS/Android wrapper |
| Cloud backend | Adapter interface; compare one managed and one self-hosted option | M5/M6 spike, before provisioning paid resources |
| Data location | Preserve deployment choice; managed APIs have their own retention/location constraints | Before selecting a managed agent backend |
| Accounts | Separate provider OAuth/bot registrations with dedicated test users | Before live connector tests |
| Budgets | Deterministic mocked tests first; live runs require an explicit small ceiling | Before spending on model/compute/browser tests |
| Publishing | Curated documentation can be public; historical chats and detailed audit notes remain repository-only | Before enabling GitHub Pages |

None of these decisions prevents source work, fixtures, documentation or contract tests from proceeding. Actual account consent, a missing cloud budget or an unavailable paid API is recorded as a narrow blocker, while independent work continues.
