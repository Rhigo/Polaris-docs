# Isolated browser workspace

The Pal Browser workspace provides a temporary Chromium page that its owner can watch and control. Pal's text tasks are not connected to it. Terminal and general file editing remain disconnected; the Files tab can save completed browser downloads and retrieve previously saved exports.

## Use

An operator first connects the separate computer broker. Enter up to ten HTTPS origins, start a browser, then choose **Use browser**. Navigate with the address field, click the page image and use the text-insertion field for typing. The text field is masked locally by default. The page viewer also supports navigation keys and scroll controls. **Fit** shows the full page; **100%** lets a narrow screen pan the original-size image. Page clicks, keys and text insertion require a loaded frame less than five seconds old that matches the active tab revision. A paused stream disables that input. Use **Close tab** to remove a tab; the last tab stays open until the workspace is closed. Its pixel stream does not expose the remote page's accessibility tree, clipboard, native file picker, camera, microphone, WebSockets or browser extension UI.

Another Polaris tab may watch the same owned workspace. **Take over here** explicitly revokes the previous tab's input lease. Commands already dispatched can have external effects; an uncertain result is never replayed automatically. Refresh state before deciding what to do next.

The client and computer VM must have synchronized clocks. Frame age is checked against the client's wall clock; clock skew can disable input rather than accept a stale observation.

Save downloads to Polaris before closing. Saved files use the existing owner-checked file endpoint, expire after seven days and remain listed after the browser closes. The list returns twenty entries per page. Closing removes the temporary browser profile and unsaved downloads; cleanup uncertainty keeps the runtime slot reserved instead of reporting success.

## Boundary

Use a dedicated Linux VM or execution host. The browser service is separate from the existing code-execution service and its accepted images. Neither workload receives the app filesystem, database URL, provider keys, broker key, Docker socket, host home, agent forwarding or host browser profile.

Each workspace has its own browser container, proxy container, private profile/download tmpfs volumes and bridge network. Chromium runs as UID 1000 with its namespace and Seccomp-BPF sandbox required at startup. Its outer container has no capabilities, no-new-privileges, a read-only root and a reviewed seccomp profile. The profile adds clone/setns/unshare/chroot support for Chromium's nested sandbox; it does not grant SYS_ADMIN or change host-wide kernel settings. Linux conformance inspects real renderer namespaces, chroot, capabilities and seccomp rather than relying solely on launch flags.

The outer socket policy permits only UNIX, IPv4, IPv6 and netlink families; socket pairs are restricted to UNIX. It explicitly denies the legacy `socketcall` multiplexor with ENOSYS, distinct from the profile's default EPERM. Removing its allow rule alone is insufficient because libseccomp can synthesize compatibility rules. Non-IP families such as VSOCK and ALG cannot bypass the IP firewall. The Linux fixture checks native forbidden-family calls; on x86-64 kernels with i386 support it also executes a fixed 32-bit `socketcall` probe. ARM64 evidence is not evidence of an x86 compatibility test.

The proxy briefly installs firewall rules inside its own network namespace, then runs as UID 2000 with effective, permitted, inheritable, ambient and bounding capabilities cleared. Browser UID 1000 can connect only to the loopback proxy. Direct network traffic, private/reserved addresses, metadata, direct DNS and IPv6 are blocked outside Chromium. The proxy accepts bounded CONNECT requests only for granted HTTPS port-443 origins, resolves against the configured public DNS path, rejects mixed private/public results and dials the selected numeric address. HTTP redirects and page resources are separately checked by the browser driver. Existing tunnels are closed when the lease is revoked or expires.

This is not comprehensive data-loss prevention. Allowed sites receive the data a user enters, and an allowed shared hosting/CDN address is not a cryptographic TLS-origin boundary against a compromised browser process. There is no TLS interception or claim of protection from a compromised Linux kernel, Docker daemon or operator. Operators must list every public app/control-plane hostname or alias in `COMPUTER_DENIED_ORIGINS`; the web route also rejects its own application hostname. Private control-plane addresses are independently blocked by the network policy.

## Control and limits

Every web request refreshes the authenticated principal. The broker trusts that principal only over its private keyed channel; a client cannot select an owner. Views, frames, commands, results, exports and stop all enforce ownership. Mutations require the app's same origin. A new broker boot rejects old controller credentials and removes abandoned, acknowledged workloads. An uncertain allocation blocks new work until operator recovery.

Create/acquire/takeover are control-plane operations with owner binding and fresh request/generation/epoch preconditions. Input additionally requires the current opaque holder token, monotonic command sequence and current tab revision. A repeated command ID returns its retained result; conflicting IDs and old leases are rejected. Only one command or export can run at a time. Takeover waits for revocation and quiescence; a lost driver or unconfirmed transition closes the workspace. Lease grants never extend the absolute lifetime.

| Bound | Pilot value |
| --- | --- |
| Broker replicas | One |
| Concurrent sessions | One locally; two explicitly configured in CI |
| Absolute lifetime / human inactivity | 20 minutes / 5 minutes |
| Input lease / quiescence / action | 15 seconds / 5 seconds / 10 seconds |
| Browser | 1 CPU, 1.5 GiB memory, no extra swap, 256 PIDs |
| Browser profile / downloads / tmp / shm | 256 / 64 / 64 / 128 MiB |
| Proxy | 0.25 CPU, 192 MiB, 32 PIDs |
| Page tabs / granted origins | 3 / 10 |
| JPEG frame | 512 KiB, viewer polls at most twice per second |
| Completed downloads / export attempts | 10 / 10 per session |
| File / cumulative exports | 10 MiB / 50 MiB |
| Retained input commands | 512 per workspace, across all takeovers |

Lease expiry is enforced by the proxy even if the web connection disappears. The broker sweeps once per second; an independent janitor removes expired labeled resources every ten seconds after a broker crash. Human inactivity excludes automatic renewals. Browser/profile cleanup may therefore complete after the nominal expiry by the relevant cleanup interval.

The in-memory broker retains at most 1,024 start-request tombstones per process. At that limit it returns an explicit operator-restart-required error, rather than forgetting an old request and silently creating a replacement. Schedule a controlled broker restart after closing active workspaces. This first slice is a single-process pilot, not a durable, horizontally scaled workspace registry.

Allocation certainty is durable even though live workspace/control state is not. Before the first Docker mutation, the broker fsyncs a private allocation intent. The named control-state volume is mounted only in the broker and janitor; it stores workspace UUID, expiry and certainty, never browsing data or credentials. A timeout, lost/malformed create response or interrupted allocation retains a quarantine across restart. A late resource can appear after an initial 404; neither that 404 nor subsequent janitor cleanup clears the quarantine. New admission is blocked and the running broker's health endpoint returns 503. The independent janitor continues removing exact labeled late resources without declaring the daemon's pending request finished.

## Operator setup

Build from a reviewed checkout using a pinned official Node image digest. Build the browser, proxy and broker images, record their immutable `sha256:` image IDs and run `deploy/computer/compose.yml` with `pull_policy: never`. Keep the broker listener on guest loopback and use an authenticated private tunnel or private service network from the web app. Do not expose Docker or the driver channels. Set a new private 64-character hex `COMPUTER_BROKER_KEY`, matching `COMPUTER_BROKER_URL` in the app, `COMPUTER_MAX_SESSIONS=1` for the local pilot and the operator denied-origin list. Keep secrets outside Git with mode 0600. `COMPUTER_TEST_TRACE` is only for synthetic diagnostic runs and must remain unset in deployment.

On a Mac, use a separate Linux VM with mounts and forwarding disabled. The approved local pilot VM has 4 CPUs, 6 GiB RAM and a 20 GiB sparse disk. A cloud adapter can use the same HTTP broker contract on a dedicated Linux execution host; it still needs a private control plane, independently verified kernel/container policy and operational cleanup. Do not point the service at the Mac Docker socket or share the existing execution image pair.

### Recover an uncertain allocation

Do not delete the `polaris-computer-control-state` volume, clear a marker manually, or repeatedly restart only the broker to regain capacity. Keep that volume across upgrades and ordinary Compose shutdowns. A new deployment must begin on an empty dedicated runtime; do not attach this control plane to another controller's daemon.

1. Stop the broker and janitor, leaving their persistent state intact. Stop or close any other workspaces on this dedicated computer host.
2. Restart the dedicated Docker daemon or VM and confirm the broker and janitor remain stopped. This is the operator's quiescence boundary: the old daemon can no longer commit a delayed request. Docker supplies no cancellation acknowledgement for the lost create response.
3. For each exact retained workspace UUID, run the reviewed broker image's offline recovery command. It refuses running broker/janitor controllers, checks labels, removes the recorded resources, verifies their absence and only then removes that UUID's marker. `--daemon-restarted` is an operator attestation; the command cannot independently prove step 2.
4. Start the broker and janitor again and confirm readiness before allowing new sessions.

With the three reviewed immutable image IDs already in the operator environment, run this inside the dedicated Linux VM after steps 1–2:

```sh
docker run --rm --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges:true --memory 128m --pids-limit 32 \
  --label dev.polaris.computer.role=recovery \
  --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
  --mount type=volume,source=polaris-computer-control-state,target=/state \
  -e COMPUTER_BROWSER_IMAGE -e COMPUTER_PROXY_IMAGE \
  "$COMPUTER_BROKER_IMAGE" node src/recover.ts --daemon-restarted WORKSPACE_UUID
```

There is no web endpoint for clearing quarantine. If state is missing, corrupt or unavailable, investigate and restore it before re-enabling admission; do not infer safety from an empty first resource listing.

## Verification

Run host-safe service tests and web policy tests:

```sh
pnpm --filter @polaris/computer test
pnpm --filter @polaris/computer typecheck
cd apps/web
node --import=tsx --test lib/pal/workspaces/*.test.ts
```

The Linux suite requires an empty, disposable Docker host with cgroup v2 and prebuilt immutable browser/proxy/broker/fixture image IDs. `services/computer/tests/run-linux.py` refuses an occupied computer deployment or a retained conformance state volume, bounds the controller lifetime and cleans only its recorded UUID-labeled resources. It checks the real sandbox, native/compatible-ABI socket policy, kernel egress negatives against a confirmed-live private service, synthetic TLS/cookie separation, exact download bytes, oversize rejection, takeover/deduplication, driver loss and independent expiry cleanup. A controlled delayed real volume mutation verifies that a fresh process stays blocked and the janitor preserves quarantine; the fixture joins that known test mutation before its own cleanup. This does not claim to prove operator daemon restart. Any genuinely uncertain test cleanup retains its state volume for recovery.

`Dockerfile.fixture` is test-only. Its non-forwarding DNS/TLS server uses a temporary extra isolated network and a generated test CA seeded solely into each disposable profile; Chromium certificate verification and production firewall/launch flags remain enabled. The fixture image and its private test certificate must never be deployed as the production broker or browser image.

## Next terminal, files and agent work

A terminal must run inside a separate bounded workload using the same owner, generation, lease and lifetime contract. Use a fixed non-root PTY broker with bounded output/backpressure; revoke and drain input before takeover, and destroy its complete container on uncertain cancellation. Do not expose a host shell or reuse a browser profile as a general execution volume.

General file operations need a private per-workspace tree, descriptor-relative no-follow path handling, bounded listings/imports/exports, atomic writes and link/device rejection. Export only validated regular bytes into owner-scoped app storage; never return container or host paths to clients.

Agent control requires a separately reviewed orchestration integration, scoped tools, current observation/action fences, human takeover precedence and confirmations for consequential external actions. The OpenAI computer-use contract supplies actions and screenshots; this application remains responsible for the environment, permissions and execution. No current text task acquires this browser lease.

## Primary references

Reviewed 29 October 2026: [Playwright Docker guidance](https://playwright.dev/docs/docker), [browser launch sandbox option](https://playwright.dev/docs/api/class-browsertype), [Chromium Linux sandbox](https://chromium.googlesource.com/chromium/src/+/main/sandbox/linux/README.md), [Chromium certificate management](https://chromium.googlesource.com/chromium/src/+/main/docs/linux/cert_management.md), [Docker bridge networks](https://docs.docker.com/engine/network/drivers/bridge/) and [OpenAI computer-use integration](https://developers.openai.com/api/docs/guides/tools-computer-use-integration).

Socket compatibility review: [Docker's seccomp notes](https://docs.docker.com/engine/security/seccomp/), [Moby profiles v0.2.2 compatibility correction](https://github.com/moby/profiles/releases/tag/seccomp%2Fv0.2.2), and its [explicit ENOSYS rule](https://raw.githubusercontent.com/moby/profiles/refs/tags/seccomp/v0.2.2/seccomp/default.json). Moby subsequently reverted the broad legacy restriction for compatibility; this Chromium-only deployment does not support legacy 32-bit browser clients.
