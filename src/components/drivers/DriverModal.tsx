import React, { useState, useEffect } from 'react';
import { Driver, Vehicle, Route, DriverStatus } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import { UserCheck, ShieldCheck, Phone, HeartPulse, FileText } from 'lucide-react';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  driver?: Driver | null;
  availableVehicles: Vehicle[];
  availableRoutes: Route[];
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  driver,
  availableVehicles,
  availableRoutes,
  apiFetch,
}) => {
  const isEdit = Boolean(driver);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseCategory: 'Heavy Bus (Category 6)',
    licenseExpiry: '',
    rtaCardNumber: '',
    rtaCardExpiry: '',
    visaExpiry: '',
    medicalFitnessExpiry: '',
    status: 'AVAILABLE' as DriverStatus,
    assignedVehicleId: '',
    assignedRouteId: '',
    joiningDate: '',
    emergencyContact: {
      name: '',
      relationship: 'Family Member',
      phone: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (driver) {
      setFormData({
        employeeId: driver.employeeId || '',
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        licenseNumber: driver.licenseNumber || '',
        licenseCategory: driver.licenseCategory || 'Heavy Bus (Category 6)',
        licenseExpiry: driver.licenseExpiry || '',
        rtaCardNumber: driver.rtaCardNumber || '',
        rtaCardExpiry: driver.rtaCardExpiry || '',
        visaExpiry: driver.visaExpiry || '',
        medicalFitnessExpiry: driver.medicalFitnessExpiry || '',
        status: driver.status || 'AVAILABLE',
        assignedVehicleId: driver.assignedVehicleId || '',
        assignedRouteId: driver.assignedRouteId || '',
        joiningDate: driver.joiningDate || '',
        emergencyContact: {
          name: driver.emergencyContact?.name || '',
          relationship: driver.emergencyContact?.relationship || 'Family Member',
          phone: driver.emergencyContact?.phone || '',
        },
      });
    } else {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];

      const twoYears = new Date();
      twoYears.setFullYear(twoYears.getFullYear() + 2);
      const twoYearsStr = twoYears.toISOString().split('T')[0];

      const todayStr = new Date().toISOString().split('T')[0];

      setFormData({
        employeeId: `DRV-${Math.floor(200 + Math.random() * 800)}`,
        name: '',
        phone: '+971 50 ',
        email: '',
        licenseNumber: `DXB-LIC-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseCategory: 'Heavy Bus (Category 6)',
        licenseExpiry: twoYearsStr,
        rtaCardNumber: `RTA-DRV-${Math.floor(10000 + Math.random() * 90000)}`,
        rtaCardExpiry: nextYearStr,
        visaExpiry: twoYearsStr,
        medicalFitnessExpiry: nextYearStr,
        status: 'AVAILABLE',
        assignedVehicleId: '',
        assignedRouteId: '',
        joiningDate: todayStr,
        emergencyContact: {
          name: '',
          relationship: 'Spouse / Brother',
          phone: '+971 50 ',
        },
      });
    }
    setErrorMessage(null);
  }, [driver, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!formData.employeeId.trim() || !formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Employee ID, Captain Name, and Contact Phone number are required.');
      return;
    }
    if (!formData.licenseNumber.trim() || !formData.licenseExpiry) {
      setErrorMessage('UAE Driving License Number and Expiry Date are mandatory.');
      return;
    }

    try {
      setLoading(true);
      const url = isEdit ? `/api/drivers/${driver?.id}` : '/api/drivers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          assignedVehicleId: formData.assignedVehicleId || null,
          assignedRouteId: formData.assignedRouteId || null,
        }),
      });

      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res?.error || 'Failed to save driver captain record.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server error occurred while processing driver.');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'AVAILABLE', label: 'AVAILABLE (On Duty / Ready)' },
    { value: 'ON_TRIP', label: 'ON_TRIP (Driving Route)' },
    { value: 'OFF_DUTY', label: 'OFF_DUTY (Rest Period)' },
    { value: 'ON_LEAVE', label: 'ON_LEAVE (Annual Leave)' },
    { value: 'INACTIVE', label: 'INACTIVE (Offboarded / Suspended)' },
  ];

  const licenseCategoryOptions = [
    { value: 'Heavy Bus (Category 6)', label: 'Heavy Bus (Category 6) — 50+ Passengers' },
    { value: 'Light Bus (Category 5)', label: 'Light Bus (Category 5) — Up to 26 Passengers' },
    { value: 'Heavy Truck / Articulated', label: 'Heavy Truck (Category 4)' },
    { value: 'Light Vehicle (Category 3)', label: 'Light Vehicle (Category 3)' },
  ];

  const vehicleOptions = [
    { value: '', label: '-- Unassigned (Available in Crew Pool) --' },
    ...availableVehicles.map((v) => ({
      value: v.id,
      label: `${v.vehicleNumber} (${v.make} ${v.model} - ${v.capacity} Seats) [Plate: ${v.registrationNumber}]`,
    })),
  ];

  const routeOptions = [
    { value: '', label: '-- Flexible Dispatch (No Fixed Route) --' },
    ...availableRoutes.map((r) => ({
      value: r.id,
      label: `${r.routeCode} - ${r.routeName} (${r.origin} → ${r.destination})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Driver Captain: ${driver?.name}` : 'Enroll New Driver Captain'}
      description="Register UAE Heavy Bus credentials, RTA Card, Visa compliance, and fleet allocations."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <Alert variant="danger" title="Validation Error">
            {errorMessage}
          </Alert>
        )}

        {/* Section 1: Captain Personal & Contact Info */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <UserCheck className="w-4 h-4 text-orange-500" />
            <span>Captain Identification & Contact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Employee ID *"
              placeholder="e.g. DRV-205"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              required
            />
            <Input
              label="Full Name (as per Passport/Visa) *"
              placeholder="e.g. Tariq Mehmood"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Mobile Phone (UAE) *"
              placeholder="+971 50 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="captain@dubaitransport.ae"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            />
            <Select
              label="Duty Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Section 2: UAE License & RTA Compliance */}
        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>RTA Driver Permit & UAE Driving License</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="UAE Driving License No. *"
              placeholder="e.g. DXB-LIC-582910"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
            <Select
              label="License Category *"
              value={formData.licenseCategory}
              onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
              options={licenseCategoryOptions}
            />
            <Input
              label="License Expiry Date *"
              type="date"
              value={formData.licenseExpiry}
              onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input
              label="RTA Heavy Bus Permit No."
              placeholder="e.g. RTA-DRV-7721"
              value={formData.rtaCardNumber}
              onChange={(e) => setFormData({ ...formData, rtaCardNumber: e.target.value })}
            />
            <Input
              label="RTA Permit Expiry Date"
              type="date"
              value={formData.rtaCardExpiry}
              onChange={(e) => setFormData({ ...formData, rtaCardExpiry: e.target.value })}
            />
            <Input
              label="UAE Residence Visa Expiry"
              type="date"
              value={formData.visaExpiry}
              onChange={(e) => setFormData({ ...formData, visaExpiry: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <Input
              label="DHA/MOH Medical Fitness Expiry"
              type="date"
              value={formData.medicalFitnessExpiry}
              onChange={(e) => setFormData({ ...formData, medicalFitnessExpiry: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Fleet & Route Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            label="Assigned Dedicated Bus"
            value={formData.assignedVehicleId}
            onChange={(e) => setFormData({ ...formData, assignedVehicleId: e.target.value })}
            options={vehicleOptions}
          />
          <Select
            label="Assigned Primary Route"
            value={formData.assignedRouteId}
            onChange={(e) => setFormData({ ...formData, assignedRouteId: e.target.value })}
            options={routeOptions}
          />
        </div>

        {/* Section 4: Emergency Contact */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Emergency Contact Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Contact Person Name"
              placeholder="e.g. Farhan Mehmood"
              value={formData.emergencyContact.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                })
              }
            />
            <Input
              label="Relationship"
              placeholder="e.g. Brother / Spouse"
              value={formData.emergencyContact.relationship}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, relationship: e.target.value },
                })
              }
            />
            <Input
              label="Emergency Phone"
              placeholder="+971 50 987 6543"
              value={formData.emergencyContact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Captain Profile' : 'Enroll Driver Captain'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
