import React, { useState } from 'react';
import { Portfolio, Project } from '../types';
import { X, Briefcase, Sparkles } from 'lucide-react';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreatePortfolio: (portfolio: Portfolio) => void;
}

export const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({
  isOpen,
  onClose,
  projects,
  onCreatePortfolio
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('Valerie Wilcox');
  const [dates, setDates] = useState('Sep 01, 2026 — Mar 31, 2027');
  const [status, setStatus] = useState<'On track' | 'At risk' | 'Off track'>('On track');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreatePortfolio({
      id: 'port-' + Date.now().toString(36),
      name: name.trim(),
      description: description.trim() || 'Multi-project delivery portfolio.',
      owner,
      status,
      projectIds: selectedProjectIds,
      progress: 0,
      dates
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-[#1F2426]/40 backdrop-blur-2xs" />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-[rgba(85,105,112,0.18)] w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[rgba(85,105,112,0.12)] bg-[#F7F6F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#556970] text-white flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#ABA944]" />
            </div>
            <div>
              <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">New Portfolio</h2>
              <p className="text-[11px] font-mono text-[#6B7477]">Multi-project roll-up &amp; executive governance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#9BA4A7] hover:text-[#1F2426] hover:bg-[#EFF0EA]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Portfolio Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              placeholder="e.g. Q4 Strategic Growth Initiatives"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Executive Objective / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs font-['Source_Serif_4'] bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              placeholder="Summary of portfolio scope and roll-up accountability..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                Portfolio Owner
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                Health Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              >
                <option value="On track">On track</option>
                <option value="At risk">At risk</option>
                <option value="Off track">Off track</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Connect Projects ({selectedProjectIds.length} selected)
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.14)]">
              {projects.map((p) => {
                const isSelected = selectedProjectIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded text-xs font-mono cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#556970]/10 border border-[#556970]/30 font-semibold' : 'bg-white hover:bg-[#EFF0EA]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProject(p.id)}
                        className="accent-[#556970]"
                      />
                      <span className="truncate text-[#1F2426]">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-[#9BA4A7] font-mono">{p.code}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8835]">
              <Sparkles className="w-3 h-3" />
              Real-time progress rollup
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-[#556970] hover:bg-[#EFF0EA] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono font-bold rounded-lg shadow-xs"
              >
                Create Portfolio
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
