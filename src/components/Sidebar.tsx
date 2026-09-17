import React, { useState } from 'react';
import { 
  Home, 
  Inbox, 
  Clock, 
  Kanban, 
  FolderKanban, 
  Briefcase,
  GitCommit, 
  Users, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Settings, 
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  CheckSquare,
  Star,
  Archive,
  Pin
} from 'lucide-react';
import { DeliveryTab, Project } from '../types';

interface SidebarProps {
  currentTab: DeliveryTab;
  onSelectTab: (tab: DeliveryTab) => void;
  projects?: Project[];
  activeProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  onToggleStarProject?: (projectId: string) => void;
  onTogglePinProject?: (projectId: string) => void;
  onOpenCreateProject?: () => void;
  onOpenAskKairos: () => void;
  onShowToast: (msg: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  projects = [],
  activeProjectId = 'PRJ-KAIZEN',
  onSelectProject,
  onToggleStarProject,
  onTogglePinProject,
  onOpenCreateProject,
  onOpenAskKairos,
  onShowToast
}) => {
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  const nonArchivedProjects = projects.filter(p => !p.isArchived && p.status !== 'archived');
  const favoriteProjects = nonArchivedProjects.filter(p => p.isStarred);
  const pinnedProject = nonArchivedProjects.find(p => p.isPinned);

  return (
    <aside className="w-56 shrink-0 bg-[#3E4F55] text-white flex flex-col justify-between select-none border-r border-white/5 font-mono text-xs">
      {/* Top Brand & Search */}
      <div className="p-3.5 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center p-0.5 border border-white/20">
              <div className="w-2.5 h-2.5 rounded-xs border border-[#ABA944] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#ABA944] rounded-2xs" />
              </div>
            </div>
            <div className="font-mono text-xs font-bold tracking-wider text-white">
              KAIZEN <span className="text-[#ABA944]">OS</span>
            </div>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#ABA944] font-bold">
            v2.4
          </span>
        </div>

        {/* Search trigger */}
        <button
          type="button"
          onClick={onOpenAskKairos}
          className="w-full py-1.5 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-left text-white/50 text-[10.5px] font-mono flex items-center gap-2 transition-colors group"
        >
          <Search className="w-3 h-3 group-hover:text-white/80" />
          <span>Search or ask Kairos...</span>
        </button>
      </div>

      {/* Main Scrollable Nav Links */}
      <div className="flex-1 overflow-y-auto px-2 space-y-3.5 text-xs font-mono">
        {/* TOP LEVEL NAVIGATION */}
        <div className="space-y-0.5">
          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'overview'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => onShowToast('Inbox: 4 unread Kairos stage-gate notifications')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#ABA944] text-[#1F2426] font-bold">
              4
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('mytask')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'mytask'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>My tasks</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('board')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'board'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Delivery Board</span>
          </button>
        </div>

        {/* PINNED FOCUS / ISOLATED WORKSPACE */}
        {pinnedProject && (
          <div className="bg-white/10 border border-[#ABA944]/40 rounded-lg p-2 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-[8.5px] uppercase tracking-wider text-[#ABA944] font-bold">
              <span className="flex items-center gap-1">
                <Pin className="w-2.5 h-2.5 fill-[#ABA944]" />
                <span>Isolated Workspace</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTogglePinProject) onTogglePinProject(pinnedProject.id);
                }}
                className="text-white/40 hover:text-white text-[10px] px-1"
                title="Unpin project isolation"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onSelectProject) onSelectProject(pinnedProject.id);
                onSelectTab('board');
              }}
              className="w-full text-left group"
            >
              <div className="flex items-center gap-1.5 font-bold text-white text-[11px] truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pinnedProject.color || '#3E4F55' }} />
                <span className="truncate group-hover:text-[#ABA944] transition-colors">{pinnedProject.name}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-white/60 mt-1 font-mono">
                <span>{pinnedProject.code} · {pinnedProject.progress}% Done</span>
                <span className="text-[#ABA944]">Team Pod ({pinnedProject.team.length})</span>
              </div>
            </button>
          </div>
        )}

        {/* FAVOURITES SECTION */}
        <div className="space-y-1 pt-0.5">
          <div className="flex items-center justify-between px-2.5 text-[8.5px] font-bold text-[#ABA944] tracking-widest uppercase">
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-[#ABA944]" />
              <span>FAVOURITES ({favoriteProjects.length})</span>
            </div>
          </div>

          {favoriteProjects.length > 0 ? (
            <div className="space-y-0.5 pl-1">
              {favoriteProjects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-all text-[11px] group ${
                      isActive
                        ? 'bg-white/20 text-white font-bold border-l-2 border-[#ABA944]'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectProject) onSelectProject(proj.id);
                        onSelectTab('board');
                      }}
                      className="flex items-center gap-2 truncate flex-1 text-left"
                    >
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: proj.color || '#6DBB7A' }} 
                      />
                      <span className="truncate">{proj.name}</span>
                    </button>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTogglePinProject) onTogglePinProject(proj.id);
                        }}
                        className={`p-0.5 rounded hover:text-white ${proj.isPinned ? 'text-[#ABA944]' : 'text-white/40'}`}
                        title={proj.isPinned ? 'Unpin focus' : 'Pin to isolate'}
                      >
                        <Pin className={`w-2.5 h-2.5 ${proj.isPinned ? 'fill-[#ABA944]' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleStarProject) onToggleStarProject(proj.id);
                        }}
                        className="p-0.5 text-[#ABA944] hover:scale-110 transition-transform"
                        title="Remove from favourites"
                      >
                        <Star className="w-2.5 h-2.5 fill-[#ABA944]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-2.5 py-1 text-[10px] text-white/40 italic">
              Star projects to access here
            </div>
          )}
        </div>

        {/* PROJECTS SECTION WITH EXPANDABLE DROPDOWN */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between px-2.5 text-[8.5px] font-bold text-white/50 tracking-widest uppercase">
            <button
              type="button"
              onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {isProjectsExpanded ? (
                <ChevronDown className="w-3 h-3 text-[#ABA944]" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <span>ALL PROJECTS ({nonArchivedProjects.length})</span>
            </button>

            {onOpenCreateProject && (
              <button
                type="button"
                onClick={onOpenCreateProject}
                className="p-0.5 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Create Project"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Expanded Projects List (Matching screenshot exactly) */}
          {isProjectsExpanded && (
            <div className="space-y-0.5 pl-1.5">
              {nonArchivedProjects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-all text-[11px] group ${
                      isActive
                        ? 'bg-white/20 text-white font-bold border-l-2 border-[#ABA944]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectProject) onSelectProject(proj.id);
                        if (currentTab !== 'board' && currentTab !== 'dashboard' && currentTab !== 'overview') {
                          onSelectTab('board');
                        }
                      }}
                      className="flex items-center gap-2 truncate flex-1 text-left"
                    >
                      <span 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: proj.color || '#6DBB7A' }} 
                      />
                      <span className="truncate">{proj.name}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTogglePinProject) onTogglePinProject(proj.id);
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          proj.isPinned ? 'text-[#ABA944]' : 'text-transparent group-hover:text-white/40 hover:text-white'
                        }`}
                        title={proj.isPinned ? 'Unpin project' : 'Pin to isolate for team'}
                      >
                        <Pin className={`w-2.5 h-2.5 ${proj.isPinned ? 'fill-[#ABA944]' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleStarProject) onToggleStarProject(proj.id);
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          proj.isStarred ? 'text-[#ABA944]' : 'text-transparent group-hover:text-white/40 hover:text-[#ABA944]'
                        }`}
                        title={proj.isStarred ? 'Remove from favourites' : 'Star as favourite'}
                      >
                        <Star className={`w-2.5 h-2.5 ${proj.isStarred ? 'fill-[#ABA944]' : ''}`} />
                      </button>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ABA944] shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => onSelectTab('projects')}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[10.5px] transition-colors ${
                  currentTab === 'projects'
                    ? 'text-[#ABA944] font-bold'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                <FolderKanban className="w-3 h-3" />
                <span>View all project records →</span>
              </button>
            </div>
          )}
        </div>

        {/* WORKSPACE VIEWS SHORTCUT */}
        <div className="space-y-0.5 pt-1">
          <div className="px-2.5 text-[8.5px] font-bold text-white/40 tracking-widest uppercase">
            VIEWS
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'dashboard'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ABA944]" />
            <span>Dashboard &amp; Charts</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('timeline')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'timeline'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Timeline / Gantt</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('calendar')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'calendar'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('capacity')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'capacity'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Workload / Capacity</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('archive')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors text-left ${
              currentTab === 'archive'
                ? 'bg-white/15 text-white font-semibold border-l-3 border-[#ABA944]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-3.5 h-3.5 text-[#ABA944]" />
              <span>Archive Vault</span>
            </div>
            {projects && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/15 text-white/90">
                {projects.filter(p => p.isArchived || p.status === 'archived').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Profile & AI Status */}
      <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[10px] text-white/50">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ABA944] animate-pulse" />
            <span className="text-[#ABA944] font-semibold">Kairos Active</span>
          </div>
          <span>Model: 2.5 Pro</span>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('Workspace Settings: PhoennixAI / Kaizen OS')}
          className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-white/5 transition-colors text-white/70 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#ABA944]/20 text-[#ABA944] font-bold text-[10px] flex items-center justify-center">
              VW
            </div>
            <span className="text-[11px] font-semibold">Valerie Wilcox</span>
          </div>
          <Settings className="w-3 h-3 text-white/40" />
        </button>
      </div>
    </aside>
  );
};
