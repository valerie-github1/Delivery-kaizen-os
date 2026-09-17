export type TaskStatus = 'todo' | 'progress' | 'review' | 'done';
export type TaskPriority = 'high' | 'med' | 'low';
export type TaskSignalType = 'agent' | 'human' | 'blocked' | 'checkpoint' | 'done';

export type CriterionState = 'Verified' | 'Needs review' | 'Missing' | 'verified' | 'review' | 'missing';

export interface TaskCriterion {
  id: string;
  title: string;
  state: CriterionState;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  due: string;
  dueDateStr?: string; // YYYY-MM-DD for calendar/timeline
  owner: string;
  ownerName: string;
  signal: string;
  type: TaskSignalType;
  desc: string;
  project?: string;
  accept: string[];
  evidence: string[];
  labels?: string[];
  isArchived?: boolean;
  archivedAt?: string;
  criteria?: TaskCriterion[];
  criteriaStates?: Record<number, CriterionState>;
  evidenceFile?: string;
  evidenceVerified?: boolean;
  subtasks?: { id?: string; title: string; done: boolean }[];
  comments?: { id: string; author: string; avatar: string; time: string; text: string }[];
  sprintId?: string;
}

export type ProjectStatus = 'active' | 'planning' | 'paused' | 'archived';

export interface Project {
  id: string;
  name: string;
  code: string;
  status: ProjectStatus;
  owner: string;
  dates: string;
  desc: string;
  progress: number;
  openTasks: number;
  blockers: number;
  evidenceLinked: number;
  team: string[];
  portfolioId?: string;
  color?: string;
  health?: 'On track' | 'At risk' | 'Off track';
  isStarred?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  archivedBy?: string;
}

export interface ArchiveAuditEntry {
  id: string;
  action: 'archived' | 'restored' | 'purged' | 'evidence_locked';
  entityType: 'project' | 'task';
  entityId: string;
  entityName: string;
  timestamp: string;
  user: string;
  notes: string;
  integrityHash?: string;
}

export interface Sprint {
  id: string;
  number: number;
  name: string;
  goal: string;
  status: 'active' | 'completed' | 'planning';
  startDate: string;
  endDate: string;
  targetPoints?: number;
  completedPoints?: number;
  capacityStoryPoints?: number;
  completedStoryPoints?: number;
  progress?: number;
  taskIds?: string[];
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  status: 'On track' | 'At risk' | 'Off track';
  owner: string;
  projectIds: string[];
  progress: number;
  dates: string;
}

export interface ActivityItem {
  id: string;
  author: string;
  authorName: string;
  text: string;
  time: string;
  type: 'human' | 'agent' | 'system';
}

export interface BacklogItem {
  id: string;
  title: string;
  reason: string;
  why?: string;
  whyNow?: string;
  displace?: string;
  who?: string;
  consequence?: string;
  priority: TaskPriority;
  effort?: string;
  requester?: string;
  project: string;
  pts?: number;
  agentConfidence?: number;
}

export interface CapacityPerson {
  code: string;
  name: string;
  role: string;
  capacityPct: number;
  band: '<70%' | '70–90%' | '>90%';
  tasks: string[];
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'MD' | 'FIG' | string;
  meta?: string;
  date?: string;
  owner?: string;
  size?: string;
  updated?: string;
  linkedTask?: string;
  linkTaskId?: string;
  contentSnippet?: string;
}

export type DeliveryTab = 
  | 'overview'
  | 'tasks' 
  | 'board' 
  | 'timeline' 
  | 'dashboard' 
  | 'calendar' 
  | 'capacity' 
  | 'portfolios'
  | 'backlog' 
  | 'mytask' 
  | 'files' 
  | 'projects'
  | 'archive';
