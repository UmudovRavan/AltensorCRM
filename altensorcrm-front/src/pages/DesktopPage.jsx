import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
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
  Users,
  CheckSquare
} from 'lucide-react';
import altensorLogo from '../assets/Altensor-Logo.png';
import { getAuthToken, usersApi } from '../services/api';

const appsList = [
  {
    id: 'altensor',
    name: 'Altensor',
    isLogo: true,
    bgClass: 'bg-white border border-slate-200 shadow-sm',
    route: '/crm/dashboard'
  },
  {
    id: 'tasks',
    name: 'Task Management',
    icon: CheckSquare,
    isTaskLogo: true,
    bgClass: 'bg-white border border-slate-200 shadow-sm',
    externalRoute: 'http://31.57.77.199:8081/dashboard'
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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('desktopTheme') === 'dark';
  });
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    initial: 'U',
    avatarUrl: null
  });

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Load current user profile for header avatar
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const me = await usersApi.getMe();
        if (me) {
          const profileName = me.name || `${me.firstName || ''} ${me.lastName || ''}`.trim() || me.email || 'User';
          setUserProfile({
            name: profileName,
            initial: profileName.charAt(0).toUpperCase() || 'U',
            avatarUrl: me.avatarUrl || null
          });
        }
      } catch (err) {
        console.warn('Notice loading current user profile for Desktop:', err);
      }
    };
    fetchMe();
  }, []);

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

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('desktopTheme', newMode ? 'dark' : 'light');
  };

  const filteredApps = appsList.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (app) => {
    if (app.externalRoute) {
      const token = getAuthToken() || localStorage.getItem('token') || '';
      if (!token) {
        navigate('/login');
        return;
      }
      const targetUrl = `${app.externalRoute}?token=${encodeURIComponent(token)}`;
      window.location.href = targetUrl; // eyni tab, popup blocker riski yoxdur
    } else if (app.route) {
      navigate(app.route);
    } else {
      console.log(`Opening app: ${app.name}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-200 ${isDarkMode ? 'bg-[#0F172A] text-slate-100 selection:bg-indigo-900' : 'bg-white text-slate-800 selection:bg-indigo-100'
      }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${isDarkMode ? 'bg-[#0F172A]/90 border-slate-800/80' : 'bg-white/90 border-slate-100'
        }`}>
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
                className={`w-full text-sm rounded-full pl-10 pr-16 py-2 border transition-all placeholder:text-slate-400 focus:outline-none ${isDarkMode
                  ? 'bg-[#1E293B] text-white border-transparent focus:border-slate-700'
                  : 'bg-[#F3F4F6] text-slate-700 hover:bg-[#EEF2F6] focus:bg-white border-transparent focus:border-slate-200'
                  }`}
              />
              <span className={`absolute right-3 text-[11px] font-medium px-1.5 py-0.5 rounded border pointer-events-none ${isDarkMode ? 'text-slate-400 bg-slate-800/60 border-slate-700' : 'text-slate-400 bg-white/60 border-slate-200/60'
                }`}>
                Ctrl+K
              </span>
            </div>
          </div>

          {/* Right: Actions & User Avatar Dropdown */}
          <div className="flex items-center gap-4 relative" ref={menuRef}>
            <button className={`p-2 rounded-full transition-colors relative cursor-pointer ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}>
              <Bell className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-sm hover:ring-2 hover:ring-emerald-200 transition-all shrink-0 border border-slate-200/40"
              id="userMenuBtn"
            >
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl.startsWith('http') ? userProfile.avatarUrl : `https://localhost:7114${userProfile.avatarUrl}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#15803D] font-semibold text-sm flex items-center justify-center">
                  {userProfile.initial}
                </div>
              )}
            </button>

            {/* Clean Dropdown Menu */}
            {isUserMenuOpen && (
              <div className={`absolute top-12 right-0 w-56 rounded-2xl border shadow-xl p-2 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150 ${isDarkMode ? 'bg-[#1C1C1E] border-[#2C2C2E] text-white' : 'bg-white border-slate-100 text-slate-700'
                }`}>
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${isDarkMode ? 'hover:bg-[#27272A] text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                  <span>{isDarkMode ? 'Light Theme' : 'Toggle Theme'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left cursor-pointer ${isDarkMode ? 'hover:bg-[#27272A] text-red-400' : 'hover:bg-slate-50 text-red-600'
                    }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
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
                  ) : app.isTaskLogo ? (
                    <div className="relative flex items-center justify-center">
                      <img src={altensorLogo} alt="Task Management" className="w-9 h-9 object-contain opacity-90" />
                      <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center shadow-xs">
                        <CheckSquare className="w-3 h-3 text-white stroke-[2.5]" />
                      </span>
                    </div>
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
                <span className={`mt-2.5 text-xs sm:text-[13px] font-semibold text-center tracking-tight truncate w-full transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                  }`}>
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
