import React, { useState, useEffect, useCallback } from 'react';
import { Client, ClientStatus } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Select } from '../components/ui/Select.js';
import { Badge, StatusBadge } from '../components/ui/Badge.js';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table.js';
import { LoadingSpinner, EmptyState } from '../components/ui/States.js';
import { Modal } from '../components/ui/Modal.js';
import { ClientModal } from '../components/clients/ClientModal.js';
import { ClientDetailModal } from '../components/clients/ClientDetailModal.js';
import {
  Building2,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  DollarSign,
  Users,
  Route as RouteIcon,
  Phone,
  RefreshCw,
  MapPin,
  Calendar,
} from 'lucide-react';

interface ClientManagementPageProps {
  navigate: (path: string) => void;
}

export const ClientManagementPage: React.FC<ClientManagementPageProps> = ({ navigate }) => {
  const { apiFetch, user } = useAuth();
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('companyName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Deactivation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Summary
  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalPassengers: 0,
    activeRoutes: 0,
  });

  const isClientUser = user?.role === 'CLIENT';
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const loadClientData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedIndustry !== 'ALL') params.append('industry', selectedIndustry);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await apiFetch(`/api/clients?${params.toString()}`);

      if (res && res.success) {
        setClients(res.data);
        if (res.summary) {
          setSummary(res.summary);
        }
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to fetch corporate client accounts.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiFetch, searchQuery, selectedStatus, selectedIndustry, sortBy, sortOrder, showToast]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const handleOpenAdd = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setSelectedClient(c);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (c: Client) => {
    setSelectedClient(c);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (c: Client) => {
    setClientToDelete(c);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!clientToDelete) return;
    try {
      setDeleteLoading(true);
      const res = await apiFetch(`/api/clients/${clientToDelete.id}`, {
        method: 'DELETE',
      });

      if (res && res.success) {
        showToast({
          type: 'success',
          title: 'Account Updated',
          message: res.message || `Client account ${clientToDelete.companyName} deactivated.`,
        });
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
        loadClientData();
      } else {
        showToast({
          type: 'error',
          title: 'Action Failed',
          message: res?.error || 'Could not deactivate client account.',
        });
      }
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Error',
        message: err?.message || 'Failed to update client account.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (clients.length === 0) {
      showToast({ type: 'warning', title: 'Export', message: 'No client records to export.' });
      return;
    }

    const headers = ['Company Name', 'Industry', 'Trade License', 'Contact Person', 'Email', 'Phone', 'Office Location', 'Contract Value (AED)', 'Payment Terms', 'Status', 'Registered Staff', 'Active Routes'];
    const rows = clients.map((c) => [
      c.companyName,
      c.industry,
      c.tradeLicenseNumber,
      `${c.contactPerson} (${c.contactTitle || ''})`,
      c.email,
      c.phone,
      c.officeLocation,
      c.contractValueAed || 0,
      c.paymentTerms || 'Net 30 Days',
      c.status,
      c.totalPassengersCount || 0,
      c.activeRoutesCount || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dubai_corporate_clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'success', title: 'Export Generated', message: 'Corporate accounts directory downloaded.' });
  };

  const totalContractAed = clients.reduce((acc, c) => acc + (c.contractValueAed || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              {isClientUser ? 'Corporate Transport Account' : 'Corporate Clients & Contracts'}
            </h1>
            <Badge variant="navy">Enterprise</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {isClientUser
              ? 'Manage your organization’s employee transportation contracts, routes, and billing details.'
              : 'Enterprise client relationships, staff transport agreements, SLAs, trade licenses, and billing terms.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadClientData(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>

          {canManage && (
            <Button size="sm" variant="primary" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Client
            </Button>
          )}
        </div>
      </div>

      {/* 2. Commercial & Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Corporate Clients</span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-heading mt-2 font-mono">
            {summary.total}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">{summary.active} Active Contracts</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Contract Bookings</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-heading mt-2 font-mono">
            {(totalContractAed / 1000000).toFixed(2)}M <span className="text-xs font-sans font-semibold">AED</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Annual Contract Volume</div>
        </div>

        <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-orange-700 font-medium">
            <span>Transported Staff</span>
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-900 font-heading mt-2 font-mono">
            {summary.totalPassengers}
          </div>
          <div className="text-[11px] text-orange-600 mt-1">Daily Commuting Employees</div>
        </div>

        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Dedicated Corridors</span>
            <RouteIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-heading mt-2 font-mono">
            {summary.activeRoutes}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Active Scheduled Routes</div>
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, trade license, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <Select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Industry Sectors' },
              { value: 'Hospitality & Hotels', label: 'Hospitality & Hotels' },
              { value: 'Aviation & Ground Handling', label: 'Aviation & Ground Handling' },
              { value: 'Construction & Engineering', label: 'Construction & Engineering' },
              { value: 'Retail & Malls Logistics', label: 'Retail & Malls' },
              { value: 'Healthcare & Hospitals', label: 'Healthcare & Medical' },
              { value: 'Logistics & Warehousing', label: 'Logistics & Freezone' },
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Account Statuses' },
              { value: 'ACTIVE', label: 'Active Contracts' },
              { value: 'PENDING', label: 'Pending Review' },
              { value: 'EXPIRED', label: 'Concluded / Expired' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'companyName', label: 'Sort by Company Name' },
              { value: 'contractValueAed', label: 'Sort by Contract Value' },
              { value: 'contractEndDate', label: 'Sort by Renewal Date' },
              { value: 'industry', label: 'Sort by Industry' },
            ]}
          />
        </div>
      </div>

      {/* 4. Clients Table */}
      {loading ? (
        <LoadingSpinner message="Loading corporate client accounts..." />
      ) : clients.length === 0 ? (
        <EmptyState
          title="No Corporate Accounts Found"
          description="No clients matched your current filter criteria. Adjust your search or register an enterprise client."
          actionLabel={canManage ? 'Register New Client' : undefined}
          onAction={canManage ? handleOpenAdd : undefined}
        />
      ) : (
        <div className="space-y-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company & Trade License</TableHead>
                <TableHead>Industry & Location</TableHead>
                <TableHead>Primary Mobility Lead</TableHead>
                <TableHead>Staff & Routes</TableHead>
                <TableHead>Contract Value (AED)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => {
                const initials = c.companyName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <TableRow key={c.id}>
                    {/* Company & Trade License */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-200">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{c.companyName}</div>
                          <div className="font-mono text-[11px] text-slate-500 font-medium">
                            {c.tradeLicenseNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Industry & Location */}
                    <TableCell>
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800">{c.industry}</span>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[170px]" title={c.officeLocation}>
                            {c.officeLocation}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Primary Contact */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium text-slate-900">{c.contactPerson}</div>
                        <div className="text-[11px] text-slate-500">{c.phone}</div>
                      </div>
                    </TableCell>

                    {/* Staff & Routes */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <Users className="w-3 h-3 text-slate-500" />
                          {c.totalPassengersCount || 0} Staff
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          <RouteIcon className="w-3 h-3 text-orange-500" />
                          {c.activeRoutesCount || 0} Routes
                        </span>
                      </div>
                    </TableCell>

                    {/* Contract Value */}
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-bold text-slate-900 font-mono">
                          {c.contractValueAed ? `${c.contractValueAed.toLocaleString()} AED` : 'N/A'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Exp: {c.contractEndDate}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(c)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Corporate Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Edit Client Account"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenDelete(c)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deactivate Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 pt-2">
            <div>
              Showing <span className="font-semibold text-slate-900">{clients.length}</span> enterprise client accounts
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Corporate SLA Monitoring Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            showToast({
              type: 'success',
              title: 'Account Saved',
              message: selectedClient
                ? `Account ${selectedClient.companyName} updated successfully.`
                : 'New corporate client registered successfully.',
            });
            loadClientData();
          }}
          client={selectedClient}
          apiFetch={apiFetch}
        />
      )}

      {/* Detail Dossier Modal */}
      {isDetailOpen && (
        <ClientDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          client={selectedClient}
          onEdit={(c) => handleOpenEdit(c)}
          apiFetch={apiFetch}
        />
      )}

      {/* Deactivate Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Deactivate Account: ${clientToDelete?.companyName}?`}
        description="This will set the corporate account status to INACTIVE."
        maxWidth="md"
      >
        <div className="space-y-4 pt-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
            <p className="font-semibold mb-1">Notice:</p>
            <p>
              Deactivating this corporate client will not delete their passenger records, but active
              route dispatching may be flagged for review.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleteLoading}
              onClick={handleConfirmDeactivate}
            >
              Deactivate Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
