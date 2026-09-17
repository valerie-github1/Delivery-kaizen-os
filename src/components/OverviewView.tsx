import React from 'react';
import { Project, Task } from '../types';
import { 
  Target, 
  Users, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Flag, 
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface OverviewViewProps {
  project: Project;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onShowToast: (msg: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  project,
  tasks,
  onOpenTask,
  onNavigateToTab,
  onShowToast
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length || 1;

  const milestones = [
    { id: 'm-1', title: 'Gate 1: Verification Contracts & Audit Spec', date: 'Jul 28, 2026', status: 'completed' },
    { id: 'm-2', title: 'Gate 2: ONB Stepper & Evidence Review Workspace', date: 'Aug 15, 2026', status: 'active' },
    { id: 'm-3', title: 'Gate 3: NVIDIA NIM Autonomous Agent Integration', date: 'Sep 30, 2026', status: 'upcoming' },
    { id: 'm-4', title: 'Gate 4: Multi-Project Executive Governance Signoff', date: 'Oct 31, 2026', status: 'upcoming' }
  ];

  const teamMembers = [
    { name: 'Valerie Wilcox', role: 'Super Admin / Lead', code: 'VW', color: '#556970' },
    { name: 'Precious Okafor', role: 'Delivery Lead', code: 'PO', color: '#6B5B95' },
    { name: 'Mayah Sinclair', role: 'Design Systems & QA', code: 'MS', color: '#6DBB7A' },
    { name: 'George Stavros', role: 'Integration Engineer', code: 'GS', color: '#3B6D11' },
    { name: 'Kairos Autonomous Agent', role: 'AI Verification Daemon', code: 'KI', color: '#ABA944' }
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F7F6F2]">
      {/* Overview Banner */}
      <div className="p-6 bg-white rounded-2xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(85,105,112,0.1)]">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#9BA4A7] mb-1">
              <span>PROJECT OVERVIEW</span>
              <span>·</span>
              <span className="text-[#556970] font-bold">{project.code}</span>
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#1F2426]">
              {project.name}
            </h1>
            <p className="text-xs font-['Source_Serif_4'] text-[#6B7477] max-w-2xl mt-1 leading-relaxed">
              {project.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#6DBB7A]/20 text-[#3B6D11]">
              {project.health || 'On track'}
            </span>
            <button
              type="button"
              onClick={() => onNavigateToTab('board')}
              className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Go to Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-[#EFF0EA] rounded-xl">
            <span className="text-[10px] font-mono uppercase text-[#9BA4A7]">Delivery Progress</span>
            <strong className="block text-2xl font-bold font-['Agdasima'] text-[#1F2426] mt-0.5">
              {project.progress}%
            </strong>
          </div>
          <div className="p-3 bg-[#EFF0EA] rounded-xl">
            <span className="text-[10px] font-mono uppercase text-[#9BA4A7]">Active Sprint Tasks</span>
            <strong className="block text-2xl font-bold font-['Agdasima'] text-[#556970] mt-0.5">
              {tasks.filter((t) => t.status !== 'done').length}
            </strong>
          </div>
          <div className="p-3 bg-[#EFF0EA] rounded-xl">
            <span className="text-[10px] font-mono uppercase text-[#9BA4A7]">Verified Evidence</span>
            <strong className="block text-2xl font-bold font-['Agdasima'] text-[#3B6D11] mt-0.5">
              {project.evidenceLinked}
            </strong>
          </div>
          <div className="p-3 bg-[#EFF0EA] rounded-xl">
            <span className="text-[10px] font-mono uppercase text-[#9BA4A7]">Active Blockers</span>
            <strong className="block text-2xl font-bold font-['Agdasima'] text-[#D94F4F] mt-0.5">
              {project.blockers}
            </strong>
          </div>
        </div>
      </div>

      {/* 2 Column Layout: Milestones & Project Team */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones / Roadmap */}
        <div className="p-6 bg-white rounded-2xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#556970]" />
              <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">Milestones &amp; Stage Gates</h2>
            </div>
            <span className="text-[10px] font-mono text-[#9BA4A7]">Gate 2 in review</span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div 
                key={m.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F6F2] border border-[rgba(85,105,112,0.1)]"
              >
                <div className="mt-0.5">
                  {m.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#6DBB7A]" />
                  ) : m.status === 'active' ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#ABA944] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ABA944] animate-pulse" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-[rgba(85,105,112,0.3)] block" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#1F2426]">{m.title}</span>
                    <span className="text-[10px] font-mono text-[#9BA4A7]">{m.date}</span>
                  </div>
                  <span className={`text-[9.5px] font-mono uppercase font-bold mt-0.5 block ${
                    m.status === 'completed' 
                      ? 'text-[#3B6D11]' 
                      : m.status === 'active' 
                      ? 'text-[#8A8835]' 
                      : 'text-[#9BA4A7]'
                  }`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members & Roles */}
        <div className="p-6 bg-white rounded-2xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(85,105,112,0.1)]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#556970]" />
              <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">Project Roles</h2>
            </div>
            <span className="text-[10px] font-mono text-[#9BA4A7]">{teamMembers.length} assigned</span>
          </div>

          <div className="space-y-2.5">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F6F2] border border-[rgba(85,105,112,0.1)]"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.code}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-[#1F2426] block">{member.name}</span>
                    <span className="text-[10px] font-['Source_Serif_4'] text-[#6B7477]">{member.role}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#556970] px-2 py-0.5 rounded bg-white border border-[rgba(85,105,112,0.1)]">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connected Resources & Governance Docs */}
      <div className="p-6 bg-white rounded-2xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(85,105,112,0.1)]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#556970]" />
            <h2 className="font-['Agdasima'] text-2xl font-bold text-[#1F2426]">Key Resources &amp; Brief</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('files')}
            className="text-xs font-mono text-[#556970] hover:underline"
          >
            View all files
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div 
            onClick={() => onNavigateToTab('files')}
            className="p-3 bg-[#F7F6F2] hover:bg-[#EFF0EA] rounded-xl border border-[rgba(85,105,112,0.1)] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xs font-mono font-bold text-[#1F2426] block">Architecture &amp; Spec.pdf</span>
            <span className="text-[10px] font-mono text-[#9BA4A7]">Updated 2d ago · PDF</span>
          </div>

          <div 
            onClick={() => onNavigateToTab('files')}
            className="p-3 bg-[#F7F6F2] hover:bg-[#EFF0EA] rounded-xl border border-[rgba(85,105,112,0.1)] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xs font-mono font-bold text-[#1F2426] block">NIM Verification Protocol.md</span>
            <span className="text-[10px] font-mono text-[#9BA4A7]">Updated yesterday · Markdown</span>
          </div>

          <div 
            onClick={() => onNavigateToTab('files')}
            className="p-3 bg-[#F7F6F2] hover:bg-[#EFF0EA] rounded-xl border border-[rgba(85,105,112,0.1)] cursor-pointer transition-colors space-y-1"
          >
            <span className="text-xs font-mono font-bold text-[#1F2426] block">Gate 2 Evidence Bundle.fig</span>
            <span className="text-[10px] font-mono text-[#9BA4A7]">Figma · Design signoff</span>
          </div>
        </div>
      </div>
    </div>
  );
};
