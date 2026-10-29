# Product screenshots

## Interface refresh · 29 October 2026

These are actual production-build captures with synthetic accounts, following the Pal and shared-interface changes. Desktop/tablet/mobile Chrome checks cover 1440, 768 and 390 pixels, both themes, keyboard focus, dialog dismissal, saved Pal preferences and composer limits. They do not prove physical-device microphone or Safari compatibility.

![Pal home and companion customisation](/screenshots/pal-desktop.jpg)

![Polaris chat with the shared design](/screenshots/chat-refresh-desktop.jpg)

<img class="mobile-shot" src="/screenshots/chat-refresh-mobile.jpg" alt="Refreshed chat composer and navigation at 390 pixels">

<img class="mobile-shot" src="/screenshots/settings-mobile.jpg" alt="Settings with horizontal mobile navigation and readable profile fields">

<img class="mobile-shot" src="/screenshots/admin-mobile.jpg" alt="Administration overview on a narrow mobile viewport">

![Project workspace and shared surface styling](/screenshots/projects-refresh-desktop.jpg)

![Pal home in dark mode](/screenshots/pal-dark-desktop.jpg)

## Scheduled reminder inbox · 29 October 2026

These captures show a production build with synthetic reminder accounts. The real worker delivered the inbox entries at their scheduled times; no provider API or external notification channel was used. Desktop dark mode and a 390-pixel mobile light viewport were checked, including unread state, acknowledgement and reload. [Reminder behavior and limits](./reminders.md).

![Scheduled reminders and unread inbox in desktop dark mode](/screenshots/reminders-desktop-inbox.jpg)

<img class="mobile-shot" src="/screenshots/reminders-mobile-inbox.jpg" alt="Reminder inbox with unread and read entries at 390 pixels">

## Preserved baseline captures

Captured 29 October 2026 from a local production build of source `f50ff4f`. These show the existing product, before the planned redesign. Accounts and conversations are synthetic; the assistant text was seeded for presentation and is not evidence of a live model call.

Desktop viewport: **1440 × 1000**. Mobile viewport: **390 × 844**, Chromium emulation. Mobile screenshots do not establish iOS Safari or microphone compatibility. Browser content was allowed to settle before capture; no image editing was applied.

## Conversation workspace

![Desktop conversation, project sidebar and composer](/screenshots/chat-desktop.png)

## Mobile conversation

<img class="mobile-shot" src="/screenshots/chat-mobile.png" alt="Polaris conversation and composer at a 390 pixel mobile viewport">

## Projects

![Polaris projects screen](/screenshots/projects-desktop.png)

## Administration

![Polaris administration screen with synthetic test data](/screenshots/admin-desktop.png)

## Sign-in

![Polaris sign-in screen](/screenshots/login-desktop.png)

For future captures, use deterministic demo fixtures, hide credentials and personal content, record the exact commit, and refresh these images when the corresponding user journey changes. Screenshots of a configured feature should not imply successful provider execution unless a live verification is recorded separately.

## Developer access

Actual production test build with synthetic metadata. The captured test keys were revoked after verification; no secret is shown.

![Developer access on desktop](/screenshots/api-keys-desktop.jpg)

![Developer access at 390px](/screenshots/api-keys-mobile.jpg)

## Temporary chat

Captured from production source 536e282, whose runtime matches the merged privacy release 04bd033. These synthetic-provider journeys verify two-turn continuity, the retention notice, a 390px viewport, reset/reload forgetting and a normal saved-chat control. They do not establish a live provider call or physical-device compatibility.

![Temporary chat retains context within its tab](/screenshots/temporary-two-turns-desktop.jpg)

<img class="mobile-shot" src="/screenshots/temporary-two-turns-mobile.jpg" alt="Temporary chat and privacy notice at 390px">
