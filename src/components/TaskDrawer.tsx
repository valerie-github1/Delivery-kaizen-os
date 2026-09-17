import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { 
  X, 
  Check, 
  CheckCircle2, 
  FilePlus, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Clock, 
  MessageSquare,
  ShieldCheck,
  Send,
  AlertTriangle
} from 'lucide-react';
import { isDueSoon } from '../utils/dateUtils';

interface TaskDrawerProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onOpenEvidenceReview: (taskId: string) => void;
  onOpenAttachEvidence: (taskId: string) => void;
  onOpenShareTask: (taskId: string) => void;
  onApproveCheckpoint: (taskId: string) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  isOpen,
  task,
  onClose,
  onUpdateTask,
  onOpenEvidenceReview,
  onOpenAttachEvidence,
  onOpenShareTask,
  onApproveCheckpoint
}) => {
  if (!isOpen || !task) return null;

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const handleTitleChange = (newTitle: string) => {
    onUpdateTask({ ...task, title: newTitle });
  };

  const handleStatusChange = (status: TaskStatus) => {
    onUpdateTask({ ...task, status });
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    onUpdateTask({ ...task, priority });
  };

  const handleToggleSubtask = (index: number) => {
    if (!task.subtasks) return;
    const nextSubtasks = [...task.subtasks];
    nextSubtasks[index] = { ...nextSubtasks[index], done: !nextSubtasks[index].done };
    onUpdateTask({ ...task, subtasks: nextSubtasks });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    const currentSubtasks = task.subtasks || [];
    const nextSubtasks = [...currentSubtasks, { title: newSubtaskText.trim(), done: false }];
    onUpdateTask({ ...task, subtasks: nextSubtasks });
    setNewSubtaskText('');
    setShowAddSubtask(false);
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const currentComments = task.comments || [];
    const newComment = {
      id: 'c_' + Date.now(),
      author: 'VW',
      avatar: 'VW',
      time: 'Just now',
      text: commentInput.trim()
    };
    onUpdateTask({ ...task, comments: [...currentComments, newComment] });
    setCommentInput('');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#1F2426]/30 backdrop-blur-2xs z-40 transition-opacity duration-200"
      />

      {/* Slide-out Panel */}
      <aside 
        className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-[rgba(85,105,112,0.18)] animate-in slide-in-from-right duration-250 ease-out"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-task-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between shrink-0 bg-[#F7F6F2]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 rounded text-[#9BA4A7] hover:text-[#1F2426] hover:bg-[#EFF0EA] transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-[#556970] font-semibold tracking-wide">
              {task.id}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-[#ABA944]/15 text-[#8A8835] font-medium">
              {task.project || 'Kaizen.os'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.status !== 'done' ? (
              <button
                type="button"
                onClick={() => onApproveCheckpoint(task.id)}
                className="px-3 py-1.5 bg-[#6DBB7A]/15 hover:bg-[#6DBB7A]/25 border border-[#6DBB7A]/40 text-[#3B6D11] text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark complete
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-[#6DBB7A]/20 text-[#3B6D11] text-xs font-mono rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Done
              </span>
            )}
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 font-['Source_Serif_4'] text-[#1F2426]">
          {/* Editable Title */}
          <div>
            <textarea
              id="drawer-task-title"
              value={task.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              rows={2}
              className="w-full text-xl font-bold font-['Source_Serif_4'] text-[#1F2426] border-none focus:outline-none focus:ring-1 focus:ring-[#556970] rounded p-1 resize-none leading-snug"
            />
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.12)] text-xs font-mono">
            <div>
              <span className="block text-[9px] uppercase text-[#9BA4A7] font-semibold mb-1">Status</span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full bg-white border border-[rgba(85,105,112,0.2)] rounded p-1 text-xs text-[#1F2426]"
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] uppercase text-[#9BA4A7] font-semibold mb-1">Priority</span>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                className="w-full bg-white border border-[rgba(85,105,112,0.2)] rounded p-1 text-xs text-[#1F2426]"
              >
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] uppercase text-[#9BA4A7] font-semibold mb-1">Assignee</span>
              <div className="flex items-center gap-1.5 pt-1 text-[#3D4447]">
                <span className="w-5 h-5 rounded-full bg-[#ABA944]/20 text-[#8A8835] font-bold text-[9px] flex items-center justify-center">
                  {task.owner}
                </span>
                <span className="truncate">{task.ownerName.split(' ')[0]}</span>
              </div>
            </div>

            <div>
              <span className="block text-[9px] uppercase text-[#9BA4A7] font-semibold mb-1">Due Date</span>
              <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[#3D4447]">
                  <Clock className="w-3.5 h-3.5 text-[#9BA4A7]" />
                  <input
                    type="date"
                    value={task.dueDateStr || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const d = new Date(val + 'T12:00:00');
                      const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      onUpdateTask({ ...task, dueDateStr: val, due: formatted });
                    }}
                    className="font-mono text-xs bg-[#EFF0EA] border border-[rgba(85,105,112,0.18)] rounded px-1.5 py-0.5 text-[#3D4447] focus:outline-none focus:border-[#556970]"
                  />
                </div>
                {isDueSoon(task.dueDateStr, task.status) && (
                  <span
                    id={`drawer-due-soon-${task.id}`}
                    className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase tracking-wider bg-[#D94F4F]/15 text-[#D94F4F] border border-[#D94F4F]/35 flex items-center gap-1 shrink-0 animate-pulse"
                    title="Due within 48 hours of current system time"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                    Due Soon
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Task Actions: Attach Evidence & Share Task */}
          <div className="flex items-center gap-2 p-2.5 bg-white border border-[rgba(85,105,112,0.18)] rounded-lg">
            <button
              type="button"
              onClick={() => onOpenAttachEvidence(task.id)}
              className="flex-1 py-1.5 px-3 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#3D4447] text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors font-medium"
            >
              <FilePlus className="w-3.5 h-3.5 text-[#556970]" />
              Add evidence
            </button>
            <button
              type="button"
              onClick={() => onOpenShareTask(task.id)}
              className="flex-1 py-1.5 px-3 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#3D4447] text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors font-medium"
            >
              <Share2 className="w-3.5 h-3.5 text-[#556970]" />
              Share task
            </button>
            <button
              type="button"
              onClick={() => onOpenEvidenceReview(task.id)}
              className="py-1.5 px-3 bg-[#ABA944]/15 hover:bg-[#ABA944]/25 text-[#8A8835] text-xs font-mono rounded flex items-center gap-1.5 transition-colors font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open review
            </button>
          </div>

          {/* Objective */}
          <div>
            <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold mb-1.5">
              Objective
            </h3>
            <p className="text-xs text-[#3D4447] leading-relaxed p-3 bg-[#F7F6F2] rounded-md border border-[rgba(85,105,112,0.1)]">
              {task.desc}
            </p>
          </div>

          {/* Acceptance Criteria */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold">
                Acceptance Criteria ({task.accept.length})
              </h3>
              <span className="text-[10px] font-mono text-[#556970]">
                Governed by Kairos
              </span>
            </div>
            <div className="space-y-1.5">
              {task.accept.map((crit, idx) => {
                const isCritVerified = task.criteriaStates?.[idx] === 'verified';
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-2 p-2 bg-[#F7F6F2] rounded border border-[rgba(85,105,112,0.1)] text-xs"
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 mt-0.5 ${
                      isCritVerified ? 'bg-[#6DBB7A]/20 text-[#3B6D11]' : 'bg-[#ABA944]/20 text-[#8A8835]'
                    }`}>
                      {isCritVerified ? '✓' : '~'}
                    </span>
                    <span className={`leading-snug ${isCritVerified ? 'line-through text-[#9BA4A7]' : 'text-[#1F2426]'}`}>
                      {crit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linked Evidence & Artifacts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold">
                Evidence &amp; Artifacts ({task.evidence.length})
              </h3>
              <button
                type="button"
                onClick={() => onOpenAttachEvidence(task.id)}
                className="text-[10px] font-mono text-[#556970] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Link another
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.evidence.map((ev, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpenEvidenceReview(task.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-mono bg-white border border-[rgba(85,105,112,0.22)] text-[#556970] hover:bg-[#F7F6F2] hover:border-[#556970] flex items-center gap-1.5 transition-all shadow-2xs group"
                >
                  <span className="text-[#ABA944]">▣</span>
                  <span>{ev}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#9BA4A7]" />
                </button>
              ))}
              {task.evidence.length === 0 && (
                <span className="text-xs text-[#9BA4A7] italic">No evidence linked yet.</span>
              )}
            </div>
          </div>

          {/* Agent Activity & Checkpoint */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold">
              Agent Activity &amp; Checkpoint
            </h3>
            <div className="p-3 bg-[#ABA944]/10 rounded-md border border-[#ABA944]/30 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded bg-[#8A8835] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                K
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-[#1F2426]">
                  Kairos prepared QA evidence bundle
                </span>
                <p className="text-[11px] text-[#6B7477]">
                  All safe internal steps completed · Confidence 86% · Waiting for human sign-off
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F7F6F2] rounded-md border border-[rgba(85,105,112,0.12)] flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#556970] shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-[#1F2426]">
                  Human Checkpoint: Valerie Wilcox
                </span>
                <p className="text-[11px] text-[#6B7477]">
                  Final verification required before moving to Done.
                </p>
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold">
                Subtasks ({task.subtasks?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() => setShowAddSubtask(true)}
                className="text-[10px] font-mono text-[#556970] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add subtask
              </button>
            </div>
            
            <div className="space-y-1">
              {task.subtasks?.map((st, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleToggleSubtask(idx)}
                  className="flex items-center gap-2.5 py-1 px-2 rounded hover:bg-[#F7F6F2] cursor-pointer transition-colors text-xs"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    st.done 
                      ? 'bg-[#556970] border-[#556970] text-white' 
                      : 'border-[#7A9098] bg-white'
                  }`}>
                    {st.done && <Check className="w-3 h-3" />}
                  </div>
                  <span className={st.done ? 'line-through text-[#9BA4A7]' : 'text-[#1F2426]'}>
                    {st.title}
                  </span>
                </div>
              ))}

              {showAddSubtask && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskText}
                    onChange={(e) => setNewSubtaskText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    placeholder="New subtask title..."
                    className="flex-1 text-xs p-1.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-2.5 py-1.5 bg-[#556970] text-white text-xs font-mono rounded"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubtask(false)}
                    className="px-2 py-1.5 text-xs text-[#9BA4A7] hover:text-[#1F2426]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-[rgba(85,105,112,0.12)] pt-4">
            <h3 className="text-[10px] font-mono tracking-wider uppercase text-[#9BA4A7] font-bold mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Activity &amp; Comments
            </h3>

            <div className="space-y-3 mb-3">
              {task.comments?.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-full bg-[#ABA944]/20 text-[#8A8835] font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {c.avatar}
                  </div>
                  <div className="flex-1 bg-[#F7F6F2] p-2.5 rounded-md border border-[rgba(85,105,112,0.1)]">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#9BA4A7] mb-1">
                      <span className="font-semibold text-[#1F2426]">{c.author}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-xs text-[#3D4447] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ABA944]/20 text-[#8A8835] font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                VW
              </div>
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment or decision note..."
                className="flex-1 text-xs p-2 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddComment}
                className="p-2 bg-[#556970] hover:bg-[#3E4F55] text-white rounded transition-colors"
                title="Post comment"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[rgba(85,105,112,0.12)] bg-[#F7F6F2] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onOpenEvidenceReview(task.id)}
            className="px-3 py-2 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded transition-colors"
          >
            Review Evidence
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-mono text-[#556970] hover:text-[#1F2426]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onApproveCheckpoint(task.id)}
              className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-base tracking-wide rounded font-bold transition-colors"
            >
              Approve Checkpoint
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
