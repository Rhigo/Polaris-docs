# Install Polaris

Polaris can open in its own app window on browsers that support installation. It still needs a connection to your Polaris server to load chats, files and account details. Installation does not add offline chat, background synchronization, push notifications or a mobile-native application.

Choose **Install Polaris** from the account menu or sign-in page. If an installation button is available, it opens your browser’s own prompt. Otherwise use the browser menu: Chrome/Edge’s install option, Safari’s **Share → Add to Home Screen** on iPhone/iPad, or **File → Add to Dock** on supported macOS versions. Names and availability vary by browser. A trusted HTTPS origin is required outside loopback development; an untrusted self-signed certificate is not a reliable installation setup.

The manifest uses the existing Polaris star, a standalone window, a root start URL and 192/512-pixel icons, including a maskable icon. The start URL contains no account, conversation, token or project identifier. Opening the installed app uses the normal Polaris sign-in and current-account checks.

## Offline behavior and privacy

Opening installation help opts into preparing a public connection notice. A browser-native installation event also prepares it. Ordinary app loading only inspects an existing registration. If a later navigation cannot reach the server, the notice explains that a connection is needed and offers **Open Polaris again**.

The feature stores exactly five public files: `/offline.html` and four brand icons. Their current combined size is 21,414 bytes. Each file is bounded to 256 KiB and checked against its generated length, SHA-256, MIME type and public-response marker before storage. Preparation omits credentials and rejects redirects. Stored responses contain only rebuilt public headers.

Authenticated pages are always requested from the network and never written to this cache. API, RSC, provider, file and mutation requests are not cached; HTTP authorization failures are preserved. The notice cannot display private chat history or send a message. Normal application/session storage and browser history continue to follow their existing behavior; this feature is not a claim that the browser or providers retain no data.

## Updates without interrupting work

Use **Check for updates** in installation help. An available update waits while existing tabs are open. **Update and reload this tab** explicitly activates it and reloads only the selected tab. There is no automatic reload listener or message to other tabs. The browser may complete its normal waiting-worker activation after all older tabs close; no open conversation is reloaded by that lifecycle.

Reload is disabled while this tab has an unsent draft, attached files, a streaming reply, upload, dictation or open voice session. The guard is checked again after activation. If activity begins while the update is applying, it requires another click after that activity finishes. Save work in other forms before choosing reload; these guards are not a general form autosave feature.

## Operator notes

Serve Polaris from its own origin/root scope. The exact public manifest, worker, notice and icon routes bypass only the cookie-page gate; similarly named private paths remain protected. Do not add authenticated HTML, RSC, API or file responses to a reverse-proxy cache.

`/polaris-sw.js` must remain same-origin JavaScript, have `Service-Worker-Allowed: /`, and use `Cache-Control: no-store`. The notice/icons have explicit public markers. A strict CSP on the notice allows only its inline styles and same-origin icon, with no scripts, forms or embedding. Cache names include the public bundle digest; activation removes only older Polaris public-cache versions. At most two public bundles are prepared: a third waits until activation removes older versions, instead of evicting an active bundle. Failed preparation removes a newly created cache and preserves an already active identical bundle.

After changing the notice or SVG icon source, run `node scripts/build-pwa-assets.mjs` and commit the generated icons and worker integrity records. Production standalone packaging must copy both `public/` and `.next/static/`; the existing Dockerfile does so. No worker or browser broker service is required for this feature.

## Validation and limits

`pnpm test:integration:pwa` creates a disposable loopback PostgreSQL database and relocates the production standalone output with the same public/static copies used by Docker. It verifies anonymous public bytes/headers, manifest links, and protected/current-account route behavior. Worker/update unit tests cover exact-cache boundaries, malformed or oversized assets, failed code-only updates, activation messages, busy-state races and timeout behavior.

The local Chrome fixture verified desktop and 390-pixel layouts, keyboard focus return, an unsent-draft reload guard, exactly five cached public entries, waiting updates, preservation of another controlled tab, and a real offline navigation after stopping only the fixture server. Native Mac installation was not attempted while the OS was locked. Physical iOS/Android installation, Safari behavior and installed-window lifecycle still need device testing. Local standalone packaging was tested; local Docker execution was unavailable.

Contract references checked on 30 October 2026: [Next.js PWA guidance](https://nextjs.org/docs/app/guides/progressive-web-apps), [Next.js manifest convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest), [MDN installation requirements](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [the limited beforeinstallprompt event](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent), and [service-worker lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
