# Persistent desktop pilot

This first application slice records one logical desktop for each user's existing Pal, applies an administrator-selected resource policy and binds it to one operator-provisioned runtime. It provides owner-scoped viewer authority for a manual desktop. It does not allocate a pool of machines, resize a VM, run autonomous desktop tasks or make the existing ephemeral browser workspace persistent.

Application ownership, migration and transport behavior passed disposable PostgreSQL and local protocol fixtures. A separate final app/iframe journey also used the real Debian/Xfce prototype: observation beside chat, native RFB keyboard input, F8 focus release, takeover, stale-viewer cleanup and responsive continuity. Its Pal reply was synthetic. The proxy policy has its own actual-header/browser fixtures; the direct Next preview does not replace acceptance through the intended deployment. No real account sign-in, live provider request or third-party action is established here. See the [operator handoff](./desktop-operator-handoff).

## Identity and resource policy

Migration `0017_pal_desktops` follows the immutable `0016` Pal identity migration. Unique owner and Pal keys, plus a composite ownership foreign key, enforce one logical desktop per user and Pal. Opening or reconnecting a viewer never creates another desktop. The first explicit desktop request requires an existing Pal and creates only its application record.

Administrators define immutable named resource policies, a default and optional per-owner overrides. Users cannot submit CPU, memory, disk, image, runtime or owner overrides. A changed default affects future selection; it does not silently resize an existing desktop. An explicit owner override may change an unbound desktop's selection. Once a runtime reservation exists, its identity and policy cannot be reassigned through these APIs.

The initial adapter supports only `manual-2cpu-3g-v1`: 2 vCPUs, 3,072 MiB memory and a 20 GiB guest OS disk. `dataQuotaBytes` is `null`: there is no separately enforced workspace/profile storage quota. The runtime's file-transfer limit is not a disk quota. Saving a larger policy does not allocate those resources; connection fails unless a supported runtime matches exactly.

There is one configured runtime slot for this first adapter. A durable unique runtime reservation prevents two users from receiving that same instance. Multi-user pooled admission, administrator resource editing in the UI, resizing and automatic provisioning remain subsequent work. CPU and memory settings are runtime limits, not promised dedicated physical hardware or measured service guarantees.

For a one-owner pilot, leave the global default unset and assign the supported policy only to the intended owner. A global default makes all eligible owners candidates for the one available slot; it does not create additional runtimes.

## Operator configuration

The web process requires all four settings, or all must be absent:

| Setting | Meaning |
| --- | --- |
| `DESKTOP_RUNTIME_URL` | Private server-to-runtime control origin; never returned to the browser. |
| `DESKTOP_RUNTIME_KEY` | Operator credential, 32–128 base64url characters; server only. |
| `DESKTOP_RUNTIME_INSTANCE_ID` | UUID of the exact provisioned runtime, distinct from the logical desktop ID. |
| `DESKTOP_VIEWER_ORIGIN` | Canonical separate browser origin used for the viewer. |

Origins must contain only a scheme, hostname and optional port. Credentials, paths, queries, fragments and wildcard hosts are rejected. HTTPS is required except for explicit loopback development origins (`localhost`, `*.localhost`, `127.0.0.1` and `[::1]`, after URL normalization). `AUTH_URL` takes precedence over `NEXTAUTH_URL`: an HTTPS application requires an HTTPS viewer, and the configured viewer must have a different origin from the application. Different loopback ports are distinct origins.

For example, an HTTPS application at `https://polaris.example.test` can use a viewer at `https://desktop.example.test`. The deployment must separately allow only this exact viewer origin in the application's `frame-src`, and the runtime must allow only the application origin in its `frame-ancestors`. Do not place the viewer behind the application's own origin or add a wildcard. Artifact frame policies remain separate. API validation cannot inspect the reverse proxy's compiled policy; deployment acceptance must verify the actual headers and browser embedding.

Compose forwards the four settings only to the web process; the private runtime URL/key have no `NEXT_PUBLIC` alias or browser exposure. `DESKTOP_VIEWER_ORIGIN` is also a proxy build input. Changing it requires rebuilding/recreating the proxy as well as configuring/recreating the app. The delivered `X-Polaris-Desktop-Viewer-Origin` marker must match the API's configured origin; `disabled` means the deployment has not enabled viewer embedding. A direct Next.js development fixture can lack this proxy marker. Keep private credentials out of copied Compose output and logs.

Partial configuration reports an operator configuration error. Metadata with a different runtime ID, policy or resource profile reports `runtime_mismatch`; it never falls back to another machine. A previously bound runtime is not reset or rebound for a new owner.

## Owner and administrator APIs

These are session-cookie APIs, not Developer API bearer scopes. Mutations require the configured application origin and strict JSON bodies of at most 8 KiB. Existing API keys do not gain desktop access.

| Method and path | Purpose |
| --- | --- |
| `GET /api/pal/desktop` | Read the owner's record and bounded runtime state. |
| `POST /api/pal/desktop` with `{}` | Materialize the owner's logical record without allocating a VM. |
| `POST /api/pal/desktop/connect` with `{}` | Reserve and bind the configured runtime, or reconcile its existing binding. |
| `POST /api/pal/desktop/viewer-ticket` | Request `{generation, mode: "observe" \| "control", takeover}`. Takeover is an explicit control action. |
| `POST /api/pal/desktop/viewer-lease` | Renew `{generation, viewerId}` after a fresh active-account check. |
| `POST /api/pal/desktop/release-viewer` | Close only `{generation, viewerId}`; stale cleanup cannot close a newer viewer. |
| `POST /api/pal/desktop/release-control` | Explicitly release the current writer using `{generation}`. Never use as automatic iframe cleanup. |
| `GET /api/admin/desktop-policies` | List up to 64 policies and the default. |
| `POST /api/admin/desktop-policies` | Create `{id, displayName, resources}`; exact replay is idempotent. |
| `DELETE /api/admin/desktop-policies/:id` | Remove an unused policy. Referenced policies are retained. |
| `PUT /api/admin/desktop-policy-default` | Select `{policyId}` or `null` for future selection. |
| `GET /api/admin/users/:id/desktop-policy` | Inspect an owner's override, selection and reservation state. |
| `PUT /api/admin/users/:id/desktop-policy` | Set `{policyId}` or remove the override with `null`. |

The initial policy's `resources` object is `{"vcpus":2,"memoryMiB":3072,"rootDiskGiB":20,"dataQuotaBytes":null}`. Administrator rights and active-account state are re-read after the relevant database locks. Owner and Pal identity always come from the authenticated database relationship, never from a viewer request.

## Viewer and failure boundaries

Tickets are one-use, expire after 20 seconds and contain no operator credential. Keep the ticket URL transient; do not persist it, log it or automatically retry a failed ticket request. Observation and control are distinct modes. Takeover uses the current runtime generation and drains the prior writer before new input is accepted.

A viewer lease lasts at most **60 seconds from ticket issue or the last trusted renewal**, with a **30-minute absolute connection cap**. Renew about every 20 seconds through the authenticated app. Disablement prevents later ticket/renewal requests; an already-open channel can remain usable for its remaining lease. Fresh HTTP checks do not provide immediate remote-session revocation. Explicit release/takeover drains the affected channel. Closing one UI must call the viewer-ID-scoped release operation, not global release-control.

The app durably records a binding intent before sending it. Lost responses, disconnects and uncertain outcomes retain the runtime reservation. A subsequent positive, exact owned state response can confirm it; an empty response, 404, timeout or elapsed period cannot free or replay it. Requests have bounded bodies, 20-second runtime transport deadlines, 32 KiB response limits and no application mutation retries. Database decisions use 5-second lock and 10-second statement limits. Runtime exception bodies and credentials never become public error text.

If the runtime is already bound but its application reservation is absent, the app requires a positive state response for the caller's exact logical desktop before recording a reservation. A foreign owner's failed Connect cannot claim that slot or create a retained binding row.

Account deletion with a retained runtime reservation returns 409 with disable/retirement guidance. Disabling is supported. This slice has no automatic retirement, reassignment or destructive cleanup endpoint: deleting application ownership while a persistent desktop still exists would lose the safety record.

## Persistence and recovery limits

The operator owns the guest's disks, Chromium profile, backups and uptime. A retained browser profile does not make cookies permanent, and a sleeping or stopped host does not run tasks continuously. This manual runtime exposes no agent authority or shared terminal API. Its same-guest user account is not a confidentiality boundary between browser sign-ins and code the owner runs in that guest.

Before restoring an application database, disable the desktop connection path and quiesce existing viewers and controllers. Reconcile restored application ownership with the retained runtime identity before re-enabling it; never boot two writable copies of one desktop. A database generation restored from backup is not an independent rollback witness. Automated snapshots, full DB/disk recovery coordination, resource-pool accounting, private human-versus-agent contexts and bounded chat attachment transfers remain separate acceptance gates.

## Reproducible fixture checks

After a production build, use a disposable loopback PostgreSQL service with database-creation permission:

```sh
POLARIS_DESKTOP_DB=1 POLARIS_DESKTOP_HTTP=1 pnpm test:integration:desktop
```

The suites create unique databases, verify upgrade preservation and ownership constraints, exercise real authenticated standalone routes against a fake runtime, then remove only their own databases, processes and temporary files. They cover competing claims, lock-wait revocation, lost bind replies, mismatch rejection, API-key exclusion, chunked body limits, stale viewer cleanup and the real admin deletion response. They do not provision or contact an accepted desktop VM, access provider credentials or prove production iframe deployment.

The dedicated desktop CI job checks durable runtime state, the RFB parser and loopback fake-display authority, reversible theme changes and viewer keyboard focus. Its fake display is not Xvnc. The Compose job separately renders synthetic configurations to check disabled defaults, `AUTH_URL` precedence, `NEXTAUTH_URL` fallback and server-only control credentials. Separate native evidence against runtime `46bfb6b` plus keyboard/theme `bd147be`/`a51b3af` covers actual Xvnc authority, restart persistence and reversible branding. Pal source `81382f3` completes the app-to-viewer journey with synthetic identities/providers. These results do not certify a different image, new deployment, physical phone or full snapshot recovery.
