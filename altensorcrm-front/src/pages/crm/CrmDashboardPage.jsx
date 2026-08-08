import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowPathIcon,
  PencilIcon,
  CalendarIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

const periods = ['Last 7 Days', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days', 'Custom Range'];

const salesUsers = [
  { id: '1', name: 'Administrator', initial: 'A' },
  { id: '2', name: 'Eflan', initial: 'E' },
  { id: '3', name: 'Elvin Muzaffarli', initial: 'E' },
  { id: '4', name: 'Fidan', initial: 'F' },
  { id: '5', name: 'İnfo', initial: 'İ' },
  { id: '6', name: 'Orxan', initial: 'O' },
  { id: '7', name: 'Yusif Hashimov', initial: 'Y' }
];

const generateSalesTrendData = (multiplier = 1) => [
  { name: '15', leads: Number((2.0 * multiplier).toFixed(1)), deals: 1.5, wonDeals: 0.2 },
  { name: '17', leads: Number((2.3 * multiplier).toFixed(1)), deals: 1.8, wonDeals: 0.4 },
  { name: '19', leads: Number((2.8 * multiplier).toFixed(1)), deals: 2.1, wonDeals: 0.5 },
  { name: '21', leads: Number((2.6 * multiplier).toFixed(1)), deals: 2.4, wonDeals: 0.8 },
  { name: '23', leads: Number((3.1 * multiplier).toFixed(1)), deals: 2.2, wonDeals: 1.1 },
  { name: '25', leads: Number((3.5 * multiplier).toFixed(1)), deals: 2.8, wonDeals: 1.4 },
  { name: '27', leads: Number((3.2 * multiplier).toFixed(1)), deals: 2.6, wonDeals: 1.2 },
  { name: '29', leads: Number((2.9 * multiplier).toFixed(1)), deals: 2.3, wonDeals: 1.0 },
  { name: '31 Aug', leads: Number((3.0 * multiplier).toFixed(1)), deals: 2.5, wonDeals: 1.3 },
  { name: '3', leads: Number((3.3 * multiplier).toFixed(1)), deals: 2.7, wonDeals: 1.5 },
  { name: '5', leads: Number((3.2 * multiplier).toFixed(1)), deals: 2.6, wonDeals: 1.4 }
];

// Rich Donut Datasets
const dealsByStageData = [
  { name: 'Proposal/Quotation', value: 78, color: '#38BDF8' },
  { name: 'Qualification', value: 22, color: '#FACC15' }
];

const leadsBySourceData = [
  { name: 'Website Direct', value: 45, color: '#34C759' },
  { name: 'Social Organic', value: 35, color: '#38BDF8' },
  { name: 'Referral Partner', value: 20, color: '#AF52DE' }
];

const dealsBySourceData = [
  { name: 'Inbound Sales', value: 50, color: '#38BDF8' },
  { name: 'Outbound Cold', value: 30, color: '#FACC15' },
  { name: 'Partner Event', value: 20, color: '#FF2D55' }
];

// Funnel Conversion Dataset
const funnelConversionData = [
  { stage: 'Leads', count: 7, percent: '100%', color: '#38BDF8' },
  { stage: 'Qualified', count: 5, percent: '71%', color: '#34C759' },
  { stage: 'Proposal', count: 3, percent: '42%', color: '#FACC15' },
  { stage: 'Won Deals', count: 1, percent: '14%', color: '#AF52DE' }
];

const defaultUnifiedWidgets = [
  // 7 Top Metric Cards
  { id: 'w1', kind: 'metric', title: 'Total leads', value: '7', tooltip: 'Total number of leads created' },
  { id: 'w2', kind: 'metric', title: 'Avg. time to close a lead', value: '0 days', tooltip: 'Average time taken to convert or close a lead' },
  { id: 'w3', kind: 'metric', title: 'Ongoing deals', value: '9', tooltip: 'Deals currently active in the sales pipeline' },
  { id: 'w4', kind: 'metric', title: 'Won deals', value: '0', tooltip: 'Total number of won deals based on its closure date' },
  { id: 'w5', kind: 'metric', title: 'Avg. won deal value', value: '₼ 0', tooltip: 'Average monetary value of successfully won deals' },
  { id: 'w6', kind: 'metric', title: 'Avg. deal value', value: '₼ 0', tooltip: 'Average deal value across all sales opportunities' },
  { id: 'w7', kind: 'metric', title: 'Avg. time to close a deal', value: '0 days', tooltip: 'Average duration to finalize a sales deal' },

  // Charts
  { id: 'w8', kind: 'chart', chartType: 'area', title: 'Sales trend', subtitle: 'Daily performance of leads, deals, and wins' },
  { id: 'w9', kind: 'chart', chartType: 'area', title: 'Forecasted revenue', subtitle: 'Projected vs actual revenue based on deal probability' },
  { id: 'w10', kind: 'chart', chartType: 'funnel', title: 'Funnel conversion', subtitle: 'Lead to deal conversion pipeline' },
  { id: 'w11', kind: 'chart', chartType: 'donut', donutData: dealsByStageData, title: 'Deals by stage', subtitle: 'Current pipeline distribution' },
  { id: 'w12', kind: 'chart', chartType: 'donut', donutData: leadsBySourceData, title: 'Leads by source', subtitle: 'Lead generation channel analysis' },
  { id: 'w13', kind: 'chart', chartType: 'donut', donutData: dealsBySourceData, title: 'Deals by source', subtitle: 'Deal generation channel analysis' },
  { id: 'w14', kind: 'chart', chartType: 'bar', title: 'Deals by territory', subtitle: 'Geographic distribution of deals and revenue' },
  { id: 'w15', kind: 'chart', chartType: 'bar', title: 'Deals by salesperson', subtitle: 'Number of deals and total value per salesperson' }
];

// Custom Apple Translucent Tooltip
const AppleStocksTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-[#3F3F46] rounded-2xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[140px]">
        {label && <p className="text-[#A1A1AA] font-medium border-b border-[#2C2C2E] pb-1">{label}</p>}
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.payload.color }}></span>
              <span className="text-[#D4D4D8]">{item.name}</span>
            </span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Premium Apple Fitness / Activity Ring Style Donut Chart Component
const AppleDonutChart = ({ data = dealsByStageData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = data[activeIndex] || data[0];

  return (
    <div className="flex items-center justify-between h-full w-full gap-4">
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ backgroundColor: 'transparent' }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              cursor="pointer"
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color}
                  stroke="#1C1C1E"
                  strokeWidth={3}
                  className="transition-all duration-200 hover:opacity-90"
                />
              ))}
            </Pie>
            <Tooltip content={<AppleStocksTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
          <span className="text-xl font-black text-white tracking-tight">{activeItem.value}%</span>
          <span className="text-[10px] font-medium text-[#A1A1AA] truncate max-w-[80px]">{activeItem.name}</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 text-xs">
        {data.map((item, idx) => (
          <div
            key={item.name}
            onMouseEnter={() => setActiveIndex(idx)}
            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${activeIndex === idx ? 'bg-[#2C2C2E] border border-[#3F3F46] shadow-sm' : 'hover:bg-[#2C2C2E]/40 border border-transparent'
              }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-[#D4D4D8] font-medium truncate">{item.name}</span>
            </div>
            <span className="font-bold text-white shrink-0 ml-2">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Soft Dark Apple Funnel Conversion Component (100% White-Free!)
const AppleSoftFunnelChart = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center space-y-3.5 pt-2">
      {funnelConversionData.map((item) => (
        <div key={item.stage} className="space-y-1 group">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[#D4D4D8] group-hover:text-white transition-colors">{item.stage}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{item.count}</span>
              <span className="text-[10px] text-[#A1A1AA] bg-[#2C2C2E] px-1.5 py-0.5 rounded-md">{item.percent}</span>
            </div>
          </div>
          {/* Soft Rounded Gradient Bar Container */}
          <div className="w-full bg-[#2C2C2E]/60 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{
                width: item.percent,
                backgroundColor: item.color,
                boxShadow: `0 0 12px ${item.color}40`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CrmDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [selectedUser, setSelectedUser] = useState('Sales User');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Edit Mode & Customization States
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('Spacer');
  const [selectedSubOption, setSelectedSubOption] = useState('Spacer');

  // Single Unified Widgets State
  const [widgetsList, setWidgetsList] = useState(defaultUnifiedWidgets);
  const [savedWidgets, setSavedWidgets] = useState(defaultUnifiedWidgets);

  // Drag and Drop States
  const [draggedWidgetIndex, setDraggedWidgetIndex] = useState(null);
  const [dragOverWidgetIndex, setDragOverWidgetIndex] = useState(null);

  // Tooltip Hover State
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  const periodRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodRef.current && !periodRef.current.contains(event.target)) {
        setIsPeriodOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = salesUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleStartEdit = () => {
    setSavedWidgets([...widgetsList]);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    setSavedWidgets([...widgetsList]);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setWidgetsList([...savedWidgets]);
    setIsEditMode(false);
  };

  const handleResetDefault = () => {
    setWidgetsList(defaultUnifiedWidgets);
  };

  const handleDeleteWidget = (id) => {
    setWidgetsList(widgetsList.filter((w) => w.id !== id));
  };

  const handleDragStart = (e, index) => {
    if (!isEditMode) return;
    setDraggedWidgetIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverWidgetIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    if (!isEditMode || draggedWidgetIndex === null) return;
    e.preventDefault();
    const updated = [...widgetsList];
    const draggedItem = updated[draggedWidgetIndex];
    updated.splice(draggedWidgetIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setWidgetsList(updated);
    setDraggedWidgetIndex(null);
    setDragOverWidgetIndex(null);
  };

  const handleAddWidget = () => {
    let newWidget;
    if (selectedChartType === 'Spacer') {
      newWidget = {
        id: `w-${Date.now()}`,
        kind: 'spacer',
        title: 'Spacer'
      };
    } else if (selectedChartType === 'Number Chart') {
      const title = selectedSubOption === 'Spacer' ? 'Custom Metric' : selectedSubOption;
      newWidget = {
        id: `w-${Date.now()}`,
        kind: 'metric',
        title: title,
        value: '0',
        tooltip: 'Custom metric parameter'
      };
    } else {
      const title = selectedSubOption === 'Spacer' ? 'New Chart' : selectedSubOption;
      newWidget = {
        id: `w-${Date.now()}`,
        kind: 'chart',
        chartType: selectedChartType === 'Donut Chart' ? 'donut' : 'area',
        donutData: dealsByStageData,
        title: title,
        subtitle: 'Apple Fitness style performance ring'
      };
    }

    setWidgetsList([newWidget, ...widgetsList]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto text-[#D4D4D8] font-sans selection:bg-fuchsia-500/30">
      {/* SVG Linear Gradient Definitions */}
      <svg className="h-0 w-0 absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="appleGradientCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="appleGradientGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34C759" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#34C759" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="appleGradientYellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FACC15" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#FACC15" stopOpacity={0.0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[19px] font-bold text-white tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleStartEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <PencilIcon className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3F3F46] bg-[#2C2C2E] hover:bg-[#3F3F46] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Chart</span>
              </button>

              <button
                onClick={handleResetDefault}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#3F3F46] bg-[#2C2C2E] hover:bg-[#3F3F46] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>

              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-xl border border-[#3F3F46] bg-[#2C2C2E] hover:bg-[#3F3F46] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative inline-block text-left" ref={periodRef}>
          <button
            onClick={() => setIsPeriodOpen(!isPeriodOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-[#A1A1AA]" />
            <span>{selectedPeriod}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {isPeriodOpen && (
            <div className="absolute top-9 left-0 w-44 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              {periods.slice(0, 4).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedPeriod(p);
                    setIsPeriodOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${selectedPeriod === p ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                    }`}
                >
                  {p}
                </button>
              ))}
              <div className="h-px bg-[#2C2C2E] my-1"></div>
              <button
                onClick={() => {
                  setSelectedPeriod('Custom Range');
                  setIsPeriodOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${selectedPeriod === 'Custom Range' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                  }`}
              >
                Custom Range
              </button>
            </div>
          )}
        </div>

        <div className="relative inline-block text-left" ref={userRef}>
          <button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-[#A1A1AA]" />
            <span>{selectedUser}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {isUserOpen && (
            <div className="absolute top-9 left-0 w-56 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                />
                {userSearchQuery && (
                  <button onClick={() => setUserSearchQuery('')} className="absolute right-2 top-2 text-[#71717A] hover:text-white">
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="max-h-44 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                {filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u.name);
                      setIsUserOpen(false);
                    }}
                    className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${selectedUser === u.name ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                      }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#2C2C2E] text-[#A1A1AA] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {u.initial}
                    </span>
                    <span className="truncate">{u.name}</span>
                  </button>
                ))}
              </div>
              <div className="h-px bg-[#2C2C2E] my-1.5"></div>
              <button
                onClick={() => {
                  setSelectedUser('Sales User');
                  setUserSearchQuery('');
                  setIsUserOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[#A1A1AA] hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-left w-full cursor-pointer font-medium"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* UNIFIED DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {widgetsList.map((w, index) => (
          <div
            key={w.id}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            className={`transition-all duration-200 relative group ${w.kind === 'metric'
                ? 'col-span-1'
                : w.kind === 'spacer'
                  ? 'col-span-6'
                  : 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3'
              }`}
          >
            {/* Trash Delete Badge in Edit Mode */}
            {isEditMode && (
              <button
                onClick={() => handleDeleteWidget(w.id)}
                className="absolute -top-2 -right-2 bg-white text-slate-900 hover:bg-rose-500 hover:text-white p-1.5 rounded-full shadow-xl transition-colors cursor-pointer z-30"
                title="Delete widget"
              >
                <TrashIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}

            {/* Metric Card Widget */}
            {w.kind === 'metric' && (
              <div
                onMouseEnter={() => setHoveredTooltip(w.id)}
                onMouseLeave={() => setHoveredTooltip(null)}
                className={`bg-[#1C1C1E] p-4 rounded-2xl flex flex-col justify-between h-28 relative ${isEditMode ? 'border border-dashed border-[#52525B] cursor-grab active:cursor-grabbing hover:border-sky-400' : 'border border-[#2C2C2E] hover:border-[#3F3F46] transition-colors'
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-105' : ''}`}
              >
                <span className="text-xs font-normal text-[#A1A1AA] leading-snug">{w.title}</span>
                <span className="text-2xl font-bold text-white tracking-tight">{w.value}</span>

                {/* iOS White Speech Bubble Tooltip */}
                {hoveredTooltip === w.id && w.tooltip && !isEditMode && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-[#09090B] text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap z-40 pointer-events-none animate-in fade-in duration-150 flex flex-col items-center">
                    <span>{w.tooltip}</span>
                    <div className="w-2 h-2 bg-white rotate-45 -mb-1 mt-0.5"></div>
                  </div>
                )}
              </div>
            )}

            {/* Spacer Widget */}
            {w.kind === 'spacer' && (
              <div
                className={`w-full h-28 rounded-2xl border border-dashed border-[#52525B] bg-[#1C1C1E]/40 flex items-center justify-center ${isEditMode ? 'cursor-grab active:cursor-grabbing hover:border-sky-400' : ''
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-[1.01]' : ''}`}
              >
                <span className="text-sm font-medium text-[#71717A]">Spacer</span>
              </div>
            )}

            {/* Chart Widget */}
            {w.kind === 'chart' && (
              <div
                className={`bg-[#1C1C1E] p-5 rounded-2xl space-y-3 ${isEditMode ? 'border border-dashed border-[#52525B] cursor-grab active:cursor-grabbing hover:border-sky-400' : 'border border-[#2C2C2E] hover:border-[#3F3F46] transition-colors'
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-[1.01]' : ''}`}
              >
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{w.title}</h3>
                  <p className="text-xs text-[#71717A]">{w.subtitle || 'Performance metrics'}</p>
                </div>

                <div className="h-60 w-full pt-2 flex items-center justify-center">
                  {w.chartType === 'donut' ? (
                    <AppleDonutChart data={w.donutData || dealsByStageData} />
                  ) : w.chartType === 'funnel' ? (
                    <AppleSoftFunnelChart />
                  ) : w.chartType === 'bar' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Leads', count: 7 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} style={{ backgroundColor: 'transparent' }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" vertical={false} fill="none" />
                        <XAxis dataKey="name" stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                        <YAxis stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                        <Tooltip content={<AppleStocksTooltip />} />
                        <Bar dataKey="count" fill="url(#appleGradientCyan)" stroke="#38BDF8" strokeWidth={1.5} radius={[6, 6, 0, 0]} barSize={45} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateSalesTrendData(1)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} style={{ backgroundColor: 'transparent' }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" vertical={false} fill="none" />
                        <XAxis dataKey="name" stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                        <YAxis stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                        <Tooltip content={<AppleStocksTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Area type="monotone" dataKey="leads" name="Leads" stroke="#38BDF8" strokeWidth={2.5} fillOpacity={1} fill="url(#appleGradientCyan)" />
                        <Area type="monotone" dataKey="deals" name="Deals" stroke="#34C759" strokeWidth={2.5} fillOpacity={1} fill="url(#appleGradientGreen)" />
                        <Area type="monotone" dataKey="wonDeals" name="Won Deals" stroke="#FACC15" strokeWidth={2.5} fillOpacity={1} fill="url(#appleGradientYellow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Chart Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-5 w-full max-w-[420px] text-[#E4E4E7] space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Add Chart</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#71717A] hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-medium">Chart Type</label>
                <select
                  value={selectedChartType}
                  onChange={(e) => setSelectedChartType(e.target.value)}
                  className="w-full bg-[#2C2C2E] border border-[#3F3F46] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Spacer">Spacer</option>
                  <option value="Number Chart">Number Chart</option>
                  <option value="Axis Chart">Axis Chart</option>
                  <option value="Donut Chart">Donut Chart</option>
                </select>
              </div>

              {selectedChartType === 'Donut Chart' && (
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Donut Chart</label>
                  <select
                    value={selectedSubOption}
                    onChange={(e) => setSelectedSubOption(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-[#3F3F46] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Deals by Stage">Deals by Stage</option>
                    <option value="Leads by Source">Leads by Source</option>
                    <option value="Deals by Source">Deals by Source</option>
                  </select>
                </div>
              )}

              {selectedChartType === 'Axis Chart' && (
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Axis Chart</label>
                  <select
                    value={selectedSubOption}
                    onChange={(e) => setSelectedSubOption(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-[#3F3F46] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Sales trend">Sales trend</option>
                    <option value="Forecasted revenue">Forecasted revenue</option>
                    <option value="Funnel conversion">Funnel conversion</option>
                    <option value="Deals by territory">Deals by territory</option>
                    <option value="Deals by salesperson">Deals by salesperson</option>
                  </select>
                </div>
              )}

              {selectedChartType === 'Number Chart' && (
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Number Metric</label>
                  <select
                    value={selectedSubOption}
                    onChange={(e) => setSelectedSubOption(e.target.value)}
                    className="w-full bg-[#2C2C2E] border border-[#3F3F46] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Total leads">Total leads</option>
                    <option value="Ongoing deals">Ongoing deals</option>
                    <option value="Won deals">Won deals</option>
                    <option value="Avg. won deal value">Avg. won deal value</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2C2C2E] hover:bg-[#3F3F46] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWidget}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmDashboardPage;
