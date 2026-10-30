# Your Pal's computer

**In development.** This page describes the next persistent-desktop milestone. The existing [browser workspace](./computer-workspace) and [public research pilot](./public-browser-research) have narrower, separately tested behavior. They are not yet the always-available desktop described here.

## One Pal, one private conversation, one computer

Each Polaris user will have one Pal identity, one continuous conversation with that Pal, and one persistent logical computer. Reconnecting will open the same computer. Opening two tabs must not create two Pals or provision two desktops.

The Pal conversation will feel like a message thread: messages stay together, a small reaction picker offers a few emojis, and Pal can react to the current user message through a bounded server tool. Ordinary chats remain separate. The Pal avatar opens its settings; a side panel opens its computer. On a phone, those panels use the full screen.

## Connect, watch and take over

The planned desktop uses Debian 13 Trixie with Xfce, Chromium, a terminal and a file manager. A small dock makes those applications easy to open. Browser profiles and workspace files belong to the desktop, rather than to the browser tab used to watch it.

**Connect** opens the live view. **Take over** pauses Pal's control and gives the user the keyboard and pointer. **Resume Pal** explicitly hands control back after Pal has observed the current state. These permissions must be enforced by the server; disabling buttons in the viewer is not sufficient.

Closing the viewer must not cancel an authorized background task. The hosting machine still needs to remain powered, connected and able to run the desktop. Websites can expire their sign-ins independently. Retaining a browser profile does not guarantee permanent access to an account.

## The same files in chat, terminal and file manager

A chat attachment should be copied into that user's workspace through an authenticated transfer. Pal and the user can then work with the same file in the visible desktop. An exported result receives an owned Polaris download reference before it is returned in the Pal thread.

The first demonstration will use a synthetic PDF and a Word document: watch the conversion, find the output in the file manager, and download it from chat. This is an acceptance target, not a claim that arbitrary PDF layout conversion already works. Transfers must reject other users' files, traversal, expired references and oversized content.

## Shared hardware, separate user environments

An installation can pool its hardware while keeping separate desktops. A single shared Linux login is not the intended isolation boundary.

| Deployment model | Intended boundary |
| --- | --- |
| One VM per Pal on a shared host | Reference option for stronger separation between users; CPU, memory and storage still come from a shared pool |
| One container per Pal on a dedicated execution host | Possible trusted-user tier, with its limitations documented and tested separately |
| Several ordinary Linux user sessions | Cooperative multi-user desktop behavior; not a sufficient hostile-code isolation guarantee |

Administrators will set limits and choose which sizes users can request. **4 vCPU, 10 GiB RAM and 32 GiB workspace storage** are a proposed starting profile, not a minimum or a validated capacity recommendation. The operating system, snapshots, logs and temporary transfers need additional capacity. A vCPU limit is not a promise of a dedicated physical CPU, and reserving resources is different from allowing oversubscription.

The development prototype may use a smaller profile. Hosting capacity must be measured before admitting multiple desktops; it must not silently consume all of the host's memory or disk.

## Privacy and recovery gates

Other users must not receive the desktop's session, files, cookies or control credentials. Pal's own working environment is a different trust boundary: code allowed to use a folder can read that folder. A shared terminal home can also retain history or modified startup scripts. Private sign-in and genuinely private human input need a separately verified flow; a client-side “view only” switch does not provide that guarantee.

Disconnect, restart and restore are distinct operations. A restored snapshot must not revive stale control credentials or replay an uncertain external action. Stopping a desktop must preserve its identity and durable files; destruction must be explicit. An idle policy must distinguish a disconnected viewer from a running background job.

The [backlog](./backlog) tracks the continuous thread (`PAL-11`–`PAL-12`), persistent desktop (`DESK-01`–`DESK-07`) and existing terminal/file work (`LOC-03`–`LOC-04`). The first milestone is a documented manual playground with synthetic data. Autonomous work, multi-user isolation and private sign-in remain separate acceptance gates.
