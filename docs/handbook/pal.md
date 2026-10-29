# Polaris Pal

**Product plan, not a shipped feature list.** Polaris Pal is the working name for a personal assistant that can talk, remember responsibilities and work in an inspectable computer. Saved appearance and a first [bounded text-task workflow](./pal-tasks) are implemented. That separate local worker saves task progress/results and supports cancellation; it makes one model request without tools. Multi-step responsibilities, computer control and connected-account monitoring remain planned.

## The experience

Open Pal to see what needs your attention, what it is doing and what it finished. Speak naturally or type while background tasks continue. Open a task to see evidence, files, errors and decisions. Stop a task without accidentally deleting its saved schedule. Resume work with its original context and workspace.

Customise a small companion with shapes, colours, eyes and accessories. Animation should explain a real state—listening, working, waiting or resting—and respect reduced motion. Appearance never substitutes for explicit text status. Mobile uses the same task history and permissions as desktop.

OpenAI's documented dots experience separates persistent responsibilities, conversation context, saved notes and scheduled work. It also distinguishes messaging channels from access to apps and computers. Pal adopts those product boundaries with its own implementation and permission model; access to an API does not automatically reproduce the application. [Tasks and memory](https://learn.chatgpt.com/docs/dots/tasks-and-memory), [Computers and apps](https://learn.chatgpt.com/docs/dots/computers-and-apps).

## The computer workspace

| Surface | Planned user experience | Release evidence |
| --- | --- | --- |
| Browser | Watch a dedicated Chrome/Chromium session, inspect tabs and URLs, take over mouse/keyboard, then return control | A two-client test proves only the lease holder can send input; agent input stops before human control begins |
| Terminal | See commands and output, open an interactive terminal, resize it and interrupt a process | PTY disconnect/reconnect, output limits and process cleanup work inside the isolated environment |
| Files | Browse workspace folders, preview/edit supported files, upload inputs and download outputs | Path traversal, symlinks, cross-user access, overwrite conflicts and large files are tested |
| Activity | Follow task steps, tool requests, approvals and results without exposing secrets | Reconnecting reconstructs saved events without repeating actions |
| Sign-in | Take over privately when a site requires authentication | Credentials avoid conversation history and model-visible logs; session retention and sign-out are explicit |

The first computer provider should run in an isolated Linux environment on the user's machine or server. A Mac uses a Linux VM/container runtime; generated commands never fall back to the host shell. Access to personal folders must be an explicit, narrow grant. Cloud execution is a separate provider with its own lifecycle and spending controls.

Watching is read-only. Takeover acquires an exclusive, short-lived control lease after pausing agent input. A disconnected controller loses its lease; control does not silently return to an agent with stale screen state. Return-control requires a new observation before the next action. The browser, terminal and file APIs all authenticate the same workspace owner.

The current Python code service does **not** meet this boundary. Its new resource and artifact protections reduce risk, but shared process identity and filesystem access remain. Per-run containers or VMs are a release prerequisite for untrusted multi-user execution.

## Responsibilities and proactive updates

Pal needs durable tasks, schedules, event subscriptions, an attention inbox and saved notes. Each responsibility records its owner, sources, time zone, budget, notification rule and allowed actions. Reminders must survive browser closure and worker restart. Retries must not send duplicate notifications or repeat external writes.

Email monitoring begins with a user-selected account and read scope. Useful findings go to the user's attention inbox; outgoing replies and changes use separately granted permissions. Quiet hours, urgency thresholds, snooze and unsubscribe belong in the same control centre. Connecting an account alone does not create a monitoring task.

Identity can continue across Polaris, Teams, Telegram or another supported channel while conversations remain audience-specific. Private notes must not leak into a group channel. Users can inspect, edit and delete saved notes, see their provenance and revoke a connection without losing unrelated settings.

Local unattended work requires the computer and worker to remain available. Cloud work can continue independently only after a cloud provider has actually been configured. Development automation used to build Polaris is separate from Pal's future product scheduler.

## Voice, images and live chat artifacts

The voice track evaluates GPT-Live alongside the existing Realtime integration, with interruption, typed interjections, call history and delegation to durable tasks. A call must remain responsive while a background task works. Microphone state must match the visible mute control, including permission prompts and reconnection.

The image track adds the current provider image-generation/editing contract, progress and partial-image events, cancellation, artifact ownership and usage accounting. Model IDs and supported parameters come from the versioned capability registry, not UI labels.

Charts and tables should stream into chat as validated data and rendering specifications. Provide accessible tables, source links and export alongside charts. Avoid executing arbitrary model-generated JavaScript in the application origin. Large datasets, malformed updates and mobile layouts are explicit test cases.

See [runtime decision](./pal-runtime) for the current Agents, Codex, Responses and Decisions comparison and live-contract release gates.

## First complete journey

1. Customise Pal and start an owned task with a small execution budget.
2. Close the browser; reopen it and recover the same task without redispatch.
3. Watch its isolated browser, inspect terminal output and open an output file.
4. Take control, complete a private sign-in and explicitly return control.
5. Call Pal while the task continues; interrupt its speech and steer the task.
6. Schedule a follow-up, restart the worker and receive one relevant notification.
7. Cancel the responsibility and verify no further scheduled runs or messages occur.

Each step must work with synthetic accounts before connecting real personal services. The [backlog](./backlog) tracks separate acceptance checks; a working customiser or workspace layout alone does not complete this journey.
