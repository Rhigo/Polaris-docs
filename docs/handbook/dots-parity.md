# Dots capabilities and the Pal parity plan

**Evidence checked: 29 October 2026. Status: requirements inventory, not a parity certification.** This inventory covers every section of the six official Dots guides, the launch and product pages, the October mobile/texting updates, and relevant administration, privacy and safety documentation. Related Work/Codex features are identified separately. Marketing examples are test cases, not evidence that every account can complete them reliably.

The **OpenAI behavior** columns paraphrase the cited sources. The **Pal acceptance journey** columns are original proposed tests using synthetic accounts and data. Passing a helper test, displaying a computer tab, or selecting the same model does not establish an end-to-end match. No live Dots account, paid provider call, personal mailbox, or real purchase was used for this review.

## Reading the inventory

- **Documented**: the current product documentation describes the behavior, subject to its conditions.
- **Limited**: rollout, platform, account, workspace or integration restrictions apply.
- **Showcase**: an advertised example, illustration or demonstration, not a reliability guarantee.
- **Future**: announced, previewed or explicitly unavailable; not counted as a current feature.
- **Adjacent**: documented for Work/Codex or another surface; not automatically promised by the Dots interface.

Polaris states are **Foundation** (related implementation exists), **Preview** (Pal appearance/home work is in progress), **Planned** (a backlog item exists), or **Gap** (feasibility or acceptance coverage is incomplete). A Foundation label never means the whole row works through Pal. Backlog identifiers refer to the [canonical backlog](./backlog); the [runtime decision](./pal-runtime) explains the implementation boundary.

Existing foundations include chat, projects/files, generated-file downloads and HTML/code previews, user memories, skills/functions, administration, and the realtime voice panel. The M1 changes add tested principal revocation, ownership and transcript protections. Subsequent slices added bounded saved tasks/workflows, one-off local reminders, an isolated human browser and an opt-in public browser research candidate. These do not establish general connected-account monitoring, personal-computer pairing or cross-channel Pal. Appearance and home controls are implemented, with broader PAL-01/PAL-02 acceptance still tracked.

### Implementation evidence · 30 October 2026

The [public research pilot](./public-browser-research) advances LOC-01/LOC-02, CLOUD-04 and RUN-01/RUN-03 through explicit reviewed-page consent, watched browser frames, a durable bounded worker, an owned report and irreversible agent revocation on human takeover. Synthetic-model tests used a real Linux browser, including private-input fencing and continuation in a fresh profile. This is partial implementation evidence for the computer/control journeys below, not a completed parity row. Integrated x86 CI, real-provider research and operator rollout remain gates; authenticated return-control, terminal/files, cloud tenancy and general orchestration remain open.

## Access, identity and setup

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D01 | Limited: Pro access is for adults outside EEA, UK and Switzerland; Business Premium and Enterprise have workspace/region gates. | [Getting started][H] | Gap: independent product eligibility; OPS-01, RUN-07 | Publish Pal's own provider, deployment and connector support matrix; reject unsupported combinations before onboarding. |
| D02 | Documented: name, generated handle, shape, colour, eyes, glasses and accessories can change. | [Overview][O] | Preview: PAL-01 | Save a renamed companion and appearance; sign in on a second device and verify identity and accessible labels. |
| D03 | Documented: available characters or a pet can represent a dot; generated pets may be offered. | [Getting started][H] | Planned: PAL-10, AI-07; presets PAL-01 | Import or generate an approved animated asset; validate format, size and reduced-motion fallback before activation. |
| D04 | Documented: onboarding introduces the dot and suggests help from available context; app connection is optional. | [Setup guide][D] | Preview shell; planned PAL-02, PAL-09 | Start with no connectors, then add one synthetic source; suggestions must identify their evidence and unavailable tools. |
| D05 | Documented: mobile creation, customisation, plugin connection and opening directly to the dot arrived in October. | [October mobile update][U] | Preview/Planned: PAL-01, PAL-02, UX-04, UX-11 | Complete setup on a phone, relaunch to the chosen home destination and continue the same responsibility on desktop. |
| D06 | Limited: native mobile apps and desktop web/app are supported; mobile web is not a Dots surface. | [Setup guide][D] | Foundation responsive web; planned UX-04, UX-05 | Test Pal's intended mobile web/PWA journey on iOS and Android; describe this delivery difference explicitly. |
| D07 | Documented: the main dot uses GPT-6 Astra; delegated product model controls are separate. | [Overview][O], [Admin guide][A] | Planned: AI-01, RUN-07, RUN-08 | Record orchestrator and child-task model/version separately; an unavailable model produces a clear alternative or stop. |
| D08 | Limited: dot conversation and delegated Work/Codex usage follow different allowances; deeper work has limits. | [Overview][O] | Foundation usage screens; planned AI-05, RUN-04 | Display orchestration, child tasks, voice and compute costs separately; exhaust a synthetic budget without orphaning work. |

## Responsibilities, delegation and proactive work

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D09 | Documented: ongoing responsibilities continue between conversations; later instructions can redirect them. | [Setup guide][D] | Planned: RUN-01, RUN-03, PAL-05 | Assign an offsite checklist, close the browser, change the budget later and recover the same run and revision history. |
| D10 | Documented: parallel background agents report back while the owner keeps conversing. | [Tasks and memory][T] | Planned: RUN-01, RUN-04, PAL-03 | Run two bounded investigations while answering a new question; retain separate results, failures and parent links. |
| D11 | Documented: a dot chooses when to pause and wake; fixed schedules are optional. | [Tasks and memory][T] | Planned: PAL-05, RUN-02 | Save an event-dependent follow-up, restart the worker and wake once when its condition becomes true. This is not host power-on. |
| D12 | Documented: recurring work records timing, timezone, end date and delivery; schedules can be inspected or changed. | [Tasks and memory][T] | Planned: RUN-02, PAL-05 | Cross a daylight-saving transition, modify the end date and prove one execution per occurrence with no runs after cancellation. |
| D13 | Documented: existing Work automations can be read and edited. | [October mobile update][U] | Planned: RUN-02, PAL-05 | List existing Pal schedules, edit one by stable ID and confirm its next occurrence without creating a duplicate. |
| D14 | Limited: source-supported events can trigger work; connecting a source alone does not establish monitoring. | [Tasks and memory][T] | Planned: RUN-02, CON-01, PAL-05 | Connect a test channel without a monitor, then add a named event rule; only the latter may launch a run. |
| D15 | Documented: proactive research reads permitted sources and produces private notes; its tools cannot write, message or control computers. | [Safety architecture][S] | Planned: PAL-09, RUN-04 | Inject a request to email data into a monitored document; the research worker must lack every outbound-write and computer-control tool. |
| D16 | Documented: research findings can become suggestions; follow-up actions need their own applicable authorization. | [Tasks and memory][T] | Planned: PAL-09, PAL-04, RUN-03 | Detect an invoice omission, show evidence and a draft, then require the applicable action grant before any external submission. |
| D17 | Documented: cloud child threads are visible across devices and can receive direct or coordinator follow-ups. | [Tasks and memory][T] | Planned: RUN-01, RUN-03, PAL-02 | Open a child task on another device, steer it and verify the coordinator sees the resulting revision and remaining blockers. |
| D18 | Limited: local tasks need a connected computer; cloud coding needs a prepared Codex environment. | [Tasks and memory][T] | Planned: LOC-05, CLOUD-01, RUN-08 | Select an explicit repository/environment; unavailable setup blocks dispatch instead of silently choosing another workspace. |
| D19 | Documented: tasks retain their original environment; selecting another computer does not move them. | [Tasks and memory][T] | Planned: CLOUD-01, RUN-03 | Switch the default executor during a job; retain its original workspace and require an explicit, audited migration operation. |
| D20 | Documented: a child receives selected instructions and has its own conversation, not the owner's entire history. | [Tasks and memory][T] | Planned: AI-03, RUN-05 | Delegate with a minimal context manifest; assert that unrelated private conversations and credentials never enter child input. |

## Memory and context

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D21 | Documented: conversation context, ChatGPT memory and a dot's saved notes serve different purposes. | [Tasks and memory][T] | Foundation user memories; planned AI-03, RUN-05 | Show the context sources used for an answer and distinguish stored facts from temporary task evidence. |
| D22 | Documented: past ChatGPT conversations can be searched; October expanded Codex-thread and automation context. | [October mobile update][U] | Planned: UX-06, AI-03, RUN-08 | Find an earlier Polaris decision by content, cite its owner-scoped source and apply it to a new task. |
| D23 | Documented: calls may use a different selected context from background tasks. | [Tasks and memory][T] | Foundation voice; planned VOICE-02, PAL-03 | Ask by voice about a child result; refresh its saved state and identify unavailable context instead of claiming full recall. |
| D24 | Documented: memory sharing is ongoing and bidirectional; disabling it does not erase received context. | [Privacy FAQ][F] | Foundation memory toggle; planned AI-03, RUN-05 | Disable future extraction and separately remove a retained fact; verify both effects in subsequent prompts. |
| D25 | Documented limitation: individual dot memories cannot currently be inspected, edited or selectively deleted. | [Privacy FAQ][F] | Planned improvement beyond Dots: PAL-08 | Inspect, correct, export and forget a particular Pal note with provenance; verify it disappears from future context. |
| D26 | Documented: one dot retains relevant context across channels while visible message histories remain separate. | [Messaging][M] | Planned: PAL-07, RUN-05 | Start privately, continue in a test team channel, and retain task identity without copying the private transcript. |
| D27 | Documented: context from another audience does not authorize its disclosure. | [Messaging][M] | Planned: PAL-07, CON-11 | A private salary note must not appear in a public project update; ask the owner about the concrete disclosure instead. |
| D28 | Documented: disconnect stops new source access, not previously retained context. | [Privacy FAQ][F] | Planned: EXT-01, CON-11, PAL-08 | Revoke a connector token, block the next read and offer a separate operation to remove its retained notes. |

## Channels, notifications and voice

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D29 | Documented: updates can be directed to different channels according to their importance. | [Messaging][M] | Planned: RUN-06, PAL-04, PAL-07 | Route routine progress to the task and a blocked decision to the chosen inbox; retry delivery without duplicates. |
| D30 | Documented: Slack supports owner DMs and channel mentions; responding to others requires direction and permission. | [Messaging][M] | Planned: CON-12, PAL-07 | Link an owner, mention Pal in a fixture channel and reject a different participant's attempt to initiate privileged work. |
| D31 | Limited: Slack identity and the owner's Slack plugin are separate connections; admin/app approval and member setup may be required. | [Admin guide][A] | Planned: CON-12, CON-01, CON-11 | Disable bot participation, then explicitly revoke the separate data connector; show which capability remains after each step. |
| D32 | Limited: Teams is advertised, but the administration guide specifies an invite-only alpha. | [Admin guide][A] | Planned: CON-03 | Install Pal in a test tenant, prove supported permissions and document its actual availability rather than borrowing OpenAI's rollout claim. |
| D33 | Limited: US Pro texting beta supports one-to-one text, photos and voice messages over iMessage/RCS. | [October texting update][X] | Feasibility gap: CON-13 | Prove an officially supported provider, verified sender binding and attachment handling before offering any phone channel. |
| D34 | Documented: texting verifies a number, excludes group chats/phone calls/FaceTime, and links approvals back to ChatGPT. | [Messaging][M] | Feasibility gap: CON-13, RUN-03 | Reject an unlinked sender and a group delivery; bind approval links to the owner and exact pending action. |
| D35 | Limited: Linq provides texting; it cannot read other text conversations. | [October release notes][X2] | Feasibility gap: CON-13, EXT-01 | Publish the provider/data boundary; never imply a public self-hosted iMessage API or access to a user's phone inbox. |
| D36 | Documented: STOP ends outgoing texts; carrier charges may apply; Business/Enterprise texting is excluded. | [Getting started][H] | Feasibility gap: CON-13, RUN-06 | Send STOP in a test channel and prove queued notifications are suppressed while unrelated Pal activity remains intact. |
| D37 | Documented: users can call, type during calls and keep assigned work running after hang-up. | [Messaging][M] | Foundation realtime panel; planned PAL-03, VOICE-02, VOICE-03, VOICE-04, VOICE-05 | Discuss two active jobs, type a correction, mute during permission acquisition and end the call without duplicating or cancelling jobs. |
| D38 | Future: dot-initiated calls are planned, not a documented current capability. | [Messaging][M] | Gap: PAL-03, UX-11, CON-13 | Until an opt-in delivery contract is proven, send a notification with a user-controlled call action. |
| D39 | Limited: iOS 1.2026.279+ rollout adds widget/Shortcuts messaging, dictation and calls; Action Button invokes shortcuts. Dictation excludes active calls. | [Messaging][M] | Planned: UX-11 | Test owner authentication, widget name/appearance, optional buttons defaulting off, each shortcut mode and returning to an existing call. |
| D40 | Adjacent: desktop notifications distinguish completions, permissions and questions; OS permission is separate. | [Notifications][N] | Planned: PAL-04, RUN-06 | Deny OS notifications, retain the attention item, then enable alerts and verify category and quiet-hours settings. |
| D41 | Documented condition: computer camera, microphone and screen access need host connection and device permissions. | [Privacy FAQ][F] | Foundation microphone; planned VOICE-06, LOC-05 | Grant one source, revoke it mid-session and prove capture stops without retaining unintended frames or audio. |

## Cloud computer, personal computer and sign-in

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D42 | Documented: cloud work continues with personal devices off and retains workspace state between uses. | [Computers and apps][C] | Planned: CLOUD-01, CLOUD-02, RUN-01 | Turn off the client, restart the worker and recover the same owned browser/files; expose expiry instead of promising indefinite storage. |
| D43 | Documented: a dot has isolated Linux/Chrome execution; enforcement systems remain outside its writable environment. | [Safety architecture][S] | Hardened service foundation; planned SEC-04, LOC-01, CLOUD-02 | Attempt cross-user filesystem access and modification of the policy service from generated code; both must fail in Linux isolation tests. |
| D44 | Documented: desktop viewing is separate from Take over and Return control. | [Computers and apps][C] | Planned: LOC-02, CLOUD-03, PAL-06 | Two clients observe one browser; only the lease holder inputs, agent actions pause, and resumption requires a fresh observation. |
| D45 | Limited: the help page says opening the computer on mobile gives the user control. | [Getting started][H] | Planned: UX-04, LOC-02 | Show the mobile control owner explicitly; verify touch, rotation and disconnect cannot leave concurrent agent input enabled. |
| D46 | Limited: one personal computer can be connected; it must remain online with the desktop app open. | [Computers and apps][C] | Planned: LOC-05 | Pair one fixture host, inspect grants, take it offline and queue only jobs whose declared policy allows waiting. |
| D47 | Documented: offline preserves the grant; revoke removes it; Codex pairing and Work Sync are separate permissions. | [Computers and apps][C] | Planned: LOC-05, SEC-01 | Distinguish unavailable, disconnected and revoked hosts; no alternate pairing may silently restore a revoked Pal grant. |
| D48 | Limited: local files, code, apps and skills become usable through separately created local tasks. | [Setup guide][D] | Planned: LOC-05, RUN-08; isolated alternative LOC-01 | Grant one folder and app, invoke a local skill, and reject reads or commands outside that grant. |
| D49 | Documented: a blocked cloud website may prompt a local attempt; sessions do not transfer and success is not guaranteed. | [Computers and apps][C] | Planned: LOC-05, CLOUD-03 | Simulate cloud blocking, require an explicit executor change and authenticate afresh without copying cookies between environments. |
| D50 | Documented: supported private sign-in pauses work and keeps credentials outside model context; pasted secrets are outside that protection. | [Safety architecture][S], [Privacy FAQ][F] | Planned: PAL-06, EXT-01 | Complete a synthetic login and verification code; inspect model input, events, screenshots and logs for secret leakage. |
| D51 | Documented: website takeover is another sign-in path; sessions can persist until sign-out or expiry. | [Computers and apps][C] | Planned: PAL-06, CLOUD-03 | Take over for an unsupported challenge, return control, then expire the session and verify a new handoff request. |
| D52 | Documented: optional saved logins are distinct from active sessions; reusing one for sign-in needs confirmation. | [Computers and apps][C] | Planned: PAL-06, EXT-01 | Save an encrypted fixture login, sign out, reject reuse once, then approve the named account without exposing its secret. |
| D53 | Limited: desktop v26.929+ and workspace grants apply to local access; cloud coordination still processes task context. | [Local-access policy][L] | Planned: LOC-05, OPS-01, AI-03 | Pair a supported daemon version; display which content leaves the host and reject incompatible clients before dispatch. |
| D54 | Documented limit: local tasks do not automatically migrate to cloud; admin revocation may leave authorized work finishing. | [Local-access policy][L] | Planned: LOC-05, RUN-03 | Define Pal's revocation deadline, interrupt or drain explicitly, and never relocate an in-flight job without user-visible state transfer. |

## Tools, artifacts and adjacent work surfaces

These rows avoid assuming that every Work/Codex feature is available inside the dot's own cloud-computer view. A visible terminal and file explorer are explicit Pal requirements, even where Dots documentation establishes only tool execution or delegated-task access.

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D55 | Documented: supported installed plugins use their connected accounts and action permissions; local skills require a host. | [Computers and apps][C] | Foundation functions/skills; planned EXT-01, EXT-05, EXT-06, EXT-07 | Connect a test tool with read-only scope, inspect discovery and revoke it; no hidden credential or write capability may remain. |
| D56 | Showcase: the launch advertises an ecosystem exceeding 4,000 apps, not universal entitlement or identical connectors. | [Launch][P] | Gap in breadth: EXT-07, CON-01, CON-02, CON-03, CON-04, CON-05, CON-06, CON-07, CON-08, CON-09, CON-10, CON-11, CON-12, CON-13 | Publish a tested connector catalogue with supported operations, accounts, regions and limitations rather than a parity-by-count claim. |
| D57 | Documented examples: Gmail, Drive and GitHub support permitted mail, documents and code work. | [Overview][O] | Planned: CON-04, CON-10, CON-14, EXT-05, EXT-06 | Read a permitted email, revise an ACL-protected document and prepare a repository change; verify permission revocation for each. |
| D58 | Adjacent: browser extension supports existing Chromium-family tabs with per-site controls; setup/browser support varies. | [Browser extension][E] | Planned: LOC-05, LOC-02 | Pair an approved Chrome profile, allow one origin and deny another; changing profile must not reuse the first profile's grant. |
| D59 | Adjacent: browser history requires request-scoped approval; extension permissions do not replace product confirmations. | [Browser extension][E] | Planned: LOC-05, CLOUD-04 | Ask for a prior page, scope the history query and show the selected evidence; unrelated history stays out of task context. |
| D60 | Adjacent: built-in browser supports previews, annotations and gated developer inspection; not every upload flow is automated. | [Browser][B] | Foundation HTML preview; planned UX-09, LOC-02 | Annotate a localhost layout defect, review a proposed fix and verify the rendered result; disclose unsupported upload operations. |
| D61 | Adjacent: desktop Work/Codex has a project-scoped terminal whose output the agent can inspect. | [Terminal][I] | Planned: LOC-03 | Start a server, resize the PTY, interrupt its process tree and reconnect without exposing another workspace's output. |
| D62 | Not established: a general interactive terminal/file-explorer UI in the dot's own cloud view is not specified by the Dots guides. | [Computers and apps][C], [Terminal][I] | Explicit Pal extension: LOC-03, LOC-04 | Browse, edit and download an owned file beside a live terminal; reject traversal, symlinks and stale overwrites. |
| D63 | Adjacent: desktop Work previews documents, slides, sheets, PDFs and HTML; supported previews accept targeted annotations. | [Files][W] | Foundation files/previews; planned UX-09, ART-01, PAR-05 | Generate a spreadsheet with formulas, annotate a chart and download the verified revision from a second device. |
| D64 | Adjacent: LaTeX editing has a PDF preview; failed compilation preserves source and the last successful output. | [Files][W] | Planned: ART-01, PAR-05, UX-09 | Break and repair a TeX fixture; retain source revisions and make failed versus successful build outputs unmistakable. |
| D65 | Adjacent: graphical computer use has OS/app grants; Windows uses foreground input, while macOS has separate locked-use controls. | [Computer use][CU] | Feasibility gap: LOC-05, CLOUD-04 | Publish an OS matrix, prove exclusive input ownership and keep native security prompts under human control. |
| D66 | Adjacent: GPT-Live desktop voice can steer delegated tasks and request macOS screen context with separate permissions. | [Voice][V] | Foundation voice; planned PAL-03, VOICE-03, VOICE-06 | Continue speaking during a background run, request one screen observation, revoke sharing and verify the next turn sees no new frame. |

## Oversight, action policy and data

| ID | OpenAI behavior and conditions | Evidence | Polaris state / backlog | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| D67 | Documented: Activity lists active/scheduled/completed work, artifacts and waiting decisions/sign-ins/connections/approvals. | [Controls][R] | Preview shell; planned PAL-02, RUN-03 | Reconnect to a blocked run and resolve its exact pending request; completion requires a verified output, not merely an idle worker. |
| D68 | Documented: Pause affects main work; delegated tasks and future schedules require separate stop actions. | [Controls][R] | Planned: RUN-03, PAL-05 | Exercise main pause/resume, child cancellation and schedule deletion independently; show the effect of each before confirming. |
| D69 | Documented: custom rules distinguish automatic action, explicit-request action, approval and human handoff. | [Controls][R] | Planned: CLOUD-04, RUN-03 | Save each rule type against a fixture action; test precedence, edits, disablement and replay against changed payloads. |
| D70 | Documented: rules do not grant tool access or override mandatory safeguards; defaults still apply when rules are disabled. | [Controls][R] | Planned: CLOUD-04, EXT-01 | An allow rule cannot bypass a missing connector scope or administrator deny; show the controlling policy to the user. |
| D71 | Documented: action review checks scope and recipients; delegation does not expand approval. | [Safety architecture][S] | Planned: RUN-03, CLOUD-04, CON-11 | Approve a specific draft, alter its recipient in a child task and verify execution blocks pending a new applicable decision. |
| D72 | Documented: purchases need approval; some destructive/access changes need fresh confirmation; passwords and money transfers require handoff. | [Safety architecture][S] | Planned: CLOUD-04, PAL-06 | Use simulated checkout, deletion and financial flows; enforce the action class outside model-writable code. |
| D73 | Documented: monitoring can pause suspicious work; source content cannot itself authorize actions. | [Safety architecture][S] | Foundation ownership; planned CLOUD-04, PAR-04 | Place adversarial instructions in mail and pages; preserve the owner's scope and emit a reviewable blocked-action event. |
| D74 | Documented: deletion removes dot context, while separately created files/tasks and ChatGPT memories have separate lifecycles. | [Privacy FAQ][F] | Planned: PAR-03, AI-03 | Preview deletion scope, remove Pal notes and schedules, and reconcile retained artifacts or external resources individually. |
| D75 | Documented: business/personal training defaults differ; research notes are not directly used, but surfaced content follows conversation settings. | [Privacy FAQ][F] | Planned: AI-03, RUN-07 | Describe the selected API/deployment contract accurately; do not apply ChatGPT-product promises to Polaris API traffic. |
| D76 | Limited: Enterprise capability grants, plugins, password manager, local access and communication identity are administered separately. | [Admin guide][A] | Foundation users/groups; planned CLOUD-04, CON-11, API-03 | Remove one capability and verify its API, worker and UI all enforce the change without revoking unrelated access. |
| D77 | Limited: beta residency, EKM/FedRAMP/UAE exclusions and local-access policy restrictions affect enterprise eligibility; strict ZDR is unavailable. | [Local-access policy][L] | Deployment gate: RUN-07, AI-03, OPS-01 | Reject an adapter whose retention or region conflicts with a tenant requirement; record the tested deployment decision. |
| D78 | Limited: usage and supported compliance records identify Dots separately; audit coverage must be checked per workload. | [Admin guide][A] | Foundation usage; planned API-03, REL-06, CON-11 | Reconstruct a synthetic action from owner instruction to approval, tool attempt and delivery receipt without logging credentials. |

Additional privacy and reviewer boundaries use the same deployment-specific test standard:

| Boundary | OpenAI behavior and conditions | Evidence | Polaris mapping | Pal acceptance journey |
| --- | --- | --- | --- | --- |
| Retained content | Documented: dot context excludes credentials, images and screenshots; separately stored files follow their storage location's policy. | [Privacy FAQ][F] | Planned: AI-03, EXT-01 | Separate semantic notes, secrets and artifacts; apply deletion/expiry to each store and test backups for retained copies. |
| Encryption and processing | Documented: content is encrypted at rest and in transit; service providers may process it under instructions. | [Privacy FAQ][F] | Credential-vault foundation; planned EXT-01, AI-03, OPS-01 | Inventory all stores and subprocessors; verify deployment encryption and retention instead of describing the app as end-to-end encrypted. |
| Human review | Documented: limited human review can occur even with model improvement disabled. | [Privacy FAQ][F] | Deployment disclosure: AI-03, OPS-01 | Explain provider and operator access separately; test administrator audit controls against a synthetic privacy-sensitive run. |
| Privacy requests | Documented: personal-data access, correction and deletion requests have a separate privacy-request channel. | [Privacy FAQ][F] | Planned: PAR-03, AI-03 | Export one owner's data, verify identity and process deletion across application stores without exposing another owner's records. |
| Automatic review | Adjacent: Codex automatic review handles eligible approval escalations; managed policy wins and computer app grants remain separate. | [Auto-review][AR] | Planned: RUN-08, CLOUD-04, AI-10 | Test the selected harness's approval boundary and denial behavior; a model score must never grant missing filesystem, network or app access. |

## Advertised end-to-end examples

The following are **showcase claims**. Each needs relevant source access, execution tools and applicable approval. They are proposed evaluation scenarios, not automatic promises about the quality of autonomous work.

| ID | Advertised example | Evidence | Polaris mapping | Original acceptance journey |
| --- | --- | --- | --- | --- |
| D79 | Track customer feedback, build tested fixes and prepare PRs with demonstration videos. | [Launch][P] | Planned: RUN-01, RUN-02, RUN-03, RUN-08, CON-14, PAR-04 | Replay three synthetic bug reports; produce a scoped patch, test result, reviewable PR draft and reproducible UI recording before merge approval. |
| D80 | Revise launch copy, slides and assets after product scope changes. | [Launch][P] | Planned: AI-08, AI-09, PAR-05, UX-09 | Change one fixture requirement; identify every affected deliverable, update drafts and preserve unchanged approved claims. |
| D81 | Rerun study analyses and revise figures/explanations when new measurements arrive. | [Launch][P] | Foundation code/files; planned AI-08, AI-09, RUN-02, PAR-04 | Add a second dataset with a conflicting result; recompute the figure, explain uncertainty and preserve both input versions. |
| D82 | Reconcile sales requirements, build an integration proof of concept and identify relevant expertise. | [Launch][P] | Planned: AI-08, CON-10, RUN-01, EXT-06 | Compare a synthetic RFP with source documents, test an integration fixture and flag unsupported commitments for review. |
| D83 | Convert interview material into clip suggestions, show notes and social drafts with consistent edits. | [Launch][P] | Planned: AI-08, PAR-05, UX-09 | Provide a transcript with timestamps; produce cited clip boundaries and drafts, then propagate a tone correction without publishing. |
| D84 | Notice an omitted invoice, prepare it and send after approval. | [Launch][P] | Planned: PAL-09, CON-02, CON-04, RUN-03 | Detect a missing fixture invoice, confirm recipient/amount, and record exactly one delivery after approval. |
| D85 | Track product/revenue changes and keep an investor or leadership deck current. | [Product page][P2] | Planned: AI-08, AI-09, CON-10, PAR-05 | Change a source metric, identify affected charts and update the deck with versioned sources and unresolved explanations. |
| D86 | Map an API migration, prepare code/tests and track remaining old calls. | [Product page][P2] | Planned: RUN-08, RUN-02, PAR-04 | Scan a fixture monorepo, create independently reviewable changes and prove the deprecated-call count reaches zero. |
| D87 | Detect a calendar conflict, find another slot and move the meeting with permission. | [Product page][P2] | Planned: CON-02, CON-04/09, RUN-03 | Introduce a conflict, preserve attendee/timezone constraints and perform one approved reschedule despite webhook retry. |
| D88 | Compare meal choices, full totals and arrival times; order and follow delivery after approval. | [Product page][P2] | Feasibility: CLOUD-03, CLOUD-04, EXT-06, RUN-03 | Use a fake merchant, show the final total and recipient, expire stale approval after a price change and prevent duplicate checkout. |
| D89 | Keep channel FAQs current and prepare replies or managerial updates from current materials. | [Product page][P2] | Planned: CON-03, CON-12, CON-10, PAL-07 | Add a revised pricing document; update the draft FAQ and check audience permissions before posting any response. |
| D90 | Track an offsite's decisions, deadlines and replies as headcount or venue details change. | [Overview][O] | Planned: PAL-05, CON-02, CON-04, RUN-02, RUN-03 | Ingest fixture confirmations, revise the checklist and request approval for a concrete changed-price enquiry. |

## Future claims and deliberate differences

| ID | Boundary | Evidence | Polaris treatment |
| --- | --- | --- | --- |
| D91 | More primary dots, increased capacity and teams of dots were described as future directions. | [Launch][P] | RUN-04/PAR-02 can support a bounded experiment; no current Dots fleet-parity claim. |
| D92 | Specialist dots with organizational identity, provisioned hardware and Agent 365 integration are focused pilots/announced work. | [Launch][P] | Gap beyond personal Pal. Require explicit service identities, lifecycle ownership, administrator controls and a separate enterprise acceptance plan. |
| D93 | A standalone dot-owned email address is not supported at launch. | [Getting started][H] | CON-02, CON-04 are user-authorized mailbox connectors; a future assistant mailbox needs its own identity and abuse controls. |
| D94 | “Always on” and broad marketing language do not specify universal success, an uptime SLA or unrestricted access. | [Product page][P2], [Overview][O] | Record observable completion/delivery, cost and failure recovery. Report unavailable capabilities and incomplete work honestly. |

Pal's inspectable individual notes, explicit terminal/file workspace and mobile web/PWA are useful product choices even where they differ from documented Dots behavior. The paired personal-computer bridge in LOC-05 is separate from the isolated Linux provider in LOC-01. RCS/phone feasibility in CON-13 does not establish access to OpenAI's messaging arrangement or to a public iMessage integration API. Likewise, OpenAI's Auto-review service, proprietary memory and application surfaces are not obtained merely by selecting an API model.

## Showcase and video evidence ledger

| Official material | What was established in this review | Use in the plan |
| --- | --- | --- |
| [Launch article and embedded films][P] — 29 September | Article text and embedded-video titles identify the launch film, Codex screen capture, cross-channel demonstration and safety film. Vimeo playback/config retrieval was unavailable here; no unseen dialogue or frame is treated as evidence. | D79–84, D91–92 derive from the article; behavior elsewhere is supported by current documentation. |
| [Dots product showcase][P2] | Product-page scenarios and illustrations were read, including finance, migration, calendar, dinner and channel examples. | D85–89 are evaluation briefs, not measured success claims. |
| [Mobile onboarding video](https://cdn.openai.com/devhub/docs/dots/demos/dots-demo-mobile-onboarding-1080p-v1.webm) and [mobile Codex-task video](https://cdn.openai.com/devhub/docs/dots/demos/dots-demo-codex-tasks-1080p-v1.webm) | Official links and their accompanying October update text were inspected; frame-by-frame playback was not validated. | D05, D13 and D22 use the written release contract. |
| [Files demonstration](https://www.youtube.com/watch?v=E3dDr_QtBuo) linked by [Work with files][W] | An official adjacent-product demonstration is identified; the file guide establishes the supported surfaces. | D63–64 remain adjacent capabilities, not proof of a Dots-specific editor. |

The remaining video-review gap should be closed with timestamped observations if a video-only claim becomes a release requirement. A staged demo, even when viewed, does not replace the acceptance tests above. Community success/failure reports should inform the test corpus separately; they do not redefine the official capability contract or establish failure rates.

## Source register and freshness decisions

Every source below was checked on **29 October 2026**. Each source contributes a short paraphrase; the test journeys are Polaris proposals. The six entries O/D/M/T/C/R are the complete Dots navigation set listed by the official documentation index at this review date.

| Key | Primary source | Date / scope used |
| --- | --- | --- |
| O | [Meet dots][O] | Current overview, identity, availability and usage boundaries |
| D | [Getting started][D] | Current setup and responsibilities guide |
| M | [Messaging][M] | Current channels, calls, texting and iOS entrypoints |
| T | [Tasks and memory][T] | Current task, scheduling, delegation and context contracts |
| C | [Computers and apps][C] | Current cloud/local execution, plugins and sign-in |
| R | [Controls][R] | Current action review, rules and stop scopes |
| U | [Mobile and Codex update][U] | 5–9 October update; supersedes launch-era desktop-only setup guidance |
| X | [Text your dot][X] | 26–30 October update page; corroborated by the dated 28 October release note |
| X2 | [ChatGPT release notes][X2] | 28 October texting beta announcement and provider boundary |
| H | [Getting started help article][H] | Current eligibility, mobile controls and unavailable features |
| F | [Privacy, security and safety FAQ][F] | Current memory/deletion and information-access limitations |
| A | [Dots administration][A] | Current enterprise capability and channel conditions |
| L | [Local-access administration][L] | Current eligibility, orchestration and revocation differences |
| S | [Safety architecture][S] | 29 September; restricted research, isolation, credential and action controls |
| P | [Introducing dots][P] | 29 September launch, examples, pilots and future directions |
| P2 | [Dots product page][P2] | Current marketing scenarios; availability checked against newer documentation |
| N | [Notifications][N] | Adjacent desktop/web notification controls |
| B | [Browser][B] | Adjacent browser/preview/annotation controls |
| E | [Browser extension][E] | Adjacent signed-in browser and history permissions |
| I | [Integrated terminal][I] | Adjacent desktop project/worktree terminal |
| W | [Work with files][W] | Adjacent artifact preview/edit/annotation surfaces |
| CU | [Computer use][CU] | Adjacent OS, foreground and security restrictions |
| V | [Voice][V] | Adjacent live task coordination and screen context |
| AR | [Auto-review][AR] | Adjacent reviewer configuration and escalation limits |

Freshness matters: the launch/product page's “texting coming” wording is superseded by the October beta announcement. Current mobile creation is documented after launch. The more specific Teams alpha restriction qualifies broad channel marketing. Separate visible histories qualify “full context” shorthand. Reset/delete descriptions must be read alongside the explicit rule that independently stored files and delegated conversations survive dot deletion.

## Release evidence needed for a parity claim

For each row, retain the source date, implemented revision, test fixture, expected result, actual result and deployment/account conditions. Record success of **execution**, **artifact creation**, **delivery**, and **user access** separately. A generated file behind a broken download is not a completed delivery. A child accepting instructions is not proof that it used the intended computer. An approval prompt is not proof that the eventual payload remained authorized.

Start with the connected journey in [Pal](./pal): persisted responsibility → bounded delegation → visible workspace → private handoff → voice steering → scheduled follow-up → single notification → effective cancellation. Add the channel, native-device and enterprise rows only when their respective adapters and contracts pass. Mark unsupported or proprietary interfaces as gaps with a tested alternative; never roll these rows into an unsupported “exact Dots parity” percentage.

[O]: https://learn.chatgpt.com/docs/dots
[D]: https://learn.chatgpt.com/docs/dots/getting-started
[M]: https://learn.chatgpt.com/docs/dots/channels
[T]: https://learn.chatgpt.com/docs/dots/tasks-and-memory
[C]: https://learn.chatgpt.com/docs/dots/computers-and-apps
[R]: https://learn.chatgpt.com/docs/dots/controls
[U]: https://learn.chatgpt.com/docs/whats-new/dots-october-9-2026
[X]: https://learn.chatgpt.com/docs/whats-new/dots-october-28-2026
[X2]: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
[H]: https://help.openai.com/en/articles/20001530-getting-started-with-your-dot
[F]: https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs
[A]: https://learn.chatgpt.com/docs/enterprise/dots-admin-guide
[L]: https://learn.chatgpt.com/docs/enterprise/cloud-local-access
[S]: https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/
[P]: https://openai.com/index/introducing-dots/
[P2]: https://chatgpt.com/features/dots/
[N]: https://learn.chatgpt.com/docs/notifications
[B]: https://learn.chatgpt.com/docs/browser
[E]: https://learn.chatgpt.com/docs/chrome-extension
[I]: https://learn.chatgpt.com/docs/integrated-terminal
[W]: https://learn.chatgpt.com/docs/artifacts-viewer
[CU]: https://learn.chatgpt.com/docs/computer-use
[V]: https://learn.chatgpt.com/docs/features/voice
[AR]: https://learn.chatgpt.com/docs/sandboxing/auto-review
