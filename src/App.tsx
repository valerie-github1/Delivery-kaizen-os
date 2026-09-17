import React, { useState, useEffect } from 'react';
import { 
  Task, 
  Project, 
  ActivityItem, 
  BacklogItem, 
  CapacityPerson, 
  ProjectFile, 
  DeliveryTab, 
  TaskStatus, 
  TaskPriority,
  CriterionState,
  Sprint,
  Portfolio,
  ArchiveAuditEntry
} from './types';
import { 
  initialTasks, 
  initialProjects, 
  initialPortfolios,
  initialSprints,
  initialActivity, 
  initialBacklog, 
  initialCapacity, 
  initialFiles,
  initialArchiveAuditLog
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { KanbanBoard } from './components/KanbanBoard';
import { DecisionRail } from './components/DecisionRail';
import { TaskDrawer } from './components/TaskDrawer';
import { EvidenceReviewModal } from './components/EvidenceReviewModal';
import { AttachEvidenceModal } from './components/AttachEvidenceModal';
import { ShareTaskModal } from './components/ShareTaskModal';
import { AskKairosModal } from './components/AskKairosModal';
import { SprintModal } from './components/SprintModal';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreatePortfolioModal } from './components/CreatePortfolioModal';
import { DashboardView } from './components/DashboardView';
import { PortfoliosView } from './components/PortfoliosView';
import { OverviewView } from './components/OverviewView';
import { ProjectsWorkspace } from './components/ProjectsWorkspace';
import { ArchiveView } from './components/ArchiveView';
import { SubtabViews } from './components/SubtabViews';
import { Toast } from './components/Toast';
import { 
  ChevronDown, 
  ChevronUp, 
  PanelRightClose, 
  PanelRightOpen, 
  Plus, 
  Flame, 
  Briefcase,
  FolderKanban
} from 'lucide-react';

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<DeliveryTab>('board');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data state
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [backlog, setBacklog] = useState<BacklogItem[]>(initialBacklog);
  const [capacity, setCapacity] = useState<CapacityPerson[]>(initialCapacity);
  const [files, setFiles] = useState<ProjectFile[]>(initialFiles);
  const [archiveAuditLog, setArchiveAuditLog] = useState<ArchiveAuditEntry[]>(initialArchiveAuditLog);

  // Active Context IDs
  const [activeProjectId, setActiveProjectId] = useState<string>('PRJ-KAIZEN');
  const [activeSprintId, setActiveSprintId] = useState<string>('sprint-12');

  // Board layout controls
  const [isDecisionRailOpen, setIsDecisionRailOpen] = useState(true);
  const [isMetricsCollapsed, setIsMetricsCollapsed] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [isPortfolioSubtabOpen, setIsPortfolioSubtabOpen] = useState(false);

  // Selected task for drawer & modals
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Modal visibility states
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAskKairosOpen, setIsAskKairosOpen] = useState(false);
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false);

  // Derived active records
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeSprint = sprints.find((s) => s.id === activeSprintId) || sprints[0];
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  // Helper toast dispatcher
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Helper activity appender
  const addActivity = (text: string, type: 'human' | 'agent' | 'system' = 'human') => {
    const item: ActivityItem = {
      id: 'act-' + Date.now(),
      author: 'VW',
      authorName: 'Valerie Wilcox',
      text,
      time: 'Just now',
      type
    };
    setActivity((prev) => [item, ...prev]);
  };

  // Global keyboard shortcuts (⌘K / Ctrl+K for Ask Kairos, Escape for closing)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAskKairosOpen(true);
      }
      if (e.key === 'Escape') {
        setIsAskKairosOpen(false);
        setIsAttachModalOpen(false);
        setIsShareModalOpen(false);
        setIsEvidenceModalOpen(false);
        setIsTaskDrawerOpen(false);
        setIsSprintModalOpen(false);
        setIsCreateProjectModalOpen(false);
        setIsCreatePortfolioModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Task Navigation & Open Handlers ---
  const handleOpenTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDrawerOpen(true);
  };

  const handleOpenEvidenceReview = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskDrawerOpen(false);
    setIsEvidenceModalOpen(true);
  };

  const handleOpenAttachEvidence = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsAttachModalOpen(true);
  };

  const handleOpenShareTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsShareModalOpen(true);
  };

  // --- Task CRUD Operations ---
  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, status: newStatus };
          if (newStatus === 'done' && !t.signal?.includes('Done')) {
            updated.signal = 'Completed with verification evidence';
          }
          return updated;
        }
        return t;
      })
    );
    const target = tasks.find((t) => t.id === taskId);
    addActivity(`VW moved ${taskId} (${target?.title || ''}) to ${newStatus}`);
    showToast(`Task ${taskId} moved to ${newStatus}`);
  };

  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setIsTaskDrawerOpen(false);
      setSelectedTaskId(null);
    }
    addActivity(`VW deleted delivery task ${taskId}`);
    showToast(`Deleted task ${taskId}`);
  };

  const handleEditTaskTitle = (taskId: string, currentTitle: string) => {
    const newTitle = window.prompt('Edit task title:', currentTitle);
    if (newTitle && newTitle.trim() && newTitle !== currentTitle) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, title: newTitle.trim() } : t))
      );
      addActivity(`VW renamed ${taskId} to "${newTitle.trim()}"`);
      showToast(`Updated task ${taskId}`);
    }
  };

  const handleCreateNewTask = (status: TaskStatus = 'todo', titleOverride?: string) => {
    const numbers = tasks.map((t) => Number(t.id.split('-').pop())).filter(Number.isFinite);
    const nextNum = Math.max(...numbers, 14) + 1;
    const newId = 'PAI-DEL-' + String(nextNum).padStart(3, '0');

    const newTask: Task = {
      id: newId,
      title: titleOverride || 'New delivery action item',
      status,
      priority: 'med',
      due: 'Aug 5',
      dueDateStr: '2026-08-05',
      owner: 'VW',
      ownerName: 'Valerie Wilcox',
      signal: 'Assigned in active sprint',
      type: 'human',
      project: activeProject?.name || 'Kaizen.os',
      sprintId: activeSprintId,
      desc: 'Define work contract, execution criteria, and attached evidence.',
      accept: [
        'Implementation criteria met per project design system',
        'Verification evidence attached and reviewed by delivery lead'
      ],
      evidence: [],
      subtasks: [
        { id: 'sub-1', title: 'Prepare execution outline', done: false },
        { id: 'sub-2', title: 'Run Kairos verification check', done: false }
      ]
    };

    setTasks((prev) => [newTask, ...prev]);
    addActivity(`VW created task ${newId} in ${status}`);
    showToast(`Created task ${newId}`);
    setSelectedTaskId(newId);
    setIsTaskDrawerOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    addActivity(`VW updated specification for ${updatedTask.id}`);
    showToast(`Saved changes for ${updatedTask.id}`);
  };

  // --- Evidence Review & Verification Handlers ---
  const handleVerifyEvidence = (taskId: string, notes: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedCriteria = (t.criteria || []).map((c) => ({
            ...c,
            state: 'Verified' as CriterionState
          }));
          return {
            ...t,
            status: 'done' as TaskStatus,
            evidenceVerified: true,
            signal: 'Human verified · all criteria satisfied',
            criteria: updatedCriteria
          };
        }
        return t;
      })
    );
    setIsEvidenceModalOpen(false);
    addActivity(`VW completed human verification for ${taskId}: "${notes || 'All criteria verified'}"`);
    showToast(`Evidence verified! ${taskId} moved to Done`);
  };

  const handleRequestChanges = (taskId: string, reason: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'progress' as TaskStatus,
            evidenceVerified: false,
            signal: `Changes requested: ${reason}`,
            type: 'human'
          };
        }
        return t;
      })
    );
    setIsEvidenceModalOpen(false);
    addActivity(`VW requested revisions on ${taskId}: ${reason}`);
    showToast(`Changes requested for ${taskId}`);
  };

  const handleAddEvidenceComment = (taskId: string, comment: string) => {
    addActivity(`VW commented on evidence for ${taskId}: "${comment}"`);
    showToast(`Comment posted to audit log`);
  };

  const handleReturnToTask = (taskId: string) => {
    setIsEvidenceModalOpen(false);
    setSelectedTaskId(taskId);
    setIsTaskDrawerOpen(true);
  };

  const handleUpdateCriterionState = (
    taskId: string,
    criterionId: string,
    newState: CriterionState
  ) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentCriteria = t.criteria || [];
          const updatedCriteria = currentCriteria.map((c) =>
            c.id === criterionId ? { ...c, state: newState } : c
          );
          return { ...t, criteria: updatedCriteria };
        }
        return t;
      })
    );
    showToast(`Criterion marked as "${newState}"`);
  };

  const handleAttachEvidence = (taskId: string, fileName: string, fileType: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentEvidence = t.evidence || [];
          return {
            ...t,
            evidence: [...currentEvidence, fileName],
            signal: `Evidence added: ${fileName}`
          };
        }
        return t;
      })
    );

    const newProjectFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name: fileName,
      type: fileType,
      size: '2.4 MB',
      updated: 'Just now',
      linkedTask: taskId
    };
    setFiles((prev) => [newProjectFile, ...prev]);

    setIsAttachModalOpen(false);
    addActivity(`VW attached evidence file "${fileName}" to ${taskId}`);
    showToast(`Attached ${fileName} to ${taskId}`);
  };

  const handleShareTask = (taskId: string, emails: string[], message?: string) => {
    setIsShareModalOpen(false);
    addActivity(`VW shared task ${taskId} with ${emails.join(', ')}`);
    showToast(`Task ${taskId} invitation sent`);
  };

  const handleCopyTaskLink = (taskId: string) => {
    showToast(`Direct link to ${taskId} copied to clipboard`);
  };

  const handleRequestTaskAccess = (taskId: string, email: string) => {
    addActivity(`Access requested for ${email} on task ${taskId}`);
    showToast(`Access request dispatched to administrator`);
  };

  const handleApproveCheckpoint = (taskId: string) => {
    handleMoveTask(taskId, 'done');
    showToast(`Checkpoint approved · ${taskId} marked as Done`);
  };

  // --- SPRINT TRANSITION & MANAGEMENT (Solves "How do we start the sprint to the next one") ---
  const handleStartNextSprint = (
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
  ) => {
    const nextSprintId = 'sprint-' + (sprints.length + 1);

    // 1. Mark completed sprint as completed
    const updatedSprints: Sprint[] = sprints.map((s) => {
      if (s.id === completedSprintId) {
        return { ...s, status: 'completed' as const, progress: 100 };
      }
      return s;
    });

    // 2. Add next sprint
    const newSprint: Sprint = {
      id: nextSprintId,
      number: sprints.length + 1,
      name: nextSprintData.name,
      goal: nextSprintData.goal,
      startDate: nextSprintData.startDate,
      endDate: nextSprintData.endDate,
      status: 'active',
      capacityStoryPoints: nextSprintData.capacityStoryPoints,
      completedStoryPoints: 0,
      progress: 0,
      taskIds: rolloverTaskIds
    };
    updatedSprints.unshift(newSprint);
    setSprints(updatedSprints);
    setActiveSprintId(nextSprintId);

    // 3. Move rollover tasks into the new sprint
    setTasks((prev) =>
      prev.map((t) => {
        if (rolloverTaskIds.includes(t.id)) {
          return {
            ...t,
            sprintId: nextSprintId,
            signal: `Rolled over from ${completedSprintId}`
          };
        }
        return t;
      })
    );

    // 4. Return rejected tasks to backlog
    if (returnToBacklogTaskIds.length > 0) {
      const returningTasks = tasks.filter((t) => returnToBacklogTaskIds.includes(t.id));
      const newBacklogItems: BacklogItem[] = returningTasks.map((t) => ({
        id: 'BKL-' + t.id.replace('PAI-DEL-', ''),
        title: t.title,
        priority: t.priority,
        pts: 5,
        reason: 'Moved back to backlog during sprint transition',
        agentConfidence: 85,
        project: t.project
      }));
      setBacklog((prev) => [...newBacklogItems, ...prev]);
      setTasks((prev) => prev.filter((t) => !returnToBacklogTaskIds.includes(t.id)));
    }

    // 5. Promote selected backlog items to the new sprint
    if (addedBacklogItemIds.length > 0) {
      const itemsToPromote = backlog.filter((b) => addedBacklogItemIds.includes(b.id));
      const promotedTasks: Task[] = itemsToPromote.map((b, idx) => {
        const nextNum = 20 + idx;
        return {
          id: 'PAI-DEL-' + String(nextNum).padStart(3, '0'),
          title: b.title,
          status: 'todo',
          priority: b.priority,
          due: nextSprintData.endDate,
          dueDateStr: '2026-08-14',
          owner: 'VW',
          ownerName: 'Valerie Wilcox',
          signal: `Committed to ${nextSprintData.name}`,
          type: 'agent',
          project: activeProject?.name || 'Kaizen.os',
          sprintId: nextSprintId,
          desc: b.reason,
          accept: ['Verification criteria defined for new sprint backlog item'],
          evidence: []
        };
      });
      setTasks((prev) => [...promotedTasks, ...prev]);
      setBacklog((prev) => prev.filter((b) => !addedBacklogItemIds.includes(b.id)));
    }

    addActivity(`VW completed Sprint 12 and officially launched ${nextSprintData.name}!`);
    showToast(`Sprint transition complete: Launched ${nextSprintData.name}`);
    setIsSprintModalOpen(false);
  };

  // --- Project & Portfolio Operations ---
  const handleCreateProject = (projectData: Partial<Project>) => {
    const newId = 'PRJ-' + (projectData.name?.replace(/\s+/g, '-').toUpperCase() || Date.now());
    const newP: Project = {
      id: newId,
      name: projectData.name || 'Untitled Project',
      code: projectData.code || 'PRJ',
      status: 'active',
      owner: 'Valerie Wilcox',
      dates: projectData.dates || 'Aug 15 — Sep 30',
      desc: projectData.desc || 'Strategic delivery initiative.',
      progress: 10,
      openTasks: 1,
      blockers: 0,
      evidenceLinked: 0,
      team: ['VW'],
      color: projectData.color || '#556970',
      health: 'On track',
      portfolioId: projectData.portfolioId
    };
    setProjects((prev) => [newP, ...prev]);
    setActiveProjectId(newP.id);
    addActivity(`VW created new project record: ${newP.name}`);
    showToast(`Project "${newP.name}" created and set active`);
  };

  const handleCreatePortfolio = (portfolioData: Partial<Portfolio>) => {
    const newPortfolio: Portfolio = {
      id: 'port-' + Date.now(),
      name: portfolioData.name || 'New Strategic Portfolio',
      description: portfolioData.description || 'Enterprise portfolio rollup',
      status: portfolioData.status || 'On track',
      progress: 15,
      projectIds: portfolioData.projectIds || [activeProjectId],
      owner: 'Valerie Wilcox',
      dates: 'Q3 — Q4 2026'
    };
    setPortfolios((prev) => [newPortfolio, ...prev]);
    addActivity(`VW created strategic portfolio: ${newPortfolio.name}`);
    showToast(`Portfolio "${newPortfolio.name}" established`);
  };

  const handleToggleArchiveProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    const willArchive = !target.isArchived && target.status !== 'archived';
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            isArchived: willArchive,
            status: willArchive ? 'archived' : 'active',
            archivedAt: willArchive ? nowStr : undefined,
            archivedReason: willArchive ? 'Archived by Valerie Wilcox via Projects Workspace' : undefined
          };
        }
        return p;
      })
    );

    const auditEntry: ArchiveAuditEntry = {
      id: `ARC-AUD-${Date.now().toString().slice(-4)}`,
      action: willArchive ? 'archived' : 'restored',
      entityType: 'project',
      entityId: projectId,
      entityName: target.name,
      timestamp: `${nowStr} · ${nowTimeStr}`,
      user: 'Valerie Wilcox (VW)',
      notes: willArchive 
        ? 'Project closed and moved to cold storage vault.'
        : 'Project restored to active workspace.',
      integrityHash: `sha256-${Math.random().toString(16).substring(2, 10)}`
    };

    setArchiveAuditLog((prev) => [auditEntry, ...prev]);
    showToast(willArchive ? `Archived "${target.name}" to Vault` : `Restored "${target.name}" to Active`);
  };

  const handleRestoreProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, isArchived: false, status: 'active', archivedAt: undefined, archivedReason: undefined };
        }
        return p;
      })
    );

    const auditEntry: ArchiveAuditEntry = {
      id: `ARC-AUD-${Date.now().toString().slice(-4)}`,
      action: 'restored',
      entityType: 'project',
      entityId: projectId,
      entityName: target.name,
      timestamp: `${nowStr} · ${nowTimeStr}`,
      user: 'Valerie Wilcox (VW)',
      notes: 'Initiative restored from cold storage back to active delivery workspace.',
      integrityHash: `sha256-${Math.random().toString(16).substring(2, 10)}`
    };

    setArchiveAuditLog((prev) => [auditEntry, ...prev]);
    showToast(`Restored "${target.name}" to active projects`);
  };

  const handlePurgeProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    const targetName = target?.name || projectId;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    setProjects((prev) => prev.filter((p) => p.id !== projectId));

    const auditEntry: ArchiveAuditEntry = {
      id: `ARC-AUD-${Date.now().toString().slice(-4)}`,
      action: 'purged',
      entityType: 'project',
      entityId: projectId,
      entityName: targetName,
      timestamp: `${nowStr} · ${nowTimeStr}`,
      user: 'Valerie Wilcox (VW)',
      notes: 'Project record permanently purged from system per compliance policy.',
      integrityHash: `sha256-${Math.random().toString(16).substring(2, 10)}`
    };

    setArchiveAuditLog((prev) => [auditEntry, ...prev]);
    showToast(`Permanently purged "${targetName}"`);
  };

  const handleRestoreTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    const targetTitle = target?.title || taskId;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, isArchived: false, status: 'done' };
        }
        return t;
      })
    );

    const auditEntry: ArchiveAuditEntry = {
      id: `ARC-AUD-${Date.now().toString().slice(-4)}`,
      action: 'restored',
      entityType: 'task',
      entityId: taskId,
      entityName: targetTitle,
      timestamp: `${nowStr} · ${nowTimeStr}`,
      user: 'Valerie Wilcox (VW)',
      notes: 'Task reactivated from cold storage into board history.',
      integrityHash: `sha256-${Math.random().toString(16).substring(2, 10)}`
    };

    setArchiveAuditLog((prev) => [auditEntry, ...prev]);
    showToast(`Restored task ${taskId} to board`);
  };

  const handleSetProjectStatus = (health: 'On track' | 'At risk' | 'Off track') => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, health } : p))
    );
    showToast(`Project status set to: ${health}`);
  };

  const handleToggleStarProject = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const nextVal = !p.isStarred;
          showToast(nextVal ? `Starred "${p.name}" as Favourite` : `Removed "${p.name}" from Favourites`);
          addActivity(`VW ${nextVal ? 'starred' : 'unstarred'} project ${p.name}`);
          return { ...p, isStarred: nextVal };
        }
        return p;
      })
    );
  };

  const handleTogglePinProject = (projectId: string) => {
    setProjects((prev) => {
      const target = prev.find((p) => p.id === projectId);
      const willPin = !target?.isPinned;
      showToast(willPin ? `Pinned & Isolated "${target?.name}" for Team Focus` : `Unpinned "${target?.name}"`);
      addActivity(`VW ${willPin ? 'pinned' : 'unpinned'} project ${target?.name} for isolation`);
      return prev.map((p) => {
        if (p.id === projectId) {
          return { ...p, isPinned: willPin };
        }
        return willPin ? { ...p, isPinned: false } : p;
      });
    });
  };

  // --- Backlog Operations ---
  const handlePromoteBacklog = (item: BacklogItem) => {
    const numbers = tasks.map((t) => Number(t.id.split('-').pop())).filter(Number.isFinite);
    const nextNum = Math.max(...numbers, 14) + 1;
    const newId = 'PAI-DEL-' + String(nextNum).padStart(3, '0');

    const newTask: Task = {
      id: newId,
      title: item.title,
      status: 'todo',
      priority: item.priority,
      due: 'Aug 8',
      dueDateStr: '2026-08-08',
      owner: 'VW',
      ownerName: 'Valerie Wilcox',
      signal: 'Promoted from Kairos backlog recommendation',
      type: 'agent',
      project: item.project,
      sprintId: activeSprintId,
      desc: item.reason,
      accept: [
        'Promotion reason is recorded in sprint log',
        'Supporting evidence and human checkpoint defined'
      ],
      evidence: []
    };

    setTasks((prev) => [newTask, ...prev]);
    setBacklog((prev) => prev.filter((b) => b.id !== item.id));
    addActivity(`VW accepted Kairos recommendation · promoted ${item.id} into ${newId}`);
    showToast(`${item.id} promoted to To Do as ${newId}`);
  };

  const handleDismissBacklog = (itemId: string) => {
    setBacklog((prev) => prev.filter((b) => b.id !== itemId));
    addActivity(`VW dismissed backlog recommendation ${itemId}`);
    showToast(`${itemId} dismissed · decision recorded`);
  };

  // --- Plan generation accepted ---
  const handlePlanAccepted = (taskData: Partial<Task>) => {
    const numbers = tasks.map((t) => Number(t.id.split('-').pop())).filter(Number.isFinite);
    const nextNum = Math.max(...numbers, 14) + 1;
    const newId = 'PAI-DEL-' + String(nextNum).padStart(3, '0');

    const newTask: Task = {
      id: newId,
      title: taskData.title || 'Kairos Delivery Item',
      status: 'todo',
      priority: taskData.priority || 'high',
      due: 'Aug 7',
      dueDateStr: taskData.dueDateStr || '2026-08-07',
      owner: taskData.owner || 'VW',
      ownerName: taskData.ownerName || 'Valerie Wilcox',
      signal: 'Kairos plan accepted · ready to execute',
      type: 'agent',
      project: taskData.project || activeProject?.name || 'Kaizen.os',
      sprintId: activeSprintId,
      desc: taskData.desc || '',
      accept: taskData.accept || ['Contract criteria defined'],
      evidence: taskData.evidence || ['Kairos plan contract · draft.md'],
      subtasks: taskData.subtasks || []
    };

    setTasks((prev) => [newTask, ...prev]);
    addActivity(`VW accepted Kairos proposal and created ${newId}`);
    showToast(`Plan accepted · ${newId} placed in To Do`);
    setTimeout(() => {
      setSelectedTaskId(newId);
      setIsTaskDrawerOpen(true);
    }, 150);
  };

  const handleSaveDraft = (draftNotes: string) => {
    addActivity(`VW saved plan draft: "${draftNotes.slice(0, 40)}..."`);
    showToast('Draft plan cached to Kairos memory');
  };

  const tabNames: Record<DeliveryTab, string> = {
    overview: 'Delivery / Overview',
    board: 'Delivery / Kanban Board',
    tasks: 'Delivery / Task Register',
    timeline: 'Delivery / Timeline',
    dashboard: 'Delivery / Health Dashboard & Charts',
    calendar: 'Delivery / Calendar',
    capacity: 'Delivery / Team Capacity & Workload',
    portfolios: 'Delivery / Strategic Portfolios',
    backlog: 'Delivery / Prioritised Backlog',
    mytask: 'Delivery / My Tasks',
    files: 'Delivery / Files & Evidence',
    projects: 'Delivery / Projects',
    archive: 'Delivery / Archive Vault'
  };

  // Subtab navigation items matching Asana structure
  const subtabs: { id: DeliveryTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'tasks', label: 'List' },
    { id: 'board', label: 'Board' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'capacity', label: 'Workload' },
    { id: 'portfolios', label: 'Portfolios' },
    { id: 'backlog', label: 'Backlog' },
    { id: 'files', label: 'Files' },
    { id: 'projects', label: 'Projects' },
    { id: 'archive', label: 'Archive' }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#F7F6F2] overflow-hidden text-[#1F2426]">
      {/* Left Global Sidebar with Multi-project Dropdown */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          showToast(`Active project changed`);
        }}
        onOpenCreateProject={() => setIsCreateProjectModalOpen(true)}
        onOpenAskKairos={() => setIsAskKairosOpen(true)}
        onShowToast={showToast}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header with Project selector, status pill, Sprint Manager trigger */}
        <Topbar
          currentTabName={tabNames[currentTab]}
          activeProject={activeProject}
          allProjects={projects}
          onSelectProject={(id) => setActiveProjectId(id)}
          activeSprint={activeSprint}
          onOpenSprintManager={() => setIsSprintModalOpen(true)}
          onSetProjectStatus={handleSetProjectStatus}
          onOpenAskKairos={() => setIsAskKairosOpen(true)}
          onAvatarClick={() => showToast('User profile: Valerie Wilcox (Super Admin)')}
          onShowToast={showToast}
        />

        {/* Subtab Navigation Bar */}
        <nav 
          className="flex items-center gap-0.5 px-6 border-b border-[rgba(85,105,112,0.12)] bg-[#EFF0EA] overflow-x-auto select-none shrink-0"
          aria-label="Delivery Views"
        >
          {subtabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-mono tracking-wider transition-all border-b-2 whitespace-nowrap ${
                currentTab === tab.id
                  ? 'border-[#556970] text-[#556970] font-bold bg-white/40'
                  : 'border-transparent text-[#9BA4A7] hover:text-[#1F2426] hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* View Surface Routing */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {currentTab === 'overview' ? (
            <OverviewView
              project={activeProject}
              tasks={tasks}
              onOpenTask={handleOpenTask}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onShowToast={showToast}
            />
          ) : currentTab === 'dashboard' ? (
            <DashboardView
              tasks={tasks}
              project={activeProject}
              activeSprint={activeSprint}
              capacity={capacity}
              onOpenSprintManager={() => setIsSprintModalOpen(true)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          ) : currentTab === 'portfolios' ? (
            <PortfoliosView
              portfolios={portfolios}
              projects={projects}
              onOpenCreatePortfolio={() => setIsCreatePortfolioModalOpen(true)}
              onSelectProject={(pId) => {
                setActiveProjectId(pId);
                setCurrentTab('board');
                showToast(`Switched active context to project`);
              }}
              onShowToast={showToast}
            />
          ) : currentTab === 'projects' ? (
            <ProjectsWorkspace
              projects={projects}
              onOpenBoard={(projFilter) => {
                setCurrentTab('board');
                showToast(projFilter ? `Filtering board by ${projFilter}` : 'Board opened');
              }}
              onOpenTimeline={() => setCurrentTab('timeline')}
              onToggleArchive={handleToggleArchiveProject}
              onCreateProject={() => setIsCreateProjectModalOpen(true)}
              onNavigateToArchive={() => setCurrentTab('archive')}
              onShowToast={showToast}
            />
          ) : currentTab === 'archive' ? (
            <ArchiveView
              projects={projects}
              tasks={tasks}
              auditLog={archiveAuditLog}
              onRestoreProject={handleRestoreProject}
              onPurgeProject={handlePurgeProject}
              onRestoreTask={handleRestoreTask}
              onOpenBoard={(projFilter) => {
                setCurrentTab('board');
                showToast(projFilter ? `Filtering board by ${projFilter}` : 'Board opened');
              }}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onShowToast={showToast}
            />
          ) : currentTab === 'board' ? (
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden min-h-0">
              {/* Page Landing Headline & Collapsible Summary Strip */}
              <div className="px-6 pt-4 pb-2 shrink-0 bg-white border-b border-[rgba(85,105,112,0.1)]">
                <div className="flex items-start justify-between gap-4 flex-wrap pb-2">
                  <div>
                    <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-[#9BA4A7] mb-1">
                      <span>{activeProject.code}</span>
                      <span>·</span>
                      <span>KANBAN BOARD</span>
                      <span>·</span>
                      <span className="text-[#556970] font-bold">{activeSprint.name}</span>
                    </div>
                    <h1 className="text-2xl font-['Agdasima'] font-bold text-[#3E4F55] tracking-tight">
                      Delivery, with the next decision already prepared.
                    </h1>
                    <p className="text-xs text-[#6B7477] font-['Source_Serif_4'] max-w-2xl mt-0.5 leading-relaxed">
                      Kairos is monitoring progress, capacity, evidence, and blockers. You decide what is consequential; the system handles coordination.
                    </p>
                  </div>

                  {/* Top Right Quick Controls: Toggle Rail & Collapse Metrics */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsMetricsCollapsed(!isMetricsCollapsed)}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#556970] hover:bg-[#EFF0EA] rounded-md transition-colors flex items-center gap-1 border border-[rgba(85,105,112,0.15)]"
                      title="Toggle metric summary banner"
                    >
                      {isMetricsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      <span>{isMetricsCollapsed ? 'Show Stats' : 'Compact'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsDecisionRailOpen(!isDecisionRailOpen)}
                      className="px-2.5 py-1 text-[11px] font-mono text-[#556970] hover:bg-[#EFF0EA] rounded-md transition-colors flex items-center gap-1 border border-[rgba(85,105,112,0.15)]"
                      title="Toggle right Decision Rail"
                    >
                      {isDecisionRailOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                      <span>{isDecisionRailOpen ? 'Wide Board' : 'Show Decisions'}</span>
                    </button>
                  </div>
                </div>

                {/* 4 Summary Strip Metrics (Can be collapsed for maximum vertical board space) */}
                {!isMetricsCollapsed && (
                  <section className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 pb-1 animate-in fade-in duration-200">
                    <div className="p-2.5 bg-white border border-[rgba(85,105,112,0.18)] border-l-3 border-l-[#8A8835] rounded-lg shadow-2xs">
                      <span className="text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold">Needs your decision</span>
                      <strong className="block text-xl font-['Agdasima'] font-bold text-[#1F2426] mt-0.5">3</strong>
                      <span className="text-[9px] font-mono text-[#9BA4A7]">approval · scope · trade-off</span>
                    </div>

                    <div className="p-2.5 bg-white border border-[rgba(85,105,112,0.18)] border-l-3 border-l-[#D94F4F] rounded-lg shadow-2xs">
                      <span className="text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold">Blocked</span>
                      <strong className="block text-xl font-['Agdasima'] font-bold text-[#D94F4F] mt-0.5">2</strong>
                      <span className="text-[9px] font-mono text-[#9BA4A7]">1 dependency · 1 permission</span>
                    </div>

                    <div className="p-2.5 bg-white border border-[rgba(85,105,112,0.18)] rounded-lg shadow-2xs">
                      <span className="text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold">Kairos is working</span>
                      <strong className="block text-xl font-['Agdasima'] font-bold text-[#1F2426] mt-0.5">7</strong>
                      <span className="text-[9px] font-mono text-[#9BA4A7]">4 safe · 3 awaiting evidence</span>
                    </div>

                    <div className="p-2.5 bg-white border border-[rgba(85,105,112,0.18)] rounded-lg shadow-2xs">
                      <span className="text-[9px] font-mono uppercase text-[#9BA4A7] font-semibold">Completed with evidence</span>
                      <strong className="block text-xl font-['Agdasima'] font-bold text-[#3B6D11] mt-0.5">
                        {tasks.filter((t) => t.status === 'done').length}
                      </strong>
                      <span className="text-[9px] font-mono text-[#9BA4A7]">this sprint · +18% vs last</span>
                    </div>
                  </section>
                )}
              </div>

              {/* Board Layout: Fully Scrollable Kanban + Optional Decision Rail */}
              <div className="flex-1 flex overflow-hidden min-h-0">
                <KanbanBoard
                  tasks={tasks}
                  onOpenTask={handleOpenTask}
                  onMoveTask={handleMoveTask}
                  onDeleteTask={handleDeleteTask}
                  onEditTaskTitle={handleEditTaskTitle}
                  onAddTask={(colStatus) => handleCreateNewTask(colStatus)}
                  onOpenAskKairos={() => setIsAskKairosOpen(true)}
                  onOpenSprintManager={() => setIsSprintModalOpen(true)}
                  activeSprintName={activeSprint.name}
                />

                {isDecisionRailOpen && (
                  <div className="hidden lg:flex flex-col w-80 shrink-0 border-l border-[rgba(85,105,112,0.14)] bg-[#F7F6F2] h-full min-h-0 overflow-hidden">
                    <DecisionRail
                      tasks={tasks}
                      onOpenTask={handleOpenTask}
                      onOpenEvidenceReview={handleOpenEvidenceReview}
                      onOpenBacklog={() => setCurrentTab('backlog')}
                      onAcceptTradeoff={() => {
                        addActivity('VW accepted Sprint 13 trade-off recommended by Kairos');
                        showToast('Sprint 13 trade-off accepted · decision recorded');
                      }}
                      onApproveDecision={(taskId) => {
                        handleMoveTask(taskId, 'done');
                        showToast(`${taskId} approved and moved to Done`);
                      }}
                      onShowAgentHistory={() => {
                        showToast('Opening Kairos activity audit history...');
                      }}
                      onShowToast={showToast}
                    />
                  </div>
                )}
              </div>

              {/* Bottom Activity Bar Ticker */}
              <footer className="h-8 bg-white border-t border-[rgba(85,105,112,0.12)] px-6 flex items-center gap-6 overflow-x-auto text-[10px] font-mono text-[#9BA4A7] shrink-0">
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6DBB7A]" />
                  <strong className="text-[#3D4447]">Precious</strong> moved PAI-DEL-008 to In Progress · 2m ago
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6DBB7A]" />
                  <strong className="text-[#3D4447]">Mayah</strong> updated design tokens · 12m ago
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6DBB7A]" />
                  <strong className="text-[#3D4447]">George</strong> commented on PAI-DEL-010 · 28m ago
                </span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ABA944]" />
                  <strong className="text-[#3D4447]">Kairos</strong> scored Sprint 13 trade-offs · 45m ago
                </span>
              </footer>
            </div>
          ) : (
            <SubtabViews
              currentTab={currentTab}
              tasks={tasks}
              backlog={backlog}
              capacity={capacity}
              files={files}
              onOpenTask={handleOpenTask}
              onOpenEvidenceReview={handleOpenEvidenceReview}
              onAddTask={(status) => handleCreateNewTask(status)}
              onPromoteBacklog={handlePromoteBacklog}
              onDismissBacklog={handleDismissBacklog}
              onToggleTaskComplete={(id) => {
                const target = tasks.find((t) => t.id === id);
                if (target) {
                  const nextStatus = target.status === 'done' ? 'progress' : 'done';
                  handleMoveTask(id, nextStatus);
                }
              }}
              onShowToast={showToast}
            />
          )}
        </div>
      </div>

      {/* Slide-out Task Detail Drawer */}
      <TaskDrawer
        isOpen={isTaskDrawerOpen}
        task={selectedTask}
        onClose={() => setIsTaskDrawerOpen(false)}
        onUpdateTask={handleUpdateTask}
        onOpenEvidenceReview={handleOpenEvidenceReview}
        onOpenAttachEvidence={handleOpenAttachEvidence}
        onOpenShareTask={handleOpenShareTask}
        onApproveCheckpoint={handleApproveCheckpoint}
      />

      {/* Complete Evidence Review and Verification Workspace */}
      <EvidenceReviewModal
        isOpen={isEvidenceModalOpen}
        task={selectedTask}
        onClose={() => setIsEvidenceModalOpen(false)}
        onVerifyEvidence={handleVerifyEvidence}
        onRequestChanges={handleRequestChanges}
        onAddComment={handleAddEvidenceComment}
        onReturnToTask={handleReturnToTask}
        onUpdateCriterionState={handleUpdateCriterionState}
      />

      {/* Attach Evidence Modal */}
      <AttachEvidenceModal
        isOpen={isAttachModalOpen}
        task={selectedTask}
        onClose={() => setIsAttachModalOpen(false)}
        onAttach={handleAttachEvidence}
      />

      {/* Share Task Modal */}
      <ShareTaskModal
        isOpen={isShareModalOpen}
        task={selectedTask}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShareTask}
        onCopyLink={handleCopyTaskLink}
        onRequestAccess={handleRequestTaskAccess}
      />

      {/* Ask Kairos Planning Modal */}
      <AskKairosModal
        isOpen={isAskKairosOpen}
        onClose={() => setIsAskKairosOpen(false)}
        onPlanAccepted={handlePlanAccepted}
        onSaveDraft={handleSaveDraft}
      />

      {/* Sprint Transition & Management Modal */}
      <SprintModal
        isOpen={isSprintModalOpen}
        activeSprint={activeSprint}
        currentSprint={activeSprint}
        allSprints={sprints}
        tasks={tasks}
        backlog={backlog}
        onClose={() => setIsSprintModalOpen(false)}
        onCompleteSprint={handleStartNextSprint}
        onSelectSprint={(sprintId) => {
          setActiveSprintId(sprintId);
          showToast(`Switched active view to sprint ${sprintId}`);
        }}
        onShowToast={showToast}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        portfolios={portfolios}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreatePortfolioModalOpen}
        projects={projects}
        onClose={() => setIsCreatePortfolioModalOpen(false)}
        onCreatePortfolio={handleCreatePortfolio}
      />

      {/* Global Toast Alerts */}
      <Toast message={toastMessage} />
    </div>
  );
}
