import React, { useState, useEffect } from 'react';
import { Vehicle, Driver, Route, VehicleType, VehicleStatus } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Input } from '../ui/Input.js';
import { Select } from '../ui/Select.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import { Bus, Calendar, ShieldCheck, Wrench } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vehicle?: Vehicle | null; // If null, mode is Add; otherwise Edit
  availableDrivers: Driver[];
  availableRoutes: Route[];
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
  availableDrivers,
  availableRoutes,
  apiFetch,
}) => {
  const isEdit = Boolean(vehicle);

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    registrationNumber: '',
    plateCategory: 'Dubai Private Transport',
    vehicleType: 'COASTER' as VehicleType,
    make: 'Toyota',
    model: 'Coaster 30-Seater',
    year: new Date().getFullYear(),
    capacity: 30,
    status: 'AVAILABLE' as VehicleStatus,
    assignedDriverId: '',
    currentRouteId: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    rtaPermitExpiry: '',
    nextMaintenanceDate: '',
    currentMileageKm: 15000,
    fuelType: 'DIESEL' as 'DIESEL' | 'PETROL' | 'EV',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or reset form
  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        registrationNumber: vehicle.registrationNumber || '',
        plateCategory: vehicle.plateCategory || 'Dubai Private Transport',
        vehicleType: vehicle.vehicleType || 'COASTER',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || new Date().getFullYear(),
        capacity: vehicle.capacity || 30,
        status: vehicle.status || 'AVAILABLE',
        assignedDriverId: vehicle.assignedDriverId || '',
        currentRouteId: vehicle.currentRouteId || '',
        insuranceExpiry: vehicle.insuranceExpiry || '',
        registrationExpiry: vehicle.registrationExpiry || '',
        rtaPermitExpiry: vehicle.rtaPermitExpiry || '',
        nextMaintenanceDate: vehicle.nextMaintenanceDate || '',
        currentMileageKm: vehicle.currentMileageKm || 0,
        fuelType: vehicle.fuelType || 'DIESEL',
      });
    } else {
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];

      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 3);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];

      setFormData({
        vehicleNumber: `BUS-${Math.floor(100 + Math.random() * 900)}`,
        registrationNumber: `DXB-L-${Math.floor(10000 + Math.random() * 90000)}`,
        plateCategory: 'Dubai Private Transport',
        vehicleType: 'COASTER',
        make: 'Toyota',
        model: 'Coaster Standard',
        year: 2024,
        capacity: 30,
        status: 'AVAILABLE',
        assignedDriverId: '',
        currentRouteId: '',
        insuranceExpiry: nextYearStr,
        registrationExpiry: nextYearStr,
        rtaPermitExpiry: nextYearStr,
        nextMaintenanceDate: nextMonthStr,
        currentMileageKm: 25000,
        fuelType: 'DIESEL',
      });
    }
    setErrorMessage(null);
  }, [vehicle, isOpen]);

  // Adjust default capacity when vehicle type changes in Add mode
  const handleTypeChange = (type: VehicleType) => {
    let cap = 30;
    let make = 'Toyota';
    let model = 'Coaster';
    if (type === 'STANDARD_BUS') {
      cap = 50;
      make = 'Ashok Leyland';
      model = 'Falcon 50-Seater';
    } else if (type === 'LUXURY_COACH') {
      cap = 45;
      make = 'Mercedes-Benz';
      model = 'Tourismo Coach';
    } else if (type === 'HIACE_VAN') {
      cap = 14;
      make = 'Toyota';
      model = 'HiAce Commuter';
    } else if (type === 'MINIBUS') {
      cap = 22;
      make = 'Nissan';
      model = 'Civilian 22-Seater';
    } else if (type === 'EXECUTIVE_VAN') {
      cap = 8;
      make = 'Mercedes-Benz';
      model = 'V-Class Executive';
    }

    setFormData((prev) => ({
      ...prev,
      vehicleType: type,
      capacity: cap,
      make: isEdit ? prev.make : make,
      model: isEdit ? prev.model : model,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client validations
    if (!formData.vehicleNumber.trim()) {
      setErrorMessage('Vehicle fleet identifier (e.g. BUS-101) is required.');
      return;
    }
    if (!formData.registrationNumber.trim()) {
      setErrorMessage('Dubai registration plate number (e.g. DXB-K-54219) is required.');
      return;
    }
    if (formData.capacity <= 0) {
      setErrorMessage('Seating capacity must be at least 1 seat.');
      return;
    }
    if (!formData.insuranceExpiry || !formData.registrationExpiry) {
      setErrorMessage('Insurance and Mulkiya registration expiry dates are required for RTA compliance.');
      return;
    }

    try {
      setLoading(true);
      const url = isEdit ? `/api/vehicles/${vehicle?.id}` : '/api/vehicles';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          capacity: Number(formData.capacity),
          currentMileageKm: Number(formData.currentMileageKm),
          assignedDriverId: formData.assignedDriverId || null,
          currentRouteId: formData.currentRouteId || null,
        }),
      });

      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMessage(res?.error || 'Operation failed. Please check inputs and try again.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server error occurred while saving vehicle.');
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypeOptions = [
    { value: 'COASTER', label: '30-Seater Coaster Bus' },
    { value: 'STANDARD_BUS', label: '50-Seater Heavy Bus (Labor / Staff)' },
    { value: 'LUXURY_COACH', label: '45-Seater Executive Tourism Coach' },
    { value: 'HIACE_VAN', label: '14-Seater HiAce Commuter Van' },
    { value: 'MINIBUS', label: '22-Seater Mid-Bus' },
    { value: 'EXECUTIVE_VAN', label: '8-Seater VIP Executive Van' },
  ];

  const statusOptions = [
    { value: 'AVAILABLE', label: 'AVAILABLE (Ready in Yard)' },
    { value: 'ON_TRIP', label: 'ON_TRIP (Active on Route)' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE (Workshop Service)' },
    { value: 'INACTIVE', label: 'INACTIVE (Decommissioned / Standby)' },
  ];

  const driverOptions = [
    { value: '', label: '-- Unassigned (Available in Pool) --' },
    ...availableDrivers.map((d) => ({
      value: d.id,
      label: `${d.name} (${d.employeeId}) — ${d.status === 'AVAILABLE' ? 'Available' : d.status}`,
    })),
  ];

  const routeOptions = [
    { value: '', label: '-- No Fixed Route --' },
    ...availableRoutes.map((r) => ({
      value: r.id,
      label: `${r.routeCode} - ${r.routeName} (${r.origin} → ${r.destination})`,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Vehicle: ${vehicle?.vehicleNumber}` : 'Register New Fleet Vehicle'}
      description="Enter RTA-compliant vehicle specifications, Mulkiya registration, and crew assignments."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {errorMessage && (
          <Alert variant="danger" title="Validation Error">
            {errorMessage}
          </Alert>
        )}

        {/* Section 1: Fleet Identification */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Bus className="w-4 h-4 text-orange-500" />
            <span>Vehicle Identification & Dubai Plate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Fleet Identifier *"
              placeholder="e.g. BUS-108"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              required
            />
            <Input
              label="Registration Plate *"
              placeholder="e.g. DXB-K-54219"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              required
            />
            <Select
              label="Plate Authority / Type"
              value={formData.plateCategory}
              onChange={(e) => setFormData({ ...formData, plateCategory: e.target.value })}
              options={[
                { value: 'Dubai Private Transport', label: 'Dubai Private Transport' },
                { value: 'Dubai Commercial Transport', label: 'Dubai Commercial Transport' },
                { value: 'Dubai Tourism Transport', label: 'Dubai Tourism Transport' },
                { value: 'Dubai Public Transport', label: 'Dubai Public Transport' },
              ]}
            />
          </div>
        </div>

        {/* Section 2: Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            label="Vehicle Category *"
            value={formData.vehicleType}
            onChange={(e) => handleTypeChange(e.target.value as VehicleType)}
            options={vehicleTypeOptions}
          />
          <Input
            label="Make (Brand) *"
            placeholder="e.g. Toyota / King Long"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            required
          />
          <Input
            label="Model *"
            placeholder="e.g. Coaster 30-Seater"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            label="Model Year"
            type="number"
            min="2012"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
          />
          <Input
            label="Seating Capacity *"
            type="number"
            min="1"
            max="80"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            required
          />
          <Select
            label="Fuel Type"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
            options={[
              { value: 'DIESEL', label: 'Diesel (Euro 5/6)' },
              { value: 'PETROL', label: 'Petrol (Special 95)' },
              { value: 'EV', label: '100% Electric (EV)' },
            ]}
          />
          <Input
            label="Current Mileage (km)"
            type="number"
            value={formData.currentMileageKm}
            onChange={(e) => setFormData({ ...formData, currentMileageKm: Number(e.target.value) })}
          />
        </div>

        {/* Section 3: Operational Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            label="Operational Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as VehicleStatus })}
            options={statusOptions}
          />
          <Select
            label="Assigned Captain (Driver)"
            value={formData.assignedDriverId}
            onChange={(e) => setFormData({ ...formData, assignedDriverId: e.target.value })}
            options={driverOptions}
          />
          <Select
            label="Default Assigned Route"
            value={formData.currentRouteId}
            onChange={(e) => setFormData({ ...formData, currentRouteId: e.target.value })}
            options={routeOptions}
          />
        </div>

        {/* Section 4: Dubai RTA & Insurance Compliance */}
        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>RTA Licensing, Mulkiya & Insurance Compliance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              label="Mulkiya Registration Expiry *"
              type="date"
              value={formData.registrationExpiry}
              onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
              required
            />
            <Input
              label="Insurance Policy Expiry *"
              type="date"
              value={formData.insuranceExpiry}
              onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
              required
            />
            <Input
              label="RTA Transport Permit Expiry *"
              type="date"
              value={formData.rtaPermitExpiry}
              onChange={(e) => setFormData({ ...formData, rtaPermitExpiry: e.target.value })}
              required
            />
            <Input
              label="Next Workshop Inspection"
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Vehicle Changes' : 'Register Vehicle to Fleet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
