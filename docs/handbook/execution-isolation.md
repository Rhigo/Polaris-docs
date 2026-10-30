# Per-execution isolation

**Acceptance is in progress.** Additional recovery and platform isolation checks are underway. Keep `SANDBOX_SERVICE_URL` and `SANDBOX_SECRET` unset for unattended use until the reopened SEC-04 criteria pass. The local demo currently disables these application Python/shell calls; provider-native code tools have their own settings. Prior Linux test results below describe the checks performed, not completion of the new review.

SEC-04 replaces shared subprocess execution with a narrow broker that creates a
new Linux container for each Python or shell call. It is a code-execution slice of
the Pal runtime. Persistent browser sessions, interactive terminal takeover,
personal-computer pairing and network-enabled execution need separate policies and
are not provided by this backend.

## Decision and trust boundary

Run the broker on a **dedicated Linux execution VM/host**. Keep the web application,
database, uploaded files, configuration encryption key and provider credentials
outside that VM. The application sends a bounded source string and trusted user
identity to the broker over a private encrypted connection. Only the broker and
its independent janitor may access the execution VM's Docker socket. Never mount
that socket into the web application or a workload.

```mermaid
flowchart LR
  W[Trusted web: fresh authorization and ToolContext] -->|private encrypted RPC| B
  subgraph E[Dedicated Linux execution VM]
    B[Trusted broker: UID 10001] --> D[Docker daemon]
    J[Independent expiry janitor] --> D
    D --> A[Run A: private namespaces and tmpfs]
    D --> C[Run B: private namespaces and tmpfs]
  end
  A -->|frozen bounded archive| B
  B -->|after confirmed destruction| W
```

The broker is trusted infrastructure: Docker socket permission is administrative
authority over its host. The generated program is not trusted. It runs as UID/GID
65532 with empty supplementary groups, zero inheritable/permitted/effective/
bounding/ambient capabilities and no-new-privileges. It shares neither the broker
UID nor its PID namespace, secrets or writable files. Each run has private PID,
IPC, cgroup and network namespaces and its own writable tmpfs. No application or
other-run directory is mounted into it.

A small, secret-free, root-owned supervisor stays inside the workload container.
Its launcher drops authority before executing submitted source. The supervisor's
root-only control directory holds the completion record, while the code can write
only its isolated working areas. The image contains Python's standard library and
a POSIX shell; uploaded files and optional plotting packages are not provisioned.

Source arrives as raw UTF-8 bytes in a bounded tar upload into the running
container's private RAM-backed control volume. Three fixed regular-file entries
carry the source, server-generated language/timeout/length/hash metadata, and a
final empty completion marker. The supervisor waits for that marker, validates
sizes and integrity, removes source/request metadata, then launches the child with
a clean environment. The empty marker remains until teardown so Docker can finish
applying its file metadata. Docker environment/configuration and image layers contain no
source. Trusted execution-host administrators can still inspect live VM memory or
storage; host swap/snapshots remain an operator retention concern. Never log source
or put unrelated credentials in it. The child cannot read the supervisor's
environment or root-only control directory.

This is a **container boundary within a VM**, not a VM per call. Ordinary `runc`
containers share the VM kernel. A container or kernel escape can compromise the
execution VM, including its broker, so the VM must carry no application data or
provider credentials. Docker's security documentation describes daemon authority
and the limitations of namespace/capability isolation. A cloud tenant release still
needs a separately reviewed stronger runtime/VM policy; selecting `runsc` alone is
not evidence that its complete policy has been validated. [Docker security](https://docs.docker.com/engine/security/)

## Enforced request and runtime policy

`POST /execute` requires the broker secret before its body is read. JSON is limited
to 768,000 bytes and source to 100,000 UTF-8 bytes. The required `principal_id` comes
from the web's `ToolContext`, never model arguments. The broker trusts the web to
authorize that identity. It hashes the principal for resource labels and generates
the execution UUID itself. No caller-visible resource handle can be reused to join
another call. Extra JSON properties are rejected.

The broker builds the complete runtime specification. Request data cannot select
images, commands for the supervisor, environment variables, daemon flags, mounts,
devices, networking, resource budgets or host paths. Only an operator-configured,
preloaded immutable image digest/ID is accepted; the broker never pulls images.
Images declaring implicit volumes are rejected. The image build currently resolves its
Python base tag when built: record and approve the resulting immutable image ID,
and review rebuilds before replacing it.
The broker also requires the workload image's `native-offline-v2` policy marker
and amd64/arm64 architecture, so pairing it with the old unfiltered workload image
fails readiness. The marker prevents a release mismatch; approval of image contents
remains the trusted operator's responsibility.

| Resource | Enforced policy |
| --- | --- |
| Admission | Two active/pending/orphan runs per broker by default; one per principal. Excess calls receive 429 without queuing. Operator can set at most eight total. |
| Compute | One CPU, 512 MiB memory, no additional swap, 64 PIDs per run. |
| Runtime | Caller timeout 1–45 seconds; independent absolute expiry 90 seconds after creation. |
| Filesystem | Read-only image; no host binds/devices. Fresh private local volumes backed by tmpfs: workspace 64 MiB/1,024 inodes and root-only control 1 MiB/32 inodes. Native temporary tmpfs 8 MiB/256 inodes. |
| Process limits | CPU time, 512 MiB address space per process, 1 MiB single-file writes, 64 descriptors, zero core size. PID cgroups avoid cross-run `RLIMIT_NPROC` coupling through equal host UIDs. |
| Network | Docker `none`, no published ports, plus an inherited native-ABI filter denying socket/socketpair and all io_uring calls. No policy to enable egress exists in the request. |
| Output | 64 KiB stdout, 8 KiB stderr; overflow terminates execution and withholds artifacts. |
| Artifacts | At most ten top-level regular files, 1 MiB each and 4 MiB total; 8 MiB archive/read budget, 1,000 entries, bounded names/PAX metadata. |

Startup and readiness require Linux, cgroup v2, working memory/swap/PID/CPU
accounting, default built-in seccomp and the configured runtime. The service does
not silently remove unsupported limits. Docker resource settings and its default
seccomp profile remain part of the deployment contract.
[Resource controls](https://docs.docker.com/engine/containers/resource_constraints/),
[default seccomp](https://docs.docker.com/engine/security/seccomp/)

The image-resident launcher installs an additional raw BPF seccomp filter after
dropping to UID 65532 and immediately before executing source. Only native Linux
amd64 or arm64 is supported. The filter denies every socket family, socket pairs
and io_uring entry point with `EPERM`; a different syscall ABI, including amd64
int0x80/i386 and x32, terminates the calling process. This avoids depending on
libseccomp's legacy socketcall expansion. Docker documents that native socket
argument filters alone do not cover that multiplexed path; Moby explains the
compatibility-rule behavior. [Docker seccomp](https://docs.docker.com/engine/security/seccomp/),
[Moby profile change](https://github.com/moby/profiles/releases/tag/seccomp%2Fv0.2.2)

Socket-based IPC is deliberately unavailable, including Unix-domain socket pairs
used by some Python libraries. Pipes, files and ordinary fork/exec still work.
The trusted supervisor closes inherited descriptors and provides only null input
and output pipes; the policy assumes no socket is inherited. The child cannot
weaken an installed filter. This does not replace the dedicated VM or claim that
all kernel attack surfaces have been removed.

## Completion, cancellation and artifacts

Real Docker testing exposed two archive API restrictions with native tmpfs:
uploads were rejected with a read-only root filesystem, and contents were absent
from the archive read endpoint. The broker instead creates two fresh UUID-named
Docker local volumes with fixed `type=tmpfs`,
`device=tmpfs` and bounded mount options. They are attached only to that run, with
`NoCopy=true`. Exact labels, driver and options are validated before execution.
Validation repeats after container creation, before start: a paused broker cannot
resume after orphan expiry and accept Docker's automatic default-volume recreation.
There are no caller-provided volume names/options, host paths or broker mounts.
Uploads into the running control volume and paused artifact reads were verified
on the dedicated Linux VM while preserving the read-only root filesystem.
[Docker copy limitations](https://docs.docker.com/reference/cli/docker/container/cp/)

The broker pauses the **whole container** and verifies that state before reading
the workspace. A descendant that called `setsid` is still inside that container's
PID/cgroup boundary. The tar stream is read directly through bounded readers;
nothing is extracted to the broker filesystem. Traversal, duplicate paths, links,
sparse entries, devices, FIFOs and unexpected nested file exports fail closed.
An invalid artifact discards the entire file batch. Successful regular files carry
SHA-256 integrity values and are persisted by the web under the authenticated
user's ownership.

Normal completion, timeout, cancellation, HTTP disconnect, startup failure and
export failure all go through whole-container removal followed by both private
volume removals. The broker confirms all three are gone before returning output
files. If the daemon is unavailable or destruction cannot
be confirmed, the caller receives an error with no artifacts. An uncertain create
is reconciled by broker/run labels rather than assuming no container was created.
Before any Docker create, the broker fsyncs a private allocation intent. A fully
acknowledged allocation becomes `known`; uncertain creation becomes `quarantined`.
An interrupted `allocating` record is also a barrier on restart. Neither immediate
404 responses, expiry, physical resource cleanup nor restarting the broker clears
that barrier: the daemon may still complete an earlier request. Failed destruction
also quarantines admission and readiness. No output is returned before physical
cleanup and the final state transition have both succeeded.

The independent janitor runs every five seconds. It only removes resources with
the expected managed marker, broker identity, valid run/owner labels and expired
lifetime. It clamps an expiry label to creation time plus 90 seconds, so a label
cannot extend the lifetime indefinitely. Startup also reconciles expired resources.
Admission and reconciliation count volume-only runs too, including a crash between
the first volume creation and container creation. Cleanup always removes containers
before storage and refuses unexpected names, labels, drivers or mount options.
If the daemon itself is unreachable, neither process can promise immediate
destruction: restoration of daemon access or operator intervention is required.
The VM boundary and per-container limits remain the containment mechanism during
that uncertainty.

There is no shared-process fallback. Application Compose contains neither a broker
service nor the former shared sandbox network. Both web clients require an explicit
external broker URL and matching secret; absent or invalid settings fail before
network access. Redirects are rejected so the broker secret cannot be forwarded.
The trusted `ToolContext` carries the caller's abort signal, composed with each
execution deadline. A cancelled, malformed or unconfirmed outcome stops the current
chat tool loop instead of allowing model-directed execution retry. Closing the HTTP
connection is a cancellation request, not proof that a remote workload stopped:
the broker's cleanup confirmation and janitor remain authoritative. Completed
side effects are not rolled back. Durable run records, restart recovery of tool
outcomes and exactly-once side effects remain separate RUN work.

## Deployment contract

Use `deploy/execution/compose.yml` only on the dedicated execution VM. Do not merge
it into application Compose. Maintain **one broker container and one Uvicorn worker
per Docker daemon**; do not scale replicas or workers. A private persistent state
volume is mounted only into the broker, never the janitor or a workload. Its
exclusive process lock also prevents a second broker or recovery process using
the same state concurrently. Giving another broker a different state volume or
broker identity is outside this deployment contract. The independent janitor may
continue after the broker stops, but cannot clear retained allocation uncertainty.

1. Provision a disposable/rebuildable Linux VM with Docker Engine API v1.45 support,
   cgroup v2 and the required resource/seccomp controls. Keep the host patched.
2. Build `services/sandbox/Dockerfile.workload`, inspect its immutable image ID,
   review the source/image and preload that image on the execution VM. Build the
   broker separately from `services/sandbox/Dockerfile`.
3. Copy `deploy/execution/.env.example` to a private mode-0600 operator file. Set
   the socket's group ID, stable unique broker ID, approved immutable workload image,
   private bind IP and a new random broker secret. Do not copy the application `.env`
   or mount configuration/uploads. Only the broker receives the broker secret.
4. Restrict the broker port to the trusted web host through an encrypted private
   tunnel/VPN, or terminate authenticated TLS before it. The supplied Compose file
   binds a private interface but does **not** implement transport encryption. Never
   expose its plain HTTP listener publicly or assume an ordinary LAN encrypts it.
5. Start the execution Compose stack and verify `/ready` through the approved
   private route. Set the web's `SANDBOX_SERVICE_URL` to the broker base URL (without
   `/execute`) and `SANDBOX_SECRET` to the matching broker-only secret, then restart
   only the web service. Both are blank by default; leaving either unset disables
   execution while ordinary chat/readiness continues to work. Preserve existing
   application environment files and data. Never give the web a daemon socket,
   Docker credentials or the execution VM's administrative credentials.
   A host-run web process can use a loopback SSH tunnel. Inside a web container,
   `127.0.0.1` refers to that container, so provide a private encrypted endpoint
   reachable from its network namespace; do not expose the broker publicly to
   work around connectivity. URLs with credentials, query strings or fragments
   are rejected; use the explicit secret setting.
6. Run the disposable acceptance suite on the exact chosen runtime/kernel/image
   before enabling execution. Alert on repeated 503s, failed janitor operations,
   unexpected resource inventory and exhausted capacity.

### Quarantine and operator recovery

The broker's mode-0700 `/state` directory holds bounded mode-0600 metadata: run
UUIDs, phases, resource labels and hashed principals. It contains no submitted
source, credentials or output. Preserve the named state volume and stable broker
identity across upgrades. A missing initialized ledger, malformed records,
unexpected permissions or another holder of its lock fail closed. Do not use
`docker compose down -v`, delete ledger files or change the broker ID to bypass a
quarantine. Fully acknowledged old runs can be removed on startup without replay;
unknown allocations require an operator.

When upgrading from the earlier broker that held quarantine only in memory, keep
application execution disabled, stop the old controllers and quiesce/restart the
dedicated daemon or VM before initializing a fresh ledger. A new empty ledger
cannot retroactively prove that an old create request has stopped. Rebuild and
review both images; the new broker deliberately rejects the old workload image.

1. Disable new application execution requests and stop the execution broker and
   janitor. Keep their private operator configuration and state volume.
2. Restart/quiesce the **dedicated execution Docker daemon or VM** so no earlier
   create request can still commit. This is a manual infrastructure action; the
   recovery tool neither performs it nor proves an operator's attestation. A
   container restart or an empty Docker inventory is insufficient.
3. With the same reviewed broker image, Compose project and private environment,
   inspect retained IDs using `docker compose run --rm --no-deps broker python
   recovery.py status`. This requires the stopped broker's exclusive state lock.
4. Clear only inspected IDs with `docker compose run --rm --no-deps broker python
   recovery.py clear --run-id <UUID> --confirm-dedicated-daemon-restarted`. The tool
   validates exact resource labels/options, removes containers before volumes and
   verifies absence before clearing each record. A failed check retains state.
   Repeat `--run-id` only for other retained IDs; unknown IDs are rejected.
5. Start the reviewed broker and janitor, verify readiness and a disposable
   synthetic execution, then explicitly re-enable the application endpoint.

Run these commands from `deploy/execution` with the operator's existing private
environment selection. Never clear a live user's records or restart an unrelated
daemon. Corrupt/missing state needs operator investigation or restoration from a
trusted snapshot; this tool has no force-reset or destructive migration mode.

A future local Mac adapter should provision a dedicated Linux VM and send only
this RPC across the private boundary. It must not execute source in macOS, mount
the user's home directory or fall back to a host shell when the VM is unavailable.
No VM installer or purchasing flow is included in this change.

## Acceptance evidence and release boundary

| Check | Evidence |
| --- | --- |
| Authentication/body bounds, fixed policy, immutable images, no fallback | Host-safe API/policy tests; no submitted source runs on the test host. |
| Duplicate/traversal/sparse/PAX/link archives, byte/file/entry limits | Synthetic archive regressions; no extraction. |
| Maximum UTF-8 source, partial uploads, marker/integrity checks, no source in container metadata | Host-safe bootstrap regressions plus real Linux metadata/control probes. |
| Cancellation during volume/container create, start/upload/export; uncertain create/removal | Mocked lifecycle regressions verify resource removal, quarantine and withheld artifacts. |
| Durable intent, restart quarantine, exclusive lock, recovery and state corruption | Host-safe real-file/process tests plus a Linux fresh-process/late-volume fixture. Operator daemon restart is an explicit manual prerequisite, not simulated as proven by CI. |
| Native socket/socketpair/io_uring and alternate ABI paths | Linux probes require `EPERM`; amd64 additionally proves compat getpid works without the extra filter, then requires `SIGSYS` for int0x80/socketcall and x32 inside the filtered child. ARM64 does not claim i386 execution evidence. |
| Fresh UID/caps/groups, other-run file/PID absence, no secret/socket/network | Real Linux HTTP probes in `test_linux_container.py`. |
| Artifact hash/ownership boundary, fresh workspaces, shell support | Real Linux file round-trip; web client tests prove trusted principal selection and reject unconfirmed cleanup. Database ownership stays covered by existing file authorization tests. |
| Kernel memory/PID/file/inode limits and output bounds | Real Linux resource probes inside disposable workloads. |
| Timeout/disconnect with a `setsid` descendant | Real Linux lifecycle test requires the complete labeled container to disappear. |
| Broker crash | Real independent janitor test covers a volume-only orphan and all three resources of a running execution, waiting for the 90-second expiry without a live broker. |

The application CI job verifies that ordinary startup needs no broker settings and
that application Compose exposes no shared execution service/network or Docker
socket. The separate sandbox CI job runs the host-safe suite and the real Linux
harness below, including independent janitor expiry. It has no application database,
provider credentials or stable execution deployment.

Run host-safe checks with `python -m unittest discover -s services/sandbox/tests -v`.
Run real checks only on an explicitly disposable Linux Docker runner:

```sh
POLARIS_DISPOSABLE_EXECUTION_CI=1 bash services/sandbox/tests/run-isolated-linux.sh
```

The harness builds both images, uses only synthetic inputs and a generated broker
secret, and cleans only its own UUID-named/labeled fixtures. It does not touch
production databases, uploaded files or API credentials. Local mocked tests passing
on macOS do not certify Linux isolation; attach the successful Linux job before
calling the backend verified. Passing `runc` checks also does not certify a `runsc`
deployment, a microVM boundary, browser egress or unattended cloud tenancy.
