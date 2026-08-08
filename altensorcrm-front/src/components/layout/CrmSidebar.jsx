import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  Squares2X2Icon,
  UserGroupIcon,
  BoltIcon,
  UserIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  CheckCircleIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FunnelIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import altensorLogo from '../../assets/Altensor-Logo.png';

const menuItems = [
  { path: '/crm/notifications', label: 'Notifications', icon: BellIcon },
  { path: '/crm/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { path: '/crm/leads', label: 'Leads', icon: UserGroupIcon },
  { path: '/crm/deals', label: 'Deals', icon: BoltIcon },
  { path: '/crm/contacts', label: 'Contacts', icon: UserIcon },
  { path: '/crm/organizations', label: 'Organizations', icon: BuildingOffice2Icon },
  { path: '/crm/notes', label: 'Notes', icon: DocumentTextIcon },
  { path: '/crm/tasks', label: 'Tasks', icon: CheckCircleIcon },
  { path: '/crm/call-logs', label: 'Call Logs', icon: PhoneIcon },
];

const desktopApps = [
  {
    id: 'desk',
    name: 'Desk',
    route: '/desktop',
    iconElement: (
      <div className="w-6 h-6 rounded-lg bg-[#475569] text-white flex items-center justify-center shrink-0">
        <ComputerDesktopIcon className="w-3.5 h-3.5" />
      </div>
    )
  },
  {
    id: 'crm',
    name: 'Altensor CRM',
    route: '/crm/dashboard',
    iconElement: (
      <div className="w-6 h-6 rounded-lg bg-[#D946EF] text-white flex items-center justify-center shrink-0">
        <FunnelIcon className="w-3.5 h-3.5" />
      </div>
    )
  },
  {
    id: 'hr',
    name: 'Frappe HR',
    route: '/crm/dashboard',
    iconElement: (
      <div className="w-6 h-6 rounded-lg bg-[#10B981] text-white flex items-center justify-center shrink-0">
        <UserGroupIcon className="w-3.5 h-3.5" />
      </div>
    )
  },
  {
    id: 'helpdesk',
    name: 'Helpdesk',
    route: '/crm/dashboard',
    iconElement: (
      <div className="w-6 h-6 rounded-lg bg-[#6366F1] text-white flex items-center justify-center shrink-0">
        <Squares2X2Icon className="w-3.5 h-3.5" />
      </div>
    )
  },
  {
    id: 'erp',
    name: 'Altensor ERP',
    route: '/crm/dashboard',
    iconElement: (
      <div className="w-6 h-6 rounded-lg bg-black border border-white/20 flex items-center justify-center shrink-0">
        <img src={altensorLogo} alt="ERP" className="w-4 h-4 object-contain" />
      </div>
    )
  }
];

const CrmSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const [isAppsSubmenuOpen, setIsAppsSubmenuOpen] = useState(false);
  const brandMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close brand dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandMenuRef.current && !brandMenuRef.current.contains(event.target)) {
        setIsBrandMenuOpen(false);
        setIsAppsSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsBrandMenuOpen(false);
    navigate('/login');
  };

  const handleAppSelect = (route) => {
    setIsBrandMenuOpen(false);
    setIsAppsSubmenuOpen(false);
    if (route === '/desktop') {
      window.open(route, '_blank');
    } else {
      navigate(route);
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-56'
      } bg-[#18181B] text-[#A1A1AA] border-r border-[#27272A] min-h-screen flex flex-col justify-between p-2.5 transition-all duration-200 select-none z-40 selection:bg-fuchsia-500/30 shrink-0`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-3">
        {/* Brand Card (CRM Administrator) with Dropdown */}
        <div className="relative" ref={brandMenuRef}>
          <div
            onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
            className={`flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer ${
              isBrandMenuOpen ? 'bg-white/[0.08]' : ''
            } ${isCollapsed ? 'justify-center p-1.5' : ''}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* iOS Magenta Squircle Icon */}
              <div className="w-7 h-7 rounded-lg bg-[#D946EF] text-white flex items-center justify-center shadow-md shadow-fuchsia-500/20 shrink-0">
                <FunnelIcon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col text-left min-w-0">
                  <span className="font-bold text-white text-[13.5px] leading-snug tracking-tight truncate">
                    CRM
                  </span>
                  <span className="text-[11px] text-[#A1A1AA] font-normal leading-none truncate">
                    Administrator
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0 ml-1" />}
          </div>

          {/* Main Brand Dropdown Menu (Matching Reference Image 1 & 2) */}
          {isBrandMenuOpen && (
            <div className="absolute top-11 left-0 w-52 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-[13px] text-[#D4D4D8] animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Apps Menu Item with Flyout Submenu */}
              <div
                className="relative"
                onMouseEnter={() => setIsAppsSubmenuOpen(true)}
                onMouseLeave={() => setIsAppsSubmenuOpen(false)}
              >
                <div
                  onClick={() => setIsAppsSubmenuOpen(!isAppsSubmenuOpen)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#2C2C2E] hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Squares2X2Icon className="w-4 h-4 text-[#A1A1AA]" />
                    <span>Apps</span>
                  </div>
                  <ChevronRightIcon className="w-3.5 h-3.5 text-[#71717A]" />
                </div>

                {/* Submenu Flyout for Desktop Apps (Matching Reference Image 2) */}
                {isAppsSubmenuOpen && (
                  <div className="absolute top-0 left-full ml-1.5 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-left-1 duration-150">
                    {desktopApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleAppSelect(app.route)}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#D4D4D8] hover:text-white transition-colors cursor-pointer text-[13px]"
                      >
                        {app.iconElement}
                        <span className="truncate">{app.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                onClick={() => {
                  setIsBrandMenuOpen(false);
                  navigate('/crm/settings');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] hover:text-white transition-colors text-left w-full cursor-pointer"
              >
                <Cog6ToothIcon className="w-4 h-4 text-[#A1A1AA]" />
                <span>Settings</span>
              </button>

              {/* About */}
              <button
                onClick={() => {
                  setIsBrandMenuOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] hover:text-white transition-colors text-left w-full cursor-pointer"
              >
                <InformationCircleIcon className="w-4 h-4 text-[#A1A1AA]" />
                <span>About</span>
              </button>

              <div className="h-px bg-[#2C2C2E] my-1"></div>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-left w-full text-[#A1A1AA] cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation List with iOS Apple SF Symbols */}
        <nav className="flex flex-col gap-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[13px] font-normal transition-colors ${
                    isCollapsed ? 'justify-center px-0 py-2' : ''
                  } ${
                    isActive
                      ? 'bg-[#27272A] text-white font-medium shadow-xs'
                      : 'text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white'
                  }`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] stroke-[1.75] shrink-0 text-[#A1A1AA]" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions (Help & Collapse) */}
      <div className="flex flex-col gap-0.5 pt-2 border-t border-[#27272A]/70">
        <NavLink
          to="/crm/help"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[13px] font-normal transition-colors ${
              isCollapsed ? 'justify-center px-0 py-2' : ''
            } ${
              isActive
                ? 'bg-[#27272A] text-white font-medium'
                : 'text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white'
            }`
          }
          title={isCollapsed ? 'Help' : undefined}
        >
          <QuestionMarkCircleIcon className="w-[18px] h-[18px] stroke-[1.75] shrink-0" />
          {!isCollapsed && <span>Help</span>}
        </NavLink>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-[13px] font-normal text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0 py-2' : ''
          }`}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-[18px] h-[18px] stroke-[1.75] shrink-0" />
          ) : (
            <>
              <ChevronLeftIcon className="w-[18px] h-[18px] stroke-[1.75] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default CrmSidebar;
