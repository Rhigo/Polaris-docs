# Start here

Polaris is a self-hosted AI workspace. You use it through a browser; an administrator runs the server and decides which models and features are available. This handbook is public, but the application source is currently private. The public **Polaris-docs** repository builds this website, not the application.

## I have an account or an invitation

1. Open the **Polaris server address supplied by your administrator**. This handbook is not the sign-in page for your server.
2. Sign in using your supplied email/password, or your organisation's configured sign-in button. If you have no account, do not know the address or cannot sign in, contact that administrator. Installing the browser app does not create an account.
3. Read [costs and data](./costs) before sending private content or starting a paid feature.
4. Follow [your first conversation](./guide#send-your-first-message). If no model is available, your administrator needs to finish [provider setup](./providers).

Once the server works in your browser, you can optionally [add Polaris to your device](./pwa) for a separate app window or home-screen icon. It still needs the server and a network connection.

## I want to run a server

You need access to an approved application checkout and someone able to administer Docker, a database, storage, TLS certificates and backups. Follow [administrator setup](./server-setup). The bundled installer is for Linux. The [development guide](./development) is a separate source-development path, not a packaged Mac or Windows desktop installer.

Do not clone the documentation repository expecting it to run chat. If you do not have application source access, ask the maintainer or the administrator offering you Polaris for the available access path.

## Choose a first task

| I want to… | Start with | What it needs |
| --- | --- | --- |
| Ask a question or draft text | [Chat](./guide) | An enabled model you can access |
| Work with a file | [Attachments](./attachments) | An accepted file and a model that supports the intended use |
| Find an old conversation | [Search and history](./conversation-history) | Your saved conversations |
| Change my companion | [My Pal](./guide#make-pal-your-own) | Your signed-in account |
| Save a background text task | [Saved tasks](./pal-tasks) | An enabled model and a running worker |
| Schedule an inbox reminder | [Reminders](./reminders) | A running worker; no model request is required |
| Run several text steps | [Text workflows](./workflows) | A JSON definition, an enabled OpenAI model and a running worker |
| Watch and control a separate browser | [Browser workspace](./computer-workspace) | A separately configured isolated browser service |
| Dictate, hear a reply or try voice | [Voice and audio](./voice) | Feature-specific configuration and the current verification limits |

The manual browser is separate from saved text tasks. Terminal access, general file editing, arbitrary connected-account actions and autonomous browser tasks are not implied by these links. Check [current capabilities](./status) for the documented release and ask your administrator which release is enabled on your server.

## A few useful words

| Term | Meaning here |
| --- | --- |
| Server / installation / instance | The particular Polaris service you sign into, with its own users, data and settings |
| Administrator | The person who manages that server, accounts, providers and backups |
| Provider | The service or local runtime supplying an AI model |
| Model | The particular AI model selected for a request; different models support different inputs and tools |
| Token | A unit used by a model for input/output limits and some pricing; it is not a fixed number of words |
| Worker | A separate background process that handles saved tasks, workflows and reminders |
| Artifact | A file or preview produced during a task, such as a chart, image or report |
| Origin | A website's scheme, hostname and port, such as `https://example.org`; it does not include a page path |

## Get help without sharing secrets

Record the action you tried, the visible error, time, browser and whether the problem happens again. Share a request ID if the application provides one. Do not paste passwords, API keys, environment files, private conversation text or sensitive screenshots into a public issue. For lost data, ask your administrator about [backup and recovery](./recovery); installing the app again does not restore server data.
