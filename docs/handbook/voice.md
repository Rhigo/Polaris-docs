# Voice and audio

Polaris has three separate audio workflows. Each explicitly uses OpenAI, including when the selected text-chat model runs locally. Administrators configure the provider credential and audio choices under **Settings → Voice**. Saved model IDs and instructions are preserved; selecting the current defaults is an explicit administrator action.

| Action | Current default | How it works |
| --- | --- | --- |
| Dictate a message | `gpt-transcribe` | Record a short clip, transcribe it, then review the text before sending |
| Read aloud | `gpt-realtime-2.1-mini`, Marin | Send the first 4,096 characters to a bounded Realtime generation and play the resulting WAV |
| Start a voice call | `gpt-realtime-2.1`, Marin | Establish browser WebRTC through the authenticated server; stream speech and transcript events |

The defaults follow the reviewed [Realtime model](https://developers.openai.com/api/docs/models/gpt-realtime-2.1), [Mini model](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini), [transcription model](https://developers.openai.com/api/docs/models/gpt-transcribe) and [WebRTC contract](https://developers.openai.com/api/docs/guides/voice-webrtc). The current read-aloud model uses Realtime WebSocket events, not the legacy Speech endpoint. Legacy choices remain available only within their reviewed compatibility and retirement windows.

## Controls and limits

Dictation requires a supported recording format and microphone permission. Recording stops after five minutes; files are limited to 25 MB. Cancelling or leaving the composer discards late microphone and transcription results. The text remains editable before it becomes a chat message.

Read-aloud limits the submitted text, generation time and decoded PCM bytes. Stop cancels generation or playback and releases the playback URL. A partial or failed provider response is reported as an error rather than presented as complete speech. Read-aloud has no tools and does not reconnect automatically.

Calls expose connection, microphone, playback and ended states. Setup is bounded to 20 seconds and pending microphone permission to 60 seconds; active calls end at the provider expiry or the local 60-minute ceiling. Interruptions clear queued output. Reconnecting starts an explicit new call; uncertain tool actions are never automatically replayed. Transcript event identities prevent repeated delivery from creating duplicate saved messages.

Microphone access requires browser permission and a secure context, with the usual localhost development exception. An unavailable provider, unsupported model or denied permission produces an actionable error. Camera, screen sharing and automatic device switching are not part of this release.

## Security and privacy

Provider credentials stay on the server. Call creation checks current account state and conversation ownership before provider access. Tool definitions are filtered by the account's effective permissions, and tool execution checks those permissions again. Context parity with every text-chat feature remains unfinished; do not assume all project instructions or attachments are automatically included.

Audio is sent to OpenAI when these actions are used. Application history and provider retention are different controls; this implementation does not claim Zero Data Retention. See [temporary chat and privacy](./privacy) for the separate text/voice history and file-retention controls. Usage reconciliation and spend budgets remain planned, so the duration and byte limits are not a billing guarantee.

## Validation

The production standalone build is copied outside the checkout for HTTP tests, so missing deployment dependencies cannot be hidden by the development workspace. A private TLS/WebSocket fixture drives the real OpenAI SDK exchange, including format acknowledgement, WAV framing, incomplete responses, cancellation and no reconnect. Other cases cover ownership, disabled accounts, invalid models/voices, anonymous uploads and valid uploads above Next's default middleware cloning limit.

Multipart bodies are bounded while streaming, including when Content-Length is absent or misleading. Only the exact authenticated transcription and file-upload routes bypass the middleware clone; their handlers authenticate before reading the body. The WebSocket package is externalized to preserve optional native-module resolution in production.

Run `pnpm test:integration:audio` after a production build, using an explicit local disposable-test PostgreSQL connection in `DATABASE_URL`. The suite creates and removes its own database, temporary certificate, fixture files and standalone server; it does not use a provider key or physical microphone.

A bounded live OpenAI probe on 29 October 2026 generated a synthetic sentence with `gpt-realtime-2.1-mini` and transcribed it exactly with `gpt-transcribe`. This establishes those two provider paths for the tested account. It does not establish microphone quality, browser/device compatibility, acoustic echo handling, speaker fidelity, continuous WebRTC calls or other accounts' entitlements. Those checks remain explicit release work. GPT-Live has a separate typed evaluation helper; it is not substituted into the Realtime route.
