# Polaris Pal

Pal has one continuous private conversation for each signed-in user. Open **My Pal**, type a message, or click its avatar to change its appearance. Ordinary chats stay separate. The thread, fixed-emoji reactions and manual desktop panel are implemented in this release; broader autonomous responsibilities remain unfinished.

## Conversation, reactions and activities

The [continuous conversation guide](./continuous-pal) covers saved history, attachments, bounded context and reactions. Older messages load in pages of 50. The model receives at most 200 recent message records, subject to the existing content limits; a continuous visible thread is not unlimited model memory. Changing a model does not rewrite the model identity recorded on earlier replies.

Use the **plus beside a message** to choose one of six reactions or remove your reaction. Pal can independently react to the current user message through a local tool, when the selected model supports it. The server chooses the actor and target; a provider request is not needed for a user's reaction. A completion-only Ollama fixture also verified that an unsolicited reaction call is rejected without changing reactions or falling back to OpenAI; this is not a real Ollama/provider interoperability claim.

The avatar opens account-owned appearance settings. **Activities** opens the existing saved-task, workflow and reminder surfaces. These have their own worker and permission requirements; they do not become autonomous desktop jobs merely because they appear beside the thread.

## Watch a real computer while chatting

**Desktop** opens the [manual computer](./pal-computer) when an administrator has configured it. A wide window reserves space for chat and the viewer together. A narrow window uses a modal drawer; close it to return to the conversation. Resizing keeps the same viewer connection. Resource details collapse while connected and remain available through **Desktop resources**.

This first adapter uses an independently provisioned Debian 13/Xfce desktop with Chromium, Terminal and Files. It has no agent role: Pal cannot operate it from the conversation. The separate [public browser research pilot](./public-browser-research) is still a different runtime, with its own reviewed pages, consent, worker and limits.

## Saved work and notices

- [Saved text tasks](./pal-tasks) make one bounded model request and persist progress/results. Interrupted work is not automatically replayed.
- [Text workflows](./workflows) run one to four sequential OpenAI text steps, with immutable revisions and cancellation.
- [Reminders](./reminders) deliver a chosen one-off date/time to the owned local inbox. They do not send phone notifications or email.
- [Microsoft Inbox](./microsoft-inbox) has an explicitly linked read-only pilot and optional local notices. Its accepted fixtures use synthetic Microsoft responses; real tenant consent and mailbox behavior remain unverified.

A worker and its host must remain available for queued work. Closing the browser is different from shutting down that host. Quiet hours, general recurring responsibilities, cross-channel private memory and autonomous desktop work still have separate [backlog](./backlog) gates.

## What remains beyond this slice

Talking to Pal while steering an independent durable desktop job, transferring chat files into the desktop and returning owned results, private human-versus-agent sign-in, pooled hosting, and coordinated snapshot recovery are not implemented end to end. A saved profile in the same Linux account is readable by code run as that account; it is not private from an unrestricted agent.

Voice, images and charts retain their own [voice](./voice), [image](./images) and [data](./rich-data) contracts. The [runtime decision](./pal-runtime) records the larger orchestration direction. A genuine screenshot proves the visible tested journey, not every provider, device or deployment.
