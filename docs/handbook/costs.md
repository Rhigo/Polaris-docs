# Costs and data before your first message

Ask your administrator which provider account pays for your requests. Polaris can use hosted AI services or local models, and different features can use different providers. A provider/model being visible in the app is not a promise of free use or access under every account.

## Understand the numbers

**Unknown does not mean free.** Polaris reports estimates for recorded model-token usage, not a complete provider invoice or a spending limit. The administrator's **Admin panel → Analytics** view shows recorded usage; ask the administrator if you need an account-level explanation. The [dated accounting policy](./token-accounting) lists reviewed rates and boundaries.

For example, a hypothetical period might show a known subtotal of **$0.10** and **two unpriced requests**. The overall cost remains unknown; $0.10 is not a cap or the final bill. A tiny positive estimate can display **less than $0.0001** instead of being rounded to free.

Voice/audio, image generation, some tools/storage, auxiliary calls, hosting, taxes and account discounts are outside the model-token estimate. Failed, cancelled or disconnected calls without a recorded completion may also be missing. Check the provider's billing for actual charges. Stopping a request or setting a credential expiry does not undo work already sent to the provider.

A supported local Ollama configuration can have **no provider token fee**, while still costing electricity, hardware or hosting. A remote endpoint, cloud model or unreviewed proxy remains unknown; the Ollama protocol alone does not establish local or free execution. Task token/time limits and credential cutoffs are not dollar budgets.

## Decide what to share

Messages and files may be sent to the selected provider and explicitly enabled tools. Use only content you are permitted to share with those services. The [privacy guide](./privacy) explains memory/context, provider storage and independent file/tool lifetimes.

Temporary chat does not save ordinary Polaris conversation history. It is not a promise that providers retain nothing, and it does not delete independently uploaded/generated files or reverse external actions. Reloading a temporary chat loses its local context; use saved chat if you need to return to that conversation.

Never paste passwords, provider API keys, sign-in codes or environment files into a conversation. Store configuration secrets through the administrator's intended controls. For loss or deletion of saved data, ask the administrator about backup coverage and [recovery](./recovery); a browser shortcut or installed app is not a backup.

## Start small

For a first check, select an approved text model and send one harmless short message. Add a file or optional tool only when needed and after checking its guide. Live voice has separate [release and device-validation limits](./voice); text success does not validate a call. If an operation fails, read its error and any saved result before deliberately trying again.
