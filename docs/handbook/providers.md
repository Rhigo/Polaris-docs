# Connect your first model provider

This page is for a Polaris administrator. Ordinary users should ask their administrator if no suitable model appears. A **provider API key** lets Polaris call an AI service. A **Polaris Developer access key** lets an external program call Polaris. They are not interchangeable.

Before enabling a paid provider, agree who owns the account and pays its charges. Read [costs and data](./costs). Keep provider credentials in **Admin panel → Providers**, never in a chat, workflow prompt, public document or screenshot.

## First hosted provider: OpenAI

1. Use the provider account owner's approved API project and credential. OpenAI's [official quickstart](https://developers.openai.com/api/docs/quickstart) links to API-key creation and billing. Use a normal application API key, not an organisation administration key; [OpenAI's authentication reference](https://developers.openai.com/api/reference/overview#authentication) explains the distinction and secret handling. Follow that account's billing/access policies rather than assuming access to a model from its name.
2. In Polaris, open your account menu → **Admin panel → Providers**. On **OpenAI**, enter the key in **API Key**, enable the provider and choose **Save**.
3. If the key should stop serving new requests at a particular time, set **Stop new provider requests at (UTC)** before saving. This is optional and is not a spending cap or provider-side revocation. A past/invalid cutoff blocks new requests. See [credential expiry](./provider-credentials) for rotation and preserving saved values.
4. Open **Admin panel → Models**. The **Model Catalog** can show seeded entries; **Refresh Provider Models** requests the configured provider's available list. Import only the model IDs you intend to offer and enable the relevant entries. A catalog listing alone does not prove entitlement or support for every tool.
5. Use the model's **Configure** control to check access. **Public** means available to eligible users of this installation, not published anonymously on the internet. **Assigned** restricts it to the configured users/groups. Both the provider and model must be enabled.
6. Return to chat, select that model and send a harmless short prompt, such as “Reply with one short sentence.” This is a real model request and may be billed. A completed reply confirms that particular request; it does not validate images, voice, tools or every account/model combination.

Hosted provider cards do not currently have an Ollama-style **Test Connection** button. A saved-key indicator means configuration was stored; the provider-model refresh and an explicitly authorised small chat test are separate checks. These steps and labels were checked against source. This documentation change did not make a provider request or complete a fresh account setup.

Polaris reviews exact OpenAI model contracts. **Needs configuration**, unknown or retired entries should not be treated as supported merely because they can be imported. See [model contracts](./models) and the dated [token-estimate policy](./token-accounting). Anthropic and other visible provider settings do not imply complete feature parity with OpenAI; verify each intended feature before enabling it for users.

## Local models with Ollama

An operator must first supply a running Ollama service and sufficient model storage/hardware. In **Admin panel → Providers → Ollama**, set the **Base URL** reachable from the Polaris web process, enable it and save. The bundled Compose service uses `http://ollama:11434` when that optional service is started. `localhost` inside a container refers to that container, not your laptop or another service.

Use **Test Connection**, then **Load Models**, to inspect that runtime. Enable/import the intended installed model in the catalog. Pulling an additional model downloads data and consumes storage; review the model and resources first. Keep local endpoints private and do not loosen general private-network settings just to bypass an unexpected error.

Choosing Ollama does not make every Polaris feature offline: OpenAI-backed audio or explicitly enabled search/tools can have separate providers. A zero local-model token fee excludes hosting/electricity, and cloud/proxy Ollama endpoints are not automatically classified as free. See [the reviewed local boundary](./token-accounting#local-ollama-boundary).

## When a model does not work

| What you see | What to check |
| --- | --- |
| No model in the composer | Provider enabled, model enabled, and correct user/group assignment |
| Credential expired or invalid | Intended saved UTC cutoff and the provider account's current key/access; do not paste the secret into an error report |
| Provider model refresh fails | Saved credential, account access, network reachability and visible error. Keep the selected model; do not silently substitute another paid provider |
| Model needs configuration or is retired | The exact model ID and reviewed capability record; use a supported selection rather than a similar-looking alias |
| Text works but a tool/file/voice feature fails | That feature's separate model, provider configuration, access and documented limits |
| Ollama connection fails | Whether the service is running and its URL is reachable from the web process's network namespace |

For support, record the model ID, visible error and request ID if available. Share no key or private prompt. Check provider billing directly for charges and review failed/stopped attempts before intentionally repeating them.
