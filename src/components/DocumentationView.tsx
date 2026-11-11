import React from 'react';
import {
  BookOpen,
  Keyboard,
  Cpu,
  Terminal,
  Globe,
  Sparkles,
  Zap,
  Shield,
  Code2,
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const shortcuts = [
    { key: '⌘K / Ctrl+K', desc: 'Create new conversation thread' },
    { key: 'Enter', desc: 'Send message / execute active prompt' },
    { key: 'Shift + Enter', desc: 'Create a newline without sending' },
    { key: 'Esc', desc: 'Dismiss active modal or popover' },
    { key: '/', desc: 'Quick slash command trigger' },
    { key: '@', desc: 'Mention telemetry dataset or file context' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          Developer Documentation
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Documentation &amp; User Manual</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Complete reference for Synthetix AI v2.4, keyboard navigation, streaming parameters, and code execution environments.
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-on-surface">Keyboard Shortcuts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/20"
            >
              <span className="text-xs text-on-surface font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 rounded bg-surface-container font-mono text-xs text-primary font-semibold shadow-2xs border border-outline-variant/30">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">Deep Reasoning Engine</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            When enabled, Synthetix AI constructs dynamic cognitive evaluation steps before formulating prose. This guarantees mathematically sound derivations, edge case detection, and structured tabular summaries.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">Code Execution Verified</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Snippets generated with Seaborn, TypeScript, or Python are pre-checked against strict syntax boundaries with full typing guarantees and zero-cost abstraction patterns.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">Live Web Grounding</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Augment model weights with live real-time web retrieval. Cites trustworthy technical documents, API change logs, and market statistics directly into the conversation stream.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm text-on-surface">Secure Server-Side Architecture</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            All AI interactions are mediated through private server endpoints using the official `@google/genai` TypeScript SDK. Your API keys are never exposed to the client bundle.
          </p>
        </div>
      </div>

      {/* Code Snippet Example */}
      <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-secondary" />
          <h2 className="text-base font-semibold text-on-surface">API Payload Reference</h2>
        </div>
        <p className="text-xs text-on-surface-variant">
          Synthetix AI exposes an SSE chat completion endpoint at <code className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-primary">/api/chat</code>:
        </p>

        <pre className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs overflow-x-auto leading-relaxed">
{`POST /api/chat HTTP/1.1
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Analyze weekly cohort retention data." }
  ],
  "model": "gemini-3.8-flash",
  "deepReasoning": true,
  "webSearch": true,
  "temperature": 0.7
}`}
        </pre>
      </div>
    </div>
  );
};
