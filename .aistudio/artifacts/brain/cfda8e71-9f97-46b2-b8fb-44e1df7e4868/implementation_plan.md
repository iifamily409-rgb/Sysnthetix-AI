# Implementation Plan - Custom AI Providers, Direct Model IDs, API Key Management & Profile Customization

Implement multi-provider AI support (Google Gemini, OpenRouter, OpenAI, Anthropic, Groq, and Custom Base URL), direct Model ID configuration, browser-stored visible API keys with reveal/hide controls, and customizable user profile name persistence.

## Proposed Changes

### 1. Types & Data Structures (`src/types.ts`)
- Add `ProviderConfig` interface:
  - `providerId`: `'gemini' | 'openrouter' | 'openai' | 'anthropic' | 'groq' | 'custom'`
  - `providerName`: string
  - `baseUrl`: string
  - `apiKey`: string
  - `selectedModelId`: string
  - `customModelId`: string
- Extend `UserSettings`:
  - `userName`: string (defaults to "Elena Vance", customizable to any name)
  - `activeProvider`: `'gemini' | 'openrouter' | 'openai' | 'anthropic' | 'groq' | 'custom'`
  - `providers`: Record of configs for each provider with their specific API key, custom base URL, and active/custom model ID.

### 2. Backend Multi-Provider Streaming Proxy (`server.ts`)
- Update `/api/chat` to accept:
  - `provider`: Provider ID
  - `customBaseUrl`: Optional custom URL (e.g. for OpenRouter, Groq, Ollama, vLLM)
  - `userApiKey`: Optional user-configured API key sent securely via request body
  - `model`: Target Model ID
- Execution logic:
  - **Gemini**: If user provides a Gemini key, initialize `@google/genai` with their key (or fallback to environment key).
  - **OpenAI-Compatible Providers (OpenRouter, OpenAI, Groq, Custom)**: Make streaming fetch requests to `${baseUrl}/chat/completions` using SSE chunks (`choices[0].delta.content`) and stream back to the client.
  - **Anthropic**: Make streaming requests to Anthropic `/v1/messages` format using `anthropic-version: 2023-06-01` or OpenRouter.
  - **Fallback**: Maintain the high-fidelity demo engine if no credentials are configured.

### 3. Settings Interface (`src/components/SettingsView.tsx`)
- Add a new dedicated **"AI Providers & API Keys"** tab:
  - **Provider Selector**: Switch between 5 presets (Google Gemini, OpenRouter, OpenAI, Anthropic, Groq) and **Custom Provider**.
  - **Custom Base URL input**: Visible for Custom Provider (and editable for OpenRouter / self-hosted endpoints).
  - **Direct Model ID Input**: Dropdown of popular models + direct text input to specify any exact Model ID (e.g. `google/gemini-2.5-flash`, `deepseek/deepseek-r1:free`, `gpt-4o-mini`, `claude-3-5-sonnet-latest`, `llama-3.3-70b-versatile`).
  - **API Key Field**:
    - Masked/Unmasked password toggle with Eye icon so the user can easily see, copy, or update their key at any time.
    - Status badge (e.g. "Configured" vs "Not Set").
  - **User Profile Customization**:
    - Input to update the user's display name.
    - Instantly reflected in the welcome hero greeting ("Hello, [Name]!") and the sidebar/header profile cards.

### 4. Integration with App Workspace & Header (`src/App.tsx`, `src/components/Header.tsx`, `src/components/Sidebar.tsx`, `src/components/ChatWorkspace.tsx`)
- Connect the active provider and custom model to the chat workspace header.
- Dynamic hero greeting using `settings.userName`.
- Profile card in sidebar displaying the user's customized name.
- Real-time streaming from the chosen provider with token chunks, thinking traces, and code blocks.

## Verification Plan

### Automated Checks
- Run `compile_applet` and `lint_applet` to confirm zero TypeScript and syntax errors.
- Test `/api/chat` with custom provider payload and custom model ID.

### Manual / Browser Verification
1. Open **Settings > AI Providers & API Keys**.
2. Change user name from "Elena Vance" to a custom name, verify it updates in the sidebar and hero greeting.
3. Switch provider between Gemini, OpenRouter, Groq, OpenAI, and Custom.
4. Enter an API key and toggle the show/hide eye icon to verify visibility.
5. Enter a custom direct Model ID (e.g. `deepseek/deepseek-r1`).
6. Send a message in chat and verify the streaming response uses the configured provider and model.
7. Refresh the page to confirm that all provider configurations, keys, and user names persist in `localStorage`.
