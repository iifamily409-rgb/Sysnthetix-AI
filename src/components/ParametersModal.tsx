import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { UserSettings } from '../types';

interface ParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const ParametersModal: React.FC<ParametersModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Execution Parameters</h2>
              <p className="text-[11px] text-on-surface-variant">
                Adjust hyperparameter sampling and prompt steering
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

        {/* Content Sliders */}
        <div className="space-y-4">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-on-surface">Temperature (Randomness)</span>
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
              <span>Deterministic / Code (0.0)</span>
              <span>Balanced (0.7)</span>
              <span>Creative (1.5)</span>
            </div>
          </div>

          {/* Top-P */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-on-surface">Top-P (Nucleus Cutoff)</span>
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
          </div>

          {/* Max Output Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-on-surface">Max Generation Tokens</span>
              <span className="font-mono text-primary font-bold">{settings.maxTokens}</span>
            </div>
            <input
              type="range"
              min="512"
              max="8192"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => onUpdateSettings({ maxTokens: parseInt(e.target.value, 10) })}
              className="w-full accent-primary"
            />
          </div>

          {/* System Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface">
              System Steering Instruction
            </label>
            <textarea
              rows={3}
              value={settings.systemPrompt}
              onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
              className="w-full p-2.5 bg-surface border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary resize-none font-mono"
              placeholder="Guide how Synthetix AI structures responses..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:brightness-110 cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Apply Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
