import React, { useState } from 'react';
import { 
  Task, 
  TaskStatus, 
  BacklogItem, 
  CapacityPerson, 
  ProjectFile 
} from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  FileText, 
  Calendar as CalendarIcon, 
  AlertTriangle,
  ExternalLink,
  Check,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SubtabViewsProps {
  currentTab: string;
  tasks: Task[];
  backlog: BacklogItem[];
  capacity: CapacityPerson[];
  files: ProjectFile[];
  onOpenTask: (taskId: string) => void;
  onOpenEvidenceReview: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
  onPromoteBacklog: (item: BacklogItem) => void;
  onDismissBacklog: (id: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onShowToast: (msg: string) => void;
}

export const SubtabViews: React.FC<SubtabViewsProps> = ({
  currentTab,
  tasks,
  backlog,
  capacity,
  files,
  onOpenTask,
  onOpenEvidenceReview,
  onAddTask,
  onPromoteBacklog,
  onDismissBacklog,
  onToggleTaskComplete,
  onShowToast
}) => {
  // Tasks Tab filter
  const [taskFilter, setTaskFilter] = useState<'all' | 'open' | 'review' | 'done'>('all');

  // My Tasks Tab filter
  const [myTaskFilter, setMyTaskFilter] = useState<'today' | 'upcoming' | 'overdue' | 'high'>('today');

  // Files Tab filter
  const [fileFilter, setFileFilter] = useState<'all' | 'spec' | 'policy' | 'agent'>('all');

  // --- 1. TASKS TAB ---
  if (currentTab === 'tasks') {
    const filteredTasks = tasks.filter((t) => {
      if (taskFilter === 'open') return t.status !== 'done';
      if (taskFilter === 'review') return t.status === 'review';
      if (taskFilter === 'done') return t.status === 'done';
      return true;
    });

    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / Tasks
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              Task Register
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
              The accountable unit of Delivery work: objective, owner, status, acceptance criteria, and human checkpoint.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddTask('todo')}
            className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg font-bold rounded-md flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#ABA944]" />
            Add task
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] overflow-hidden shadow-xs">
          <div className="p-3 bg-[#F7F6F2] border-b border-[rgba(85,105,112,0.12)] flex items-center gap-2">
            {(['all', 'open', 'review', 'done'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTaskFilter(f)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  taskFilter === f
                    ? 'bg-[#556970] text-white font-semibold shadow-2xs'
                    : 'bg-white text-[#556970] hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.15)]'
                }`}
              >
                {f === 'all' ? 'All tasks' : f === 'open' ? 'Open' : f === 'review' ? 'In review' : 'Completed'}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Source_Serif_4'] text-[#3D4447]">
              <thead className="bg-[#F7F6F2] text-[9.5px] font-mono uppercase text-[#9BA4A7] border-b border-[rgba(85,105,112,0.12)]">
                <tr>
                  <th className="py-2.5 px-4">Task</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Owner / Due</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(85,105,112,0.08)]">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenTask(t.id)}
                        className="font-semibold text-[#1F2426] hover:underline text-left block"
                      >
                        {t.title}
                      </button>
                      <span className="text-[10px] font-mono text-[#9BA4A7]">
                        {t.id} · {t.project || 'Kaizen.os'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span className="capitalize">{t.status.replace('progress', 'in progress')}</span>
                      <span className="block text-[9.5px] text-[#9BA4A7]">{t.signal}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <span>{t.ownerName}</span>
                      <span className="block text-[9.5px] text-[#9BA4A7]">{t.due}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                        t.priority === 'high'
                          ? 'bg-[#D94F4F]/10 text-[#D94F4F]'
                          : t.priority === 'med'
                          ? 'bg-[#ABA944]/15 text-[#8A8835]'
                          : 'bg-[#556970]/10 text-[#556970]'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenTask(t.id)}
                        className="px-2.5 py-1 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-xs font-mono rounded"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. CAPACITY TAB ---
  if (currentTab === 'capacity') {
    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / Team Capacity
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              Capacity &amp; Utilisation
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
              Kairos continuously maintains utilisation from estimates, dependencies, completions, and meeting load.
            </p>
          </div>
          <div className="text-[10.5px] font-mono text-[#8A8835] bg-[#ABA944]/15 px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-[#ABA944]/30">
            <Sparkles className="w-3.5 h-3.5" />
            Auto-computed by Kairos · 2m ago
          </div>
        </div>

        {/* Summary metric tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Team Load</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#1F2426] mt-1">72%</strong>
            <span className="text-[10px] font-mono text-[#3B6D11]">Within sustainable band</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Above 90% Threshold</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#D94F4F] mt-1">1</strong>
            <span className="text-[10px] font-mono text-[#D94F4F]">Precious Onwukwe (95%)</span>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Available Bandwidth</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#8A8835] mt-1">45%</strong>
            <span className="text-[10px] font-mono text-[#8A8835]">George Stavros (absorbs Sprint 13)</span>
          </div>
        </div>

        {/* People capacity cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capacity.map((p) => {
            const isHigh = p.capacityPct > 90;
            const isMid = p.capacityPct >= 70 && p.capacityPct <= 90;

            return (
              <div
                key={p.code}
                className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#ABA944]/20 text-[#8A8835] font-mono font-bold text-xs flex items-center justify-center">
                      {p.code}
                    </div>
                    <div>
                      <h3 className="font-mono text-xs font-bold text-[#1F2426]">{p.name}</h3>
                      <span className="text-[9px] font-mono text-[#9BA4A7] tracking-wider uppercase block">
                        {p.role}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                    isHigh
                      ? 'bg-[#D94F4F]/15 text-[#D94F4F]'
                      : isMid
                      ? 'bg-[#ABA944]/20 text-[#8A8835]'
                      : 'bg-[#6DBB7A]/20 text-[#3B6D11]'
                  }`}>
                    {p.capacityPct}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9.5px] font-mono text-[#9BA4A7]">
                    <span>Utilisation</span>
                    <span>{p.band}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EFF0EA] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isHigh ? 'bg-[#D94F4F]' : isMid ? 'bg-[#ABA944]' : 'bg-[#6DBB7A]'
                      }`}
                      style={{ width: `${p.capacityPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(85,105,112,0.08)]">
                  <span className="text-[9px] font-mono uppercase text-[#9BA4A7] block mb-1.5">
                    Active Commitments ({p.tasks.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tasks.map((taskLabel, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#F7F6F2] border border-[rgba(85,105,112,0.12)] font-mono text-[10px] text-[#3D4447]"
                      >
                        {taskLabel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 3. BACKLOG TAB ---
  if (currentTab === 'backlog') {
    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / Prioritised Backlog
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              Backlog &amp; Kairos Sprint Recommendations
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
              Kairos recommends promotions using capacity, deadlines, dependencies, and the cost of inaction.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddTask('todo')}
            className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg font-bold rounded-md flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#ABA944]" />
            Add item to backlog
          </button>
        </div>

        {/* Featured Kairos Sprint Recommendation Box with full reasoning */}
        {backlog.length > 0 && (
          <div className="p-5 bg-[#ABA944]/10 border border-[#ABA944]/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-[#8A8835]">
              <Sparkles className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Kairos Sprint 13 Recommendation
              </span>
            </div>

            <p className="text-sm font-['Source_Serif_4'] text-[#1F2426]">
              Promote <strong className="font-mono text-xs text-[#8A8835]">PAI-BL-001</strong> (Client portal) and <strong className="font-mono text-xs text-[#8A8835]">PAI-BL-003</strong> (Context memory) into active delivery.
            </p>

            {/* Detailed structured reasoning */}
            <div className="p-3.5 bg-white/80 rounded-lg border border-[#ABA944]/25 space-y-2 text-xs font-['Source_Serif_4'] text-[#3D4447]">
              <div className="flex gap-2">
                <span className="w-24 font-mono text-[10px] font-bold text-[#8A8835] uppercase shrink-0">Why this</span>
                <span>Both items unblock the Meridian Corp portal deadline and have zero unresolved dependencies.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-mono text-[10px] font-bold text-[#8A8835] uppercase shrink-0">Why now</span>
                <span>George Stavros has 45% capacity — the lowest of any engineer this sprint — and can absorb BL-003 cleanly.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-mono text-[10px] font-bold text-[#8A8835] uppercase shrink-0">Displaces</span>
                <span>Mobile responsive breakpoints (PAI-BL-008) moves to Sprint 14 (low risk, no client-facing deadline attached).</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-mono text-[10px] font-bold text-[#8A8835] uppercase shrink-0">Who can take</span>
                <span>George Stavros (BL-003, primary). Lena Okafor can shadow on BL-001 as part of onboarding ramp-up.</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 font-mono text-[10px] font-bold text-[#8A8835] uppercase shrink-0">If do nothing</span>
                <span>Portal deadline slips by at least one sprint — Precious flagged this as a client-visible escalation risk.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onPromoteBacklog(backlog[0])}
                className="px-4 py-1.5 bg-[#8A8835] hover:bg-[#68753C] text-white text-xs font-mono rounded font-semibold transition-colors"
              >
                Accept &amp; Promote
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Editing recommendation in Ask Kairos...')}
                className="px-3 py-1.5 bg-white border border-[rgba(85,105,112,0.2)] text-[#556970] text-xs font-mono rounded hover:bg-[#F7F6F2]"
              >
                Edit recommendation
              </button>
              <button
                type="button"
                onClick={() => onShowToast('Opening Kairos chat — context memory active')}
                className="px-3 py-1.5 bg-white border border-[rgba(85,105,112,0.2)] text-[#556970] text-xs font-mono rounded hover:bg-[#F7F6F2]"
              >
                Ask Kairos
              </button>
              <button
                type="button"
                onClick={() => onDismissBacklog(backlog[0].id)}
                className="px-3 py-1.5 text-xs font-mono text-[#9BA4A7] hover:text-[#D94F4F]"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Backlog Table */}
        <div className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-['Source_Serif_4'] text-[#3D4447]">
              <thead className="bg-[#F7F6F2] text-[9.5px] font-mono uppercase text-[#9BA4A7] border-b border-[rgba(85,105,112,0.12)]">
                <tr>
                  <th className="py-2.5 px-4">ID</th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Effort</th>
                  <th className="py-2.5 px-4">Requester</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(85,105,112,0.08)]">
                {backlog.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-[#1F2426]">
                      {item.id}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-[#1F2426] block font-medium">{item.title}</strong>
                      <span className="text-[10px] font-mono text-[#9BA4A7] block mt-0.5">
                        {item.reason}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                        item.priority === 'high'
                          ? 'bg-[#D94F4F]/10 text-[#D94F4F]'
                          : item.priority === 'med'
                          ? 'bg-[#ABA944]/15 text-[#8A8835]'
                          : 'bg-[#556970]/10 text-[#556970]'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{item.effort}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{item.requester}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => onPromoteBacklog(item)}
                        className="px-2.5 py-1 bg-[#556970]/10 hover:bg-[#556970] hover:text-white text-[#556970] text-xs font-mono rounded transition-colors font-semibold"
                      >
                        Promote
                      </button>
                      <button
                        onClick={() => onDismissBacklog(item.id)}
                        className="text-[#9BA4A7] hover:text-[#D94F4F] text-xs font-mono"
                        title="Delete from backlog"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. MY TASK TAB ---
  if (currentTab === 'mytask') {
    const myTasks = tasks.filter((t) => t.owner === 'VW');
    const filteredMyTasks = myTasks.filter((t) => {
      if (myTaskFilter === 'today') return !t.due.includes('✓');
      if (myTaskFilter === 'upcoming') return t.id !== 'PAI-DEL-006';
      if (myTaskFilter === 'overdue') return t.due.includes('!') || t.due.includes('Jul');
      if (myTaskFilter === 'high') return t.priority === 'high';
      return true;
    });

    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / My Tasks
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              Personal Operating Loop · Valerie Wilcox
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
              Focus on human checkpoints, urgent reviews, and consequential decisions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddTask('todo')}
            className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg font-bold rounded-md flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#ABA944]" />
            Add task
          </button>
        </div>

        {/* Metric row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Open for me</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#1F2426] mt-1">
              {myTasks.filter((t) => t.status !== 'done').length}
            </strong>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Needs review</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#8A8835] mt-1">
              {myTasks.filter((t) => t.status === 'review').length}
            </strong>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-semibold">Overdue risk</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#D94F4F] mt-1">1</strong>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['today', 'upcoming', 'overdue', 'high'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setMyTaskFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                myTaskFilter === f
                  ? 'bg-[#556970] text-white font-semibold'
                  : 'bg-white text-[#556970] border border-[rgba(85,105,112,0.15)] hover:bg-[#F7F6F2]'
              }`}
            >
              {f === 'today' ? 'Today' : f === 'upcoming' ? 'Upcoming' : f === 'overdue' ? 'Overdue' : 'High Priority'}
            </button>
          ))}
        </div>

        {/* Task rows list with interactive checkboxes */}
        <div className="space-y-2">
          {filteredMyTasks.map((t) => {
            const isDone = t.status === 'done';

            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t.id)}
                className="p-3.5 bg-white border border-[rgba(85,105,112,0.18)] rounded-xl flex items-center justify-between gap-3 hover:border-[#7A9098] transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskComplete(t.id);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isDone
                        ? 'bg-[#556970] border-[#556970] text-white'
                        : 'border-[#7A9098] bg-[#F7F6F2] hover:border-[#556970]'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span className={`text-sm font-['Source_Serif_4'] font-medium truncate block ${
                      isDone ? 'line-through text-[#9BA4A7]' : 'text-[#1F2426]'
                    }`}>
                      {t.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#9BA4A7] block mt-0.5">
                      {t.id} · {t.signal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold ${
                    t.priority === 'high'
                      ? 'bg-[#D94F4F]/10 text-[#D94F4F]'
                      : t.priority === 'med'
                      ? 'bg-[#ABA944]/15 text-[#8A8835]'
                      : 'bg-[#556970]/10 text-[#556970]'
                  }`}>
                    {t.priority}
                  </span>
                  <span className="font-mono text-xs text-[#9BA4A7]">{t.due}</span>
                  <ChevronRight className="w-4 h-4 text-[#9BA4A7] group-hover:text-[#1F2426] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 5. FILES TAB ---
  if (currentTab === 'files') {
    const filteredFiles = files.filter((f) => {
      if (fileFilter === 'spec') return f.name.includes('Spec') || f.name.includes('checklist');
      if (fileFilter === 'policy') return f.name.includes('Handbook') || f.name.includes('POL');
      if (fileFilter === 'agent') return f.meta.includes('Kairos');
      return true;
    });

    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / Project Evidence
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              Project Files &amp; Artifact Repository
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
              Project-scoped evidence organised by sprint, with first-class links to tasks, decisions, and agent runs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onShowToast('File upload modal opened')}
            className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg font-bold rounded-md flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#ABA944]" />
            Upload file
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'spec', 'policy', 'agent'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFileFilter(f)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                fileFilter === f
                  ? 'bg-[#556970] text-white font-semibold'
                  : 'bg-white text-[#556970] border border-[rgba(85,105,112,0.15)] hover:bg-[#F7F6F2]'
              }`}
            >
              {f === 'all' ? 'All files' : f === 'spec' ? 'Specs' : f === 'policy' ? 'Policies' : 'Agent evidence'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] p-4 shadow-xs divide-y divide-[rgba(85,105,112,0.08)]">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  file.type === 'PDF'
                    ? 'bg-[#D94F4F]/15 text-[#D94F4F]'
                    : file.type === 'DOC'
                    ? 'bg-[#556970]/15 text-[#556970]'
                    : file.type === 'FIG'
                    ? 'bg-[#A259FF]/15 text-[#A259FF]'
                    : 'bg-[#ABA944]/20 text-[#8A8835]'
                }`}>
                  {file.type}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-['Agdasima'] font-bold text-[#1F2426] truncate">
                    {file.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#9BA4A7] block mt-0.5">
                    {file.meta} · {file.owner}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenTask(file.linkTaskId)}
                  className="px-3 py-1.5 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-xs font-mono rounded font-semibold transition-colors"
                >
                  Open context
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEvidenceReview(file.linkTaskId)}
                  className="px-3 py-1.5 bg-[#ABA944]/15 hover:bg-[#ABA944]/25 text-[#8A8835] text-xs font-mono rounded font-semibold transition-colors"
                >
                  View evidence
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 6. TIMELINE TAB ---
  if (currentTab === 'timeline') {
    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
            Delivery / Timeline
          </div>
          <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
            Gantt Schedule &amp; Execution Slack
          </h1>
          <p className="text-xs text-[#6B7477] font-['Source_Serif_4']">
            Every task plotted against its start-to-due window, with blocked critical paths highlighted.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] p-5 shadow-xs space-y-4">
          <div className="flex justify-between font-mono text-[10px] text-[#9BA4A7] border-b pb-2 border-[rgba(85,105,112,0.1)]">
            <span className="w-48 font-bold">TASK</span>
            <div className="flex-1 flex justify-between px-4">
              <span>Jul 28</span>
              <span>Jul 30</span>
              <span>Aug 01</span>
              <span>Aug 03</span>
              <span>Aug 05</span>
              <span>Aug 07</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {tasks.map((t, idx) => {
              const isDone = t.status === 'done';
              const isReview = t.status === 'review';
              const isBlocked = t.type === 'blocked';

              return (
                <div key={t.id} className="flex items-center justify-between gap-2 py-1">
                  <div 
                    onClick={() => onOpenTask(t.id)}
                    className="w-48 truncate cursor-pointer hover:underline text-[#1F2426] text-xs font-['Source_Serif_4']"
                  >
                    <span className="font-mono text-[10px] text-[#9BA4A7] mr-1.5">{t.id}</span>
                    {t.title}
                  </div>

                  <div className="flex-1 h-6 bg-[#EFF0EA] rounded relative overflow-hidden flex items-center px-2">
                    <div
                      onClick={() => onOpenTask(t.id)}
                      className={`h-4.5 rounded cursor-pointer transition-all flex items-center px-2 text-[9.5px] font-mono text-white ${
                        isDone
                          ? 'bg-[#6DBB7A]'
                          : isBlocked
                          ? 'bg-[#D94F4F]'
                          : isReview
                          ? 'bg-[#8A8835]'
                          : 'bg-[#556970]'
                      }`}
                      style={{
                        marginLeft: `${(idx * 8) % 65}%`,
                        width: `${Math.max(18, 30 - (idx % 4) * 4)}%`
                      }}
                    >
                      <span className="truncate">{t.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 pt-3 border-t border-[rgba(85,105,112,0.1)] text-[10px] font-mono text-[#9BA4A7]">
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#9BA4A7] inline-block" /> To Do</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#556970] inline-block" /> In Progress</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#8A8835] inline-block" /> In Review</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#6DBB7A] inline-block" /> Done</span>
            <span className="flex items-center gap-1.5"><i className="w-2.5 h-2.5 rounded bg-[#D94F4F] inline-block" /> Blocked</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 7. CALENDAR TAB ---
  if (currentTab === 'calendar') {
    const days = Array.from({ length: 15 }, (_, i) => i + 1);

    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div>
            <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              Delivery / Calendar
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
              August 2026 Commitments
            </h1>
          </div>
          <button
            type="button"
            onClick={() => onAddTask('todo')}
            className="px-3.5 py-1.5 bg-[#556970] text-white text-xs font-mono rounded"
          >
            + Add task
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-[rgba(85,105,112,0.2)] border border-[rgba(85,105,112,0.2)] rounded-xl overflow-hidden shadow-xs">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="p-2.5 bg-[#EFF0EA] font-mono text-[10px] text-[#9BA4A7] uppercase font-semibold">
              {day}
            </div>
          ))}

          {days.map((d) => {
            const dayTasks = tasks.filter((t) => t.due.includes(`Aug ${d}`) || (d === 1 && t.due.includes('Aug 1')));
            const isToday = d === 8;

            return (
              <div 
                key={d} 
                className={`min-h-[90px] p-2 bg-white flex flex-col justify-between transition-colors ${
                  isToday ? 'bg-[#ABA944]/10' : ''
                }`}
              >
                <span className={`font-mono text-xs font-bold ${isToday ? 'text-[#8A8835]' : 'text-[#9BA4A7]'}`}>
                  {d}
                </span>

                <div className="space-y-1 mt-1">
                  {dayTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onOpenTask(t.id)}
                      className="w-full text-left p-1 rounded font-mono text-[9px] truncate bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#3D4447] block"
                    >
                      {t.id} · {t.title.slice(0, 16)}...
                    </button>
                  ))}
                  {d === 15 && (
                    <span className="p-1 rounded font-mono text-[9px] bg-[#6DBB7A]/20 text-[#3B6D11] block font-semibold">
                      Sprint 12 ends
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 8. DASHBOARD TAB ---
  if (currentTab === 'dashboard') {
    const totalCount = tasks.length;
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    const reviewCount = tasks.filter((t) => t.status === 'review').length;
    const progressCount = tasks.filter((t) => t.status === 'progress').length;
    const todoCount = tasks.filter((t) => t.status === 'todo').length;

    return (
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="pb-3 border-b border-[rgba(85,105,112,0.15)]">
          <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
            Delivery / Health Dashboard
          </div>
          <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
            Delivery Pulse &amp; Quality Metrics
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7]">Total Tasks</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#1F2426] mt-1">{totalCount}</strong>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7]">Completed</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#3B6D11] mt-1">{doneCount}</strong>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7]">In Review</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#8A8835] mt-1">{reviewCount}</strong>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <span className="text-[9.5px] font-mono uppercase text-[#9BA4A7]">Active Blockers</span>
            <strong className="block text-3xl font-['Agdasima'] font-bold text-[#D94F4F] mt-1">2</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-3">
            <h3 className="font-mono text-xs uppercase text-[#9BA4A7] font-semibold">Tasks by Status</h3>
            <div className="h-40 flex items-end gap-6 pt-4 px-4">
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-xs font-bold">{todoCount}</span>
                <div className="w-full bg-[#9BA4A7] rounded-t" style={{ height: `${(todoCount / totalCount) * 100}%` }} />
                <span className="font-mono text-[10px] text-[#9BA4A7]">To Do</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-xs font-bold">{progressCount}</span>
                <div className="w-full bg-[#7A9098] rounded-t" style={{ height: `${(progressCount / totalCount) * 100}%` }} />
                <span className="font-mono text-[10px] text-[#9BA4A7]">Progress</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-xs font-bold">{reviewCount}</span>
                <div className="w-full bg-[#8A8835] rounded-t" style={{ height: `${(reviewCount / totalCount) * 100}%` }} />
                <span className="font-mono text-[10px] text-[#9BA4A7]">Review</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="font-mono text-xs font-bold">{doneCount}</span>
                <div className="w-full bg-[#6DBB7A] rounded-t" style={{ height: `${(doneCount / totalCount) * 100}%` }} />
                <span className="font-mono text-[10px] text-[#9BA4A7]">Done</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs flex flex-col items-center justify-center space-y-3">
            <h3 className="font-mono text-xs uppercase text-[#9BA4A7] font-semibold self-start">Completion Rate</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#EFF0EA]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#ABA944]"
                  strokeDasharray={`${(doneCount / totalCount) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center font-mono">
                <span className="text-2xl font-bold font-['Agdasima'] text-[#1F2426]">
                  {Math.round((doneCount / totalCount) * 100)}%
                </span>
                <span className="block text-[8px] text-[#9BA4A7] uppercase">Delivered</span>
              </div>
            </div>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] text-center">
              {doneCount} of {totalCount} delivery contracts signed off with evidence.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
