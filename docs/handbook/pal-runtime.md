# Pal runtime decision

**Status: proposed architecture, checked against official documentation on 29 October 2026.** This is a design and contract review. It does not establish live account availability, measured reliability, or feature parity with the Codex or ChatGPT applications.

Pal should be a persistent assistant in Polaris: work survives a closed tab, users can see the browser, terminal and files, and they can steer, stop or take control. The product needs a durable run service and an execution environment as well as a model.

## Recommended direction

Build a **local Pal pilot using a supervised Codex App Server process**, behind a versioned runtime adapter. Keep permissions, schedules, runs, artifacts, budgets and UI in Polaris. The SDK suits simpler coding jobs. App Server offers richer client integration but documents experimental, unsupported production status. Pin its executable/schema, prefer stdio, and require a production release decision. [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk), [App Server](https://learn.chatgpt.com/docs/app-server).

Keep **Responses** as the direct model/tool adapter for existing chat and custom workflows. Add **Agents API** as an optional managed runtime when its cloud state and location rules fit the deployment. Its hosted Codex harness supplies orchestration, compaction and recovery; a self-hosted sandbox changes where tools execute, while the harness remains managed. [Runtime options](https://developers.openai.com/api/docs/guides/agents), [Agents architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture).

Use **Decisions** for bounded classification, routing and review signals. Application code must still enforce permissions and budgets. This division avoids making the persistent assistant depend on a classifier or treating an individual model response as a complete job runner.

## What each interface supplies

| Interface | State and execution ownership | Control surface | Best Pal use |
| --- | --- | --- | --- |
| Agents API, hosted environment | OpenAI owns the harness and environment; durable session IDs carry work across turns | Session inputs, events, required actions and cancellation | Optional managed unattended work |
| Agents API, self-hosted environment | OpenAI owns the harness; Polaris operates the executor and workspace | Same session API; outbound executor connection | Managed agent with private compute or local files |
| Codex SDK / App Server | Local Codex threads and local execution; Polaris supervises the process | SDK thread runs; App Server adds history, approvals, streaming and turn control | Local pilot with a custom workspace UI |
| Responses | Response/conversation state; Polaris owns workflow recovery and custom-tool execution | Streaming, background responses and supported WebSocket steering | Existing chat and workflows needing explicit orchestration |
| Decisions | A typed evaluation request | Predicate, choice and score answers | Low-cost routing or prioritisation inside a run |

Agents sessions can continue after individual turns, and input can steer active work. A self-hosted environment runs `codex exec-server`; it connects outbound using the session's environment ID and remote URL. Each session needs its own executor. Isolate environments by user or workload and keep the application's full API key outside them. [Agents overview](https://developers.openai.com/api/docs/guides/agents-api/overview), [Self-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted).

Responses can associate work with a durable Conversations object, or the application can manage context itself. That stored conversation does not supply Polaris's queue, execution lease or side-effect recovery policy. [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

There is no need to assume a separate universal “Codex REST API” contract: the documented managed harness interface is Agents API; the local integration choices are Codex SDK and App Server. An API model name alone does not select a local execution environment.

## Run, reconnect, steer and stop

Give every Pal run a Polaris ID, owner, runtime kind, remote session/thread ID, workspace identity, submission key, event cursor, lease and budget. Persist input before dispatch. Render progress from saved events so reconnecting a tab does not submit the task again. These are proposed Polaris records, not claims about existing implementation.

App Server provides thread resume and notifications, `turn/steer` with `expectedTurnId`, `turn/interrupt`, and PTY output/write/resize/terminate operations. Generate protocol types from the pinned executable. [App Server protocol](https://learn.chatgpt.com/docs/app-server).

For Agents API, save one idempotency key per logical input and subscribe before sending it. Send `agent.session.input.cancel` to cancel a turn while keeping its session. Inspect the final turn outcome; “idle” alone is not success. [Session lifecycle](https://developers.openai.com/api/docs/guides/agents-api/sessions).

After an Agents stream disconnect, subscribe again and buffer events, retrieve session state and saved items, then reconcile by item ID before applying buffered updates. Do not assume an arbitrary replay cursor exists. Retrieve current `required_actions` after restart. [Events and recovery](https://developers.openai.com/api/docs/guides/agents-api/sessions/events), [Managing sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage).

Responses supports mid-turn steering for GPT-6 over WebSockets. Track acceptance and failure separately; queued steering is connection-local, and steering does not undo previous actions or stop tools already running. Background responses have a cancel endpoint; synchronous work is cancelled by terminating the connection. Polaris must separately cancel its own tool processes and reconcile actions that already completed. [Steering](https://developers.openai.com/api/docs/guides/steering), [Background execution](https://developers.openai.com/api/docs/guides/background).

Agents API also documents scheduled automations targeting new or existing sessions. A local runtime still needs an awake daemon and scheduler. In either deployment, keep one authoritative schedule record and make each occurrence idempotent. [Scheduled automations](https://developers.openai.com/api/docs/guides/agents-api/sessions/automations).

## Visible work and user takeover

The proposed local workspace UI has three views: browser, terminal and files. Each uses the same owner-scoped environment as the agent. The browser needs an explicit automation adapter and an interactive viewing/control channel; an app-server connection by itself does not establish those capabilities. A local model call also cannot provide a browser display by itself.

Implement takeover as a control transfer: stop issuing agent actions, interrupt active execution, wait for acknowledgement, then grant the user control. When the user returns control, capture fresh browser/file state and resume from that state. Preserve output and unsaved work; do not replay pre-takeover clicks. A user typing into a terminal while an agent writes to it needs an explicit ownership rule.

The documented Agents computer-use path uses an OpenAI-hosted browser. It can emit activity screenshots when enabled, and it asks the application to handle website access and sign-in. Sign-in responses use a dedicated event, keeping submitted credentials outside model input and saved authentication response values. The documented flow supports passwords and verification codes, but excludes passkeys and QR sign-in. Screenshot history may omit image bytes, so authorised previews need deliberate capture and retention. The reviewed contract does **not establish unrestricted live desktop takeover**; test that requirement separately before promising it. [Managed browser contract](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use).

App Server offers browser and device-code login for Codex. Keep that separate from website authentication in the task's browser environment. [Account authentication](https://learn.chatgpt.com/docs/app-server).

## Local and cloud data boundaries

“Local” should describe execution and storage precisely. A local Codex harness can use remote inference; a self-hosted Agents executor still returns results to a cloud harness. List which files, screenshots, tool outputs and transcripts leave the machine for each run. Local backups and browser profiles also need deletion controls.

| Choice | Data policy consequence |
| --- | --- |
| Agents API, including a self-hosted sandbox | Managed session state persists; current residency is US-only and ZDR is unsupported. This excludes it where those constraints conflict with deployment requirements. |
| Responses / Decisions | Eligibility varies by endpoint, mode, model and account policy. Default abuse-monitoring retention can be up to 30 days. Responses storage defaults and temporary background storage require explicit review. |
| Conversations and uploaded files | Persistent objects need their own deletion/expiry lifecycle; turning off response storage is not a deletion command for other resources. |
| GPT-Live | Stored recordings have a separate policy; storage is off by default. Current residency includes US and Europe. Backend tools retain their own data policies. |

Check exact account eligibility before selecting a deployment region. `store: false` is not a blanket promise of no retention, and regional storage is distinct from regional processing. [Agents data boundary](https://developers.openai.com/api/docs/guides/agents-api/overview), [Endpoint data controls](https://developers.openai.com/api/docs/guides/your-data).

## Voice and image integration contracts

For new voice work, evaluate **`gpt-live-1`** with client delegation to the same Pal run service. GPT-Live handles a full-duplex spoken conversation while backend work proceeds. The application decides whether an interruption should also stop that work. [GPT-Live overview](https://developers.openai.com/api/docs/guides/live).

WebRTC creation uses `POST /v1/live/sessions` with JSON containing `session.model`, the delegation configuration, and `transport: { type: "webrtc", sdp: ... }`; the response supplies the session ID and SDP answer. This requires an adapter migration from the existing Realtime route, not a model-string replacement. Keep the API key server-side. [Create Live session](https://developers.openai.com/api/reference/resources/live/methods/create), [Migration guide](https://developers.openai.com/api/docs/guides/live-migration).

In client mode, `session.delegation.created` contains metadata rather than the task utterance. Assemble context from transcript events and saved Pal state, retain the delegation ID, and return verified updates through the appropriate append events. Visual input belongs to a vision-capable backend; the Live audio frontend does not directly accept images. [Delegation contract](https://developers.openai.com/api/docs/guides/live-delegation).

For images, use **`gpt-image-2.5-sunburst`** for precise editing or **`gpt-image-2.5-flare`** for everyday generation. Images API generation/edit endpoints take the image model directly. In Responses, select a supported mainline model and put the image model in the `image_generation` tool. Support final outputs and optional partial-image events without treating previews as completed artifacts. Store the resulting artifact with owner, model, input references and usage. [Image integration](https://developers.openai.com/api/docs/guides/image-generation).

The image reference records `gpt-image-1` as shut down on 23 October 2026. Use an explicit supported model and reject retired configurations before making requests. [Image reference](https://developers.openai.com/api/reference/resources/images/methods/generate).

Decisions uses `POST /v1/decisions` with **`gpt-6-luna`**, shared input and 1–400 typed questions. Its outputs are estimates: calibrate thresholds against labelled Pal tasks, and route uncertain cases to ordinary reasoning or human review. It does not grant access or execute a tool. [Decisions contract](https://developers.openai.com/api/reference/resources/decisions/methods/create), [Decision interpretation](https://developers.openai.com/api/docs/guides/decisions).

## Cost and resource accounting

Budget the whole task: model input/output and cache writes, subagents and retries, tools, image output, voice duration, compute, storage and external services. Local execution still has compute and model costs. Record unknown prices and missing usage as unknown, reserve a budget before a run, and reconcile estimates against provider accounting.

Agents usage is best-effort and can change; missing usage is not zero. Its usage fields do not expose every cache-write charge. Hosted sandbox compute is billed during active turns; self-hosted compute has its own infrastructure bill. [Agent accounting](https://developers.openai.com/api/docs/guides/agents-api/observability), [October billing change](https://developers.openai.com/api/docs/changelog).

Current examples: GPT-Live costs **$0.05/minute**, billed per second, so ten minutes is **$0.50 before backend/tool charges**. Decisions' uncached input is **$0.10 per million tokens**, with no output-token charge; caching and regional/long-context rules still apply. Image cost depends on token usage and settings. Recheck prices when implementing the cost registry. [Pricing](https://developers.openai.com/api/docs/pricing), [Decisions pricing](https://developers.openai.com/api/docs/guides/decisions).

## Capability and release-test matrix

All rows below are **acceptance work**, not completed live verification. Deterministic protocol fixtures should run in CI; account, device and deployment checks need separately recorded evidence.

| Capability | Required experiment | Passing evidence |
| --- | --- | --- |
| Durable work | Close UI; restart web service and local daemon; reconnect to the same run | Saved history and artifacts remain; no duplicate task or side effect |
| Event recovery | Drop stream mid-tool, duplicate/out-of-order events, paginate history | One coherent transcript with correct final state |
| Steering | Steer while generating and while awaiting a tool; lose connection after acknowledgement | Updated intent applied once, or clearly reported as unresolved |
| Stop | Cancel model, process tree and queued follow-up; repeat cancellation | No new side effects after confirmed stop; partial work preserved |
| Workspace isolation | Two users attempt foreign session, file, screenshot and terminal access | All denied; ownership checked again on reconnect and takeover |
| Browser takeover | Pause during navigation, edit a form manually, return control | Single controller; fresh observation; no stale click replay |
| Sign-in | Password, verification code, cancelled login and unsupported method | Credentials excluded from logs/model history; outcome verified |
| Schedules | Restart at a due time, cross DST, replay a queued occurrence | One bounded run per occurrence; disable/revoke stops future work |
| Voice | Interrupt, correct a prior detail, reconnect, repeat a transcript event | Correct Pal run/context; no repeated action; audio and backend stop behave as requested |
| Images | Generate, edit, stream partials, cancel, retry and attempt a foreign reference | Final image linked to the right owner; previews and failures distinguished |
| Decisions | Labelled routing set with uncertain and adversarial inputs | Measured false-positive/negative rates; deterministic access checks remain authoritative |
| Data and cost | Delete a run and its retained resources; exceed budget; omit usage | Auditable cleanup, bounded spend and visible unknown accounting |

Start with a bounded local task that edits a disposable file, runs a command and opens a test website. Demonstrate reconnect, steer, stop and takeover before adding connectors. Compare the same task against the managed adapter on completion rate, intervention count, latency, cost and retained data. Choose production defaults from those results and deployment constraints; retain the common Polaris policy and run records across runtimes.
