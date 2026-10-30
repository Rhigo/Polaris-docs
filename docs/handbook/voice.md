# Voice and audio

::: info Validation status
Live calls remain experimental. A real OpenAI WebRTC check on 30 October 2026 passed saved-text context recall and transcript persistence with `gpt-realtime-2.1-mini`. Physical microphone input, spoken-audio quality and broader device/model coverage remain unverified. Source acceptance does not automatically update an existing server.
:::

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

Calls expose connection, microphone, playback and ended states. Setup is bounded to 20 seconds and pending microphone permission to 60 seconds; active calls end at the provider session expiry or the local 60-minute ceiling. Interruptions clear queued output. Reconnecting starts an explicit new call; uncertain tool actions are never automatically replayed. Transcript event identities prevent repeated delivery from creating duplicate saved messages.

## Chat context and starting again

A call starts with a snapshot of recent text from its current chat. Saved chats are loaded on the server with current-account, conversation-owner and project-owner checks; archived owned chats remain usable. Temporary chats use the existing owner/session/project-bound encrypted state and validated pending voice transcripts. This context is transient and does not create saved conversations or messages for temporary calls.

Only user and assistant final text is included. Thinking blocks, tool payloads, provider continuation state, model-identity records, files and recorded audio are excluded. The snapshot examines the newest 24 user/assistant records, their first 512 content parts and first 8,192 Unicode characters of visible text. Output is further limited to 16 KiB per message and 64 KiB in total, preserving the newer records first. The call shows when older or longer text was omitted. Text written elsewhere after setup is not synchronized into an already-running call.

Before listening, the new setup protocol holds microphone tracks and explicitly requests paused turn detection. It waits for `session.updated` to confirm `audio.input.turn_detection: null`; an initial `session.created` event, missing fields or unknown values cannot prove the pause. Only then does it insert text items in order, check each final acknowledgement, clear the input buffer and wait for the listening configuration to be acknowledged. Typed input and tools remain unavailable until this finishes. Existing cached clients using the legacy SDP protocol keep their previous setup behavior.

After a connection failure, **Start a new call** first settles completed transcript saves and retries only unconfirmed, idempotent transcript writes. It then creates a fresh connection with the latest text snapshot. It does not resume the old provider session or replay audio or tools. A failed save stops the call and is reported; closing with unsaved text leaves it only in the current tab. Changing chats or accounts fences late events and prevents an old call from navigating back into its previous chat. Stopping a tool request does not prove that its external action was undone.

These boundaries follow the [Realtime conversation lifecycle](https://developers.openai.com/api/docs/guides/realtime-conversations), [client-event acknowledgements](https://developers.openai.com/api/reference/resources/realtime/client-events), and [WebRTC setup contract](https://developers.openai.com/api/docs/guides/voice-webrtc), reviewed on 30 October 2026 against the pinned OpenAI SDK 7.45.1. Polaris continues to use `POST /v1/realtime/calls`; GPT-Live is a distinct transport and is not substituted for this feature.

Microphone access requires browser permission and a secure context, with the usual localhost development exception. An unavailable provider, unsupported model or denied permission produces an actionable error. Camera, screen sharing and automatic device switching are not part of this release.

## Security and privacy

Provider credentials stay on the server. Call creation checks current account state and conversation ownership before provider access. Tool definitions are filtered by the account's effective permissions, and tool execution checks those permissions again. Context parity with every text-chat feature remains unfinished; do not assume all project instructions or attachments are automatically included.

Audio is sent to OpenAI when these actions are used. Application history and provider retention are different controls; this implementation does not claim Zero Data Retention. See [temporary chat and privacy](./privacy) for the separate text/voice history and file-retention controls. Usage reconciliation and spend budgets remain planned, so the duration and byte limits are not a billing guarantee.

## Validation

A bounded real OpenAI WebRTC check on 30 October 2026 passed against source `9020086`: setup returned 201, the explicit pause and both saved-text items were acknowledged, and one typed prompt produced the correct context-dependent answer. The two new transcript rows survived reload; reposting the assistant event returned the same row without duplication. The single remote hangup returned 200. Local peers, tracks, application, database and temporary files were cleaned up. The test used `gpt-realtime-2.1-mini`, 32 output-token maximum, no tools or transcription, a generated silent track and muted playback. Reported usage was 124 input text tokens and 17 output text tokens, with zero audio tokens. These results establish that narrow transport/context/persistence path, not physical speech or general multi-turn behavior.

The corrected client uses fresh 96-bit random identities within a 32-character safe-ASCII boundary for its context and typed items. Provider-issued call, event and response references are not shortened. A strict native local peer rejected the previous oversized client identities and accepted the corrected ones. Two earlier real probes failed before a response; the original provider errors were not retained, so their exact causes remain unproved. The first failed probe did not confirm remote hangup; the later failure and this successful check did. Historical uncertainty is preserved rather than inferred away.

The production standalone build is copied outside the checkout for HTTP tests, so missing deployment dependencies cannot be hidden by the development workspace. A private TLS/WebSocket fixture drives the real OpenAI SDK exchange, including format acknowledgement, WAV framing, incomplete responses, cancellation and no reconnect. Other cases cover ownership, disabled accounts, invalid models/voices, anonymous uploads and valid uploads above Next's default middleware cloning limit.

Context fixtures cover final-text extraction from malformed legacy records, microsecond ordering, Unicode and byte limits, temporary-state binding/expiry, transcript deduplication, cross-origin rejection and cancellation of fresh setup. Protocol units prove that early responses/tools and incomplete or mismatched acknowledgements cannot enable listening. An opt-in browser fixture replaces media and WebRTC with synthetic objects while retaining real authenticated context/transcript HTTP; it requests no microphone permission and makes no external provider calls. To run it, set `POLARIS_VOICE_BROWSER_FILE` to a private writable file when starting the audio suite, sign in using its synthetic account, open the supplied fixture page, and attach synthetic media before any call. Write `stop` to its control file to clean up. The private metadata contains test credentials and must not be published.

Multipart bodies are bounded while streaming, including when Content-Length is absent or misleading. Only the exact authenticated transcription and file-upload routes bypass the middleware clone; their handlers authenticate before reading the body. The WebSocket package is externalized to preserve optional native-module resolution in production.

Run `pnpm test:integration:audio` after a production build, using an explicit local disposable-test PostgreSQL connection in `DATABASE_URL`. The suite creates and removes its own database, temporary certificate, fixture files and standalone server; it does not use a provider key or physical microphone.

A bounded live OpenAI probe on 29 October 2026 generated a synthetic sentence with `gpt-realtime-2.1-mini` and transcribed it exactly with `gpt-transcribe`. This establishes those two provider paths for the tested account. It does not establish microphone quality, browser/device compatibility, acoustic echo handling, speaker fidelity, continuous WebRTC calls or other accounts' entitlements. Those checks remain explicit release work. GPT-Live has a separate typed evaluation helper; it is not substituted into the Realtime route.
