import React, { useState, useRef, useEffect } from 'react';
import {
  Message,
  AIModel,
  Attachment,
  ThinkingStep,
} from '../types';
import {
  Sparkles,
  ArrowUpRight,
  ArrowUp,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  SlidersHorizontal,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  Terminal,
  Globe,
  Brain,
  X,
  FileText,
  Lightbulb,
  PenTool,
  Code,
} from 'lucide-react';

interface ChatWorkspaceProps {
  messages: Message[];
  activeModel: AIModel;
  onSendMessage: (
    content: string,
    options: {
      deepReasoning: boolean;
      webSearch: boolean;
      codeInterpreter: boolean;
      attachments: Attachment[];
    }
  ) => void;
  onRegenerate: () => void;
  isStreaming: boolean;
  onOpenParameters: () => void;
  onOpenShareMessage: (message: Message) => void;
  userName?: string;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  messages,
  activeModel,
  onSendMessage,
  onRegenerate,
  isStreaming,
  onOpenParameters,
  onOpenShareMessage,
  userName = 'Elena Vance',
}) => {
  const [inputText, setInputText] = useState('');
  const [deepReasoning, setDeepReasoning] = useState(true);
  const [webSearch, setWebSearch] = useState(true);
  const [codeInterpreter, setCodeInterpreter] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Auto-scroll on new message chunks
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputText]);

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isImage = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      if (isImage || file.type.startsWith('image/')) {
        reader.onload = () => {
          setAttachments((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: file.size,
              type: 'image',
              mimeType: file.type,
              dataUrl: reader.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = () => {
          setAttachments((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: file.size,
              type: 'file',
              mimeType: file.type || 'text/plain',
              content: reader.result as string,
            },
          ]);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    if ((!inputText.trim() && attachments.length === 0) || isStreaming) return;

    onSendMessage(inputText.trim(), {
      deepReasoning,
      webSearch,
      codeInterpreter,
      attachments,
    });

    setInputText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(key);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/```[\s\S]*?```/g, 'Code block.'));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const suggestionCards = [
    {
      title: 'Write something',
      description: 'Draft an executive summary or launch email announcement.',
      icon: PenTool,
      bgColor: 'bg-primary-fixed',
      textColor: 'text-on-primary-fixed',
      prompt: 'Draft an executive launch announcement email for Synthetix AI v2.4 highlighting our new real-time dual-axis data visualization features.',
    },
    {
      title: 'Explain a topic',
      description: 'Break down quantum entanglement or transformer attention.',
      icon: Brain,
      bgColor: 'bg-tertiary-fixed',
      textColor: 'text-on-tertiary-fixed',
      prompt: 'Explain the Transformer Scaled Dot-Product Attention mechanism in depth with mathematical formulations and intuition.',
    },
    {
      title: 'Generate ideas',
      description: 'Brainstorm viral hooks and positioning angles for our SaaS launch.',
      icon: Lightbulb,
      bgColor: 'bg-secondary-fixed',
      textColor: 'text-on-secondary-fixed',
      prompt: 'Generate 5 high-converting positioning angles and viral LinkedIn hooks for launching a developer AI copilot.',
    },
    {
      title: 'Code & optimize',
      description: 'Refactor a TypeScript custom Hook or optimize vector queries.',
      icon: Code,
      bgColor: 'bg-surface-container-highest',
      textColor: 'text-primary',
      prompt: 'Write an optimized TypeScript React hook for debouncing asynchronous API queries with cache eviction and cancellation tokens.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 pt-6 pb-48 flex flex-col space-y-8">
      {/* Hero Welcome Card - Present on top or when conversation is fresh */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/30 p-6 lg:p-8 shadow-xs flex flex-col items-center text-center">
        {/* Ambient atmospheric gradients */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Glowing AI Orb Badge */}
        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-primary via-secondary to-tertiary opacity-50 blur-md animate-orb" />
          <div className="relative w-14 h-14 rounded-full bg-surface border border-outline-variant/40 flex items-center justify-center shadow-md">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Welcome Headings */}
        <div className="space-y-1.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1 border border-outline-variant/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            Synthetix Engine v2.4 Active
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-on-surface tracking-tight">
            Hello, {userName}! How can I{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
            Your AI assistant is ready to write, analyze, ideate, and code with multimodal reasoning and live sandbox validation.
          </p>
        </div>

        {/* 4 Interactive Quick Suggestion Prompt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-6 text-left relative z-10">
          {suggestionCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setInputText(card.prompt);
                  textareaRef.current?.focus();
                }}
                className="group flex flex-col justify-between p-4 rounded-xl bg-surface border border-outline-variant/30 hover:bg-surface-container-high hover:border-primary/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                type="button"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${card.bgColor} ${card.textColor} flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-on-surface mb-0.5">{card.title}</div>
                  <div className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {card.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Messages */}
      <div className="space-y-6 w-full">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';

          if (isUser) {
            return (
              <div key={message.id || index} className="flex items-start justify-end gap-3 group">
                <div className="flex flex-col items-end max-w-2xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs text-on-surface-variant font-medium">You</span>
                    <span className="text-xs text-on-surface-variant/80">• {message.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-surface-container border border-outline-variant/30 px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-xs text-on-surface text-sm leading-relaxed">
                    {/* Render message text */}
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* Render attached files or images */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-outline-variant/20">
                        {message.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high text-xs text-on-surface border border-outline-variant/30"
                          >
                            {att.type === 'image' ? (
                              <img
                                src={att.dataUrl}
                                alt={att.name}
                                className="w-4 h-4 rounded object-cover"
                              />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-primary" />
                            )}
                            <span className="truncate max-w-[120px]">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Avatar */}
                <img
                  className="w-8 h-8 rounded-full object-cover shadow-xs shrink-0 mt-6 ring-1 ring-primary/20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDflXBo7PUaOMHr2KOTBPJWXN6eDIeM-CWNycII7GAgd8-6XQtFWkk6I8Hi4EVlFFm8I_Y0j1bG-DxK-fAhyiBxhs3CV5ngEPY2EBUSDuZIWHsNl9macQE8OSXOn6J9kSHMczpqJIj7xpbsl3aBarLL6dYuCLX0bH4bXJPo1KsfaFZbQT2ABoDuV-vcuKElFji9JQ_jcM8eWJf5CSRXlm5rrhx1hBuEPTYwaqLXrA"
                  alt="Elena Vance"
                />
              </div>
            );
          }

          // Assistant Response
          const isThinkingState = message.isThinking;
          const isAccordionOpen = expandedThinking[message.id] ?? true;

          return (
            <div key={message.id || index} className="flex items-start gap-3 group">
              {/* AI Avatar */}
              <div className="relative shrink-0 mt-1">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-sm ring-4 ring-primary-fixed/40 ${
                    isThinkingState ? 'animate-pulse' : ''
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                {/* Header Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-on-surface">
                      {message.modelName || activeModel.name}
                    </span>
                    {isThinkingState ? (
                      <span className="text-[11px] text-primary font-medium animate-pulse flex items-center gap-1">
                        • Reasoning...
                      </span>
                    ) : (
                      <>
                        {message.latency && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface-variant font-mono">
                            {message.latency}
                          </span>
                        )}
                        <span className="text-xs text-on-surface-variant">• {message.timestamp}</span>
                      </>
                    )}
                  </div>

                  {message.isCodeVerified && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[11px] text-on-surface-variant px-2 py-0.5 rounded bg-surface-container border border-outline-variant/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Code Execution Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Thinking Process Accordion (if in thinking state or contains steps) */}
                {message.thinkingSteps && message.thinkingSteps.length > 0 && (
                  <div className="rounded-xl bg-surface-container-low border border-outline-variant/30 p-3 space-y-2 shadow-2xs">
                    <div
                      onClick={() =>
                        setExpandedThinking((prev) => ({
                          ...prev,
                          [message.id]: !isAccordionOpen,
                        }))
                      }
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2 text-on-surface text-xs font-semibold">
                        {isThinkingState ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4 text-primary" />
                        )}
                        <span>
                          Thinking Process ({message.thinkingSteps.length} steps evaluated)
                        </span>
                      </div>
                      {isAccordionOpen ? (
                        <ChevronUp className="w-4 h-4 text-on-surface-variant" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                      )}
                    </div>

                    {isAccordionOpen && (
                      <div className="pl-6 space-y-1.5 text-xs text-on-surface-variant border-t border-outline-variant/20 pt-2">
                        {message.thinkingSteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className={`flex items-center gap-2 ${
                              !step.completed && isThinkingState
                                ? 'text-primary font-medium'
                                : ''
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-primary animate-ping shrink-0" />
                            )}
                            <span>{step.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* In-Progress Shimmer Indicator */}
                {isThinkingState && (
                  <div className="flex items-center gap-2.5 px-2 py-1">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-bounce" />
                    </div>
                    <span className="text-xs text-on-surface-variant italic">
                      Synthetix is finalizing synthesized output...
                    </span>
                  </div>
                )}

                {/* Render Text Content */}
                {message.content && (
                  <div className="space-y-3 text-sm text-on-surface leading-relaxed whitespace-pre-wrap font-sans">
                    {message.content}
                  </div>
                )}

                {/* Key Insights Card */}
                {message.keyInsights && message.keyInsights.length > 0 && (
                  <div className="rounded-xl p-4 bg-gradient-to-r from-surface-container to-surface-container-high border border-outline-variant/30 shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Key Statistical Insights
                    </div>
                    <ul className="space-y-1 text-xs text-on-surface-variant list-disc list-inside">
                      {message.keyInsights.map((insight, iIdx) => (
                        <li key={iIdx} className="leading-relaxed">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Code Snippets Block (Rich Syntax Art) */}
                {message.codeSnippets &&
                  message.codeSnippets.map((snippet, cIdx) => {
                    const snippetKey = `${message.id}-code-${cIdx}`;
                    const isCodeCopied = copiedSnippetIdx === snippetKey;

                    return (
                      <div
                        key={cIdx}
                        className="rounded-xl overflow-hidden bg-inverse-surface border border-outline-variant/40 shadow-md my-2"
                      >
                        {/* Code Header Bar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-inverse-surface/90 text-inverse-on-surface border-b border-white/10">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            {/* Window buttons */}
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                            <span className="ml-2 text-inverse-on-surface/90 font-medium">
                              {snippet.fileName}
                            </span>
                            <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] font-sans uppercase tracking-wider bg-white/10 text-inverse-on-surface/80">
                              {snippet.language}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopyCode(snippetKey, snippet.code)}
                            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-inverse-on-surface text-xs transition-colors cursor-pointer"
                            type="button"
                          >
                            {isCodeCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Code content */}
                        <pre className="p-4 font-mono text-[13px] leading-relaxed text-inverse-on-surface overflow-x-auto selection:bg-primary/30">
                          <code>{snippet.code}</code>
                        </pre>
                      </div>
                    );
                  })}

                {/* Bottom Action Toolbar */}
                {!isThinkingState && (
                  <div className="flex items-center justify-between pt-1 text-on-surface-variant text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyText(message.id, message.content)}
                        className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                        title="Copy Message"
                        type="button"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [message.id]: prev[message.id] === 'up' ? undefined! : 'up',
                          }))
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          feedback[message.id] === 'up'
                            ? 'text-primary bg-primary/10'
                            : 'hover:bg-surface-container hover:text-on-surface'
                        }`}
                        title="Helpful (Thumbs up)"
                        type="button"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [message.id]: prev[message.id] === 'down' ? undefined! : 'down',
                          }))
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          feedback[message.id] === 'down'
                            ? 'text-error bg-error/10'
                            : 'hover:bg-surface-container hover:text-on-surface'
                        }`}
                        title="Unhelpful (Thumbs down)"
                        type="button"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={onRegenerate}
                        className="p-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                        title="Regenerate Response"
                        type="button"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleSpeech(message.id, message.content)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          speakingMsgId === message.id
                            ? 'text-primary bg-primary/10 animate-pulse'
                            : 'hover:bg-surface-container hover:text-on-surface'
                        }`}
                        title={speakingMsgId === message.id ? 'Stop Speaking' : 'Read Aloud'}
                        type="button"
                      >
                        {speakingMsgId === message.id ? (
                          <VolumeX className="w-4 h-4 text-primary" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenShareMessage(message)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors text-xs font-medium cursor-pointer"
                        type="button"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Snippet</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Ambient Prompt Dock */}
      <div className="fixed bottom-0 left-0 lg:left-72 right-0 px-4 lg:px-8 pb-4 pointer-events-none z-30">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          {/* Dock Container with Layered Elevation Shadow & Frosted Glass */}
          <div className="relative bg-surface/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden p-3 transition-all">
            {/* Top Dock Sub-Toolbar / Modes & Token Meta */}
            <div className="flex items-center justify-between pb-2 text-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {/* Web Search Toggle */}
                <button
                  type="button"
                  onClick={() => setWebSearch(!webSearch)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer border ${
                    webSearch
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Search</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      webSearch ? 'bg-emerald-500 animate-pulse' : 'bg-outline-variant'
                    }`}
                  />
                </button>

                {/* Deep Reasoning Toggle */}
                <button
                  type="button"
                  onClick={() => setDeepReasoning(!deepReasoning)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer border ${
                    deepReasoning
                      ? 'bg-secondary/10 text-secondary border-secondary/30 font-medium'
                      : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Deep Reasoning</span>
                  {deepReasoning && (
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  )}
                </button>

                {/* Code Interpreter Toggle */}
                <button
                  type="button"
                  onClick={() => setCodeInterpreter(!codeInterpreter)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer border ${
                    codeInterpreter
                      ? 'bg-tertiary/10 text-tertiary border-tertiary/30 font-medium'
                      : 'bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Code Interpreter</span>
                </button>
              </div>

              {/* Context Counter */}
              <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>1,240 / {activeModel.contextWindow} context</span>
              </div>
            </div>

            {/* Attachments preview list */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 pb-1">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-xs text-on-surface border border-outline-variant/30"
                  >
                    {att.type === 'image' && att.dataUrl ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="w-5 h-5 rounded object-cover"
                      />
                    ) : (
                      <FileText className="w-4 h-4 text-primary" />
                    )}
                    <span className="truncate max-w-[150px]">{att.name}</span>
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="p-0.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e, false)}
              className="hidden"
              multiple
            />
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={(e) => handleFileUpload(e, true)}
              className="hidden"
              multiple
            />

            {/* Chat Textarea Input Area */}
            <div className="relative mt-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask me anything... (Type '/' for system tools, '@' to mention data)"
                className="w-full bg-transparent resize-none text-on-surface placeholder:text-outline focus:outline-none text-sm px-1 py-1 selection:bg-primary/20 max-h-48"
              />
            </div>

            {/* Bottom Controls & Execution Triggers */}
            <div className="flex items-center justify-between pt-1">
              {/* Media & Attachment Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  title="Attach file (PDF, CSV, Python, Text)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  title="Upload Image / Diagram"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-2 rounded-xl transition-colors cursor-pointer relative ${
                    isListening
                      ? 'text-error bg-error/10 ring-2 ring-error/30 animate-pulse'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  title={isListening ? 'Stop Voice Input' : 'Voice Input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
                </button>

                <div className="h-4 w-px bg-outline-variant/30 mx-1" />

                <button
                  type="button"
                  onClick={onOpenParameters}
                  className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-on-surface px-2 py-1 rounded-lg text-xs hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Parameters</span>
                </button>
              </div>

              {/* Shortcuts & Send Action */}
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-outline font-sans">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[11px] border border-outline-variant/20">
                    ↵
                  </kbd>{' '}
                  Send,{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono text-[11px] border border-outline-variant/20">
                    ⇧↵
                  </kbd>{' '}
                  New line
                </span>

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={(!inputText.trim() && attachments.length === 0) || isStreaming}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Execute Prompt"
                >
                  {isStreaming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Legal / AI Safety Advisory Disclaimer */}
          <div className="text-center mt-2">
            <p className="text-[11px] text-outline">
              Synthetix AI can make mistakes. Verify critical facts, statistical models, and executable code before production deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
