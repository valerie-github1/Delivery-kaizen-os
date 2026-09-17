import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, Project, Portfolio } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  AlertTriangle,
  Search, 
  Flame, 
  Filter as FilterIcon,
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  ChevronDown,
  Check,
  ExternalLink,
  Tag,
  User,
  X
} from 'lucide-react';
import { isDueSoon } from '../utils/dateUtils';

interface KanbanBoardProps {
  tasks: Task[];
  projects?: Project[];
  portfolios?: Portfolio[];
  selectedPortfolioId?: string | null;
  onSelectPortfolio?: (portfolioId: string | null) => void;
  onNavigateToPortfolios?: () => void;
  onOpenTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTaskTitle: (taskId: string, currentTitle: string) => void;
  onAddTask: (status: TaskStatus) => void;
  onOpenAskKairos: () => void;
  onOpenSprintManager?: () => void;
  activeSprintName?: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects = [],
  portfolios = [],
  selectedPortfolioId = null,
  onSelectPortfolio,
  onNavigateToPortfolios,
  onOpenTask,
  onMoveTask,
  onDeleteTask,
  onEditTaskTitle,
  onAddTask,
  onOpenAskKairos,
  onOpenSprintManager,
  activeSprintName = 'Sprint 12'
}) => {
  // Quick filters & search
  const [filter, setFilter] = useState<'all' | 'mine' | 'high' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated filter bar state
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'all'>('all');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [selectedLabel, setSelectedLabel] = useState<string>('all');
  const [isPortfolioMenuOpen, setIsPortfolioMenuOpen] = useState(false);

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const columns: { id: TaskStatus; label: string; dotColor: string }[] = [
    { id: 'todo', label: 'To Do', dotColor: 'bg-[#9BA4A7]' },
    { id: 'progress', label: 'In Progress', dotColor: 'bg-[#7A9098]' },
    { id: 'review', label: 'In Review', dotColor: 'bg-[#8A8835]' },
    { id: 'done', label: 'Done', dotColor: 'bg-[#6DBB7A]' }
  ];

  // Dynamically extract unique labels and owners from current tasks
  const allLabels = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => {
      if (t.labels && Array.isArray(t.labels)) {
        t.labels.forEach(l => set.add(l));
      }
    });
    return Array.from(set).sort();
  }, [tasks]);

  const allOwners = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach(t => {
      if (t.owner) {
        map.set(t.owner, t.ownerName || t.owner);
      }
    });
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, [tasks]);

  // Derived selected portfolio object
  const activePortfolio = useMemo(() => {
    if (!selectedPortfolioId) return null;
    return portfolios.find(p => p.id === selectedPortfolioId) || null;
  }, [portfolios, selectedPortfolioId]);

  // Comprehensive task filter calculation
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = t.id.toLowerCase().includes(q) || 
                      t.title.toLowerCase().includes(q) || 
                      t.ownerName.toLowerCase().includes(q) ||
                      t.desc?.toLowerCase().includes(q) ||
                      t.labels?.some(l => l.toLowerCase().includes(q));
        if (!match) return false;
      }

      // 2. Quick filter tabs
      if (filter === 'mine' && t.owner !== 'VW') return false;
      if (filter === 'high' && t.priority !== 'high') return false;
      if (filter === 'overdue' && !(t.due.includes('!') || t.due.includes('Jul') || isDueSoon(t.dueDateStr, t.status))) return false;

      // 3. Priority filter dropdown
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;

      // 4. Assigned owner filter dropdown
      if (selectedOwner !== 'all' && t.owner !== selectedOwner) return false;

      // 5. Label filter dropdown
      if (selectedLabel !== 'all' && (!t.labels || !t.labels.includes(selectedLabel))) return false;

      // 6. Portfolio Scope filter
      if (activePortfolio) {
        const matchesProject = activePortfolio.projectIds.includes(t.projectId || '') ||
          activePortfolio.projectIds.some(pId => {
            const proj = projects.find(p => p.id === pId);
            return proj && (proj.name === t.project || proj.code === t.project);
          });
        if (!matchesProject) return false;
      }

      return true;
    });
  }, [tasks, searchQuery, filter, selectedPriority, selectedOwner, selectedLabel, activePortfolio, projects]);

  const hasActiveFilters = selectedPriority !== 'all' || selectedOwner !== 'all' || selectedLabel !== 'all' || selectedPortfolioId !== null || searchQuery.trim() !== '' || filter !== 'all';

  const handleResetFilters = () => {
    setSelectedPriority('all');
    setSelectedOwner('all');
    setSelectedLabel('all');
    setSearchQuery('');
    setFilter('all');
    if (onSelectPortfolio) onSelectPortfolio(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      onMoveTask(id, colId);
    }
    setDraggedTaskId(null);
  };

  const scrollBoard = (direction: 'left' | 'right') => {
    if (boardContainerRef.current) {
      const scrollOffset = 335;
      boardContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollOffset : scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  // Enable mouse wheel horizontal navigation across columns when hovering outside vertically scrollable lists
  useEffect(() => {
    const el = boardContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const isOverCardsList = target?.closest('.column-cards-scroll');
      if (!isOverCardsList && e.deltaY !== 0) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 overflow-hidden">
      {/* Top Filter Bar: Portfolio Dropdown, Priority, Owner, Label, Search & Quick Views */}
      <div className="bg-white border-b border-[rgba(85,105,112,0.14)] px-4 sm:px-6 py-2 space-y-2 shrink-0 select-none shadow-2xs">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left grouping: Portfolio Dropdown & Dedicated Filter Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PORTFOLIO DROPDOWN UNDER DELIVERY BOARD */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPortfolioMenuOpen(!isPortfolioMenuOpen)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all flex items-center gap-1.5 font-semibold ${
                  activePortfolio
                    ? 'bg-[#556970] text-white border-[#556970] shadow-xs'
                    : 'bg-[#EFF0EA] text-[#556970] border-[rgba(85,105,112,0.2)] hover:bg-[#D6D5C8]'
                }`}
                title="Filter delivery board by Strategic Portfolio"
              >
                <Briefcase className={`w-3.5 h-3.5 ${activePortfolio ? 'text-[#ABA944]' : 'text-[#8A8835]'}`} />
                <span>Portfolio:</span>
                <span className="max-w-[140px] truncate">{activePortfolio ? activePortfolio.name : 'All Portfolios'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isPortfolioMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Portfolio Dropdown Menu */}
              {isPortfolioMenuOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-[rgba(85,105,112,0.22)] p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[9px] font-mono uppercase text-[#9BA4A7] font-bold flex items-center justify-between border-b border-[rgba(85,105,112,0.1)] pb-1.5">
                    <span>Portfolio Rollup Scope</span>
                    {activePortfolio && (
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectPortfolio) onSelectPortfolio(null);
                          setIsPortfolioMenuOpen(false);
                        }}
                        className="text-[#556970] hover:text-[#1F2426] underline text-[9px] font-semibold"
                      >
                        Reset to All
                      </button>
                    )}
                  </div>

                  <div className="space-y-1 mt-1.5 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectPortfolio) onSelectPortfolio(null);
                        setIsPortfolioMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                        !selectedPortfolioId
                          ? 'bg-[#556970]/10 font-bold text-[#1F2426]'
                          : 'hover:bg-[#EFF0EA] text-[#556970]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#556970]" />
                        <span>All Portfolios (Unscoped)</span>
                      </div>
                      {!selectedPortfolioId && <Check className="w-3.5 h-3.5 text-[#556970]" />}
                    </button>

                    {portfolios.map((port) => (
                      <button
                        key={port.id}
                        type="button"
                        onClick={() => {
                          if (onSelectPortfolio) onSelectPortfolio(port.id);
                          setIsPortfolioMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono text-left transition-colors ${
                          selectedPortfolioId === port.id
                            ? 'bg-[#556970]/10 font-bold text-[#1F2426]'
                            : 'hover:bg-[#EFF0EA] text-[#556970]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              port.status === 'On track' ? 'bg-[#6DBB7A]' : port.status === 'At risk' ? 'bg-[#8A8835]' : 'bg-[#D94F4F]'
                            }`} />
                            <span className="truncate font-semibold text-[11.5px]">{port.name}</span>
                          </div>
                          <div className="text-[9.5px] text-[#9BA4A7] pl-4 font-mono">
                            {port.projectIds.length} initiatives · {port.progress}% completed
                          </div>
                        </div>
                        {selectedPortfolioId === port.id && <Check className="w-3.5 h-3.5 text-[#556970] shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {onNavigateToPortfolios && (
                    <div className="pt-2 mt-2 border-t border-[rgba(85,105,112,0.12)]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPortfolioMenuOpen(false);
                          onNavigateToPortfolios();
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-mono text-[#556970] hover:text-[#1F2426] hover:bg-[#EFF0EA] rounded-md font-semibold transition-colors"
                      >
                        <span>Open Portfolios Strategic Dashboard</span>
                        <ExternalLink className="w-3 h-3 text-[#ABA944]" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PRIORITY FILTER DROPDOWN */}
            <div className="flex items-center gap-1 bg-[#EFF0EA] rounded-md border border-[rgba(85,105,112,0.15)] px-2 py-1 text-xs font-mono">
              <span className="text-[10px] uppercase text-[#9BA4A7] font-semibold">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | 'all')}
                className="bg-transparent text-[#1F2426] font-semibold text-xs outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="med">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* OWNER FILTER DROPDOWN */}
            <div className="flex items-center gap-1 bg-[#EFF0EA] rounded-md border border-[rgba(85,105,112,0.15)] px-2 py-1 text-xs font-mono">
              <User className="w-3 h-3 text-[#9BA4A7]" />
              <span className="text-[10px] uppercase text-[#9BA4A7] font-semibold">Owner:</span>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="bg-transparent text-[#1F2426] font-semibold text-xs outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="all">All Owners</option>
                {allOwners.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.name} ({o.code})
                  </option>
                ))}
              </select>
            </div>

            {/* LABEL FILTER DROPDOWN */}
            <div className="flex items-center gap-1 bg-[#EFF0EA] rounded-md border border-[rgba(85,105,112,0.15)] px-2 py-1 text-xs font-mono">
              <Tag className="w-3 h-3 text-[#9BA4A7]" />
              <span className="text-[10px] uppercase text-[#9BA4A7] font-semibold">Label:</span>
              <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
                className="bg-transparent text-[#1F2426] font-semibold text-xs outline-none cursor-pointer max-w-[120px] truncate"
              >
                <option value="all">All Labels</option>
                {allLabels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-2 py-1 text-[11px] font-mono text-[#D94F4F] hover:bg-[#D94F4F]/10 rounded-md transition-colors flex items-center gap-1 font-semibold"
                title="Reset all filters"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right grouping: Search & Quick Views & Sprint Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Search */}
            <div className="relative flex items-center">
              <Search className="w-3 h-3 text-[#9BA4A7] absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cards, labels..."
                className="pl-7 pr-2.5 py-1 text-xs font-mono bg-[#EFF0EA] border border-transparent focus:border-[#556970] focus:bg-white rounded-md w-36 sm:w-44 outline-none transition-all"
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

            {/* Horizontal Scroll Nudge Controls */}
            <div className="flex items-center border border-[rgba(85,105,112,0.18)] rounded-md overflow-hidden bg-[#EFF0EA]">
              <button
                type="button"
                onClick={() => scrollBoard('left')}
                className="p-1 text-[#556970] hover:bg-white hover:text-[#1F2426] transition-colors"
                title="Scroll board columns left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="w-[1px] h-3.5 bg-[rgba(85,105,112,0.18)]" />
              <button
                type="button"
                onClick={() => scrollBoard('right')}
                className="p-1 text-[#556970] hover:bg-white hover:text-[#1F2426] transition-colors"
                title="Scroll board columns right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {onOpenSprintManager && (
              <button
                type="button"
                onClick={onOpenSprintManager}
                className="px-2.5 py-1 bg-[#556970] hover:bg-[#3E4F55] text-white rounded-md font-mono text-[10.5px] font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Flame className="w-3.5 h-3.5 text-[#ABA944]" />
                <span className="hidden md:inline">{activeSprintName}</span>
                <span className="md:hidden">Sprint</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAskKairos}
              className="px-2.5 py-1 bg-[#ABA944]/15 hover:bg-[#ABA944]/25 text-[#8A8835] border border-[#ABA944]/40 rounded-md font-mono text-[10.5px] font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⌘K Kairos</span>
            </button>
          </div>
        </div>

        {/* Quick view pills & filter status banner */}
        <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-[rgba(85,105,112,0.08)] flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-[#9BA4A7]">Quick View:</span>
            {(['all', 'mine', 'high', 'overdue'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  filter === f
                    ? 'bg-[#556970] text-white font-bold'
                    : 'text-[#556970] hover:bg-[#EFF0EA]'
                }`}
              >
                {f === 'all' ? 'All Tasks' : f === 'mine' ? 'My Tasks' : f === 'high' ? 'High Priority' : 'Due Soon'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-[10.5px] font-mono text-[#9BA4A7]">
            {activePortfolio && (
              <span className="px-2 py-0.5 rounded-full bg-[#ABA944]/15 text-[#8A8835] font-semibold border border-[#ABA944]/30 flex items-center gap-1">
                <span>Scope: {activePortfolio.name}</span>
                <button
                  type="button"
                  onClick={() => onSelectPortfolio && onSelectPortfolio(null)}
                  className="hover:text-[#1F2426]"
                >
                  ✕
                </button>
              </span>
            )}
            <span>
              Showing <strong className="text-[#1F2426]">{filteredTasks.length}</strong> of {tasks.length} tasks
            </span>
          </div>
        </div>
      </div>

      {/* Kanban columns: Smooth horizontal scroll on parent + independent vertical scroll in each column */}
      <div 
        ref={boardContainerRef}
        className="flex-1 p-4 md:p-6 overflow-x-auto overflow-y-hidden flex gap-5 bg-[#F7F6F2] items-stretch min-h-0 w-full scroll-smooth select-none focus:outline-none"
        role="region"
        aria-label="Kanban board columns"
        tabIndex={0}
      >
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isDropTarget = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-[315px] min-w-[300px] max-w-[340px] shrink-0 flex flex-col h-full max-h-full min-h-0 bg-[#EFF0EA] rounded-xl border shadow-2xs transition-all ${
                isDropTarget
                  ? 'border-[#ABA944] bg-[#EFF0EA]/95 ring-2 ring-[#ABA944]/30'
                  : 'border-[rgba(85,105,112,0.18)]'
              }`}
            >
              {/* Column header: Pinned to top */}
              <div className="px-4 py-3 border-b border-[rgba(85,105,112,0.12)] flex items-center justify-between bg-white/75 rounded-t-xl shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                  <span className="font-mono text-xs font-bold text-[#1F2426] tracking-wide">
                    {col.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-[#556970] bg-white px-2 py-0.5 rounded-full border border-[rgba(85,105,112,0.12)] font-bold shadow-2xs">
                    {colTasks.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddTask(col.id)}
                    className="p-1 hover:bg-[#EFF0EA] rounded text-[#556970] hover:text-[#1F2426] transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cards Container: Scrolls vertically smoothly with min-h-0 and no clipping */}
              <div 
                className="column-cards-scroll flex-1 p-3 pb-3 space-y-3 overflow-y-auto min-h-0 overscroll-contain pr-2 focus:outline-none"
                tabIndex={0}
                role="region"
                aria-label={`${col.label} task list`}
              >
                {colTasks.length === 0 ? (
                  <div className={`h-32 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-colors ${
                    isDropTarget
                      ? 'border-[#ABA944] bg-[#ABA944]/15 text-[#8A8835]'
                      : 'border-[rgba(85,105,112,0.18)] bg-white/40 text-[#9BA4A7]'
                  }`}>
                    <span className="text-xs font-mono font-semibold">No tasks in {col.label}</span>
                    <span className="text-[9.5px] font-mono text-[#9BA4A7] mt-1">Drag cards here or click + to create</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isDue = isDueSoon(task.dueDateStr, task.status);
                    return (
                      <article
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => onOpenTask(task.id)}
                        className="bg-white rounded-lg p-3 border border-[rgba(85,105,112,0.18)] hover:border-[#556970] hover:shadow-xs transition-all cursor-pointer select-none group shrink-0"
                      >
                        {/* Card header */}
                        <div className="flex items-center justify-between mb-1.5 gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#556970] group-hover:text-[#1F2426] transition-colors">
                              {task.id}
                            </span>
                            {task.project && (
                              <span className="text-[9px] font-mono text-[#9BA4A7] px-1 py-0.2 bg-[#EFF0EA] rounded truncate max-w-[90px]">
                                {task.project}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Due Soon alert badge */}
                            {isDue && (
                              <span 
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D94F4F]/15 text-[#D94F4F] border border-[#D94F4F]/30 flex items-center gap-0.5 shadow-2xs"
                                title="Due within 48 hours"
                              >
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Due Soon</span>
                              </span>
                            )}

                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                              task.priority === 'high'
                                ? 'bg-[#D94F4F]/15 text-[#D94F4F]'
                                : task.priority === 'med'
                                ? 'bg-[#8A8835]/15 text-[#8A8835]'
                                : 'bg-[#556970]/10 text-[#556970]'
                            }`}>
                              {task.priority}
                            </span>

                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditTaskTitle(task.id, task.title);
                                }}
                                className="p-0.5 text-[#9BA4A7] hover:text-[#556970] rounded"
                                title="Edit title"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTask(task.id);
                                }}
                                className="p-0.5 text-[#9BA4A7] hover:text-[#D94F4F] rounded"
                                title="Delete task"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Card title */}
                        <h4 className="font-['Source_Serif_4'] text-xs font-semibold text-[#1F2426] leading-snug break-words mb-2 line-clamp-3">
                          {task.title}
                        </h4>

                        {/* Labels pills if available */}
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap mb-2">
                            {task.labels.map((lbl) => (
                              <span
                                key={lbl}
                                className="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#EFF0EA] text-[#556970] border border-[rgba(85,105,112,0.1)]"
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card metadata: Due date + Owner avatar */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7477] pt-0.5">
                          <span className={`flex items-center gap-1 ${isDue ? 'text-[#D94F4F] font-bold' : ''}`}>
                            <Clock className={`w-3 h-3 shrink-0 ${isDue ? 'text-[#D94F4F]' : 'text-[#9BA4A7]'}`} />
                            <span className="truncate">{task.due}</span>
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span 
                              className="w-4 h-4 rounded-full bg-[#556970]/10 text-[#556970] font-bold flex items-center justify-center text-[9px]"
                              title={task.ownerName}
                            >
                              {task.owner}
                            </span>
                          </div>
                        </div>

                        {/* Signal pill */}
                        {task.signal && (
                          <div className={`mt-2 pt-1.5 border-t border-dashed border-[rgba(85,105,112,0.12)] text-[10px] font-mono flex items-center gap-1.5 min-w-0 ${
                            task.type === 'agent'
                              ? 'text-[#8A8835]'
                              : task.type === 'blocked'
                              ? 'text-[#D94F4F]'
                              : 'text-[#556970]'
                          }`}>
                            {task.type === 'agent' && <Sparkles className="w-3 h-3 text-[#ABA944] shrink-0" />}
                            {task.type === 'blocked' && <AlertCircle className="w-3 h-3 text-[#D94F4F] shrink-0" />}
                            <span className="truncate font-medium">{task.signal}</span>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>

              {/* Add card button footer: Pinned to bottom, never pushed off */}
              <div className="p-2 border-t border-[rgba(85,105,112,0.1)] bg-white/50 rounded-b-xl shrink-0">
                <button
                  type="button"
                  onClick={() => onAddTask(col.id)}
                  className="w-full py-1.5 text-xs font-mono text-[#556970] hover:text-[#1F2426] hover:bg-white/90 rounded transition-colors flex items-center justify-center gap-1.5 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add task</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Right edge spacer to prevent clipping */}
        <div className="w-2 shrink-0 pointer-events-none select-none" aria-hidden="true" />
      </div>
    </div>
  );
};
