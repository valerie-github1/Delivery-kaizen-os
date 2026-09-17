import React, { useState } from 'react';
import { Task, TaskPriority } from '../types';
import { Sparkles, X, ArrowRight, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

interface AskKairosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanAccepted: (newTask: Partial<Task>) => void;
  onSaveDraft: (draftTitle: string) => void;
}

export const AskKairosModal: React.FC<AskKairosModalProps> = ({
  isOpen,
  onClose,
  onPlanAccepted,
  onSaveDraft
}) => {
  if (!isOpen) return null;

  const [outcome, setOutcome] = useState('');
  const [project, setProject] = useState('Kaizen.os');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [owner, setOwner] = useState('VW');
  const [due, setDue] = useState('2026-08-07');
  const [step, setStep] = useState<'input' | 'proposal'>('input');
  const [error, setError] = useState('');

  const ownerNames: Record<string, string> = {
    VW: 'Valerie Wilcox',
    PO: 'Precious Okafor',
    MS: 'Mayah Sinclair',
    GS: 'George Stavros'
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcome.trim()) {
      setError('Please describe an outcome or goal before preparing a plan.');
      return;
    }
    setError('');
    setStep('proposal');
  };

  const handleAccept = () => {
    const nextId = 'PAI-DEL-' + Math.floor(100 + Math.random() * 900);
    onPlanAccepted({
      id: nextId,
      title: outcome.trim(),
      status: 'todo',
      priority,
      due: 'Aug 7',
      dueDateStr: due,
      owner,
      ownerName: ownerNames[owner] || 'Valerie Wilcox',
      signal: 'Kairos plan accepted · ready to execute',
      type: 'agent',
      project,
      desc: `Autonomous contract prepared by Kairos from outcome: "${outcome.trim()}". Only safe internal operations will execute without explicit human checkpoint.`,
      accept: [
        'Clarify the outcome and assemble working context',
        'Prepare the first safe action and link supporting evidence',
        'Run acceptance check and return to human checkpoint'
      ],
      evidence: ['Kairos plan contract · draft.md'],
      subtasks: [
        { title: 'Assemble contextual documents and dependencies', done: false },
        { title: 'Execute internal verification checks', done: false },
        { title: 'Submit for Super Admin approval', done: false }
      ]
    });
    setOutcome('');
    setStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-white border border-[rgba(85,105,112,0.22)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-kairos-title"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#3E4F55] text-white flex items-start justify-between border-b border-white/10">
          <div>
            <div className="text-[9px] font-mono tracking-widest text-[#ABA944] uppercase flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-[#ABA944]" />
              {step === 'input' ? 'Ask Kairos' : 'Kairos Proposal · Human Review'}
            </div>
            <h2 id="ask-kairos-title" className="text-2xl font-['Agdasima'] font-bold tracking-tight text-white leading-tight">
              {step === 'input' ? 'Turn intent into a delivery plan.' : 'Plan ready for review.'}
            </h2>
            <p className="text-xs text-white/70 font-['Source_Serif_4'] mt-0.5">
              {step === 'input'
                ? 'Describe the outcome. Kairos will prepare the task contract and flag decisions.'
                : 'Kairos has prepared the work contract; no task is committed until you choose an action.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleGeneratePlan} className="p-6 space-y-4 font-['Source_Serif_4'] text-[#1F2426]">
            {error && (
              <div className="p-2.5 bg-[#D94F4F]/10 border border-[#D94F4F]/30 text-[#D94F4F] text-xs font-mono rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1.5 font-semibold">
                What outcome do you need? *
              </label>
              <textarea
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="e.g. Prepare a review bundle for the Employee Handbook policy..."
                rows={3}
                className="w-full text-xs p-3 border border-[rgba(85,105,112,0.22)] rounded-md bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970] resize-none"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Project
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
                >
                  <option>Kaizen.os</option>
                  <option>Onboarding</option>
                  <option>Client delivery</option>
                  <option>People policies</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="med">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Owner
                </label>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
                >
                  <option value="VW">Valerie Wilcox (Super Admin)</option>
                  <option value="PO">Precious Okafor</option>
                  <option value="MS">Mayah Sinclair</option>
                  <option value="GS">George Stavros</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Due Date
                </label>
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full text-xs p-2 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-mono text-[#556970] hover:bg-[#EFF0EA] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg tracking-wide rounded font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#ABA944]" />
                Prepare plan
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4 font-['Source_Serif_4'] text-[#1F2426]">
            {/* Proposal contract details */}
            <div className="flex flex-wrap gap-2 text-[10.5px] font-mono">
              <span className="px-2 py-0.5 rounded bg-[#ABA944]/15 text-[#8A8835] font-semibold">{project}</span>
              <span className="px-2 py-0.5 rounded bg-[#F7F6F2] border border-[rgba(85,105,112,0.2)] text-[#556970]">
                Priority: {priority.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F7F6F2] border border-[rgba(85,105,112,0.2)] text-[#556970]">
                Owner: {ownerNames[owner]}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#F7F6F2] border border-[rgba(85,105,112,0.2)] text-[#556970]">
                Target: {due}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-[rgba(85,105,112,0.18)] rounded-md space-y-2.5">
                <div className="text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold tracking-wider">
                  Proposed Task Contract
                </div>
                <h3 className="text-base font-['Agdasima'] font-bold text-[#1F2426] leading-tight">
                  {outcome}
                </h3>
                <p className="text-xs text-[#6B7477]">
                  Kairos will prepare the work context, execute only safe internal steps, and return the result for a human checkpoint.
                </p>

                <div className="space-y-1.5 pt-1 text-xs border-t border-[rgba(85,105,112,0.1)]">
                  <div className="flex items-center gap-2">
                    <b className="font-mono text-[#8A8835] text-[10px]">01</b>
                    <span>Clarify the outcome and assemble the working context</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <b className="font-mono text-[#8A8835] text-[10px]">02</b>
                    <span>Prepare the first safe action and link supporting evidence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <b className="font-mono text-[#8A8835] text-[10px]">03</b>
                    <span>Run the acceptance check and return to human checkpoint</span>
                  </div>
                </div>

                <div className="text-[9.5px] font-mono text-[#9BA4A7] pt-2 border-t border-[rgba(85,105,112,0.08)]">
                  Prepared by Kairos · confidence 86% · draft · not committed
                </div>
              </div>

              <div className="p-3.5 bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] rounded-md space-y-3">
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#556970] font-semibold tracking-wider mb-1">
                    Acceptance Criteria
                  </div>
                  <div className="space-y-1 text-xs text-[#3D4447]">
                    <div>✓ Evidence is linked and auditable in Files</div>
                    <div>✓ Delivery decision and provenance are recorded</div>
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-mono uppercase text-[#D94F4F] font-semibold tracking-wider mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-[#D94F4F]" />
                    Risk and Boundary
                  </div>
                  <div className="p-2 bg-[#FBF4E7] border-l-2 border-[#ABA944] text-[11px] text-[#82663B] leading-snug rounded-r">
                    No external communication or irreversible change will happen without your approval.
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-mono uppercase text-[#556970] font-semibold tracking-wider mb-1">
                    Human Checkpoint
                  </div>
                  <p className="text-[11px] text-[#6B7477]">
                    Valerie Wilcox reviews the evidence before this item can move to Done.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onSaveDraft(outcome);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-mono text-[#556970] hover:bg-[#EFF0EA] rounded transition-colors"
              >
                Save draft
              </button>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-3 py-1.5 text-xs font-mono text-[#556970] bg-[#EFF0EA] hover:bg-[#D6D5C8] rounded transition-colors"
              >
                Edit plan
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg tracking-wide rounded font-bold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#ABA944]" />
                Accept plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
