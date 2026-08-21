import React, { useState, useEffect } from 'react';
import { X, FileCheck2, Bus, UserCheck, Building2, Calendar, ShieldCheck, AlertTriangle, UploadCloud } from 'lucide-react';
import { useToast } from '../../context/ToastContext.js';
import { DocumentType, DocumentEntityType } from '../../types/index.js';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();

  const [entityType, setEntityType] = useState<DocumentEntityType>('VEHICLE');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'MULKIYA_REGISTRATION' as DocumentType,
    documentNumber: '',
    entityId: '',
    issuingAuthority: 'RTA Dubai (Roads & Transport Authority)',
    issueDate: '2025-09-01',
    expiryDate: '2027-08-31',
    fileUrl: '/docs/rta-permit-certified.pdf',
    notes: 'Official digital document registered with RTA Dubai & Tasjeel Licensing Gateway.',
  });

  useEffect(() => {
    if (isOpen) {
      // Load vehicles, drivers, clients for dropdowns
      Promise.all([
        fetch('/api/vehicles').then((r) => r.json()),
        fetch('/api/drivers').then((r) => r.json()),
        fetch('/api/clients').then((r) => r.json()),
      ])
        .then(([vData, dData, cData]) => {
          if (vData.success) {
            setVehicles(vData.data || []);
            if (vData.data?.length > 0 && entityType === 'VEHICLE' && !formData.entityId) {
              setFormData((prev) => ({ ...prev, entityId: vData.data[0].id }));
            }
          }
          if (dData.success) setDrivers(dData.data || []);
          if (cData.success) setClients(cData.data || []);
        })
        .catch((err) => console.error('Error fetching entities for document upload:', err));
    }
  }, [isOpen, entityType]);

  if (!isOpen) return null;

  const handleEntityTypeChange = (type: DocumentEntityType) => {
    setEntityType(type);
    let defaultDocType: DocumentType = 'MULKIYA_REGISTRATION';
    let defaultAuth = 'RTA Dubai (Roads & Transport Authority)';
    let entityId = '';

    if (type === 'VEHICLE') {
      defaultDocType = 'MULKIYA_REGISTRATION';
      defaultAuth = 'RTA Dubai (Roads & Transport Authority)';
      entityId = vehicles[0]?.id || '';
    } else if (type === 'DRIVER') {
      defaultDocType = 'RTA_DRIVER_PERMIT';
      defaultAuth = 'RTA Commercial Driver Licensing';
      entityId = drivers[0]?.id || '';
    } else if (type === 'CORPORATE') {
      defaultDocType = 'TRADE_LICENSE';
      defaultAuth = 'Dubai Economy & Tourism (DET)';
      entityId = clients[0]?.id || '';
    }

    setFormData({
      ...formData,
      documentType: defaultDocType,
      issuingAuthority: defaultAuth,
      entityId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.documentNumber || !formData.expiryDate) {
      toast.error('Validation Error', 'Please provide a document number and expiry date.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          entityType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Document Registered', data.message || 'Document registered successfully.');
        onSuccess();
        onClose();
      } else {
        toast.error('Registration Failed', data.error || 'Failed to register document.');
      }
    } catch (err) {
      toast.error('Network Error', 'Network error registering document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Register Compliance Document</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add official RTA permits, Mulkiya registrations, driver licenses, and insurance policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entity Type Selector Tabs */}
        <div className="px-5 pt-4 flex gap-2">
          {(['VEHICLE', 'DRIVER', 'CORPORATE'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleEntityTypeChange(type)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                entityType === type
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {type === 'VEHICLE' && <Bus className="w-3.5 h-3.5" />}
              {type === 'DRIVER' && <UserCheck className="w-3.5 h-3.5" />}
              {type === 'CORPORATE' && <Building2 className="w-3.5 h-3.5" />}
              <span>{type === 'VEHICLE' ? 'Vehicle Document' : type === 'DRIVER' ? 'Driver Credential' : 'Corporate Contract'}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entity Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Associated {entityType === 'VEHICLE' ? 'Vehicle' : entityType === 'DRIVER' ? 'Captain' : 'Client Organization'} *
              </label>
              <select
                value={formData.entityId}
                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                {entityType === 'VEHICLE' &&
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.make} {v.model}) [{v.registrationNumber || 'DXB'}]
                    </option>
                  ))}

                {entityType === 'DRIVER' &&
                  drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.driverCode || 'CAP'}) [{d.licenseCategory}]
                    </option>
                  ))}

                {entityType === 'CORPORATE' &&
                  clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName} ({c.contractType || 'ANNUAL'})
                    </option>
                  ))}
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Document Classification *
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {entityType === 'VEHICLE' && (
                  <>
                    <option value="MULKIYA_REGISTRATION">Mulkiya (Vehicle Registration Card)</option>
                    <option value="COMMERCIAL_INSURANCE">Comprehensive Commercial Insurance</option>
                    <option value="RTA_PERMIT">RTA Passenger Transport Permit</option>
                    <option value="EMISSION_CERTIFICATE">Civil Defense & Emission Safety Certificate</option>
                    <option value="OTHER">Other Vehicle Certificate</option>
                  </>
                )}

                {entityType === 'DRIVER' && (
                  <>
                    <option value="RTA_DRIVER_PERMIT">RTA Commercial Bus Driver Card</option>
                    <option value="HEAVY_BUS_LICENSE">UAE Heavy Bus Driving License (Cat 6)</option>
                    <option value="EMIRATES_ID">Emirates ID (ICA Verified)</option>
                    <option value="MEDICAL_FITNESS">Occupational Medical Fitness Certificate</option>
                    <option value="POLICE_CLEARANCE">Dubai Police Good Conduct Certificate</option>
                    <option value="OTHER">Other Driver Credential</option>
                  </>
                )}

                {entityType === 'CORPORATE' && (
                  <>
                    <option value="TRADE_LICENSE">DED Commercial Trade License</option>
                    <option value="COMMERCIAL_INSURANCE">Corporate Liability Master Insurance</option>
                    <option value="OTHER">Service Level Agreement (SLA)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Official Document / Certificate # *
              </label>
              <input
                type="text"
                placeholder="e.g. RTA-DXB-2026-88491"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Issuing Authority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issuing Regulatory Authority *
              </label>
              <input
                type="text"
                placeholder="e.g. RTA Dubai / Dubai Police / Tasjeel"
                value={formData.issuingAuthority}
                onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Issue Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date of Issue *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expiry / Renewal Deadline *
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* File Upload Attachment Placeholder */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Digital Document File Attachment
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors">
              <UploadCloud className="w-7 h-7 text-orange-500 mb-1" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to attach digital PDF or high-res scan
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                RTA QR-coded PDF, JPEG, or PNG (Max 15MB)
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Compliance Remarks / Endorsements
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Registering Document...' : 'Save & Register Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
