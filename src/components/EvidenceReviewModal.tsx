import React, { useState, useEffect } from 'react';
import { Task, CriterionState } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, FileText, ArrowLeft, MessageSquare, ShieldAlert, Sparkles, X } from 'lucide-react';

interface EvidenceReviewModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onVerifyEvidence: (taskId: string) => void;
  onRequestChanges: (taskId: string, reason: string) => void;
  onAddComment: (taskId: string, comment: string) => void;
  onReturnToTask: (taskId: string) => void;
  onUpdateCriterionState?: (taskId: string, index: number, newState: CriterionState) => void;
}

export const EvidenceReviewModal: React.FC<EvidenceReviewModalProps> = ({
  isOpen,
  task,
  onClose,
  onVerifyEvidence,
  onRequestChanges,
  onAddComment,
  onReturnToTask,
  onUpdateCriterionState
}) => {
  if (!isOpen || !task) return null;

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [composerMode, setComposerMode] = useState<'none' | 'change' | 'comment'>('none');
  const [selectedFileConfirmation, setSelectedFileConfirmation] = useState<string | null>(null);

  // Criteria states local or from task
  const criteriaStates: CriterionState[] = task.accept.map((_, i) => {
    if (task.criteriaStates && task.criteriaStates[i]) {
      return task.criteriaStates[i];
    }
    return i === 0 ? 'verified' : (task.evidence.length > 0 ? 'review' : 'missing');
  });

  const allVerified = criteriaStates.length > 0 && criteriaStates.every(s => s === 'verified');
  const hasMissing = criteriaStates.some(s => s === 'missing');
  const hasReview = criteriaStates.some(s => s === 'review');

  const overallState: 'verified' | 'review' | 'missing' = allVerified
    ? 'verified'
    : hasMissing
    ? 'missing'
    : 'review';

  const overallStateLabel = allVerified
    ? 'Verified'
    : hasMissing
    ? 'Missing evidence'
    : 'Needs review';

  const files = task.evidence.length > 0 ? task.evidence : ['Evidence package pending'];
  const activeFile = files[Math.min(activeFileIndex, files.length - 1)];

  const handleSelectFile = (index: number) => {
    setActiveFileIndex(index);
    const fileName = files[index];
    setSelectedFileConfirmation(`Preview switched to: ${fileName}`);
    setTimeout(() => setSelectedFileConfirmation(null), 2500);
  };

  const handleVerify = () => {
    onVerifyEvidence(task.id);
  };

  const handleSaveComposer = () => {
    if (!commentText.trim()) return;
    if (composerMode === 'change') {
      onRequestChanges(task.id, commentText.trim());
    } else if (composerMode === 'comment') {
      onAddComment(task.id, commentText.trim());
    }
    setCommentText('');
    setComposerMode('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-[#1F2426]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-white border border-[rgba(85,105,112,0.22)] rounded-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-review-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#3E4F55] text-white border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onReturnToTask(task.id)}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              title="Return to task drawer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[9px] font-mono tracking-widest uppercase text-[#ABA944]">
                Evidence Review &amp; Verification
              </div>
              <h2 id="evidence-review-title" className="text-xl font-['Agdasima'] font-bold tracking-tight text-white leading-tight">
                {task.id} — {task.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide ${
              overallState === 'verified'
                ? 'bg-[#6DBB7A]/20 text-[#3B6D11] border border-[#6DBB7A]/40'
                : overallState === 'missing'
                ? 'bg-[#D94F4F]/20 text-[#D94F4F] border border-[#D94F4F]/30'
                : 'bg-[#ABA944]/20 text-[#8A8835] border border-[#ABA944]/40'
            }`}>
              {overallState === 'verified' && <CheckCircle2 className="w-3 h-3" />}
              {overallState === 'review' && <AlertTriangle className="w-3 h-3" />}
              {overallState === 'missing' && <AlertCircle className="w-3 h-3" />}
              {overallStateLabel}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto bg-[#F7F6F2]">
          {/* File Preview Panel (Left, 7 cols) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[rgba(85,105,112,0.15)] bg-[#EFF0EA]/40">
            {/* File Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(85,105,112,0.12)] bg-white/70">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#556970]" />
                <div>
                  <h3 className="text-sm font-['Agdasima'] font-bold text-[#1F2426]">
                    {activeFile}
                  </h3>
                  <p className="text-[10px] font-mono text-[#9BA4A7]">
                    Version pinned to {task.id} · {task.project || 'Kaizen.os'}
                  </p>
                </div>
              </div>
              {selectedFileConfirmation && (
                <span className="text-[10px] font-mono text-[#3B6D11] bg-[#6DBB7A]/15 px-2 py-0.5 rounded-md animate-pulse">
                  {selectedFileConfirmation}
                </span>
              )}
            </div>

            {/* Document Preview Canvas */}
            <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
              <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-sm border border-[rgba(85,105,112,0.14)] relative font-['Source_Serif_4'] text-[#3D4447]">
                <div className="absolute top-4 right-4 text-[9px] font-mono font-semibold tracking-widest text-[#9BA4A7] uppercase border border-[rgba(85,105,112,0.2)] px-2 py-0.5 rounded bg-[#F7F6F2]">
                  EVIDENCE COPY
                </div>
                
                <h4 className="text-xl font-['Agdasima'] font-bold text-[#3E4F55] mb-2 pr-28">
                  {activeFile.replace(/\.(md|docx|pdf|fig)$/i, '')}
                </h4>
                
                <div className="h-px bg-[rgba(85,105,112,0.12)] my-3" />

                <div className="text-xs space-y-3 leading-relaxed">
                  <p className="font-semibold text-[#1F2426]">
                    Associated Delivery Item: <span className="font-mono text-[11px] text-[#556970]">{task.id}</span> — {task.title}
                  </p>
                  
                  <p>
                    This artifact serves as the verifiable evidence payload evaluated by Kairos and submitted for human quality sign-off.
                  </p>

                  <div className="p-3 bg-[#F7F6F2] rounded-md border border-[rgba(85,105,112,0.1)] text-[11.5px] font-mono space-y-1.5 text-[#3D4447]">
                    <div className="text-[10px] font-bold text-[#8A8835] uppercase tracking-wide">
                      Artifact Metadata
                    </div>
                    <div>Source: repository://kaizen/delivery/{task.id}/{activeFile}</div>
                    <div>Digest: sha256:7f8a91c0b...validated</div>
                    <div>Committed by: {task.ownerName} ({task.owner})</div>
                    <div>Timestamp: {task.due} · Sprint 12 Context</div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono uppercase font-bold text-[#556970]">
                      Evidence Extract
                    </div>
                    <div className="p-3 bg-white border-l-2 border-[#ABA944] rounded-r text-[12px] italic text-[#1F2426]/90 space-y-1.5 bg-[#EFF0EA]/30">
                      <div>✓ Triple-breakpoint testing passes 1440px desktop, 768px tablet, 375px mobile viewport constraints.</div>
                      <div>✓ Staff tab state transitions verified with role-based claim matrix.</div>
                      <div>• Client INVITE_REQUIRED fallback verified in staging simulator with CRM stub.</div>
                      <div>• WCAG AA 4.5:1 contrast score verified for all interactive buttons.</div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-[#9BA4A7] flex items-center justify-between border-t border-[rgba(85,105,112,0.08)]">
                    <span>Authenticity sealed by Kairos Executor</span>
                    <span>Page 1 of 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Chips */}
            <div className="p-3 bg-white border-t border-[rgba(85,105,112,0.12)] flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-[#9BA4A7] uppercase mr-1">
                Artifacts ({files.length}):
              </span>
              {files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectFile(idx)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono transition-all ${
                    activeFileIndex === idx
                      ? 'bg-[#ABA944]/15 border border-[#ABA944] text-[#8A8835] font-semibold shadow-xs'
                      : 'bg-[#EFF0EA] border border-[rgba(85,105,112,0.15)] text-[#556970] hover:bg-white hover:border-[#7A9098]'
                  }`}
                >
                  <span>▣</span>
                  <span>{file}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Verification Inspector (Right, 5 cols) */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between bg-white overflow-y-auto">
            <div className="space-y-4">
              <div>
                <div className="text-[9px] font-mono tracking-widest text-[#9BA4A7] uppercase mb-1">
                  Human Quality Gate
                </div>
                <h3 className="text-xl font-['Agdasima'] font-bold text-[#1F2426]">
                  Verification Record &amp; Provenance
                </h3>
                <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] mt-1">
                  Kairos compares the artifact with the formal task contract. Evidence with unresolved criteria requires human verification to complete.
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] rounded-md">
                  <span className="block text-[9px] font-mono text-[#9BA4A7] uppercase">Task Ref</span>
                  <b className="font-mono text-xs text-[#1F2426]">{task.id}</b>
                </div>
                <div className="p-2.5 bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] rounded-md">
                  <span className="block text-[9px] font-mono text-[#9BA4A7] uppercase">Owner</span>
                  <b className="text-xs text-[#1F2426]">{task.ownerName}</b>
                </div>
                <div className="p-2.5 bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] rounded-md">
                  <span className="block text-[9px] font-mono text-[#9BA4A7] uppercase">Producer</span>
                  <b className="text-xs text-[#1F2426]">
                    {task.type === 'agent' ? 'Kairos · Executor' : 'Valerie · Super Admin'}
                  </b>
                </div>
                <div className="p-2.5 bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] rounded-md">
                  <span className="block text-[9px] font-mono text-[#9BA4A7] uppercase">Confidence</span>
                  <b className={`text-xs ${hasMissing ? 'text-[#D94F4F]' : 'text-[#3B6D11]'}`}>
                    {hasMissing ? '62% · incomplete' : '86% · reviewable'}
                  </b>
                </div>
              </div>

              {/* Acceptance Criteria List */}
              <div className="border-t border-[rgba(85,105,112,0.12)] pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#556970] uppercase">
                    Acceptance Criteria ({task.accept.length})
                  </span>
                  <span className="text-[9px] font-mono text-[#9BA4A7]">
                    Click status to cycle state
                  </span>
                </div>

                <div className="space-y-2">
                  {task.accept.map((criterion, idx) => {
                    const st = criteriaStates[idx] || 'review';
                    return (
                      <div 
                        key={idx}
                        className="p-3 bg-[#F7F6F2] border border-[rgba(85,105,112,0.1)] rounded-md flex items-start justify-between gap-2.5 hover:border-[rgba(85,105,112,0.25)] transition-colors"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                            st === 'verified'
                              ? 'bg-[#6DBB7A]/20 text-[#3B6D11]'
                              : st === 'missing'
                              ? 'bg-[#D94F4F]/15 text-[#D94F4F]'
                              : 'bg-[#ABA944]/20 text-[#8A8835]'
                          }`}>
                            {st === 'verified' ? '✓' : st === 'missing' ? '!' : '~'}
                          </span>
                          <div>
                            <strong className="block text-xs font-['Source_Serif_4'] text-[#1F2426] leading-snug font-semibold">
                              {criterion}
                            </strong>
                            <small className="block text-[10px] font-mono text-[#9BA4A7] mt-0.5">
                              {st === 'verified'
                                ? 'Kairos check passed · evidence supports this criterion.'
                                : st === 'missing'
                                ? 'No supporting artifact is linked yet.'
                                : 'Human review required before acceptance.'}
                            </small>
                          </div>
                        </div>

                        {/* Interactive toggle for criterion state */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onUpdateCriterionState) {
                              const nextState: CriterionState = 
                                st === 'review' ? 'verified' : st === 'verified' ? 'missing' : 'review';
                              onUpdateCriterionState(task.id, idx, nextState);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wide uppercase shrink-0 transition-colors ${
                            st === 'verified'
                              ? 'bg-[#6DBB7A]/20 text-[#3B6D11] hover:bg-[#6DBB7A]/30'
                              : st === 'missing'
                              ? 'bg-[#D94F4F]/15 text-[#D94F4F] hover:bg-[#D94F4F]/25'
                              : 'bg-[#ABA944]/20 text-[#8A8835] hover:bg-[#ABA944]/30'
                          }`}
                          title="Click to toggle status (Needs review -> Verified -> Missing)"
                        >
                          {st === 'verified' ? 'Verified' : st === 'missing' ? 'Missing' : 'Needs review'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kairos Verification Note */}
              <div className="p-3 bg-[#ABA944]/10 border-l-3 border-[#ABA944] rounded-r-md text-[11px] font-mono text-[#8A8835] leading-relaxed flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#ABA944]" />
                <div>
                  {allVerified
                    ? 'All criteria are supported. Verify evidence to complete the quality gate and advance task to Done.'
                    : hasMissing
                    ? 'Evidence is incomplete. Missing artifacts must be attached or changes requested before approval.'
                    : 'Kairos detected supporting evidence, but an explicit human review is required before marking Done.'}
                </div>
              </div>

              {/* Review Comment Composer (if opened) */}
              {composerMode !== 'none' && (
                <div className="p-3 bg-[#F7F6F2] border border-[rgba(85,105,112,0.2)] rounded-md space-y-2 animate-in fade-in duration-150">
                  <div className="text-[10px] font-mono uppercase font-bold text-[#556970]">
                    {composerMode === 'change' ? 'Request Changes Reason' : 'Add Review Comment'}
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={
                      composerMode === 'change'
                        ? 'Describe what must change before this evidence can be verified...'
                        : 'Add a review note for task owner and Kairos...'
                    }
                    className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.25)] rounded bg-white font-['Source_Serif_4'] text-[#1F2426] focus:outline-none focus:border-[#556970] min-h-[70px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setComposerMode('none');
                        setCommentText('');
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono text-[#556970] bg-white border border-[rgba(85,105,112,0.2)] rounded hover:bg-[#F7F6F2]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveComposer}
                      className="px-3 py-1 text-[10px] font-mono text-white bg-[#556970] rounded hover:bg-[#3E4F55] font-semibold"
                    >
                      {composerMode === 'change' ? 'Submit Change Request' : 'Save Comment'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[rgba(85,105,112,0.12)] space-y-3 mt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleVerify}
                  className="flex-1 px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-base tracking-wide rounded-md transition-colors font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ABA944]" />
                  Verify evidence
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setComposerMode('change');
                    setCommentText('');
                  }}
                  className="px-3 py-2 bg-white hover:bg-[#F7F6F2] border border-[rgba(85,105,112,0.25)] text-[#1F2426] text-xs font-mono rounded-md transition-colors"
                >
                  Request changes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setComposerMode('comment');
                    setCommentText('');
                  }}
                  className="px-3 py-2 bg-white hover:bg-[#F7F6F2] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded-md transition-colors"
                >
                  Add comment
                </button>

                <button
                  type="button"
                  onClick={() => onReturnToTask(task.id)}
                  className="px-3 py-2 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#3D4447] text-xs font-mono rounded-md transition-colors"
                >
                  Return to task
                </button>
              </div>

              <div className="text-[9.5px] font-mono text-[#9BA4A7] leading-relaxed border-t border-[rgba(85,105,112,0.08)] pt-2 flex items-center justify-between">
                <span>Audit trail · Kairos verification · Human approval gate</span>
                <span>Context pinned to {task.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
