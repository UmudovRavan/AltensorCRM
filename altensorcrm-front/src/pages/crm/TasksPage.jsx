import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PlusIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ViewColumnsIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  CalendarIcon,
  XMarkIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  PhotoIcon,
  VideoCameraIcon,
  CodeBracketIcon,
  LinkIcon,
  ListBulletIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { taskManagementApi, usersApi, getCurrentUser } from '../../services/api';

const STATUSES = ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const mapStatusIntToString = (s) => {
  if (s === 0 || s === '0' || s === 'Backlog') return 'Backlog';
  if (s === 1 || s === '1' || s === 'Todo') return 'Todo';
  if (s === 2 || s === '2' || s === 'In Progress') return 'In Progress';
  if (s === 3 || s === '3' || s === 'Done') return 'Done';
  if (s === 4 || s === '4' || s === 'Canceled') return 'Canceled';
  return typeof s === 'string' ? s : 'Backlog';
};

const mapStringToStatusInt = (str) => {
  switch (str) {
    case 'Backlog': return 0;
    case 'Todo': return 1;
    case 'In Progress': return 2;
    case 'Done': return 3;
    case 'Canceled': return 4;
    default: return 0;
  }
};

const mapPriorityIntToString = (p) => {
  if (p === 1 || p === '1' || p === 'Low') return 'Low';
  if (p === 2 || p === '2' || p === 'Medium') return 'Medium';
  if (p === 3 || p === '3' || p === 'High') return 'High';
  return typeof p === 'string' ? p : 'Low';
};

const mapStringToPriorityInt = (str) => {
  switch (str) {
    case 'Low': return 1;
    case 'Medium': return 2;
    case 'High': return 3;
    default: return 1;
  }
};

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersOptions, setUsersOptions] = useState([]);
  const [viewMode, setViewMode] = useState('List'); // 'List' | 'Kanban'
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);

  // Filters State
  const [filterTitle, setFilterTitle] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignedTo, setFilterAssignedTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDueDate, setFilterDueDate] = useState('');

  // Open Popover Dropdowns
  const [openDropdown, setOpenDropdown] = useState(null); // 'priority' | 'assigned' | 'status' | 'date'
  const [userSearchText, setUserSearchText] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [isBulkMenuOpen, setIsBulkMenuOpen] = useState(false);

  // Toast & Modal State
  const [toast, setToast] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Low',
    assignedToUserId: '',
    dueDate: '',
    status: 'Backlog'
  });

  const [editTaskForm, setEditTaskForm] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'Low',
    assignedToUserId: '',
    dueDate: '',
    status: 'Backlog',
    createdByUserId: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Real Tasks & Users from Live Deployed API
  const loadTasksAndUsers = async () => {
    setLoading(true);
    try {
      // 1. Fetch Task Management Users first
      let taskMgmtUsers = [];
      try {
        const uData = await taskManagementApi.getAllUsers();
        if (Array.isArray(uData)) {
          taskMgmtUsers = uData.map(u => ({
            id: String(u.id || u.Id),
            name: u.userName || u.name || u.email || '',
            email: u.email || ''
          }));
        }
      } catch {
        const uData = await usersApi.getAll();
        if (Array.isArray(uData)) {
          taskMgmtUsers = uData.map(u => ({
            id: String(u.id || u.userId),
            name: u.name || u.email,
            email: u.email
          }));
        }
      }
      setUsersOptions(taskMgmtUsers);

      // 2. Load Tasks from Live API
      const taskData = await taskManagementApi.getAllTasks();
      if (Array.isArray(taskData)) {
        const formatted = taskData.map(t => {
          const rawStatus = t.status ?? t.Status;
          const rawDiff = t.difficulty ?? t.Difficulty;
          const assignedId = String(t.assignedToUserId || t.AssignedToUserId || '');
          const assignedUserObj = t.assignedToUser || t.assignedTo || {};
          
          const matchedUser = taskMgmtUsers.find(u => String(u.id) === assignedId);
          const assignedName = matchedUser
            ? matchedUser.name
            : (assignedUserObj.userName || assignedUserObj.name || (assignedId ? assignedId : ''));

          const rawDate = t.deadline || t.Deadline;
          let formattedDate = '';
          let isoDate = '';
          if (rawDate) {
            const d = new Date(rawDate);
            isoDate = d.toISOString().split('T')[0];
            formattedDate = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} 00:00:00`;
          }

          return {
            id: String(t.id || t.Id),
            title: t.title || t.Title || '',
            description: t.description || t.Description || '',
            status: mapStatusIntToString(rawStatus),
            priority: mapPriorityIntToString(rawDiff),
            dueDate: formattedDate,
            isoDueDate: isoDate,
            assignedTo: assignedName,
            assignedToUserId: assignedId,
            createdByUserId: t.createdByUserId || t.CreatedByUserId || '',
            assignedInitial: (assignedName || 'U').charAt(0).toUpperCase(),
            lastModified: t.updatedAt || t.createdAt ? 'Recently' : '1 week ago'
          };
        });
        setTasks(formatted);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.warn('Task load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const location = useLocation();

  useEffect(() => {
    loadTasksAndUsers();
  }, []);

  useEffect(() => {
    if (location.state?.selectedTaskId && tasks.length > 0) {
      const target = tasks.find(t => String(t.id) === String(location.state.selectedTaskId));
      if (target) {
        handleOpenEditModal(target);
      }
    }
  }, [location.state, tasks]);

  // Open Edit Modal
  const handleOpenEditModal = (task) => {
    setEditTaskForm({
      id: task.id,
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Low',
      assignedToUserId: task.assignedToUserId || '',
      dueDate: task.dueDate || '27-08-2026 00:00:00',
      isoDueDate: task.isoDueDate || '',
      status: task.status || 'Backlog',
      createdByUserId: task.createdByUserId || ''
    });
    setIsEditModalOpen(true);
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterTitle && !task.title.toLowerCase().includes(filterTitle.toLowerCase())) {
        return false;
      }
      if (filterPriority && task.priority !== filterPriority) {
        return false;
      }
      if (filterStatus && task.status !== filterStatus) {
        return false;
      }
      if (filterAssignedTo) {
        if (filterAssignedTo === '@me') {
          // match all
        } else if (!task.assignedTo.toLowerCase().includes(filterAssignedTo.toLowerCase())) {
          return false;
        }
      }
      if (filterDueDate && task.dueDate && !task.dueDate.includes(filterDueDate)) {
        return false;
      }
      return true;
    });
  }, [tasks, filterTitle, filterPriority, filterStatus, filterAssignedTo, filterDueDate]);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTaskIds(filteredTasks.map(t => t.id));
    } else {
      setSelectedTaskIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(i => i !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  // Bulk Delete Selected Tasks
  const handleBulkDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    setIsBulkMenuOpen(false);
    
    try {
      await Promise.all(selectedTaskIds.map(id => taskManagementApi.deleteTask(id)));
      showToast(`${selectedTaskIds.length} tapşırıq silindi!`, 'success');
      setSelectedTaskIds([]);
      await loadTasksAndUsers();
    } catch (err) {
      showToast(err.message || 'Silinmə zamanı xəta baş verdi.', 'error');
    }
  };

  // Bulk Edit First Selected Task
  const handleBulkEdit = () => {
    setIsBulkMenuOpen(false);
    if (selectedTaskIds.length === 0) return;
    const targetTask = tasks.find(t => t.id === selectedTaskIds[0]);
    if (targetTask) {
      handleOpenEditModal(targetTask);
    }
  };

  // Create Task Handler
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    setSubmitting(true);
    try {
      const currentUser = getCurrentUser();
      const currentUserId = currentUser?.userId || currentUser?.id || '';

      const payload = {
        title: newTaskForm.title.trim(),
        description: newTaskForm.description || '',
        difficulty: mapStringToPriorityInt(newTaskForm.priority),
        status: mapStringToStatusInt(newTaskForm.status),
        deadline: newTaskForm.dueDate ? new Date(newTaskForm.dueDate).toISOString() : new Date().toISOString(),
        createdByUserId: currentUserId,
        assignedToUserId: newTaskForm.assignedToUserId || null
      };

      await taskManagementApi.createTask(payload);
      showToast('Tapşırıq uğurla yaradıldı!', 'success');
      setIsCreateModalOpen(false);
      setNewTaskForm({ title: '', description: '', priority: 'Low', assignedToUserId: '', dueDate: '', status: 'Backlog' });
      await loadTasksAndUsers();
    } catch (err) {
      showToast(err.message || 'Tapşırıq yaradılarkən xəta baş verdi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Update Task Handler
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editTaskForm.title.trim()) return;

    setSubmitting(true);
    try {
      const currentUser = getCurrentUser();
      const currentUserId = editTaskForm.createdByUserId || currentUser?.userId || currentUser?.id || '';

      let deadlineIso = new Date().toISOString();
      if (editTaskForm.isoDueDate) {
        deadlineIso = new Date(editTaskForm.isoDueDate).toISOString();
      } else if (editTaskForm.dueDate && editTaskForm.dueDate.includes('-')) {
        const parts = editTaskForm.dueDate.split(' ')[0].split('-');
        if (parts.length === 3) {
          deadlineIso = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toISOString();
        }
      }

      const payload = {
        id: Number(editTaskForm.id) || editTaskForm.id,
        title: editTaskForm.title.trim(),
        description: editTaskForm.description || '',
        difficulty: mapStringToPriorityInt(editTaskForm.priority),
        status: mapStringToStatusInt(editTaskForm.status),
        deadline: deadlineIso,
        createdByUserId: currentUserId,
        assignedToUserId: editTaskForm.assignedToUserId || null
      };

      await taskManagementApi.updateTask(payload);
      showToast('Tapşırıq uğurla yeniləndi!', 'success');
      setIsEditModalOpen(false);
      await loadTasksAndUsers();
    } catch (err) {
      showToast(err.message || 'Tapşırıq yenilənərkən xəta baş verdi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Render Status Icon + Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'In Progress':
        return (
          <div className="flex items-center gap-2 text-[#E4E4E7] text-xs">
            <span className="w-4 h-4 rounded-full border-2 border-amber-400/80 border-t-transparent flex items-center justify-center shrink-0 animate-spin-slow"></span>
            <span>In Progress</span>
          </div>
        );
      case 'Todo':
        return (
          <div className="flex items-center gap-2 text-[#E4E4E7] text-xs">
            <span className="w-3.5 h-3.5 rounded-full border border-[#71717A] shrink-0"></span>
            <span>Todo</span>
          </div>
        );
      case 'Done':
        return (
          <div className="flex items-center gap-2 text-[#E4E4E7] text-xs">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Done</span>
          </div>
        );
      case 'Backlog':
        return (
          <div className="flex items-center gap-2 text-[#E4E4E7] text-xs">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#71717A] shrink-0"></span>
            <span>Backlog</span>
          </div>
        );
      case 'Canceled':
        return (
          <div className="flex items-center gap-2 text-[#E4E4E7] text-xs">
            <XMarkIcon className="w-4 h-4 text-red-400 shrink-0" />
            <span>Canceled</span>
          </div>
        );
      default:
        return <span className="text-xs text-[#A1A1AA]">{status}</span>;
    }
  };

  const filteredUsers = usersOptions.filter(u =>
    u.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(userSearchText.toLowerCase()))
  );

  return (
    <div className="h-full w-full bg-[#0F0F11] text-[#E4E4E7] flex flex-col font-sans select-none selection:bg-fuchsia-500/30 overflow-hidden relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[120] animate-in fade-in duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl ${
            toast.type === 'error' ? 'bg-red-950/90 border-red-800/80 text-red-100' : 'bg-emerald-950/90 border-emerald-800/80 text-emerald-100'
          }`}>
            <span className="text-xs font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-current opacity-60 hover:opacity-100 p-0.5"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* HEADER BAR (Breadcrumb + Switcher + Create) */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#27272A]/70 bg-[#141416]/40 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#71717A]">Tasks</span>
          <span className="text-[#3F3F46]">/</span>

          {/* View Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#27272A]/80 hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46]/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">☰</span>
                <span>{viewMode}</span>
              </div>
              <ChevronDownIcon className="w-3 h-3 text-[#A1A1AA]" />
            </button>

            {isViewDropdownOpen && (
              <div className="absolute top-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl shadow-2xl p-1 z-40 w-36 animate-in fade-in duration-100">
                <button
                  onClick={() => { setViewMode('List'); setIsViewDropdownOpen(false); }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'List' ? 'bg-[#2C2C2E] text-white font-semibold' : 'text-[#A1A1AA] hover:bg-[#2C2C2E]/60 hover:text-white'
                  }`}
                >
                  <span>List</span>
                  {viewMode === 'List' && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </button>
                <button
                  onClick={() => { setViewMode('Kanban'); setIsViewDropdownOpen(false); }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'Kanban' ? 'bg-[#2C2C2E] text-white font-semibold' : 'text-[#A1A1AA] hover:bg-[#2C2C2E]/60 hover:text-white'
                  }`}
                >
                  <span>Kanban</span>
                  {viewMode === 'Kanban' && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Top + Create Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 stroke-[2.5]" />
          <span>Create</span>
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#27272A]/70 bg-[#141416]/20 gap-3 flex-wrap shrink-0">
        
        {/* Left Filters Group */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          
          {/* Title Filter Input */}
          <div className="relative min-w-[140px] max-w-[180px]">
            <input
              type="text"
              placeholder="Title"
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500/80 transition-colors"
            />
            {filterTitle && (
              <button
                onClick={() => setFilterTitle('')}
                className="absolute right-2 top-2 text-[#71717A] hover:text-white"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Priority Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                filterPriority ? 'bg-[#27272A] border-sky-500/60 text-white' : 'bg-[#1C1C1E] border-[#2C2C2E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span>{filterPriority ? `Priority: ${filterPriority}` : 'Priority'}</span>
              <ChevronDownIcon className="w-3 h-3 text-[#71717A]" />
            </button>

            {openDropdown === 'priority' && (
              <div className="absolute top-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-40 w-44 animate-in fade-in duration-100">
                <div
                  onClick={() => { setFilterPriority(''); setOpenDropdown(null); }}
                  className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white cursor-pointer"
                >
                  <span>All Priorities</span>
                  {!filterPriority && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </div>
                {PRIORITIES.map(p => (
                  <div
                    key={p}
                    onClick={() => { setFilterPriority(p); setOpenDropdown(null); }}
                    className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#2C2C2E] text-white cursor-pointer font-medium"
                  >
                    <span>{p}</span>
                    {filterPriority === p && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned To Searchable Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'assigned' ? null : 'assigned')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                filterAssignedTo ? 'bg-[#27272A] border-sky-500/60 text-white' : 'bg-[#1C1C1E] border-[#2C2C2E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span>{filterAssignedTo ? `Assigned: ${filterAssignedTo}` : 'Assigned To'}</span>
              <ChevronDownIcon className="w-3 h-3 text-[#71717A]" />
            </button>

            {openDropdown === 'assigned' && (
              <div className="absolute top-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-40 w-64 animate-in fade-in duration-100 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={userSearchText}
                    onChange={(e) => setUserSearchText(e.target.value)}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none"
                  />
                  {userSearchText && (
                    <button onClick={() => setUserSearchText('')} className="absolute right-2 top-2 text-[#71717A]">
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                  <div
                    onClick={() => { setFilterAssignedTo('@me'); setOpenDropdown(null); }}
                    className="flex flex-col px-3 py-1.5 rounded-xl hover:bg-[#2C2C2E] cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-medium text-white">@me</span>
                  </div>
                  {filteredUsers.map(u => (
                    <div
                      key={u.id}
                      onClick={() => { setFilterAssignedTo(u.name); setOpenDropdown(null); }}
                      className="flex flex-col px-3 py-1.5 rounded-xl hover:bg-[#2C2C2E] cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-medium text-white">{u.name}</span>
                      {u.email && <span className="text-[11px] text-[#71717A]">{u.email}</span>}
                    </div>
                  ))}
                </div>

                <div
                  onClick={() => { setFilterAssignedTo(''); setUserSearchText(''); setOpenDropdown(null); }}
                  className="border-t border-[#2C2C2E] pt-1.5 flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 cursor-pointer font-medium"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                filterStatus ? 'bg-[#27272A] border-sky-500/60 text-white' : 'bg-[#1C1C1E] border-[#2C2C2E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span>{filterStatus ? `Status: ${filterStatus}` : 'Status'}</span>
              <ChevronDownIcon className="w-3 h-3 text-[#71717A]" />
            </button>

            {openDropdown === 'status' && (
              <div className="absolute top-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-40 w-44 animate-in fade-in duration-100">
                <div
                  onClick={() => { setFilterStatus(''); setOpenDropdown(null); }}
                  className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white cursor-pointer"
                >
                  <span>All Statuses</span>
                  {!filterStatus && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                </div>
                {STATUSES.map(s => (
                  <div
                    key={s}
                    onClick={() => { setFilterStatus(s); setOpenDropdown(null); }}
                    className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-[#2C2C2E] text-white cursor-pointer font-medium"
                  >
                    <span>{s}</span>
                    {filterStatus === s && <CheckIcon className="w-3.5 h-3.5 text-white" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Due Date Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                filterDueDate ? 'bg-[#27272A] border-sky-500/60 text-white' : 'bg-[#1C1C1E] border-[#2C2C2E] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span>{filterDueDate ? `Due: ${filterDueDate}` : 'Due Date'}</span>
              <ChevronDownIcon className="w-3 h-3 text-[#71717A]" />
            </button>

            {openDropdown === 'date' && (
              <div className="absolute top-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-3 z-40 w-64 animate-in fade-in duration-100 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white px-1">
                  <span>Aug 2026</span>
                  <div className="flex items-center gap-2">
                    <button className="text-[#A1A1AA] hover:text-white">&lt;</button>
                    <span className="text-[11px] text-[#A1A1AA] font-normal hover:text-white cursor-pointer">Now</span>
                    <button className="text-[#A1A1AA] hover:text-white">&gt;</button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-[#71717A]">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="grid grid-cols-7 text-center text-xs gap-y-1">
                  <span className="text-[#3F3F46]">26</span>
                  <span className="text-[#3F3F46]">27</span>
                  <span className="text-[#3F3F46]">28</span>
                  <span className="text-[#3F3F46]">29</span>
                  <span className="text-[#3F3F46]">30</span>
                  <span className="text-[#3F3F46]">31</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">1</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">2</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">3</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">4</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">5</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">6</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">7</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">8</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">9</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">10</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">11</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">12</span>
                  <span
                    onClick={() => { setFilterDueDate('13 Aug'); setOpenDropdown(null); }}
                    className="bg-white text-black font-bold rounded-lg p-1 cursor-pointer"
                  >
                    13
                  </span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">14</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">15</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">16</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">17</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">18</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">19</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">20</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">21</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">22</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">23</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">24</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">25</span>
                  <span
                    onClick={() => { setFilterDueDate('26 Aug'); setOpenDropdown(null); }}
                    className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer"
                  >
                    26
                  </span>
                  <span
                    onClick={() => { setFilterDueDate('27 Aug'); setOpenDropdown(null); }}
                    className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer"
                  >
                    27
                  </span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">28</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">29</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">30</span>
                  <span className="text-white hover:bg-[#2C2C2E] rounded-lg p-1 cursor-pointer">31</span>
                </div>

                <div className="pt-2 border-t border-[#2C2C2E]">
                  <div className="flex items-center justify-between text-xs text-[#A1A1AA] bg-[#141416] px-3 py-1.5 rounded-xl border border-[#2C2C2E] cursor-pointer">
                    <span>Select time</span>
                    <ChevronDownIcon className="w-3 h-3 text-[#71717A]" />
                  </div>
                </div>

                {filterDueDate && (
                  <button
                    onClick={() => { setFilterDueDate(''); setOpenDropdown(null); }}
                    className="w-full text-center text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Tools Group */}
        <div className="flex items-center gap-1.5 text-[#A1A1AA]">
          <button
            onClick={loadTasksAndUsers}
            className="p-1.5 rounded-xl hover:bg-[#27272A] hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1C1E] border border-[#2C2C2E] hover:text-white text-xs font-medium transition-colors cursor-pointer">
            <FunnelIcon className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Filter</span>
          </button>

          <button className="p-1.5 rounded-xl hover:bg-[#27272A] hover:text-white transition-colors cursor-pointer" title="Sort">
            <ArrowsUpDownIcon className="w-4 h-4" />
          </button>

          <button className="p-1.5 rounded-xl hover:bg-[#27272A] hover:text-white transition-colors cursor-pointer" title="Toggle Columns">
            <ViewColumnsIcon className="w-4 h-4" />
          </button>

          <button className="p-1.5 rounded-xl hover:bg-[#27272A] hover:text-white transition-colors cursor-pointer" title="Options">
            <EllipsisHorizontalIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MAIN VIEW CONTENT (LIST OR KANBAN) */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#71717A] flex items-center justify-center gap-2">
            <ArrowPathIcon className="w-5 h-5 animate-spin text-sky-400" />
            <span>Məlumatlar yüklənir...</span>
          </div>
        ) : viewMode === 'List' ? (
          /* TABLE LIST VIEW */
          <div className="w-full h-full overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-[#71717A] font-semibold bg-[#141416]/40 sticky top-0 z-10 backdrop-blur-md">
                  <th className="py-2.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedTaskIds.length > 0 && selectedTaskIds.length === filteredTasks.length}
                      onChange={handleSelectAll}
                      className="rounded bg-[#27272A] border-[#3F3F46] text-sky-500 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-4">Title</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4">Assigned To</th>
                  <th className="py-2.5 px-4 text-right pr-6">Last Modified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/50">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#71717A] text-xs">
                      No tasks found. Click "+ Create" to add a new task.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => handleOpenEditModal(task)}
                      className={`hover:bg-[#141416]/60 transition-colors group cursor-pointer ${
                        selectedTaskIds.includes(task.id) ? 'bg-[#1C1C1E]' : ''
                      }`}
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.includes(task.id)}
                          onChange={() => handleSelectOne(task.id)}
                          className="rounded bg-[#27272A] border-[#3F3F46] text-sky-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3 px-4 font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {task.title}
                      </td>

                      <td className="py-3 px-4">
                        {renderStatusBadge(task.status)}
                      </td>

                      <td className="py-3 px-4 text-[#A1A1AA]">
                        {task.priority}
                      </td>

                      <td className="py-3 px-4 text-[#A1A1AA]">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#71717A]" />
                            <span>{task.dueDate}</span>
                          </div>
                        ) : (
                          <span className="text-[#3F3F46]">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#27272A] text-[#A1A1AA] text-[10px] font-bold flex items-center justify-center shrink-0">
                              {task.assignedInitial}
                            </div>
                            <span className="text-[#E4E4E7]">{task.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="text-[#3F3F46]">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right pr-6 text-[#71717A]">
                        {task.lastModified}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* KANBAN BOARD VIEW */
          <div className="p-6 flex gap-4 overflow-x-auto items-start min-h-[500px]">
            {STATUSES.map((status) => {
              const columnTasks = filteredTasks.filter(t => t.status === status);
              return (
                <div
                  key={status}
                  className="w-72 bg-[#141416] border border-[#27272A] rounded-2xl p-3 flex flex-col gap-3 shrink-0"
                >
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(status)}
                      <span className="text-xs font-bold text-[#A1A1AA] bg-[#27272A] px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setNewTaskForm({ ...newTaskForm, status });
                        setIsCreateModalOpen(true);
                      }}
                      className="text-[#71717A] hover:text-white p-1 rounded-lg hover:bg-[#27272A] transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 min-h-[150px]">
                    {columnTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleOpenEditModal(t)}
                        className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3 flex flex-col gap-2 hover:border-[#3F3F46] transition-colors shadow-sm cursor-pointer"
                      >
                        <h4 className="font-semibold text-white text-xs leading-snug">{t.title}</h4>
                        
                        <div className="flex items-center justify-between pt-1 border-t border-[#2C2C2E]/60 text-[11px] text-[#A1A1AA]">
                          <span className="px-2 py-0.5 rounded-md bg-[#27272A] text-[#D4D4D8] font-medium">
                            {t.priority}
                          </span>

                          {t.assignedTo && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full bg-[#27272A] text-[#A1A1AA] text-[9px] font-bold flex items-center justify-center">
                                {t.assignedInitial}
                              </div>
                              <span className="text-[11px] text-[#A1A1AA]">{t.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FLOATING SELECTION ACTION BAR (EXACT MATCH TO USER SCREENSHOTS 2 & 3) */}
      {selectedTaskIds.length > 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="relative">
            
            {/* Main Floating Pill Bar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl text-xs text-white">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="rounded bg-[#27272A] border-[#3F3F46] text-sky-500 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold">
                {selectedTaskIds.length} {selectedTaskIds.length === 1 ? 'row selected' : 'rows selected'}
              </span>

              {/* 3 dots menu button */}
              <div className="relative">
                <button
                  onClick={() => setIsBulkMenuOpen(!isBulkMenuOpen)}
                  className="p-1 rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <EllipsisHorizontalIcon className="w-4 h-4" />
                </button>

                {/* Bulk Action Dropdown Menu (Image 3: Edit & Delete) */}
                {isBulkMenuOpen && (
                  <div className="absolute bottom-9 left-0 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 w-36 animate-in fade-in duration-100 space-y-0.5">
                    <button
                      onClick={handleBulkEdit}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-xl hover:bg-[#2C2C2E] text-[#D4D4D8] hover:text-white cursor-pointer transition-colors"
                    >
                      <PencilSquareIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2.5 w-full px-3 py-2 text-xs rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                    >
                      <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              <span className="w-px h-3.5 bg-[#27272A]"></span>

              {/* Select All */}
              <button
                onClick={() => setSelectedTaskIds(filteredTasks.map(t => t.id))}
                className="text-[#E4E4E7] hover:text-white font-medium cursor-pointer transition-colors"
              >
                Select all
              </button>

              {/* Close / Deselect */}
              <button
                onClick={() => setSelectedTaskIds([])}
                className="text-[#A1A1AA] hover:text-white p-0.5 cursor-pointer"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER PAGINATION BAR */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-[#27272A]/70 bg-[#141416]/40 text-xs text-[#71717A] shrink-0">
        <div className="flex items-center gap-1 bg-[#1C1C1E] p-0.5 rounded-xl border border-[#2C2C2E]">
          <button className="px-2.5 py-1 rounded-lg bg-[#27272A] text-white font-bold transition-colors">20</button>
          <button className="px-2.5 py-1 rounded-lg text-[#A1A1AA] hover:text-white transition-colors">50</button>
          <button className="px-2.5 py-1 rounded-lg text-[#A1A1AA] hover:text-white transition-colors">100</button>
        </div>

        <span className="font-medium text-[#A1A1AA]">
          {filteredTasks.length} of {tasks.length}
        </span>
      </div>

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1F1F22] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-xl text-[#E4E4E7] space-y-4 animate-in fade-in duration-150 relative">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Create Task</h2>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Edit Fields Layout"
                  className="p-1.5 rounded-xl bg-[#27272A]/60 hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#3F3F46]/50 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#27272A]/60 hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#3F3F46]/50 transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              
              {/* Title * */}
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-semibold flex items-center gap-1">
                  <span>Title</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-semibold">Description</label>

                <div className="bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#3F3F46]/50 text-[#A1A1AA] overflow-x-auto text-xs select-none">
                    <button type="button" className="font-bold text-white hover:text-white px-1">T</button>
                    <button type="button" className="font-bold text-[#A1A1AA] hover:text-white px-1">H1</button>
                    <button type="button" className="font-bold text-[#A1A1AA] hover:text-white px-1">B</button>
                    <button type="button" className="italic text-[#A1A1AA] hover:text-white px-1">I</button>
                    <button type="button" className="line-through text-[#A1A1AA] hover:text-white px-1">S</button>
                    <span className="w-px h-3 bg-[#3F3F46] mx-0.5"></span>
                    <button type="button" className="hover:text-white px-1"><LinkIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><ListBulletIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><PhotoIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><VideoCameraIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><CodeBracketIcon className="w-3.5 h-3.5" /></button>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Description"
                    value={newTaskForm.description}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                    className="w-full bg-transparent px-3.5 py-3 text-xs text-white placeholder:text-[#71717A] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Row 1: Priority & Assigned To */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Priority</label>
                  <div className="relative flex items-center">
                    <select
                      value={newTaskForm.priority}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8"
                    >
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Assigned To</label>
                  <div className="relative flex items-center">
                    <select
                      value={newTaskForm.assignedToUserId}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedToUserId: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8"
                    >
                      <option value="">Assigned To</option>
                      {usersOptions.map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.email ? `(${u.email})` : ''}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Due Date & Status */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Due Date</label>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      value={newTaskForm.dueDate}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8"
                    />
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Status</label>
                  <div className="relative flex items-center">
                    <select
                      value={newTaskForm.status}
                      onChange={(e) => setNewTaskForm({ ...newTaskForm, status: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bottom Create Button */}
              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1F1F22] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-xl text-[#E4E4E7] space-y-4 animate-in fade-in duration-150 relative">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight">Edit Task</h2>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => showToast('Lead sehifesi acilir...', 'info')}
                  className="px-3.5 py-1 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-medium border border-[#3F3F46]/50 transition-colors cursor-pointer"
                >
                  Open Lead
                </button>

                <button
                  type="button"
                  title="Edit Fields Layout"
                  className="p-1.5 rounded-xl bg-[#27272A]/60 hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#3F3F46]/50 transition-colors cursor-pointer"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-xl bg-[#27272A]/60 hover:bg-[#27272A] text-[#A1A1AA] hover:text-white border border-[#3F3F46]/50 transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4 text-xs">
              
              {/* Title * */}
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-semibold flex items-center gap-1">
                  <span>Title</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={editTaskForm.title}
                  onChange={(e) => setEditTaskForm({ ...editTaskForm, title: e.target.value })}
                  className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-semibold">Description</label>

                <div className="bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#3F3F46]/50 text-[#A1A1AA] overflow-x-auto text-xs select-none">
                    <button type="button" className="font-bold text-white hover:text-white px-1">T</button>
                    <button type="button" className="font-bold text-[#A1A1AA] hover:text-white px-1">H1</button>
                    <button type="button" className="font-bold text-[#A1A1AA] hover:text-white px-1">B</button>
                    <button type="button" className="italic text-[#A1A1AA] hover:text-white px-1">I</button>
                    <button type="button" className="line-through text-[#A1A1AA] hover:text-white px-1">S</button>
                    <span className="w-px h-3 bg-[#3F3F46] mx-0.5"></span>
                    <button type="button" className="hover:text-white px-1"><LinkIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><ListBulletIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><PhotoIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><VideoCameraIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" className="hover:text-white px-1"><CodeBracketIcon className="w-3.5 h-3.5" /></button>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Description"
                    value={editTaskForm.description}
                    onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                    className="w-full bg-transparent px-3.5 py-3 text-xs text-white placeholder:text-[#71717A] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Row 1: Priority & Assigned To */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Priority</label>
                  <div className="relative flex items-center">
                    <select
                      value={editTaskForm.priority}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, priority: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8 font-medium"
                    >
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Assigned To</label>
                  <div className="relative flex items-center">
                    <select
                      value={editTaskForm.assignedToUserId}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, assignedToUserId: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8 font-medium"
                    >
                      <option value="">Assigned To</option>
                      {usersOptions.map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.email ? `(${u.email})` : ''}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Due Date & Status */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Due Date</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={editTaskForm.dueDate}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, dueDate: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8 font-medium"
                    />
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-semibold">Status</label>
                  <div className="relative flex items-center">
                    <select
                      value={editTaskForm.status}
                      onChange={(e) => setEditTaskForm({ ...editTaskForm, status: e.target.value })}
                      className="w-full bg-[#27272A]/80 border border-[#3F3F46]/60 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-sky-500 pr-8 font-medium"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bottom Update Button */}
              <div className="flex items-center justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TasksPage;
