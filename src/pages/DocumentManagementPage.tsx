import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bus,
  UserCheck,
  Building2,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Shield,
  FileText,
} from 'lucide-react';
import { DocumentRecord, DocumentEntityType } from '../types/index.js';
import { UploadDocumentModal } from '../components/documents/UploadDocumentModal.js';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal.js';
import { useToast } from '../context/ToastContext.js';
import { useI18n } from '../context/I18nContext.js';

interface DocumentManagementPageProps {
  navigate: (path: string) => void;
}

export const DocumentManagementPage: React.FC<DocumentManagementPageProps> = ({ navigate }) => {
  const { t } = useI18n();
  const toast = useToast();

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTab, setEntityTab] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (entityTab !== 'ALL') params.append('entityType', entityTab);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery) params.append('q', searchQuery);

      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [entityTab, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this compliance document?')) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.info('Document Deleted', 'Document record deleted.');
        fetchDocuments();
      }
    } catch (err) {
      toast.error('Delete Failed', 'Error deleting document.');
    }
  };

  const handleExportCsv = () => {
    if (documents.length === 0) {
      toast.info('No Data', 'No documents to export.');
      return;
    }

    const headers = [
      'Document ID',
      'Title / Classification',
      'Document Number',
      'Entity Type',
      'Entity Name',
      'Issuing Authority',
      'Issue Date',
      'Expiry Date',
      'Days Remaining',
      'Status',
    ];

    const rows = documents.map((d) => [
      d.id,
      `"${d.title || d.documentType}"`,
      d.documentNumber,
      d.entityType,
      `"${d.entityName || ''}"`,
      `"${d.issuingAuthority || ''}"`,
      d.issueDate,
      d.expiryDate,
      d.daysUntilExpiry ?? '—',
      d.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Dubai_Compliance_Documents_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit Report Exported', 'Compliance audit report exported.');
  };

  return (
    <div id="document-management-page" className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4 text-orange-500" />
            <span>{t('document_vault', 'Regulatory Repository')}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('document_management', 'Compliance Documents & RTA Permits')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Central repository for vehicle Mulkiya cards, commercial insurance, heavy bus driver licenses, and corporate SLAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit CSV</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Document</span>
          </button>
        </div>
      </div>

      {/* 6 Key Document Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Documents</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            {summary?.total || documents.length}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1 font-medium">
            Active Vault Files
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Valid & Compliant</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {summary?.valid || 0}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-auto pt-1">
            Fully Certified
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expiring Soon (≤30d)</span>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
            {summary?.expiringSoon || 0}
          </div>
          <span className="text-[11px] text-amber-500 dark:text-amber-400 mt-auto pt-1 font-semibold">
            Action Required
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expired</span>
          <div className="text-2xl font-black text-rose-500 mt-1 font-mono">
            {summary?.expired || 0}
          </div>
          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-auto pt-1 font-semibold">
            Breach Alert
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vehicle Permits</span>
          <div className="text-2xl font-black text-sky-500 mt-1 font-mono">
            {summary?.vehicleDocs || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            Mulkiya & Ins.
          </span>
        </div>

        <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Driver Licenses</span>
          <div className="text-2xl font-black text-purple-500 mt-1 font-mono">
            {summary?.driverDocs || 0}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-auto pt-1">
            RTA & Medical
          </span>
        </div>
      </div>

      {/* Entity Tabs and Filter Bar */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            { id: 'ALL', label: 'All Vault Records', icon: FileText },
            { id: 'VEHICLE', label: 'Vehicles', icon: Bus },
            { id: 'DRIVER', label: 'Driver Captains', icon: UserCheck },
            { id: 'CORPORATE', label: 'Corporate Clients', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setEntityTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  entityTab === tab.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search document #, authority, plate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </form>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Expiry Statuses</option>
            <option value="VALID">Valid</option>
            <option value="EXPIRING_SOON">Expiring Soon (≤ 30 Days)</option>
            <option value="EXPIRED">Expired</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setEntityTab('ALL');
              setStatusFilter('ALL');
              fetchDocuments();
            }}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Document / Type</th>
                <th className="py-3 px-4">Entity Owner</th>
                <th className="py-3 px-4">Certificate #</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Validity Remaining</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileCheck2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No documents found matching filters.</p>
                    <p className="text-[11px] mt-0.5">Click "Register Document" to add official permits.</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => {
                  const isExpired = doc.status === 'EXPIRED';
                  const isExpiringSoon = doc.status === 'EXPIRING_SOON';

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoc(doc);
                        setIsPreviewOpen(true);
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                            {doc.entityType === 'VEHICLE' && <Bus className="w-4 h-4" />}
                            {doc.entityType === 'DRIVER' && <UserCheck className="w-4 h-4" />}
                            {doc.entityType === 'CORPORATE' && <Building2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {doc.title || doc.documentType.replace(/_/g, ' ')}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {doc.documentType.replace(/_/g, ' ')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {doc.entityName || doc.entityId}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {doc.documentNumber}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                        {doc.issuingAuthority}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {doc.expiryDate}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={`${
                            isExpired
                              ? 'text-rose-500'
                              : isExpiringSoon
                              ? 'text-amber-500'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {doc.daysUntilExpiry !== undefined
                            ? doc.daysUntilExpiry <= 0
                              ? `Expired (${Math.abs(doc.daysUntilExpiry)}d ago)`
                              : `${doc.daysUntilExpiry} days`
                            : '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isExpired
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                              : isExpiringSoon
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {isExpired && <AlertTriangle className="w-3 h-3" />}
                          {isExpiringSoon && <Clock className="w-3 h-3" />}
                          {!isExpired && !isExpiringSoon && <CheckCircle2 className="w-3 h-3" />}
                          <span>{doc.status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(doc);
                              setIsPreviewOpen(true);
                            }}
                            className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect Permit"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(doc.id, e)}
                            className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={fetchDocuments}
      />

      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
