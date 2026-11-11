import React, { useState } from 'react';
import { ChatConversation } from '../types';
import {
  Plus,
  MessageSquare,
  LayoutGrid,
  Settings,
  BookOpen,
  MoreVertical,
  Trash2,
  Edit2,
  Download,
  X,
  Sparkles,
  ChevronUp,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  activeView: 'chat' | 'explore' | 'settings' | 'docs';
  onNavigate: (view: 'chat' | 'explore' | 'settings' | 'docs') => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  userName?: string;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
  activeView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  userName = 'Elena Vance',
  userEmail = 'elena@synthetix.ai',
}) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sections: Array<'Today' | 'Yesterday' | 'Previous 7 Days'> = [
    'Today',
    'Yesterday',
    'Previous 7 Days',
  ];

  const handleStartRename = (conv: ChatConversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-container-low border-r border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-hidden transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-outline-variant/20">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onNavigate('chat')}
            >
              {/* Glowing Synthetix AI Logo */}
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-primary via-secondary to-primary-container flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
                <div className="absolute -inset-0.5 rounded-lg bg-primary/30 blur-xs -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />
              </div>
              <span className="font-semibold text-lg text-on-surface tracking-tight">
                Synthetix AI
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">
                v2.4
              </span>
              <button
                className="lg:hidden p-1 text-on-surface-variant hover:text-on-surface"
                onClick={onCloseMobile}
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* New Chat Action */}
          <div className="px-4 py-3">
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary hover:brightness-110 active:scale-[0.99] text-on-primary text-sm font-medium shadow-[0_4px_14px_rgba(70,72,212,0.25)] transition-all cursor-pointer"
              type="button"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-xs font-mono">
                ⌘K
              </span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto px-4 py-1 space-y-4">
            {sections.map((section) => {
              const items = conversations.filter((c) => c.section === section);
              if (items.length === 0) return null;

              return (
                <div key={section} className="space-y-1">
                  <div className="text-[11px] font-semibold text-on-surface-variant/80 uppercase tracking-wider px-2 py-1">
                    {section}
                  </div>

                  <div className="space-y-0.5">
                    {items.map((conv) => {
                      const isActive =
                        conv.id === activeConversationId && activeView === 'chat';

                      return (
                        <div
                          key={conv.id}
                          className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-surface-container font-medium text-on-surface shadow-xs'
                              : 'text-on-surface-variant hover:bg-surface-container/70 hover:text-on-surface'
                          }`}
                          onClick={() => {
                            onSelectConversation(conv.id);
                            if (window.innerWidth < 1024) onCloseMobile();
                          }}
                        >
                          {editingId === conv.id ? (
                            <input
                              type="text"
                              value={editTitle}
                              autoFocus
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => handleSaveRename(conv.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(conv.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-surface-container-lowest px-2 py-0.5 text-xs text-on-surface border border-primary rounded outline-none"
                            />
                          ) : (
                            <span className="truncate pr-2 select-none text-[13px]">
                              {conv.title}
                            </span>
                          )}

                          {editingId !== conv.id && (
                            <div
                              className={`relative flex items-center ${
                                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                              } transition-opacity`}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                                }}
                                className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"
                                title="Conversation options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {/* Dropdown Options */}
                              {menuOpenId === conv.id && (
                                <div
                                  className="absolute right-0 top-6 w-36 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => handleStartRename(conv)}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container"
                                  >
                                    <Edit2 className="w-3 h-3 text-on-surface-variant" />
                                    Rename
                                  </button>
                                  <button
                                    onClick={() => {
                                      const dataStr =
                                        'data:text/json;charset=utf-8,' +
                                        encodeURIComponent(JSON.stringify(conv, null, 2));
                                      const downloadAnchor = document.createElement('a');
                                      downloadAnchor.setAttribute('href', dataStr);
                                      downloadAnchor.setAttribute(
                                        'download',
                                        `${conv.title.replace(/\s+/g, '_')}.json`
                                      );
                                      document.body.appendChild(downloadAnchor);
                                      downloadAnchor.click();
                                      downloadAnchor.remove();
                                      setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container"
                                  >
                                    <Download className="w-3 h-3 text-on-surface-variant" />
                                    Export JSON
                                  </button>
                                  <button
                                    onClick={() => {
                                      onDeleteConversation(conv.id);
                                      setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-error hover:bg-error/10"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom App Navigation */}
          <div className="p-3 bg-surface-container-low border-t border-outline-variant/20">
            <nav className="space-y-0.5">
              <button
                onClick={() => {
                  onNavigate('chat');
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                  activeView === 'chat'
                    ? 'bg-surface-container-high text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Home</span>
                </span>
              </button>

              <button
                onClick={() => {
                  onNavigate('explore');
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                  activeView === 'explore'
                    ? 'bg-surface-container-high text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-secondary" />
                  <span>Explore Models &amp; GPTs</span>
                </span>
                <span className="text-[11px] font-semibold bg-surface-container-highest text-on-surface-variant px-1.5 py-0.5 rounded-full">
                  24
                </span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                  activeView === 'settings'
                    ? 'bg-surface-container-high text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-tertiary" />
                  <span>Settings</span>
                </span>
              </button>

              <button
                onClick={() => {
                  onNavigate('docs');
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                  activeView === 'docs'
                    ? 'bg-surface-container-high text-on-surface font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-on-surface-variant" />
                  <span>Documentation &amp; Help</span>
                </span>
              </button>
            </nav>
          </div>

          {/* User Profile Card */}
          <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-between p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-primary/30"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDflXBo7PUaOMHr2KOTBPJWXN6eDIeM-CWNycII7GAgd8-6XQtFWkk6I8Hi4EVlFFm8I_Y0j1bG-DxK-fAhyiBxhs3CV5ngEPY2EBUSDuZIWHsNl9macQE8OSXOn6J9kSHMczpqJIj7xpbsl3aBarLL6dYuCLX0bH4bXJPo1KsfaFZbQT2ABoDuV-vcuKElFji9JQ_jcM8eWJf5CSRXlm5rrhx1hBuEPTYwaqLXrA"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-medium text-on-surface truncate">
                      {userName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gradient-to-r from-secondary-container to-primary text-white font-semibold shadow-xs">
                      Pro
                    </span>
                  </div>
                  <div className="text-[11px] text-on-surface-variant truncate">
                    {userEmail}
                  </div>
                </div>
              </div>
              <ChevronUp
                className={`w-4 h-4 text-on-surface-variant transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Profile Popover Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-18 left-3 right-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl p-1.5 space-y-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-outline-variant/20">
                  <div className="text-xs font-semibold text-on-surface">Synthetix Pro Plan</div>
                  <div className="text-[11px] text-on-surface-variant">Unlimited reasoning tokens</div>
                </div>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-lg"
                >
                  <User className="w-3.5 h-3.5 text-on-surface-variant" />
                  Account Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded-lg"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Security &amp; API Keys
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-error hover:bg-error/10 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Switch Account
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
