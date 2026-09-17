import React from 'react';
import { Task } from '../types';
import { ShieldCheck, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

interface DecisionRailProps {
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onOpenEvidenceReview: (taskId: string) => void;
  onOpenBacklog: () => void;
  onAcceptTradeoff: () => void;
  onApproveDecision: (taskId: string) => void;
  onShowAgentHistory: () => void;
  onShowToast: (msg: string) => void;
}

export const DecisionRail: React.FC<DecisionRailProps> = ({
  tasks,
  onOpenTask,
  onOpenEvidenceReview,
  onOpenBacklog,
  onAcceptTradeoff,
  onApproveDecision,
  onShowAgentHistory,
  onShowToast
}) => {
  return (
    <aside className="w-full h-full flex flex-col gap-3.5 overflow-y-auto p-4 min-h-0">
      {/* Human checkpoint / Needs your decision */}
      <section className="bg-white border border-[rgba(85,105,112,0.2)] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between bg-[#F7F6F2]">
          <div>
            <div className="text-[8.5px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Human Checkpoint
            </div>
            <h2 className="text-base font-['Agdasima'] font-bold text-[#1F2426]">
              Needs your decision
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D94F4F]/15 text-[#D94F4F]">
            3 open
          </span>
        </div>

        <div className="p-3.5 space-y-3 font-['Source_Serif_4'] text-xs">
          {/* Decision 1: ONB-002 stepper */}
          <div className="pl-3 border-l-2.5 border-[#ABA944] space-y-1.5">
            <h3 className="font-bold text-[#1F2426] leading-snug">
              Approve ONB-002 stepper
            </h3>
            <p className="text-[11px] text-[#6B7477] leading-relaxed">
              All QA evidence is attached. One Staff-tab edge case is waiting for your eyes.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onOpenEvidenceReview('PAI-DEL-006')}
                className="px-2 py-1 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-[10px] font-mono rounded transition-colors"
              >
                Review evidence
              </button>
              <button
                type="button"
                onClick={() => onApproveDecision('PAI-DEL-006')}
                className="px-2.5 py-1 bg-[#556970] hover:bg-[#3E4F55] text-white text-[10px] font-mono rounded font-semibold transition-colors"
              >
                Approve
              </button>
            </div>
          </div>

          {/* Decision 2: Employee handbook */}
          <div className="pl-3 border-l-2.5 border-[#ABA944] space-y-1.5 pt-2 border-t border-[rgba(85,105,112,0.08)]">
            <h3 className="font-bold text-[#1F2426] leading-snug">
              Resolve policy comments
            </h3>
            <p className="text-[11px] text-[#6B7477] leading-relaxed">
              Two comments remain on PAI-POL-001 before the acknowledgement package can be issued.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => onOpenEvidenceReview('PAI-DEL-007')}
                className="px-2 py-1 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-[10px] font-mono rounded transition-colors"
              >
                Open document
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenTask('PAI-DEL-007');
                  onShowToast('Comment thread opened for PAI-DEL-007');
                }}
                className="px-2.5 py-1 bg-[#556970] hover:bg-[#3E4F55] text-white text-[10px] font-mono rounded font-semibold transition-colors"
              >
                View thread
              </button>
            </div>
          </div>

          {/* Decision 3: Sprint 13 trade-off */}
          <div className="pl-3 border-l-2.5 border-[#ABA944] space-y-1.5 pt-2 border-t border-[rgba(85,105,112,0.08)]">
            <h3 className="font-bold text-[#1F2426] leading-snug">
              Choose Sprint 13 trade-off
            </h3>
            <p className="text-[11px] text-[#6B7477] leading-relaxed">
              Kairos recommends Client portal + Context memory. This displaces mobile breakpoint work.
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={onOpenBacklog}
                className="px-2 py-1 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-[10px] font-mono rounded transition-colors"
              >
                Open backlog
              </button>
              <button
                type="button"
                onClick={onAcceptTradeoff}
                className="px-2.5 py-1 bg-[#556970] hover:bg-[#3E4F55] text-white text-[10px] font-mono rounded font-semibold transition-colors"
              >
                Accept plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Agent activity / Kairos is working */}
      <section className="bg-white border border-[rgba(85,105,112,0.2)] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between bg-[#F7F6F2]">
          <div>
            <div className="text-[8.5px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Agent Activity
            </div>
            <h2 className="text-base font-['Agdasima'] font-bold text-[#1F2426]">
              Kairos is working
            </h2>
          </div>
          <button
            type="button"
            onClick={onShowAgentHistory}
            className="text-[10px] font-mono text-[#556970] hover:underline"
          >
            View all
          </button>
        </div>

        <div className="p-3.5 space-y-3 font-mono text-xs">
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded bg-[#ABA944]/20 text-[#8A8835] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-[11px] font-['Source_Serif_4'] text-[#1F2426] truncate">
                  Prepared ONB-002 QA bundle
                </strong>
                <span className="block text-[9.5px] text-[#9BA4A7]">
                  3 checks complete · awaiting approval
                </span>
                <div className="h-1 w-full bg-[#EFF0EA] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#ABA944] rounded-full w-[82%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[rgba(85,105,112,0.08)]">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded bg-[#ABA944]/20 text-[#8A8835] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-[11px] font-['Source_Serif_4'] text-[#1F2426] truncate">
                  Linked handbook evidence
                </strong>
                <span className="block text-[9.5px] text-[#9BA4A7]">
                  2 comments found · owner notified
                </span>
                <div className="h-1 w-full bg-[#EFF0EA] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#ABA944] rounded-full w-[64%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-[rgba(85,105,112,0.08)]">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded bg-[#ABA944]/20 text-[#8A8835] font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                K
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-[11px] font-['Source_Serif_4'] text-[#1F2426] truncate">
                  Forecasted Sprint 13
                </strong>
                <span className="block text-[9.5px] text-[#9BA4A7]">
                  6 tasks scored · 1 trade-off waiting
                </span>
                <div className="h-1 w-full bg-[#EFF0EA] rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-[#ABA944] rounded-full w-[48%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exception queue / Blocked */}
      <section className="bg-white border border-[rgba(85,105,112,0.2)] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between bg-[#F7F6F2]">
          <div>
            <div className="text-[8.5px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Exception Queue
            </div>
            <h2 className="text-base font-['Agdasima'] font-bold text-[#1F2426]">
              Blocked
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D94F4F]/15 text-[#D94F4F]">
            2 risks
          </span>
        </div>

        <div className="p-3.5 space-y-2.5 font-['Source_Serif_4'] text-xs">
          <div className="flex gap-2.5 items-start">
            <div className="w-1 self-stretch rounded-full bg-[#D94F4F] shrink-0" />
            <div>
              <p className="text-[#1F2426] leading-snug font-medium">
                NVIDIA NIM scaffold needs server-side permission
              </p>
              <span className="text-[10px] font-mono text-[#9BA4A7] block mt-0.5">
                Owner George · 1 day blocked ·{' '}
                <button
                  onClick={() => onShowToast('Escalated to Valerie Wilcox')}
                  className="text-[#556970] underline hover:text-[#1F2426]"
                >
                  Escalate
                </button>
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 items-start pt-2 border-t border-[rgba(85,105,112,0.08)]">
            <div className="w-1 self-stretch rounded-full bg-[#8A8835] shrink-0" />
            <div>
              <p className="text-[#1F2426] leading-snug font-medium">
                Policy approval is blocking onboarding send
              </p>
              <span className="text-[10px] font-mono text-[#9BA4A7] block mt-0.5">
                Owner Valerie · decision needed ·{' '}
                <button
                  onClick={onOpenBacklog}
                  className="text-[#556970] underline hover:text-[#1F2426]"
                >
                  Review
                </button>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Trail / Recently Completed */}
      <section className="bg-white border border-[rgba(85,105,112,0.2)] rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between bg-[#F7F6F2]">
          <div>
            <div className="text-[8.5px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Evidence Trail
            </div>
            <h2 className="text-base font-['Agdasima'] font-bold text-[#1F2426]">
              Recently completed
            </h2>
          </div>
        </div>

        <div className="p-3.5 space-y-2 font-['Source_Serif_4'] text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[rgba(85,105,112,0.08)]">
            <span className="text-[#3D4447] truncate pr-2">Pre-acquisition portal flow</span>
            <button
              onClick={() => onOpenEvidenceReview('PAI-DEL-003')}
              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#6DBB7A]/15 text-[#3B6D11] hover:bg-[#6DBB7A]/25 shrink-0 flex items-center gap-1 font-semibold"
            >
              Evidence ✓
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[rgba(85,105,112,0.08)]">
            <span className="text-[#3D4447] truncate pr-2">Sidebar collapsed state</span>
            <button
              onClick={() => onOpenEvidenceReview('PAI-DEL-004')}
              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#6DBB7A]/15 text-[#3B6D11] hover:bg-[#6DBB7A]/25 shrink-0 flex items-center gap-1 font-semibold"
            >
              Evidence ✓
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#3D4447] truncate pr-2">Onboarding walkthrough</span>
            <button
              onClick={() => onOpenEvidenceReview('PAI-DEL-005')}
              className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#6DBB7A]/15 text-[#3B6D11] hover:bg-[#6DBB7A]/25 shrink-0 flex items-center gap-1 font-semibold"
            >
              Evidence ✓
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
};
