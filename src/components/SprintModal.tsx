import React, { useState, useEffect } from 'react';
import { Sprint, Task, BacklogItem } from '../types';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Flame, 
  RotateCcw
} from 'lucide-react';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSprint?: Sprint;
  currentSprint?: Sprint;
  allSprints?: Sprint[];
  tasks?: Task[];
  backlog?: BacklogItem[];
  onStartNextSprint?: (config: {
    nextSprintNumber: number;
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
    rolloverTaskIds: string[];
    returnToBacklogTaskIds: string[];
    addedBacklogItemIds: string[];
  }) => void;
  onCompleteSprint?: (
    completedSprintId: string,
    nextSprintData: {
      name: string;
      goal: string;
      startDate: string;
      endDate: string;
      capacityStoryPoints: number;
    },
    rolloverTaskIds: string[],
    returnToBacklogTaskIds: string[],
    addedBacklogItemIds: string[]
  ) => void;
  onSelectSprint?: (sprintId: string) => void;
  onShowToast?: (message: string) => void;
}

export const SprintModal: React.FC<SprintModalProps> = ({
  isOpen,
  onClose,
  activeSprint,
  currentSprint,
  allSprints = [],
  tasks = [],
  backlog = [],
  onStartNextSprint,
  onCompleteSprint,
  onSelectSprint,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'advance' | 'history'>('advance');

  // Safe sprint resolution with robust fallback
  const sprint: Sprint = activeSprint || currentSprint || {
    id: 'sprint-12',
    number: 12,
    name: 'Sprint 12',
    goal: 'Active delivery cycle',
    status: 'active',
    startDate: '2026-09-03',
    endDate: '2026-09-17'
  };

  const sprintNumber = typeof sprint?.number === 'number' ? sprint.number : 12;
  const nextNum = sprintNumber + 1;

  const [nextName, setNextName] = useState(`Sprint ${nextNum}`);
  const [nextGoal, setNextGoal] = useState(
    'Production NIM execution, multi-agent autonomous stage-gates & portfolio reporting'
  );
  const [durationWeeks, setDurationWeeks] = useState(2);

  // Compute default dates
  const today = new Date();
  const nextStart = new Date(today.getTime() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const nextEnd = new Date(today.getTime() + (durationWeeks * 7 + 1) * 24 * 3600 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(nextStart);
  const [endDate, setEndDate] = useState(nextEnd);

  // Update dates or names when sprint changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setNextName(`Sprint ${nextNum}`);
      const t = new Date();
      const s = new Date(t.getTime() + 24 * 3600 * 1000).toISOString().split('T')[0];
      const e = new Date(t.getTime() + (durationWeeks * 7 + 1) * 24 * 3600 * 1000).toISOString().split('T')[0];
      setStartDate(s);
      setEndDate(e);
    }
  }, [isOpen, sprint.id, nextNum, durationWeeks]);

  // Task rollover choice
  const incompleteTasks = (tasks || []).filter((t) => t.status !== 'done');
  const completedTasks = (tasks || []).filter((t) => t.status === 'done');

  const [rolloverAction, setRolloverAction] = useState<'rollover' | 'backlog'>('rollover');
  const [selectedBacklogIds, setSelectedBacklogIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleDurationChange = (weeks: number) => {
    setDurationWeeks(weeks);
    const end = new Date(new Date(startDate).getTime() + weeks * 7 * 24 * 3600 * 1000).toISOString().split('T')[0];
    setEndDate(end);
  };

  const toggleBacklogItem = (id: string) => {
    setSelectedBacklogIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdvance = () => {
    const finalName = nextName.trim() || `Sprint ${nextNum}`;
    const finalGoal = nextGoal.trim();
    const rolloverIds = rolloverAction === 'rollover' ? incompleteTasks.map((t) => t.id) : [];
    const returnIds = rolloverAction === 'backlog' ? incompleteTasks.map((t) => t.id) : [];

    if (onCompleteSprint) {
      onCompleteSprint(
        sprint.id,
        {
          name: finalName,
          goal: finalGoal,
          startDate,
          endDate,
          capacityStoryPoints: 30
        },
        rolloverIds,
        returnIds,
        selectedBacklogIds
      );
    } else if (onStartNextSprint) {
      onStartNextSprint({
        nextSprintNumber: nextNum,
        name: finalName,
        goal: finalGoal,
        startDate,
        endDate,
        rolloverTaskIds: rolloverIds,
        returnToBacklogTaskIds: returnIds,
        addedBacklogItemIds: selectedBacklogIds
      });
    }

    if (onShowToast) {
      onShowToast(`Completed ${sprint.name} and started ${finalName}`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#1F2426]/40 backdrop-blur-2xs transition-opacity" 
      />

      {/* Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl shadow-2xl border border-[rgba(85,105,112,0.18)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[rgba(85,105,112,0.12)] bg-[#F7F6F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#556970] text-white flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#ABA944]" />
            </div>
            <div>
              <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426] leading-tight">
                Sprint Lifecycle &amp; Transition
              </h2>
              <p className="text-[11px] font-mono text-[#6B7477]">
                Active: {sprint.name} · Completed: {completedTasks.length} · Incomplete: {incompleteTasks.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#EFF0EA] p-0.5 rounded-lg flex text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('advance')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'advance' 
                    ? 'bg-white text-[#1F2426] font-semibold shadow-2xs' 
                    : 'text-[#9BA4A7] hover:text-[#1F2426]'
                }`}
              >
                Start Next Sprint
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'history' 
                    ? 'bg-white text-[#1F2426] font-semibold shadow-2xs' 
                    : 'text-[#9BA4A7] hover:text-[#1F2426]'
                }`}
              >
                All Sprints
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[#9BA4A7] hover:text-[#1F2426] hover:bg-[#EFF0EA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'advance' ? (
            <>
              {/* Sprint 12 Summary Banner */}
              <div className="p-4 rounded-xl bg-[#EFF0EA] border border-[rgba(85,105,112,0.14)] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#3D4447]">Closing {sprint.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#6DBB7A]/20 text-[#3B6D11] font-bold text-[10px]">
                    {Math.round((completedTasks.length / (tasks.length || 1)) * 100)}% Delivered
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-[rgba(85,105,112,0.1)] flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#6DBB7A]" />
                    <div>
                      <span className="block text-lg font-bold font-mono text-[#1F2426]">{completedTasks.length}</span>
                      <span className="text-[10px] font-mono text-[#9BA4A7] uppercase">Completed Tasks</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[rgba(85,105,112,0.1)] flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-[#8A8835]" />
                    <div>
                      <span className="block text-lg font-bold font-mono text-[#1F2426]">{incompleteTasks.length}</span>
                      <span className="text-[10px] font-mono text-[#9BA4A7] uppercase">Incomplete Tasks</span>
                    </div>
                  </div>
                </div>

                {/* Rollover rule */}
                {incompleteTasks.length > 0 && (
                  <div className="pt-2 border-t border-[rgba(85,105,112,0.1)]">
                    <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-2">
                      Incomplete task rollover strategy:
                    </label>
                    <div className="flex gap-4 text-xs font-mono">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rollover"
                          checked={rolloverAction === 'rollover'}
                          onChange={() => setRolloverAction('rollover')}
                          className="accent-[#556970]"
                        />
                        <span>Move {incompleteTasks.length} tasks to {nextName}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rollover"
                          checked={rolloverAction === 'backlog'}
                          onChange={() => setRolloverAction('backlog')}
                          className="accent-[#556970]"
                        />
                        <span>Return to Backlog</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Sprint Configuration Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-[#556970] font-semibold tracking-wider uppercase">
                  <Target className="w-4 h-4 text-[#ABA944]" />
                  <span>Configure {nextName}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                      Sprint Name
                    </label>
                    <input
                      type="text"
                      value={nextName}
                      onChange={(e) => setNextName(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
                      placeholder="e.g. Sprint 13"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                      Duration
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handleDurationChange(w)}
                          className={`flex-1 py-2 text-xs font-mono rounded-lg border transition-colors ${
                            durationWeeks === w
                              ? 'bg-[#556970] text-white font-bold border-[#556970]'
                              : 'bg-white text-[#556970] border-[rgba(85,105,112,0.2)] hover:bg-[#EFF0EA]'
                          }`}
                        >
                          {w} {w === 1 ? 'Week' : 'Weeks'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-1">
                    Sprint Goal / Consequential Objective
                  </label>
                  <textarea
                    rows={2}
                    value={nextGoal}
                    onChange={(e) => setNextGoal(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-['Source_Serif_4'] bg-white border border-[rgba(85,105,112,0.2)] rounded-lg focus:outline-none focus:border-[#556970]"
                    placeholder="Describe the primary mission and outcome of this sprint..."
                  />
                </div>

                {/* Pull from Backlog */}
                {backlog.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[rgba(85,105,112,0.12)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold">
                        Pull items from Backlog into {nextName} ({selectedBacklogIds.length} selected):
                      </span>
                      <span className="text-[10px] font-mono text-[#8A8835]">
                        Kairos recommendations ready
                      </span>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.12)]">
                      {backlog.map((item) => {
                        const isChecked = selectedBacklogIds.includes(item.id);
                        return (
                          <label
                            key={item.id}
                            className={`flex items-center justify-between p-2 rounded text-xs font-mono transition-colors cursor-pointer ${
                              isChecked ? 'bg-[#556970]/10 border border-[#556970]/30' : 'bg-white hover:bg-[#EFF0EA]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleBacklogItem(item.id)}
                                className="accent-[#556970]"
                              />
                              <span className="font-semibold text-[#556970]">{item.id}</span>
                              <span className="truncate text-[#1F2426]">{item.title}</span>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ABA944]/20 text-[#8A8835] font-bold">
                              {item.effort}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Sprint History & Switcher */
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold">
                Sprint Timeline &amp; Milestones
              </span>

              {allSprints.map((s) => (
                <div 
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all ${
                    s.id === sprint.id
                      ? 'bg-white border-[#ABA944] ring-2 ring-[#ABA944]/20 shadow-xs'
                      : 'bg-[#EFF0EA] border-[rgba(85,105,112,0.12)] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#1F2426]">{s.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        s.status === 'active' 
                          ? 'bg-[#8A8835]/15 text-[#8A8835]' 
                          : s.status === 'completed'
                          ? 'bg-[#6DBB7A]/20 text-[#3B6D11]'
                          : 'bg-[#556970]/10 text-[#556970]'
                      }`}>
                        {s.status}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-[#9BA4A7]">
                      {s.startDate} → {s.endDate}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] mb-3">
                    {s.goal}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[rgba(85,105,112,0.1)]">
                    <span className="text-[#556970]">
                      Points: {s.completedPoints || 0} / {s.targetPoints || 28}
                    </span>
                    {s.id !== sprint.id && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectSprint?.(s.id);
                          onClose();
                        }}
                        className="text-xs font-mono text-[#556970] hover:text-[#1F2426] font-semibold underline"
                      >
                        Switch to {s.name}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(85,105,112,0.12)] bg-[#F7F6F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A8835]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kairos validates all audit criteria before rollover</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg text-[#556970] hover:bg-[#EFF0EA] transition-colors"
            >
              Cancel
            </button>
            {activeTab === 'advance' ? (
              <button
                type="button"
                onClick={handleAdvance}
                className="px-5 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono font-bold rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Complete {sprint.name} &amp; Start {nextName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('advance')}
                className="px-4 py-2 bg-[#556970] text-white text-xs font-mono font-bold rounded-lg transition-colors"
              >
                Configure Next Sprint
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
