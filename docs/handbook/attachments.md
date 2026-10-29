# Attachments in saved conversations

Uploaded images, PDFs and text files stay visible when a conversation is opened again or refreshed. The conversation and paginated message endpoints now return `attachedFiles`, matching the chat store's existing attachment model. Messages containing only attachments remain visible.

The server resolves saved `file` and `image` part IDs against the signed-in user's file records. Names, MIME types and sizes come from those records; saved URL, name and MIME hints do not control previews. IDs are deduplicated within a message. Storage paths and owner IDs are never serialized. The existing conversation and file authorization checks still apply.

Missing or expired records, files missing from local storage, and another user's file IDs all produce the same generic `availability: "unavailable"` state. The UI offers no preview or download for those references. Availability is checked again on each read, with bounded database and filesystem batches. This uses the application's current local filesystem storage; a future object storage adapter must supply its own availability check.

Available images open the image panel. PDF bytes must pass the response MIME and PDF-signature checks described in [artifact security](artifacts-security.md) before a Blob is created. Text is displayed as text and its visible content is limited to 50,000 characters. Other formats have a download link. Preview requests time out after 15 seconds, are cancelled when the panel closes, and expose Retry after an error. PDF object URLs are revoked on replacement or close.

PDF text extraction also now passes a plain `Uint8Array` to PDF.js. Passing a Node `Buffer` caused valid PDFs to fail after Next initialized its server environment. The copy preserves the original uploaded bytes. This fix needs no package upgrade or server externalization setting. A malformed PDF remains downloadable with failed-extraction feedback and no invented text.

## Automated standalone acceptance

After `pnpm build`, run `POLARIS_ATTACHMENT_INTEGRATION=1 pnpm test:integration:attachments` from the repository root with `DATABASE_URL` for a loopback test cluster that can create databases. The Linux/macOS harness creates its own `polaris_attachment_review_<uuid>` database, generated auth/encryption secrets, private storage and deterministic Ollama-compatible provider on ephemeral loopback ports. It relocates the production standalone server outside the checkout before testing metadata, multipart uploads, extracted PDF text, byte-for-byte downloads and saved chat reconstruction.

The harness closes its process groups and removes only its fixture database/storage, including files left if a test child times out. It skips before initialization without the opt-in flag. CI runs it on Node 22/24 and PostgreSQL 16 without a real provider credential or model download. The direct test commands below remain available for debugging an already isolated fixture.

## Regression checks

From `apps/web`, using the repository's installed dependencies:

```sh
node --import=tsx --test lib/files/message-attachments.test.ts lib/files/extractor.test.ts lib/pdf-preview.test.ts
node ../../node_modules/typescript/bin/tsc --noEmit
```

The HTTP regression uses a separately bootstrapped local test database and a local running Polaris instance. It creates synthetic users, conversations and files and removes them afterward. The server and test runner must share `DATABASE_URL` and access to the same local storage. Tests require an explicit `POLARIS_ATTACHMENT_TESTS=1`, a loopback database URL, and a database name starting `polaris_attachment_review_`; they refuse other databases. Use the direct command below with that environment.

```sh
POLARIS_ATTACHMENT_TESTS=1 POLARIS_TEST_BASE_URL=http://localhost:3164 \
node --env-file=/path/to/private-test.env --import=tsx --test tests/integration/message-attachments.test.ts
```

This covers both message endpoints, image/PDF/text metadata, attachment-only messages, missing database and disk records, deleted or expired files, anonymous requests, foreign conversation requests and foreign file references.

For the real multipart upload → chat → saved-message roundtrip, start the deterministic local provider fixture:

```sh
node --import=tsx tests/browser/attachment-provider.fixture.ts
```

In the disposable database, enable the Ollama provider with config `{"baseUrl":"http://127.0.0.1:3155"}` and enable catalog model `attachment-fixture:latest` with vision and streaming capabilities. Disable other providers in that fixture. The fixture returns fixed text, makes no outbound calls and needs no model download or API key. The test checks that the configured URL is the expected local fixture before sending.

```sh
POLARIS_ATTACHMENT_TESTS=1 POLARIS_TEST_BASE_URL=http://localhost:3164 \
POLARIS_ATTACHMENT_FIXTURE_URL=http://127.0.0.1:3155 \
node --env-file=/path/to/private-test.env --import=tsx --test tests/integration/message-attachments.test.ts
```

The roundtrip uploads a valid PNG, a PDF with extractable text (avoiding optional OCR), and a text file. It completes a chat, reads it repeatedly through both message endpoints, and compares downloaded bytes. It also checks the exact extracted PDF text stored in the database, then verifies malformed-PDF failure and unchanged download bytes. No model/provider implementation is changed by this fix. Scanned-PDF OCR is outside this regression; no OCR models were downloaded.

## Integration boundaries

This slice preserves the dedicated read-aloud control and temporary-chat state. Temporary uploads still follow the privacy policy; attachment hydration does not create saved conversations for temporary chats. The authoritative response MIME and PDF-signature guard remains in `lib/pdf-preview.ts` and is exercised with the merged application. No provider, retention, or authentication setting is changed.

## Browser verification

Chrome verification against an isolated synthetic database confirmed image/PDF/text previews, full reload persistence, attachment-only unavailable states, rejection of HTML labelled as PDF, and recovery through Retry after an owned text file was temporarily unavailable. The PDF rendered inside the HTTP app page. Screenshots and test logs are retained with the review outputs.

Native file-picker selection remains pending in this session: the Chrome extension lacked file-URL access and the Mac was locked. Permissions were not changed and the Mac was not unlocked. The multipart API path was independently verified; this is not a claim that the optimistic attachment UI was exercised through the native file chooser. Firefox and WebKit were not exercised.
