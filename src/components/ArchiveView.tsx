import React, { useState } from 'react';
import { Project, Task, DeliveryTab, ArchiveAuditEntry } from '../types';
import { 
  Archive, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Download, 
  FolderKanban, 
  Clock, 
  Users, 
  ExternalLink,
  Lock,
  History,
  AlertCircle,
  X,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface ArchiveViewProps {
  projects: Project[];
  tasks: Task[];
  auditLog?: ArchiveAuditEntry[];
  onRestoreProject: (projectId: string) => void;
  onPurgeProject: (projectId: string) => void;
  onRestoreTask: (taskId: string) => void;
  onOpenBoard: (projectFilter?: string) => void;
  onNavigateToTab: (tab: DeliveryTab) => void;
  onShowToast: (msg: string) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  projects,
  tasks,
  auditLog = [],
  onRestoreProject,
  onPurgeProject,
  onRestoreTask,
  onOpenBoard,
  onNavigateToTab,
  onShowToast
}) => {
  const [activeSegment, setActiveSegment] = useState<'projects' | 'tasks' | 'audit'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'med' | 'low'>('all');
  const [selectedRetroProject, setSelectedRetroProject] = useState<Project | null>(null);
  const [projectToPurge, setProjectToPurge] = useState<Project | null>(null);

  // Derive archived projects and tasks
  const archivedProjects = projects.filter((p) => p.isArchived || p.status === 'archived');
  const archivedTasks = tasks.filter((t) => t.isArchived);

  // Filter archived projects
  const filteredProjects = archivedProjects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.owner.toLowerCase().includes(q) ||
      (p.archivedReason && p.archivedReason.toLowerCase().includes(q))
    );
  });

  // Filter archived tasks
  const filteredTasks = archivedTasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q) ||
      (t.project && t.project.toLowerCase().includes(q)) ||
      (t.labels && t.labels.some((l) => l.toLowerCase().includes(q)))
    );
  });

  // Calculate total preserved evidence files
  const totalEvidenceFiles = archivedProjects.reduce((acc, p) => acc + (p.evidenceLinked || 0), 0) +
    archivedTasks.reduce((acc, t) => acc + (t.evidence?.length || 0), 0);

  const handleExportFullArchive = () => {
    const archiveData = {
      exportedAt: new Date().toISOString(),
      vaultSummary: {
        totalArchivedProjects: archivedProjects.length,
        totalArchivedTasks: archivedTasks.length,
        totalEvidenceFiles,
        integrityStatus: 'SHA-256_VERIFIED'
      },
      archivedProjects,
      archivedTasks,
      auditLog
    };

    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaizen-os-archive-dossier-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Archive dossier exported successfully');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F7F6F2]">
      {/* Vault Header Strip */}
      <div className="px-6 py-5 bg-white border-b border-[rgba(85,105,112,0.14)] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[9.5px] font-mono tracking-widest uppercase text-[#9BA4A7]">
              <Lock className="w-3 h-3 text-[#ABA944]" />
              <span>Kaizen OS · Strategic Governance &amp; Cold Storage</span>
            </div>
            <h1 className="text-3xl font-['Agdasima'] font-bold text-[#1F2426] tracking-tight mt-0.5">
              Archive Vault &amp; Historical Records
            </h1>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] mt-1 max-w-2xl">
              Preserved repository for completed strategic initiatives, closed delivery projects, and archived sprint artifacts with immutable audit history.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleExportFullArchive}
              className="px-3.5 py-1.5 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.25)] text-[#556970] text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#556970]" />
              Export Dossier
            </button>

            <button
              type="button"
              onClick={() => onNavigateToTab('projects')}
              className="px-3.5 py-1.5 bg-[#556970] hover:bg-[#3E4F55] text-white text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#ABA944]" />
              Active Projects Workspace
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[rgba(85,105,112,0.1)]">
          <div className="p-2.5 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.1)]">
            <div className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-medium">Archived Projects</div>
            <div className="text-xl font-['Agdasima'] font-bold text-[#1F2426] flex items-center gap-2 mt-0.5">
              <span>{archivedProjects.length}</span>
              <span className="text-[10px] font-mono font-normal text-[#556970] bg-white px-1.5 py-0.2 rounded border border-[rgba(85,105,112,0.15)]">
                Cold storage
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.1)]">
            <div className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-medium">Archived Tasks</div>
            <div className="text-xl font-['Agdasima'] font-bold text-[#1F2426] flex items-center gap-2 mt-0.5">
              <span>{archivedTasks.length}</span>
              <span className="text-[10px] font-mono font-normal text-[#6DBB7A] bg-[#6DBB7A]/10 px-1.5 py-0.2 rounded">
                Delivered
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.1)]">
            <div className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-medium">Evidence Linked</div>
            <div className="text-xl font-['Agdasima'] font-bold text-[#1F2426] flex items-center gap-2 mt-0.5">
              <span>{totalEvidenceFiles}</span>
              <span className="text-[10px] font-mono font-normal text-[#8A8835] bg-[#8A8835]/10 px-1.5 py-0.2 rounded">
                Artifacts locked
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.1)]">
            <div className="text-[9.5px] font-mono uppercase text-[#9BA4A7] font-medium">Ledger Integrity</div>
            <div className="text-sm font-['Agdasima'] font-bold text-[#3B6D11] flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-[#3B6D11]" />
              <span>SHA-256 Immutable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-6 space-y-4">
        {/* Navigation Segments & Search Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[rgba(85,105,112,0.16)] shrink-0 shadow-2xs">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EFF0EA] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveSegment('projects')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeSegment === 'projects'
                  ? 'bg-white text-[#1F2426] font-bold shadow-xs'
                  : 'text-[#556970] hover:text-[#1F2426]'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#556970]" />
              <span>Archived Projects ({archivedProjects.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSegment('tasks')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeSegment === 'tasks'
                  ? 'bg-white text-[#1F2426] font-bold shadow-xs'
                  : 'text-[#556970] hover:text-[#1F2426]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#556970]" />
              <span>Archived Tasks ({archivedTasks.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSegment('audit')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                activeSegment === 'audit'
                  ? 'bg-white text-[#1F2426] font-bold shadow-xs'
                  : 'text-[#556970] hover:text-[#1F2426]'
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#556970]" />
              <span>Audit Log ({auditLog.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#9BA4A7] absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeSegment}...`}
                className="pl-8 pr-7 py-1.5 text-xs font-mono bg-[#EFF0EA] border border-transparent focus:border-[#556970] focus:bg-white rounded-md w-48 sm:w-64 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-xs text-[#9BA4A7] hover:text-[#1F2426]"
                >
                  ✕
                </button>
              )}
            </div>

            {activeSegment === 'tasks' && (
              <div className="flex items-center gap-1">
                {(['all', 'high', 'med', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2 py-1 text-[10px] font-mono rounded uppercase font-semibold transition-colors ${
                      priorityFilter === p
                        ? 'bg-[#556970] text-white'
                        : 'bg-[#EFF0EA] text-[#556970] hover:bg-[#D6D5C8]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Segment 1: Archived Projects */}
        {activeSegment === 'projects' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-[rgba(85,105,112,0.18)]">
                <Archive className="w-10 h-10 text-[#9BA4A7] mx-auto mb-3" />
                <h3 className="text-lg font-['Agdasima'] font-bold text-[#1F2426]">
                  {searchQuery ? 'No archived projects match your query' : 'No archived projects in vault'}
                </h3>
                <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-md mx-auto mt-1">
                  Projects moved to cold storage from the Projects Workspace appear here with full evidence dossiers and restore options.
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 px-3 py-1 bg-[#EFF0EA] text-xs font-mono rounded hover:bg-[#D6D5C8]"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] hover:border-[#7A9098] p-5 transition-all shadow-2xs space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: proj.color || '#9BA4A7' }} 
                        />
                        <h2 className="text-xl font-['Agdasima'] font-bold text-[#1F2426]">
                          {proj.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EFF0EA] text-[#556970]">
                          {proj.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono uppercase font-semibold bg-[#9BA4A7]/20 text-[#3D4447] flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Archived · {proj.archivedAt || 'Aug 2026'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-3xl">
                        {proj.desc}
                      </p>
                    </div>

                    {/* Final Progress Pill */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#9BA4A7] block">Final Delivery</span>
                        <span className="text-lg font-['Agdasima'] font-bold text-[#1F2426]">
                          {proj.progress}%
                        </span>
                      </div>
                      <div className="w-20 bg-[#EFF0EA] h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6DBB7A] rounded-full" 
                          style={{ width: `${proj.progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Archival metadata & reasoning banner */}
                  <div className="p-3 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#556970]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#3B6D11] shrink-0" />
                      <span>
                        <strong>Closure Justification:</strong> {proj.archivedReason || 'Initiative accepted and transitioned to operational maintenance.'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#9BA4A7] shrink-0">
                      <span>Owner: <strong className="text-[#1F2426]">{proj.owner}</strong></span>
                      <span>·</span>
                      <span>Evidence: <strong className="text-[#1F2426]">{proj.evidenceLinked} files</strong></span>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between pt-1 border-t border-[rgba(85,105,112,0.1)] flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRetroProject(proj)}
                        className="px-3 py-1.5 bg-[#556970]/10 hover:bg-[#556970]/20 text-[#3E4F55] text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#556970]" />
                        View Retrospective Dossier
                      </button>

                      <button
                        type="button"
                        onClick={() => onRestoreProject(proj.id)}
                        className="px-3 py-1.5 bg-[#6DBB7A]/15 hover:bg-[#6DBB7A]/25 border border-[#6DBB7A]/40 text-[#3B6D11] text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Restore to Active Workspace
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const projectDossier = JSON.stringify(proj, null, 2);
                          const blob = new Blob([projectDossier], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `archive-${proj.code.toLowerCase()}-dossier.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                          onShowToast(`Exported archive dossier for ${proj.name}`);
                        }}
                        className="px-2.5 py-1 text-xs font-mono text-[#556970] hover:text-[#1F2426] flex items-center gap-1 transition-colors"
                        title="Download Project Record"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export JSON
                      </button>

                      <button
                        type="button"
                        onClick={() => setProjectToPurge(proj)}
                        className="px-2.5 py-1 text-xs font-mono text-[#9BA4A7] hover:text-[#D94F4F] flex items-center gap-1 transition-colors"
                        title="Permanently remove from archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Purge Record
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Segment 2: Archived Tasks */}
        {activeSegment === 'tasks' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-[rgba(85,105,112,0.18)]">
                <FileText className="w-10 h-10 text-[#9BA4A7] mx-auto mb-3" />
                <h3 className="text-lg font-['Agdasima'] font-bold text-[#1F2426]">
                  {searchQuery ? 'No archived tasks match your filters' : 'No archived tasks in cold storage'}
                </h3>
                <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-md mx-auto mt-1">
                  Completed tasks retired from previous sprint cycles and historical delivery items are securely indexed here.
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-[rgba(85,105,112,0.18)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-[#7A9098] transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-[#556970]">
                        {task.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF0EA] text-[#556970]">
                        {task.project || 'Kaizen.os'}
                      </span>
                      <span className={`text-[9.5px] font-mono uppercase px-2 py-0.2 rounded-full font-bold ${
                        task.priority === 'high'
                          ? 'bg-[#D94F4F]/15 text-[#D94F4F]'
                          : task.priority === 'med'
                          ? 'bg-[#8A8835]/15 text-[#8A8835]'
                          : 'bg-[#556970]/15 text-[#556970]'
                      }`}>
                        {task.priority} priority
                      </span>
                      <span className="text-[10px] font-mono text-[#9BA4A7] flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Archived {task.archivedAt || 'Sprint 11'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-['Source_Serif_4'] text-[#1F2426]">
                      {task.title}
                    </h3>

                    {task.labels && task.labels.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        {task.labels.map((l) => (
                          <span
                            key={l}
                            className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-[#EFF0EA] text-[#556970]"
                          >
                            #{l}
                          </span>
                        ))}
                      </div>
                    )}

                    {task.evidence && task.evidence.length > 0 && (
                      <div className="text-[11px] font-mono text-[#6B7477] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3B6D11]" />
                        <span>Preserved Evidence: {task.evidence.join(' · ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRestoreTask(task.id)}
                      className="px-3 py-1.5 bg-[#6DBB7A]/15 hover:bg-[#6DBB7A]/25 border border-[#6DBB7A]/40 text-[#3B6D11] text-xs font-mono rounded-md font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Restore to Board
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Segment 3: Immutable Audit Log */}
        {activeSegment === 'audit' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="p-3 bg-white rounded-xl border border-[rgba(85,105,112,0.16)] text-xs font-mono text-[#556970] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B6D11]" />
                <span>Cold Storage Compliance Ledger · Cryptographically Verified</span>
              </div>
              <span className="text-[10px] text-[#9BA4A7]">All state transitions recorded</span>
            </div>

            {auditLog.map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 bg-white rounded-xl border border-[rgba(85,105,112,0.14)] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9.5px] uppercase font-bold ${
                      entry.action === 'archived'
                        ? 'bg-[#9BA4A7]/20 text-[#3D4447]'
                        : entry.action === 'restored'
                        ? 'bg-[#6DBB7A]/20 text-[#3B6D11]'
                        : entry.action === 'evidence_locked'
                        ? 'bg-[#8A8835]/20 text-[#8A8835]'
                        : 'bg-[#D94F4F]/20 text-[#D94F4F]'
                    }`}>
                      {entry.action.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-[#1F2426]">{entry.entityName}</span>
                    <span className="text-[#9BA4A7]">({entry.entityId})</span>
                  </div>

                  <span className="text-[#9BA4A7] text-[10.5px]">
                    {entry.timestamp}
                  </span>
                </div>

                <p className="text-[#6B7477] font-['Source_Serif_4'] text-xs">
                  {entry.notes}
                </p>

                <div className="flex items-center justify-between text-[10px] text-[#9BA4A7] pt-1 border-t border-[rgba(85,105,112,0.08)]">
                  <span>Authorized by: <strong className="text-[#556970]">{entry.user}</strong></span>
                  {entry.integrityHash && (
                    <span className="font-mono">{entry.integrityHash}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retrospective Details Modal */}
      {selectedRetroProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-[rgba(85,105,112,0.22)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#3E4F55] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="text-[9px] font-mono tracking-widest text-[#ABA944] uppercase">
                  Archived Initiative Retrospective
                </div>
                <h2 className="text-2xl font-['Agdasima'] font-bold text-white tracking-tight">
                  {selectedRetroProject.name} ({selectedRetroProject.code})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRetroProject(null)}
                className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="p-3 bg-[#F7F6F2] rounded-lg border border-[rgba(85,105,112,0.12)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#9BA4A7] font-bold block">
                  Archive Justification &amp; Sign-off
                </span>
                <p className="text-xs text-[#1F2426] font-['Source_Serif_4'] leading-relaxed">
                  {selectedRetroProject.archivedReason || 'Project achieved all planned stage-gate deliverables and passed executive steering committee acceptance.'}
                </p>
                <div className="text-[10.5px] font-mono text-[#556970] pt-1">
                  Archived on: <strong>{selectedRetroProject.archivedAt || 'Aug 15, 2026'}</strong> · Signed off by: <strong>{selectedRetroProject.archivedBy || selectedRetroProject.owner}</strong>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-[#556970] mb-2">
                  Delivered Scope Summary
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 bg-[#EFF0EA] rounded-lg">
                    <span className="block text-lg font-['Agdasima'] font-bold text-[#1F2426]">{selectedRetroProject.progress}%</span>
                    <span className="text-[#9BA4A7] text-[10px]">Completion</span>
                  </div>
                  <div className="p-2.5 bg-[#EFF0EA] rounded-lg">
                    <span className="block text-lg font-['Agdasima'] font-bold text-[#1F2426]">{selectedRetroProject.evidenceLinked}</span>
                    <span className="text-[#9BA4A7] text-[10px]">Evidence Files</span>
                  </div>
                  <div className="p-2.5 bg-[#EFF0EA] rounded-lg">
                    <span className="block text-lg font-['Agdasima'] font-bold text-[#1F2426]">{selectedRetroProject.team.join(' · ')}</span>
                    <span className="text-[#9BA4A7] text-[10px]">Team Pod</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-[#556970] mb-2">
                  Key Retrospective Observations
                </h4>
                <ul className="space-y-1.5 text-xs text-[#6B7477] font-['Source_Serif_4']">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#3B6D11] shrink-0 mt-0.5" />
                    <span>All acceptance criteria met with zero outstanding critical security risks or open blocker issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#3B6D11] shrink-0 mt-0.5" />
                    <span>Cryptographic evidence artifacts pinned into enterprise storage with tamper-proof version hash.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#3B6D11] shrink-0 mt-0.5" />
                    <span>Operational knowledge base handed off to core maintenance teams with runbook validation.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F7F6F2] border-t border-[rgba(85,105,112,0.12)] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  onRestoreProject(selectedRetroProject.id);
                  setSelectedRetroProject(null);
                }}
                className="px-4 py-2 bg-[#6DBB7A] hover:bg-[#5aa366] text-white text-xs font-mono rounded-md font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restore Project
              </button>

              <button
                type="button"
                onClick={() => setSelectedRetroProject(null)}
                className="px-4 py-2 bg-white hover:bg-[#EFF0EA] border border-[rgba(85,105,112,0.2)] text-[#556970] text-xs font-mono rounded-md transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Confirmation Modal */}
      {projectToPurge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2426]/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[rgba(85,105,112,0.22)] rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-[#D94F4F]">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-['Agdasima'] font-bold text-[#1F2426]">
                Confirm Permanent Purge
              </h3>
            </div>
            <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] leading-relaxed">
              Are you sure you want to permanently delete the archive record for <strong>{projectToPurge.name}</strong>? This action cannot be undone and will purge all linked audit metadata.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProjectToPurge(null)}
                className="px-3.5 py-1.5 bg-[#EFF0EA] text-[#556970] text-xs font-mono rounded-md hover:bg-[#D6D5C8]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onPurgeProject(projectToPurge.id);
                  setProjectToPurge(null);
                }}
                className="px-3.5 py-1.5 bg-[#D94F4F] hover:bg-[#B73C3C] text-white text-xs font-mono font-bold rounded-md transition-colors"
              >
                Permanently Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
