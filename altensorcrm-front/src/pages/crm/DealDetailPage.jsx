import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dealsApi, orgsApi, contactsApi, notesApi, callLogsApi, productsApi } from '../../services/api';
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
  ChevronRightIcon,
  ComputerDesktopIcon,
  CameraIcon
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

const callTypes = ['Outgoing', 'Incoming'];
const callStatuses = ['Completed', 'Missed', 'Busy', 'Scheduled'];

// REAL WORKING RICH TEXT EDITOR COMPONENT (Matching NotesPage!)
const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    strike: false,
    h1: false
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateFormatState();
  };

  const updateFormatState = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      strike: document.queryCommandState('strikeThrough'),
      h1: document.queryCommandValue('formatBlock') === 'h1'
    });
  };

  return (
    <div className="bg-[#141416] border border-[#2C2C2E] rounded-2xl overflow-hidden shadow-inner">
      <div className="p-2 bg-[#18181B] border-b border-[#2C2C2E] space-y-1.5 select-none">
        <div ref={toolbarRef} className="flex items-center gap-1.5 text-[#A1A1AA] text-xs overflow-x-auto custom-scrollbar pb-1">
          <button
            type="button"
            onClick={() => exec('formatBlock', '<p>')}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#2C2C2E] rounded-lg text-white font-serif border border-[#3F3F46]/60 cursor-pointer shrink-0"
            title="Normal Text"
          >
            T
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', '<h1>')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-white font-bold text-[11px] cursor-pointer shrink-0 ${
              activeFormats.h1 ? 'bg-[#2C2C2E] border border-sky-500' : 'hover:bg-[#2C2C2E]'
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => exec('bold')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-white font-bold cursor-pointer shrink-0 ${
              activeFormats.bold ? 'bg-[#2C2C2E] border border-white/20' : 'hover:bg-[#2C2C2E]'
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => exec('italic')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-white italic cursor-pointer shrink-0 ${
              activeFormats.italic ? 'bg-[#2C2C2E] border border-white/20' : 'hover:bg-[#2C2C2E]'
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => exec('strikeThrough')}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-white line-through cursor-pointer shrink-0 ${
              activeFormats.strike ? 'bg-[#2C2C2E] border border-white/20' : 'hover:bg-[#2C2C2E]'
            }`}
            title="Strikethrough"
          >
            S
          </button>
          <div className="w-px h-5 bg-[#2C2C2E] mx-0.5 shrink-0"></div>
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) exec('createLink', url);
            }}
            className="w-7 h-7 flex items-center justify-center hover:bg-[#2C2C2E] rounded-lg text-white cursor-pointer shrink-0"
            title="Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={() => onChange(editorRef.current.innerHTML)}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
        className="p-3 min-h-[140px] text-xs text-white focus:outline-none leading-relaxed overflow-y-auto max-h-[220px] custom-scrollbar"
      />
    </div>
  );
};

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

  // Available Products & Table Rows State
  const [availableProducts, setAvailableProducts] = useState(() => {
    const saved = localStorage.getItem('altensor_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(item => item.name !== 'aasas');
      } catch {
        return [];
      }
    }
    return [];
  });

  const [products, setProducts] = useState([]);
  const [selectedProductRowIndexes, setSelectedProductRowIndexes] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [activeProductDropdownRowIndex, setActiveProductDropdownRowIndex] = useState(null);

  const handleToggleSelectAllProducts = (e) => {
    if (e.target.checked) {
      setSelectedProductRowIndexes(products.map((_, idx) => idx));
    } else {
      setSelectedProductRowIndexes([]);
    }
  };

  const handleToggleSelectProductRow = (index) => {
    if (selectedProductRowIndexes.includes(index)) {
      setSelectedProductRowIndexes(selectedProductRowIndexes.filter(i => i !== index));
    } else {
      setSelectedProductRowIndexes([...selectedProductRowIndexes, index]);
    }
  };

  const handleDeleteSelectedProductRows = async () => {
    if (selectedProductRowIndexes.length === 0) return;

    const rowsToDelete = products.filter((_, idx) => selectedProductRowIndexes.includes(idx));

    for (const r of rowsToDelete) {
      const targetId = r.productId || r.id;
      const targetName = r.name;

      if (targetId && typeof targetId === 'string' && targetId.includes('-')) {
        try {
          await productsApi.delete(targetId);
          console.log(`[FRONTEND PRODUCTS] Deleted product ${targetId} from Database`);
        } catch (err) {
          console.warn(`[FRONTEND PRODUCTS] Delete API warning for product ${targetId}:`, err);
        }
      }

      setAvailableProducts(prev => prev.filter(p => p.id !== targetId && p.name !== targetName));

      const savedLocal = localStorage.getItem('altensor_products');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          const filtered = parsed.filter(p => p.id !== targetId && p.name !== targetName);
          localStorage.setItem('altensor_products', JSON.stringify(filtered));
        } catch {}
      }
    }

    const remaining = products.filter((_, idx) => !selectedProductRowIndexes.includes(idx));
    setProducts(remaining);
    setSelectedProductRowIndexes([]);

    if (id) {
      localStorage.setItem(`altensor_deal_products_${id}`, JSON.stringify(remaining));
    }

    showToast('Selected row(s) deleted!', 'success');
  };
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNamingSeriesOpen, setIsNamingSeriesOpen] = useState(false);

  const [newProductForm, setNewProductForm] = useState({
    namingSeries: 'CRM-PROD-.YYYY.-',
    productCode: '',
    productName: '',
    disabled: false,
    standardSellingRate: '0.00',
    image: null,
    description: ''
  });

  const handleOpenCreateModal = (rowIndex = null) => {
    setActiveProductDropdownRowIndex(rowIndex);
    setEditingProductId(null);
    setNewProductForm({
      namingSeries: 'CRM-PROD-.YYYY.-',
      productCode: '',
      productName: '',
      disabled: false,
      standardSellingRate: '0.00',
      image: null,
      description: ''
    });
    setIsNewProductModalOpen(true);
  };

  const handleEditProductClick = (rowIndex, p) => {
    setActiveProductDropdownRowIndex(rowIndex);
    const found = availableProducts.find(item => item.id === p.productId || item.name === p.name);

    setEditingProductId(found?.id || p.productId || null);
    setNewProductForm({
      namingSeries: found?.namingSeries || 'CRM-PROD-.YYYY.-',
      productCode: found?.code || p.code || '',
      productName: found?.name || p.name || '',
      disabled: found?.disabled || false,
      standardSellingRate: String(found?.rate ?? p.rate ?? '0.00'),
      image: found?.image || null,
      description: found?.description || ''
    });
    setIsNewProductModalOpen(true);
  };

  // Attach Modal State
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [attachTab, setAttachTab] = useState('device'); // 'device' | 'link' | 'camera'
  const [selectedAttachFile, setSelectedAttachFile] = useState(null);
  const [attachLinkUrl, setAttachLinkUrl] = useState('');
  const [uploadingAttach, setUploadingAttach] = useState(false);

  const handleConfirmAttach = async () => {
    if (attachTab === 'link' && attachLinkUrl) {
      setNewProductForm({ ...newProductForm, image: attachLinkUrl });
      setIsAttachModalOpen(false);
      setAttachLinkUrl('');
      showToast('Image URL attached!', 'success');
      return;
    }

    if (selectedAttachFile) {
      setUploadingAttach(true);
      try {
        const res = await productsApi.uploadImage(selectedAttachFile);
        const fileUrl = res.url || `/uploads/products/${res.fileName || selectedAttachFile.name}`;
        setNewProductForm({ ...newProductForm, image: fileUrl });
        setIsAttachModalOpen(false);
        setSelectedAttachFile(null);
        showToast('Image uploaded & saved to wwwroot!', 'success');
      } catch (err) {
        console.error('Upload error:', err);
        setNewProductForm({ ...newProductForm, image: selectedAttachFile.name });
        setIsAttachModalOpen(false);
        setSelectedAttachFile(null);
        showToast('Image attached!', 'success');
      } finally {
        setUploadingAttach(false);
      }
    }
  };

  const handleAddProductRow = () => {
    setProducts([...products, { id: Date.now(), productId: '', name: '', rate: 0 }]);
  };

  const handleSelectProduct = (rowIndex, prod) => {
    const updated = [...products];
    updated[rowIndex] = {
      ...updated[rowIndex],
      productId: prod.id,
      name: prod.name,
      rate: prod.rate
    };
    setProducts(updated);
    setActiveProductDropdownRowIndex(null);
    setProductSearchQuery('');
  };

  const handleClearProductRow = (rowIndex) => {
    const updated = [...products];
    updated[rowIndex] = {
      ...updated[rowIndex],
      productId: '',
      name: '',
      rate: 0
    };
    setProducts(updated);
    setActiveProductDropdownRowIndex(null);
    setProductSearchQuery('');
  };

  // Load deal's specific table rows from localStorage when deal ID changes
  useEffect(() => {
    if (id) {
      const savedDealProds = localStorage.getItem(`altensor_deal_products_${id}`);
      if (savedDealProds) {
        try {
          setProducts(JSON.parse(savedDealProds));
        } catch {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    }
  }, [id]);

  // Whenever products state changes for this deal, save it
  useEffect(() => {
    if (id && products.length > 0) {
      localStorage.setItem(`altensor_deal_products_${id}`, JSON.stringify(products));
    }
  }, [id, products]);

  const fetchProducts = async () => {
    console.log('[FRONTEND PRODUCTS] Calling productsApi.getAll()...');
    try {
      const list = await productsApi.getAll();
      console.log('[FRONTEND PRODUCTS] API returned products list:', list);
      if (list && Array.isArray(list)) {
        const mapped = list.map(p => ({
          id: p.id,
          name: p.productName || p.productCode,
          code: p.productCode,
          rate: p.standardSellingRate,
          namingSeries: p.namingSeries,
          disabled: p.disabled,
          description: p.description,
          image: p.imageUrl || null
        }));

        const savedLocal = localStorage.getItem('altensor_products');
        let localList = savedLocal ? JSON.parse(savedLocal) : [];
        localList = localList.filter(item => item.name !== 'aasas');

        const combined = [...mapped];
        localList.forEach(lp => {
          if (!combined.some(c => c.id === lp.id || c.code === lp.code)) {
            combined.push(lp);
          }
        });

        console.log('[FRONTEND PRODUCTS] Combined products state:', combined);
        setAvailableProducts(combined);
        localStorage.setItem('altensor_products', JSON.stringify(combined));
      }
    } catch (err) {
      console.error('[FRONTEND PRODUCTS] Error fetching products from API:', err);
      const savedLocal = localStorage.getItem('altensor_products');
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal).filter(item => item.name !== 'aasas');
          setAvailableProducts(parsed);
        } catch {}
      }
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    const rateVal = parseFloat(newProductForm.standardSellingRate) || 0;
    const prodName = newProductForm.productName || newProductForm.productCode || 'New Product';

    const payload = {
      namingSeries: newProductForm.namingSeries || 'CRM-PROD-.YYYY.-',
      productCode: newProductForm.productCode || ('PROD-' + Date.now().toString().slice(-4)),
      productName: prodName,
      standardSellingRate: rateVal,
      disabled: newProductForm.disabled || false,
      description: newProductForm.description || '',
      imageUrl: newProductForm.image || null
    };

    if (editingProductId) {
      // EDIT / UPDATE EXISTING PRODUCT IN DATABASE
      try {
        const updatePayload = {
          id: editingProductId,
          ...payload
        };
        const updatedRes = await productsApi.update(editingProductId, updatePayload);

        const updatedProdObj = {
          id: editingProductId,
          name: updatedRes?.productName || prodName,
          code: updatedRes?.productCode || payload.productCode,
          rate: updatedRes?.standardSellingRate ?? rateVal,
          namingSeries: updatedRes?.namingSeries || payload.namingSeries,
          disabled: updatedRes?.disabled ?? payload.disabled,
          description: updatedRes?.description || payload.description,
          image: updatedRes?.imageUrl || payload.imageUrl
        };

        const updatedAvailable = availableProducts.map(item => item.id === editingProductId ? updatedProdObj : item);
        setAvailableProducts(updatedAvailable);
        localStorage.setItem('altensor_products', JSON.stringify(updatedAvailable));

        // Update rows in products table that use this product
        setProducts(prev => prev.map(row => (row.productId === editingProductId || row.name === payload.productName) ? {
          ...row,
          name: updatedProdObj.name,
          rate: updatedProdObj.rate
        } : row));

        setIsNewProductModalOpen(false);
        setEditingProductId(null);
        showToast('Product updated successfully in Database!', 'success');
      } catch (err) {
        console.error('[FRONTEND PRODUCTS] Database Update Error:', err);
        showToast(`Database Error: ${err.message || 'Could not update product'}`, 'error');
      }
    } else {
      // CREATE NEW PRODUCT IN DATABASE
      try {
        const created = await productsApi.create(payload);
        console.log('[FRONTEND PRODUCTS] Product CREATED in Database:', created);

        const newProdObj = {
          id: created.id,
          name: created.productName || prodName,
          code: created.productCode || payload.productCode,
          rate: created.standardSellingRate ?? rateVal,
          namingSeries: created.namingSeries || payload.namingSeries,
          disabled: created.disabled ?? false,
          description: created.description || '',
          image: created.imageUrl || newProductForm.image || null
        };

        const updatedAvailable = [newProdObj, ...availableProducts.filter(p => p.id !== newProdObj.id)];
        setAvailableProducts(updatedAvailable);
        localStorage.setItem('altensor_products', JSON.stringify(updatedAvailable));

        if (activeProductDropdownRowIndex !== null && products[activeProductDropdownRowIndex]) {
          handleSelectProduct(activeProductDropdownRowIndex, newProdObj);
        } else {
          const newRow = {
            id: Date.now(),
            productId: newProdObj.id,
            name: newProdObj.name,
            rate: newProdObj.rate
          };
          setProducts(prev => [...prev, newRow]);
        }

        setIsNewProductModalOpen(false);
        showToast('Product saved to Database!', 'success');

        setNewProductForm({
          namingSeries: 'CRM-PROD-.YYYY.-',
          productCode: '',
          productName: '',
          disabled: false,
          standardSellingRate: '0.00',
          image: null,
          description: ''
        });
      } catch (err) {
        console.error('[FRONTEND PRODUCTS] Database Save Error:', err);
        showToast(`Database Error: ${err.message || 'Could not save product'}`, 'error');
      }
    }
  };

  // Real DB Notes & Call Logs State
  const [notesList, setNotesList] = useState([]);
  const [callLogsList, setCallLogsList] = useState([]);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [isNewCallModalOpen, setIsNewCallModalOpen] = useState(false);
  const [openDropdownField, setOpenDropdownField] = useState(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [callForm, setCallForm] = useState({
    type: 'Outgoing',
    receiver: 'Nermin Veliyeva',
    status: 'Completed',
    duration: '30s',
    fromNumber: '0500000000',
    toNumber: '0550000000'
  });

  useEffect(() => {
    fetchProducts();
    if (id) {
      fetchDealDetail(id);
      fetchDealNotesAndCalls();
    }
  }, [id]);

  const fetchDealNotesAndCalls = async () => {
    try {
      const [allNotes, allCalls] = await Promise.all([
        notesApi.getAll().catch(() => []),
        callLogsApi.getAll().catch(() => [])
      ]);

      if (Array.isArray(allNotes)) {
        setNotesList(allNotes);
      }
      if (Array.isArray(allCalls)) {
        setCallLogsList(allCalls);
      }
    } catch (err) {
      console.warn('Notice fetching deal notes/calls:', err);
    }
  };

  const handleCreateNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim() && !noteForm.content.trim()) return;

    const newNote = {
      id: String(Date.now()),
      title: noteForm.title || 'Untitled Note',
      content: noteForm.content || '',
      owner: formData.dealOwner || 'Administrator',
      ownerInitial: (formData.dealOwner || 'A').charAt(0).toUpperCase(),
      lastModified: 'Just now',
      dealId: id
    };

    setNotesList((prev) => [newNote, ...prev]);
    setIsNewNoteModalOpen(false);
    showToast('Note created successfully!', 'success');

    try {
      const payload = {
        title: noteForm.title || 'Untitled Note',
        content: noteForm.content || '',
        createdById: null,
        leadId: null,
        dealId: id
      };
      await notesApi.create(payload);
      await fetchDealNotesAndCalls();
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setNoteForm({ title: '', content: '' });
    }
  };

  const handleCreateCallSubmit = async (e) => {
    e.preventDefault();
    const typeStr = callForm.type === 'Outgoing' ? 'Outgoing' : 'Incoming';
    const durSec = parseInt(String(callForm.duration || '0').replace(/[^0-9]/g, '')) || 0;

    const newCall = {
      id: String(Date.now()),
      caller: formData.dealOwner || 'Administrator',
      callerInitial: (formData.dealOwner || 'A').charAt(0).toUpperCase(),
      receiver: callForm.receiver || formData.contactName || 'Contact',
      receiverInitial: (callForm.receiver || formData.contactName || 'C').charAt(0).toUpperCase(),
      type: typeStr,
      status: callForm.status || 'Completed',
      duration: callForm.duration || '30s',
      fromNumber: callForm.fromNumber || '0500000000',
      toNumber: callForm.toNumber || '0550000000',
      createdOn: 'Just now',
      dealId: id
    };

    setCallLogsList((prev) => [newCall, ...prev]);
    setIsNewCallModalOpen(false);
    showToast('Call logged successfully!', 'success');

    try {
      const payload = {
        type: typeStr,
        toNumber: callForm.toNumber || '0550000000',
        fromNumber: callForm.fromNumber || '0500000000',
        status: callForm.status === 'Completed' ? 0 : callForm.status === 'Missed' ? 1 : 2,
        durationInSeconds: durSec,
        callReceivedById: null,
        callerUserId: null,
        leadId: null,
        dealId: id
      };
      await callLogsApi.create(payload);
      await fetchDealNotesAndCalls();
    } catch (err) {
      console.error('Error saving call log:', err);
    }
  };

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

                {/* SECTION 2: PRODUCTS TABLE (Matching Screenshots 1 & 4!) */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-white block">Products</span>

                  <div className="bg-[#141416] border border-[#2C2C2E] rounded-2xl shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#2C2C2E] text-[#A1A1AA] font-medium">
                          <th className="py-2.5 px-4 w-10">
                            <input
                              type="checkbox"
                              checked={products.length > 0 && selectedProductRowIndexes.length === products.length}
                              onChange={handleToggleSelectAllProducts}
                              className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                            />
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
                          products.map((p, index) => {
                            const filteredProds = availableProducts.filter(item =>
                              item.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
                              (item.code && item.code.toLowerCase().includes(productSearchQuery.toLowerCase()))
                            );

                            return (
                              <tr key={p.id} className={`border-b border-[#2C2C2E]/60 text-white relative ${activeProductDropdownRowIndex === index ? 'z-30' : ''}`}>
                                <td className="py-2.5 px-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedProductRowIndexes.includes(index)}
                                    onChange={() => handleToggleSelectProductRow(index)}
                                    className="rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-4 font-medium text-[#A1A1AA]">{index + 1}</td>
                                <td className="py-2.5 px-4 relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveProductDropdownRowIndex(activeProductDropdownRowIndex === index ? null : index);
                                      setProductSearchQuery('');
                                    }}
                                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-1.5 text-xs text-white hover:border-[#3F3F46] transition-colors cursor-pointer"
                                  >
                                    <span className="truncate">{p.name || 'Select Product...'}</span>
                                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                                  </button>

                                  {/* DROPDOWN POPUP (Matching Screenshot 1 100%) */}
                                  {activeProductDropdownRowIndex === index && (
                                    <div className="absolute top-11 left-0 z-[100] w-64 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-2.5 space-y-2 text-xs text-[#E4E4E7] animate-in fade-in duration-150">
                                      {/* Search Input with Clear X */}
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="Search"
                                          value={productSearchQuery}
                                          onChange={(e) => setProductSearchQuery(e.target.value)}
                                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl pl-3 pr-7 py-1.5 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                                        />
                                        {productSearchQuery && (
                                          <button
                                            type="button"
                                            onClick={() => setProductSearchQuery('')}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>

                                      {/* Results List */}
                                      <div className="max-h-36 overflow-y-auto custom-scrollbar space-y-0.5">
                                        {filteredProds.length === 0 ? (
                                          <div className="py-3 px-2 text-center text-[#71717A] text-[11px]">
                                            No results found
                                          </div>
                                        ) : (
                                          filteredProds.map((prod) => (
                                            <button
                                              key={prod.id}
                                              type="button"
                                              onClick={() => handleSelectProduct(index, prod)}
                                              className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                                                p.productId === prod.id ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                                              }`}
                                            >
                                              <span className="truncate">{prod.name}</span>
                                              <span className="text-[11px] text-[#A1A1AA] font-mono">${parseFloat(prod.rate || 0).toFixed(2)}</span>
                                            </button>
                                          ))
                                        )}
                                      </div>

                                      {/* Bottom Actions: + Create New & Clear */}
                                      <div className="pt-1.5 border-t border-[#2C2C2E]/60 space-y-1">
                                        <button
                                          type="button"
                                          onClick={() => handleOpenCreateModal(index)}
                                          className="w-full text-left px-2.5 py-1.5 rounded-xl bg-[#27272A]/70 hover:bg-[#27272A] text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <span>+ Create New</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleClearProductRow(index)}
                                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-950/40 text-rose-400 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                          <span>✕ Clear</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                                  ${(parseFloat(p.rate) || 0).toFixed(2)}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleEditProductClick(index, p)}
                                    className="p-1 rounded-lg text-[#71717A] hover:text-white transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <PencilSquareIcon className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedProductRowIndexes.length > 0 && (
                      <button
                        type="button"
                        onClick={handleDeleteSelectedProductRows}
                        className="px-4 py-1.5 bg-[#D9383A] hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm animate-in fade-in duration-150"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddProductRow}
                      className="px-3.5 py-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:bg-[#27272A] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Add Row
                    </button>
                  </div>

                  {/* Totals Section (Matching Screenshot 4 100%) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3">
                    <div className="space-y-1.5">
                      <label className="text-[#A1A1AA] font-medium">Total</label>
                      <input
                        type="text"
                        readOnly
                        value={`$ ${products.reduce((sum, p) => sum + (parseFloat(p.rate) || 0), 0).toFixed(2)}`}
                        className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[#A1A1AA] font-medium">Net Total</label>
                        <input
                          type="text"
                          readOnly
                          value={`$ ${products.reduce((sum, p) => sum + (parseFloat(p.rate) || 0), 0).toFixed(2)}`}
                          className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-white font-mono font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#71717A] text-[11px] block">Total after discount</span>
                        <span className="text-[#71717A] text-[11px] block">Total after discount</span>
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
                    onClick={() => setIsNewCallModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Log a Call</span>
                  </button>
                </div>

                {callLogsList.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                      <PhoneIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mt-3">No Call History</h3>
                    <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                      No recent calls to display. Log a call or call someone now!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {callLogsList.map((call, idx) => (
                      <div key={call.id || idx} className="bg-[#141416] border border-[#2C2C2E] rounded-2xl p-4 flex items-center justify-between text-xs text-[#E4E4E7]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                            <PhoneIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{call.caller || call.callerUserId || 'Administrator'}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#27272A] text-sky-400 font-medium">{call.type || 'Outgoing'}</span>
                            </div>
                            <p className="text-[#A1A1AA] text-[11px] mt-0.5">To: {call.toNumber || call.receiver || 'Contact'} ({call.durationInSeconds ? `${call.durationInSeconds}s` : call.duration || '0s'})</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#71717A]">{call.createdOn || 'Recent'}</span>
                      </div>
                    ))}
                  </div>
                )}
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
                    onClick={() => setIsNewNoteModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#1C1C1E] border border-[#2C2C2E] hover:border-[#3F3F46] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>+ New Note</span>
                  </button>
                </div>

                {notesList.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] border border-[#2C2C2E] flex items-center justify-center text-[#71717A]">
                      <DocumentTextIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white mt-3">No Notes Found</h3>
                    <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                      Nothing here for now. Add a note to keep track of things.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {notesList.map((note, idx) => (
                      <div key={note.id || idx} className="bg-[#141416] border border-[#2C2C2E] rounded-2xl p-4 space-y-2 text-xs text-[#E4E4E7]">
                        <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-2">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="w-4 h-4 text-sky-400" />
                            <span className="font-bold text-white text-sm">{note.title || 'Untitled Note'}</span>
                          </div>
                          <span className="text-[11px] text-[#71717A]">{note.lastModified || 'Recent'}</span>
                        </div>
                        <p className="text-[#D4D4D8] leading-relaxed whitespace-pre-line">{note.content}</p>
                        <div className="text-[11px] text-[#71717A] pt-1">By: {note.owner || note.createdByName || 'Administrator'}</div>
                      </div>
                    ))}
                  </div>
                )}
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
                <div
                  onClick={() => navigate(`/crm/contacts/${formData.contactId || '1'}`)}
                  className="flex items-center justify-between bg-[#1C1C1E] border border-[#2C2C2E] hover:border-sky-400 rounded-xl p-2 text-xs cursor-pointer transition-colors group"
                  title="View Contact Detail"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#27272A] text-white text-[10px] font-bold flex items-center justify-center">
                      {formData.contactName ? formData.contactName.charAt(0) : 'N'}
                    </span>
                    <span className="font-semibold text-white group-hover:text-sky-400 transition-colors">{formData.contactName || 'Ravan Umudov'}</span>
                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                      Primary
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#A1A1AA] group-hover:text-white transition-colors">
                    <span className="hover:text-white px-0.5">···</span>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 hover:text-sky-400" />
                    <ChevronRightIcon className="w-3.5 h-3.5 hover:text-sky-400" />
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

      {/* CREATE NOTE MODAL (Matching NotesPage 100%) */}
      {isNewNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-xl text-[#E4E4E7] space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <h2 className="text-lg font-bold text-white tracking-tight">Create Note</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateNoteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-medium">Title <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#A1A1AA] font-medium">Content</label>
                <RichTextEditor
                  value={noteForm.content}
                  onChange={(html) => setNoteForm({ ...noteForm, content: html })}
                />
              </div>

              <div className="flex items-center justify-end pt-2">
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

      {/* CREATE CALL LOG MODAL (Matching CallLogsPage 100%) */}
      {isNewCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl p-6 w-full max-w-lg text-[#E4E4E7] space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <h2 className="text-lg font-bold text-white tracking-tight">Create Call Log</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCallModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateCallSubmit} className="space-y-4 text-xs">
              {/* Row 1: Type * & To Number * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">Type <span className="text-rose-400">*</span></label>
                  <button
                    type="button"
                    onClick={() => setOpenDropdownField(openDropdownField === 'type' ? null : 'type')}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <span>{callForm.type || 'Type'}</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'type' && (
                    <div className="absolute top-14 left-0 w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-[100] text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150">
                      {callTypes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setCallForm({ ...callForm, type: t });
                            setOpenDropdownField(null);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                            callForm.type === t ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                          }`}
                        >
                          <span>{t}</span>
                          {callForm.type === t && <CheckIcon className="w-4 h-4 text-sky-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">To Number <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="To Number"
                    value={callForm.toNumber}
                    onChange={(e) => setCallForm({ ...callForm, toNumber: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Row 2: From Number * & Status * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">From Number <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="From Number"
                    value={callForm.fromNumber}
                    onChange={(e) => setCallForm({ ...callForm, fromNumber: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">Status <span className="text-rose-400">*</span></label>
                  <button
                    type="button"
                    onClick={() => setOpenDropdownField(openDropdownField === 'status' ? null : 'status')}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <span className="truncate">{callForm.status || 'Status'}</span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'status' && (
                    <div className="absolute top-14 left-0 w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-[100] text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150 max-h-48 overflow-y-auto custom-scrollbar">
                      {callStatuses.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setCallForm({ ...callForm, status: st });
                            setOpenDropdownField(null);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-xl transition-colors text-left cursor-pointer ${
                            callForm.status === st ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                          }`}
                        >
                          <span>{st}</span>
                          {callForm.status === st && <CheckIcon className="w-4 h-4 text-sky-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Duration & Dynamic User */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#A1A1AA] font-medium">Duration</label>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={callForm.duration}
                    onChange={(e) => setCallForm({ ...callForm, duration: e.target.value })}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[#A1A1AA] font-medium">
                    {callForm.type === 'Incoming' ? 'Call Received By' : 'Caller'}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setOpenDropdownField(openDropdownField === 'callUser' ? null : 'callUser'); setDropdownSearch(''); }}
                    className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-[#D4D4D8] focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <span className="truncate">
                      {callForm.type === 'Incoming' ? (callForm.receiver || 'Call Received By') : (callForm.caller || 'Caller')}
                    </span>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                  </button>

                  {openDropdownField === 'callUser' && (
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
                        {ownerList.filter(o => o.name.toLowerCase().includes(dropdownSearch.toLowerCase())).map((usr) => (
                          <button
                            key={usr.name}
                            type="button"
                            onClick={() => {
                              if (callForm.type === 'Incoming') {
                                setCallForm({ ...callForm, receiver: usr.name });
                              } else {
                                setCallForm({ ...callForm, caller: usr.name });
                              }
                              setOpenDropdownField(null);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                              (callForm.type === 'Incoming' ? callForm.receiver : callForm.caller) === usr.name ? 'bg-[#2C2C2E] text-white font-semibold' : 'hover:bg-[#2C2C2E]/60 text-[#D4D4D8]'
                            }`}
                          >
                            {usr.name}
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

      {/* CREATE NEW PRODUCT MODAL (Matching Screenshot 2 & 3 100%) */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl w-full max-w-xl p-6 text-[#E4E4E7] space-y-5 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <h2 className="text-xl font-bold text-white tracking-tight">{editingProductId ? 'Edit Product' : 'New Product'}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                  title="Edit Fields Layout"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewProductModalOpen(false);
                    setEditingProductId(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3.5">
                  {/* Naming Series Dropdown (Screenshot 3 Match!) */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[#A1A1AA] font-medium">Naming Series</label>
                    <button
                      type="button"
                      onClick={() => setIsNamingSeriesOpen(!isNamingSeriesOpen)}
                      className="flex items-center justify-between w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <span>{newProductForm.namingSeries}</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 text-[#71717A]" />
                    </button>

                    {isNamingSeriesOpen && (
                      <div className="absolute top-14 left-0 w-full bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl shadow-2xl p-1.5 z-[200] text-xs text-[#E4E4E7] space-y-0.5 animate-in fade-in duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setNewProductForm({ ...newProductForm, namingSeries: 'CRM-PROD-.YYYY.-' });
                            setIsNamingSeriesOpen(false);
                          }}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#2C2C2E] text-white font-semibold text-left cursor-pointer"
                        >
                          <span>CRM-PROD-.YYYY.-</span>
                          <CheckIcon className="w-4 h-4 text-sky-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Code */}
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Product Code <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Product Code"
                      value={newProductForm.productCode}
                      onChange={(e) => setNewProductForm({ ...newProductForm, productCode: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Product Name */}
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Product Name</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProductForm.productName}
                      onChange={(e) => setNewProductForm({ ...newProductForm, productName: e.target.value })}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3.5">
                  {/* Disabled Checkbox */}
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="disabledCheck"
                      checked={newProductForm.disabled}
                      onChange={(e) => setNewProductForm({ ...newProductForm, disabled: e.target.checked })}
                      className="w-4 h-4 rounded border-[#3F3F46] bg-[#27272A] text-sky-500 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="disabledCheck" className="text-[#A1A1AA] font-medium cursor-pointer">Disabled</label>
                  </div>

                  {/* Standard Selling Rate */}
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Standard Selling Rate</label>
                    <input
                      type="text"
                      placeholder="$ 0.00"
                      value={newProductForm.standardSellingRate ? `$ ${newProductForm.standardSellingRate}` : '$ 0.00'}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9.]/g, '');
                        setNewProductForm({ ...newProductForm, standardSellingRate: raw });
                      }}
                      className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Image Attachment Trigger (Opens Attach Modal - Matching Screenshot 100%) */}
                  <div className="space-y-1.5">
                    <label className="text-[#A1A1AA] font-medium">Image</label>
                    <button
                      type="button"
                      onClick={() => setIsAttachModalOpen(true)}
                      className="flex items-center gap-2 w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-[#71717A] hover:text-white hover:border-[#3F3F46] transition-colors cursor-pointer text-left"
                    >
                      <PaperClipIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{newProductForm.image || 'Attach file...'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Section with RichTextEditor */}
              <div className="space-y-1.5 pt-2 border-t border-[#2C2C2E]/60">
                <label className="text-[#A1A1AA] font-medium">Description</label>
                <RichTextEditor
                  value={newProductForm.description}
                  onChange={(html) => setNewProductForm({ ...newProductForm, description: html })}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTACH MODAL (Matching Screenshot 100%) */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-3xl shadow-2xl w-full max-w-lg p-6 text-[#E4E4E7] space-y-6 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#2C2C2E]/60 pb-3">
              <h2 className="text-xl font-bold text-white tracking-tight">Attach</h2>
              <button
                type="button"
                onClick={() => {
                  setIsAttachModalOpen(false);
                  setSelectedAttachFile(null);
                  setAttachLinkUrl('');
                }}
                className="p-1.5 rounded-xl hover:bg-[#2C2C2E] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Main Drag & Drop / Upload Box (Dashed Container) */}
            <div className="border border-dashed border-[#3F3F46] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-5 bg-[#141416]/50">
              <p className="text-xs text-[#A1A1AA] font-medium">
                Drag & Drop files here or upload from
              </p>

              {/* 3 Upload Mode Buttons: Device, Link, Camera */}
              <div className="flex items-center justify-center gap-6">
                {/* 1. Device Option */}
                <div className="flex flex-col items-center gap-1.5">
                  <label
                    htmlFor="deviceFileInput"
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      attachTab === 'device' ? 'bg-[#2C2C2E] border-sky-500 text-sky-400' : 'bg-[#1C1C1E] border-[#2C2C2E] text-white hover:bg-[#2C2C2E]'
                    }`}
                    onClick={() => setAttachTab('device')}
                  >
                    <ComputerDesktopIcon className="w-5 h-5" />
                  </label>
                  <span className="text-[11px] text-[#A1A1AA] font-medium">Device</span>
                  <input
                    type="file"
                    id="deviceFileInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedAttachFile(e.target.files[0]);
                        setAttachTab('device');
                      }
                    }}
                  />
                </div>

                {/* 2. Link Option */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAttachTab('link')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      attachTab === 'link' ? 'bg-[#2C2C2E] border-sky-500 text-sky-400' : 'bg-[#1C1C1E] border-[#2C2C2E] text-white hover:bg-[#2C2C2E]'
                    }`}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                  <span className="text-[11px] text-[#A1A1AA] font-medium">Link</span>
                </div>

                {/* 3. Camera Option */}
                <div className="flex flex-col items-center gap-1.5">
                  <label
                    htmlFor="cameraFileInput"
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      attachTab === 'camera' ? 'bg-[#2C2C2E] border-sky-500 text-sky-400' : 'bg-[#1C1C1E] border-[#2C2C2E] text-white hover:bg-[#2C2C2E]'
                    }`}
                    onClick={() => setAttachTab('camera')}
                  >
                    <CameraIcon className="w-5 h-5" />
                  </label>
                  <span className="text-[11px] text-[#A1A1AA] font-medium">Camera</span>
                  <input
                    type="file"
                    id="cameraFileInput"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedAttachFile(e.target.files[0]);
                        setAttachTab('camera');
                      }
                    }}
                  />
                </div>
              </div>

              {/* Selected file or Link Input display */}
              {attachTab === 'link' && (
                <div className="w-full max-w-sm pt-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={attachLinkUrl}
                    onChange={(e) => setAttachLinkUrl(e.target.value)}
                    className="w-full bg-[#141416] border border-[#2C2C2E] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              {selectedAttachFile && (attachTab === 'device' || attachTab === 'camera') && (
                <div className="text-xs text-sky-400 font-medium bg-sky-950/40 border border-sky-800/50 rounded-xl px-3 py-1.5 truncate max-w-xs">
                  📄 {selectedAttachFile.name}
                </div>
              )}
            </div>

            {/* Modal Bottom Right Action Button: Attach */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                disabled={!selectedAttachFile && !attachLinkUrl}
                onClick={handleConfirmAttach}
                className={`px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm ${
                  (selectedAttachFile || attachLinkUrl)
                    ? 'bg-white hover:bg-zinc-200 text-black cursor-pointer font-bold'
                    : 'bg-[#27272A] text-[#71717A] cursor-not-allowed'
                }`}
              >
                {uploadingAttach ? 'Uploading...' : 'Attach'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetailPage;
