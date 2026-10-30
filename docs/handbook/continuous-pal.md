# Your continuous Pal conversation

**My Pal** opens one saved conversation for your account. Its identity and thread are created together on first use; simultaneous first opens resolve to the same Pal. Normal chats remain separate, including their Temporary chat setting, drafts, history search and archive controls.

Use the familiar message composer, model picker and attachments. Click Pal’s avatar to change its appearance. The plus beside a saved message opens six reactions: love, like, laugh, surprise, sad and celebrate. Choose the same reaction again to remove yours. Pal’s own reaction is separately labelled and cannot be edited by sending an actor field from the browser. A tool-capable model can request a reaction only to the current, saved user message in its trusted Pal thread.

Older messages load in pages of 50. A model turn starts with at most 200 recent saved records, subject to the existing text and image budgets. The full visible conversation is not unlimited model memory. Earlier reasoning, tool requests and provider continuation identifiers are not replayed as new Pal actions. Owned attachment access and expiration checks still apply. Concurrent replies and tool results retain their original user-message parent; a reply arriving out of order shows that context. Stopping a turn does not undo an already completed local reaction or other explicit tool side effect.

## The desktop beside chat

On wide screens, **Desktop** opens a docked workspace and leaves the conversation usable. On narrower screens it opens a modal panel: Tab stays inside it, Escape closes it, and focus returns to the opener. Resizing changes the layout without remounting an open viewer. Switching to Activities or closing the workspace closes that viewer; it does not shut down the computer or delete its files.

The initial desktop adapter is manual. An administrator must assign a supported resource profile and configure a separately hosted runtime and viewer origin. The UI reports unconfigured, mismatched, unavailable and operator-attention states; it does not simulate a connected computer. Resource details remain available in **Desktop resources**, collapsed while a viewer is open so the desktop has more room. A resource profile is not independent quota enforcement.

**Observe desktop** is view-only. **Control desktop** requests the single manual controller; an existing controller requires an explicit **Take over control** confirmation. The real Terminal and Files applications are inside the desktop. This release gives Pal no autonomous desktop permission, app terminal API, power control or dynamic VM provisioning.

In the supported desktop viewer, **Focus desktop** directs keyboard input into the computer. **F8** releases held keys and returns focus to that toolbar button; Tab then reaches Disconnect and can leave the iframe for the Pal panel. Browser viewport tests cover responsive viewing and focus. Physical iOS/Android remote typing and an on-screen keyboard control are not verified or provided by this slice.

## Connection and privacy boundaries

Viewer links are transient, separate-origin, generation-bound, one-use tickets valid for 20 seconds. The application renews an established lease approximately every 20 seconds; the runtime bounds it to 60 seconds since issue or renewal and a 30-minute absolute connection limit. Disablement prevents further authenticated renewals but does not instantly revoke an already open channel. A failed renewal closes the viewer and requires an explicit fresh action; it does not reconnect automatically.

Cleanup is fenced to the exact viewer ID. An older tab closing after a takeover cannot release the newer controller. The PWA update guard treats an open viewer or pending connection operation as active work.

The configured viewer origin must agree with the deployment’s `X-Polaris-Desktop-Viewer-Origin` marker when that header is present. `disabled`, a mismatch or an invalid origin blocks viewing. A direct Next.js preview may omit the header; that preview does not certify the production proxy policy. The artifact sandbox and its restrictive content policy are separate and unchanged.

Chat attachments are not automatically transferred into the desktop, and closing a viewer does not remove independently retained desktop files or a signed-in browser profile. A normal Pal reply is not a durable autonomous desktop job. Saved tasks, reminders, workflows and public-browser activities remain their own explicitly started features.

## Verification boundary

The release uses synthetic model responses for repeatable chat tests. Real PostgreSQL fixtures cover unique first-open, ownership, reactions, parent identity, bounded replay, attachment expiry and cancellation. Browser checks cover the owner API with a clearly labelled protocol fixture, then a separate disposable app/database bound to the existing synthetic desktop identity. Real iframe checks include simultaneous chat and observation, manual keyboard input, F8 focus release, responsive continuity and explicit takeover. No paid model call or personal account is required for these checks.

The responsive panel uses the same focus-scope and dismissable-layer approach as [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), with one mounted content tree so modality changes do not consume another viewer ticket. The original pinned dependencies and their versions are retained.
