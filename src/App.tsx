/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChatConversation,
  Message,
  AIModel,
  UserSettings,
  Attachment,
} from './types';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MODELS,
  DEFAULT_USER_SETTINGS,
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatWorkspace } from './components/ChatWorkspace';
import { ExploreModels } from './components/ExploreModels';
import { SettingsView } from './components/SettingsView';
import { DocumentationView } from './components/DocumentationView';
import { ParametersModal } from './components/ParametersModal';
import { ShareModal } from './components/ShareModal';

export default function App() {
  // Load state from localStorage or initial presets
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    try {
      const saved = localStorage.getItem('synthetix_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('synthetix_active_id');
      if (savedId && conversations.some((c) => c.id === savedId)) {
        return savedId;
      }
      return conversations[0]?.id || 'conv-1';
    } catch {
      return 'conv-1';
    }
  });

  const [models] = useState<AIModel[]>(INITIAL_MODELS);
  const [activeModelId, setActiveModelId] = useState<string>('synthetix-4.5-sonnet');

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('synthetix_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER_SETTINGS,
          ...parsed,
          providers: {
            ...DEFAULT_USER_SETTINGS.providers,
            ...(parsed.providers || {}),
          },
        };
      }
      return DEFAULT_USER_SETTINGS;
    } catch {
      return DEFAULT_USER_SETTINGS;
    }
  });

  const activeProviderKey = settings.activeProvider || 'gemini';
  const activeProviderConfig =
    settings.providers?.[activeProviderKey] || DEFAULT_USER_SETTINGS.providers.gemini;
  const targetModelId =
    activeProviderConfig.customModelId?.trim() ||
    activeProviderConfig.selectedModelId ||
    'gemini-3.8-flash';

  const [activeView, setActiveView] = useState<'chat' | 'explore' | 'settings' | 'docs'>('chat');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isParametersOpen, setIsParametersOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareSnippetMessage, setShareSnippetMessage] = useState<Message | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check backend API status
  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.isDemoMode === 'boolean') {
          setIsDemoMode(data.isDemoMode);
        }
      })
      .catch(() => setIsDemoMode(true));
  }, []);

  // Sync theme class to document element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('synthetix_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem('synthetix_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Persist active ID
  useEffect(() => {
    localStorage.setItem('synthetix_active_id', activeConversationId);
  }, [activeConversationId]);

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const activeModel =
    models.find((m) => m.id === activeModelId) || models[0];

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for new chat)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewChat = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      section: 'Today',
      modelId: activeModelId,
      messages: [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setActiveView('chat');
  }, [activeModelId]);

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const fallback: ChatConversation = {
          id: `conv-${Date.now()}`,
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          section: 'Today',
          modelId: activeModelId,
          messages: [],
        };
        setActiveConversationId(fallback.id);
        return [fallback];
      }
      if (activeConversationId === id) {
        setActiveConversationId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleClearHistory = () => {
    const fresh: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      section: 'Today',
      modelId: activeModelId,
      messages: [],
    };
    setConversations([fresh]);
    setActiveConversationId(fresh.id);
    setActiveView('chat');
  };

  const handleResetSampleData = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setActiveConversationId('conv-1');
    setActiveView('chat');
  };

  const handleExportAllData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `synthetix_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Execute prompt and handle SSE streaming
  const handleSendMessage = async (
    content: string,
    options: {
      deepReasoning: boolean;
      webSearch: boolean;
      codeInterpreter: boolean;
      attachments: Attachment[];
    }
  ) => {
    if (!activeConversation) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: options.attachments,
    };

    const assistantPlaceholderId = `msg-${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelName: `${activeProviderConfig.name} (${targetModelId})`,
      isThinking: options.deepReasoning,
      isCodeVerified: options.codeInterpreter,
      thinkingSteps: options.deepReasoning
        ? [
            {
              step: 1,
              total: 3,
              text: 'Analyzing query intent and contextual constraints',
              completed: false,
            },
          ]
        : undefined,
    };

    // Auto-update conversation title if first message
    const isFirstUserMessage = activeConversation.messages.length === 0;
    const updatedTitle =
      isFirstUserMessage && content.trim()
        ? content.trim().slice(0, 32) + (content.length > 32 ? '...' : '')
        : activeConversation.title;

    const newMessages = [...activeConversation.messages, userMessage, assistantMessage];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              title: updatedTitle,
              messages: newMessages,
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider: settings.activeProvider,
          baseUrl: activeProviderConfig.baseUrl,
          userApiKey: activeProviderConfig.apiKey,
          model: targetModelId,
          deepReasoning: options.deepReasoning,
          webSearch: options.webSearch,
          codeInterpreter: options.codeInterpreter,
          attachments: options.attachments,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      const currentThinkingSteps: Array<{
        step: number;
        total: number;
        text: string;
        completed: boolean;
      }> = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));

              if (event.type === 'thinking_step') {
                const existing = currentThinkingSteps.find((s) => s.step === event.step);
                if (existing) {
                  existing.text = event.text;
                  existing.completed = true;
                } else {
                  currentThinkingSteps.forEach((s) => (s.completed = true));
                  currentThinkingSteps.push({
                    step: event.step,
                    total: event.total,
                    text: event.text,
                    completed: false,
                  });
                }

                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConversation.id
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantPlaceholderId
                              ? {
                                  ...m,
                                  isThinking: true,
                                  thinkingSteps: [...currentThinkingSteps],
                                }
                              : m
                          ),
                        }
                      : c
                  )
                );
              } else if (event.type === 'chunk') {
                accumulatedText += event.text;

                // Check if thinking should stop
                currentThinkingSteps.forEach((s) => (s.completed = true));

                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConversation.id
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantPlaceholderId
                              ? {
                                  ...m,
                                  content: accumulatedText,
                                  isThinking: false,
                                  thinkingSteps:
                                    currentThinkingSteps.length > 0
                                      ? [...currentThinkingSteps]
                                      : undefined,
                                }
                              : m
                          ),
                        }
                      : c
                  )
                );
              } else if (event.type === 'done') {
                currentThinkingSteps.forEach((s) => (s.completed = true));
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConversation.id
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantPlaceholderId
                              ? {
                                  ...m,
                                  isThinking: false,
                                  latency: '0.9s',
                                  isCodeVerified: options.codeInterpreter,
                                  thinkingSteps:
                                    currentThinkingSteps.length > 0
                                      ? [...currentThinkingSteps]
                                      : undefined,
                                }
                              : m
                          ),
                        }
                      : c
                  )
                );
              }
            } catch (jsonErr) {
              console.warn('Could not parse SSE message:', line, jsonErr);
            }
          }
        }
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantPlaceholderId
                    ? {
                        ...m,
                        content: `### Synthetix Connection Notice\n\nCould not connect to the remote generation service (${errorMessage}). Synthetix is operating in local sandbox preview mode.`,
                        isThinking: false,
                      }
                    : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length < 2) return;
    const lastUserMsg = [...activeConversation.messages]
      .reverse()
      .find((m) => m.role === 'user');

    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content, {
        deepReasoning: settings.deepReasoningDefault,
        webSearch: settings.webSearchDefault,
        codeInterpreter: settings.codeInterpreterDefault,
        attachments: lastUserMsg.attachments || [],
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      {/* Left Sidebar Navigation */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setActiveView('chat');
        }}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        userName={settings.userName}
        userEmail={settings.userEmail}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 h-full overflow-hidden">
        {/* Fixed Header */}
        <Header
          title={activeConversation?.title || 'Synthetix AI'}
          onUpdateTitle={(newTitle) =>
            activeConversation && handleRenameConversation(activeConversation.id, newTitle)
          }
          activeModel={activeModel}
          models={models}
          onSelectModel={(model) => setActiveModelId(model.id)}
          onNewChat={handleNewChat}
          onOpenShare={() => {
            setShareSnippetMessage(null);
            setIsShareOpen(true);
          }}
          theme={settings.theme}
          onToggleTheme={() =>
            setSettings((prev) => ({
              ...prev,
              theme: prev.theme === 'light' ? 'dark' : 'light',
            }))
          }
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isDemoMode={isDemoMode && !activeProviderConfig.apiKey}
          activeProviderName={activeProviderConfig.name}
          activeModelName={targetModelId}
          userName={settings.userName}
        />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto pt-16 bg-surface">
          {activeView === 'chat' && (
            <ChatWorkspace
              messages={activeConversation?.messages || []}
              activeModel={activeModel}
              onSendMessage={handleSendMessage}
              onRegenerate={handleRegenerate}
              isStreaming={isStreaming}
              onOpenParameters={() => setIsParametersOpen(true)}
              onOpenShareMessage={(msg) => {
                setShareSnippetMessage(msg);
                setIsShareOpen(true);
              }}
              userName={settings.userName}
            />
          )}

          {activeView === 'explore' && (
            <ExploreModels
              models={models}
              activeModelId={activeModelId}
              onSelectModel={(model) => setActiveModelId(model.id)}
              onNavigateChat={() => setActiveView('chat')}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) =>
                setSettings((prev) => ({ ...prev, ...newSettings }))
              }
              models={models}
              onClearHistory={handleClearHistory}
              onResetSampleData={handleResetSampleData}
              onExportAllData={handleExportAllData}
            />
          )}

          {activeView === 'docs' && <DocumentationView />}
        </main>
      </div>

      {/* Parameters Modal */}
      <ParametersModal
        isOpen={isParametersOpen}
        onClose={() => setIsParametersOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        conversation={activeConversation}
        snippetMessage={shareSnippetMessage}
      />
    </div>
  );
}
