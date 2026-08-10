import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  UserIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ComputerDesktopIcon,
  SparklesIcon,
  UserGroupIcon,
  UserPlusIcon,
  ShareIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
  HomeIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  ArrowPathIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  ChevronDownIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  ShieldExclamationIcon,
  InboxIcon,
  DocumentDuplicateIcon,
  AdjustmentsVerticalIcon,
  CogIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const navCategories = [
  {
    category: 'User Configuration',
    items: [
      { id: 'profile', label: 'Profile', icon: UserIcon },
      { id: 'preferences', label: 'Preferences', icon: AdjustmentsHorizontalIcon }
    ]
  },
  {
    category: 'System Configuration',
    items: [
      { id: 'general', label: 'General', icon: Cog6ToothIcon },
      { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
      { id: 'defaults', label: 'Defaults', icon: ComputerDesktopIcon },
      { id: 'brand', label: 'Brand', icon: SparklesIcon }
    ]
  },
  {
    category: 'User Management',
    items: [
      { id: 'users', label: 'Users', icon: UserGroupIcon },
      { id: 'invite', label: 'Invite User', icon: UserPlusIcon },
      { id: 'hierarchy', label: 'Sales Hierarchy', icon: ShareIcon }
    ]
  },
  {
    category: 'Email',
    items: [
      { id: 'email_accounts', label: 'Accounts', icon: EnvelopeIcon },
      { id: 'email_templates', label: 'Templates', icon: DocumentTextIcon }
    ]
  },
  {
    category: 'Automation & Rules',
    items: [
      { id: 'assignment_rules', label: 'Assignment Rules', icon: ScaleIcon },
      { id: 'sla_policies', label: 'SLA Policies', icon: ShieldCheckIcon }
    ]
  },
  {
    category: 'Customization',
    items: [
      { id: 'home_actions', label: 'Home Actions', icon: HomeIcon }
    ]
  },
  {
    category: 'Integrations',
    items: [
      { id: 'telephony', label: 'Telephony', icon: PhoneIcon },
      { id: 'erpnext', label: 'ERPNext', icon: BuildingOffice2Icon },
      { id: 'lead_syncing', label: 'Lead Syncing', icon: ArrowPathIcon }
    ]
  }
];

const initialUsersList = [
  { id: '1', name: 'Eflan', email: 'avalon.fabrik@gmail.com', initial: 'E', role: 'Manager', isManager: true },
  { id: '2', name: 'Elvin Muzaffarli', email: 'elvinmuzaffarli@gmail.com', initial: 'E', role: 'Admin', isManager: false },
  { id: '3', name: 'Fidan', email: 'fidan@bmgi.az', initial: 'F', role: 'Admin', isManager: false },
  { id: '4', name: 'Info', email: 'info@bmgi.az', initial: 'İ', role: 'Admin', isManager: false },
  { id: '5', name: 'Orxan', email: 'orkhan@bmgi.az', initial: 'O', role: 'Admin', isManager: false },
  { id: '6', name: 'Said Baghirov', email: 'said@apply-uni.com', initial: 'S', role: 'Admin', isManager: false },
  { id: '7', name: 'Yusif Hashimov', email: 'yusif.hashimov@outlook.com', initial: 'Y', role: 'Admin', isManager: false }
];

const initialHomeActions = [
  { id: '1', no: 1, label: 'Apps', type: 'Route', route: '#', hidden: false },
  { id: '2', no: 2, label: 'Settings', type: 'Route', route: '#', hidden: false },
  { id: '3', no: 3, label: 'Login to Frappe Cloud', type: 'Route', route: '#', hidden: false },
  { id: '4', no: 4, label: 'About', type: 'Route', route: '#', hidden: false },
  { id: '5', no: 5, label: '', type: 'Separator', route: '', hidden: false },
  { id: '6', no: 6, label: 'Log out', type: 'Route', route: '#', hidden: false }
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Edit Modal / Form States
  const [userProfile, setUserProfile] = useState({
    name: 'Administrator',
    email: 'admin@example.com',
    initial: 'A'
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  // Email & Signature Modal State
  const [isConfigureEmailOpen, setIsConfigureEmailOpen] = useState(false);
  const [emailSignature, setEmailSignature] = useState('Best regards,\nAdministrator');

  // Change Password Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirmPass: '' });
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // PREFERENCES STATE
  const { theme, setTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Baku');

  // GENERAL SETTINGS STATE
  const [generalSettings, setGeneralSettings] = useState({
    updateTimestamp: true,
    markRepliedOnResponse: false,
    reopenOnCommunication: false,
    timelineFormat: 'Relative',
    timelineSort: 'Oldest First'
  });

  // DASHBOARD SETTINGS STATE
  const [dashboardSettings, setDashboardSettings] = useState({
    enableForecasting: false,
    autoUpdateDealValue: true,
    currency: 'INR',
    exchangeProvider: 'Frankfurter'
  });

  // SYSTEM DEFAULTS STATE
  const [systemDefaults, setSystemDefaults] = useState({
    currency: 'USD',
    currencyPrecision: '3',
    numberFormat: '#,###.##',
    floatPrecision: '3',
    dateFormat: 'dd-mm-yyyy',
    timeFormat: 'HH:mm:ss'
  });

  // BRAND SETTINGS STATE
  const [brandSettings, setBrandSettings] = useState({
    brandName: '',
    logoUrl: null,
    faviconUrl: null
  });

  // USERS MANAGEMENT STATE
  const [usersList, setUsersList] = useState(initialUsersList);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'Admin' });

  // INVITE USER STATE
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteRole, setInviteRole] = useState('Sales User');

  // SALES HIERARCHY STATE
  const [isSalesHierarchyEnabled, setIsSalesHierarchyEnabled] = useState(false);

  // HOME ACTIONS STATE (Screenshot 2!)
  const [homeActions, setHomeActions] = useState(initialHomeActions);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserProfile({
        ...userProfile,
        name: tempName,
        initial: tempName.charAt(0).toUpperCase()
      });
    }
    setIsEditingName(false);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsChangePasswordOpen(false);
      setPasswordForm({ current: '', newPass: '', confirmPass: '' });
    }, 1200);
  };

  const handleAddNewUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newUser = {
      id: String(Date.now()),
      name: newUserForm.name,
      email: newUserForm.email,
      initial: newUserForm.name.charAt(0).toUpperCase(),
      role: newUserForm.role,
      isManager: newUserForm.role === 'Manager'
    };

    setUsersList([...usersList, newUser]);
    setIsAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'Admin' });
  };

  const handleAddHomeActionRow = () => {
    const newRow = {
      id: String(Date.now()),
      no: homeActions.length + 1,
      label: '',
      type: 'Route',
      route: '#',
      hidden: false
    };
    setHomeActions([...homeActions, newRow]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 selection:bg-fuchsia-500/30">
      {/* Main Settings Modal Box */}
      <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl w-full max-w-5xl h-[88vh] flex overflow-hidden text-[#E4E4E7] relative animate-in fade-in duration-200">
        {/* Top Right Close Button */}
        <button
          onClick={() => navigate('/crm/dashboard')}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl text-[#71717A] hover:text-white hover:bg-[#2C2C2E] transition-colors cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-64 bg-[#141416] border-r border-[#2C2C2E] p-3 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar select-none">
          <div className="space-y-4">
            {navCategories.map((group) => (
              <div key={group.category} className="space-y-1">
                <h3 className="px-3 text-[11px] font-medium text-[#71717A] uppercase tracking-wider">
                  {group.category}
                </h3>

                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs w-full text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-700/80 dark:bg-slate-700/80 text-white font-semibold shadow-xs border border-slate-600/50'
                            : 'bg-transparent text-[#A1A1AA] dark:text-[#94A3B8] hover:bg-white/[0.05] dark:hover:bg-slate-800/40 hover:text-white font-normal'
                        }`}
                      >
                        {item.id === 'profile' ? (
                          <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-white text-black' : 'bg-slate-700 text-[#94A3B8]'
                          }`}>
                            {userProfile.initial}
                          </span>
                        ) : (
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#71717A] dark:text-[#94A3B8]'}`} />
                        )}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN PANEL CONTENT AREA */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#1C1C1E]">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Profile</h1>
                <p className="text-xs text-[#A1A1AA] mt-1">Manage your profile & login information.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#A1A1AA] text-lg font-bold flex items-center justify-center shrink-0 shadow-md">
                  {userProfile.initial}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="bg-[#141416] border border-[#2C2C2E] rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-sky-500"
                        />
                        <button
                          onClick={handleSaveName}
                          className="p-1 rounded-lg bg-sky-500 text-white hover:bg-sky-400 cursor-pointer"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-base font-bold text-white tracking-tight">{userProfile.name}</h2>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-[#71717A] hover:text-white transition-colors cursor-pointer p-0.5"
                          title="Edit Name"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-[#71717A]">{userProfile.email}</p>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <h2 className="text-sm font-bold text-white tracking-tight">Account Info & Security</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 py-3 border-b border-[#2C2C2E]/60">
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-white">Emails & Signature</h3>
                      <p className="text-xs text-[#71717A]">
                        Manage your account emails and email signature for communication.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsConfigureEmailOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46] transition-colors cursor-pointer shrink-0"
                    >
                      Configure
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3 border-b border-[#2C2C2E]/60">
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-white">Password</h3>
                      <p className="text-xs text-[#71717A]">Change your account password for security.</p>
                    </div>

                    <button
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46] transition-colors cursor-pointer shrink-0"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-8 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Preferences</h1>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  Choose how you want to use the application by setting your preferences.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-bold text-white tracking-tight">Appearance</h2>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-white">Theme</h3>
                  <p className="text-xs text-[#71717A]">Switch between light, dark, and midnight theme</p>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {/* Light Theme Card */}
                    <div
                      onClick={() => setTheme('light')}
                      className={`bg-[#141416] rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between h-28 ${
                        theme === 'light' ? 'border-white bg-[#1C1C1E]' : 'border-[#2C2C2E] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="bg-white rounded-lg p-2 h-14 border border-zinc-200 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-fuchsia-600 text-[6px] text-white flex items-center justify-center font-bold">▼</span>
                          <span className="text-[9px] font-bold text-zinc-900">CRM</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[#D4D4D8] font-medium">Light</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${theme === 'light' ? 'border-white bg-white' : 'border-[#52525B]'}`}>
                          {theme === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                        </div>
                      </div>
                    </div>

                    {/* Dark Theme Card (Classic Charcoal) */}
                    <div
                      onClick={() => setTheme('dark')}
                      className={`bg-[#141416] rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between h-28 ${
                        theme === 'dark' ? 'border-white bg-[#1C1C1E]' : 'border-[#2C2C2E] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="bg-[#18181B] rounded-lg p-2 h-14 border border-[#27272A] flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-fuchsia-600 text-[6px] text-white flex items-center justify-center font-bold">▼</span>
                          <span className="text-[9px] font-bold text-white">CRM</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[#D4D4D8] font-medium">Dark</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${theme === 'dark' ? 'border-white bg-white' : 'border-[#52525B]'}`}>
                          {theme === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                        </div>
                      </div>
                    </div>

                    {/* Midnight Theme Card (Midnight Blue Slate) */}
                    <div
                      onClick={() => setTheme('midnight')}
                      className={`bg-[#141416] rounded-2xl p-3 border transition-all cursor-pointer relative flex flex-col justify-between h-28 ${
                        theme === 'midnight' ? 'border-white bg-[#1C1C1E]' : 'border-[#2C2C2E] hover:border-[#3F3F46]'
                      }`}
                    >
                      <div className="bg-[#0F172A] rounded-lg p-2 h-14 border border-[#334155] flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-fuchsia-600 text-[6px] text-white flex items-center justify-center font-bold">▼</span>
                          <span className="text-[9px] font-bold text-[#F8FAFC]">CRM</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-[#D4D4D8] font-medium">Midnight</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${theme === 'midnight' ? 'border-white bg-white' : 'border-[#52525B]'}`}>
                          {theme === 'midnight' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Language & Time</h2>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-white">Language</h3>
                      <p className="text-[#71717A]">Change language of the application.</p>
                    </div>

                    <div className="relative w-44">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                      >
                        <option value="">(Default)</option>
                        <option value="en">English</option>
                        <option value="az">Azerbaijani</option>
                      </select>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <h3 className="font-semibold text-white">Timezone</h3>
                      <p className="text-[#71717A]">Change timezone of the application.</p>
                    </div>

                    <div className="relative w-44">
                      <select
                        value={selectedTimezone}
                        onChange={(e) => setSelectedTimezone(e.target.value)}
                        className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                      >
                        <option value="Asia/Baku">Asia/Baku</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                      </select>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">General Settings</h1>
                <p className="text-xs text-[#A1A1AA] mt-1">Configure general settings for your application</p>
              </div>

              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Update timestamp on new communication</h3>
                    <p className="text-[#71717A] leading-relaxed">
                      Update the modified timestamp on new email communication & comments for leads & deals
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralSettings({ ...generalSettings, updateTimestamp: !generalSettings.updateTimestamp })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      generalSettings.updateTimestamp ? 'bg-white' : 'bg-[#27272A]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${
                      generalSettings.updateTimestamp ? 'bg-black translate-x-6' : 'bg-[#A1A1AA] translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Mark lead/deal as replied on response</h3>
                    <p className="text-[#71717A] leading-relaxed">
                      Automatically sets Communication Status to "Replied" for the lead or deal when a response is received. Applies only when SLA is enabled
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralSettings({ ...generalSettings, markRepliedOnResponse: !generalSettings.markRepliedOnResponse })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      generalSettings.markRepliedOnResponse ? 'bg-white' : 'bg-[#27272A]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${
                      generalSettings.markRepliedOnResponse ? 'bg-black translate-x-6' : 'bg-[#A1A1AA] translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Reopen lead/deal on new communication</h3>
                    <p className="text-[#71717A] leading-relaxed">
                      Automatically sets Communication Status to "Open" for the lead or deal when a new communication is created. Applies only when SLA is enabled
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGeneralSettings({ ...generalSettings, reopenOnCommunication: !generalSettings.reopenOnCommunication })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      generalSettings.reopenOnCommunication ? 'bg-white' : 'bg-[#27272A]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${
                      generalSettings.reopenOnCommunication ? 'bg-black translate-x-6' : 'bg-[#A1A1AA] translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Timeline timestamp format</h3>
                    <p className="text-[#71717A]">
                      Show timestamps in the activity timeline as relative time (5 mins ago) or an exact date & time
                    </p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={generalSettings.timelineFormat}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timelineFormat: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="Relative">Relative</option>
                      <option value="Exact">Exact Date & Time</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Timeline sort order</h3>
                    <p className="text-[#71717A]">Order of activities, emails, comments and calls in the timeline</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={generalSettings.timelineSort}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, timelineSort: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="Oldest First">Oldest First</option>
                      <option value="Newest First">Newest First</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DASHBOARD SETTINGS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                  Configure how your dashboard calculates, formats, and displays key metrics, including forecasting, deal values, and currency settings
                </p>
              </div>

              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Enable Forecasting</h3>
                    <p className="text-[#71717A]">
                      Makes "Expected Closure Date" and "Expected Deal Value" mandatory for deal value forecasting
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDashboardSettings({ ...dashboardSettings, enableForecasting: !dashboardSettings.enableForecasting })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      dashboardSettings.enableForecasting ? 'bg-white' : 'bg-[#27272A]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${
                      dashboardSettings.enableForecasting ? 'bg-black translate-x-6' : 'bg-[#A1A1AA] translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Auto Update Expected Deal Value</h3>
                    <p className="text-[#71717A]">
                      Automatically update "Expected Deal Value" based on the total value of associated products in a deal
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDashboardSettings({ ...dashboardSettings, autoUpdateDealValue: !dashboardSettings.autoUpdateDealValue })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      dashboardSettings.autoUpdateDealValue ? 'bg-white' : 'bg-[#27272A]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full transition-transform absolute top-1 ${
                      dashboardSettings.autoUpdateDealValue ? 'bg-black translate-x-6' : 'bg-[#A1A1AA] translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Dashboard Currency</h3>
                    <p className="text-[#71717A]">
                      Dashboard number cards & charts will show currency in the selected format. Once set, cannot be edited.
                    </p>
                  </div>
                  <span className="font-bold text-white text-xs px-3 py-1 bg-[#141416] border border-[#2C2C2E] rounded-xl font-mono shrink-0">
                    {dashboardSettings.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-6 py-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Exchange Rate Provider</h3>
                    <p className="text-[#71717A]">Configure the Exchange Rate Provider for your CRM</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={dashboardSettings.exchangeProvider}
                      onChange={(e) => setDashboardSettings({ ...dashboardSettings, exchangeProvider: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="Frankfurter">Frankfurter</option>
                      <option value="Fixer">Fixer</option>
                      <option value="OpenExchange">OpenExchange</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM DEFAULTS */}
          {activeTab === 'defaults' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">System Defaults</h1>
                <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                  Configure default settings for your CRM system, including default currency, date formats, and other system-wide preferences to ensure consistency across your system.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between gap-6 py-2.5 border-b border-[#2C2C2E]/60">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Currency</h3>
                    <p className="text-[#71717A]">Defines the default currency for all records, can be overridden at the field level</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={systemDefaults.currency}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, currency: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer font-mono"
                    >
                      <option value="USD">USD</option>
                      <option value="AZN">AZN</option>
                      <option value="EUR">EUR</option>
                      <option value="INR">INR</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-2.5 border-b border-[#2C2C2E]/60">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Currency Precision</h3>
                    <p className="text-[#71717A]">Number of decimal places used for all currency values</p>
                  </div>
                  <div className="relative w-28 shrink-0">
                    <select
                      value={systemDefaults.currencyPrecision}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, currencyPrecision: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-2.5 border-b border-[#2C2C2E]/60">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Number Format</h3>
                    <p className="text-[#71717A]">Controls how numbers are displayed (e.g., commas, decimal separators)</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={systemDefaults.numberFormat}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, numberFormat: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer font-mono"
                    >
                      <option value="#,###.##">#,###.##</option>
                      <option value="#.###,##">#.###,##</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-2.5 border-b border-[#2C2C2E]/60">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Float Precision</h3>
                    <p className="text-[#71717A]">Number of decimal places for non-currency numeric fields</p>
                  </div>
                  <div className="relative w-28 shrink-0">
                    <select
                      value={systemDefaults.floatPrecision}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, floatPrecision: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-2.5 border-b border-[#2C2C2E]/60">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Date Format</h3>
                    <p className="text-[#71717A]">Display format for dates across the system</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={systemDefaults.dateFormat}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, dateFormat: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer font-mono"
                    >
                      <option value="dd-mm-yyyy">dd-mm-yyyy</option>
                      <option value="yyyy-mm-dd">yyyy-mm-dd</option>
                      <option value="mm/dd/yyyy">mm/dd/yyyy</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 py-2.5">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold text-white">Time Format</h3>
                    <p className="text-[#71717A]">Select whether to display time with or without seconds</p>
                  </div>
                  <div className="relative w-36 shrink-0">
                    <select
                      value={systemDefaults.timeFormat}
                      onChange={(e) => setSystemDefaults({ ...systemDefaults, timeFormat: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer font-mono"
                    >
                      <option value="HH:mm:ss">HH:mm:ss</option>
                      <option value="HH:mm">HH:mm</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BRAND SETTINGS */}
          {activeTab === 'brand' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Brand Settings</h1>
                <p className="text-xs text-[#A1A1AA] mt-1">Configure your Brand Name, Logo, and Favicon</p>
              </div>

              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white">Brand Name</h3>
                    <p className="text-[#71717A]">Set the name of your brand. Appears in the left sidebar.</p>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Brand Name"
                    value={brandSettings.brandName}
                    onChange={(e) => setBrandSettings({ ...brandSettings, brandName: e.target.value })}
                    className="w-48 bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500 shrink-0"
                  />
                </div>

                <div className="flex items-center justify-between gap-6 py-3 border-b border-[#2C2C2E]/60">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#141416] border border-[#2C2C2E] flex items-center justify-center text-[#71717A] shrink-0">
                      <PhotoIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white">Brand Logo</h3>
                      <p className="text-[#71717A] leading-relaxed max-w-md">
                        Appears in the left sidebar. Recommended size is 32x32 px in PNG or SVG
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46] transition-colors cursor-pointer shrink-0">
                    <ArrowUpTrayIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                    <span>Upload</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-6 py-3">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#141416] border border-[#2C2C2E] flex items-center justify-center text-[#71717A] shrink-0">
                      <PhotoIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white">Favicon</h3>
                      <p className="text-[#71717A] leading-relaxed max-w-md">
                        Appears next to the title in your browser tab. Recommended size is 32x32 px in PNG or ICO
                      </p>
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46] transition-colors cursor-pointer shrink-0">
                    <ArrowUpTrayIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Users</h1>
                  <p className="text-xs text-[#A1A1AA] mt-1 max-w-lg leading-relaxed">
                    Manage CRM users by adding or inviting them, and assign roles to control their access and permissions
                  </p>
                </div>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0"
                >
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>New</span>
                </button>
              </div>

              <div className="divide-y divide-[#2C2C2E]/60 border-t border-[#2C2C2E]/60 pt-1">
                {usersList.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 px-1 hover:bg-[#141416]/50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#27272A] text-[#A1A1AA] text-xs font-bold flex items-center justify-center shrink-0">
                        {user.initial}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-xs">{user.name}</h3>
                        <p className="text-[11px] text-[#71717A]">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#27272A]/70 border border-[#3F3F46]/50 text-xs text-white font-medium">
                        {user.isManager ? (
                          <BriefcaseIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        ) : (
                          <ShieldCheckIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                        )}
                        <span>{user.role}</span>
                        {user.isManager && <ChevronDownIcon className="w-3 h-3 text-[#71717A] ml-1" />}
                      </div>

                      <button className="text-[#71717A] hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: INVITE USER */}
          {activeTab === 'invite' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Send Invites To</h1>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Invite users to access CRM. Specify their roles to control access and permissions
                  </p>
                </div>

                <button
                  disabled={!inviteEmails.trim()}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    inviteEmails.trim()
                      ? 'bg-white hover:bg-zinc-200 text-black border-white shadow-md'
                      : 'bg-[#27272A] text-[#71717A] border-[#3F3F46] cursor-not-allowed'
                  }`}
                >
                  Send Invites
                </button>
              </div>

              <div className="space-y-5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Invite By Email</label>
                  <textarea
                    rows={4}
                    placeholder="user1@example.com, user2@example.com, ..."
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-2xl p-3.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500 font-mono"
                  ></textarea>
                  <p className="text-[#71717A] text-[11px]">
                    You can invite multiple users by comma separating their email addresses
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Invite As</label>
                  <div className="relative">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
                    >
                      <option value="Sales User">Sales User</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="System Admin">System Admin</option>
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                  <p className="text-[#71717A] text-[11px]">
                    Can work with leads and deals and create private views (reports).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SALES HIERARCHY */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Sales Hierarchy</h1>
                  <InformationCircleIcon className="w-4 h-4 text-[#71717A]" title="Help Info" />
                </div>
                <p className="text-xs text-[#A1A1AA] mt-1">Restrict visibility of Leads and Deals based on a reporting tree.</p>
              </div>

              <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#2C2C2E] text-[#A1A1AA]">
                  <ShareIcon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {isSalesHierarchyEnabled ? 'Sales Hierarchy Enabled' : 'Enable Sales Hierarchy'}
                  </h2>
                  <p className="text-xs text-[#71717A]">Restrict visibility using a reporting tree</p>
                </div>

                <button
                  onClick={() => setIsSalesHierarchyEnabled(!isSalesHierarchyEnabled)}
                  className={`mt-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isSalesHierarchyEnabled
                      ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {isSalesHierarchyEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 10: EMAIL ACCOUNTS */}
          {activeTab === 'email_accounts' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Email Accounts</h1>
                  <p className="text-xs text-[#A1A1AA] mt-1 max-w-lg leading-relaxed">
                    Manage your email accounts to send and receive emails directly from CRM. You can add multiple accounts and set one as default for incoming and outgoing emails.
                  </p>
                </div>

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0">
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Account</span>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-24 space-y-2 text-center">
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#2C2C2E] text-[#A1A1AA]">
                  <EnvelopeIcon className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">No Email Accounts Found</h2>
                <p className="text-xs text-[#71717A]">Add one to get started.</p>
              </div>
            </div>
          )}

          {/* TAB 11: EMAIL TEMPLATES */}
          {activeTab === 'email_templates' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Email Templates</h1>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Add, edit, and manage email templates for various CRM communications
                  </p>
                </div>

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0">
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>New</span>
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-24 space-y-2 text-center">
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#2C2C2E] text-[#A1A1AA]">
                  <DocumentDuplicateIcon className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">No Email Templates Found</h2>
                <p className="text-xs text-[#71717A]">Add one to get started.</p>
              </div>
            </div>
          )}

          {/* TAB 12: ASSIGNMENT RULES (Screenshot 1!) */}
          {activeTab === 'assignment_rules' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Assignment Rules</h1>
                  <p className="text-xs text-[#A1A1AA] mt-1 max-w-lg leading-relaxed">
                    Auto-assign leads/deals to the right sales user based on predefined conditions
                  </p>
                </div>

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-colors cursor-pointer shrink-0">
                  <PlusIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>New</span>
                </button>
              </div>

              {/* Center Empty State (Screenshot 1!) */}
              <div className="flex flex-col items-center justify-center py-24 space-y-2 text-center">
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#2C2C2E] text-[#A1A1AA]">
                  <AdjustmentsVerticalIcon className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">No Assignment Rules Found</h2>
                <p className="text-xs text-[#71717A]">Add one to get started.</p>
              </div>
            </div>
          )}

          {/* TAB 13: HOME ACTIONS (Screenshot 2!) */}
          {activeTab === 'home_actions' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Home Actions</h1>
                <p className="text-xs text-[#A1A1AA] mt-1">Configure actions that appear on the home dropdown</p>
              </div>

              {/* Home Actions Table (Screenshot 2!) */}
              <div className="space-y-4">
                <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#18181B] border-b border-[#27272A] text-[#71717A] font-medium text-[11px]">
                          <th className="py-2.5 px-3 w-8">
                            <input type="checkbox" className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer" />
                          </th>
                          <th className="py-2.5 px-3 w-10 text-[#A1A1AA] font-normal">No.</th>
                          <th className="py-2.5 px-3 text-[#A1A1AA] font-normal">Label</th>
                          <th className="py-2.5 px-3 text-[#A1A1AA] font-normal">Type</th>
                          <th className="py-2.5 px-3 text-[#A1A1AA] font-normal">Route</th>
                          <th className="py-2.5 px-3 w-16 text-center text-[#A1A1AA] font-normal">Hidden</th>
                          <th className="py-2.5 px-3 w-10 text-center text-[#A1A1AA]">
                            <CogIcon className="w-4 h-4 mx-auto text-[#71717A]" />
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#27272A]/60 text-[#D4D4D8]">
                        {homeActions.map((row) => (
                          <tr key={row.id} className="hover:bg-[#18181B]/80 transition-colors">
                            <td className="py-2.5 px-3">
                              <input type="checkbox" className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer" />
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">{row.no}</td>
                            <td className="py-2.5 px-3">
                              <input
                                type="text"
                                value={row.label}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setHomeActions(homeActions.map(r => r.id === row.id ? { ...r, label: val } : r));
                                }}
                                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-white w-full"
                                placeholder={row.type === 'Separator' ? '' : 'Label'}
                              />
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="relative w-28">
                                <select
                                  value={row.type}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setHomeActions(homeActions.map(r => r.id === row.id ? { ...r, type: val } : r));
                                  }}
                                  className="w-full bg-transparent border-none text-xs text-[#A1A1AA] focus:outline-none appearance-none cursor-pointer"
                                >
                                  <option value="Route">Route</option>
                                  <option value="Separator">Separator</option>
                                </select>
                                <ChevronDownIcon className="w-3 h-3 text-[#71717A] absolute right-1 top-1 pointer-events-none" />
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-[#A1A1AA]">{row.route}</td>
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={row.hidden}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setHomeActions(homeActions.map(r => r.id === row.id ? { ...r, hidden: checked } : r));
                                }}
                                className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button className="text-[#71717A] hover:text-white transition-colors cursor-pointer">
                                <PencilIcon className="w-3.5 h-3.5 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddHomeActionRow}
                  className="px-3.5 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold border border-[#3F3F46] transition-colors cursor-pointer"
                >
                  Add Row
                </button>
              </div>
            </div>
          )}

          {/* OTHER TABS RICH PLACEHOLDER PANELS */}
          {!['profile', 'preferences', 'general', 'dashboard', 'defaults', 'brand', 'users', 'invite', 'hierarchy', 'email_accounts', 'email_templates', 'assignment_rules', 'home_actions'].includes(activeTab) && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight capitalize">
                  {navCategories.flatMap(c => c.items).find(i => i.id === activeTab)?.label || activeTab}
                </h1>
                <p className="text-xs text-[#A1A1AA] mt-1">Configure {activeTab} settings and preferences.</p>
              </div>

              <div className="bg-[#141416] border border-[#2C2C2E] rounded-2xl p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-[#2C2C2E]/60">
                  <div>
                    <h3 className="font-semibold text-white">Enable Feature</h3>
                    <p className="text-[#71717A]">Activate or deactivate this module option.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer" />
                </div>

                <div className="pt-2 flex justify-end">
                  <button className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition-colors cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADD NEW USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-md text-[#E4E4E7] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Add New User</h2>
              <button onClick={() => setIsAddUserModalOpen(false)} className="hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewUserSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-medium">User Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-medium">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales User">Sales User</option>
                </select>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIGURE EMAIL & SIGNATURE MODAL */}
      {isConfigureEmailOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-md text-[#E4E4E7] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Emails & Signature</h2>
              <button onClick={() => setIsConfigureEmailOpen(false)} className="hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-medium">Primary Email</label>
                <input
                  type="text"
                  readOnly
                  value={userProfile.email}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#71717A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] font-medium">Email Signature</label>
                <textarea
                  rows={4}
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setIsConfigureEmailOpen(false)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-md text-[#E4E4E7] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Change Password</h2>
              <button onClick={() => setIsChangePasswordOpen(false)} className="hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl p-4 text-xs flex items-center gap-2">
                <CheckIcon className="w-5 h-5" />
                <span>Password updated successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-medium">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-medium">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPass}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPass: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
