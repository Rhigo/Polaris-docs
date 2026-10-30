# Your Pal's computer

The first manual desktop slice is implemented and tested against a separate synthetic Debian 13 prototype. It opens a real Xfce desktop beside the [continuous Pal conversation](./continuous-pal). Installation, operator configuration and the release deployed on your server still determine availability. This does not enable autonomous desktop work.

## Open, watch and control

1. Open **My Pal → Desktop**. If no runtime or matching policy is configured, the panel explains what is missing; it does not pretend a computer is connected.
2. An administrator must assign the supported resource policy. **Connect desktop** then binds the one configured runtime to the existing Pal and logical desktop. Reconnecting does not allocate another machine.
3. Choose **Observe desktop** for a read-only view, or **Control desktop** for keyboard/pointer access. If someone already controls it, **Take over control** asks for confirmation and replaces that controller.
4. Use the desktop's Chromium, Terminal or Files dock. These are real guest applications, not app-side simulations. Resources remain available in the **Desktop resources** disclosure.
5. Choose **Close viewer** when finished. It closes only your viewer; desktop files and profile remain. Stopping the VM is a separate operator action and ends running processes.

On a wide screen, the panel is docked so you can type to Pal while watching. On narrow screens it is modal, with Tab containment, Escape and return focus. Changing width preserves the mounted viewer. In the desktop, **Focus desktop** directs keys to the guest; **F8** releases held keys and returns focus to that toolbar. Tab can then reach Disconnect and leave the iframe for the parent close control.

The desktop and 390px browser layouts were exercised. Physical iOS/Android remote typing, virtual-keyboard controls and touch gestures were not. There is no **Resume Pal** control because this runtime has no agent role.

## What persists

The application retains one logical desktop per owner/Pal. The operator VM has its own runtime identity and boot generation. Binding, active-account checks, one-use viewer tickets and exclusive writer leases are enforced on the server; noVNC's visual mode is not authorization.

Synthetic files and a local test sign-in survived viewer disconnect, gateway recovery and a cold VM restart. A cold stop frees RAM and ends programs; it retains disk data rather than suspending processes. Websites can expire cookies independently. Real OAuth/provider sign-in and a private human-versus-agent context have not been validated.

## Shared files: current boundary

Terminal and Files see the same guest `/workspace`. A synthetic PDF→DOCX→PDF conversion and text checks passed inside the manual prototype, and the real windows appear in the [gallery](./screenshots). That proves a bounded local conversion, not arbitrary document fidelity or a completed chat attachment round trip.

Authenticated transfer from a Pal chat attachment into that workspace, followed by an owned result returned to the thread, remains DESK-05. Do not assume dragging a file into chat makes it available in the desktop. General editor/PTY APIs also remain separate from typing in the real Xfce applications.

## Resources and hosting

The first adapter is one operator-provisioned slot: **2 vCPUs, 3072 MiB RAM, 20 GiB sparse OS disk**. Workspace/profile storage shares that disk; there is no separately enforced data quota. A file-transfer limit is not a disk quota. An administrator's policy record does not resize or provision a machine.

The proposed larger profiles and a pool of per-user VMs are future work. Reservations, actual limits, disk usage, snapshots and host memory pressure need separate accounting before multiple desktops are admitted. Ordinary Linux users sharing one guest are not the intended hostile-code isolation boundary.

## Polaris appearance

The reversible preset uses the existing curved star, charcoal surfaces, teal accents, Inter typography and a Chromium/Terminal/Files dock. Standard Xfce menus, window controls, panels and preferences remain usable. Real before/after captures and exact eleven-file rollback/reapply checks passed; the [operator handoff](./desktop-operator-handoff#appearance-and-rollback) explains customization and its limits. The preset changes no runtime/network permissions and generates no new artwork.

## Privacy, recovery and deployment

This manual pilot permits only loopback/local fixture networking. It has no host-home mounts, SSH-agent forwarding or host-shell fallback. The same guest account can read its own browser profile; do not treat that as protection from code it runs.

Full snapshot recovery is not accepted: a restored disk/database must not revive stale authority or uncertain actions. Keep the desktop path disabled during restore and reconcile the retained ownership record before re-enabling. Never reset a bound runtime to assign it to another owner. [Runtime/API operations](./persistent-desktop) and the [operator handoff](./desktop-operator-handoff) cover exact-origin policy, leases and rollout.

The preserved synthetic prototype and the fresh empty/unbound deployment are different machines. At this documentation checkpoint, the former was cold-stopped with its profile/state intact; the latter was being prepared but had not completed acceptance or been connected to the live app. Screenshots do not establish that rollout.

## Remaining desktop acceptance

| Backlog item | Completed part | Still required |
| --- | --- | --- |
| DESK-01 | Unique owner/Pal/logical desktop and retained runtime reservation | Broader provisioning/lifecycle and explicit retirement/destroy acceptance |
| DESK-02 | Real isolated Debian/Xfce, manual viewer, native apps and retained files | Full authorized background-job lifecycle within the intended deployment |
| DESK-03 | Synthetic profile persistence, observe/input fencing and takeover | Verified private human-versus-agent contexts, return-control/fresh observation and real sign-in limits |
| DESK-04 | Immutable named resource policies, owner overrides and single-slot reservation | Host pool admission/accounting, resizing and storage/snapshot/staging budgets |
| DESK-05 | Manual synthetic conversion inside the prototype only | Owned chat attachment→desktop→Pal result round trip and all transfer failure cases |
| DESK-06 | Gateway crash recovery and cold restart evidence | Coordinated snapshot restore, independent rollback witness/quarantine and stale-authority reconciliation |
| DESK-07 | No autonomous desktop role | Bounded durable browser/terminal/file jobs, budgets, takeover, cancellation and restart gates |
| DESK-08 | Reversible Polaris preset, real launchers, customization, rollback and before/after evidence | Scoped acceptance complete; it does not close any runtime/isolation item above |
