# API and extensions

## Current interface

Polaris provides [scoped user API keys and a versioned read API](./api) for model discovery and minimal profile access. Its broader cookie-authenticated `/api/...` UI routes remain internal contracts. Do not distribute session cookies as API credentials.

Existing custom functions can call OpenAI, a webhook or a basic MCP endpoint. The OpenWebUI Python router in `docs/` is a separate integration example, including unfinished file-storage hooks. It does not establish in-app Python plugin compatibility.

## Next external API capabilities

Streaming chat needs explicit cancellation, idempotency, model/tool permissions and spend controls before it joins the public contract. Files, runs, pipelines and detailed usage will follow with their own scopes. OpenAI-compatible endpoint names and payloads remain a design; the implemented `/api/v1` read API does not claim drop-in compatibility.

## Planned workflow framework

A pipeline is a versioned graph with validated model/tool/transform/branch/parallel/approval/output nodes. A run records node inputs, redacted outputs, timings, errors and provenance. Dry runs use fixtures or explicit limited credentials. Exported definitions contain credential references, never tokens.

Provide a visual editor and JSON interchange with schema validation, version history and rollback. OpenWebUI-style Pipes, Filters, Actions, Events and Valves are compatibility targets; support is declared per version and tested example. Arbitrary Python extensions require isolated execution.

MCP integrations need initialization, tool discovery, schemas, supported transports, session recovery and owner-scoped authentication. OpenAPI imports need endpoint allowlists, schema validation and explicit approval policies. All extension mechanisms share the same tool gateway and run budgets.

See `API-*` and `EXT-*` in the [backlog](./backlog).
