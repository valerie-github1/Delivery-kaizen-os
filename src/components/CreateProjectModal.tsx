import React, { useState } from 'react';
import { Project, Portfolio } from '../types';
import { X, FolderPlus, Sparkles } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
  onCreateProject: (project: Partial<Project>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  portfolios,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [portfolioId, setPortfolioId] = useState(portfolios[0]?.id || 'port-1');
  const [desc, setDesc] = useState('');
  const [owner, setOwner] = useState('Valerie Wilcox');
  const [dates, setDates] = useState('Sep 15 — Nov 30, 2026');
  const [color, setColor] = useState('#556970');

  if (!isOpen) return null;

  const colorOptions = [
    '#3E4F55', '#6B5B95', '#D94F4F', '#ABA944', '#6DBB7A', 
    '#E57A3C', '#556970', '#3B6D11', '#8A8835', '#4A90E2'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedCode = code.trim() || name.substring(0, 3).toUpperCase();
    onCreateProject({
      id: 'PRJ-' + Date.now().toString(36).toUpperCase(),
      name: name.trim(),
      code: generatedCode,
      status: 'active',
      owner,
      dates,
      desc: desc.trim() || 'Strategic product initiative.',
      progress: 0,
      openTasks: 0,
      blockers: 0,
      evidenceLinked: 0,
      team: ['VW'],
      portfolioId,
      color,
      health: 'On track'
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
              <FolderPlus className="w-4 h-4 text-[#ABA944]" />
            </div>
            <div>
              <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">Create Project</h2>
              <p className="text-[11px] font-mono text-[#6B7477]">Add a delivery initiative to your workspace</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#9BA4A7] hover:text-[#1F2426] hover:bg-[#EFF0EA]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!code) setCode(e.target.value.substring(0, 3).toUpperCase());
              }}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              placeholder="e.g. NVIDIA NIM Gateway"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                Project Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
                placeholder="e.g. NIM"
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                Portfolio Group
              </label>
              <select
                value={portfolioId}
                onChange={(e) => setPortfolioId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs font-['Source_Serif_4'] bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              placeholder="Brief summary of mission and milestones..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                Project Owner
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
                Dates
              </label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
              Accent Color
            </label>
            <div className="flex gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-[#556970]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8835]">
              <Sparkles className="w-3 h-3" />
              Auto-creates initial sprint contract
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
                Create Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
