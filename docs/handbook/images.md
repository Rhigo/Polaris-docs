# Image generation

Polaris uses the OpenAI Responses image-generation tool inside an ordinary chat. The selected conversation model stays separate from the image model. An administrator configures the image model, quality, size, background and output format in **Settings → Image generation**. Existing selections are preserved; an unknown or retired selection fails visibly instead of silently switching models.

## Reviewed contracts

Reviewed **2026-10-29**, against the pinned OpenAI Node SDK **7.45.1**. New settings default to `gpt-image-2.5-flare`. Flare targets everyday generation; Sunburst emphasizes editing precision. Both undated IDs and their `2026-09-08` snapshots are selectable. [Flare model](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare), [Sunburst model](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst).

The app also supports reviewed `gpt-image-2` aliases/snapshot, `gpt-image-1.5` and `gpt-image-1-mini`. It does not infer capabilities for the mutable `chatgpt-image-latest` alias. `gpt-image-1`, DALL·E 2 and DALL·E 3 are retired and are rejected. The SDK retaining a string in its types does not establish current service availability. [Image API reference](https://developers.openai.com/api/reference/resources/images/methods/generate).

The Responses tool receives the image model explicitly, along with validated options and standard moderation. GPT Image 2.5 supports quality through `max`; earlier supported models stop at `high`. PNG, JPEG and WebP are supported; transparency requires PNG or WebP. Custom dimensions are available for GPT Image 2/2.5 within the documented pixel, edge, aspect-ratio and multiple-of-16 bounds. Earlier models use standard sizes. [Responses image tool](https://developers.openai.com/api/docs/guides/tools-image-generation).

The guide documents partial-image streaming, while the 2.5 model cards report streaming as unsupported. Polaris requests zero partial previews and consumes final images within the streamed chat response. Account eligibility is not inferred from documentation: GPT Image may require organization verification, and account limits still apply. [Image generation guide](https://developers.openai.com/api/docs/guides/image-generation).

## Files, follow-up edits and limits

Final images must pass canonical base64, format, complete raster decode and dimension checks before storage. The app accepts at most four generated images and 40 MiB of decoded file bytes per chat turn, with a 20 MiB maximum per file. Image-enabled provider requests have a three-minute deadline. Failures and disconnects do not trigger automatic retries; interrupting a request does not prove the provider stopped work or waived charges.

Files belong to the authenticated user and validated project. Chat/tool records store owned-file metadata rather than base64. Downloads enforce ownership and expiry. Failed database insertion attempts disk cleanup; cancellation during persistence attempts to remove the newly saved artifact. Completed artifacts are independent of chat-history retention. Expiry prevents use/download but is not a claim of physical erasure; owners can still delete expired records.

Temporary edits and full-history rebuilds reload up to four recent owned image references, with a combined 20 MiB decoded-byte replay budget. Each reference counts, including repeats. Bounded reads verify the actual file length against its reserved metadata size. Missing, replaced or expired images become explicit unavailable context; private download URLs are never sent as provider image references. This application replay budget is separate from model-specific input limits and current-turn uploads. [Vision input requirements](https://developers.openai.com/api/docs/guides/images-vision).

Saved chats may continue through their existing server-recorded response chain. Binary payloads are excluded from temporary history tokens while encrypted reasoning and function-call context remain intact. Older omitted references must be reattached when needed. Temporary chats keep `store:false`, do not upload images to the provider Files API, and do not chain stored response IDs. Provider retention policies still apply; this is not a zero-data-retention guarantee.

The existing chat image preview/download design is retained. PNG/JPEG/WebP filenames and MIME types match the validated output. Provider-native image charges remain outside the model-token estimate; check provider billing for actual costs.

## Verification

A bounded live check on 2026-10-29 used `gpt-6-luna` with `gpt-image-2.5-flare` to generate a synthetic 1024 × 1024 PNG and edit its colour. Both passed the real application adapter and full raster validation with `store:false`, zero SDK retries and a probe-only limit of one image tool call per request. The result confirms that account's final-image path; it does not establish eligibility for other accounts, other image models or partial previews. HTTP authorization, storage and temporary-history sealing are tested separately with fixtures.

`pnpm test` includes capability, byte validation, replay, failure, cancellation and deduplication fixtures. `pnpm test:integration:images` creates a uniquely named disposable database and a private standalone server, then uses only a local synthetic provider. It covers settings authorization/Origin/limits, owned downloads, saved and temporary edits, malformed/failed output, rollback, expiry and transport cancellation. Supply only a local test-cluster `DATABASE_URL`; never point the fixture at a production database. Its production build must exist first.
