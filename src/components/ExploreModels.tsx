import React, { useState } from 'react';
import { AIModel } from '../types';
import {
  Search,
  Sparkles,
  Zap,
  Code,
  Brain,
  Globe,
  Bot,
  Star,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';

interface ExploreModelsProps {
  models: AIModel[];
  activeModelId: string;
  onSelectModel: (model: AIModel) => void;
  onNavigateChat: () => void;
}

export const ExploreModels: React.FC<ExploreModelsProps> = ({
  models,
  activeModelId,
  onSelectModel,
  onNavigateChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Models', count: models.length },
    {
      id: 'reasoning',
      label: 'Deep Reasoning',
      count: models.filter((m) => m.category === 'reasoning').length,
    },
    {
      id: 'coding',
      label: 'Code & Dev',
      count: models.filter((m) => m.category === 'coding').length,
    },
    {
      id: 'multimodal',
      label: 'Multimodal',
      count: models.filter((m) => m.category === 'multimodal').length,
    },
    {
      id: 'agent',
      label: 'Custom GPTs & Agents',
      count: models.filter((m) => m.category === 'agent').length,
    },
  ];

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reasoning':
        return <Brain className="w-4 h-4 text-secondary" />;
      case 'coding':
        return <Code className="w-4 h-4 text-primary" />;
      case 'multimodal':
        return <Zap className="w-4 h-4 text-tertiary" />;
      case 'agent':
        return <Bot className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8 pb-32">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Synthetix Model Registry
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">
            Explore Models &amp; GPTs
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Choose from 24 benchmarked LLMs and specialized domain agents. Switch models at any time with persistent chat context and sandbox execution.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models, tags, providers..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface text-on-surface'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const isActive = model.id === activeModelId;

          return (
            <div
              key={model.id}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-surface-container-low border transition-all duration-200 ${
                isActive
                  ? 'border-primary ring-2 ring-primary/20 shadow-md bg-surface-container'
                  : 'border-outline-variant/30 hover:border-primary/40 hover:shadow-md'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/30 shadow-xs">
                      {getCategoryIcon(model.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-sm text-on-surface">{model.name}</h3>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-primary-fixed text-on-primary-fixed">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">{model.provider}</div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed mb-4">
                  {model.description}
                </p>
              </div>

              {/* Specs & Action */}
              <div>
                <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-outline-variant/20 mb-4 text-center">
                  <div>
                    <div className="text-[10px] text-outline uppercase font-semibold">Context</div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5 font-mono">
                      {model.contextWindow}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-outline uppercase font-semibold">Latency</div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5 font-mono flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      {model.latency}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-outline uppercase font-semibold">Rating</div>
                    <div className="text-xs font-semibold text-on-surface mt-0.5 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {model.rating}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectModel(model);
                    onNavigateChat();
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white hover:brightness-110 shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface hover:text-primary'
                  }`}
                >
                  <span>{isActive ? 'Chat with Active Model' : 'Select & Launch Model'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
