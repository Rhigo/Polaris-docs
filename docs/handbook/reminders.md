# One-off reminders

Pal can save a reminder for a specific date and time, then deliver it to your personal inbox. Reminders do not use a model, send contact messages or request browser notification permission. They are separate from [saved text tasks](./pal-tasks).

## Set a reminder

1. Open **Pal → Reminders** and enter what you want to remember.
2. Choose the date, time and named time zone. The form starts with your browser’s zone. Review the displayed time before saving.
3. If a daylight-saving change repeats that local time, explicitly choose the first or second occurrence and its UTC offset. A skipped local time is rejected.
4. Select **Save reminder**. The saved entry appears under **Upcoming** and survives reloads.

The application saves a fixed UTC instant together with the submitted local time and zone. Travelling or changing your device’s zone does not move an existing reminder. To choose another time, cancel it and create a new reminder. Time-zone rules come from the browser/server runtime; an inconsistent instant/zone submission is rejected instead of silently shifted.

**Your local Pal worker must be running.** When the reminder becomes due, the worker changes its saved state to **Delivered**. The **Inbox** shows the message, due time, arrival time and unread state. An open Pal view refreshes every five seconds and can show an in-app notice; a closed browser receives the durable inbox entry when it returns. This does not promise an operating-system alert, email, SMS or delivery while the execution host is asleep. Overdue reminders arrive when a worker becomes available.

Use **Mark read** to acknowledge an inbox item. Use **Cancel reminder** to stop a pending reminder. Cancellation and delivery are serialized: if delivery wins, the application says it already arrived rather than claiming cancellation. **History** contains cancelled reminders and those stopped by an observed account change.

Delivered, cancelled and revoked entries have a **Remove reminder** control with confirmation. Removal deletes their message and read state; it has no in-app undo. Pending entries must be cancelled before removal. There is no automatic deletion or retention job. Pagination keeps older saved entries accessible.

## Limits and data

| Limit | Current value |
| --- | --- |
| Reminder text | 500 characters; request body at most 8,000 bytes |
| Scheduling horizon | A future minute within 365 days, checked against the database clock |
| Upcoming reminders | 50 per account; 1,000 across the installation |
| Saved reminder records | 1,000 per account; remove terminal entries to release space |
| Worker batch | At most 20 entries for one owner per transaction |
| Inbox/history page | 20 records |

Messages, dates, zones and read state live in the application database and belong to the creating account. They are included in database backups. Account deletion cascades to reminder records. A disabled account cannot create, read or change reminders; the worker rechecks activation under a user-row lock before committing delivery. Pending entries observed while the account is disabled become **Stopped · account changed** and do not resume automatically if it is re-enabled. A disable/re-enable that happens entirely between worker observations does not itself create a permanent cancellation record.

Creation uses an owner-scoped request UUID. Retrying an unchanged request retrieves the same retained reminder, including after delivery or cancellation; conflicting reuse returns an error. This protection lasts while the record is retained. Explicit removal deletes that request identifier too, so a later use can create a new reminder if its due time is still valid.

## Run and operate the worker

Apply the approved release’s migrations through `0010_pal_one_off_reminders` before starting the worker. Keep `0008` and `0009` in order. Use the [release checkpoint and recovery procedure](./recovery); do not edit old migrations or automatically drop reminder tables on downgrade.

From the repository root, the existing command runs independent text-task and reminder loops:

```sh
pnpm pal:worker
```

To run only reminder delivery:

```sh
pnpm --filter web pal:worker --reminders-only
```

Add `--once` for one delivery/reconciliation batch. The reminders-only mode needs `DATABASE_URL`; it does not need a model, provider key or configuration-encryption key. The default text-task loop still requires the normal provider configuration. The source CLI reads `apps/web/.env.local` when present, with existing environment variables taking precedence. The web server and web-only standalone image do not start or package the worker. Keep configuration private and use an explicit process supervisor for unattended operation.

The delivery loop checks roughly once per second while idle and backs off on database failure. It is independent of a long-running text task. Graceful shutdown finishes its current database operation and drains both services before closing their connection pool. A forced process/database-connection failure can terminate the worker; a supervisor may restart it. The database transaction decides whether delivery committed.

Delivery does not perform an external action: a reminder row atomically becomes its inbox entry. Concurrent workers lock eligible rows with `SKIP LOCKED`; a rollback leaves them pending, while a committed delivery is never selected again. There is no separate notification insertion to duplicate after a lost acknowledgement. Account locking precedes reminder-row locking so deletion/revocation has a consistent order. Cancellation, marking read and removal use the same ownership and row-lock rules. Millisecond timestamp precision keeps cursor pagination exact through JavaScript dates.

Before rolling back the application, stop the new worker. Keep the additive `0010` table and history; an older release cannot service this inbox. Do not run an older initializer against a newer migration journal.

## Verification and scope

Unit tests cover request validation, daylight-saving gaps/folds, fractional offsets, bounded bodies, safe errors and independent worker loops. The opt-in suites use uniquely named databases on a loopback test cluster:

```sh
POLARIS_REMINDER_INTEGRATION=1 POLARIS_REMINDER_HTTP_INTEGRATION=1 \
pnpm test:integration:reminders
```

The database suite tests ownership, account-lock races, concurrent delivery/cancellation/read/removal, admission limits, pagination, connection-loss rollback and the actual reminders-only CLI. The HTTP suite relocates the production standalone server outside the checkout, uses synthetic accounts, runs the real worker and confirms no token-usage records. It has no provider credentials. Each harness removes only its own databases, processes and files; ordinary tests skip integration initialization without the opt-in flags.

This is an initial slice of RUN-02, RUN-06 and PAL-04. Natural-language scheduling, recurring responsibilities, external event triggers, proactive research, evidence-ranked findings, urgency, quiet hours, snooze and delivery channels remain separate work. The reminder text is displayed as supplied; mentioning a time in that text does not schedule it.
