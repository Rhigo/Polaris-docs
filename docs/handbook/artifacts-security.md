# Artifact preview security

Generated HTML is untrusted code. It must never run directly on the authenticated Polaris origin, including when opened in another window. A raw HTML Blob created by Polaris inherits that origin; `noopener` alone does not stop it reading app storage or calling authenticated APIs.

## Preview boundary

`apps/web/lib/artifact-preview.ts` builds a trusted outer document containing an encoded `data:` document in a nested iframe. Only the nested document contains generated markup. Its sandbox is exactly `allow-scripts`: it has an opaque origin, no app-origin DOM/storage access, no popups, forms, downloads, or ancestor navigation. Camera, microphone, location, display capture, and payments are also denied through the iframe permissions policy.

The outer document installs CSP before creating the nested iframe. It permits inline JavaScript/CSS, local data/blob images and media, and data fonts. It denies external scripts, fetch/XHR/beacon/WebSocket connections, workers, objects, base-URL changes, and forms. Its `frame-src data: blob:` policy also blocks the generated iframe navigating itself to an HTTP(S) app endpoint. A policy only inside generated markup would not provide this parent navigation check. Local data/blob navigations inherit CSP. The inner document additionally forbids nested frames.

Inline code blocks, the side panel, fullscreen, restarts, and separate-window viewing use this constructor. A separate window opens a Blob of the **trusted wrapper**, with `noopener,noreferrer`; raw generated HTML is never its top-level document. Blob URLs are revoked after a bounded delay. Generated source is encoded rather than interpolated into wrapper markup or executable script.

Self-contained SVG/canvas charts and DOM interactions still run. An in-memory storage shim lets demos use local/session storage without accessing Polaris storage; preview state resets on restart. External CDN libraries, remote fonts/images, and network-dependent demos do not load. Bundle necessary code/resources into the artifact instead of allowing arbitrary origins.

Only bounded resize notifications cross into Polaris. Both relay and app receiver check the exact sending window, opaque `"null"` origin, preview ID, message type, and finite nonnegative height. The app also caps displayed height. The `"null"` origin or an ID alone is not authentication. The bridge exposes no API or storage proxy.

## Other rendering and download paths

- Raw Markdown is parsed and then sanitized with the existing `rehype-sanitize` default schema. It cannot introduce app-origin iframe/srcdoc, SVG active content, script, object, embed, forms, event attributes, or unsafe URL protocols. Fenced HTML remains source until the controlled preview renders it. Safe formatting and disabled task-list checkboxes remain supported.
- `/api/files/[id]` retains authentication and owner checks. MIME comparison uses a trimmed, lowercase essence without parameters. Only known passive raster images, PDF, and plain text are served inline.
- HTML, SVG, XML, JavaScript, and unknown types are attachments with `nosniff`, `no-referrer`, private `no-store`, and a script-disabled CSP sandbox as defense in depth. Downloaded bytes remain the original source.
- The PDF object viewer requires an actual PDF response MIME and `%PDF-` signature before creating a Blob with fixed PDF MIME. Attachment metadata alone cannot turn HTML into an app-origin object document.
- Image thumbnails use image elements; SVG is passive in this image context. File/image new-tab links rely on the authenticated file response policy. Active files download rather than becoming app-origin documents. HTML revisions are fetched as text and rendered through the controlled viewer.

Downloaded HTML/SVG opened outside Polaris is a separate user-controlled execution context without this viewer policy. The browser boundary does not impose CPU/memory quotas or provide an OS network firewall: CSP controls the listed resource mechanisms, not every browser protocol such as WebRTC. This is not the per-run container/VM boundary required for terminal or computer execution. Do not expose credentials or privileged application capabilities to generated code.

## Regression checks

From `apps/web` with pinned workspace dependencies:

```sh
node --import=tsx --test lib/artifact-preview.test.ts lib/markdown-policy.test.ts lib/files/response-policy.test.ts lib/pdf-preview.test.ts
node ../../node_modules/typescript/bin/tsc --noEmit
```

Cases cover wrapper escaping/lone surrogates, bridge ordering/storage, exact window/origin/ID validation, bounded heights, the actual new-window helper, active raw Markdown, and mixed-case/parameterized MIME values.

For the authenticated file route, start the app against a **disposable migrated local database** and run:

```sh
POLARIS_TEST_BASE_URL=http://localhost:3153 node --env-file=/path/to/private-qa.env --import=tsx --test tests/integration/artifact-files.test.ts
```

This test creates synthetic users/files, verifies original downloads and response policy, checks unauthenticated 401/non-owner 404, and removes its fixtures. It uses no provider credentials or calls.

For real browser enforcement:

```sh
node --import=tsx tests/browser/artifact-security.fixture.ts
```

Open `http://127.0.0.1:3152` in a separate QA browser session. The fixture serves the actual production helper as a browser module, using only synthetic cookies/storage/API data. Five embedded cases check app cookie/storage/DOM denial, credentialed fetch and subresource/form/popup blocking, SVG/canvas rendering, HTTP self-navigation/meta-refresh denial, and CSP inheritance after data/blob navigation. Open each separate-window case, inspect its result, return, and select **Verify counters**. The protected endpoint must receive **zero requests**: a CORS-blocked response alone is insufficient. All five embedded cases must report, storage must remain unchanged, and resize source validation must pass. Use browser tooling only where policy permits observation; report an unavailable popup inspection rather than bypassing a restriction.

## Specification references

The [HTML iframe sandbox](https://html.spec.whatwg.org/dev/iframe-embed-object.html) defines opaque origins and sandbox permissions. [HTML policy containers](https://html.spec.whatwg.org/multipage/browsers.html#policy-containers) define local-document inheritance. The [CSP specification](https://w3c.github.io/webappsec-csp/) describes resource/navigation enforcement and local-scheme inheritance. These controls complement server authentication and file ownership checks.
