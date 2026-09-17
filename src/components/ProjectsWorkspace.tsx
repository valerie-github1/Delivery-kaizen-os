import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Archive, RefreshCw, ExternalLink, ShieldCheck, FolderKanban, Clock, Users, ArrowRight, Settings, Lock, Star, Pin } from 'lucide-react';

interface ProjectsWorkspaceProps {
  projects: Project[];
  onOpenBoard: (projectFilter?: string) => void;
  onOpenTimeline: () => void;
  onToggleArchive: (projectId: string) => void;
  onCreateProject: (projectData: Partial<Project>) => void;
  onToggleStar?: (projectId: string) => void;
  onTogglePin?: (projectId: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToArchive?: () => void;
}

export const ProjectsWorkspace: React.FC<ProjectsWorkspaceProps> = ({
  projects,
  onOpenBoard,
  onOpenTimeline,
  onToggleArchive,
  onCreateProject,
  onToggleStar,
  onTogglePin,
  onShowToast,
  onNavigateToArchive
}) => {
  const [expandedId, setExpandedId] = useState<string | null>('PRJ-KAIZEN');
  const [showNewModal, setShowNewModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'favorites' | 'active' | 'archived'>('all');

  // New project form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [dates, setDates] = useState('Aug 10 — Sep 30');
  const [owner, setOwner] = useState('Valerie Wilcox');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast('Please provide a project name.');
      return;
    }
    const newProj: Project = {
      id: 'PRJ-' + (code.trim() ? code.trim().toUpperCase() : String(Date.now()).slice(-4)),
      name: name.trim(),
      code: code.trim() ? code.trim().toUpperCase() : 'PRJ',
      status: 'active',
      owner,
      dates: dates.trim() || 'TBD',
      desc: desc.trim() || 'New strategic delivery initiative.',
      progress: 10,
      openTasks: 1,
      blockers: 0,
      evidenceLinked: 0,
      team: ['VW']
    };
    onCreateProject(newProj);
    setName('');
    setCode('');
    setDesc('');
    setShowNewModal(false);
  };

  const activeCount = projects.filter((p) => p.status !== 'archived' && !p.isArchived).length;
  const archivedCount = projects.filter((p) => p.status === 'archived' || p.isArchived).length;
  const favoritesCount = projects.filter((p) => !p.isArchived && p.isStarred).length;

  const displayedProjects = projects.filter((p) => {
    const isArchived = p.status === 'archived' || p.isArchived;
    if (statusFilter === 'favorites') return !isArchived && p.isStarred;
    if (statusFilter === 'active') return !isArchived;
    if (statusFilter === 'archived') return isArchived;
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(85,105,112,0.15)]">
        <div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-[#9BA4A7]">
            Kaizen OS · Strategic Portfolio
          </div>
          <h1 className="text-3xl font-['Agdasima'] font-bold text-[#3E4F55] tracking-tight">
            Projects Workspace
          </h1>
          <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] mt-0.5">
            The project governance layer above individual tasks — status, ownership, star favorites, and pinned team isolation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onNavigateToArchive && (
            <button
              type="button"
              onClick={onNavigateToArchive}
              className="px-3.5 py-1.5 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-[#ABA944]" />
              Archive Vault ({archivedCount})
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-lg tracking-wide rounded-md font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#ABA944]" />
            New project
          </button>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-[#EFF0EA]/80 p-2 rounded-lg border border-[rgba(85,105,112,0.12)]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-mono rounded-md font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-[#1F2426] shadow-xs'
                : 'text-[#556970] hover:text-[#1F2426]'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('favorites')}
            className={`px-3 py-1 text-xs font-mono rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'favorites'
                ? 'bg-white text-[#1F2426] shadow-xs'
                : 'text-[#556970] hover:text-[#1F2426]'
            }`}
          >
            <Star className="w-3 h-3 fill-[#ABA944] text-[#ABA944]" />
            Favourites ({favoritesCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 text-xs font-mono rounded-md font-semibold transition-all ${
              statusFilter === 'active'
                ? 'bg-white text-[#1F2426] shadow-xs'
                : 'text-[#556970] hover:text-[#1F2426]'
            }`}
          >
            Active Initiatives ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1 text-xs font-mono rounded-md font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'archived'
                ? 'bg-white text-[#1F2426] shadow-xs'
                : 'text-[#556970] hover:text-[#1F2426]'
            }`}
          >
            <Lock className="w-3 h-3 text-[#9BA4A7]" />
            Archived Records ({archivedCount})
          </button>
        </div>

        {statusFilter === 'archived' && onNavigateToArchive && (
          <button
            type="button"
            onClick={onNavigateToArchive}
            className="text-xs font-mono text-[#556970] hover:text-[#1F2426] underline flex items-center gap-1"
          >
            Open Cold Storage Vault &amp; Audit Trail <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {displayedProjects.map((proj) => {
          const isExpanded = expandedId === proj.id;
          const isArchived = proj.status === 'archived';

          return (
            <div
              key={proj.id}
              className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                isArchived
                  ? 'opacity-70 border-[rgba(85,105,112,0.15)]'
                  : 'border-[rgba(85,105,112,0.22)] hover:border-[#7A9098]'
              }`}
            >
              {/* Project Card Header */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                className="p-5 cursor-pointer hover:bg-[#F7F6F2]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Interactive Star toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleStar) onToggleStar(proj.id);
                      }}
                      className="p-1 rounded hover:bg-[#EFF0EA] transition-colors"
                      title={proj.isStarred ? 'Remove from favourites' : 'Star this project as favourite'}
                    >
                      <Star className={`w-4 h-4 ${proj.isStarred ? 'fill-[#ABA944] text-[#ABA944]' : 'text-[#9BA4A7] hover:text-[#ABA944]'}`} />
                    </button>

                    <span className={`w-2.5 h-2.5 rounded-full ${
                      proj.status === 'active'
                        ? 'bg-[#6DBB7A]'
                        : proj.status === 'paused'
                        ? 'bg-[#8A8835]'
                        : 'bg-[#9BA4A7]'
                    }`} />
                    <h2 className="text-xl font-['Agdasima'] font-bold text-[#1F2426]">
                      {proj.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EFF0EA] text-[#556970]">
                      {proj.code}
                    </span>

                    {/* Pin indicator and toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTogglePin) onTogglePin(proj.id);
                      }}
                      className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono flex items-center gap-1 transition-colors ${
                        proj.isPinned
                          ? 'bg-[#556970] text-white font-bold'
                          : 'bg-[#EFF0EA] text-[#9BA4A7] hover:text-[#1F2426]'
                      }`}
                      title={proj.isPinned ? 'Project is pinned & isolated for team (click to unpin)' : 'Pin project to isolate for team'}
                    >
                      <Pin className={`w-2.5 h-2.5 ${proj.isPinned ? 'fill-[#ABA944] text-[#ABA944]' : ''}`} />
                      <span>{proj.isPinned ? 'Pinned Focus' : 'Pin'}</span>
                    </button>

                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono uppercase font-semibold ${
                      proj.status === 'active'
                        ? 'bg-[#6DBB7A]/15 text-[#3B6D11]'
                        : proj.status === 'paused'
                        ? 'bg-[#8A8835]/15 text-[#8A8835]'
                        : 'bg-[#9BA4A7]/15 text-[#3D4447]'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-2xl">
                    {proj.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[10.5px] font-mono text-[#9BA4A7] pt-1">
                    <span>Owner: <strong className="text-[#3D4447]">{proj.owner}</strong></span>
                    <span>Dates: {proj.dates}</span>
                    <span>Open Tasks: <strong className="text-[#3D4447]">{proj.openTasks}</strong></span>
                    {proj.blockers > 0 && (
                      <span className="text-[#D94F4F] font-bold">
                        {proj.blockers} blocker risk
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar and toggle indicator */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#9BA4A7]">
                      <span>Progress</span>
                      <span className="font-bold text-[#1F2426]">{proj.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EFF0EA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ABA944] rounded-full transition-all"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#ABA944]/15 text-[#8A8835] font-mono font-bold text-xs flex items-center justify-center">
                    {proj.owner.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Project Overview (Collapsible / Drill-in) */}
              {isExpanded && (
                <div className="p-5 bg-[#F7F6F2] border-t border-[rgba(85,105,112,0.15)] space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-md border border-[rgba(85,105,112,0.12)]">
                      <span className="block text-[9px] font-mono uppercase text-[#9BA4A7]">Open Tasks</span>
                      <strong className="text-2xl font-['Agdasima'] font-bold text-[#1F2426]">
                        {proj.openTasks}
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-[rgba(85,105,112,0.12)]">
                      <span className="block text-[9px] font-mono uppercase text-[#9BA4A7]">Blockers</span>
                      <strong className={`text-2xl font-['Agdasima'] font-bold ${proj.blockers > 0 ? 'text-[#D94F4F]' : 'text-[#3B6D11]'}`}>
                        {proj.blockers}
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-[rgba(85,105,112,0.12)]">
                      <span className="block text-[9px] font-mono uppercase text-[#9BA4A7]">Evidence Linked</span>
                      <strong className="text-2xl font-['Agdasima'] font-bold text-[#8A8835]">
                        {proj.evidenceLinked}
                      </strong>
                    </div>

                    <div className="p-3 bg-white rounded-md border border-[rgba(85,105,112,0.12)]">
                      <span className="block text-[9px] font-mono uppercase text-[#9BA4A7]">Delivery Team</span>
                      <div className="text-sm font-['Agdasima'] font-bold text-[#1F2426] mt-1">
                        {proj.team.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(85,105,112,0.1)] flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenBoard(proj.name)}
                        className="px-3.5 py-1.5 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <FolderKanban className="w-3.5 h-3.5" />
                        Open board
                      </button>

                      <button
                        type="button"
                        onClick={onOpenTimeline}
                        className="px-3 py-1.5 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Open timeline
                      </button>

                      <button
                        type="button"
                        onClick={() => onShowToast(`Settings opened for ${proj.name}`)}
                        className="px-3 py-1.5 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleArchive(proj.id)}
                      className="px-3 py-1.5 text-xs font-mono text-[#9BA4A7] hover:text-[#D94F4F] flex items-center gap-1 transition-colors"
                    >
                      {isArchived ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reopen project
                        </>
                      ) : (
                        <>
                          <Archive className="w-3.5 h-3.5" />
                          Archive project
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[rgba(85,105,112,0.22)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#3E4F55] text-white flex items-center justify-between border-b border-white/10">
              <div>
                <div className="text-[9px] font-mono tracking-widest text-[#ABA944] uppercase">
                  Kaizen OS Delivery
                </div>
                <h2 className="text-xl font-['Agdasima'] font-bold tracking-tight text-white">
                  New Project Record
                </h2>
              </div>
              <button 
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 font-['Source_Serif_4'] text-[#1F2426]">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Website Redesign or Q4 Audit & Governance"
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none focus:border-[#556970]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                    Project Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. WEB or AUD"
                    className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                    Owner
                  </label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none"
                  >
                    <option>Valerie Wilcox</option>
                    <option>Precious Okafor</option>
                    <option>Mayah Sinclair</option>
                    <option>George Stavros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Target Dates
                </label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Aug 10 — Sep 30"
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[#556970] mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Outline the strategic outcome and core deliverables..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-[rgba(85,105,112,0.22)] rounded bg-[#F7F6F2] focus:bg-white focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-[rgba(85,105,112,0.12)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-[#556970] hover:bg-[#EFF0EA] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#556970] hover:bg-[#3E4F55] text-white font-['Agdasima'] text-base tracking-wide rounded font-bold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#ABA944]" />
                  Create project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
