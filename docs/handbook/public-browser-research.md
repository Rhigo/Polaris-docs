# Public browser research

Pal can research an operator-reviewed public catalogue in a fresh, isolated browser, produce an owned text report, and let the owner watch or take over. This is an opt-in pilot, disabled by default. The production test build passed a synthetic-model journey through an actual isolated Linux browser; integrated Linux CI, real-provider research and operator rollout remain separate gates. Existing text tasks, reminders, saved workflows and API keys do not start it implicitly.

Choose a reviewed site policy and an available image-capable OpenAI Responses model on Pal, read the destinations and disclosure, enter a goal, and select **Start public research**. The worker can observe the current public page, follow an exact visible approved link, scroll, or finish. It cannot type, submit forms, perform generic clicks, construct URLs, use a host terminal, or attach to a pre-existing human browser.

Watch uses the existing owned workspace viewer. Any human acquire, takeover, release or close operation revokes the agent grant irreversibly, including actions from another Polaris tab. A protective takeover does not wait for a database update to succeed. The broker drains in-flight observations and model-dispatch permits before granting human input; failed quiescence closes the workspace. Already-dispatched requests may finish remotely. Their late outputs cannot authorize another action or become a completed report after takeover.

Human control can include private input, but no further agent frame, URL, title, text or action is permitted on that profile. **Continue with a fresh profile** carries only the original goal into an explicit new attempt and requires renewed consent. Close the human workspace before starting. Cookies, storage, private pages and screenshots are never copied. The five-minute lifetime still applies after takeover.

## Policy and data

An operator supplies exact canonical HTTPS document URLs and optional exact resource URLs. No query strings, fragments, custom ports, URL credentials or arbitrary user destinations are accepted. Agent navigation and resource requests allow only GET/HEAD to that reviewed set. An opaque visible link reference is revalidated against the current observation before direct navigation; page click handlers are not executed. Page content is untrusted evidence and cannot expand the policy. Downloads are cancelled while Pal controls the profile.

Review the site's semantics before adding it: GET can have side effects, and a public origin alone is not evidence that every path is safe. Account, login, checkout and messaging pages are outside this pilot. The existing outside-Chromium proxy, private-address exclusions, syscall policy, renderer sandbox and resource limits remain required. This is not comprehensive data-loss prevention against a compromised browser process or an allowed shared CDN.

Screenshots and bounded public page text are sent to the configured provider for both token counting and inference. Model history stays in worker memory, uses `store: false`, and does not use provider conversations or previous-response IDs. This does not promise zero provider retention. No screenshot, raw DOM, private input, model reasoning or broker credential is written to run events. Persisted data includes the goal, reviewed policy, model identity, non-secret intent/outcome identifiers, counters and final report. Closed run history expires after thirty days; reports expire after seven days and use existing owner-checked download routes. Unresolved cleanup records do not expire automatically.

## Bounds and recovery

| Bound | Value |
| --- | --- |
| Active research attempts | One globally |
| Queued attempts | Sixteen globally; one per owner |
| Retained history | One hundred per owner; closed history pruned after thirty days |
| Goal / final report | 4 KiB / 64 KiB |
| Run / provider call / browser action | Five minutes / sixty seconds / ten seconds |
| Worker and broker lease / heartbeat | Fifteen seconds / five seconds |
| Model turns / browser commands / observations | Twelve / twenty / forty |
| Input tokens | 32,768 per call; 100,000 reserved cumulatively |
| Output tokens | 1,024 per call; 8,192 reserved cumulatively |
| Observation | 512 KiB JPEG, 12 KiB text, one hundred link references |
| Events | Two hundred per attempt |

Initial navigation counts as a browser command. Each provider dispatch and browser action has a durable intent before transport. The exact immutable model request is counted before inference. Unknown final usage retains its token reservation; usage and an outcome are recorded atomically once. Dollar estimates remain unknown for unverified model/endpoint pricing. There is no advertised dollar cap.

Cancellation aborts local transport and closes the agent profile. A worker crash or expired claim becomes interrupted; a new worker performs cleanup, never resumes the old claim. An uncertain action is inspected once by its command ID, never repeated. Explicit continuation creates a new attempt; it is not a retry of a previous external effect. Client and VM clocks must be synchronized; stale frames or lease deadlines fail closed.

An unconfirmed allocation response can leave an attempt without a workspace ID. An empty browser listing, HTTP 404, expired resources, janitor cleanup or worker restart does not prove that an old request cannot still create resources. The UI reports **operator recovery required** and new research remains blocked. Direct deletion and an account-deletion cascade cannot erase a pending hold. An administrator may disable the account while cleanup is resolved, then delete it after confirmation.

### Reconcile an unknown start

This is an operator-only maintenance procedure, not a web action or automatic retry:

1. Disable new public-research admission and stop every browser worker. Record the exact run UUID and its persisted `start` intent `commandId`; do not record credentials, screenshots or provider payloads. Preserve a database backup and the computer controller's persistent state.
2. Quiesce the dedicated computer host: stop its broker and janitor, close other workspaces, then restart that dedicated Docker daemon or VM. Confirm controllers remain stopped. A broker-only restart does not establish that a delayed daemon request has ended.
3. Follow the computer workspace's [uncertain-allocation recovery procedure](computer-workspace.md#recover-an-uncertain-allocation) for every retained workspace marker and exact labeled resource. Reconcile late resources and verify absence using the reviewed immutable images. Preserve unrelated resources; never prune broadly or delete controller state to restore capacity.
4. With workers and controller still stopped, run the reviewed application CLI against the correct database, passing only the exact retained run and start IDs:

   ```sh
   node --env-file=/private/browser-recovery.env --import=tsx scripts/pal-browser-worker.ts \
     --operator-reconcile --run-id=RUN_UUID --start-request-id=START_REQUEST_UUID \
     --attest-workers-controller-stopped-and-daemon-restarted
   ```

   The dedicated recovery configuration needs the database URL. The command refuses a different or already-known start and clears only that retained unknown-start hold. The flag is a human operator attestation; the command cannot independently prove daemon quiescence. It does not resume the old attempt or clear broker quarantine.

5. Restart the broker/janitor, confirm readiness and exact cleanup, then restart the dedicated worker and re-enable admission. A user must explicitly create any new attempt.

Never run this procedure against a shared daemon or claim successful recovery from a first empty resource listing.

## Operator wiring

Use the accepted dedicated Linux computer host with one broker replica and `COMPUTER_MAX_SESSIONS=1` for a local pilot. The execution service and its image pair are separate. Retain the named controller state volume across upgrades. The new protocol must be deployed and conformance-tested before enabling application research.

Set a fresh, distinct 64-character hex `COMPUTER_AGENT_KEY` and `COMPUTER_AGENT_POLICIES` on the broker. A policy is a JSON object with `id`, `title`, `startUrl`, `documents` and `resources`; the broker supplies its canonical SHA-256 hash. The app saves that exact hash and refuses a changed policy. An absent role/key is disabled, not a fallback to the human key. Never enable test tracing in production.

The web configuration retains only `COMPUTER_BROKER_URL`, its human `COMPUTER_BROKER_KEY`, and the explicit `PAL_BROWSER_RUNS_ENABLED=true` flag. The separate browser worker needs the same database/encryption configuration and broker URL, but **only** `COMPUTER_AGENT_KEY`; it refuses startup if the human broker key is present. Start `scripts/pal-browser-worker.ts` with a dedicated mode-0600 env file. Do not load the web `.env.local` into that worker. There is no raw provider key in worker configuration: the shared configured-client guard reads the current encrypted database binding and cutoff before every HTTP dispatch, including counting. A final synchronous lease/deadline check runs after that lookup, inside the broker dispatch barrier.

Legacy disconnected workspace clients remain valid. Missing agent configuration makes the research panel unavailable; it does not allocate locally or silently call another provider. Public research currently requires exact response-model identity and reviewed image-input/function-calling capabilities. An unreviewed returned alias blocks the attempt rather than guessing its identity.

## Verification and scope

Host-safe service/worker tests exercise delayed observations, every human-control entrypoint, scoped role denial, dispatch barriers, held credential-policy lookups, absolute expiry after a delayed timer, cancellation and late output. PostgreSQL tests exercise ownership, idempotency, account/model changes after lock waits, atomic accounting rollback, unknown-start restart holds, account deletion races and file-insertion rollback. The standalone HTTP gate uses a fresh database, isolated storage, synthetic credentials and a loopback provider fake while the real browser visits independently hashed public fixtures. It verifies reports, foreign/expired downloads, private synthetic input after takeover, fresh continuation, cancellation, killed-worker recovery and lost-start holds.

```sh
# Host-safe tests; no model calls.
cd services/computer
node --test tests/*.test.ts
cd ../../apps/web
node --import=tsx --test lib/pal/browser-runs/*.test.ts lib/pal/workspaces/*.test.ts lib/providers/credential-guard.test.ts

# A loopback PostgreSQL admin URL; each suite creates and drops its own database.
POLARIS_BROWSER_DB=1 node --import=tsx --test tests/integration/browser-runs-db.integration.ts

# Only a separately provisioned, empty disposable Linux browser deployment.
# Its private test config supplies the scoped keys and loopback broker URL.
POLARIS_BROWSER_HTTP=1 COMPUTER_DISPOSABLE_AGENT_CI=1 \
  node --env-file=/private/browser-test.env --import=tsx --test tests/integration/browser-runs-http.integration.ts
```

Run `tests/linux-agent.integration.ts` inside that disposable broker image with `COMPUTER_DISPOSABLE_AGENT_CI=1`, plus the existing renderer-sandbox, native/compat socket and outside-Chromium egress gates. ARM64 results do not cover x86 `socketcall`/x32; those require the separate x86 CI gate. UI checks use the normal computer-use tooling and synthetic accounts, never a user's profile.

This advances visible local browser work, activity/results and exclusive human takeover. It does not provide authenticated return-control, saved logins, arbitrary forms, personal-computer access, terminal/file editing, parallel agents, unattended cloud recovery, or automatic mobile takeover. Those remain separate capabilities.

Primary contracts reviewed 30 October 2026 with installed OpenAI SDK 7.45.1: [strict function calling](https://developers.openai.com/api/docs/guides/function-calling), [token counting](https://developers.openai.com/api/docs/guides/token-counting), [stateless conversation history](https://developers.openai.com/api/docs/guides/conversation-state), [computer-use integration responsibilities](https://developers.openai.com/api/docs/guides/tools-computer-use-integration), and [provider data controls](https://developers.openai.com/api/docs/guides/your-data). The pilot uses constrained custom functions, not the native computer tool or hosted Agents browser.
