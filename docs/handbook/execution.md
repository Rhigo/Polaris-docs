# Working through the plan unattended

This is an execution contract for future implementation sessions. It makes work resumable from repository state without treating historical chat transcripts as instructions.

## Start a work item

Read current status, the work log, backlog and applicable repository instructions. Inspect `git status`, branch head, open PRs and CI before editing. Reuse an appropriate checkout; preserve unrelated changes. Pick the highest-priority unblocked item whose dependencies are complete. Record the ID and intended acceptance check.

Use a feature branch named for the item, such as `codex/SEC-01-session-revocation`. A PR should deliver one coherent change. Investigate the relevant source and reproduce the failure before refactoring. Larger stages are split into small vertical slices, not one enormous branch.

## Implement and prove

Add tests that exercise the behaviour and meaningful failure paths. Database changes need a fresh migration and upgrade fixture. Authorization changes need two-user negative tests. UI changes need desktop/mobile and keyboard checks. Streaming/voice changes need event replay plus an explicitly labelled live test when credentials and budget are available.

Use local fixtures and mocked provider contracts for routine iteration. Do not make paid calls, send real messages, provision cloud resources or alter production data merely to clear a test. An already-authorized action can proceed within its documented scope; new account consent or an unspecified budget is a specific dependency to record.

Run the affected checks first, then the required repository gates. Do not repeatedly rerun passing suites without a code change or unresolved concern. Capture exact results, environment, source revision and limitations.

## Commit and hand off

Update the relevant guide, backlog status and work log alongside implementation. Commit focused changes with the work-item ID. Push the branch, open/update its PR, and inspect CI for that exact head. Address failures before calling the item complete. Keep main deployable; merging and release follow the repository's agreed policy and CI gates.

A handoff record contains: current commit/PR, work item, files changed, tests and results, screenshots, known limitations, blockers and the next concrete step. Never mark a feature done because scaffolding or a mock exists. Live integration and deployment status are separate from source completion.

## Failure and stopping rules

Preserve logs and state when a check fails. Narrow the failure, fix it, rerun the relevant check, and avoid broad unrelated rewrites. If credentials, account approval, a real device or paid infrastructure are missing, mark only that verification blocked and continue independent work.

Stop before destructive data changes, unknown production actions, or an unapproved increase in resource spending. Record the concrete action needed and why. Never erase existing user work to make a checkout clean.

## Suggested next-run instruction

> Continue Polaris from the canonical handbook and backlog. Verify the current branch and PR state, then implement the next unblocked M1 item in a focused branch. Reproduce its failure, add meaningful regression coverage, update docs and work log, commit and push the changes, and inspect CI. Preserve unrelated changes. Use synthetic data and bounded local tests; record any live-account or paid-resource dependency without inventing a successful result. Leave an exact handoff for the next item.

This document does not start a scheduler or keep a laptop awake. For repeated unattended sessions, configure the actual task runner/automation separately and verify its available credentials, resource limits and wake behaviour.
