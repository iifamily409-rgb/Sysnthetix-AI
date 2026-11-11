export interface ThinkingStep {
  step: number;
  total: number;
  text: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  dataUrl?: string;
  content?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelName?: string;
  latency?: string;
  isCodeVerified?: boolean;
  keyInsights?: string[];
  codeSnippets?: Array<{
    fileName: string;
    language: string;
    code: string;
  }>;
  thinkingSteps?: ThinkingStep[];
  isThinking?: boolean;
  liked?: boolean | null;
  attachments?: Attachment[];
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  section: 'Today' | 'Yesterday' | 'Previous 7 Days';
  messages: Message[];
  modelId: string;
  providerId?: string;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  category: 'reasoning' | 'coding' | 'multimodal' | 'general' | 'agent';
  description: string;
  contextWindow: string;
  latency: string;
  rating: number;
  isPro?: boolean;
  badge?: string;
  iconName: string;
}

export type ProviderId = 'gemini' | 'openrouter' | 'openai' | 'anthropic' | 'groq' | 'custom';

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  description: string;
  baseUrl: string;
  apiKey: string;
  selectedModelId: string;
  customModelId: string;
  presetModels: string[];
  isCustomBaseUrl?: boolean;
  placeholderKey?: string;
}

export interface UserSettings {
  userName: string;
  userEmail: string;
  theme: 'light' | 'dark';
  defaultModel: string;
  activeProvider: ProviderId;
  providers: Record<ProviderId, ProviderConfig>;
  soundEnabled: boolean;
  autoScroll: boolean;
  streamResponse: boolean;
  deepReasoningDefault: boolean;
  webSearchDefault: boolean;
  codeInterpreterDefault: boolean;
  temperature: number;
  topP: number;
  systemPrompt: string;
  maxTokens: number;
}
