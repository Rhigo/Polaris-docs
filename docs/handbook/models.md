# Models and provider contracts

Polaris develops OpenAI support first and keeps the provider boundary explicit. The current OpenAI integration pins SDK **7.45.1** and records reviewed capabilities with a source, review date and registry revision. It uses Responses for conversation streaming.

## Choosing a model

The current seed adds GPT-6.1 Sol, GPT-6.1 Terra, GPT-6 Astra, GPT-6 Sol and GPT-6 Luna. Existing administrator names, disabled state, permissions and metadata survive re-seeding. A model's documented capabilities do not establish that a particular provider account can access it.

**Model default** leaves reasoning selection to the documented provider contract. Explicit **none** is offered only when supported. Unsupported reasoning, sampling, tool, structured-output and output-limit combinations fail before provider work. Known retired aliases are unavailable. These rules are versioned facts, not guesses from name prefixes. [Current OpenAI model guide](https://developers.openai.com/api/docs/guides/latest-model), [model catalogue](https://developers.openai.com/api/docs/models).

Unknown model IDs need an explicit administrator capability record bound to that exact provider and ID. The model administration dialog exposes the record and its provenance. Do not copy another model's contract merely because its name looks similar; verify its own documentation and a bounded test. Official known records take precedence over conflicting custom metadata.

If a saved local-model choice disappears, Polaris keeps that choice unavailable until the user selects a replacement. It does not silently choose a cloud model. Non-OpenAI conversations also skip the OpenAI-only title and memory helpers. This is not a universal offline guarantee: tools and separately configured features need their own network policy.

## Streaming behavior

The adapter normalizes text, refusals, reasoning summaries, authoritative function arguments, hosted-tool events, image results, citations and cached-token usage. Duplicate function completion is deduplicated. Incomplete, failed, aborted and truncated responses produce an error rather than successful completion. Unknown additive events are tolerated while a recognized terminal event remains required. [Responses streaming](https://developers.openai.com/api/docs/guides/streaming-responses).

The adapter accepts cancellation; cancellation across every application tool and external effect is still separate work. Main chat currently retains the existing Responses `store:true` policy; auxiliary title/memory requests use `store:false`. Local temporary-chat behavior must not be interpreted as a complete remote-retention guarantee.

## Evidence and remaining work

The combined provider/interface source passes a production build and 67 unit tests, with two opt-in HTTP suites skipped. Disposable database tests verify current catalogue creation, administrator customization preservation and repeat/upgrade behavior. Synthetic fixtures are typed against the pinned SDK; they contain no customer data.

Three bounded live GPT-6 Luna probes exercised the actual adapter: text streaming, strict JSON and function-call arguments. They used 106 input and 41 output tokens in total. No external function was executed. These checks do not prove every model, native tool, voice endpoint or account permission.

Claude and Ollama retain their legacy adapters plus explicit unsupported-option guards; complete versioned contracts for them remain planned. Current pricing/accounting is also unfinished: existing cost estimates are not a complete bill or an enforced spend budget, and unknown/new-model pricing must be corrected in AI-05 before relying on those totals.
