import React, { useState, useRef, useEffect } from 'react';
import { contactsApi } from '../../services/api';
import {
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ViewColumnsIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  PhoneIcon,
  XMarkIcon,
  Bars3Icon,
  Squares2X2Icon,
  QueueListIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const contactStatusConfig = [
  { name: 'Open', color: '#38BDF8', dotBg: '#38BDF8' },
  { name: 'Replied', color: '#10B981', dotBg: '#10B981' },
  { name: 'Passive', color: '#71717A', dotBg: '#71717A' }
];

const organizationList = [
  'ALTENSOR',
  'Ali mmc',
  'bmg international',
  'estetik dis',
  'xalq bank',
  'Pasha Bank',
  'Neftchi IS',
  'Bakcell'
];

const initialOwnerList = [
  { name: 'Administrator', initial: 'A', email: 'admin@altensor.io' },
  { name: 'Elvin Muzaffarli', initial: 'E', email: 'elvinmuzaffarli@gmail.com' },
  { name: 'Yusif Hashimov', initial: 'Y', email: 'yusif@altensor.io' }
];

const initialSalutations = ['Dr', 'Madam', 'Master', 'Miss', 'Mr', 'Mrs', 'Ms'];
const initialGenders = ['Female', 'Genderqueer', 'Male', 'Non-Conforming', 'Other', 'Prefer not to say', 'Transgender'];

const availableLayoutFields = [
  { name: 'Salutation', key: 'salutation', type: 'salutation - Link' },
  { name: 'First Name', key: 'first_name', type: 'first_name - Data' },
  { name: 'Last Name', key: 'last_name', type: 'last_name - Data' },
  { name: 'Primary Email', key: 'primary_email', type: 'primary_email - Data' },
  { name: 'Primary Mobile No', key: 'primary_mobile_no', type: 'primary_mobile_no - Data' },
  { name: 'Gender', key: 'gender', type: 'gender - Link' },
  { name: 'Organization', key: 'organization', type: 'organization - Link' },
  { name: 'Status', key: 'status', type: 'status - Select' },
  { name: 'Contact Owner', key: 'owner', type: 'owner - Link' }
];

const defaultLayoutSections = [
  {
    id: 'sec-1',
    label: 'Contact Details',
    hideLabel: false,
    hideBorder: false,
    collapsible: false,
    columns: [
      ['Salutation', 'Primary Email'],
      ['First Name', 'Primary Mobile No'],
      ['Last Name', 'Gender']
    ]
  },
  {
    id: 'sec-2',
    label: 'Organization & Status',
    hideLabel: false,
    hideBorder: false,
    collapsible: false,
    columns: [
      ['Organization', 'Status'],
      ['Contact Owner']
    ]
  }
];

const initialColumns = [
  { key: 'email', label: 'Email', visible: true },
  { key: 'phone', label: 'Phone', visible: true },
  { key: 'organization', label: 'Organization', visible: true },
  { key: 'lastModified', label: 'Last Modified', visible: true }
];

const sortFields = [
  'Email',
  'Phone',
  'Organization',
  'Last Modified'
];

const filterFields = [
  'Email',
  'Phone',
  'Organization',
  'Status',
  'Last Modified'
];

const initialContacts = [
  {
    id: '1',
    email: 'ramiz@gmail.com',
    phone: '456477474',
    organization: 'estetik dis',
    orgInitial: 'E',
    status: 'Open',
    lastModified: '2 days ago',
    fullDate: 'Sat, Aug 6, 2026 02:15 pm'
  },
  {
    id: '2',
    email: 'alicabbarov@gmail.com',
    phone: '047474774',
    organization: 'Ali mmc',
    orgInitial: 'A',
    status: 'Open',
    lastModified: '3 days ago',
    fullDate: 'Mon, Aug 3, 2026 10:19 am'
  },
  {
    id: '3',
    email: 'bextiyar@gmail.com',
    phone: '0774563424',
    organization: 'xalq bank',
    orgInitial: 'X',
    status: 'Replied',
    lastModified: '5 days ago',
    fullDate: 'Wed, Jul 29, 2026 11:30 am'
  },
  {
    id: '4',
    email: 'elvinmuzaffarli@gmail.com',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Open',
    lastModified: '1 week ago',
    fullDate: 'Sun, Jul 26, 2026 04:20 pm'
  },
  {
    id: '5',
    email: 'orkhan@bmgl.az',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Passive',
    lastModified: '1 week ago',
    fullDate: 'Sun, Jul 26, 2026 04:10 pm'
  },
  {
    id: '6',
    email: 'fidan@bmgi.az',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Passive',
    lastModified: '1 week ago',
    fullDate: 'Sun, Jul 26, 2026 04:05 pm'
  },
  {
    id: '7',
    email: 'info@bmgi.az',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Passive',
    lastModified: '1 week ago',
    fullDate: 'Sun, Jul 26, 2026 04:00 pm'
  },
  {
    id: '8',
    email: 'kamranrehimli@gmail.com',
    phone: '0557456565',
    organization: 'bmg international',
    orgInitial: 'B',
    status: 'Replied',
    lastModified: '1 week ago',
    fullDate: 'Sun, Jul 26, 2026 03:45 pm'
  },
  {
    id: '9',
    email: 'elvinmuzaffarlidta@gmail.com',
    phone: '+994773890412',
    organization: 'ALTENSOR',
    orgInitial: 'A',
    status: 'Open',
    lastModified: '3 weeks ago',
    fullDate: 'Sat, Jul 18, 2026 09:12 am'
  },
  {
    id: '10',
    email: 'said@apply-uni.com',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Passive',
    lastModified: '3 weeks ago',
    fullDate: 'Fri, Jul 17, 2026 05:30 pm'
  },
  {
    id: '11',
    email: 'john@example.com',
    phone: '',
    organization: '',
    orgInitial: '',
    status: 'Passive',
    lastModified: '3 weeks ago',
    fullDate: 'Thu, Jul 16, 2026 01:20 pm'
  },
  {
    id: '12',
    email: 'vusal@pashabank.az',
    phone: '+994501234567',
    organization: 'Pasha Bank',
    orgInitial: 'P',
    status: 'Replied',
    lastModified: '3 weeks ago',
    fullDate: 'Wed, Jul 15, 2026 10:00 am'
  },
  {
    id: '13',
    email: 'gunel@neftchi.az',
    phone: '+994559876543',
    organization: 'Neftchi IS',
    orgInitial: 'N',
    status: 'Open',
    lastModified: '1 month ago',
    fullDate: 'Wed, Jul 08, 2026 03:00 pm'
  },
  {
    id: '14',
    email: 'elnur@bakcell.az',
    phone: '+994705554433',
    organization: 'Bakcell',
    orgInitial: 'B',
    status: 'Open',
    lastModified: '1 month ago',
    fullDate: 'Mon, Jul 06, 2026 11:45 am'
  }
];

const ContactsPage = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState(initialColumns);

  // Dynamic Lists
  const [organizations, setOrganizations] = useState(organizationList);
  const [salutations, setSalutations] = useState(initialSalutations);
  const [genders, setGenders] = useState(initialGenders);
  const [ownersList, setOwnersList] = useState(initialOwnerList);

  // Views & Dropdowns
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [activeView, setActiveView] = useState('List');
  const [isViewSubmenuOpen, setIsViewSubmenuOpen] = useState(false);

  // Top Bar Dropdown States (Status Matching Screenshot 2!)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null); // null means empty

  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');

  // Action Popovers
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isAddingFilterField, setIsAddingFilterField] = useState(false);
  const [filterFieldSearch, setFilterFieldSearch] = useState('');
  const [activeCustomFilter, setActiveCustomFilter] = useState({ field: 'Email', operator: 'Like', query: '%%' });
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [isSortPopoverOpen, setIsSortPopoverOpen] = useState(false);
  const [sortSearchQuery, setSortSearchQuery] = useState('');
  const [activeSortField, setActiveSortField] = useState(null);

  const [isColumnsPopoverOpen, setIsColumnsPopoverOpen] = useState(false);
  const [isMoreOptionsPopoverOpen, setIsMoreOptionsPopoverOpen] = useState(false);

  // Floating Bar & Group By State
  const [expandedGroups, setExpandedGroups] = useState({ 'Open': true, 'Replied': true, 'Passive': true });
  const [isFloatingActionsOpen, setIsFloatingActionsOpen] = useState(false);

  const [pageSize, setPageSize] = useState(20);

  // Main Create Contact Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [chooseExistingOrg, setChooseExistingOrg] = useState(false);

  // Create Contact Custom Dropdown Popovers
  const [openDropdownField, setOpenDropdownField] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  // Edit Quick Entry Layout Modal State
  const [isEditLayoutModalOpen, setIsEditLayoutModalOpen] = useState(false);
  const [layoutSections, setLayoutSections] = useState(defaultLayoutSections);
  const [isLayoutDirty, setIsLayoutDirty] = useState(true);

  // Active Section Context Menu (3 dots ...)
  const [activeSectionOptionsMenu, setActiveSectionOptionsMenu] = useState(null);

  // Active Add Field Popover
  const [activeAddFieldTarget, setActiveAddFieldTarget] = useState(null);
  const [addFieldSearchQuery, setAddFieldSearchQuery] = useState('');

  // Universal Create Item Modal
  const [createItemModalConfig, setCreateItemModalConfig] = useState(null);
  const [newItemInputValue, setNewItemInputValue] = useState('');

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    existingOrg: 'Organization',
    organizationName: '',
    website: '',
    salutation: 'Salutation',
    firstName: '',
    lastName: '',
    primaryEmail: '',
    primaryMobile: '',
    gender: 'Gender',
    status: 'Open',
    owner: 'Administrator'
  });

  // Create View Modal State
  const [isCreateViewModalOpen, setIsCreateViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('My Contacts');

  const viewRef = useRef(null);
  const statusRef = useRef(null);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const columnsRef = useRef(null);
  const moreRef = useRef(null);
  const floatingRef = useRef(null);
  const createDropdownRef = useRef(null);
  const addFieldRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewRef.current && !viewRef.current.contains(event.target)) {
        setIsViewOpen(false);
        setIsViewSubmenuOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) setIsStatusDropdownOpen(false);
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterPopoverOpen(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setIsSortPopoverOpen(false);
      if (columnsRef.current && !columnsRef.current.contains(event.target)) setIsColumnsPopoverOpen(false);
      if (moreRef.current && !moreRef.current.contains(event.target)) setIsMoreOptionsPopoverOpen(false);
      if (floatingRef.current && !floatingRef.current.contains(event.target)) setIsFloatingActionsOpen(false);
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) setOpenDropdownField(null);
      if (addFieldRef.current && !addFieldRef.current.contains(event.target)) {
        setActiveAddFieldTarget(null);
        setActiveSectionOptionsMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSortFields = sortFields.filter((s) =>
    s.toLowerCase().includes(sortSearchQuery.toLowerCase())
  );

  const filteredFilterFields = filterFields.filter((f) =>
    f.toLowerCase().includes(filterFieldSearch.toLowerCase())
  );

  let filteredContacts = contacts.filter((item) => {
    const matchStatus = !selectedStatusFilter || item.status === selectedStatusFilter;
    const matchEmail = !emailFilter || item.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchPhone = !phoneFilter || item.phone.includes(phoneFilter);
    return matchStatus && matchEmail && matchPhone;
  });

  if (activeSortField) {
    filteredContacts = [...filteredContacts].sort((a, b) => {
      if (activeSortField === 'Email') return a.email.localeCompare(b.email);
      if (activeSortField === 'Organization') return a.organization.localeCompare(b.organization);
      if (activeSortField === 'Phone') return a.phone.localeCompare(b.phone);
      return 0;
    });
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(filteredContacts.map((c) => c.id));
    else setSelectedRows([]);
  };

  const handleSelectAllBtn = () => {
    setSelectedRows(filteredContacts.map((c) => c.id));
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) setSelectedRows(selectedRows.filter((rId) => rId !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  const handleDeselectAll = () => {
    setSelectedRows([]);
    setIsFloatingActionsOpen(false);
  };

  const handleDeleteSelected = () => {
    setContacts(contacts.filter((c) => !selectedRows.includes(c.id)));
    setSelectedRows([]);
    setIsFloatingActionsOpen(false);
  };

  const toggleColumnVisibility = (key) => {
    setColumns(columns.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)));
  };

  const handleFullCreateContactSubmit = (e) => {
    e.preventDefault();
    let orgName = contactForm.organizationName;
    if (chooseExistingOrg && contactForm.existingOrg !== 'Organization') orgName = contactForm.existingOrg;

    const contactObj = {
      id: String(Date.now()),
      email: contactForm.primaryEmail || `${contactForm.firstName.toLowerCase() || 'new'}@example.com`,
      phone: contactForm.primaryMobile || '',
      organization: orgName || '',
      orgInitial: orgName ? orgName.charAt(0).toUpperCase() : '',
      status: contactForm.status,
      lastModified: 'Just now',
      fullDate: 'Just now'
    };

    setContacts([contactObj, ...contacts]);
    setIsCreateModalOpen(false);
    setContactForm({
      existingOrg: 'Organization',
      organizationName: '',
      website: '',
      salutation: 'Salutation',
      firstName: '',
      lastName: '',
      primaryEmail: '',
      primaryMobile: '',
      gender: 'Gender',
      status: 'Open',
      owner: 'Administrator'
    });
  };

  const handleGenericItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemInputValue || !createItemModalConfig) return;

    const val = newItemInputValue.trim();
    const { fieldKey } = createItemModalConfig;

    if (fieldKey === 'organization') setOrganizations([...organizations, val]);
    else if (fieldKey === 'salutation') setSalutations([...salutations, val]);
    else if (fieldKey === 'gender') setGenders([...genders, val]);

    setContactForm({ ...contactForm, [fieldKey]: val });
    setCreateItemModalConfig(null);
    setNewItemInputValue('');
  };

  // Layout Modification Functions
  const markLayoutDirty = () => setIsLayoutDirty(true);

  const handleRemoveFieldFromLayout = (secIdx, colIdx, fieldName) => {
    const updated = [...layoutSections];
    updated[secIdx].columns[colIdx] = updated[secIdx].columns[colIdx].filter((f) => f !== fieldName);
    setLayoutSections(updated);
    markLayoutDirty();
  };

  const handleAddFieldToLayout = (secIdx, colIdx, fieldName) => {
    const updated = [...layoutSections];
    updated[secIdx].columns[colIdx].push(fieldName);
    setLayoutSections(updated);
    setActiveAddFieldTarget(null);
    setAddFieldSearchQuery('');
    markLayoutDirty();
  };

  const handleAddSectionToLayout = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      label: 'New Section',
      hideLabel: false,
      hideBorder: false,
      collapsible: false,
      columns: [['Primary Email'], ['Primary Mobile No']]
    };
    setLayoutSections([...layoutSections, newSec]);
    markLayoutDirty();
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const key = contact.status || 'Passive';
    if (!acc[key]) acc[key] = [];
    acc[key].push(contact);
    return acc;
  }, {});

  const isColVisible = (key) => {
    const col = columns.find((c) => c.key === key);
    return col ? col.visible : true;
  };

  const activeModalStatusItem = contactStatusConfig.find((s) => s.name === contactForm.status) || contactStatusConfig[0];
  const activeOwnerItem = ownersList.find((o) => o.name === contactForm.owner) || ownersList[0];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto text-[#D4D4D8] font-sans selection:bg-fuchsia-500/30 relative min-h-[calc(100vh-80px)]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white relative" ref={viewRef}>
          <span className="text-[#A1A1AA]">Contacts</span>
          <span className="text-[#52525B]">/</span>

          <button
            onClick={() => setIsViewOpen(!isViewOpen)}
            className="flex items-center gap-1.5 text-white hover:text-sky-400 transition-colors cursor-pointer"
          >
            {activeView === 'List' && <Bars3Icon className="w-4 h-4 text-[#A1A1AA]" />}
            {activeView === 'Kanban' && <Squares2X2Icon className="w-4 h-4 text-[#A1A1AA]" />}
            {activeView === 'Group By' && <QueueListIcon className="w-4 h-4 text-[#A1A1AA]" />}
            <span>{activeView}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          {isViewOpen && (
            <div className="absolute top-7 left-16 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              <button
                onClick={() => { setActiveView('List'); setIsViewOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left cursor-pointer ${
                  activeView === 'List' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                }`}
              >
                <Bars3Icon className="w-4 h-4 text-[#A1A1AA]" />
                <span>List</span>
              </button>

              <div className="relative group">
                <button
                  onClick={() => { setActiveView('Kanban'); setIsViewOpen(false); }}
                  onMouseEnter={() => setIsViewSubmenuOpen(true)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-left cursor-pointer ${
                    activeView === 'Kanban' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Squares2X2Icon className="w-4 h-4 text-[#A1A1AA]" />
                    <span>Kanban</span>
                  </div>
                  <EllipsisHorizontalIcon className="w-4 h-4 text-[#71717A] hover:text-white" />
                </button>

                {isViewSubmenuOpen && (
                  <div className="absolute top-0 left-full ml-1 w-44 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7]">
                    <button
                      onClick={() => { setIsViewSubmenuOpen(false); setIsViewOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left cursor-pointer font-medium"
                    >
                      <CheckIcon className="w-3.5 h-3.5 text-sky-400" />
                      <span>Set As Default</span>
                    </button>
                    <button
                      onClick={() => setIsViewSubmenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left cursor-pointer font-medium"
                    >
                      <DocumentDuplicateIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
                      <span>Duplicate</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setActiveView('Group By'); setIsViewOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left cursor-pointer ${
                  activeView === 'Group By' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60'
                }`}
              >
                <QueueListIcon className="w-4 h-4 text-[#A1A1AA]" />
                <span>Group By</span>
              </button>

              <div className="h-px bg-[#2C2C2E] my-1"></div>

              <button
                onClick={() => { setIsViewOpen(false); setIsCreateViewModalOpen(true); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E]/60 text-[#A1A1AA] hover:text-white transition-colors text-left cursor-pointer"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Create View</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold shadow-md transition-colors cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 stroke-[2.5]" />
          <span>Create</span>
        </button>
      </div>

      {/* Filter Bar (Matching Screenshot 1 & 2!) */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2.5 relative z-20">
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Dropdown (Matching Screenshot 2!) */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center justify-between w-32 bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
            >
              <span className="truncate">{selectedStatusFilter || 'Status'}</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-9 left-0 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
                {/* Empty Option (Screenshot 2!) */}
                <button
                  onClick={() => {
                    setSelectedStatusFilter(null);
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full h-8 px-3 rounded-xl transition-colors text-left cursor-pointer ${
                    selectedStatusFilter === null ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                  }`}
                >
                  <span></span>
                  {selectedStatusFilter === null && <CheckIcon className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedStatusFilter('Passive');
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                    selectedStatusFilter === 'Passive' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                  }`}
                >
                  <span>Passive</span>
                  {selectedStatusFilter === 'Passive' && <CheckIcon className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedStatusFilter('Open');
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                    selectedStatusFilter === 'Open' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                  }`}
                >
                  <span>Open</span>
                  {selectedStatusFilter === 'Open' && <CheckIcon className="w-4 h-4 text-sky-400" />}
                </button>

                <button
                  onClick={() => {
                    setSelectedStatusFilter('Replied');
                    setIsStatusDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                    selectedStatusFilter === 'Replied' ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                  }`}
                >
                  <span>Replied</span>
                  {selectedStatusFilter === 'Replied' && <CheckIcon className="w-4 h-4 text-sky-400" />}
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Email Address"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className="w-36 sm:w-40 bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500 transition-colors"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="w-32 bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button className="p-1.5 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
            <ArrowPathIcon className="w-4 h-4" />
          </button>

          {activeView === 'Kanban' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-white transition-colors cursor-pointer">
              <Squares2X2Icon className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span>Kanban settings</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
            </button>
          )}

          {activeView === 'Group By' && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-white transition-colors cursor-pointer">
              <QueueListIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span>Group By: Status</span>
              <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
            </button>
          )}

          {/* FILTER BUTTON */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors text-xs font-medium cursor-pointer ${
                isFilterActive
                  ? 'border-sky-500/50 bg-sky-500/10 text-white'
                  : 'border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-white'
              }`}
            >
              <FunnelIcon className="w-3.5 h-3.5" />
              <span>Filter</span>
              {isFilterActive && <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">1</span>}
            </button>

            {isFilterPopoverOpen && (
              <div className="absolute top-9 right-0 w-80 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-3 z-50 text-xs text-[#E4E4E7] space-y-3 animate-in fade-in duration-150">
                {isFilterActive ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-[#141416] p-2 rounded-xl border border-[#2C2C2E]">
                      <span className="text-[#71717A]">Where</span>
                      <span className="bg-[#2C2C2E] px-2 py-1 rounded-lg text-white font-medium">{activeCustomFilter.field}</span>
                      <span className="bg-[#2C2C2E] px-2 py-1 rounded-lg text-white font-medium">{activeCustomFilter.operator}</span>
                      <span className="bg-[#2C2C2E] px-2 py-1 rounded-lg text-white font-mono">{activeCustomFilter.query}</span>
                      <button
                        onClick={() => setIsFilterActive(false)}
                        className="ml-auto text-[#71717A] hover:text-white cursor-pointer"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#2C2C2E]">
                      <button
                        onClick={() => setIsAddingFilterField(true)}
                        className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer font-medium"
                      >
                        + Add Filter
                      </button>
                      <button
                        onClick={() => { setIsFilterActive(false); setIsFilterPopoverOpen(false); }}
                        className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-medium"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[#A1A1AA]">Empty - Choose a field to filter by</p>

                    {!isAddingFilterField ? (
                      <button
                        onClick={() => setIsAddingFilterField(true)}
                        className="flex items-center gap-1.5 text-white hover:text-sky-400 transition-colors font-semibold cursor-pointer"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Filter</span>
                      </button>
                    ) : (
                      <div className="space-y-2 pt-1 border-t border-[#2C2C2E]">
                        <input
                          type="text"
                          placeholder="Search"
                          value={filterFieldSearch}
                          onChange={(e) => setFilterFieldSearch(e.target.value)}
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                        />
                        <div className="max-h-36 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                          {filteredFilterFields.map((field) => (
                            <button
                              key={field}
                              onClick={() => {
                                setActiveCustomFilter({ field, operator: 'Like', query: '%%' });
                                setIsFilterActive(true);
                                setIsAddingFilterField(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#D4D4D8] hover:text-white transition-colors cursor-pointer"
                            >
                              {field}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SORT BUTTON */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortPopoverOpen(!isSortPopoverOpen)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                activeSortField
                  ? 'border-sky-500/50 bg-sky-500/10 text-white'
                  : 'border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white'
              }`}
              title="Sort"
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
            </button>

            {isSortPopoverOpen && (
              <div className="absolute top-9 right-0 w-52 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-50 text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={sortSearchQuery}
                    onChange={(e) => setSortSearchQuery(e.target.value)}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                  />
                  {sortSearchQuery && (
                    <button onClick={() => setSortSearchQuery('')} className="absolute right-2 top-2 text-[#71717A] hover:text-white">
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                  {filteredSortFields.map((field) => (
                    <button
                      key={field}
                      onClick={() => {
                        setActiveSortField(activeSortField === field ? null : field);
                        setIsSortPopoverOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                        activeSortField === field ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                      }`}
                    >
                      <span>{field}</span>
                      {activeSortField === field && <CheckIcon className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNS BUTTON */}
          <div className="relative" ref={columnsRef}>
            <button
              onClick={() => setIsColumnsPopoverOpen(!isColumnsPopoverOpen)}
              className="p-1.5 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              title="Columns Visibility"
            >
              <ViewColumnsIcon className="w-4 h-4" />
            </button>

            {isColumnsPopoverOpen && (
              <div className="absolute top-9 right-0 w-60 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-50 text-xs text-[#E4E4E7] space-y-1.5 animate-in fade-in duration-150">
                <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#141416]/50 border border-[#2C2C2E]/40 hover:bg-[#2C2C2E]/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#71717A] cursor-grab font-bold">:::</span>
                        <span className={`font-medium ${col.visible ? 'text-white' : 'text-[#71717A] line-through'}`}>{col.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="text-[#71717A] hover:text-white transition-colors cursor-pointer">
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleColumnVisibility(col.key)}
                          className={`transition-colors cursor-pointer ${col.visible ? 'text-[#71717A] hover:text-rose-400' : 'text-rose-500 font-bold'}`}
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#2C2C2E] my-1"></div>

                <button
                  onClick={() => setIsColumnsPopoverOpen(false)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors font-medium w-full text-left cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Column</span>
                </button>
              </div>
            )}
          </div>

          {/* MORE OPTIONS BUTTON */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOptionsPopoverOpen(!isMoreOptionsPopoverOpen)}
              className="p-1.5 rounded-xl border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              title="More Options"
            >
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </button>

            {isMoreOptionsPopoverOpen && (
              <div className="absolute top-9 right-0 w-52 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150">
                <button
                  onClick={() => setIsMoreOptionsPopoverOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left w-full transition-colors cursor-pointer font-medium"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Import</span>
                </button>

                <button
                  onClick={() => setIsMoreOptionsPopoverOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left w-full transition-colors cursor-pointer font-medium"
                >
                  <ArrowUpTrayIcon className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => setIsMoreOptionsPopoverOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left w-full transition-colors cursor-pointer font-medium text-[#D4D4D8]"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Customize Quick Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIEW 1: LIST VIEW (Matching Screenshot 1!) */}
      {activeView === 'List' && (
        <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#18181B] border-b border-[#27272A] text-[#71717A] font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedRows.length === filteredContacts.length && filteredContacts.length > 0}
                      className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  {isColVisible('email') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Email</th>}
                  {isColVisible('phone') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Phone</th>}
                  {isColVisible('organization') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Organization</th>}
                  {isColVisible('lastModified') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Last Modified</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#27272A]/60 text-[#D4D4D8]">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedRows.includes(contact.id);

                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-[#18181B]/80 transition-colors ${
                        isSelected ? 'bg-[#18181B]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(contact.id)}
                          className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {isColVisible('email') && (
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <span className="hover:text-sky-400 transition-colors cursor-pointer">{contact.email}</span>
                        </td>
                      )}

                      {isColVisible('phone') && (
                        <td className="py-3.5 px-4 text-[#A1A1AA]">
                          {contact.phone ? (
                            <div className="flex items-center gap-1.5">
                              <PhoneIcon className="w-3.5 h-3.5 text-[#71717A]" />
                              <span>{contact.phone}</span>
                            </div>
                          ) : (
                            <span className="text-[#52525B]">-</span>
                          )}
                        </td>
                      )}

                      {isColVisible('organization') && (
                        <td className="py-3.5 px-4">
                          {contact.organization ? (
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#27272A] text-[#A1A1AA] text-[10px] font-bold flex items-center justify-center shrink-0">
                                {contact.orgInitial}
                              </span>
                              <span className="text-[#D4D4D8]">{contact.organization}</span>
                            </div>
                          ) : (
                            <span className="text-[#52525B]">-</span>
                          )}
                        </td>
                      )}

                      {isColVisible('lastModified') && (
                        <td className="py-3.5 px-4 text-[#71717A] relative group">
                          <span className="cursor-help border-b border-dotted border-[#3F3F46]">{contact.lastModified}</span>
                          {/* Tooltip date matching Screenshot 1! */}
                          <div className="absolute left-4 bottom-8 hidden group-hover:block bg-[#E4E4E7] text-black text-[11px] font-medium px-2 py-1 rounded-lg shadow-xl z-30 whitespace-nowrap">
                            {contact.fullDate}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar (Screenshot 1!) */}
          <div className="p-3 bg-[#141416] border-t border-[#27272A] flex items-center justify-between text-xs text-[#71717A]">
            <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
              {[20, 50, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    pageSize === size ? 'bg-[#27272A] text-white' : 'hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <span>{filteredContacts.length} of {contacts.length}</span>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN VIEW */}
      {activeView === 'Kanban' && (
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-6 animate-in fade-in duration-200">
          {contactStatusConfig.map((col) => {
            const colContacts = filteredContacts.filter((c) => c.status === col.name);

            return (
              <div key={col.name} className="w-72 shrink-0 space-y-3">
                <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: col.dotBg }}></span>
                    <span>{col.name}</span>
                  </div>
                  <button className="text-[#71717A] hover:text-white transition-colors cursor-pointer">
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-[#18181B]/60 border border-[#27272A] rounded-2xl p-2.5 min-h-[480px] space-y-3">
                  {colContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] rounded-2xl p-4 shadow-xl text-xs space-y-2.5 transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-white group-hover:text-sky-400 transition-colors truncate">{contact.email}</div>

                      {contact.organization && (
                        <div className="flex items-center gap-2 text-[#A1A1AA]">
                          <span className="w-4 h-4 rounded-full bg-[#27272A] text-[#A1A1AA] text-[9px] font-bold flex items-center justify-center shrink-0">
                            {contact.orgInitial}
                          </span>
                          <span>{contact.organization}</span>
                        </div>
                      )}

                      {contact.phone && <p className="text-[#A1A1AA]">{contact.phone}</p>}

                      <p className="text-[11px] text-[#71717A] pt-1 border-t border-[#2C2C2E]">{contact.lastModified}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: GROUP BY VIEW */}
      {activeView === 'Group By' && (
        <div className="bg-[#121214] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#18181B] border-b border-[#27272A] text-[#71717A] font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input type="checkbox" className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer" />
                  </th>
                  {isColVisible('email') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Email</th>}
                  {isColVisible('phone') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Phone</th>}
                  {isColVisible('organization') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Organization</th>}
                  {isColVisible('lastModified') && <th className="py-3 px-4 text-[#A1A1AA] font-normal">Last Modified</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#27272A]/60 text-[#D4D4D8]">
                {Object.keys(groupedContacts).map((statusGroup) => {
                  const groupItems = groupedContacts[statusGroup];
                  const isExpanded = expandedGroups[statusGroup] !== false;

                  return (
                    <React.Fragment key={statusGroup}>
                      <tr className="bg-[#18181B] font-semibold text-white cursor-pointer hover:bg-[#27272A]/60 transition-colors" onClick={() => toggleGroup(statusGroup)}>
                        <td className="py-3 px-4 col-span-full" colSpan={5}>
                          <div className="flex items-center gap-2">
                            <span className="text-[#A1A1AA]">{isExpanded ? '▼' : '▶'}</span>
                            <span className="text-white">Status - {statusGroup}</span>
                          </div>
                        </td>
                      </tr>

                      {isExpanded &&
                        groupItems.map((contact) => {
                          const isSelected = selectedRows.includes(contact.id);

                          return (
                            <tr key={contact.id} className={`hover:bg-[#18181B]/80 transition-colors ${isSelected ? 'bg-[#18181B]' : ''}`}>
                              <td className="py-3.5 px-4 pl-6">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(contact.id)}
                                  className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                                />
                              </td>
                              {isColVisible('email') && <td className="py-3.5 px-4 font-semibold text-white">{contact.email}</td>}
                              {isColVisible('phone') && <td className="py-3.5 px-4 text-[#A1A1AA]">{contact.phone || '-'}</td>}
                              {isColVisible('organization') && <td className="py-3.5 px-4 text-[#A1A1AA]">{contact.organization || '-'}</td>}
                              {isColVisible('lastModified') && <td className="py-3.5 px-4 text-[#71717A]">{contact.lastModified}</td>}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#141416] border-t border-[#27272A] flex items-center justify-between text-xs text-[#71717A]">
            <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
              {[20, 50, 100].map((size) => (
                <button key={size} onClick={() => setPageSize(size)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${pageSize === size ? 'bg-[#27272A] text-white' : ''}`}>
                  {size}
                </button>
              ))}
            </div>
            <span>{filteredContacts.length} of {contacts.length}</span>
          </div>
        </div>
      )}

      {/* Floating Bottom Action Bar */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200" ref={floatingRef}>
          {isFloatingActionsOpen && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 flex flex-col text-xs text-[#E4E4E7] animate-in fade-in duration-150">
              <button onClick={() => setIsFloatingActionsOpen(false)} className="px-3 py-2 rounded-xl hover:bg-[#2C2C2E] text-left cursor-pointer font-medium">Edit</button>
              <button onClick={handleDeleteSelected} className="px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 text-left cursor-pointer font-medium">Delete</button>
            </div>
          )}

          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl px-4 py-2 flex items-center gap-3.5 text-xs font-medium text-white">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span className="font-semibold">{selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected</span>
            </div>
            <button onClick={() => setIsFloatingActionsOpen(!isFloatingActionsOpen)} className="p-1 rounded-lg hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-[#2C2C2E]"></div>
            <button onClick={handleSelectAllBtn} className="text-[#D4D4D8] hover:text-white transition-colors cursor-pointer font-medium">Select all</button>
            <button onClick={handleDeselectAll} className="text-[#71717A] hover:text-white transition-colors cursor-pointer p-0.5"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* 1. FULL CREATE CONTACT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-2xl text-[#E4E4E7] space-y-5 animate-in fade-in duration-200 overflow-visible" ref={createDropdownRef}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <h2 className="text-lg font-bold text-white tracking-tight">Create Contact</h2>
              <div className="flex items-center gap-3 text-[#A1A1AA]">
                <button
                  type="button"
                  onClick={() => setIsEditLayoutModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Edit Layout"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="hover:text-white transition-colors cursor-pointer">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Choose Existing Organization Switch */}
            <div className="flex items-center gap-2.5 text-xs text-[#A1A1AA] pb-1">
              <span>Choose Existing Organization</span>
              <button
                type="button"
                onClick={() => setChooseExistingOrg(!chooseExistingOrg)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  chooseExistingOrg ? 'bg-white justify-end' : 'bg-[#3F3F46] justify-start'
                }`}
              >
                <span className={`w-4 h-4 rounded-full shadow-md ${chooseExistingOrg ? 'bg-black' : 'bg-[#A1A1AA]'}`}></span>
              </button>
            </div>

            <form onSubmit={handleFullCreateContactSubmit} className="space-y-4 text-xs">
              {/* Organization Fields */}
              {chooseExistingOrg ? (
                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">Organization</label>
                  <button
                    type="button"
                    onClick={() => { setOpenDropdownField(openDropdownField === 'existingOrg' ? null : 'existingOrg'); setDropdownSearch(''); }}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] hover:border-sky-500 transition-colors cursor-pointer"
                  >
                    <span className="truncate">{contactForm.existingOrg}</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'existingOrg' && (
                    <div className="absolute top-14 left-0 w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-[100] text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search"
                          value={dropdownSearch}
                          onChange={(e) => setDropdownSearch(e.target.value)}
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                        {organizations.filter(o => o.toLowerCase().includes(dropdownSearch.toLowerCase())).map((org) => (
                          <button
                            key={org}
                            type="button"
                            onClick={() => {
                              setContactForm({ ...contactForm, existingOrg: org });
                              setOpenDropdownField(null);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                              contactForm.existingOrg === org ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                            }`}
                          >
                            {org}
                          </button>
                        ))}
                      </div>

                      <div className="h-px bg-[#2C2C2E] my-1"></div>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenDropdownField(null);
                          setCreateItemModalConfig({ fieldKey: 'organization', labelName: 'Organization' });
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors font-medium w-full text-left cursor-pointer"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>Create New</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Organization Name</label>
                    <input
                      type="text"
                      placeholder="Organization Name"
                      value={contactForm.organizationName}
                      onChange={(e) => setContactForm({ ...contactForm, organizationName: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Website</label>
                    <input
                      type="text"
                      placeholder="Website"
                      value={contactForm.website}
                      onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              <div className="h-px bg-[#2C2C2E]/60 my-2"></div>

              {/* Contact Information Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Salutation */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[#A1A1AA] font-medium">Salutation</label>
                    <button
                      type="button"
                      onClick={() => { setOpenDropdownField(openDropdownField === 'salutation' ? null : 'salutation'); setDropdownSearch(''); }}
                      className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] hover:border-sky-500 transition-colors cursor-pointer"
                    >
                      <span className="truncate">{contactForm.salutation}</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                    </button>

                    {openDropdownField === 'salutation' && (
                      <div className="absolute top-14 left-0 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-[100] text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search"
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                          {salutations.filter(s => s.toLowerCase().includes(dropdownSearch.toLowerCase())).map((sal) => (
                            <button
                              key={sal}
                              type="button"
                              onClick={() => {
                                setContactForm({ ...contactForm, salutation: sal });
                                setOpenDropdownField(null);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                                contactForm.salutation === sal ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                              }`}
                            >
                              {sal}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">First name</label>
                    <input
                      type="text"
                      placeholder="First name"
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Last name</label>
                    <input
                      type="text"
                      placeholder="Last name"
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Primary email</label>
                    <input
                      type="email"
                      placeholder="Primary email"
                      value={contactForm.primaryEmail}
                      onChange={(e) => setContactForm({ ...contactForm, primaryEmail: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Primary mobile no</label>
                    <input
                      type="text"
                      placeholder="Primary mobile no"
                      value={contactForm.primaryMobile}
                      onChange={(e) => setContactForm({ ...contactForm, primaryMobile: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[#A1A1AA] font-medium">Gender</label>
                    <button
                      type="button"
                      onClick={() => { setOpenDropdownField(openDropdownField === 'gender' ? null : 'gender'); setDropdownSearch(''); }}
                      className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] hover:border-sky-500 transition-colors cursor-pointer"
                    >
                      <span className="truncate">{contactForm.gender}</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                    </button>

                    {openDropdownField === 'gender' && (
                      <div className="absolute top-14 left-0 w-52 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-[100] text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search"
                            value={dropdownSearch}
                            onChange={(e) => setDropdownSearch(e.target.value)}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                          {genders.filter(g => g.toLowerCase().includes(dropdownSearch.toLowerCase())).map((gen) => (
                            <button
                              key={gen}
                              type="button"
                              onClick={() => {
                                setContactForm({ ...contactForm, gender: gen });
                                setOpenDropdownField(null);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                                contactForm.gender === gen ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                              }`}
                            >
                              {gen}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#2C2C2E]/60 my-2"></div>

              {/* Status & Contact Owner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">Status</label>
                  <button
                    type="button"
                    onClick={() => setOpenDropdownField(openDropdownField === 'modalStatus' ? null : 'modalStatus')}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white hover:border-sky-500 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: activeModalStatusItem.dotBg }}></span>
                      <span className="font-semibold">{contactForm.status}</span>
                    </div>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'modalStatus' && (
                    <div className="absolute bottom-11 left-0 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-[100] text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150">
                      {contactStatusConfig.map((s) => (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => {
                            setContactForm({ ...contactForm, status: s.name });
                            setOpenDropdownField(null);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                            contactForm.status === s.name ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: s.dotBg }}></span>
                            <span>{s.name}</span>
                          </div>
                          {contactForm.status === s.name && <CheckIcon className="w-4 h-4 text-sky-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">Contact Owner</label>
                  <button
                    type="button"
                    onClick={() => { setOpenDropdownField(openDropdownField === 'contactOwner' ? null : 'contactOwner'); setDropdownSearch(''); }}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white hover:border-sky-500 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#27272A] text-[#A1A1AA] text-[9px] font-bold flex items-center justify-center shrink-0">
                        {activeOwnerItem.initial}
                      </span>
                      <span className="font-medium">{contactForm.owner}</span>
                    </div>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'contactOwner' && (
                    <div className="absolute bottom-11 right-0 w-56 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-[100] text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search"
                          value={dropdownSearch}
                          onChange={(e) => setDropdownSearch(e.target.value)}
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                        {ownersList.filter(o => o.name.toLowerCase().includes(dropdownSearch.toLowerCase())).map((owner) => (
                          <button
                            key={owner.name}
                            type="button"
                            onClick={() => {
                              setContactForm({ ...contactForm, owner: owner.name });
                              setOpenDropdownField(null);
                            }}
                            className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl transition-colors text-left cursor-pointer ${
                              contactForm.owner === owner.name ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-[#27272A] text-[#A1A1AA] text-[9px] font-bold flex items-center justify-center shrink-0">
                              {owner.initial}
                            </span>
                            <span className="truncate">{owner.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-3">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors shadow-md cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT QUICK ENTRY LAYOUT MODAL FOR CONTACTS */}
      {isEditLayoutModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar text-[#E4E4E7] space-y-5 animate-in fade-in duration-200" ref={addFieldRef}>
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">Edit Quick Entry Layout</h2>
                {isLayoutDirty && (
                  <span className="bg-[#78350F]/70 text-[#F59E0B] text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-[#92400E]/50">
                    Not Saved
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEditLayoutModalOpen(false)}
                className="text-[#71717A] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Show Preview
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLayoutSections(defaultLayoutSections);
                    setIsLayoutDirty(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLayoutDirty(false);
                    setIsEditLayoutModalOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors shadow-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="w-full bg-[#141416] border border-dashed border-[#2C2C2E] rounded-2xl px-4 py-2.5 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer flex items-center gap-2 font-medium">
              <PlusIcon className="w-4 h-4" />
              <span>Add Tab</span>
            </div>

            <div className="space-y-4">
              {layoutSections.map((sec, secIdx) => {
                const totalFieldsCount = sec.columns.reduce((sum, col) => sum + col.length, 0);

                return (
                  <div
                    key={sec.id}
                    className={`bg-[#141416] rounded-2xl p-4 space-y-3 relative ${
                      sec.hideBorder ? 'border-none' : 'border border-[#27272A]'
                    }`}
                  >
                    {!sec.hideLabel && (
                      <div className="flex items-center justify-between text-xs text-[#71717A]">
                        <div className="flex items-center gap-2">
                          <span className="cursor-grab font-bold">:::</span>
                          <span className="italic font-medium text-[#A1A1AA]">{sec.label}</span>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <span className="px-2 py-0.5 rounded-full bg-[#27272A] text-[#A1A1AA] text-[11px] font-semibold">
                            {totalFieldsCount} field{totalFieldsCount !== 1 ? 's' : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveSectionOptionsMenu(activeSectionOptionsMenu === secIdx ? null : secIdx)}
                            className="hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-[#2C2C2E]"
                          >
                            <EllipsisHorizontalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div
                      className={`grid gap-3 ${
                        sec.columns.length === 1
                          ? 'grid-cols-1'
                          : sec.columns.length === 2
                          ? 'grid-cols-1 md:grid-cols-2'
                          : 'grid-cols-1 md:grid-cols-3'
                      }`}
                    >
                      {sec.columns.map((colFields, colIdx) => (
                        <div key={colIdx} className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-3 space-y-2 relative">
                          {colFields.map((field) => (
                            <div
                              key={field}
                              className="flex items-center justify-between bg-[#27272A]/70 border border-[#3F3F46]/50 rounded-lg px-3 py-2 text-xs text-white"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[#71717A] cursor-grab font-bold">:::</span>
                                <span className="font-semibold">{field}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFieldFromLayout(secIdx, colIdx, field)}
                                className="text-[#71717A] hover:text-rose-400 transition-colors cursor-pointer"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAddFieldTarget(
                                  activeAddFieldTarget?.secIndex === secIdx && activeAddFieldTarget?.colIndex === colIdx
                                    ? null
                                    : { secIndex: secIdx, colIndex: colIdx }
                                );
                                setAddFieldSearchQuery('');
                              }}
                              className="flex items-center justify-center gap-1.5 w-full border border-dashed border-[#3F3F46] hover:border-sky-500 rounded-lg py-2 text-xs text-[#A1A1AA] hover:text-white transition-colors cursor-pointer font-medium"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                              <span>Add Field</span>
                            </button>

                            {activeAddFieldTarget?.secIndex === secIdx && activeAddFieldTarget?.colIndex === colIdx && (
                              <div className="absolute top-10 left-0 w-64 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2 z-[150] text-xs text-[#E4E4E7] space-y-2 animate-in fade-in duration-150">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Search"
                                    value={addFieldSearchQuery}
                                    onChange={(e) => setAddFieldSearchQuery(e.target.value)}
                                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                                  />
                                </div>

                                <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                                  {availableLayoutFields
                                    .filter((f) => f.name.toLowerCase().includes(addFieldSearchQuery.toLowerCase()))
                                    .map((f) => (
                                      <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => handleAddFieldToLayout(secIdx, colIdx, f.name)}
                                        className="w-full text-left p-2 rounded-xl hover:bg-[#2C2C2E] transition-colors cursor-pointer block"
                                      >
                                        <p className="font-bold text-white text-xs">{f.name}</p>
                                        <p className="text-[11px] text-[#71717A] font-mono">{f.type}</p>
                                      </button>
                                    ))}
                                </div>
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

            <button
              type="button"
              onClick={handleAddSectionToLayout}
              className="flex items-center justify-center gap-2 w-full border border-dashed border-[#3F3F46] bg-[#141416] hover:bg-[#1C1C1E] hover:border-sky-500 rounded-2xl py-3 text-xs text-[#E4E4E7] font-semibold transition-colors cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. UNIVERSAL CREATE NEW ENTITY MODAL */}
      {createItemModalConfig && (
        <div className="fixed inset-0 z-[160] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-5 w-full max-w-sm text-[#E4E4E7] space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">New {createItemModalConfig.labelName}</h2>
              <button onClick={() => setCreateItemModalConfig(null)} className="hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenericItemSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-medium">{createItemModalConfig.labelName}</label>
                <input
                  type="text"
                  required
                  placeholder={createItemModalConfig.labelName}
                  value={newItemInputValue}
                  onChange={(e) => setNewItemInputValue(e.target.value)}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors shadow-md cursor-pointer text-center"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create View Modal */}
      {isCreateViewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-5 w-full max-w-[400px] text-[#E4E4E7] space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">Create View</h2>
              <button onClick={() => setIsCreateViewModalOpen(false)} className="text-[#71717A] hover:text-white transition-colors cursor-pointer">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-[#A1A1AA] font-medium">View Name</label>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#2C2C2E] border border-[#3F3F46] shrink-0"></span>
                <input
                  type="text"
                  placeholder="My Contacts"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => {
                  setActiveView(newViewName || 'Custom View');
                  setIsCreateViewModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
