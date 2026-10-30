# Temporary chat and privacy

For everyday use: temporary chat is not saved as ordinary Polaris conversation history. Reloading loses its local context. This does **not** promise zero provider retention or erase separately uploaded/generated files and completed tool actions. Use saved chat when you need to return to the conversation; read [costs and data](./costs) before sharing content.

Temporary chat keeps conversation history in the current tab's memory. It does not create saved Polaris conversation, message or tool-execution records, and automatic memory use and saving are disabled. Reloading or resetting the temporary session discards its local context. Content-free usage accounting still applies.

## Text and voice continuity

The server encrypts and authenticates a continuation token tied to the account, temporary session and selected project. The browser holds that token in memory; it is not stored in localStorage or sessionStorage. Context is limited to 128 history records and 4 MB of plaintext, with a one-hour expiry after a completed text turn. Exceeding a limit produces an explicit error; start a new temporary chat to continue.

Temporary voice creates no saved conversation and does not persist its transcripts. Completed transcripts can inform the next text turn, and completed visible text can seed a later voice call. Duplicate transcript events are ignored. Resetting the session closes its active microphone, peer and data channel. Device voice remains subject to the [voice verification limits](./voice).

Profile instructions and an explicitly selected project's context still apply. Automatic saved-memory retrieval, memory extraction, generated titles and personalized starter prompts are disabled. Non-OpenAI selections also use local starter prompts, so choosing a local text model does not silently call OpenAI for that helper.

## Provider storage and files

Temporary OpenAI requests use `store:false` and full stateless context, including encrypted reasoning and authoritative tool outputs. They never accept a client-supplied `previous_response_id`. Saved chats retain their normal server-owned response chaining. Owned temporary-chat documents use inline bytes instead of automatically uploading or caching new provider Files API objects.

These controls do not promise zero provider retention. Abuse monitoring, account-level data controls and individual service retention remain separate; see [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data). Stateless reasoning follows the [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning).

Independently uploaded files, generated artifacts, project files/vector stores and explicitly requested tool actions retain their own lifecycles. Temporary chat does not delete these assets or undo external actions. Anthropic temporary requests omit the explicit prompt-cache hint; that is also not a zero-retention guarantee.

## What Stop does

Stop closes the provider transport and propagates cancellation to supported tools. The loop checks cancellation before further model or tool work. OpenAI and Anthropic requests disable automatic retries, and each Ollama stream owns its cancellation state. Uncertain sandbox outcomes stop the loop and require checking the result before another attempt.

A closed connection does not prove a remote action was undone or a workload was cleaned up. Completed actions, independent files and synchronous work already in progress may remain. Workload cleanup is the execution broker's separate contract, and successful artifact export requires its explicit confirmation.

## Verification

Unit and standalone HTTP suites cover encrypted-context tampering, account/project/session boundaries, expiry, bounded context, saved versus temporary continuation, inline documents, memory controls, voice handoff and real local socket cancellation. The HTTP fixture uses a relocated production server and a fresh disposable PostgreSQL database; it checks that temporary history tables remain unchanged and saved chats still persist normally.

Run `pnpm test:integration:privacy` after a production build with the dedicated local test database connection. Provider fixtures and transcripts are synthetic; these tests use no real account data, provider keys or microphone.
