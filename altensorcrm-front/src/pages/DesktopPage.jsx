import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Pencil,
  Moon,
  Info,
  Headphones,
  RotateCcw,
  LogOut,
  Trash2,
  CreditCard,
  Box,
  Filter,
  Ticket,
  Network,
  Grid,
  Layers,
  Tag,
  Cpu,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  Archive,
  RefreshCw,
  Settings,
  Users
} from 'lucide-react';
import altensorLogo from '../assets/Altensor-Logo.png';

const appsList = [
  {
    id: 'altensor',
    name: 'Altensor',
    isLogo: true,
    bgClass: 'bg-white border border-slate-200 shadow-sm',
    route: '/crm/dashboard'
  },
  {
    id: 'framework',
    name: 'Framework',
    icon: Box,
    bgClass: 'bg-[#475569] text-white shadow-sm',
  },
  {
    id: 'crm',
    name: 'Altensor CRM',
    icon: Filter,
    bgClass: 'bg-[#D946EF] text-white shadow-sm',
    route: '/crm/dashboard'
  },
  {
    id: 'helpdesk',
    name: 'Helpdesk',
    icon: Ticket,
    bgClass: 'bg-[#6366F1] text-white shadow-sm',
  },
  {
    id: 'organization',
    name: 'Organization',
    icon: Network,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    isAccountingGrid: true,
    bgClass: 'bg-[#F0F9FF] border border-slate-200/80 shadow-sm',
  },
  {
    id: 'assets',
    name: 'Assets',
    icon: Layers,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'buying',
    name: 'Buying',
    icon: Tag,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Cpu,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: LayoutDashboard,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'quality',
    name: 'Quality',
    icon: ShieldCheck,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'selling',
    name: 'Selling',
    icon: Briefcase,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'stock',
    name: 'Stock',
    icon: Archive,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'subcontracting',
    name: 'Subcontracting',
    icon: RefreshCw,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'settings',
    name: 'Altensor Settings',
    icon: Settings,
    bgClass: 'bg-[#0284C7] text-white shadow-sm',
  },
  {
    id: 'hr',
    name: 'Altensor HR',
    icon: Users,
    bgClass: 'bg-[#10B981] text-white shadow-sm',
  }
];

const DesktopPage = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredApps = appsList.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (app) => {
    if (app.route) {
      window.open(app.route, '_blank');
    } else {
      console.log(`Opening app: ${app.name}`);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="bg-white min-h-screen text-slate-800 font-sans flex flex-col antialiased selection:bg-indigo-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <img src={altensorLogo} alt="Altensor Logo" className="h-8 w-auto object-contain cursor-pointer" onClick={() => navigate('/desktop')} />
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-6 relative">
            <div className="relative flex items-center w-full">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3F4F6] hover:bg-[#EEF2F6] focus:bg-white text-slate-700 text-sm rounded-full pl-10 pr-16 py-2 border border-transparent focus:border-slate-200 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-3 text-[11px] font-medium text-slate-400 bg-white/60 px-1.5 py-0.5 rounded border border-slate-200/60 pointer-events-none">
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Right: Actions & User Avatar Dropdown */}
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Profile Avatar "A" */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#15803D] font-semibold text-sm flex items-center justify-center hover:ring-2 hover:ring-emerald-200 transition-all cursor-pointer shadow-sm"
              id="userMenuBtn"
            >
              A
            </button>

            {/* Dropdown Menu (Matching Reference Image 2) */}
            {isUserMenuOpen && (
              <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl p-2 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <Pencil className="w-4 h-4 text-slate-400" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <Moon className="w-4 h-4 text-slate-400" />
                  <span>Toggle Theme</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>About</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <Headphones className="w-4 h-4 text-slate-400" />
                  <span>Altensor Support</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4 text-slate-400" />
                  <span>Reset Desktop Layout</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Logout</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  <span>Delete Demo Data</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-normal transition-colors text-left"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Manage Billing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Area (Matching Reference Image 1) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-start">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-8 gap-y-10 w-full justify-items-center">
          {filteredApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="flex flex-col items-center group cursor-pointer w-24"
              >
                {/* iOS Squircle Icon Container */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] ${app.bgClass} flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-1 relative overflow-hidden`}
                >
                  {app.isLogo ? (
                    <img src={altensorLogo} alt="Altensor" className="w-10 h-10 object-contain" />
                  ) : app.isAccountingGrid ? (
                    <div className="grid grid-cols-2 gap-1.5 p-3">
                      <div className="w-3.5 h-3.5 rounded bg-sky-500"></div>
                      <div className="w-3.5 h-3.5 rounded bg-indigo-500"></div>
                      <div className="w-3.5 h-3.5 rounded bg-blue-500"></div>
                      <div className="w-3.5 h-3.5 rounded bg-teal-500"></div>
                    </div>
                  ) : (
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
                  )}
                </div>

                {/* Icon Label */}
                <span className="mt-2.5 text-xs sm:text-[13px] font-semibold text-slate-700 text-center tracking-tight truncate w-full group-hover:text-slate-900 transition-colors">
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default DesktopPage;
