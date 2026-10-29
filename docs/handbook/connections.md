# Connected accounts and channels

These are planned integrations. Start with a shared credential, OAuth, webhook and sync layer; then ship one read-only vertical slice per service before adding drafts and external actions. Each connection belongs to a Polaris user or explicitly administered workspace.

| Service | Proposed first slice | Authorization and feasibility gate |
| --- | --- | --- |
| Microsoft 365 | Search/read mail, draft replies, list calendar events | Delegated Microsoft Graph permissions; app registration and tenant consent |
| Teams | Assistant bot, selected conversations and notifications | Bot installation plus supported Graph permissions; test tenant required |
| Gmail | Search/read, drafts, then explicitly enabled sending | OAuth scopes, verification and any applicable restricted-scope assessment |
| Google Calendar | List calendars/events, then create/update selected calendars | Separate least-privilege calendar scopes and revocation handling |
| Telegram | Direct assistant conversation and task updates | Bot token, webhook secret and one-time Polaris identity linking |
| Discord | Slash commands, selected channels and task updates | Bot/OAuth install, interactions and required intents; per-guild/channel policy |
| WhatsApp | Business-number assistant messages | Current Meta eligibility, official API onboarding and messaging rules must be validated first |
| iCloud Mail | IMAP sync/search, SMTP drafts/sends | Supported app authorization or an app-specific password; dedicated test mailbox |
| iCloud Calendar | Calendar discovery and event sync | Feasibility spike for supported authorization and CalDAV behaviour; recurrence/conflicts tested |
| OneDrive / SharePoint / Drive | Permission-aware retrieval with source citations | Per-source scopes, ACL propagation and deletion/revocation sync |

## Constraints that affect the design

Microsoft sign-in does not grant arbitrary mailbox or Teams access. Graph scopes must match the action. In particular, the Teams send-message documentation distinguishes delegated chat sending from application permissions intended for migration; a migration permission is not a general-purpose send-as-user solution. [Graph permissions](https://learn.microsoft.com/graph/permissions-reference), [Teams message API](https://learn.microsoft.com/en-us/graph/api/chat-post-messages?view=graph-rest-1.0).

Gmail classifies scopes by sensitivity. Reading or modifying mail can trigger stricter verification requirements than a narrow sending integration. Keep connector modes and scopes separable, and document the production approval path. [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes).

Calendar access has its own scopes; request only the calendars and operations a feature needs. Test cancelled events, recurrence, timezone changes and incremental sync expiry. [Google Calendar authorization](https://developers.google.com/workspace/calendar/api/auth).

Telegram provides bot APIs and webhook secret support. A bot conversation must be linked to the correct Polaris account; matching a display name is insufficient. [Telegram Bot API](https://core.telegram.org/bots/api).

Discord interactions support commands without granting arbitrary access to every conversation. Evaluate message-content requirements separately from the first command-based integration. [Discord commands](https://docs.discord.com/developers/docs/interactions/slash-commands).

Apple documents IMAP/SMTP for iCloud Mail and app-specific passwords, plus authorization for supported third-party apps. Do not assume Sign in with Apple automatically grants mailbox or calendar access. The calendar adapter still needs an interoperability experiment; this review has not verified a universal public iCloud OAuth provisioning flow. [Mail settings](https://support.apple.com/en-ie/102525), [third-party access](https://support.apple.com/en-us/121539), [app-specific passwords](https://support.apple.com/en-us/102654).

Meta's developer pages returned HTTP 429 during this review. WhatsApp remains a feasibility-gated business messaging integration; support for personal-account history is not promised. Revalidate current onboarding, templates, opt-outs and delivery restrictions against the official documentation before implementation. [Official WhatsApp entry point](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview).

## Shared acceptance rules

Store encrypted credential references; never include tokens in pipeline exports, screenshots or logs. Handle refresh races and revocation. Verify webhook authenticity and deduplicate events. Track consent, scope and connection health. Bind every incoming channel event to an authorized identity before accessing project memory.

Reading, drafting and sending are distinct capabilities. A run may use the actions explicitly authorized by its owner and configured policy. When additional approval is needed, show the actual recipient, content and effect; a later payload change invalidates the earlier approval. Tests use dedicated accounts and do not message real contacts automatically.
