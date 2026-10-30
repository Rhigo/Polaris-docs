# Charts and data tables

Ask for a bar chart, line chart or downloadable data table. Polaris can render a bounded declarative data block as it arrives, using its ordinary chat text stream. This is an application convention, not a guarantee that a particular model will produce a valid chart. Ordinary Markdown tables, provider citation chips and owned file attachments continue to work separately.

Completed rows appear incrementally. A valid end record confirms the row count; CSV and JSON downloads become available after streaming stops. An interrupted block remains labelled **Incomplete data**. Invalid syntax, unsupported fields or exceeded limits produce a visible error and a bounded source preview. Partial or invalid blocks cannot be exported.

Charts offer an accessible data table with column headings, exact values and a keyboard-focusable scrolling region. Missing values remain missing: line charts leave gaps, and bar charts omit those values. Categories follow row order; numeric or date labels do **not** imply proportional time or numeric spacing. Bar and line views are supported; scatter plots, pie charts, executable JavaScript, arbitrary styling and interactive analytical transformations are not part of this format.

Charts adapt to the available width while keeping axis labels readable. Narrow views show fewer category labels; long labels are shortened visually, with the full values retained in the table. Below 200 pixels of available chart space, use the data table instead of a compressed chart. Resizing does not close the table disclosure or move its keyboard focus.

When starting from Chat, the first completed reply gets its saved URL without closing an open data table or moving its keyboard focus. Stop keeps the conversation once the first user message has been saved, so a follow-up uses that same chat. A partial reply can remain visible in the current view without having been saved; leaving or reloading shows the saved history. The just-created view preserves its local message display until you leave or reload, so messages added in another tab appear at that point. New Chat, navigation and account changes clear the previous view and reject late results from it.

## Data and source boundaries

Only absolute HTTP(S) source links without embedded credentials are accepted. They are labelled **Model-supplied sources · not independently verified**. Polaris does not fetch or verify these links. These links are not provider citation annotations or evidence that a claim is correct. Ask for source material and check important results.

The renderer accepts text, bounded finite numbers and null values. It creates fixed React/SVG elements; data cannot supply HTML, scripts, callbacks, external image resources or arbitrary SVG attributes. A block is limited to 128 KiB of UTF-8 text, 200 rows, eight columns, three chart series and six source links. Numeric magnitudes cannot exceed `1e15`; cells are limited to 240 characters.

CSV exports include columns and rows. Formula-leading string values and column labels receive a leading apostrophe, including formulas preceded by whitespace, control or formatting characters. Numeric values remain numeric. JSON exports preserve original values, the declared header and source metadata, with an explicit note that sources are model-supplied. JSON is preferable when exact string preservation or provenance metadata matters.

Downloads happen only when the user clicks a download button. They create browser downloads, not server file records or provider uploads. Saved chat text follows existing owner-scoped conversation access. Temporary chat data follows the [temporary-chat policy](./privacy); an explicit browser download is a separate local copy. This format adds no provider retention setting, upload, tool execution or source-fetching call.

## Version 1 format

Use a fenced `polarisdata` block containing one JSON object per line. Each object is strict: extra fields are rejected. The header comes first, then zero or more rows, then one end record with the exact count. No record may follow the end record. A newline terminates a record; an unfinished final JSON prefix may be displayed provisionally only while it can still become valid syntax.

````text
```polarisdata
{"type":"data","version":1,"title":"Illustrative revenue","description":"Synthetic example, not measured results.","view":"bar","columns":[{"key":"quarter","label":"Quarter","type":"string"},{"key":"revenue","label":"Revenue","type":"number"}],"x":"quarter","series":["revenue"],"sources":[]}
{"type":"row","values":["Q1",12]}
{"type":"row","values":["Q2",-4]}
{"type":"row","values":["Q3",null]}
{"type":"end","rows":3}
```
````

Column keys are unique, start with a lowercase letter and contain only lowercase letters, digits or underscores, with a maximum length of 32. Values must match each declared column type or be null. A table uses `"view":"table","x":null,"series":[]`. A chart needs a known category column and one to three distinct numeric series. Source entries have exactly `label` and `url` fields. Titles are limited to 160 characters, descriptions to 480, column labels to 80, source labels to 160 and source URLs to 2,048.

The orchestration prompt describes this optional convention. Requests using an explicit `responseFormat` skip that instruction and keep their strict structured-output contract unchanged. The app still validates generated data; a prompt is not a validation boundary.

## Provider contract and validation

A bounded live GPT-6 Luna request on 29 October 2026 produced a valid three-row block using this instruction and parser, preserving supplied negative and missing values. This was a direct SDK/format check with provider storage and tools disabled, not a full live browser journey or a guarantee for all prompts/models.

Reviewed **2026-10-29** against the pinned OpenAI Node SDK **7.45.1**. OpenAI Responses provides typed text delta and completion events; Polaris transports this convention through those existing events. The provider does not promise a native Polaris chart format. [Streaming Responses](https://developers.openai.com/api/docs/guides/streaming-responses), [streaming event reference](https://developers.openai.com/api/reference/resources/responses/streaming-events).

OpenAI Structured Outputs uses a supported JSON Schema subset and has refusal/incomplete-output cases. This slice leaves that API contract intact instead of treating the chat display convention as a replacement for a requested strict schema. [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

Focused tests cover every prefix of a valid stream, escaped strings, invalid or terminated partial records, bounds, source schemes, formula-safe exports, finite chart geometry and escaped rendering. The standalone HTTP suite checks incremental rows, owner isolation, reload fidelity, invalid-block persistence, strict-format preservation and temporary stateless history without file creation. It uses an isolated PostgreSQL database and a synthetic loopback provider; it does not use provider credentials or paid generation. Run `pnpm test`, `pnpm build`, then `pnpm test:integration:rich-data` with a disposable loopback PostgreSQL connection in `DATABASE_URL`.

For manual browser verification, the integration harness accepts `POLARIS_RICH_BROWSER_FILE` pointing to a new local file. It writes synthetic sign-in details with mode `0600`, copies static assets into its relocated standalone tree and keeps that isolated fixture alive briefly. Create the adjacent `.stop` file to finish cleanup. Check a saved chart, the table disclosure with Enter/Tab, an eight-column table at a narrow viewport, incomplete/invalid states, CSV/JSON downloads and reload. Sending `gated chart` holds the synthetic stream after one row; create the adjacent `.release` file to complete it while checking that disclosure state and focus survive. The fixture never connects to the live application or a real provider.

For first-chat routing checks, start `gated chart` from New Chat, open the table with Enter and focus it with Tab before releasing the stream. The heading identity, disclosure and focus should survive the saved-URL transition. Repeat with Stop/follow-up, New Chat, browser Back/forward and a project switch while the reply is held. The model-identity HTTP suite also verifies that persistence notifications match actual owner-scoped message IDs, stopped first turns reuse their saved conversation, and temporary turns emit no persistence notifications. Display keys stay separate from those server-confirmed IDs.
