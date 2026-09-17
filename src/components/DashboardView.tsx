import React, { useState } from 'react';
import { Task, Project } from '../types';
import { 
  Plus, 
  Sparkles, 
  SlidersHorizontal, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Bot,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  HelpCircle,
  X
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  activeProject: Project;
  onAddTask: (status: any) => void;
  onOpenTask: (taskId: string) => void;
  onShowToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  activeProject,
  onAddTask,
  onOpenTask,
  onShowToast
}) => {
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [visibleWidgets, setVisibleWidgets] = useState({
    tasksByStatus: true,
    completionDonut: true,
    assigneeBreakdown: true,
    completionOverTime: true,
    agentVsHuman: true,
    evidenceHealth: true
  });

  const totalTasks = tasks.length || 1;
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const progressTasks = tasks.filter((t) => t.status === 'progress');
  const reviewTasks = tasks.filter((t) => t.status === 'review');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const blockedTasks = tasks.filter((t) => t.type === 'blocked' || t.signal.toLowerCase().includes('block'));

  const incompleteCount = tasks.filter((t) => t.status !== 'done').length;
  const completedCount = doneTasks.length;
  const completionPct = Math.round((completedCount / totalTasks) * 100);

  // Status counts for bar chart
  const statusBars = [
    { label: 'TO DO', count: todoTasks.length, color: '#8A999E' },
    { label: 'IN PROGRESS', count: progressTasks.length, color: '#556970' },
    { label: 'REVIEW', count: reviewTasks.length, color: '#ABA944' },
    { label: 'DONE', count: doneTasks.length, color: '#6DBB7A' },
    { label: 'BLOCKERS', count: blockedTasks.length, color: '#D94F4F' }
  ];
  const maxStatusCount = Math.max(...statusBars.map((s) => s.count), 1);

  // Assignee counts
  const assigneesMap: Record<string, { name: string; count: number; avatar: string }> = {};
  tasks.forEach((t) => {
    const key = t.owner || 'VW';
    if (!assigneesMap[key]) {
      assigneesMap[key] = {
        name: t.ownerName || t.owner,
        count: 0,
        avatar: t.owner
      };
    }
    if (t.status !== 'done') {
      assigneesMap[key].count += 1;
    }
  });
  const assigneeList = Object.values(assigneesMap).sort((a, b) => b.count - a.count);
  const maxAssigneeCount = Math.max(...assigneeList.map((a) => a.count), 1);

  // Timeline cumulative data simulation (Sep 08 to Sep 17)
  const timelineData = [
    { date: '08/09', total: 8, done: 1 },
    { date: '09/09', total: 9, done: 1 },
    { date: '10/09', total: 10, done: 2 },
    { date: '11/09', total: 11, done: 2 },
    { date: '12/09', total: 12, done: 2 },
    { date: '13/09', total: 12, done: 3 },
    { date: '14/09', total: 13, done: 3 },
    { date: '15/09', total: 13, done: 3 },
    { date: '16/09', total: 14, done: 4 },
    { date: '17/09', total: totalTasks, done: completedCount }
  ];
  const maxTimelineTotal = Math.max(...timelineData.map((d) => d.total), 1);

  // Agent vs Human
  const agentTasks = tasks.filter((t) => t.type === 'agent').length;
  const humanTasks = tasks.filter((t) => t.type !== 'agent').length;

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F7F6F2]">
      {/* Top Dashboard Action Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between gap-4 flex-wrap shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddWidgetOpen(true)}
            className="px-3 py-1.5 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add widget</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onShowToast('Customizing dashboard layout and widget placements...');
            }}
            className="px-3 py-1.5 bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>

          <div className="h-4 w-px bg-[rgba(85,105,112,0.15)] mx-1" />

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF0EA] text-[10.5px] font-mono text-[#556970]">
            <Filter className="w-3 h-3 text-[#9BA4A7]" />
            <span>Project: <strong>{activeProject.name}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onShowToast('Thank you! Feedback telemetry logged for Valerie Wilcox.')}
            className="text-xs font-mono text-[#9BA4A7] hover:text-[#556970] flex items-center gap-1 transition-colors"
          >
            <span>Send feedback</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3.5 shrink-0">
        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#9BA4A7]">
            <span className="text-[10px] font-mono uppercase font-semibold">Total Scope</span>
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#1F2426] mt-1">
            {totalTasks}
          </strong>
          <span className="text-[10px] font-mono text-[#6B7477]">
            {activeProject.code} delivery contracts
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#3B6D11]">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#9BA4A7]">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#3B6D11] mt-1">
            {completedCount}
          </strong>
          <span className="text-[10px] font-mono text-[#3B6D11]">
            {completionPct}% signoff rate
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#8A8835]">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#9BA4A7]">Active Work</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#8A8835] mt-1">
            {incompleteCount}
          </strong>
          <span className="text-[10px] font-mono text-[#6B7477]">
            {reviewTasks.length} in review
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#D94F4F]">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#9BA4A7]">Blockers</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#D94F4F] mt-1">
            {blockedTasks.length}
          </strong>
          <span className="text-[10px] font-mono text-[#D94F4F]">
            Requires human unblock
          </span>
        </div>
      </div>

      {/* Grid of Interactive Analytical Widgets (matching Asana screenshot layout) */}
      <div className="px-6 pb-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* WIDGET 1: Tasks by Status (Bar Chart) */}
        {visibleWidgets.tasksByStatus && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Tasks by Status
                </h3>
                <span className="text-[10px] font-mono text-[#9BA4A7]">Distribution across Kanban columns</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EFF0EA] text-[#556970]">
                  2 Filters
                </span>
                <button 
                  onClick={() => onShowToast('Filter applied: showing all active sprint tasks')}
                  className="text-xs font-mono text-[#556970] hover:underline"
                >
                  See all
                </button>
              </div>
            </div>

            {/* Bars Area */}
            <div className="h-56 pt-6 flex items-end justify-between gap-3 px-2">
              {statusBars.map((bar) => {
                const heightPct = Math.max(Math.round((bar.count / maxStatusCount) * 80), 8);
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="font-mono text-xs font-bold text-[#1F2426] group-hover:text-[#556970] transition-colors">
                      {bar.count}
                    </span>
                    <div className="w-full bg-[#EFF0EA] rounded-t-lg h-40 flex items-end p-1">
                      <div
                        className="w-full rounded-t transition-all duration-500 group-hover:brightness-95"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: bar.color
                        }}
                      />
                    </div>
                    <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9BA4A7] text-center truncate w-full">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 2: Task Completion Donut Chart (matching Asana screenshot) */}
        {visibleWidgets.completionDonut && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Task Completion Status
                </h3>
                <span className="text-[10px] font-mono text-[#9BA4A7]">Delivery contract fulfillment</span>
              </div>
              <span className="text-[10px] font-mono text-[#8A8835] bg-[#ABA944]/15 px-2 py-0.5 rounded">
                Sprint 12
              </span>
            </div>

            <div className="py-4 flex items-center justify-around gap-6">
              {/* Circular SVG Donut */}
              <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track: Incomplete color (#556970) */}
                  <path
                    stroke="#556970"
                    strokeWidth="3.8"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Completed segment: (#6DBB7A) */}
                  <path
                    stroke="#6DBB7A"
                    strokeDasharray={`${completionPct}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Center text matching Asana screenshot: "13 incomplete" */}
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-3xl font-bold font-['Agdasima'] text-[#1F2426] leading-none">
                    {incompleteCount}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#6B7477] tracking-wider mt-0.5">
                    incomplete
                  </span>
                </div>
              </div>

              {/* Legend & Stats */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#556970] shrink-0" />
                  <div>
                    <div className="text-[#1F2426] font-semibold">{incompleteCount} Incomplete</div>
                    <span className="text-[10px] text-[#9BA4A7]">{100 - completionPct}% of total</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#6DBB7A] shrink-0" />
                  <div>
                    <div className="text-[#3B6D11] font-semibold">{completedCount} Complete</div>
                    <span className="text-[10px] text-[#9BA4A7]">{completionPct}% delivered with evidence</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(85,105,112,0.1)] text-[11px] text-[#6B7477]">
                  Total: <strong>{totalTasks} tasks</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 3: Total upcoming tasks by assignee (matching Asana screenshot) */}
        {visibleWidgets.assigneeBreakdown && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Total upcoming tasks by assignee
                </h3>
                <span className="text-[10px] font-mono text-[#9BA4A7]">Active workload per team member</span>
              </div>
              <Users className="w-4 h-4 text-[#9BA4A7]" />
            </div>

            {/* Horizontal bars with avatars matching Asana */}
            <div className="py-4 space-y-3">
              {assigneeList.map((person) => {
                const widthPct = Math.max(Math.round((person.count / maxAssigneeCount) * 100), 10);
                return (
                  <div key={person.name} className="flex items-center gap-3">
                    {/* Avatar circle */}
                    <div className="w-7 h-7 rounded-full bg-[#EFF0EA] border border-[rgba(85,105,112,0.18)] text-[#556970] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {person.avatar}
                    </div>

                    {/* Bar track and pill */}
                    <div className="flex-1 bg-[#EFF0EA] h-6 rounded-md overflow-hidden relative flex items-center px-2">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#556970] rounded-md transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                      <span className="relative z-10 text-[11px] font-mono font-semibold text-white truncate">
                        {person.name}
                      </span>
                    </div>

                    {/* Count tag */}
                    <span className="font-mono text-xs font-bold text-[#1F2426] w-6 text-right">
                      {person.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 4: Task completion over time (matching Asana screenshot) */}
        {visibleWidgets.completionOverTime && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Task completion over time
                </h3>
                <span className="text-[10px] font-mono text-[#9BA4A7]">Sprint trajectory &amp; burnup trend</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#556970]" /> Total
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#6DBB7A]" /> Completed
                </span>
              </div>
            </div>

            {/* Trend chart with bars per date */}
            <div className="h-56 pt-6 flex items-end justify-between gap-1.5 px-1">
              {timelineData.map((d) => {
                const totalH = Math.max(Math.round((d.total / maxTimelineTotal) * 100), 10);
                const doneH = Math.max(Math.round((d.done / maxTimelineTotal) * 100), 5);
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full bg-[#EFF0EA] rounded-t h-40 flex items-end gap-0.5 p-0.5 relative">
                      {/* Total bar */}
                      <div
                        className="flex-1 bg-[#556970]/30 rounded-t transition-all"
                        style={{ height: `${totalH}%` }}
                        title={`${d.total} total on ${d.date}`}
                      />
                      {/* Done bar */}
                      <div
                        className="flex-1 bg-[#6DBB7A] rounded-t transition-all"
                        style={{ height: `${doneH}%` }}
                        title={`${d.done} completed on ${d.date}`}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-[#9BA4A7] group-hover:text-[#1F2426] transition-colors">
                      {d.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIDGET 5: Agent vs Human Automation Ratio */}
        {visibleWidgets.agentVsHuman && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#8A8835]" />
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Autonomous Execution vs Human Checkpoints
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#3B6D11] bg-[#6DBB7A]/15 px-2 py-0.5 rounded font-bold">
                71% Autonomous
              </span>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-xs font-['Source_Serif_4'] text-[#6B7477]">
                Kairos independently executes verification pipelines, prepares evidence dossiers, and flags consequential trade-offs for Valerie Wilcox.
              </p>

              <div className="w-full h-3 bg-[#EFF0EA] rounded-full overflow-hidden flex">
                <div className="bg-[#ABA944] h-full" style={{ width: `${Math.round((agentTasks / totalTasks) * 100)}%` }} />
                <div className="bg-[#556970] h-full" style={{ width: `${Math.round((humanTasks / totalTasks) * 100)}%` }} />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#556970] pt-1">
                <span>Kairos Agent: <strong>{agentTasks} tasks</strong></span>
                <span>Human Review: <strong>{humanTasks} tasks</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* WIDGET 6: Evidence & Proof Verification Health */}
        {visibleWidgets.evidenceHealth && (
          <div className="p-5 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ABA944]" />
                <h3 className="font-mono text-xs uppercase font-bold text-[#1F2426] tracking-wide">
                  Delivery Evidence Integrity
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#3B6D11] bg-[#6DBB7A]/20 px-2 py-0.5 rounded font-bold">
                Gate 2 Validated
              </span>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#EFF0EA] rounded-lg text-center">
                <span className="block text-2xl font-bold font-mono text-[#3B6D11]">18</span>
                <span className="text-[9px] font-mono uppercase text-[#6B7477]">Verified Criteria</span>
              </div>
              <div className="p-3 bg-[#EFF0EA] rounded-lg text-center">
                <span className="block text-2xl font-bold font-mono text-[#8A8835]">5</span>
                <span className="text-[9px] font-mono uppercase text-[#6B7477]">Needs Review</span>
              </div>
              <div className="p-3 bg-[#EFF0EA] rounded-lg text-center">
                <span className="block text-2xl font-bold font-mono text-[#D94F4F]">1</span>
                <span className="text-[9px] font-mono uppercase text-[#6B7477]">Missing Artifact</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Widget Drawer / Modal */}
      {isAddWidgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsAddWidgetOpen(false)} className="fixed inset-0 bg-[#1F2426]/40 backdrop-blur-2xs" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[rgba(85,105,112,0.18)] w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.12)] mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#556970]" />
                <h3 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">Configure Widgets</h3>
              </div>
              <button onClick={() => setIsAddWidgetOpen(false)} className="p-1 text-[#9BA4A7] hover:text-[#1F2426]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#6B7477] mb-4">
              Toggle charts and analytics widgets visible on this dashboard:
            </p>

            <div className="space-y-3">
              {[
                { key: 'tasksByStatus', title: 'Tasks by Status (Bar Chart)', desc: 'Distribution across To Do, Progress, Review, Done, Blockers' },
                { key: 'completionDonut', title: 'Task Completion Status (Donut)', desc: 'Incomplete vs Complete ratio with center count' },
                { key: 'assigneeBreakdown', title: 'Upcoming Tasks by Assignee (Lollipops)', desc: 'Workload distribution per team member with avatar tags' },
                { key: 'completionOverTime', title: 'Task Completion Over Time (Trend)', desc: 'Cumulative burnup tracking throughout sprint dates' },
                { key: 'agentVsHuman', title: 'Agent vs Human Ratio', desc: 'Autonomous agent tasks vs human checkpoints' },
                { key: 'evidenceHealth', title: 'Delivery Evidence Integrity', desc: 'Verification status across criteria & artifacts' }
              ].map((item) => {
                const isChecked = (visibleWidgets as any)[item.key];
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                      isChecked ? 'bg-[#556970]/5 border-[#556970]/30' : 'bg-[#EFF0EA] border-[rgba(85,105,112,0.12)]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setVisibleWidgets((prev) => ({
                          ...prev,
                          [item.key]: !isChecked
                        }));
                      }}
                      className="mt-0.5 accent-[#556970]"
                    />
                    <div>
                      <div className="font-mono text-xs font-semibold text-[#1F2426]">{item.title}</div>
                      <div className="text-[10px] font-['Source_Serif_4'] text-[#6B7477]">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-[rgba(85,105,112,0.12)] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAddWidgetOpen(false);
                  onShowToast('Dashboard widgets updated');
                }}
                className="px-4 py-2 bg-[#556970] text-white text-xs font-mono font-bold rounded-lg"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
