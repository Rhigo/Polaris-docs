# Using Polaris

## Start a conversation

Sign in with an account supplied by your administrator. Choose an available model in the composer, enter a message and send it. Model availability depends on provider configuration and your assigned access. The tools menu exposes configured capabilities; a visible control alone does not guarantee the selected provider/model supports it.

Use projects to group related work and keep project instructions and files together. The sidebar contains projects and conversations; on a narrow screen, open it with the navigation button. Existing conversation controls include renaming, pinning, archiving and deletion.

## Work with files and artifacts

Attach supported files from the composer. Polaris extracts content or passes files to the selected provider where supported. Generated outputs can appear as downloadable files or previews. Check the downloaded artifact as well as its preview, particularly for spreadsheets, PDFs and executable HTML.

The current implementation has provider-specific paths. File behaviour on OpenAI, Anthropic and Ollama is not interchangeable. Administrators should test the exact configured models and tool combination before offering it to users.

## Voice

Dictation converts speech into text, read-aloud speaks a response, and realtime voice opens a live conversation. These use different API paths and may have different models and costs. Microphone access requires browser permission and a secure context.

Realtime is currently experimental: context continuity, tool-policy consistency, reconnect handling and metering are scheduled for M3. Do not infer from the presence of the voice panel that every text-chat attachment or instruction is automatically included.

## Settings and administration

Users can manage personal preferences and available customisation. Administrators configure providers, models, groups and feature access. Provider API credentials belong in the application's protected configuration, never in conversation text or documentation examples.

See [current capabilities](./status) for what is implemented and [the feature list](./backlog) for search, branching, mobile/PWA, connected accounts and other planned improvements.

## Make Polaris your own

Open **My Pal** in the sidebar and choose **Customize Pal**. Shape, colour, eyes, accessory and motion preferences are saved to your account. The computer panel explains its disconnected state; browser, terminal and file control require the later isolated-computer integration.

On smaller screens, open the navigation drawer from the header. Escape dismisses the current dialog and returns focus to its opener; nested Settings retains the drawer underneath. Settings uses horizontal tabs on mobile. Theme controls and operating-system reduced-motion preferences apply across the shared interface.

## Developer access

Open your account menu → **Developer access** to create, rotate or revoke a scoped API key. Save its secret when shown; it cannot be displayed again. Follow the [API guide](./api) for supported endpoints, limits and examples.
