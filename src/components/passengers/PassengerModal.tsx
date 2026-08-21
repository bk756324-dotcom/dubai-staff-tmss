import React, { useState, useEffect } from 'react';
import { Passenger, Client, Route, PassengerStatus } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import { Users, Building2, MapPin, Clock, CreditCard, Phone, ShieldCheck } from 'lucide-react';

interface PassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  passenger?: Passenger | null;
  availableClients: Client[];
  availableRoutes: Route[];
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  userCompanyId?: string; // If user is CLIENT
}

export const PassengerModal: React.FC<PassengerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  passenger,
  availableClients,
  availableRoutes,
  apiFetch,
  userCompanyId,
}) => {
  const isEdit = Boolean(passenger);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    phone: '',
    email: '',
    clientId: userCompanyId || (availableClients[0]?.id || ''),
    department: 'Operations',
    pickupPoint: '',
    pickupTime: '06:30 AM',
    dropPoint: '',
    dropTime: '07:45 AM',
    routeId: '',
    shift: 'MORNING' as 'MORNING' | 'EVENING' | 'NIGHT' | 'CUSTOM',
    status: 'ACTIVE' as PassengerStatus,
    rfidCardNumber: '',
    emergencyContact: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (passenger) {
      setFormData({
        employeeId: passenger.employeeId || '',
        name: passenger.name || '',
        phone: passenger.phone || '',
        email: passenger.email || '',
        clientId: passenger.clientId || userCompanyId || (availableClients[0]?.id || ''),
        department: passenger.department || 'Operations',
        pickupPoint: passenger.pickupPoint || '',
        pickupTime: passenger.pickupTime || '06:30 AM',
        dropPoint: passenger.dropPoint || '',
        dropTime: passenger.dropTime || '07:45 AM',
        routeId: passenger.routeId || '',
        shift: passenger.shift || 'MORNING',
        status: passenger.status || 'ACTIVE',
        rfidCardNumber: passenger.rfidCardNumber || '',
        emergencyContact: passenger.emergencyContact || '',
      });
    } else {
      const defaultClient = userCompanyId
        ? userCompanyId
        : availableClients[0]?.id || '';

      setFormData({
        employeeId: `EMP-${Math.floor(500 + Math.random() * 500)}`,
        name: '',
        phone: '+971 50 ',
        email: '',
        clientId: defaultClient,
        department: 'Operations & Ground Staff',
        pickupPoint: 'Al Quoz Worker Community, Gate 2',
        pickupTime: '06:15 AM',
        dropPoint: 'Dubai Airport Cargo Terminal 3',
        dropTime: '07:30 AM',
        routeId: availableRoutes[0]?.id || '',
        shift: 'MORNING',
        status: 'ACTIVE',
        rfidCardNumber: `RFID-DXB-${Math.floor(10000 + Math.random() * 90000)}`,
        emergencyContact: '+971 50 987 6543',
      });
    }
    setErrorMessage(null);
  }, [passenger, isOpen, availableClients, availableRoutes, userCompanyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.employeeId.trim() || !formData.name.trim() || !formData.phone.trim() || !formData.clientId) {
      setErrorMessage('Employee ID, Staff Name, Phone number, and Client Company are required.');
      return;
    }

    if (!formData.pickupPoint.trim() || !formData.dropPoint.trim()) {
      setErrorMessage('Pickup Location and Drop-off Location are required.');
      return;
    }

    try {
      setLoading(true);
      const url = isEdit ? `/api/passengers/${passenger?.id}` : '/api/passengers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          routeId: formData.routeId || null,
        }),
      });

      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res?.error || 'Failed to save passenger record.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server error occurred while processing passenger.');
    } finally {
      setLoading(false);
    }
  };

  const clientOptions = availableClients.map((c) => ({
    value: c.id,
    label: `${c.companyName} (${c.industry})`,
  }));

  const filteredRoutes = formData.clientId
    ? availableRoutes.filter((r) => !r.clientId || r.clientId === formData.clientId)
    : availableRoutes;

  const routeOptions = [
    { value: '', label: '-- Flexible Corridor / Unassigned Route --' },
    ...filteredRoutes.map((r) => ({
      value: r.id,
      label: `${r.routeCode} - ${r.routeName} (${r.origin} → ${r.destination})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Passenger: ${passenger?.name}` : 'Enroll Employee Passenger'}
      description="Register employee commute manifest, RFID boarding credentials, and pickup schedule."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <Alert variant="danger" title="Validation Error">
            {errorMessage}
          </Alert>
        )}

        {/* Section 1: Staff Identification */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Users className="w-4 h-4 text-orange-500" />
            <span>Employee Profile & Corporate Organization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Staff Employee ID *"
              placeholder="e.g. EMP-502"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Full Employee Name *"
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Select
              label="Corporate Client / Employer *"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              options={clientOptions}
              disabled={Boolean(userCompanyId)}
            />
            <Input
              label="Department / Unit"
              placeholder="e.g. Ground Operations"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              label="Mobile Phone (UAE) *"
              placeholder="+971 50 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Section 2: Commute Route & Stops */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>Commute Itinerary & Scheduled Stops</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Input
                label="Pickup Landmark / Community *"
                placeholder="e.g. Al Quoz Community Gate 2 / Deira Metro"
                value={formData.pickupPoint}
                onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
                required
              />
            </div>
            <Input
              label="Pickup Time *"
              placeholder="e.g. 06:15 AM"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div className="md:col-span-2">
              <Input
                label="Drop-off Destination / Facility *"
                placeholder="e.g. Dubai Airport Terminal 3 Cargo / JAFZA 4"
                value={formData.dropPoint}
                onChange={(e) => setFormData({ ...formData, dropPoint: e.target.value })}
                required
              />
            </div>
            <Input
              label="Drop-off Time *"
              placeholder="e.g. 07:30 AM"
              value={formData.dropTime}
              onChange={(e) => setFormData({ ...formData, dropTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <Select
              label="Dedicated Transport Route"
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              options={routeOptions}
            />
            <Select
              label="Work Shift"
              value={formData.shift}
              onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
              options={[
                { value: 'MORNING', label: 'Morning Shift (06:00 - 15:00)' },
                { value: 'EVENING', label: 'Evening Shift (14:00 - 23:00)' },
                { value: 'NIGHT', label: 'Night Shift (22:00 - 07:00)' },
                { value: 'CUSTOM', label: 'Custom / Flexible Roster' },
              ]}
            />
          </div>
        </div>

        {/* Section 3: RFID Smart Boarding & Status */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>Smart RFID Boarding Card & Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="RFID Boarding Card Number"
              placeholder="e.g. RFID-DXB-98421"
              value={formData.rfidCardNumber}
              onChange={(e) => setFormData({ ...formData, rfidCardNumber: e.target.value })}
            />
            <Input
              label="Emergency Contact Phone"
              placeholder="+971 50 987 6543"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
            <Select
              label="Passenger Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as PassengerStatus })}
              options={[
                { value: 'ACTIVE', label: 'ACTIVE (Daily Commuter)' },
                { value: 'ON_LEAVE', label: 'ON_LEAVE (Temporary Off)' },
                { value: 'INACTIVE', label: 'INACTIVE (Offboarded)' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Passenger Changes' : 'Enroll Passenger'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
