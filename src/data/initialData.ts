import { Task, Project, ActivityItem, BacklogItem, CapacityPerson, ProjectFile, Sprint, Portfolio, ArchiveAuditEntry } from '../types';

// Compute dynamic dates relative to current system time for active sprint tasks
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const tomorrowLabel = tomorrow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const inTwoDays = new Date(now.getTime() + 40 * 60 * 60 * 1000);
const inTwoDaysStr = inTwoDays.toISOString().split('T')[0];
const inTwoDaysLabel = inTwoDays.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const initialTasks: Task[] = [
  {
    id: 'PAI-DEL-012',
    title: 'Implement notification preferences panel',
    status: 'todo',
    priority: 'med',
    due: `${tomorrowLabel} · 24h`,
    dueDateStr: tomorrowStr,
    owner: 'MS',
    ownerName: 'Mayah Sinclair',
    signal: 'Kairos drafted UI states',
    type: 'agent',
    project: 'Kaizen.os',
    labels: ['UI/UX', 'Preferences', 'Notifications'],
    desc: 'Prepare the notification preference model for Inbox and Messages. Include document assignment, task escalation, and agent checkpoint categories.',
    accept: [
      'Preferences cover employee, project, and agent events',
      'Changes produce an auditable activity event'
    ],
    evidence: ['Notification taxonomy.md', 'Prototype states checklist.md'],
    criteriaStates: { 0: 'verified', 1: 'review' },
    subtasks: [
      { title: 'Taxonomy specification review', done: true },
      { title: 'State management bindings', done: false },
      { title: 'Audit event emission hook', done: false }
    ],
    comments: [
      { id: 'c1', author: 'MS', avatar: 'MS', time: 'Aug 1 at 14:20', text: 'Drafting the category schema for Valerie to review.' }
    ]
  },
  {
    id: 'PAI-DEL-013',
    title: 'Pipeline stage gate automation rules',
    status: 'todo',
    priority: 'high',
    due: 'Aug 3',
    dueDateStr: '2026-08-03',
    owner: 'GS',
    ownerName: 'George Stavros',
    signal: 'Blocked by policy decision',
    type: 'blocked',
    project: 'Kaizen.os',
    labels: ['Policy', 'Governance', 'Automation'],
    desc: 'Define stage-gate transitions and the evidence required before a pipeline opportunity can move forward.',
    accept: [
      'Every gate has an owner and evidence rule',
      'Exceptions route to a human checkpoint'
    ],
    evidence: ['Pipeline-Gate-Spec.pdf'],
    criteriaStates: { 0: 'review', 1: 'missing' },
    subtasks: [
      { title: 'Review Gate 1 & 2 requirements', done: true },
      { title: 'Define escalation pathway', done: false }
    ]
  },
  {
    id: 'PAI-DEL-014',
    title: 'Onboarding checklist progress persistence',
    status: 'todo',
    priority: 'low',
    due: 'Aug 6',
    dueDateStr: '2026-08-06',
    owner: 'PO',
    ownerName: 'Precious Okafor',
    signal: 'Kairos is preparing test matrix',
    type: 'agent',
    project: 'Onboarding',
    labels: ['Onboarding', 'Persistence', 'Frontend'],
    desc: 'Persist onboarding progress so new-joiner tasks can be resumed across sessions and reflected in Delivery.',
    accept: [
      'Progress survives refresh and device change',
      'Incomplete steps create visible exceptions'
    ],
    evidence: ['ONB-002 acceptance notes.md'],
    criteriaStates: { 0: 'verified', 1: 'review' },
    subtasks: [
      { title: 'Local session mirror store', done: true },
      { title: 'Cross-tab synchronization', done: false }
    ]
  },
  {
    id: 'PAI-DEL-008',
    title: 'Auth screens QA — triple-tab login breakpoints',
    status: 'progress',
    priority: 'high',
    due: 'Jul 31 !',
    dueDateStr: '2026-07-31',
    owner: 'PO',
    ownerName: 'Precious Okafor',
    signal: 'Human review required',
    type: 'human',
    project: 'Kaizen.os',
    labels: ['QA', 'Authentication', 'UI/UX'],
    desc: 'Verify authentication screens across desktop, tablet, and phone breakpoints, including the invite-required state.',
    accept: [
      'All breakpoints pass visual regression',
      'Invite-required state is visible and accessible',
      'WCAG AA contrast pass on both tabs'
    ],
    evidence: ['Auth-Screens-v3.fig', 'QA run 31 Jul.md'],
    criteriaStates: { 0: 'verified', 1: 'review', 2: 'review' },
    subtasks: [
      { title: 'Desktop & Tablet inspection', done: true },
      { title: 'Mobile invite-required state pass', done: true },
      { title: 'Accessibility screen reader check', done: false }
    ]
  },
  {
    id: 'PAI-DEL-009',
    title: 'Design system token migration (olive → slate)',
    status: 'progress',
    priority: 'high',
    due: 'Aug 1',
    dueDateStr: '2026-08-01',
    owner: 'MS',
    ownerName: 'Mayah Sinclair',
    signal: 'Kairos completed comparison',
    type: 'agent',
    project: 'Kaizen.os',
    labels: ['Design System', 'Tokens', 'UI/UX'],
    desc: 'Migrate shared tokens to the approved PhoennixAI / Kaizen OS system without disrupting workflow states.',
    accept: [
      'No contrast regressions in neutral scale',
      'Old token usage is reported and mapped'
    ],
    evidence: ['Token diff report.md'],
    criteriaStates: { 0: 'verified', 1: 'review' },
    subtasks: [
      { title: 'Token mapping table', done: true },
      { title: 'Replace legacy olive variables with slate', done: true },
      { title: 'Visual diff smoke test', done: false }
    ]
  },
  {
    id: 'PAI-DEL-010',
    title: 'API layer — NVIDIA NIM integration scaffold',
    status: 'progress',
    priority: 'med',
    due: `${inTwoDaysLabel} · 40h`,
    dueDateStr: inTwoDaysStr,
    owner: 'GS',
    ownerName: 'George Stavros',
    signal: 'Awaiting permission',
    type: 'blocked',
    project: 'Kaizen.os',
    labels: ['Backend', 'AI/LLM', 'Security'],
    desc: 'Create the integration scaffold for agent calls with a clear boundary between safe internal actions and human approval.',
    accept: [
      'Agent calls are traceable with audit logs',
      'Secrets remain strictly server-side'
    ],
    evidence: ['NVIDIA-NIM-Integration.md'],
    criteriaStates: { 0: 'review', 1: 'missing' },
    subtasks: [
      { title: 'Scaffold route handlers', done: true },
      { title: 'OAuth token proxy verification', done: false }
    ]
  },
  {
    id: 'PAI-DEL-006',
    title: 'ONB-002 stepper component — final QA',
    status: 'review',
    priority: 'high',
    due: 'Jul 31',
    dueDateStr: '2026-07-31',
    owner: 'VW',
    ownerName: 'Valerie Wilcox',
    signal: 'Ready for your review',
    type: 'checkpoint',
    project: 'Kaizen.os',
    labels: ['QA', 'Onboarding', 'Accessibility'],
    desc: 'Review the onboarding stepper for visual accuracy, accessibility, and responsive behaviour. Check INVITE_REQUIRED on Staff tab.',
    accept: [
      'Staff tab passes triple-breakpoint test',
      'Client tab INVITE_REQUIRED fallback confirmed',
      'WCAG AA contrast pass on both tabs'
    ],
    evidence: ['ONB-002 QA checklist.md', 'PAI-DES-001 · source spec'],
    criteriaStates: { 0: 'verified', 1: 'review', 2: 'review' },
    subtasks: [
      { title: 'Verify triple-tab login across breakpoints', done: true },
      { title: 'Check INVITE_REQUIRED fallback state', done: true },
      { title: 'Confirm CRM validation on Account Identifier', done: false }
    ],
    comments: [
      { id: 'c1', author: 'PO', avatar: 'PO', time: 'Jul 31 at 10:18', text: 'Stepper is wired and passing all breakpoint tests. Ready for your eyes.' },
      { id: 'c2', author: 'VW', avatar: 'VW', time: 'Jul 31 at 10:26', text: 'Looking at it now. Will check the Staff tab edge case.' }
    ]
  },
  {
    id: 'PAI-DEL-007',
    title: 'Employee handbook policy document (PAI-POL-001)',
    status: 'review',
    priority: 'med',
    due: 'Aug 1',
    dueDateStr: '2026-08-01',
    owner: 'VW',
    ownerName: 'Valerie Wilcox',
    signal: '2 comments unresolved',
    type: 'human',
    project: 'People policies',
    labels: ['Policy', 'Governance', 'Legal'],
    desc: 'Resolve the final comments on the employee handbook before issuing the version-pinned acknowledgement package.',
    accept: [
      'Comments resolved across §3 & §7',
      'Version 2.3 is approved by Super Admin',
      'Acknowledgement request form package is ready'
    ],
    evidence: ['PAI-POL-001-Handbook.docx', 'Comment thread #18'],
    criteriaStates: { 0: 'review', 1: 'review', 2: 'missing' },
    subtasks: [
      { title: 'Review parental leave amendment (§3.4)', done: true },
      { title: 'Confirm remote security protocol (§7.2)', done: false },
      { title: 'Generate acknowledgement packet', done: false }
    ],
    comments: [
      { id: 'c1', author: 'VW', avatar: 'VW', time: 'Aug 1 at 09:12', text: 'Two sections require minor clarifications on device security.' }
    ]
  },
  {
    id: 'PAI-DEL-003',
    title: 'Pre-acquisition portal flow',
    status: 'done',
    priority: 'low',
    due: 'Jul 28 ✓',
    dueDateStr: '2026-07-28',
    owner: 'PO',
    ownerName: 'Precious Okafor',
    signal: 'Completed with evidence',
    type: 'done',
    project: 'Client delivery',
    labels: ['Client Delivery', 'Portal', 'Strategy'],
    desc: 'Complete the pre-acquisition portal flow and record the accepted outcome in client records.',
    accept: [
      'Journey reviewed across stakeholders',
      'Evidence linked to Meridian Corp project file'
    ],
    evidence: ['Journey map.pdf'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [
      { title: 'Stakeholder alignment sign-off', done: true },
      { title: 'Export journey map PDF', done: true }
    ]
  },
  {
    id: 'PAI-DEL-004',
    title: 'Sidebar collapsed state implementation',
    status: 'done',
    priority: 'low',
    due: 'Jul 29 ✓',
    dueDateStr: '2026-07-29',
    owner: 'GS',
    ownerName: 'George Stavros',
    signal: 'Completed with evidence',
    type: 'done',
    project: 'Kaizen.os',
    labels: ['Frontend', 'Navigation', 'Keyboard'],
    desc: 'Implement and validate the collapsed navigation state for Kaizen OS workbench.',
    accept: [
      'Keyboard navigation path passes',
      'Responsive view verified on 1024px and 1280px'
    ],
    evidence: ['Sidebar QA.md'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [
      { title: 'Shortcut toggle ⌘B implementation', done: true },
      { title: 'Tooltip trigger check on collapsed icons', done: true }
    ]
  },
  {
    id: 'PAI-DEL-005',
    title: 'New joiner onboarding walkthrough screens',
    status: 'done',
    priority: 'low',
    due: 'Jul 30 ✓',
    dueDateStr: '2026-07-30',
    owner: 'MS',
    ownerName: 'Mayah Sinclair',
    signal: 'Completed with evidence',
    type: 'done',
    project: 'Onboarding',
    labels: ['Onboarding', 'Design System', 'Walkthrough'],
    desc: 'Complete the new-joiner walkthrough screens in the design library.',
    accept: [
      'All 4 step screens approved by Valerie Wilcox',
      'Design evidence linked in Files'
    ],
    evidence: ['Onboarding walkthrough.fig'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [
      { title: 'Figma layout tokens updated', done: true },
      { title: 'Walkthrough copy signed off', done: true }
    ]
  },
  {
    id: 'PAI-ARC-001',
    title: 'Legacy CSS variable deprecation & olive cleanup',
    status: 'done',
    priority: 'med',
    due: 'Jul 20 ✓',
    dueDateStr: '2026-07-20',
    owner: 'MS',
    ownerName: 'Mayah Sinclair',
    signal: 'Archived in cold storage',
    type: 'done',
    project: 'Legacy Token v1.9 Migration',
    labels: ['CSS', 'Design System', 'Cleanup'],
    isArchived: true,
    archivedAt: 'Jul 20, 2026',
    desc: 'Clean up and freeze legacy CSS variables across v1.9 build artifacts.',
    accept: ['All legacy variables documented', 'No residual references in components'],
    evidence: ['CSS-Deprecation-Summary.md'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [{ title: 'CSS audit', done: true }]
  },
  {
    id: 'PAI-ARC-002',
    title: 'Meridian stakeholder alignment & dataroom sign-off',
    status: 'done',
    priority: 'high',
    due: 'Aug 10 ✓',
    dueDateStr: '2026-08-10',
    owner: 'VW',
    ownerName: 'Valerie Wilcox',
    signal: 'Archived in cold storage',
    type: 'done',
    project: 'Meridian Corp Acquisition Portal',
    labels: ['Client Delivery', 'Stakeholder', 'Governance'],
    isArchived: true,
    archivedAt: 'Aug 15, 2026',
    desc: 'Formal stakeholder sign-off on pre-acquisition portal requirements and acceptance criteria.',
    accept: ['All executive stakeholders signed off', 'Legal counsel greenlight received'],
    evidence: ['Meridian-Signoff-Memo.pdf'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [{ title: 'Executive alignment meeting', done: true }]
  },
  {
    id: 'PAI-ARC-003',
    title: 'Q2 Security penetration test dossier and remediation',
    status: 'done',
    priority: 'high',
    due: 'Jul 15 ✓',
    dueDateStr: '2026-07-15',
    owner: 'GS',
    ownerName: 'George Stavros',
    signal: 'Archived in cold storage',
    type: 'done',
    project: 'Kaizen.os',
    labels: ['Security', 'Audit', 'Compliance'],
    isArchived: true,
    archivedAt: 'Jul 16, 2026',
    desc: 'Complete Q2 third-party penetration testing report and address all low/medium findings.',
    accept: ['Remediation report submitted', 'Clean re-test verified by secops'],
    evidence: ['Q2-PenTest-Dossier.pdf'],
    criteriaStates: { 0: 'verified', 1: 'verified' },
    subtasks: [{ title: 'Pen test scope definition', done: true }]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'PRJ-KAIZEN',
    name: 'Kaizen.os',
    code: 'KZN',
    status: 'active',
    owner: 'Valerie Wilcox',
    dates: 'Jul 01 — Aug 30',
    desc: 'Internal operating system delivery across product, people, and evidence.',
    progress: 58,
    openTasks: 9,
    blockers: 1,
    evidenceLinked: 6,
    team: ['VW', 'PO', 'MS', 'GS'],
    portfolioId: 'port-1',
    color: '#3E4F55',
    health: 'On track',
    isStarred: true,
    isPinned: true
  },
  {
    id: 'PRJ-PHANTOM',
    name: 'Phantom Studio',
    code: 'PHT',
    status: 'active',
    owner: 'Precious Okafor',
    dates: 'Aug 01 — Sep 28',
    desc: 'Interactive virtual production and real-time CGI visual pipeline.',
    progress: 42,
    openTasks: 5,
    blockers: 0,
    evidenceLinked: 3,
    team: ['PO', 'MS'],
    portfolioId: 'port-2',
    color: '#6B5B95',
    health: 'On track',
    isStarred: true,
    isPinned: false
  },
  {
    id: 'PRJ-NBTI',
    name: 'NBTI Investor reading...',
    code: 'NBT',
    status: 'active',
    owner: 'Valerie Wilcox',
    dates: 'Sep 01 — Oct 15',
    desc: 'Investor dataroom memo preparation, cap table audit and diligence pack.',
    progress: 65,
    openTasks: 4,
    blockers: 1,
    evidenceLinked: 5,
    team: ['VW'],
    portfolioId: 'port-3',
    color: '#D94F4F',
    health: 'At risk'
  },
  {
    id: 'PRJ-PERSONAL',
    name: 'Valerie - Personal',
    code: 'VAL',
    status: 'active',
    owner: 'Valerie Wilcox',
    dates: 'Ongoing 2026',
    desc: 'Executive objectives, quarterly board reviews and personal strategic priorities.',
    progress: 75,
    openTasks: 2,
    blockers: 0,
    evidenceLinked: 2,
    team: ['VW'],
    portfolioId: 'port-3',
    color: '#ABA944',
    health: 'On track'
  },
  {
    id: 'PRJ-AGENCY',
    name: 'Agency Website',
    code: 'AGY',
    status: 'active',
    owner: 'Mayah Sinclair',
    dates: 'Jul 20 — Aug 25',
    desc: 'Brand marketing portal, case studies, high-contrast typography and showcase.',
    progress: 90,
    openTasks: 1,
    blockers: 0,
    evidenceLinked: 8,
    team: ['MS', 'GS'],
    portfolioId: 'port-2',
    color: '#6DBB7A',
    health: 'On track'
  },
  {
    id: 'PRJ-BITES',
    name: 'Blessed Bites',
    code: 'BB',
    status: 'active',
    owner: 'Precious Okafor',
    dates: 'Aug 10 — Sep 30',
    desc: 'Food delivery and catering marketplace application with subscription logic.',
    progress: 35,
    openTasks: 6,
    blockers: 1,
    evidenceLinked: 1,
    team: ['PO', 'VW'],
    portfolioId: 'port-2',
    color: '#E57A3C',
    health: 'On track'
  },
  {
    id: 'PRJ-ADMIN',
    name: 'Admin / HR / Finance',
    code: 'ADM',
    status: 'active',
    owner: 'Valerie Wilcox',
    dates: 'Ongoing 2026',
    desc: 'Payroll verification, vendor SLA audits and operational ledger.',
    progress: 88,
    openTasks: 2,
    blockers: 0,
    evidenceLinked: 9,
    team: ['VW', 'GS'],
    portfolioId: 'port-1',
    color: '#556970',
    health: 'On track'
  },
  {
    id: 'PRJ-GCSE',
    name: 'GCSE Revision App',
    code: 'GCS',
    status: 'active',
    owner: 'George Stavros',
    dates: 'Jul 01 — Sep 10',
    desc: 'Adaptive flashcards, revision quiz engine and student progress telemetry.',
    progress: 70,
    openTasks: 3,
    blockers: 0,
    evidenceLinked: 4,
    team: ['GS', 'MS'],
    portfolioId: 'port-2',
    color: '#3B6D11',
    health: 'On track'
  },
  {
    id: 'PRJ-PULSE',
    name: 'Pulse.os',
    code: 'PLS',
    status: 'active',
    owner: 'Precious Okafor',
    dates: 'Aug 01 — Oct 20',
    desc: 'Real-time telemetry and server agent cluster health monitoring daemon.',
    progress: 28,
    openTasks: 7,
    blockers: 2,
    evidenceLinked: 2,
    team: ['PO', 'GS'],
    portfolioId: 'port-1',
    color: '#8A8835',
    health: 'At risk'
  },
  {
    id: 'PRJ-DOC',
    name: 'Document Management',
    code: 'DOC',
    status: 'active',
    owner: 'Mayah Sinclair',
    dates: 'Jul 15 — Sep 15',
    desc: 'Enterprise document repository, audit versioning and SHA-256 evidence links.',
    progress: 82,
    openTasks: 2,
    blockers: 0,
    evidenceLinked: 11,
    team: ['MS', 'VW'],
    portfolioId: 'port-1',
    color: '#4A90E2',
    health: 'On track'
  },
  {
    id: 'PRJ-MERIDIAN',
    name: 'Meridian Corp Acquisition Portal',
    code: 'MER',
    status: 'archived',
    isArchived: true,
    archivedAt: 'Aug 15, 2026',
    archivedReason: 'Strategic initiative completed and accepted by executive committee.',
    archivedBy: 'Valerie Wilcox',
    owner: 'Precious Okafor',
    dates: 'May 01 — Aug 15, 2026',
    desc: 'Dedicated enterprise dataroom and client onboarding pre-acquisition flow with full regulatory sign-off.',
    progress: 100,
    openTasks: 0,
    blockers: 0,
    evidenceLinked: 14,
    team: ['PO', 'VW'],
    portfolioId: 'port-2',
    color: '#8A8835',
    health: 'On track'
  },
  {
    id: 'PRJ-LEGACY',
    name: 'Legacy Token v1.9 Migration',
    code: 'LGC',
    status: 'archived',
    isArchived: true,
    archivedAt: 'Jul 20, 2026',
    archivedReason: 'Superseded by v2.4 slate tokens release.',
    archivedBy: 'Mayah Sinclair',
    owner: 'Mayah Sinclair',
    dates: 'Jun 10 — Jul 20, 2026',
    desc: 'Deprecated token mapping schema and retirement of legacy olive palettes across core UI.',
    progress: 100,
    openTasks: 0,
    blockers: 0,
    evidenceLinked: 8,
    team: ['MS', 'GS'],
    portfolioId: 'port-1',
    color: '#9BA4A7',
    health: 'On track'
  }
];

export const initialArchiveAuditLog: ArchiveAuditEntry[] = [
  {
    id: 'ARC-AUD-001',
    action: 'archived',
    entityType: 'project',
    entityId: 'PRJ-MERIDIAN',
    entityName: 'Meridian Corp Acquisition Portal',
    timestamp: 'Aug 15, 2026 · 17:40',
    user: 'Valerie Wilcox (VW)',
    notes: 'All 14 acceptance criteria signed off. Moved to immutable cold storage.',
    integrityHash: 'sha256-a9f81bc442e9e28d'
  },
  {
    id: 'ARC-AUD-002',
    action: 'evidence_locked',
    entityType: 'project',
    entityId: 'PRJ-MERIDIAN',
    entityName: 'Meridian Corp Acquisition Portal',
    timestamp: 'Aug 15, 2026 · 17:45',
    user: 'Kairos Daemon (KI)',
    notes: '14 evidence artifacts cryptographically pinned and archived.',
    integrityHash: 'sha256-5c290de1247b901a'
  },
  {
    id: 'ARC-AUD-003',
    action: 'archived',
    entityType: 'project',
    entityId: 'PRJ-LEGACY',
    entityName: 'Legacy Token v1.9 Migration',
    timestamp: 'Jul 20, 2026 · 14:15',
    user: 'Mayah Sinclair (MS)',
    notes: 'Tokens replaced with Slate tokens. Project successfully closed and archived.',
    integrityHash: 'sha256-78e2098b1a3e990c'
  }
];

export const initialPortfolios: Portfolio[] = [
  {
    id: 'port-1',
    name: 'Enterprise OS & Internal Systems',
    description: 'Core infrastructure, governance, operating systems, and automation daemons.',
    status: 'On track',
    owner: 'Valerie Wilcox',
    projectIds: ['PRJ-KAIZEN', 'PRJ-PULSE', 'PRJ-DOC', 'PRJ-ADMIN'],
    progress: 64,
    dates: 'Jul 01 — Oct 31, 2026'
  },
  {
    id: 'port-2',
    name: 'Client Ecosystems & Products',
    description: 'Commercial client apps, brand marketing portals, and digital consumer products.',
    status: 'On track',
    owner: 'Precious Okafor',
    projectIds: ['PRJ-PHANTOM', 'PRJ-AGENCY', 'PRJ-BITES', 'PRJ-GCSE'],
    progress: 58,
    dates: 'Aug 01 — Dec 15, 2026'
  },
  {
    id: 'port-3',
    name: 'Investor & Leadership Governance',
    description: 'Executive reporting, investor memos, capital allocation, and founder priority tracking.',
    status: 'At risk',
    owner: 'Valerie Wilcox',
    projectIds: ['PRJ-NBTI', 'PRJ-PERSONAL'],
    progress: 70,
    dates: 'Sep 01 — Nov 30, 2026'
  }
];

export const initialSprints: Sprint[] = [
  {
    id: 'sprint-11',
    number: 11,
    name: 'Sprint 11',
    goal: 'Baseline delivery contracts, activity audit trails & Kairos reasoning model v1',
    status: 'completed',
    startDate: '2026-08-20',
    endDate: '2026-09-03',
    targetPoints: 24,
    completedPoints: 24
  },
  {
    id: 'sprint-12',
    number: 12,
    name: 'Sprint 12',
    goal: 'ONB stepper signoff & NVIDIA NIM integration prototype with human checkpoints',
    status: 'active',
    startDate: '2026-09-03',
    endDate: '2026-09-17',
    targetPoints: 28,
    completedPoints: 16
  },
  {
    id: 'sprint-13',
    number: 13,
    name: 'Sprint 13',
    goal: 'Production NIM execution, multi-agent autonomous stage-gates & portfolio reporting',
    status: 'planning',
    startDate: '2026-09-18',
    endDate: '2026-10-02',
    targetPoints: 32,
    completedPoints: 0
  }
];

export const initialActivity: ActivityItem[] = [
  {
    id: 'act-1',
    author: 'PO',
    authorName: 'Precious',
    text: 'Precious moved PAI-DEL-008 to In Progress',
    time: '2m ago',
    type: 'human'
  },
  {
    id: 'act-2',
    author: 'K',
    authorName: 'Kairos',
    text: 'Kairos prepared ONB-002 QA evidence bundle (3 checks complete)',
    time: '4m ago',
    type: 'agent'
  },
  {
    id: 'act-3',
    author: 'MS',
    authorName: 'Mayah',
    text: 'Mayah updated design tokens (olive → slate diff complete)',
    time: '12m ago',
    type: 'human'
  },
  {
    id: 'act-4',
    author: 'VW',
    authorName: 'Valerie',
    text: 'Valerie added a human checkpoint on PAI-DEL-006',
    time: '22m ago',
    type: 'human'
  },
  {
    id: 'act-5',
    author: 'GS',
    authorName: 'George',
    text: 'George commented on NVIDIA NIM scaffold blocker',
    time: '38m ago',
    type: 'human'
  }
];

export const initialBacklog: BacklogItem[] = [
  {
    id: 'PAI-BL-001',
    title: 'Client portal self-service dashboard',
    reason: 'Both items unblock the Meridian Corp portal deadline and have no open dependencies.',
    why: 'Client commitment unblocks Meridian Corp Gate 2 milestone',
    whyNow: 'George has 45% available bandwidth after NIM permissions blocker triage',
    displace: 'Mobile responsive breakpoints (PAI-BL-008) moves to Sprint 14',
    who: 'George Stavros (primary), Lena Okafor (shadow)',
    consequence: 'Client visible delay on Meridian Corp onboarding commitment',
    priority: 'high',
    effort: '8 pts',
    requester: 'Valerie',
    project: 'Client delivery'
  },
  {
    id: 'PAI-BL-002',
    title: 'Automated invoice generation from Pipeline gates',
    reason: 'Eliminate manual accounting reconciliation between pipeline close and delivery start.',
    why: 'Direct revenue acceleration; avoids manual billing errors',
    whyNow: 'Financial gate rules specification is completed',
    displace: 'Minor UI preference customizations',
    who: 'Precious Okafor',
    consequence: 'Finance requires 3 additional days per client onboarding',
    priority: 'high',
    effort: '5 pts',
    requester: 'Valerie',
    project: 'Kaizen.os'
  },
  {
    id: 'PAI-BL-003',
    title: 'Kairos context memory — cross-session persistence',
    reason: 'Allows Kairos to recall architectural trade-offs, evidence records, and human notes across active sprints.',
    why: 'Unblocks autonomous preparation of Sprint 13 contracts',
    whyNow: 'George is at 45% capacity and can absorb this without displacement',
    displace: 'Mobile responsive breakpoints (PAI-BL-008) moves to Sprint 14',
    who: 'George Stavros',
    consequence: 'Agent loses memory between sessions, requiring manual prompt context',
    priority: 'med',
    effort: '13 pts',
    requester: 'George',
    project: 'Kaizen.os'
  },
  {
    id: 'PAI-BL-004',
    title: 'Team availability calendar integration',
    reason: 'Connect Google Calendar / Outlook busy blocks into Capacity auto-computation.',
    why: 'Capacity utilization automatically reflects out-of-office blocks',
    whyNow: 'Summer holiday schedule is beginning',
    displace: 'No displacement',
    who: 'Mayah Sinclair',
    consequence: 'Manual review needed before assigning sprint cards',
    priority: 'med',
    effort: '5 pts',
    requester: 'Mayah',
    project: 'Kaizen.os'
  },
  {
    id: 'PAI-BL-005',
    title: 'Ritual customisation — user-defined step order',
    reason: 'Allow team members to customize daily delivery rituals and retrospectives.',
    why: 'Team ergonomics improvement',
    whyNow: 'Low complexity; good filler task',
    displace: 'None',
    who: 'Precious Okafor',
    consequence: 'Ritual order remains fixed',
    priority: 'low',
    effort: '3 pts',
    requester: 'Precious',
    project: 'Kaizen.os'
  },
  {
    id: 'PAI-BL-006',
    title: 'Dark mode theme support',
    reason: 'Support low-light working environments across workbench views.',
    why: 'Requested in developer survey',
    whyNow: 'Tokens are already in migration',
    displace: 'Pushed to Q4',
    who: 'Mayah Sinclair',
    consequence: 'Light mode remains the default',
    priority: 'low',
    effort: '8 pts',
    requester: 'Mayah',
    project: 'Design system'
  },
  {
    id: 'PAI-BL-007',
    title: 'Scout agent — competitive intel scraping',
    reason: 'Automate weekly market pulse summaries for product roadmap shaping.',
    why: 'Strategic intelligence',
    whyNow: 'Can run as background agent task',
    displace: 'Deferred',
    who: 'Valerie Wilcox',
    consequence: 'Manual desk research required',
    priority: 'med',
    effort: '13 pts',
    requester: 'Valerie',
    project: 'Command'
  },
  {
    id: 'PAI-BL-008',
    title: 'Mobile responsive breakpoints (tablet + phone)',
    reason: 'Refactor grid layouts for smaller screens.',
    why: 'Ergonomic accessibility',
    whyNow: 'Displaced to Sprint 14 to prioritize Meridian portal',
    displace: 'Displaced by BL-001 & BL-003',
    who: 'George Stavros',
    consequence: 'Desktop remains primary operating environment for 1 more sprint',
    priority: 'low',
    effort: '8 pts',
    requester: 'George',
    project: 'Kaizen.os'
  }
];

export const initialCapacity: CapacityPerson[] = [
  {
    code: 'PO',
    name: 'Precious Onwukwe',
    role: 'LEAD ENGINEER',
    capacityPct: 95,
    band: '>90%',
    tasks: ['Auth QA (PAI-DEL-008)', 'ONB-002 check (PAI-DEL-006)', 'Checklist persist (PAI-DEL-014)']
  },
  {
    code: 'MS',
    name: 'Mayah Sinclair',
    role: 'DESIGN LEAD',
    capacityPct: 70,
    band: '70–90%',
    tasks: ['Token migration (PAI-DEL-009)', 'Notification panel (PAI-DEL-012)']
  },
  {
    code: 'GS',
    name: 'George Stavros',
    role: 'ENGINEERING DELIVERY',
    capacityPct: 45,
    band: '<70%',
    tasks: ['NVIDIA NIM (PAI-DEL-010)', 'Sidebar SB-002 (PAI-DEL-004)', 'Pipeline rules (PAI-DEL-013)']
  },
  {
    code: 'VW',
    name: 'Valerie Wilcox',
    role: 'SUPER ADMIN / FOUNDER',
    capacityPct: 80,
    band: '70–90%',
    tasks: ['Reviews (PAI-DEL-006, PAI-DEL-007)', 'NVIDIA debrief', 'Meridian escalation']
  },
  {
    code: 'LO',
    name: 'Lena Okafor',
    role: 'NEW JOINER · DAY 3',
    capacityPct: 30,
    band: '<70%',
    tasks: ['Onboarding walkthrough', 'Local environment setup']
  },
  {
    code: 'K',
    name: 'Kairos',
    role: 'AGENT RUNTIME · SAFE OPS',
    capacityPct: 61,
    band: '<70%',
    tasks: ['7 active runs', '3 awaiting evidence', 'Sprint 13 forecasting']
  }
];

export const initialFiles: ProjectFile[] = [
  {
    id: 'f1',
    name: 'ONB-002 QA checklist.md',
    type: 'MD',
    meta: 'Sprint 12 · PAI-DEL-006 · Kairos reviewer run',
    date: 'Jul 31',
    owner: 'Kairos',
    linkTaskId: 'PAI-DEL-006',
    contentSnippet: '# ONB-002 QA Checklist & Test Verification\n\n- [x] Staff tab triple-breakpoint test (Desktop 1440px, Tablet 768px, Mobile 375px)\n- [ ] Client tab INVITE_REQUIRED fallback confirmed with CRM mocked payload\n- [ ] WCAG AA 4.5:1 contrast pass on all button states'
  },
  {
    id: 'f2',
    name: 'PAI-POL-001-Handbook.docx',
    type: 'DOC',
    meta: 'Sprint 12 · PAI-DEL-007 · source document v2.3',
    date: 'Aug 1',
    owner: 'Valerie',
    linkTaskId: 'PAI-DEL-007',
    contentSnippet: 'KAIZEN OS EMPLOYEE HANDBOOK · VERSION 2.3\n\nSection 3.4: Parental & Caregiver Leave Policies\nSection 7.2: Device Verification & Zero-Trust Workspace Access\n\nStatus: 2 comments pending resolution by Super Admin.'
  },
  {
    id: 'f3',
    name: 'Pipeline-Gate-Spec.pdf',
    type: 'PDF',
    meta: 'Sprint 12 · PAI-DEL-013 · blocker evidence',
    date: 'Jul 27',
    owner: 'George',
    linkTaskId: 'PAI-DEL-013',
    contentSnippet: 'PIPELINE STAGE-GATE AUTOMATION SPECIFICATION\n\nGate 1: Opportunity Qualified with ICP Match\nGate 2: Technical Feasibility & Security Sign-Off\nGate 3: Commercial Terms & Delivery Commitment Handshake'
  },
  {
    id: 'f4',
    name: 'NVIDIA-NIM-Integration.md',
    type: 'MD',
    meta: 'Sprint 12 · PAI-DEL-010 · permission dependency',
    date: 'Jul 31',
    owner: 'George',
    linkTaskId: 'PAI-DEL-010',
    contentSnippet: '# NVIDIA NIM Integration Architecture\n\nAPI Proxy: /api/nim/v1\nSecurity: Server-to-server auth with managed service token.\nStatus: BLOCKED waiting for GCP service account IAM grant.'
  },
  {
    id: 'f5',
    name: 'Token diff report.md',
    type: 'MD',
    meta: 'Sprint 12 · PAI-DEL-009 · Kairos comparison',
    date: 'Aug 1',
    owner: 'Mayah',
    linkTaskId: 'PAI-DEL-009',
    contentSnippet: '# PhoennixAI Design System Token Migration\n\nReplaced 42 instances of legacy `--olive` with `--slate`.\nContrast check: 100% WCAG AA compliant on off-white canvas.'
  },
  {
    id: 'f6',
    name: 'Journey map.pdf',
    type: 'PDF',
    meta: 'Sprint 11 · PAI-DEL-003 · completed evidence',
    date: 'Jul 28',
    owner: 'Precious',
    linkTaskId: 'PAI-DEL-003',
    contentSnippet: 'MERIDIAN CORP CLIENT PORTAL JOURNEY MAP\n\nPhase 1: Invitation & SSO Provisioning\nPhase 2: Project Scope Acceptance & SOW Review\nPhase 3: Real-Time Delivery Dashboard Access'
  }
];
