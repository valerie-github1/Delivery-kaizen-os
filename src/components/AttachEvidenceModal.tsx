import React, { useState } from 'react';
import { Task } from '../types';
import { FilePlus, X } from 'lucide-react';

interface AttachEvidenceModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onAttach: (taskId: string, evidenceData: { name: string; url: string; type: string; version: string; description: string }) => void;
}

export const AttachEvidenceModal: React.FC<AttachEvidenceModalProps> = ({
  isOpen,
  task,
  onClose,
  onAttach
}) => {
  if (!isOpen || !task) return null;

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('QA report');
  const [version, setVersion] = useState('1.0');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an evidence name or artifact title.');
      return;
    }
    setError('');
    onAttach(task.id, {
      name: name.trim(),
      url: url.trim() || `internal://kaizen/artifacts/${name.trim()}`,
      type,
      version: version.trim() || '1.0',
      description: description.trim()
    });
    setName('');
    setUrl('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white border border-[rgba(85,105,112,0.22)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="attach-evidence-title"
      >
        <div className="px-5 py-4 bg-[#3E4F55] text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="text-[9px] font-mono tracking-widest text-[#ABA944] uppercase">
              Artifact Attachment · {task.id}
            </div>
            <h2 id="attach-evidence-title" className="text-xl font-['Agdasima'] font-bold tracking-tight text-white">
              Attach Evidence
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-['Source_Serif_4'] text-[#1F2426]">
          {error && (
            <div className="p-2.5 bg-[#D94F4F]/10 border border-[#D94F4F]/30 text-[#D94F4F] text-xs font-mono rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
              Evidence Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website QA report.pdf or ONB-002 verification artifact"
              className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
              >
                <option>QA report</option>
                <option>Design artifact</option>
                <option>Policy</option>
                <option>Agent evidence</option>
                <option>Code audit</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
                className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
              Source Link / Repository URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://, Drive, GitHub, Figma, or internal repo path"
              className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this evidence demonstrate or prove in relation to the acceptance criteria?"
              rows={3}
              className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970] resize-none"
            />
          </div>

          <div className="pt-3 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-mono text-[#556970] hover:bg-[#EFF0EA] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-base tracking-wide rounded font-bold transition-colors flex items-center gap-1.5"
            >
              <FilePlus className="w-4 h-4 text-[#ABA944]" />
              Attach evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
