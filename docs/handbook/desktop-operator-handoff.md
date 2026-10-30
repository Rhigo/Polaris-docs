# Manual desktop operator handoff

Use this path only with an approved application/runtime release and a separately provisioned desktop. It is not a one-click allocator or a production multi-user desktop service. The [pilot API guide](./persistent-desktop) describes authority, limits and endpoints; [the user guide](./pal-computer) explains its controls.

## Release and deployment are separate

The verified source combines owner desktop API `a755a8b`, runtime `46bfb6b`, keyboard follow-up `bd147be`, reversible theme `a51b3af` and Pal UI `81382f3`; the combined source checkpoint is `c5ea88d`. The final release adds required CI entry points and documentation. Exact-head CI and rollout acceptance must be recorded before enabling a deployment.

The genuine screenshots use a disposable app/database and the already-bound synthetic prototype. It retained its local test sign-in, files and binding after a controlled cold stop. A **new empty, unbound desktop** has a separate VM/disk, runtime UUID, operator key, state and loopback ports. Its installed source, real display, authenticated unbound metadata, empty workspace and absent browser profile passed read-only checks. It is cold-stopped after provisioning; a guarded restart and live enablement remain separate gates. No old profile, synthetic identity, owner binding or operator credential was copied. Do not restore the test prototype as a real user's machine.

## Prepare one slot

1. Preserve the approved source/image digests, existing app backup and operator recovery records. Quiesce web and workers for migrations 0016–0017; rehearse the complete journal on a restored copy and retain prior rows. Schema rollback is not an application downgrade mechanism.
2. Provision a new independently verified Debian 13 guest with the supported 2-vCPU/3072-MiB/20-GiB profile. No host-home mounts, forwarded SSH agent or application/provider/database secrets belong in the guest. Check host pressure before admitting it. The current adapter restricts guest networking to loopback fixtures; broad internet access is not accepted by this guide.
3. Follow the approved checkout's `services/desktop/README.md` to install guest packages and services. Create the root-owned mode0600 operator configuration with a fresh `DESKTOP_OPERATOR_KEY`, `DESKTOP_RUNTIME_ID`, separate `DESKTOP_PUBLIC_URL` and exact `DESKTOP_FRAME_ANCESTORS`. Initialize **only a genuinely new empty runtime**, once. Never use initialization to repair missing state on an existing desktop.
4. Run the host-safe and real-display acceptance on a dedicated synthetic instance before treating the same runtime build as deployable. The destructive recovery fixture must not target a live or retained user desktop. Preserve image/source hashes, restart evidence and cleanup results.
5. Leave the global desktop policy default unset for a one-owner pilot. Materialize that owner's Pal through My Pal, then assign only that owner `manual-2cpu-3g-v1` through the authenticated administrator policy API. There is no resource editor UI or automatic resize. A policy record does not create a VM.

## Match application, proxy and gateway

| Application setting | Operator requirement |
| --- | --- |
| `DESKTOP_RUNTIME_URL` | Private server-to-gateway origin reachable from the actual web process/container; host loopback is not container loopback. |
| `DESKTOP_RUNTIME_KEY` | The new gateway operator key, protected server-side; never a public variable, browser URL or copied log. |
| `DESKTOP_RUNTIME_INSTANCE_ID` | The exact new runtime UUID; distinct from the application's stable logical desktop ID. |
| `DESKTOP_VIEWER_ORIGIN` | One exact separate public viewer origin, also used by the proxy build and gateway public URL. |

Configure all four or leave all absent. A partial set fails closed. Prefer HTTPS and a private encrypted control route; loopback HTTP is a local-preview exception. An HTTPS app requires an HTTPS viewer. For example, `https://polaris.example.test` can embed `https://desktop.example.test`; do not use a wildcard or the app's own origin.

Rebuild/recreate the intended Nginx image after changing `DESKTOP_VIEWER_ORIGIN`, and recreate the web process with the matching configuration. Inspect real delivered headers: `X-Polaris-Desktop-Viewer-Origin` must identify the same allowed origin, not `disabled`. The gateway must allow only the intended app ancestor. The panel blocks a present mismatch; an absent marker in a direct Next preview is not evidence that the deployed proxy allows it. Do not loosen artifact CSP or global frame/media permissions to make a viewer appear.

## Enable and verify

Use the intended owner's cookie-authenticated application session to connect. Verify the exact resource profile/runtime identity and that another owner cannot claim the slot. Never reset/rebind an existing runtime. A retained uncertain binding requires positive owned-state reconciliation, not a timeout-based deletion.

Check observe mode, explicit control/takeover, F8 focus release, viewer renewal and exact-viewer close through the actual proxy. Confirm an older tab's cleanup cannot close a newer controller. Account disablement prevents new tickets/renewals, but an open channel can remain valid for up to its remaining 60-second lease; the absolute connection limit is 30 minutes. Keep tickets transient and omit keys, fragments, SDP, personal content and private URLs from evidence.

Close all test viewers and confirm control is available. Enable only the reviewed owner and keep the fixed manual capabilities visible. This does not authorize autonomous desktop jobs, real external sign-ins or unrestricted networking.

## Appearance and rollback

The optional preset is in `services/desktop/theme`. It reuses Polaris SVG assets, existing colors and Inter; no image generation is involved. Standard Xfce preferences remain usable. Hosts can change wallpaper, fonts and panels normally; no user settings are locked.

Before applying or rolling it back, disconnect viewers, close unsaved applications and stop only `polaris-desktop-session`. Run the approved `configure.py apply` or `configure.py rollback` as the guest's `pal` user, then restart that service. The preset backs up exact bytes/modes for eleven fixed appearance files and refuses symlinks, repeat application or corrupt backups. Retain the active backup. Rollback replaces later appearance edits with the saved originals and leaves installed Debian packages/backups intact; profile, binding and workspace are outside its paths. Installing the SVG loader made the stock Xfce wallpaper visible after rollback, so before/rollback screenshots need not have identical wallpaper pixels.

## Stop, preserve and recover

Closing a viewer leaves the guest running. A cold VM stop ends programs and releases RAM, retaining disk/profile/state; it is not suspend-to-disk. Do not boot two writable copies. Keep the web desktop path disabled during a database or disk restore and reconcile logical owner/Pal identity, runtime reservation and stale control authority before re-enabling.

The gateway's retained intent and local witness help fail closed after a crash; they are not an independent whole-VM rollback witness. Full coordinated snapshot restore, automated retirement/destruction, pooled admission, separate data quotas and chat attachment transfers are still open gates. [Recovery](./recovery) covers the application backup boundary.
