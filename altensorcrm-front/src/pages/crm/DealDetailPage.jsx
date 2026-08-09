import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dealsApi, orgsApi, contactsApi } from '../../services/api';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  LinkIcon,
  PaperClipIcon,
  TrashIcon,
  CheckIcon,
  ListBulletIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const dealStatusList = [
  { name: 'Qualification', color: '#71717A' },
  { name: 'Demo/Making', color: '#F97316' },
  { name: 'Proposal/Quotation', color: '#38BDF8' },
  { name: 'Negotiation', color: '#EAB308' },
  { name: 'Ready to Close', color: '#A855F7' },
  { name: 'Won', color: '#10B981' },
  { name: 'Lost', color: '#EF4444' }
];

const territoryOptions = ['Azerbaijan', 'Turkey', 'United States', 'Global'];
const ownerList = [
  { name: 'Elvin Muzaffarli', initial: 'E', email: 'elvinmuzaffarli@gmail.com' },
  { name: 'Administrator', initial: 'A', email: 'admin@altensor.io' },
  { name: 'Yusif Hashimov', initial: 'Y', email: 'yusif@altensor.io' }
];

const DealDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Data');

  // Custom Floating Toast Alert State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Popover States
  const [isAssignToOpen, setIsAssignToOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [assignToMe, setAssignToMe] = useState(true);

  const assignRef = useRef(null);
  const statusRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    organizationName: '',
    website: '',
    territory: '',
    annualRevenue: '$ 0.00',
    closedDate: '',
    probability: '25.000%',
    nextStep: '',
    dealOwner: 'Elvin Muzaffarli',
    status: 'Demo/Making',
    contactName: 'Nermin Veliyeva'
  });

  // Collapsible Section Controls
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isContactsOpen, setIsContactsOpen] = useState(true);
  const [isOrgDetailsOpen, setIsOrgDetailsOpen] = useState(true);

  // Products Table State
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchDealDetail(id);
    }
  }, [id]);

  // Click Outside to Close Popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (assignRef.current && !assignRef.current.contains(e.target)) {
        setIsAssignToOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDealDetail = async (dealId) => {
    try {
      setLoading(true);
      const data = await dealsApi.getById(dealId);
      if (data) {
        setFormData({
          organizationName: data.organizationName || data.name || '',
          website: data.website || '',
          territory: data.territoryName || '',
          annualRevenue: data.annualRevenue ? `$ ${data.annualRevenue}` : '$ 0.00',
          closedDate: data.closedDate || '',
          probability: '25.000%',
          nextStep: data.nextStep || '',
          dealOwner: data.dealOwnerName || 'Elvin Muzaffarli',
          status: data.statusName || data.status || 'Demo/Making',
          contactName: data.contactName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Nermin Veliyeva'
        });
      }
    } catch (err) {
      console.warn('Notice fetching deal detail:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (overrideData = null) => {
    const dataToSave = overrideData || formData;
    try {
      setSaving(true);
      const payload = {
        id: id,
        chooseExistingOrganization: true,
        chooseExistingContact: true,
        organizationName: dataToSave.organizationName || 'Company',
        primaryEmail: '',
        primaryMobileNo: '',
        salutation: null,
        firstName: 'Contact',
        lastName: '',
        gender: null,
        website: dataToSave.website || '',
        noOfEmployees: null,
        territoryId: null,
        annualRevenue: parseFloat((dataToSave.annualRevenue || '0').replace(/[^0-9.]/g, '')) || 0,
        industry: null,
        status: dataToSave.status,
        dealOwnerId: null,
        organizationId: null,
        contactId: null
      };

      await dealsApi.update(id, payload);
      showToast('Deal saved successfully!', 'success');
      await fetchDealDetail(id);
    } catch (err) {
      console.error('Error updating deal:', err);
      showToast(err.message || 'Error updating deal', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const updated = { ...formData, status: newStatus };
    setFormData(updated);
    setIsStatusOpen(false);
    try {
      setSaving(true);
      await dealsApi.updateStage(id, newStatus);
      showToast('Deal status updated successfully!', 'success');
      await fetchDealDetail(id);
    } catch (err) {
      console.warn('Fallback to full update for status change:', err.message);
      await handleSave(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeal = async () => {
    if (!window.confirm(`Are you sure you want to delete deal "${dealTitle}"?`)) return;
    try {
      setSaving(true);
      await dealsApi.delete(id);
      showToast('Deal deleted successfully!', 'success');
      setTimeout(() => {
        navigate('/crm/deals');
      }, 1000);
    } catch (err) {
      console.error('Error deleting deal:', err);
      showToast(err.message || 'Error deleting deal', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignToMeToggle = () => {
    const nextVal = !assignToMe;
    setAssignToMe(nextVal);
    const newOwner = nextVal ? 'Elvin Muzaffarli' : 'Administrator';
    const updated = { ...formData, dealOwner: newOwner };
    setFormData(updated);
    handleSave(updated);
  };

  const handleAddProductRow = () => {
    setProducts([...products, { id: Date.now(), name: '', rate: 0 }]);
  };

  const ownerObj = ownerList.find(o => o.name === formData.dealOwner) || ownerList[0];
  const activeStatusObj = dealStatusList.find(s => s.name === formData.status) || dealStatusList[1];
  const dealTitle = formData.organizationName || 'Deal Details';

  return (
    <div className="-m-4 lg:-m-6 -mb-20 min-h-screen bg-[#121214] text-[#E4E4E7] flex flex-col font-sans relative">
      {/* FLOATING TOAST ALERT NOTIFICATION */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center justify-between gap-3 bg-[#E4E4E7] text-[#18181B] px-4 py-2.5 rounded-2xl shadow-2xl min-w-[280px] max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            {toast.type === 'error' ? (
              <ExclamationCircleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-black shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-[#71717A] hover:text-black transition-colors cursor-pointer p-0.5"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP BREADCRUMB & HEADER ACTIONS BAR */}
      <div className="px-6 py-3 border-b border-[#2C2C2E]/60 bg-[#121214] flex items-center justify-between shrink-0">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#A1A1AA]">
          <Link to="/crm/deals" className="hover:text-white transition-colors">Deals</Link>
          <span>/</span>
          <Link to="/crm/deals" className="hover:text-white transition-colors">List</Link>
          <span>/</span>
          <span className="text-white font-semibold">{dealTitle}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 text-xs">
          {/* ASSIGN TO POPOVER */}
          <div className="relative" ref={assignRef}>
            <button
              onClick={() => setIsAssignToOpen(!isAssignToOpen)}
              className="flex items-center gap-2 bg-[#1C1C1E] border border-[#2C2C2E] px-3.5 py-1.5 rounded-xl hover:border-[#3F3F46] transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-[#27272A] text-white text-[9px] font-bold flex items-center justify-center">
                {ownerObj.initial}
              </span>
              <span className="font-medium text-white">{formData.dealOwner}</span>
            </button>

            {isAssignToOpen && (
              <div className="absolute top-11 right-0 w-80 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-4 z-50 text-xs text-[#E4E4E7] space-y-4 animate-in fade-in duration-150">
                <span className="text-sm font-semibold text-white block">Assign To</span>
                
                <div className="bg-[#141416] border border-[#2C2C2E] rounded-xl p-2 flex items-center gap-2 flex-wrap min-h-[44px]">
                  <div className="flex items-center gap-1.5 bg-[#27272A] border border-[#3F3F46] text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    <span className="w-4 h-4 rounded-full bg-[#3F3F46] text-white text-[9px] font-bold flex items-center justify-center">
                      {ownerObj.initial}
                    </span>
                    <span>{formData.dealOwner}</span>
                    <button onClick={() => { setFormData({ ...formData, dealOwner: 'Administrator' }); }} className="text-[#A1A1AA] hover:text-white ml-1">
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#2C2C2E]/60">
                  <span className="font-medium text-white">Assign To Me</span>
                  <button
                    type="button"
                    onClick={handleAssignToMeToggle}
                    className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                      assignToMe ? 'bg-sky-600' : 'bg-[#27272A]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${assignToMe ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STATUS DROPDOWN POPOVER (Screenshot 2 Match!) */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center gap-2.5 bg-[#1C1C1E] border border-[#2C2C2E] px-3.5 py-1.5 rounded-xl font-semibold hover:border-[#3F3F46] transition-colors cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: activeStatusObj.color }}></span>
              <span className="text-white">{formData.status}</span>
              {isStatusOpen ? <ChevronUpIcon className="w-3.5 h-3.5 text-[#A1A1AA]" /> : <ChevronDownIcon className="w-3.5 h-3.5 text-[#A1A1AA]" />}
            </button>

            {isStatusOpen && (
              <div className="absolute top-11 right-0 w-48 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-50 text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150">
                {dealStatusList.map((st) => (
                  <button
                    key={st.name}
                    onClick={() => handleStatusChange(st.name)}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                      formData.status === st.name ? 'bg-[#2C2C2E] font-semibold text-white' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: st.color }}></span>
                    <span>{st.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SUB-HEADER NAVIGATION TABS */}
      <div className="px-6 border-b border-[#2C2C2E]/60 bg-[#121214] flex items-center gap-6 text-xs text-[#A1A1AA] overflow-x-auto custom-scrollbar shrink-0">
        {['Activity', 'Emails', 'Comments', 'Data', 'Calls', 'Tasks', 'Notes', 'Attachments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 font-medium transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab
                ? 'border-sky-500 text-white font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            {tab === 'Data' && <ListBulletIcon className="w-3.5 h-3.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* 3. MAIN TWO-COLUMN CONTENT BODY */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* LEFT MAIN PANEL */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar flex flex-col justify-between space-y-6">
          <div className="space-y-6 flex-1">
            {/* 1. ACTIVITY TAB */}
            {activeTab === 'Activity' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Activity</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ New</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <UserGroupIcon className="w-4 h-4 text-[#A1A1AA]" />
                      <span className="font-semibold text-white">Administrator</span>
                      <span className="text-[#A1A1AA]">created this deal</span>
                    </div>
                    <span className="text-[11px] text-[#71717A]">just now</span>
                  </div>
                </div>
              </>
            )}

            {/* 2. EMAILS TAB */}
            {activeTab === 'Emails' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Emails</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ New Email</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                    <EnvelopeIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">No Emails Found</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                    No emails found in your inbox. New messages will appear here soon.
                  </p>
                </div>
              </>
            )}

            {/* 3. COMMENTS TAB */}
            {activeTab === 'Comments' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Comments</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ New Comment</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center text-[#71717A] text-xs">
                  No comments yet.
                </div>
              </>
            )}

            {/* 4. DATA TAB (Screenshot 1 Match!) */}
            {activeTab === 'Data' && (
              <>
                {/* Header Title & Controls */}
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Data</h1>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 border border-[#2C2C2E] rounded-xl hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                      title="Edit Layout"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSave()}
                      disabled={saving}
                      className="px-5 py-2 bg-[#27272A] hover:bg-[#3F3F46] border border-[#3F3F46] text-white font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 text-xs shadow-sm"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>

                {/* SECTION 1: DETAILS (3 Columns Grid - Screenshot 1!) */}
                <div className="space-y-4">
                  <button
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer hover:text-sky-400 transition-colors"
                  >
                    <span>Details</span>
                    {isDetailsOpen ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronUpIcon className="w-3.5 h-3.5" />}
                  </button>

                  {isDetailsOpen && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                      {/* Column 1 */}
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Organization</label>
                          <input
                            type="text"
                            value={formData.organizationName}
                            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Annual Revenue</label>
                          <input
                            type="text"
                            value={formData.annualRevenue}
                            onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Next Step</label>
                          <input
                            type="text"
                            placeholder="Next Step"
                            value={formData.nextStep}
                            onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Website</label>
                          <input
                            type="text"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Closed Date</label>
                          <input
                            type="text"
                            placeholder="Closed Date"
                            value={formData.closedDate}
                            onChange={(e) => setFormData({ ...formData, closedDate: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Deal Owner</label>
                          <select
                            value={formData.dealOwner}
                            onChange={(e) => setFormData({ ...formData, dealOwner: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                          >
                            {ownerList.map((o) => (
                              <option key={o.name} value={o.name}>{o.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3.5">
                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Territory</label>
                          <select
                            value={formData.territory}
                            onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                          >
                            <option value="">Territory</option>
                            {territoryOptions.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[#A1A1AA] font-medium">Probability</label>
                          <input
                            type="text"
                            value={formData.probability}
                            onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                            className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#2C2C2E]/60 my-5"></div>

                {/* SECTION 2: PRODUCTS TABLE (Screenshot 1 Match!) */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-white block">Products</span>

                  <div className="bg-[#141416] border border-[#2C2C2E] rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#2C2C2E] text-[#A1A1AA] font-medium">
                          <th className="py-2.5 px-4 w-10">
                            <input type="checkbox" className="rounded border-[#3F3F46] bg-[#27272A]" />
                          </th>
                          <th className="py-2.5 px-4 w-12">No.</th>
                          <th className="py-2.5 px-4">Product</th>
                          <th className="py-2.5 px-4 text-right">Rate <span className="text-rose-400">*</span></th>
                          <th className="py-2.5 px-4 w-10 text-center">⚙️</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-[#71717A]">
                              No Data
                            </td>
                          </tr>
                        ) : (
                          products.map((p, index) => (
                            <tr key={p.id} className="border-b border-[#2C2C2E]/60 text-white">
                              <td className="py-2 px-4">
                                <input type="checkbox" className="rounded border-[#3F3F46] bg-[#27272A]" />
                              </td>
                              <td className="py-2 px-4">{index + 1}</td>
                              <td className="py-2 px-4">
                                <input
                                  type="text"
                                  placeholder="Product Name"
                                  value={p.name}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    updated[index].name = e.target.value;
                                    setProducts(updated);
                                  }}
                                  className="w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-2.5 py-1 text-xs text-white"
                                />
                              </td>
                              <td className="py-2 px-4 text-right font-mono">
                                <input
                                  type="number"
                                  value={p.rate}
                                  onChange={(e) => {
                                    const updated = [...products];
                                    updated[index].rate = parseFloat(e.target.value) || 0;
                                    setProducts(updated);
                                  }}
                                  className="w-24 bg-[#1C1C1E] border border-[#2C2C2E] rounded-lg px-2.5 py-1 text-xs text-right text-white font-mono"
                                />
                              </td>
                              <td className="py-2 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setProducts(products.filter(item => item.id !== p.id))}
                                  className="text-rose-400 hover:text-rose-300"
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProductRow}
                    className="px-3.5 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:bg-[#27272A] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Add Row
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3">
                    <div className="space-y-1.5">
                      <label className="text-[#A1A1AA] font-medium">Total</label>
                      <input
                        type="text"
                        readOnly
                        value="$ 0.00"
                        className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[#A1A1AA] font-medium">Net Total</label>
                        <input
                          type="text"
                          readOnly
                          value="$ 0.00"
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[#A1A1AA] font-medium">Total after discount</label>
                        <input
                          type="text"
                          placeholder="Total after discount"
                          readOnly
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white placeholder:text-[#71717A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 5. CALLS TAB */}
            {activeTab === 'Calls' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Calls</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ Log a Call</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">No Call History</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                    No recent calls to display. Log a call or call someone now!
                  </p>
                </div>
              </>
            )}

            {/* 6. TASKS TAB */}
            {activeTab === 'Tasks' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Tasks</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ New Task</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">No Tasks Found</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                    Nothing here for now. Create tasks to manage your to-dos.
                  </p>
                </div>
              </>
            )}

            {/* 7. NOTES TAB */}
            {activeTab === 'Notes' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Notes</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ New Note</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">No Notes Found</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                    Nothing here for now. Add a note to keep track of things.
                  </p>
                </div>
              </>
            )}

            {/* 8. ATTACHMENTS TAB */}
            {activeTab === 'Attachments' && (
              <>
                <div className="flex items-center justify-between border-b border-[#2C2C2E]/40 pb-3.5">
                  <h1 className="text-xl font-bold text-white tracking-tight">Attachments</h1>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <span>+ Upload File</span>
                  </button>
                </div>

                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                    <PaperClipIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3">No Attachments Found</h3>
                  <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                    No attachments found for this deal. Upload files to keep track.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="pt-4 border-t border-[#2C2C2E]/60 flex items-center gap-6 text-xs text-[#A1A1AA] font-medium shrink-0">
            <button type="button" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <EnvelopeIcon className="w-4 h-4" />
              <span>Reply</span>
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>Comment</span>
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR SUMMARY PANEL (Screenshot 1 Match!) */}
        <div className="w-full lg:w-80 shrink-0 border-l border-[#2C2C2E]/60 bg-[#121214] p-5 space-y-5 text-xs overflow-y-auto custom-scrollbar">
          {/* Top Code Reference */}
          <div className="flex justify-end text-[11px] text-[#A1A1AA] font-mono tracking-tight">
            CRM-DEAL-2026-00017
          </div>

          {/* Avatar & Deal Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#27272A] border border-[#3F3F46] flex items-center justify-center text-white font-bold text-base shrink-0">
              {dealTitle ? dealTitle.charAt(0).toUpperCase() : 'A'}
            </div>
            <h2 className="text-sm font-bold text-white leading-tight truncate">{dealTitle}</h2>
          </div>

          {/* Quick Action Icons Row */}
          <div className="flex items-center gap-2 pt-1">
            <button type="button" className="p-2 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" title="Email">
              <EnvelopeIcon className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" title="Link">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" title="Attachment">
              <PaperClipIcon className="w-4 h-4" />
            </button>
            <button type="button" onClick={handleDeleteDeal} className="p-2 bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl hover:bg-rose-950/60 text-rose-400 transition-colors cursor-pointer" title="Delete">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="h-px bg-[#2C2C2E]/60 my-2"></div>

          {/* Sidebar Section 1: Contacts (Screenshot 1 Match!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsContactsOpen(!isContactsOpen)}
                className="flex items-center gap-1.5 font-bold text-white cursor-pointer hover:text-sky-400 transition-colors"
              >
                <span>Contacts</span>
                {isContactsOpen ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronUpIcon className="w-3.5 h-3.5" />}
              </button>
              <button type="button" className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
                <PlusIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {isContactsOpen && (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#27272A] text-white text-[10px] font-bold flex items-center justify-center">N</span>
                    <span className="font-semibold text-white">{formData.contactName}</span>
                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                      Primary
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#A1A1AA]">
                    <button className="hover:text-white">···</button>
                    <button className="hover:text-white"><ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-white"><ChevronRightIcon className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-[#2C2C2E]/60 my-2"></div>

          {/* Sidebar Section 2: Organization Details (Screenshot 1 Match!) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOrgDetailsOpen(!isOrgDetailsOpen)}
                className="flex items-center gap-1.5 font-bold text-white cursor-pointer hover:text-sky-400 transition-colors"
              >
                <span>Organization Details</span>
                {isOrgDetailsOpen ? <ChevronDownIcon className="w-3.5 h-3.5" /> : <ChevronUpIcon className="w-3.5 h-3.5" />}
              </button>
              <button type="button" className="text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
                <PencilSquareIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {isOrgDetailsOpen && (
              <div className="space-y-3 text-[#D4D4D8]">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717A] text-[11px]">Organization</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-white">{formData.organizationName || '—'}</span>
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 text-[#A1A1AA]" />
                  </div>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Website</span>
                  {formData.website ? (
                    <a href={formData.website} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline truncate block font-mono">
                      {formData.website}
                    </a>
                  ) : (
                    <span className="text-[#71717A]">Add Website...</span>
                  )}
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Territory</span>
                  <span className="text-[#71717A]">{formData.territory || 'Add Territory...'}</span>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Annual Revenue</span>
                  <span className="font-mono text-white">{formData.annualRevenue || '$ 0.00'}</span>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Closed Date</span>
                  <span className="text-[#71717A]">{formData.closedDate || 'Add Closed Date...'}</span>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Probability</span>
                  <span className="font-mono text-white">{formData.probability || '25.000%'}</span>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Next Step</span>
                  <span className="text-[#71717A]">{formData.nextStep || 'Add Next Step...'}</span>
                </div>

                <div>
                  <span className="text-[#71717A] block text-[11px]">Deal Owner</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#27272A] text-white text-[8px] font-bold flex items-center justify-center shrink-0">
                      {ownerObj.initial}
                    </span>
                    <span className="font-semibold text-white">{formData.dealOwner}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailPage;
