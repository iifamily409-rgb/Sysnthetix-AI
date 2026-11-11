import React, { useState, useEffect } from 'react';
import { UserSettings, AIModel, ProviderId, ProviderConfig } from '../types';
import {
  Sun,
  Moon,
  Sliders,
  Database,
  Shield,
  Trash2,
  Download,
  RotateCcw,
  Check,
  Server,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Key,
  Globe,
  Bot,
  User,
  Sparkles,
  Cpu,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  models: AIModel[];
  onClearHistory: () => void;
  onResetSampleData: () => void;
  onExportAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  models,
  onClearHistory,
  onResetSampleData,
  onExportAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'providers' | 'models' | 'data' | 'system'>('providers');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    provider: string;
    loading: boolean;
    success?: boolean;
    message?: string;
  } | null>(null);

  const [apiStatus, setApiStatus] = useState<{
    status: string;
    hasApiKey: boolean;
    version: string;
    serverTime: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => {
        setApiStatus({
          status: 'offline',
          hasApiKey: false,
          version: '2.4.0',
          serverTime: new Date().toISOString(),
        });
      });
  }, []);

  const activeProviderId = settings.activeProvider || 'gemini';
  const currentProvider = settings.providers[activeProviderId] || settings.providers.gemini;

  const handleUpdateProvider = (id: ProviderId, partial: Partial<ProviderConfig>) => {
    const updatedProviders = {
      ...settings.providers,
      [id]: {
        ...settings.providers[id],
        ...partial,
      },
    };
    onUpdateSettings({ providers: updatedProviders });
  };

  const toggleShowKey = (providerId: string) => {
    setShowKeyMap((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

  const handleCopyKey = (keyText: string, providerId: string) => {
    if (!keyText) return;
    navigator.clipboard.writeText(keyText);
    setCopiedKey(providerId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = async (providerId: ProviderId) => {
    const config = settings.providers[providerId];
    setTestResult({ provider: providerId, loading: true });

    try {
      const resp = await fetch('/api/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
          model: config.customModelId.trim() || config.selectedModelId,
        }),
      });
      const data = await resp.json();
      setTestResult({
        provider: providerId,
        loading: false,
        success: data.success,
        message: data.message || data.error || 'Connection check completed.',
      });
    } catch (err: unknown) {
      setTestResult({
        provider: providerId,
        loading: false,
        success: false,
        message: `Network error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  const providerList: ProviderId[] = ['gemini', 'openrouter', 'openai', 'anthropic', 'groq', 'custom'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Settings &amp; Providers</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Manage custom AI model providers, API keys, Base URLs, display name, and system preferences.
          </p>
        </div>

        {/* Current User Pill Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs">
          <User className="w-3.5 h-3.5 text-primary" />
          <span className="text-on-surface-variant">Active User:</span>
          <span className="font-semibold text-on-surface">{settings.userName || 'Elena Vance'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'providers'
              ? 'bg-surface-container-high text-primary border-b-2 border-primary shadow-2xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Key className="w-4 h-4 text-primary" />
          AI Providers &amp; Keys
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-surface-container-high text-primary border-b-2 border-primary shadow-2xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          Profile &amp; Appearance
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'models'
              ? 'bg-surface-container-high text-primary border-b-2 border-primary shadow-2xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Sliders className="w-4 h-4 text-secondary" />
          Parameters &amp; System
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'data'
              ? 'bg-surface-container-high text-primary border-b-2 border-primary shadow-2xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Database className="w-4 h-4 text-tertiary" />
          Data &amp; Backup
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'system'
              ? 'bg-surface-container-high text-primary border-b-2 border-primary shadow-2xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Server className="w-4 h-4 text-emerald-500" />
          Diagnostics
        </button>
      </div>

      {/* 1. AI PROVIDERS & API KEYS TAB */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          {/* Provider Selection Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-on-surface">Select Active Provider</h2>
                <p className="text-xs text-on-surface-variant">
                  Choose from 5 industry-standard providers or plug in your own custom OpenAI-compatible Base URL (Ollama, vLLM, LMStudio).
                </p>
              </div>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                Active: {currentProvider.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
              {providerList.map((pid) => {
                const p = settings.providers[pid];
                const isSelected = settings.activeProvider === pid;
                const hasKey = Boolean(p.apiKey && p.apiKey.trim().length > 0);

                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => onUpdateSettings({ activeProvider: pid })}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-primary bg-surface ring-2 ring-primary/20 shadow-xs'
                        : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-on-surface truncate">{p.name.split(' ')[0]}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </div>

                    <span className="text-[10px] text-on-surface-variant truncate w-full">
                      {pid === 'custom' ? 'Custom URL' : pid.toUpperCase()}
                    </span>

                    {/* Key status indicator */}
                    <div className="mt-2 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          hasKey || pid === 'custom' ? 'bg-emerald-500' : 'bg-outline-variant'
                        }`}
                      />
                      <span className="text-[9px] text-on-surface-variant">
                        {hasKey ? 'Key set' : pid === 'custom' ? 'Ready' : 'No key'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Configuration for Current Provider */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                    <span>{currentProvider.name}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant border border-outline-variant/30">
                      {currentProvider.id}
                    </span>
                  </h3>
                  <p className="text-xs text-on-surface-variant">{currentProvider.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleTestConnection(activeProviderId)}
                disabled={testResult?.loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant/30 text-xs font-semibold text-primary transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
              >
                {testResult?.loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-primary" />
                )}
                <span>{testResult?.loading ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {/* Test result banner if available */}
            {testResult && testResult.provider === activeProviderId && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-150 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-error/10 border-error/30 text-error'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span className="truncate">{testResult.message}</span>
              </div>
            )}

            {/* 1. Base URL (Editable for custom or OpenRouter) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
                <span>API Base URL</span>
                {currentProvider.id === 'custom' && (
                  <span className="text-[10px] text-primary font-normal">
                    e.g. http://localhost:11434/v1 for Ollama, http://localhost:1234/v1 for LMStudio
                  </span>
                )}
              </label>
              <input
                type="text"
                value={currentProvider.baseUrl}
                onChange={(e) => handleUpdateProvider(activeProviderId, { baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
              />
            </div>

            {/* 2. API Key with Eye Show / Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-primary" />
                  API Key
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {currentProvider.apiKey ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Key Configured ({currentProvider.apiKey.length} chars)
                    </span>
                  ) : (
                    <span className="text-amber-500 font-medium">Not configured (uses local engine)</span>
                  )}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showKeyMap[activeProviderId] ? 'text' : 'password'}
                  value={currentProvider.apiKey}
                  onChange={(e) => handleUpdateProvider(activeProviderId, { apiKey: e.target.value })}
                  placeholder={`Enter your ${currentProvider.name} API key (${currentProvider.placeholderKey || 'key...'})`}
                  className="w-full pl-3 pr-20 py-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface font-mono focus:outline-none focus:border-primary transition-all selection:bg-primary/20"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {/* Eye Toggle to view API Key */}
                  <button
                    type="button"
                    onClick={() => toggleShowKey(activeProviderId)}
                    className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    title={showKeyMap[activeProviderId] ? 'Hide API Key' : 'Reveal API Key'}
                  >
                    {showKeyMap[activeProviderId] ? (
                      <EyeOff className="w-4 h-4 text-primary" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  {/* Copy Key Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyKey(currentProvider.apiKey, activeProviderId)}
                    disabled={!currentProvider.apiKey}
                    className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-40"
                    title="Copy API Key"
                  >
                    {copiedKey === activeProviderId ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant">
                Your key is stored strictly in your browser&apos;s local storage and passed securely via server proxy. You can toggle visibility at any time.
              </p>
            </div>

            {/* 3. Model Configuration: Presets + Direct Model ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Preset Model Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Preset Models</label>
                <select
                  value={currentProvider.selectedModelId}
                  onChange={(e) =>
                    handleUpdateProvider(activeProviderId, { selectedModelId: e.target.value })
                  }
                  className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  {currentProvider.presetModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct Model ID Override */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface flex items-center justify-between">
                  <span>Direct Model ID (Custom Override)</span>
                  <span className="text-[10px] text-primary">Overrides preset if filled</span>
                </label>
                <input
                  type="text"
                  value={currentProvider.customModelId}
                  onChange={(e) =>
                    handleUpdateProvider(activeProviderId, { customModelId: e.target.value })
                  }
                  placeholder={`e.g. ${currentProvider.presetModels[0] || 'model-name'}`}
                  className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Active Model Indicator */}
            <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-on-surface-variant">Active Model in Chat:</span>
                <span className="font-mono font-bold text-on-surface">
                  {currentProvider.customModelId.trim() || currentProvider.selectedModelId}
                </span>
              </div>
              <span className="text-[11px] text-outline font-sans">
                {currentProvider.customModelId.trim() ? 'Using Direct ID' : 'Using Preset'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFILE & APPEARANCE TAB */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* User Display Name Section */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-on-surface">User Profile &amp; Display Name</h2>
            </div>
            <p className="text-xs text-on-surface-variant">
              Set your personal display name. It will be remembered every time you visit and shown in the welcome hero greeting and sidebar profile card.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Your Display Name</label>
                <input
                  type="text"
                  value={settings.userName}
                  onChange={(e) => onUpdateSettings({ userName: e.target.value })}
                  placeholder="e.g. Elena Vance, Alex, etc."
                  className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Profile Email (Display Only)</label>
                <input
                  type="email"
                  value={settings.userEmail}
                  onChange={(e) => onUpdateSettings({ userEmail: e.target.value })}
                  placeholder="name@company.ai"
                  className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Display name is saved locally as: </span>
              <strong className="text-on-surface font-semibold">&ldquo;{settings.userName || 'Elena Vance'}&rdquo;</strong>
            </div>
          </div>

          {/* Interface Theme */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h2 className="text-base font-semibold text-on-surface">Interface Theme</h2>
            <p className="text-xs text-on-surface-variant">
              Select your preferred color theme. Synthetix AI applies high-contrast typography and subtle glassmorphic shadows in both modes.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.theme === 'light'
                    ? 'border-primary ring-2 ring-primary/20 bg-surface'
                    : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="text-sm font-semibold text-on-surface">Light Lavender</div>
                  <div className="text-xs text-on-surface-variant">Clean high-clarity canvas</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.theme === 'dark'
                    ? 'border-primary ring-2 ring-primary/20 bg-surface'
                    : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-sm font-semibold text-on-surface">Deep Futuristic Dark</div>
                  <div className="text-xs text-on-surface-variant">Low-strain night coding</div>
                </div>
              </button>
            </div>
          </div>

          {/* Behavior & Audio */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h2 className="text-base font-semibold text-on-surface">Behavior &amp; Audio</h2>
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-on-surface">Auto-scroll to latest response</div>
                  <div className="text-xs text-on-surface-variant">Automatically pin view to generating tokens</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoScroll}
                  onChange={(e) => onUpdateSettings({ autoScroll: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded"
                />
              </label>

              <div className="border-t border-outline-variant/20 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-on-surface">Stream AI responses</div>
                    <div className="text-xs text-on-surface-variant">Display words token-by-token with natural cadence</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.streamResponse}
                    onChange={(e) => onUpdateSettings({ streamResponse: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded"
                  />
                </label>
              </div>

              <div className="border-t border-outline-variant/20 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm font-medium text-on-surface">Audio Speech Feedback</div>
                    <div className="text-xs text-on-surface-variant">Enable read-aloud speech button on message toolbars</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODEL PARAMETERS TAB */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-5">
            <h2 className="text-base font-semibold text-on-surface">Hyperparameter Tuning</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface">Temperature (Creativity)</span>
                  <span className="font-mono text-primary font-bold">{settings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={settings.temperature}
                  onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Precise / Code (0.0)</span>
                  <span>Balanced (0.7)</span>
                  <span>Creative (1.5)</span>
                </div>
              </div>

              {/* Top P */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface">Top-P (Nucleus Sampling)</span>
                  <span className="font-mono text-primary font-bold">{settings.topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.topP}
                  onChange={(e) => onUpdateSettings({ topP: parseFloat(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Narrow (0.1)</span>
                  <span>Full Spectrum (1.0)</span>
                </div>
              </div>
            </div>

            {/* Default Toggles */}
            <div className="border-t border-outline-variant/20 pt-4 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-on-surface">Deep Reasoning Default</div>
                  <div className="text-xs text-on-surface-variant">Auto-enable multi-step reasoning thoughts</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.deepReasoningDefault}
                  onChange={(e) => onUpdateSettings({ deepReasoningDefault: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-on-surface">Live Web Grounding Default</div>
                  <div className="text-xs text-on-surface-variant">Check real-time web citations for breaking news</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.webSearchDefault}
                  onChange={(e) => onUpdateSettings({ webSearchDefault: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded"
                />
              </label>
            </div>

            {/* System Prompt */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase">
                Custom System Instructions
              </label>
              <textarea
                rows={3}
                value={settings.systemPrompt}
                onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
                className="w-full p-3 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary resize-none font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA & STORAGE TAB */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <h2 className="text-base font-semibold text-on-surface">Chat History &amp; Backup</h2>
            <p className="text-xs text-on-surface-variant">
              All chat threads, custom provider API keys, and model preferences are securely persisted in your browser&apos;s local storage.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={onExportAllData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-medium cursor-pointer shadow-xs transition-colors"
              >
                <Download className="w-4 h-4 text-primary" />
                <span>Export All Conversations (.json)</span>
              </button>

              <button
                type="button"
                onClick={onResetSampleData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-medium cursor-pointer shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-secondary" />
                <span>Reload Demo Design Threads</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-error/5 border border-error/20 space-y-3">
            <h2 className="text-base font-semibold text-error">Danger Zone</h2>
            <p className="text-xs text-on-surface-variant">
              Permanently wipe all conversations from local storage. Your API keys will remain saved in settings.
            </p>

            {showClearConfirm ? (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClearHistory();
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:brightness-110 cursor-pointer shadow-sm"
                >
                  Yes, Delete Everything
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-medium hover:bg-surface-container-high cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 hover:bg-error/20 text-error text-xs font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Chat History</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. DIAGNOSTICS TAB */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-on-surface">API Runtime Diagnostics</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                <div className="text-[11px] text-outline uppercase font-semibold">Active Provider</div>
                <div className="text-xs font-mono font-medium text-primary">
                  {currentProvider.name} ({currentProvider.id})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                <div className="text-[11px] text-outline uppercase font-semibold">Target Model ID</div>
                <div className="text-xs font-mono font-medium text-on-surface">
                  {currentProvider.customModelId.trim() || currentProvider.selectedModelId}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                <div className="text-[11px] text-outline uppercase font-semibold">Key Status</div>
                <div className="text-xs font-mono font-medium text-on-surface flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  {currentProvider.apiKey ? 'Configured by User (Visible in Settings)' : 'Local Fallback active'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                <div className="text-[11px] text-outline uppercase font-semibold">Synthetix Build Version</div>
                <div className="text-xs font-mono font-medium text-on-surface">
                  v{apiStatus?.version || '2.4.0'} Production
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
