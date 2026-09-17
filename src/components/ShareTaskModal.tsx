import React, { useState } from 'react';
import { Task } from '../types';
import { Share2, Link2, Key, Send, X, Check } from 'lucide-react';

interface ShareTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onShare: (taskId: string, target: string, permission: 'Viewer' | 'Commenter' | 'Editor') => void;
  onCopyLink: (taskId: string) => void;
  onRequestAccess: (taskId: string) => void;
}

export const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  isOpen,
  task,
  onClose,
  onShare,
  onCopyLink,
  onRequestAccess
}) => {
  if (!isOpen || !task) return null;

  const [target, setTarget] = useState('');
  const [permission, setPermission] = useState<'Viewer' | 'Commenter' | 'Editor'>('Viewer');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = () => {
    onCopyLink(task.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) {
      setError('Please specify a collaborator, email, or team group.');
      return;
    }
    setError('');
    onShare(task.id, target.trim(), permission);
    setTarget('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white border border-[rgba(85,105,112,0.22)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-task-title"
      >
        <div className="px-5 py-4 bg-[#3E4F55] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="text-[9px] font-mono tracking-widest text-[#ABA944] uppercase">
              Access &amp; Permissions · {task.id}
            </div>
            <h2 id="share-task-title" className="text-xl font-['Agdasima'] font-bold tracking-tight text-white">
              Share Task
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleShare} className="p-5 space-y-4 font-['Source_Serif_4'] text-[#1F2426]">
          {error && (
            <div className="p-2.5 bg-[#D94F4F]/10 border border-[#D94F4F]/30 text-[#D94F4F] text-xs font-mono rounded">
              {error}
            </div>
          )}

          <div className="p-2.5 bg-[#F7F6F2] rounded-md border border-[rgba(85,105,112,0.12)] text-xs text-[#3D4447]">
            <span className="font-semibold text-[#1F2426]">{task.title}</span>
            <div className="text-[10.5px] font-mono text-[#9BA4A7] mt-0.5">
              Assigned to {task.ownerName} · Due {task.due}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
              Collaborator or Team Group *
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. Mayah Sinclair, engineering-leads, or client@meridian.com"
              className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
              Permission Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Viewer', 'Commenter', 'Editor'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setPermission(lvl)}
                  className={`py-2 px-2 text-xs font-mono rounded border transition-all ${
                    permission === lvl
                      ? 'bg-[#ABA944]/15 border-[#ABA944] text-[#8A8835] font-bold shadow-xs'
                      : 'bg-[#F7F6F2] border-[rgba(85,105,112,0.2)] text-[#556970] hover:bg-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-[#9BA4A7] mt-1.5">
              {permission === 'Viewer' && 'Can inspect the task, acceptance criteria, and linked evidence.'}
              {permission === 'Commenter' && 'Can add review notes, feedback threads, and ask questions.'}
              {permission === 'Editor' && 'Can attach evidence, update criteria status, and resolve subtasks.'}
            </p>
          </div>

          <div className="pt-2 border-t border-[rgba(85,105,112,0.12)] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-1.5 px-2 bg-[#F7F6F2] hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.2)] text-[#556970] text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#3B6D11]" /> : <Link2 className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied' : 'Copy task link'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onRequestAccess(task.id);
                  onClose();
                }}
                className="py-1.5 px-3 bg-[#F7F6F2] hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.2)] text-[#556970] text-xs font-mono rounded flex items-center gap-1.5 transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                Request access
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-base tracking-wide rounded font-bold transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <Send className="w-4 h-4 text-[#ABA944]" />
              Share and notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
