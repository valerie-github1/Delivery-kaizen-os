import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  Star, 
  Share2, 
  SlidersHorizontal, 
  Flame, 
  Plus,
  Check,
  Pin
} from 'lucide-react';
import { Project, Sprint } from '../types';

interface TopbarProps {
  currentTabName: string;
  activeProject?: Project;
  allProjects?: Project[];
  onSelectProject?: (projectId: string) => void;
  onToggleStarProject?: (projectId: string) => void;
  onTogglePinProject?: (projectId: string) => void;
  activeSprint?: Sprint;
  onOpenSprintManager?: () => void;
  onSetProjectStatus?: (status: 'On track' | 'At risk' | 'Off track') => void;
  onOpenAskKairos: () => void;
  onAvatarClick: () => void;
  onShowToast: (msg: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTabName,
  activeProject,
  allProjects = [],
  onSelectProject,
  onToggleStarProject,
  onTogglePinProject,
  activeSprint,
  onOpenSprintManager,
  onSetProjectStatus,
  onOpenAskKairos,
  onAvatarClick,
  onShowToast
}) => {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const projectName = activeProject?.name || 'Kaizen.os';
  const projectHealth = activeProject?.health || 'On track';
  const sprintName = activeSprint?.name || 'Sprint 12';
  const isStarred = !!activeProject?.isStarred;
  const isPinned = !!activeProject?.isPinned;

  const nonArchivedProjects = allProjects.filter(p => !p.isArchived && p.status !== 'archived');
  const favoriteProjects = nonArchivedProjects.filter(p => p.isStarred);
  const otherProjects = nonArchivedProjects.filter(p => !p.isStarred);

  return (
    <header className="h-13 bg-white border-b border-[rgba(85,105,112,0.14)] px-5 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left Project / Workspace Identity (matching Asana header from screenshot) */}
      <div className="flex items-center gap-2.5">
        {/* Project Icon & Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#EFF0EA] transition-colors group"
          >
            <div 
              className="w-5 h-5 rounded-md flex items-center justify-center text-white font-bold text-[10px] shrink-0"
              style={{ backgroundColor: activeProject?.color || '#3E4F55' }}
            >
              {projectName.substring(0, 1)}
            </div>
            <span className="font-['Agdasima'] text-xl font-bold text-[#1F2426] tracking-tight">
              {projectName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9BA4A7] group-hover:text-[#1F2426] transition-colors" />
          </button>

          {/* Project Dropdown Menu */}
          {isProjectDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-[rgba(85,105,112,0.18)] p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold flex items-center justify-between">
                <span>Switch Active Project</span>
                <span>{nonArchivedProjects.length} total</span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 mt-1">
                {/* Favorites Subgroup */}
                {favoriteProjects.length > 0 && (
                  <div>
                    <div className="px-2 py-0.5 text-[8.5px] font-mono uppercase text-[#ABA944] font-bold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-[#ABA944]" />
                      <span>Favourites ({favoriteProjects.length})</span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {favoriteProjects.map((p) => (
                        <div
                          key={p.id}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono transition-colors group ${
                            p.id === activeProject?.id
                              ? 'bg-[#556970]/10 font-bold text-[#1F2426]'
                              : 'hover:bg-[#EFF0EA] text-[#556970]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectProject) onSelectProject(p.id);
                              setIsProjectDropdownOpen(false);
                              onShowToast(`Switched active context to ${p.name}`);
                            }}
                            className="flex items-center gap-2 truncate flex-1 text-left"
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || '#556970' }} />
                            <span className="truncate">{p.name}</span>
                            {p.isPinned && (
                              <Pin className="w-2.5 h-2.5 text-[#8A8835] fill-[#ABA944] shrink-0" />
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onTogglePinProject) onTogglePinProject(p.id);
                              }}
                              className={`p-1 rounded transition-colors ${
                                p.isPinned ? 'text-[#8A8835]' : 'text-transparent group-hover:text-[#9BA4A7] hover:text-[#1F2426]'
                              }`}
                              title={p.isPinned ? 'Unpin project' : 'Pin to isolate & focus'}
                            >
                              <Pin className={`w-3 h-3 ${p.isPinned ? 'fill-[#ABA944]' : ''}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleStarProject) onToggleStarProject(p.id);
                              }}
                              className="p-1 rounded text-[#ABA944] hover:scale-110 transition-transform"
                              title="Remove from favourites"
                            >
                              <Star className="w-3 h-3 fill-[#ABA944]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Other Projects Subgroup */}
                <div>
                  {favoriteProjects.length > 0 && (
                    <div className="px-2 py-0.5 text-[8.5px] font-mono uppercase text-[#9BA4A7] font-semibold">
                      Other Projects
                    </div>
                  )}
                  <div className="space-y-0.5 mt-0.5">
                    {otherProjects.map((p) => (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono transition-colors group ${
                          p.id === activeProject?.id
                            ? 'bg-[#556970]/10 font-bold text-[#1F2426]'
                            : 'hover:bg-[#EFF0EA] text-[#556970]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectProject) onSelectProject(p.id);
                            setIsProjectDropdownOpen(false);
                            onShowToast(`Switched active context to ${p.name}`);
                          }}
                          className="flex items-center gap-2 truncate flex-1 text-left"
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color || '#556970' }} />
                          <span className="truncate">{p.name}</span>
                          {p.isPinned && (
                            <Pin className="w-2.5 h-2.5 text-[#8A8835] fill-[#ABA944] shrink-0" />
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onTogglePinProject) onTogglePinProject(p.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              p.isPinned ? 'text-[#8A8835]' : 'text-transparent group-hover:text-[#9BA4A7] hover:text-[#1F2426]'
                            }`}
                            title={p.isPinned ? 'Unpin project' : 'Pin to isolate & focus'}
                          >
                            <Pin className={`w-3 h-3 ${p.isPinned ? 'fill-[#ABA944]' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleStarProject) onToggleStarProject(p.id);
                            }}
                            className="p-1 rounded text-transparent group-hover:text-[#9BA4A7] hover:text-[#ABA944] hover:scale-110 transition-all"
                            title="Add to favourites"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Star / Favourite Project Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (activeProject && onToggleStarProject) {
              onToggleStarProject(activeProject.id);
            }
          }}
          className={`p-1.5 rounded-md transition-all ${
            isStarred 
              ? 'text-[#ABA944] bg-[#ABA944]/15 hover:bg-[#ABA944]/25 shadow-2xs' 
              : 'text-[#9BA4A7] hover:text-[#ABA944] hover:bg-[#EFF0EA]'
          }`}
          title={isStarred ? 'Favourited project (click to remove)' : 'Star as favourite project'}
        >
          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-[#ABA944]' : ''}`} />
        </button>

        {/* Pin / Isolate Project Button for focused team isolation */}
        <button
          type="button"
          onClick={() => {
            if (activeProject && onTogglePinProject) {
              onTogglePinProject(activeProject.id);
            }
          }}
          className={`px-2 py-1 rounded-md text-[10.5px] font-mono transition-all flex items-center gap-1.5 ${
            isPinned
              ? 'bg-[#556970] text-white font-bold shadow-2xs'
              : 'text-[#556970] hover:text-[#1F2426] hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.18)]'
          }`}
          title={isPinned ? 'Currently isolated & pinned (click to unpin)' : 'Pin project to isolate for your team'}
        >
          <Pin className={`w-3 h-3 ${isPinned ? 'fill-current text-[#ABA944]' : 'text-[#556970]'}`} />
          <span>{isPinned ? 'Isolated' : 'Pin Project'}</span>
        </button>

        {/* Set Status Pill Dropdown (matching Asana screenshot) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all ${
              projectHealth === 'On track'
                ? 'bg-[#6DBB7A]/20 text-[#3B6D11] hover:bg-[#6DBB7A]/30'
                : projectHealth === 'At risk'
                ? 'bg-[#E57A3C]/20 text-[#C45E20] hover:bg-[#E57A3C]/30'
                : 'bg-[#D94F4F]/20 text-[#D94F4F] hover:bg-[#D94F4F]/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              projectHealth === 'On track' ? 'bg-[#3B6D11]' : projectHealth === 'At risk' ? 'bg-[#C45E20]' : 'bg-[#D94F4F]'
            }`} />
            <span>{projectHealth}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-[rgba(85,105,112,0.18)] p-1.5 z-50">
              {(['On track', 'At risk', 'Off track'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    if (onSetProjectStatus) onSetProjectStatus(status);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-mono text-left hover:bg-[#EFF0EA] transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'On track' ? 'bg-[#6DBB7A]' : status === 'At risk' ? 'bg-[#E57A3C]' : 'bg-[#D94F4F]'
                  }`} />
                  <span>{status}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Member Avatars (matching Asana screenshot: pA, P, KI, +) */}
        <div className="hidden lg:flex items-center -space-x-1.5 pl-2">
          <div className="w-6 h-6 rounded-full bg-[#6B5B95] text-white font-mono font-bold text-[9.5px] flex items-center justify-center ring-2 ring-white" title="Precious (Delivery Lead)">
            P
          </div>
          <div className="w-6 h-6 rounded-full bg-[#3E4F55] text-white font-mono font-bold text-[9.5px] flex items-center justify-center ring-2 ring-white" title="Valerie Wilcox (Super Admin)">
            VW
          </div>
          <div className="w-6 h-6 rounded-full bg-[#6DBB7A] text-white font-mono font-bold text-[9.5px] flex items-center justify-center ring-2 ring-white" title="Mayah (Design QA)">
            MS
          </div>
          <div className="w-6 h-6 rounded-full bg-[#ABA944] text-[#1F2426] font-mono font-bold text-[9.5px] flex items-center justify-center ring-2 ring-white" title="Kairos (Autonomous Agent)">
            KI
          </div>
          <button 
            type="button"
            onClick={() => onShowToast('Invite collaborators to this project workspace')}
            className="w-6 h-6 rounded-full bg-[#EFF0EA] hover:bg-[#D6D5C8] text-[#556970] font-mono text-xs flex items-center justify-center ring-2 ring-white transition-colors"
            title="Add members"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Controls: Share, Sprint Manager, Customize, Kairos */}
      <div className="flex items-center gap-2.5">
        {/* Share Button */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText?.(window.location.href);
            onShowToast('Project link copied to clipboard');
          }}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#556970] hover:text-[#1F2426] hover:bg-[#EFF0EA] rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        {/* Sprint Transition Manager Trigger Button (Solves: "How do we start the sprint to the next one") */}
        <button
          type="button"
          onClick={onOpenSprintManager}
          className="flex items-center gap-2 font-mono text-[11px] text-[#1F2426] bg-[#EFF0EA] hover:bg-[#D6D5C8] px-3 py-1.5 rounded-full border border-[rgba(85,105,112,0.18)] transition-all shadow-2xs group"
          title="Click to manage sprint lifecycle or transition to next sprint"
        >
          <Flame className="w-3.5 h-3.5 text-[#ABA944] group-hover:scale-110 transition-transform" />
          <span className="font-bold">{sprintName}</span>
          <div className="w-12 h-1.5 bg-white rounded-full overflow-hidden hidden md:block">
            <div className="h-full bg-[#6DBB7A] rounded-full w-[58%]" />
          </div>
          <span className="text-[#3B6D11] font-bold text-[10px]">58%</span>
          <ChevronDown className="w-3 h-3 text-[#9BA4A7]" />
        </button>

        {/* Ask Kairos button */}
        <button
          type="button"
          onClick={onOpenAskKairos}
          className="px-2.5 py-1 text-xs font-mono text-[#556970] hover:text-[#1F2426] hover:bg-[#EFF0EA] rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ABA944]" />
          <span className="hidden sm:inline">⌘K Kairos</span>
        </button>

        {/* User avatar */}
        <button
          type="button"
          onClick={onAvatarClick}
          className="w-7 h-7 rounded-full bg-[#ABA944]/20 text-[#8A8835] font-mono font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-[#ABA944]/50 transition-all ml-1"
          title="Valerie Wilcox (Super Admin)"
        >
          VW
        </button>
      </div>
    </header>
  );
};
