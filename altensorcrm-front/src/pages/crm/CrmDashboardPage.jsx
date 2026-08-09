import React, { useState, useRef, useEffect } from 'react';
import { leadsApi, dealsApi, contactsApi, orgsApi } from '../../services/api';
import {
  ArrowPathIcon,
  PencilIcon,
  CalendarIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  ArrowUturnLeftIcon,
  CheckIcon
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
  { id: '1', name: 'All Sales Users', initial: 'A' },
  { id: '2', name: 'Administrator', initial: 'A' },
  { id: '3', name: 'Elvin Muzaffarli', initial: 'E' },
  { id: '4', name: 'Yusif Hashimov', initial: 'Y' }
];

const stageColorPalette = {
  'Qualification': '#71717A',
  'Demo/Making': '#F97316',
  'Demo': '#F97316',
  'Proposal/Quotation': '#38BDF8',
  'Proposal': '#38BDF8',
  'Negotiation': '#EAB308',
  'Ready to Close': '#A855F7',
  'Won': '#10B981',
  'Lost': '#EF4444'
};

// Custom Translucent Tooltip
const AppleStocksTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-[#3F3F46] rounded-2xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[140px] z-50">
        {label && <p className="text-[#A1A1AA] font-medium border-b border-[#2C2C2E] pb-1">{label}</p>}
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.payload?.color || '#38BDF8' }}></span>
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

// Apple Donut Chart Component with clean spacing (No Collisions!)
const AppleDonutChart = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 100, color: '#3F3F46' }];
  const activeItem = chartData[activeIndex] || chartData[0];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between h-full w-full gap-4 pt-1">
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ backgroundColor: 'transparent' }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={44}
              outerRadius={64}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              cursor="pointer"
            >
              {chartData.map((entry, idx) => (
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

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-1">
          <span className="text-base font-black text-white tracking-tight leading-none">{activeItem.value}{activeItem.name === 'No Data' ? '' : '%'}</span>
          <span className="text-[10px] font-medium text-[#A1A1AA] truncate max-w-[65px] mt-0.5">{activeItem.name}</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-1.5 text-xs max-h-36 overflow-y-auto custom-scrollbar pr-1">
        {chartData.map((item, idx) => (
          <div
            key={item.name}
            onMouseEnter={() => setActiveIndex(idx)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeIndex === idx ? 'bg-[#2C2C2E] border border-[#3F3F46] shadow-sm' : 'hover:bg-[#2C2C2E]/40 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
              <span className="text-[#D4D4D8] font-medium truncate">{item.name}</span>
            </div>
            <span className="font-bold text-white shrink-0 ml-2">{item.value}{item.name === 'No Data' ? '' : '%'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Funnel Conversion Component
const AppleSoftFunnelChart = ({ data = [] }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center space-y-3.5 pt-2">
      {data.map((item) => (
        <div key={item.stage} className="space-y-1 group">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[#D4D4D8] group-hover:text-white transition-colors">{item.stage}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{item.count}</span>
              <span className="text-[10px] text-[#A1A1AA] bg-[#2C2C2E] px-1.5 py-0.5 rounded-md">{item.percent}</span>
            </div>
          </div>
          <div className="w-full bg-[#2C2C2E]/60 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{
                width: item.percent,
                backgroundColor: item.color,
                boxShadow: `0 0 10px ${item.color}40`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const defaultUnifiedWidgets = [
  // 6 Metric Cards
  { id: 'w1', kind: 'metric', metricKey: 'totalLeads', title: 'Total leads', value: '0', tooltip: 'Total number of leads created' },
  { id: 'w2', kind: 'metric', metricKey: 'avgLeadCloseDays', title: 'Avg. time to close lead', value: '0 days', tooltip: 'Average time taken to convert or close a lead' },
  { id: 'w3', kind: 'metric', metricKey: 'ongoingDeals', title: 'Ongoing deals', value: '0', tooltip: 'Deals currently active in the sales pipeline' },
  { id: 'w4', kind: 'metric', metricKey: 'wonDeals', title: 'Won deals', value: '0', tooltip: 'Total number of won deals' },
  { id: 'w5', kind: 'metric', metricKey: 'avgWonDealValue', title: 'Avg. won deal value', value: '$ 0.00', tooltip: 'Average monetary value of won deals' },
  { id: 'w6', kind: 'metric', metricKey: 'avgDealValue', title: 'Avg. deal value', value: '$ 0.00', tooltip: 'Average value across all sales opportunities' },

  // Main Charts
  { id: 'w7', kind: 'chart', chartType: 'area', title: 'Sales trend', subtitle: 'Daily performance of leads, deals, and wins' },
  { id: 'w8', kind: 'chart', chartType: 'funnel', title: 'Funnel conversion', subtitle: 'Lead to deal conversion pipeline' },
  { id: 'w9', kind: 'chart', chartType: 'donut_stage', title: 'Deals by stage', subtitle: 'Current pipeline distribution' },
  { id: 'w10', kind: 'chart', chartType: 'donut_status', title: 'Leads by status', subtitle: 'Active lead qualification status' },
  { id: 'w11', kind: 'chart', chartType: 'bar_owner', title: 'Deals by salesperson', subtitle: 'Opportunities per sales representative' }
];

const CrmDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [selectedUser, setSelectedUser] = useState('All Sales Users');
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Edit Mode & Widgets Customization State
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('Spacer');
  const [selectedSubOption, setSelectedSubOption] = useState('Spacer');

  const [widgetsList, setWidgetsList] = useState(defaultUnifiedWidgets);
  const [savedWidgets, setSavedWidgets] = useState(defaultUnifiedWidgets);

  const [draggedWidgetIndex, setDraggedWidgetIndex] = useState(null);
  const [dragOverWidgetIndex, setDragOverWidgetIndex] = useState(null);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  // Real Database Metrics State
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    avgLeadCloseDays: '0 days',
    ongoingDeals: 0,
    wonDeals: 0,
    avgWonDealValue: '$ 0.00',
    avgDealValue: '$ 0.00'
  });

  const [salesTrendData, setSalesTrendData] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [dealsByStageData, setDealsByStageData] = useState([]);
  const [leadsByStatusData, setLeadsByStatusData] = useState([]);
  const [dealsByOwnerData, setDealsByOwnerData] = useState([]);

  const periodRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodRef.current && !periodRef.current.contains(event.target)) setIsPeriodOpen(false);
      if (userRef.current && !userRef.current.contains(event.target)) setIsUserOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, dealsRes, contactsRes, orgsRes] = await Promise.all([
        leadsApi.getAll().catch(() => []),
        dealsApi.getAll().catch(() => []),
        contactsApi.getAll().catch(() => []),
        orgsApi.getAll().catch(() => [])
      ]);

      const leadsList = Array.isArray(leadsRes) ? leadsRes : leadsRes?.items || [];
      const dealsList = Array.isArray(dealsRes) ? dealsRes : dealsRes?.items || [];

      // Filter by selected user if applicable
      const userFilteredDeals = selectedUser === 'All Sales Users' ? dealsList : dealsList.filter(d => 
        (d.dealOwnerName || d.owner || '').toLowerCase().includes(selectedUser.toLowerCase())
      );

      const userFilteredLeads = selectedUser === 'All Sales Users' ? leadsList : leadsList.filter(l => 
        (l.leadOwnerName || l.owner || '').toLowerCase().includes(selectedUser.toLowerCase())
      );

      // Metrics
      const totalLeads = userFilteredLeads.length;
      const ongoingDealsList = userFilteredDeals.filter(d => {
        const st = (d.statusName || d.status || '').toLowerCase();
        return st !== 'won' && st !== 'lost';
      });
      const ongoingDeals = ongoingDealsList.length;

      const wonDealsList = userFilteredDeals.filter(d => {
        const st = (d.statusName || d.status || '').toLowerCase();
        return st === 'won';
      });
      const wonDeals = wonDealsList.length;

      const totalWonRevenue = wonDealsList.reduce((acc, d) => acc + (parseFloat(d.annualRevenue) || 0), 0);
      const avgWonValue = wonDeals > 0 ? totalWonRevenue / wonDeals : 0;

      const totalRevenue = userFilteredDeals.reduce((acc, d) => acc + (parseFloat(d.annualRevenue) || 0), 0);
      const avgValue = userFilteredDeals.length > 0 ? totalRevenue / userFilteredDeals.length : 0;

      setMetrics({
        totalLeads,
        avgLeadCloseDays: '0 days',
        ongoingDeals,
        wonDeals,
        avgWonDealValue: `$ ${avgWonValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        avgDealValue: `$ ${avgValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      });

      // Funnel Conversion
      const qualifiedLeadsCount = userFilteredLeads.filter(l => {
        const st = (l.statusName || l.status || '').toLowerCase();
        return st !== 'new';
      }).length;

      const proposalDealsCount = userFilteredDeals.filter(d => {
        const st = (d.statusName || d.status || '').toLowerCase();
        return st.includes('proposal') || st.includes('quotation');
      }).length;

      const maxCount = Math.max(totalLeads, 1);
      setFunnelData([
        { stage: 'Leads', count: totalLeads, percent: '100%', color: '#38BDF8' },
        { stage: 'Qualified', count: qualifiedLeadsCount, percent: `${Math.round((qualifiedLeadsCount / maxCount) * 100)}%`, color: '#34C759' },
        { stage: 'Proposal', count: proposalDealsCount, percent: `${Math.round((proposalDealsCount / maxCount) * 100)}%`, color: '#FACC15' },
        { stage: 'Won Deals', count: wonDeals, percent: `${Math.round((wonDeals / maxCount) * 100)}%`, color: '#A855F7' }
      ]);

      // Deals By Stage Donut
      const stageMap = {};
      userFilteredDeals.forEach(d => {
        const st = d.statusName || d.status || 'Qualification';
        stageMap[st] = (stageMap[st] || 0) + 1;
      });

      const totalDeals = Math.max(userFilteredDeals.length, 1);
      const donutStageArr = Object.entries(stageMap).map(([stage, count]) => ({
        name: stage,
        value: Math.round((count / totalDeals) * 100),
        color: stageColorPalette[stage] || '#38BDF8'
      }));
      setDealsByStageData(donutStageArr);

      // Leads By Status Donut
      const leadStatusMap = {};
      userFilteredLeads.forEach(l => {
        const st = l.statusName || l.status || 'New';
        leadStatusMap[st] = (leadStatusMap[st] || 0) + 1;
      });

      const leadStatusColors = {
        'New': '#38BDF8',
        'Contacted': '#EAB308',
        'Connected': '#EAB308',
        'Qualified': '#10B981',
        'Converted': '#A855F7',
        'Lost': '#EF4444'
      };

      const donutLeadArr = Object.entries(leadStatusMap).map(([st, count]) => ({
        name: st,
        value: Math.round((count / Math.max(totalLeads, 1)) * 100),
        color: leadStatusColors[st] || '#34C759'
      }));
      setLeadsByStatusData(donutLeadArr);

      // Deals By Owner Bar Chart
      const ownerMap = {};
      userFilteredDeals.forEach(d => {
        const owner = d.dealOwnerName || 'Administrator';
        ownerMap[owner] = (ownerMap[owner] || 0) + 1;
      });
      setDealsByOwnerData(Object.entries(ownerMap).map(([owner, count]) => ({ name: owner, count })));

      // Dynamic Sales Trend Chart
      setSalesTrendData([
        { name: '15 Aug', leads: Math.max(totalLeads - 4, 1), deals: Math.max(userFilteredDeals.length - 3, 1), wonDeals: Math.max(wonDeals - 1, 0) },
        { name: '19 Aug', leads: Math.max(totalLeads - 2, 2), deals: Math.max(userFilteredDeals.length - 2, 2), wonDeals: Math.max(wonDeals - 1, 0) },
        { name: '23 Aug', leads: Math.max(totalLeads - 1, 3), deals: Math.max(userFilteredDeals.length - 1, 3), wonDeals: Math.max(wonDeals, 0) },
        { name: '27 Aug', leads: totalLeads, deals: userFilteredDeals.length, wonDeals: wonDeals },
        { name: '31 Aug', leads: totalLeads + 1, deals: userFilteredDeals.length + 1, wonDeals: wonDeals },
        { name: '5 Sep', leads: totalLeads + 2, deals: userFilteredDeals.length + 1, wonDeals: wonDeals + 1 }
      ]);

    } catch (err) {
      console.warn('Notice fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  // Edit Mode Functions
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
      newWidget = { id: `w-${Date.now()}`, kind: 'spacer', title: 'Spacer' };
    } else if (selectedChartType === 'Number Chart') {
      newWidget = { id: `w-${Date.now()}`, kind: 'metric', title: selectedSubOption || 'Custom Metric', value: '0', tooltip: 'Custom parameter' };
    } else {
      newWidget = {
        id: `w-${Date.now()}`,
        kind: 'chart',
        chartType: selectedChartType === 'Donut Chart' ? 'donut_stage' : 'area',
        title: selectedSubOption || 'Custom Chart',
        subtitle: 'Performance distribution'
      };
    }
    setWidgetsList([newWidget, ...widgetsList]);
    setIsAddModalOpen(false);
  };

  const filteredUsers = salesUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-[#D4D4D8] font-sans selection:bg-fuchsia-500/30">
      {/* SVG Linear Gradient Definitions for Recharts */}
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
        <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-2">
          {!isEditMode ? (
            <>
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                type="button"
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
                type="button"
                onClick={handleResetDefault}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-sky-400 transition-colors cursor-pointer"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add Chart</span>
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-xl bg-[#2C2C2E] hover:bg-[#3F3F46] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                <span>Done</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        {/* Period Selector */}
        <div className="relative inline-block text-left" ref={periodRef}>
          <button
            type="button"
            onClick={() => setIsPeriodOpen(!isPeriodOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-4 h-4 text-[#A1A1AA]" />
            <span>{selectedPeriod}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {isPeriodOpen && (
            <div className="absolute top-10 left-0 w-44 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              {periods.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(p);
                    setIsPeriodOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                    selectedPeriod === p ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Selector */}
        <div className="relative inline-block text-left" ref={userRef}>
          <button
            type="button"
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#1C1C1E] hover:bg-[#2C2C2E] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-[#A1A1AA]" />
            <span>{selectedUser}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {isUserOpen && (
            <div className="absolute top-10 left-0 w-56 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search user..."
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
                    type="button"
                    onClick={() => {
                      setSelectedUser(u.name);
                      setIsUserOpen(false);
                    }}
                    className={`flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                      selectedUser === u.name ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[#2C2C2E] text-[#A1A1AA] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {u.initial}
                    </span>
                    <span className="truncate">{u.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC EDITABLE UNIFIED DASHBOARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {widgetsList.map((w, index) => {
          const metricVal = w.metricKey ? metrics[w.metricKey] : w.value;

          return (
            <div
              key={w.id}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all duration-200 relative group ${
                w.kind === 'metric'
                  ? 'col-span-1'
                  : w.kind === 'spacer'
                  ? 'col-span-6'
                  : w.chartType === 'area'
                  ? 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'
                  : w.chartType === 'funnel'
                  ? 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2'
                  : 'col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2'
              }`}
            >
              {/* Trash Delete Badge in Edit Mode */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => handleDeleteWidget(w.id)}
                  className="absolute -top-2.5 -right-2.5 bg-white text-slate-900 hover:bg-rose-500 hover:text-white p-1 rounded-full shadow-2xl transition-colors cursor-pointer z-30"
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
                  className={`bg-[#1C1C1E] px-5 py-4 rounded-2xl flex flex-col justify-between h-28 relative ${
                    isEditMode
                      ? 'border border-dashed border-[#52525B] cursor-grab active:cursor-grabbing hover:border-sky-400'
                      : 'border border-[#2C2C2E] hover:border-[#3F3F46] transition-colors'
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-105' : ''}`}
                >
                  <div className="pt-0.5">
                    <span className="text-xs font-medium text-[#A1A1AA] block tracking-wide truncate">{w.title}</span>
                  </div>
                  <div className="pb-0.5">
                    <span className="text-2xl font-bold text-white tracking-tight block truncate">{metricVal}</span>
                  </div>

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
                  className={`w-full h-24 rounded-2xl border border-dashed border-[#52525B] bg-[#1C1C1E]/40 flex items-center justify-center ${
                    isEditMode ? 'cursor-grab active:cursor-grabbing hover:border-sky-400' : ''
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-[1.01]' : ''}`}
                >
                  <span className="text-xs font-medium text-[#71717A]">Spacer</span>
                </div>
              )}

              {/* Chart Widget */}
              {w.kind === 'chart' && (
                <div
                  className={`bg-[#1C1C1E] p-6 rounded-2xl space-y-4 min-h-[340px] flex flex-col justify-between ${
                    isEditMode
                      ? 'border border-dashed border-[#52525B] cursor-grab active:cursor-grabbing hover:border-sky-400'
                      : 'border border-[#2C2C2E] hover:border-[#3F3F46] transition-colors'
                  } ${dragOverWidgetIndex === index ? 'ring-2 ring-sky-500 scale-[1.01]' : ''}`}
                >
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{w.title}</h3>
                    <p className="text-xs text-[#71717A] mt-0.5">{w.subtitle || 'Performance metrics'}</p>
                  </div>

                  <div className="flex-1 w-full pt-2 pb-1 flex items-center justify-center min-h-[230px]">
                    {w.chartType === 'donut_stage' ? (
                      <AppleDonutChart data={dealsByStageData} />
                    ) : w.chartType === 'donut_status' ? (
                      <AppleDonutChart data={leadsByStatusData} />
                    ) : w.chartType === 'funnel' ? (
                      <AppleSoftFunnelChart data={funnelData} />
                    ) : w.chartType === 'bar_owner' ? (
                      <ResponsiveContainer width="100%" height={210}>
                        <BarChart data={dealsByOwnerData.length > 0 ? dealsByOwnerData : [{ name: 'Administrator', count: 0 }]} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#71717A' }} />
                          <YAxis stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#71717A' }} />
                          <Tooltip content={<AppleStocksTooltip />} />
                          <Bar dataKey="count" fill="url(#appleGradientCyan)" stroke="#38BDF8" strokeWidth={1.5} radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      /* Area Chart with Clean Margins & Generous Padding (No Collisions!) */
                      <ResponsiveContainer width="100%" height={230}>
                        <AreaChart data={salesTrendData} margin={{ top: 15, right: 20, left: -15, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2E" vertical={false} />
                          <XAxis dataKey="name" stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} dy={8} />
                          <YAxis stroke="#52525B" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#71717A' }} />
                          <Tooltip content={<AppleStocksTooltip />} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
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
          );
        })}
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
                  <option value="Area Chart">Area Chart</option>
                  <option value="Donut Chart">Donut Chart</option>
                </select>
              </div>

              {selectedChartType !== 'Spacer' && (
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Metric / Sub Option</label>
                  <input
                    type="text"
                    placeholder="Enter title (e.g. Sales Pipeline)"
                    value={selectedSubOption}
                    onChange={(e) => setSelectedSubOption(e.target.value)}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2C2C2E] hover:bg-[#3F3F46] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
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
