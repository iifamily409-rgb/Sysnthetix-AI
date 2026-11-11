import React, { useState } from 'react';
import {
  Menu,
  Edit2,
  ChevronDown,
  Share2,
  Sun,
  Moon,
  MessageSquarePlus,
  Check,
} from 'lucide-react';
import { AIModel } from '../types';

interface HeaderProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  activeModel: AIModel;
  models: AIModel[];
  onSelectModel: (model: AIModel) => void;
  onNewChat: () => void;
  onOpenShare: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleMobileSidebar: () => void;
  isDemoMode?: boolean;
  activeProviderName?: string;
  activeModelName?: string;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onUpdateTitle,
  activeModel,
  models,
  onSelectModel,
  onNewChat,
  onOpenShare,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
  isDemoMode,
  activeProviderName,
  activeModelName,
  userName = 'Elena Vance',
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile hamburger + Title + Model Badge + Status */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          title="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Conversation Title */}
        <div className="flex items-center gap-1.5 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              autoFocus
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              className="bg-surface-container-high px-2 py-1 text-sm font-semibold text-on-surface rounded border border-primary outline-none max-w-[200px] sm:max-w-xs"
            />
          ) : (
            <div
              className="flex items-center gap-1.5 cursor-pointer group"
              onClick={() => {
                setEditedTitle(title);
                setIsEditingTitle(true);
              }}
            >
              <h1 className="text-sm sm:text-base font-semibold text-on-surface truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                {title}
              </h1>
              <Edit2 className="w-3.5 h-3.5 text-on-surface-variant opacity-60 group-hover:opacity-100 group-hover:text-primary transition-opacity shrink-0" />
            </div>
          )}
        </div>

        {/* Model Picker Pill */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer text-xs font-medium border border-outline-variant/20"
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="truncate max-w-[140px] sm:max-w-[200px]">
              {activeProviderName ? `${activeProviderName} • ${activeModelName || activeModel.name}` : activeModel.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>

          {/* Model Selector Dropdown */}
          {showModelDropdown && (
            <div className="absolute left-0 top-9 w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Select Active Model
              </div>
              {models.slice(0, 8).map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                    model.id === activeModel.id
                      ? 'bg-surface-container font-medium text-primary'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-semibold">{model.name}</span>
                      {model.isPro && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-primary/10 text-primary font-bold">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-on-surface-variant truncate">
                      {model.description}
                    </p>
                  </div>
                  {model.id === activeModel.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Latency Status Tag */}
        <div className="hidden xl:flex items-center gap-1.5 text-on-surface-variant text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px]">
            {isDemoMode ? 'Online (Local Engine)' : `Online (${activeModel.latency} latency)`}
          </span>
          {isDemoMode && (
            <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded-full border border-amber-500/20">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* New Conversation Button */}
        <button
          onClick={onNewChat}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
          title="New Conversation"
          type="button"
        >
          <MessageSquarePlus className="w-4 h-4" />
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-xs font-medium cursor-pointer border border-outline-variant/20 shadow-xs"
          type="button"
        >
          <Share2 className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Light / Dark Mode Toggle Segment */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface-container border border-outline-variant/30">
          <button
            onClick={() => theme !== 'light' && onToggleTheme()}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Light Mode"
            type="button"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => theme !== 'dark' && onToggleTheme()}
            className={`p-1.5 rounded-md transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title="Dark Mode"
            type="button"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center ml-1">
          <img
            alt="Elena Vance"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 shadow-xs cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDflXBo7PUaOMHr2KOTBPJWXN6eDIeM-CWNycII7GAgd8-6XQtFWkk6I8Hi4EVlFFm8I_Y0j1bG-DxK-fAhyiBxhs3CV5ngEPY2EBUSDuZIWHsNl9macQE8OSXOn6J9kSHMczpqJIj7xpbsl3aBarLL6dYuCLX0bH4bXJPo1KsfaFZbQT2ABoDuV-vcuKElFji9JQ_jcM8eWJf5CSRXlm5rrhx1hBuEPTYwaqLXrA"
          />
        </div>
      </div>
    </header>
  );
};
