import React, { useState, useEffect } from 'react';
import { Client, ClientStatus } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import { Building2, FileText, Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: Client | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  client,
  apiFetch,
}) => {
  const isEdit = Boolean(client);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'Hospitality & Hotels',
    tradeLicenseNumber: '',
    contactPerson: '',
    contactTitle: 'Transport Coordinator',
    email: '',
    phone: '',
    officeLocation: '',
    contractStartDate: '',
    contractEndDate: '',
    contractValueAed: 250000,
    paymentTerms: 'Net 30 Days',
    status: 'ACTIVE' as ClientStatus,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setFormData({
        companyName: client.companyName || '',
        industry: client.industry || 'Hospitality & Hotels',
        tradeLicenseNumber: client.tradeLicenseNumber || '',
        contactPerson: client.contactPerson || '',
        contactTitle: client.contactTitle || 'Transport Coordinator',
        email: client.email || '',
        phone: client.phone || '',
        officeLocation: client.officeLocation || '',
        contractStartDate: client.contractStartDate || '',
        contractEndDate: client.contractEndDate || '',
        contractValueAed: client.contractValueAed || 0,
        paymentTerms: client.paymentTerms || 'Net 30 Days',
        status: client.status || 'ACTIVE',
      });
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];

      setFormData({
        companyName: '',
        industry: 'Hospitality & Hotels',
        tradeLicenseNumber: `TL-DXB-${Math.floor(100000 + Math.random() * 900000)}`,
        contactPerson: '',
        contactTitle: 'HR & Mobility Director',
        email: '',
        phone: '+971 4 ',
        officeLocation: 'Business Bay / Downtown Dubai',
        contractStartDate: todayStr,
        contractEndDate: nextYearStr,
        contractValueAed: 360000,
        paymentTerms: 'Net 30 Days',
        status: 'ACTIVE',
      });
    }
    setErrorMessage(null);
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.companyName.trim() || !formData.contactPerson.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Company Name, Primary Contact Person, Email, and Phone number are required.');
      return;
    }

    try {
      setLoading(true);
      const url = isEdit ? `/api/clients/${client?.id}` : '/api/clients';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contractValueAed: Number(formData.contractValueAed),
        }),
      });

      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res?.error || 'Failed to save corporate client account.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server error occurred while processing corporate client.');
    } finally {
      setLoading(false);
    }
  };

  const industryOptions = [
    { value: 'Hospitality & Hotels', label: 'Hospitality & Hotels' },
    { value: 'Aviation & Ground Handling', label: 'Aviation & Ground Handling (DXB/DWC)' },
    { value: 'Construction & Engineering', label: 'Construction & Infrastructure' },
    { value: 'Retail & Malls Logistics', label: 'Retail & Shopping Malls' },
    { value: 'Healthcare & Hospitals', label: 'Healthcare & Medical Centers' },
    { value: 'Logistics & Warehousing', label: 'Logistics & JAFZA Freezone' },
    { value: 'Financial & Corporate HQ', label: 'Banking & Financial Services' },
    { value: 'Education & Schools', label: 'Educational Institutions' },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'ACTIVE (Contract In Service)' },
    { value: 'PENDING', label: 'PENDING (Draft / Under Review)' },
    { value: 'EXPIRED', label: 'EXPIRED (Contract Concluded)' },
    { value: 'INACTIVE', label: 'INACTIVE (Suspended)' },
  ];

  const paymentTermsOptions = [
    { value: 'Net 30 Days', label: 'Net 30 Days' },
    { value: 'Net 60 Days', label: 'Net 60 Days' },
    { value: 'Quarterly Advance', label: 'Quarterly In Advance' },
    { value: 'Monthly In Advance', label: 'Monthly In Advance' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Corporate Client: ${client?.companyName}` : 'Register New Corporate Client'}
      description="Create enterprise contract profile, billing terms, and staff transport quota."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <Alert variant="danger" title="Validation Error">
            {errorMessage}
          </Alert>
        )}

        {/* Section 1: Corporate Profile */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Building2 className="w-4 h-4 text-orange-500" />
            <span>Company Identification & Trade License</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                label="Company Legal Name *"
                placeholder="e.g. Emaar Hospitality Group LLC"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <Input
              label="Dubai Trade License No. *"
              placeholder="e.g. TL-DXB-984210"
              value={formData.tradeLicenseNumber}
              onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Select
              label="Industry Sector *"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              options={industryOptions}
            />
            <Input
              label="Office / Facility Location *"
              placeholder="e.g. Downtown Dubai, Emaar Square 3"
              value={formData.officeLocation}
              onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Section 2: Primary Contact Person */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Phone className="w-4 h-4 text-orange-500" />
            <span>Key Account Contact & Mobility Lead</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Contact Person Name *"
              placeholder="e.g. Sarah Jenkins"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
            <Input
              label="Designation / Title"
              placeholder="e.g. Head of Human Resources"
              value={formData.contactTitle}
              onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Input
              label="Official Email *"
              type="email"
              placeholder="transport@company.ae"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number *"
              placeholder="+971 4 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Section 3: Contract & Commercials */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Contract Terms & Commercial Value</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Contract Start Date *"
              type="date"
              value={formData.contractStartDate}
              onChange={(e) => setFormData({ ...formData, contractStartDate: e.target.value })}
              required
            />
            <Input
              label="Contract End Date *"
              type="date"
              value={formData.contractEndDate}
              onChange={(e) => setFormData({ ...formData, contractEndDate: e.target.value })}
              required
            />
            <Input
              label="Annual Contract Value (AED)"
              type="number"
              value={formData.contractValueAed}
              onChange={(e) => setFormData({ ...formData, contractValueAed: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Select
              label="Payment Terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={paymentTermsOptions}
            />
            <Select
              label="Account Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Account Changes' : 'Register Corporate Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
