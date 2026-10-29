# OpenAI capability research

Research checked **29 October 2026** against official documentation. Model availability, API contracts and pricing change; recheck the linked source when implementing each adapter. Recommendations below are architectural conclusions for Polaris, not claims that these features already work in it.

## Models and request contracts

The current model catalogue includes newer GPT-6 families. Polaris still relies on several GPT-4/GPT-5/o-series name checks. Its OpenAI adapter and orchestration engine independently decide tool support, and reasoning levels are mapped to a smaller legacy set. Replace those guesses with a capability registry and pinned contract fixtures. [Model catalogue](https://developers.openai.com/api/docs/models).

Reasoning settings, sampling parameters and supported tools vary by model. The current guide describes restrictions on sampling when reasoning is enabled and model-dependent reasoning levels. Validate requests before sending them; do not assume every listed model accepts temperature, the same reasoning enum or the same native tools. UI controls should follow the selected capability record. [Current model guide](https://developers.openai.com/api/docs/guides/latest-model).

Polaris already uses Responses, which is a useful foundation. Preserve typed streaming events, function-call IDs, outputs, citations and provider message state rather than flattening everything to plain text. The current tool surface spans search/retrieval, custom functions, MCP, images, code and computer interaction; enable each through an explicit model/policy contract. [Tools overview](https://developers.openai.com/api/docs/guides/tools).

## Context, memory and long work

Provider conversation state and application memory solve different problems. Responses can chain state, while Conversations provide durable items. Polaris still needs its own ownership, project boundaries, portable history and deletion reconciliation. Temporary chat must define what is retained locally and remotely. [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

Compaction is more than truncating long tool strings. The documented APIs support server-managed thresholds and an explicit compaction operation with opaque output items. Preserve those items, required tool-call pairs and fresh instructions. Compaction should have evaluation fixtures proving useful facts survive long sessions. [Compaction](https://developers.openai.com/api/docs/guides/compaction).

## Realtime and GPT-Live

Polaris has an existing realtime implementation. First make it reliable: share selected context and policy, validate transcripts, track event identities, reconcile usage and test reconnect/interrupt behaviour.

GPT-Live is another current option: a full-duplex spoken conversation can continue while work is delegated to a backend agent. Evaluate it behind the same voice-session interface rather than treating it as a renamed drop-in endpoint. Compare delegation, latency, supported actions, interruption behaviour and duration-based costs. [GPT-Live guide](https://developers.openai.com/api/docs/guides/live).

WebRTC setup can use a trusted server for the SDP exchange; long-lived provider credentials must remain server-side. Test microphone denial, mute, dropped connections and mobile audio routing as first-class user journeys. [WebRTC guide](https://developers.openai.com/api/docs/guides/voice-webrtc).

## Dots and persistent assistants

Dots describes a persistent assistant experience with its own computer/browser, memory, proactive activity and connected channels. This review did not establish a public endpoint that embeds the entire Dots product inside Polaris. The product experience therefore needs application-level identity, durable work, approvals, notifications and account linking. [Dots documentation](https://learn.chatgpt.com/docs/dots).

There **is** a current Agents API worth evaluating. It supplies managed orchestration and durable sessions with hosted or self-hosted sandboxes. As documented at review time, its data residency is US-only and it does not support Zero Data Retention; using a self-hosted sandbox does not remove those limits. Compare it with a Polaris-owned worker before selecting the default backend. [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview).

The managed computer-use documentation includes browser/session integration. Polaris still owns account linking, visible progress, credential separation, user input requests, permissions and cleanup. A proof of concept should demonstrate reconnect and expiry before becoming a supported cloud browser. [Managed computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use).

The lower-level computer-use API is a separate integration choice: the application executes actions in an environment it controls and feeds results back. This means the application must implement isolation, page-state handling and policy enforcement. It is not permission to automate the user's Mac as Polaris's shared production backend. [Computer use](https://developers.openai.com/api/docs/guides/tools-computer-use).

## Images, files and connected tools

The image documentation covers generation and editing through current image models and Responses integration. Upgrade Polaris's contracts through recorded events and opt-in live tests, including input images, output files and applicable account verification. Avoid changing only the default model name while leaving legacy payload assumptions intact. [Image generation](https://developers.openai.com/api/docs/guides/image-generation).

MCP can connect hosted or reachable tool servers, but it is not a substitute for account authorization. Polaris needs discovery, declared schemas, explicit tool permissions, credential handling and lifecycle tests. The current OpenAI documentation also distinguishes remote MCP and Secure MCP Tunnel from older connector compatibility. [MCP integrations](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

Pin a stable MCP protocol and negotiate support. The stable transport specification includes initialization/session and content-negotiation requirements that a single handcrafted `tools/call` request does not implement. Do not mix draft transport changes into a claimed stable adapter. [Stable MCP transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).

## Retirement and cost work

The published deprecation schedule includes the current mini TTS path in January 2027, transcription changes in February 2027 and additional model retirements. Polaris's audio defaults and older model catalogue need a dated migration checklist before those deadlines. Recheck exact shutdown dates and recommended replacements before shipping; do not automatically migrate stored settings without a compatibility test. [Deprecations](https://developers.openai.com/api/docs/deprecations).

Unknown pricing must display **unknown**, not zero. Separate model tokens, cached input, audio duration, tool calls, storage and compute in usage records. Keep pricing source/date with the price version and reconcile provider usage after interruptions. This is a Polaris design requirement; no fixed cost forecast was made in this review.

## OpenWebUI-style extensibility

OpenWebUI Functions distinguish Pipes, Filters, Actions and Events, with Valves/UserValves for configuration. Its Python execution model requires trusted code. Polaris's existing OpenWebUI router script is an external integration example with unfinished storage hooks, not a compatible in-app pipeline runtime. [Functions documentation](https://docs.openwebui.com/features/extensibility/plugin/functions/).

Implement a typed, versioned pipeline model first, then a declared compatibility subset. Support input/output hooks, routing, model/tool nodes, bounded parallelism, approvals, traces and secret references. Arbitrary imported Python should run only in an isolated worker with declared permissions. Test compatibility against specific extension examples and versions rather than advertising universal support.

## What people are using dots for

Public first-person reports add useful test journeys to the official [capability inventory](./dots-parity). These are selected anecdotes, not a reliability survey or verified platform contracts.

| Reported workflow | Implication for Polaris testing |
| --- | --- |
| Inbox/calendar/logistics assistance, with useful routine alerts but missed important messages in one hands-on trial | Track checked sources and failed checks; evaluate urgency on a labelled synthetic inbox. [Hands-on account](https://zapier.com/blog/chatgpt-dots/) |
| A multi-day PDF review that continued around interruptions, while environment availability caused other work to wait | Persist checkpoints, identify the actual executor and test queued work resuming after recovery. [Original user report](https://www.reddit.com/r/OpenAI/comments/1wuznlr/i_spent_a_day_poking_dots_with_sticks_heres_what/) |
| Software planning that could not reach the intended local project environment | Bind task delegation to an explicit project, computer and setup; verify the resulting preview and patch are accessible. [Original discussion](https://community.openai.com/t/let-dots-delegate-prepared-tasks-to-local-project-sessions/1404008) |
| Generated Word/Excel work whose attachments could not be delivered | Verify creation, durable storage, download access and delivery separately. [Original incident report](https://community.openai.com/t/dot-cannot-deliver-generated-word-excel-attachments-tools-list-http-403-on-oct-20/1408057) |
| Additional approval did not clearly reach delegated work | Bind approval to the exact run, payload, recipient and revision, then acknowledge its application. [Original report](https://community.openai.com/t/dots-explicit-approval-isn-t-carrying-through-delegated-tasks/1402896) |

The proposed tests are engineering inferences from those reports. They do not establish that a reported October problem still exists. Planned meeting follow-up and unavailable video playback were not counted as demonstrated successes.

Hermes describes separate memory, delegation, schedules and execution backends; OpenClaw documents explicit jobs with context, delivery policy and observable history. Those are useful design references for Pal's inspectable responsibilities. Neither project's terminology alone proves tenant isolation or recovery guarantees. [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), [OpenClaw automation](https://docs.openclaw.ai/automation).

## Research follow-through

Every live provider experiment records model/version, SDK version, request shape, expected events, retention implications, measured usage and failure cases. A successful docs lookup is evidence of feasibility, not an integration test. Account-specific availability and paid operations remain explicit gates in the [backlog](./backlog).
