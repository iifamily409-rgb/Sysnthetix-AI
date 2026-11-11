import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, FileText } from 'lucide-react';
import { ChatConversation, Message } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation?: ChatConversation;
  snippetMessage?: Message | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  conversation,
  snippetMessage,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/share/${conversation?.id || 'demo'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportMarkdown = () => {
    let md = '';
    if (snippetMessage) {
      md = `### ${snippetMessage.role === 'user' ? 'User' : 'Synthetix AI'}\n\n${snippetMessage.content}\n`;
      if (snippetMessage.codeSnippets) {
        for (const s of snippetMessage.codeSnippets) {
          md += `\n\`\`\`${s.language.toLowerCase()}\n// ${s.fileName}\n${s.code}\n\`\`\`\n`;
        }
      }
    } else if (conversation) {
      md = `# ${conversation.title}\n\n`;
      for (const m of conversation.messages) {
        md += `### ${m.role === 'user' ? 'User' : 'Synthetix AI'}\n${m.content}\n\n`;
        if (m.codeSnippets) {
          for (const s of m.codeSnippets) {
            md += `\`\`\`${s.language.toLowerCase()}\n// ${s.fileName}\n${s.code}\n\`\`\`\n\n`;
          }
        }
      }
    }

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">
                {snippetMessage ? 'Share Artifact Snippet' : 'Share Conversation'}
              </h2>
              <p className="text-[11px] text-on-surface-variant">
                Export or publish a public snapshot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Link */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-on-surface">Public Read-Only Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 p-2 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Markdown Export */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <FileText className="w-4 h-4 text-secondary" />
            <span>Markdown &amp; Code Export</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Copy complete chat transcript with code fences and statistical insights directly to your clipboard.
          </p>
          <button
            onClick={handleExportMarkdown}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-surface hover:bg-surface-container border border-outline-variant/30 text-xs font-medium text-on-surface transition-colors cursor-pointer"
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Transcript Copied!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Copy Markdown to Clipboard</span>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface-container text-on-surface text-xs font-medium hover:bg-surface-container-high cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
