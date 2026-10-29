# Publishing the wiki index

`Home.md` and `_Sidebar.md` are prepared wiki content; this directory is not itself a published GitHub wiki. On 29 October 2026 the repository reported `has_wiki:false` and `has_pages:false`. The connected GitHub source/PR tools do not expose these settings, and the available browser was signed out.

An authenticated repository administrator can enable Wiki in repository settings, create its first page, and copy the two prepared files into the wiki repository/UI. Preserve any subsequently created custom pages. The index links to canonical handbook pages instead of duplicating their instructions.

For the public documentation site, configure GitHub Pages to use Actions and set repository variable `PAGES_ENABLED=true`; inspect the deployment result before advertising a live URL. The source boundary and workflow are described in `docs/handbook/operations.md`.

Never copy environment files, private review notes, chat logs, credentials or production exports into either publication surface.
