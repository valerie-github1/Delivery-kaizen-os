import React from 'react';
import { Portfolio, Project } from '../types';
import { 
  Briefcase, 
  Plus, 
  ArrowRight, 
  FolderKanban, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Sparkles,
  Users
} from 'lucide-react';

interface PortfoliosViewProps {
  portfolios: Portfolio[];
  projects: Project[];
  onOpenCreatePortfolio: () => void;
  onSelectProject: (projectId: string) => void;
  onShowToast: (msg: string) => void;
}

export const PortfoliosView: React.FC<PortfoliosViewProps> = ({
  portfolios,
  projects,
  onOpenCreatePortfolio,
  onSelectProject,
  onShowToast
}) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F7F6F2]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(85,105,112,0.15)] bg-white p-5 rounded-2xl border">
        <div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7] mb-1">
            EXECUTIVE GOVERNANCE · MULTI-PROJECT PORTFOLIOS
          </div>
          <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55]">
            Strategic Portfolios &amp; Cross-Project Rollups
          </h1>
          <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-2xl mt-0.5">
            Monitor progress, health status, and resource distribution across multiple project initiatives from a single operational vantage point.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreatePortfolio}
          className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-mono text-xs font-bold rounded-lg flex items-center gap-2 shadow-2xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-[#ABA944]" />
          <span>New Portfolio</span>
        </button>
      </div>

      {/* High-level roll-up metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#9BA4A7]">
            <span className="text-[10px] font-mono uppercase font-semibold">Active Portfolios</span>
            <Briefcase className="w-4 h-4" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#1F2426] mt-1">
            {portfolios.length}
          </strong>
          <span className="text-[10px] font-mono text-[#6B7477]">
            {projects.length} connected initiatives
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#3B6D11]">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#9BA4A7]">On Track Portfolios</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#3B6D11] mt-1">
            {portfolios.filter((p) => p.status === 'On track').length}
          </strong>
          <span className="text-[10px] font-mono text-[#3B6D11]">
            Healthy milestone trajectory
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[rgba(85,105,112,0.18)] shadow-2xs">
          <div className="flex items-center justify-between text-[#D94F4F]">
            <span className="text-[10px] font-mono uppercase font-semibold text-[#9BA4A7]">At Risk Portfolios</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <strong className="block text-3xl font-['Agdasima'] font-bold text-[#D94F4F] mt-1">
            {portfolios.filter((p) => p.status !== 'On track').length}
          </strong>
          <span className="text-[10px] font-mono text-[#D94F4F]">
            Attention required on dependencies
          </span>
        </div>
      </div>

      {/* Portfolio Cards */}
      <div className="space-y-5">
        {portfolios.map((portfolio) => {
          const linkedProjects = projects.filter((p) => 
            portfolio.projectIds.includes(p.id) || p.portfolioId === portfolio.id
          );
          const totalTasks = linkedProjects.reduce((sum, p) => sum + p.openTasks, 0);
          const totalBlockers = linkedProjects.reduce((sum, p) => sum + p.blockers, 0);
          const avgProgress = linkedProjects.length 
            ? Math.round(linkedProjects.reduce((sum, p) => sum + p.progress, 0) / linkedProjects.length)
            : portfolio.progress;

          return (
            <div 
              key={portfolio.id}
              className="p-6 bg-white rounded-2xl border border-[rgba(85,105,112,0.18)] shadow-2xs space-y-4 transition-all hover:border-[rgba(85,105,112,0.3)]"
            >
              {/* Portfolio header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.12)]">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-['Agdasima'] font-bold text-[#1F2426]">
                      {portfolio.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                      portfolio.status === 'On track'
                        ? 'bg-[#6DBB7A]/20 text-[#3B6D11]'
                        : portfolio.status === 'At risk'
                        ? 'bg-[#E57A3C]/20 text-[#C45E20]'
                        : 'bg-[#D94F4F]/20 text-[#D94F4F]'
                    }`}>
                      {portfolio.status}
                    </span>
                  </div>
                  <p className="text-xs font-['Source_Serif_4'] text-[#6B7477] mt-0.5">
                    {portfolio.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-[#556970] shrink-0">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#9BA4A7]" />
                    {portfolio.owner}
                  </span>
                  <span>·</span>
                  <span>{portfolio.dates}</span>
                </div>
              </div>

              {/* Progress & Quick Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                <div className="w-full sm:w-1/2 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#9BA4A7]">Overall Portfolio Progress</span>
                    <strong className="text-[#1F2426]">{avgProgress}%</strong>
                  </div>
                  <div className="w-full h-2.5 bg-[#EFF0EA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#556970] rounded-full transition-all duration-500" 
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                  <div className="text-center">
                    <span className="block text-lg font-bold text-[#1F2426]">{linkedProjects.length}</span>
                    <span className="text-[10px] text-[#9BA4A7] uppercase">Projects</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-[#556970]">{totalTasks}</span>
                    <span className="text-[10px] text-[#9BA4A7] uppercase">Open Tasks</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-[#D94F4F]">{totalBlockers}</span>
                    <span className="text-[10px] text-[#9BA4A7] uppercase">Blockers</span>
                  </div>
                </div>
              </div>

              {/* Connected Projects Subgrid */}
              <div className="pt-2">
                <span className="block text-[10px] font-mono uppercase text-[#9BA4A7] font-semibold mb-2">
                  Connected Projects ({linkedProjects.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {linkedProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="p-3.5 bg-[#F7F6F2] hover:bg-[#EFF0EA] rounded-xl border border-[rgba(85,105,112,0.14)] cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: p.color || '#556970' }}
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1F2426] group-hover:text-[#556970] transition-colors truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#9BA4A7]">{p.code}</span>
                          </div>
                          <span className="text-[11px] font-['Source_Serif_4'] text-[#6B7477] truncate block">
                            {p.desc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-2">
                        <span className="text-xs font-mono font-bold text-[#556970]">{p.progress}%</span>
                        <ArrowRight className="w-4 h-4 text-[#9BA4A7] group-hover:text-[#1F2426] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
