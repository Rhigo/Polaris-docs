# API and extensions

## Current interface

The [versioned API](./api) exposes scoped model/profile reads, bounded saved-text tasks and [versioned text workflows](./workflows). Keys can opt into task creation, inspection and cancellation; the worker checks the originating key again before dispatch. The broader cookie-authenticated `/api/...` UI routes are internal contracts. Do not distribute session cookies as API credentials.

Administrator-managed custom functions can call configured OpenAI or HTTP endpoints. The existing MCP form and manual call path do not establish complete protocol interoperability. Discovery, credential lifecycle, result validation and transport behavior still need their own implementation and tests. The OpenWebUI router in `docs/` remains a separate example with unfinished file-storage hooks.

## Next external API capabilities

Streaming chat needs explicit cancellation, model/tool permissions, request identity and accounting before it joins the public contract. Files and detailed usage need separate scopes; native text workflows already have six explicit opt-in permissions. The implemented API does not claim drop-in OpenAI SDK compatibility. Task token/time limits are not dollar spending caps.

## Native text workflows and remaining graph work

The implemented native workflow slice uses a versioned JSON definition with one text input and one to four sequential OpenAI model steps. It provides immutable revisions, persisted per-step progress/output, cancellation, a JSON editor, import/export and an executable API client through a separate worker. See the [workflow contract](./workflows). Python, JavaScript, arbitrary URLs and external tools are outside this slice.

The broader framework remains planned: validated model/tool/transform/branch/parallel/approval/output graphs, a visual editor, explicit credential references, bounded resources and trace events. The sequential editor does not satisfy those broader acceptance criteria.

## MCP protocol versions

The modern and legacy wire contracts need distinct adapters. The 2026-07-28 specification uses per-request version/capability metadata and discovery, and removes the initialization handshake and protocol-level HTTP sessions. The 2025-11-25 contract retains initialization and session behavior. A connector must select a supported version deliberately, validate bounded results and apply that version's cancellation/recovery rules. [Modern changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog), [legacy lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle), [TypeScript SDK negotiation](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions).

Protocol descriptions, tool annotations and discovered schemas are untrusted input. Owned encrypted credentials, destination policy, explicit selected tools and a durable pre-dispatch record are separate application requirements. A configured bearer header is not full OAuth interoperability.

## OpenWebUI compatibility boundaries

Three contracts must be tested separately: an external Pipelines service's client API; OpenWebUI's Python Function hooks and injected application context; and native Polaris JSON workflows. A compatible endpoint or JSON definition does not make Python source, Valves or lifecycle hooks interchangeable. See the [Pipelines repository](https://github.com/open-webui/pipelines) and [Function documentation](https://docs.openwebui.com/features/extensibility/plugin/functions/).

Future compatibility claims will name the tested upstream version, hook and supported subset, with executable examples and rejection cases. Arbitrary Python modules will require an isolated runtime; the current offline code runner cannot transparently host networked plugins. See `API-*` and `EXT-*` in the [backlog](./backlog).
