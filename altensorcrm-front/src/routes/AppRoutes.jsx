import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DesktopPage from '../pages/DesktopPage';
import CrmLayout from '../layouts/CrmLayout';
import CrmDashboardPage from '../pages/crm/CrmDashboardPage';
import LeadsPage from '../pages/crm/LeadsPage';
import LeadDetailPage from '../pages/crm/LeadDetailPage';
import DealsPage from '../pages/crm/DealsPage';
import DealDetailPage from '../pages/crm/DealDetailPage';
import ContactsPage from '../pages/crm/ContactsPage';
import ContactDetailPage from '../pages/crm/ContactDetailPage';
import OrganizationsPage from '../pages/crm/OrganizationsPage';
import OrganizationDetailPage from '../pages/crm/OrganizationDetailPage';
import NotesPage from '../pages/crm/NotesPage';
import CallLogsPage from '../pages/crm/CallLogsPage';
import SettingsPage from '../pages/crm/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Site Entry Route: Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Enterprise Workspace Desktop / Launchpad */}
      <Route path="/desktop" element={<DesktopPage />} />
      <Route path="/workspace" element={<DesktopPage />} />

      {/* Altensor CRM Module Sub-Routes */}
      <Route path="/crm" element={<CrmLayout />}>
        <Route index element={<Navigate to="/crm/dashboard" replace />} />
        <Route path="dashboard" element={<CrmDashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:id" element={<LeadDetailPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="deals/:id" element={<DealDetailPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/:id" element={<ContactDetailPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="organizations/:id" element={<OrganizationDetailPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="call-logs" element={<CallLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
