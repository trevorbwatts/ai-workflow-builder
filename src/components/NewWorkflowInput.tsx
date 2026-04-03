import React, { useState, useRef, useEffect } from 'react';
import { Workflow } from '../types';
import { processWorkflowEdit } from '../lib/gemini';
import { Sparkles, Send, Loader2, X } from 'lucide-react';

interface Props {
  baseWorkflow: Workflow;
  onCreated: (workflow: Workflow) => void;
  onCancel: () => void;
}

export const NewWorkflowInput: React.FC<Props> = ({ baseWorkflow, onCreated, onCancel }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const { updatedWorkflow } = await processWorkflowEdit(baseWorkflow, msg, []);
      onCreated(updatedWorkflow);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden max-w-3xl w-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Draft
            </span>
            <span className="text-xs text-slate-400">
              {isLoading ? 'Creating your workflow...' : 'Describe the workflow you want to create'}
            </span>
          </div>
          {!isLoading && (
            <button onClick={onCancel} className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 py-4 text-slate-400 text-sm">
            <Loader2 size={16} className="animate-spin text-indigo-400" />
            Building your workflow…
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe what you want this workflow to do..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};
