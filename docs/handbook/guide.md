# Using Polaris

New to Polaris? [Start here](./start-here) to find the right server/account path. Before sending content, read [costs and data](./costs). Your administrator decides which models and optional services are available on your installation.

## Send your first message

1. Sign in at the Polaris address supplied by your administrator. Open **New Chat** in the sidebar; on a narrow screen, open the navigation drawer first.
2. Choose an available model in the composer. If the list is empty, ask your administrator to finish [provider/model setup](./providers). A similar-looking model name does not establish the same capabilities or price.
3. Enter a harmless short request, such as “Suggest three names for a fictional bookshop,” then send it. **Enter** sends; **Shift+Enter** starts a new line.
4. Wait for the reply to finish. Check the answer and any sources before relying on it. The model name on a new reply records that reply's selection; changing the composer later does not rewrite it.
5. For ordinary saved chats, reopen the conversation from the sidebar or [search/history](./conversation-history). Temporary chats follow [different retention rules](./privacy) and lose local context on reload.

Use **Stop** to request cancellation. It prevents further supported local work and aborts transports where possible; it does not prove that remote computation, charges or completed actions were undone. Read an error or partial result before deliberately retrying.

## Keep related work together

Use projects for related conversations, project instructions and files. Select the intended project before chatting so its context is clear. [Search and history](./conversation-history) explains finding, paging, renaming, pinning and archiving your conversations. Deleting a conversation is different from hiding it in the archive; read the confirmation before deleting. Ask the administrator about recovery if data is lost.

## Attach a file and check the result

1. Select **Attach file** in the composer and choose a file you are allowed to share. Wait for upload/analysis to finish and check the attachment shown beside your draft.
2. Explain what you want done with it, then send. The selected provider/model must support that kind of input; an accepted upload does not prove every model can interpret it.
3. Open the saved conversation again to see its attachment. Click an available image/PDF/text item to preview it, or download a supported file. If a preview fails, use the displayed error/retry action rather than assuming the upload was analysed.

The default maximum is **50 MiB per file**; the administrator's configured limits and accepted content checks still apply. [Attachments](./attachments) lists behavior and limitations. Temporary chat does not automatically delete separately uploaded or generated files.

Generated files and previews are called **artifacts**. Check the downloaded result as well as its preview. Treat executable HTML or code as untrusted output; [artifact security](./artifacts-security) explains how previews are isolated and what changes when a file is opened outside Polaris.

## Make Pal your own

Open **My Pal → Customize Pal**. Choose the shape, colour, eyes, accessory and motion options, then save. Appearance belongs to your account. Themes and operating-system reduced-motion preferences apply across the interface.

From Pal you can choose distinct workflows:

- [Saved text task](./pal-tasks): one bounded model request that keeps its activity/result after reload. **Waiting for worker** means it has not been claimed by the background service. Ask the administrator if it stays there; repeatedly creating replacements queues additional work.
- [One-off reminder](./reminders): a chosen date/time/zone, delivered to your Polaris inbox by the worker. It does not promise a phone notification, email or SMS.
- [Text workflow](./workflows): one to four sequential OpenAI text steps, configured through the current JSON editor. It does not run browser/terminal tools.
- [Browser workspace](./computer-workspace): a separately configured temporary Chromium session you can watch and control. Saved text tasks do not control it. Terminal access and general file editing remain separate capabilities.

A disconnected optional service should say so. It does not mean a task is secretly running elsewhere. Worker-based tasks need the server/worker host to remain available even if you close your own browser.

## Voice and audio

Dictation writes speech into your draft; read-aloud speaks a reply; live voice is a separate experimental conversation feature. They have different models, costs and validation boundaries. Check the current [voice guide](./voice) before relying on live calls. Microphone features need browser permission and a trusted secure context; a successful text reply does not validate audio.

## Settings, mobile and developer access

Open the account menu for personal settings and available customisation. On mobile, use the navigation drawer; **Escape** closes the current dialog and returns focus where supported. [Add Polaris to your device](./pwa) only after the server works in your browser; installation does not add offline chat.

Administrators use **Admin panel** for providers, models, users/groups and usage. Provider credentials belong in protected configuration, never in chat. External integrations use a different key from **Developer access**; see the [API guide](./api). A regular chat user does not need to create that key.

## Common first-use problems

| Problem | Next step |
| --- | --- |
| I cannot sign in or do not know the address | Contact the administrator of your Polaris server; this handbook does not create accounts |
| No model is available | Ask the administrator to check provider/model enablement and your user/group access |
| A feature is missing or disconnected | Check the installation's release and optional service configuration against [current capabilities](./status) |
| An attachment is unavailable | It may have expired, been deleted or become inaccessible; ask the owner/administrator and re-upload only content you are entitled to use |
| A task stays queued or a reminder is late | Ask whether the background worker is running and its host is awake |
| A provider request fails | Record the visible error/model/request ID if available; do not share keys or repeatedly retry an uncertain action |

For backup and recovery, ask the administrator what is protected and how to request a restore. Exporting a chat or adding a home-screen icon is not a complete server backup.
