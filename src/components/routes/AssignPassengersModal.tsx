import React, { useState, useEffect } from 'react';
import { Route, Passenger, Vehicle } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { Alert } from '../ui/Alert.js';
import { Users, Search, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AssignPassengersModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  allPassengers: Passenger[];
  assignedVehicle?: Vehicle | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  onSuccess: () => void;
}

export const AssignPassengersModal: React.FC<AssignPassengersModalProps> = ({
  isOpen,
  onClose,
  route,
  allPassengers,
  assignedVehicle,
  apiFetch,
  onSuccess,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (route) {
      // Preselect passengers currently assigned to this route
      const currentAssigned = allPassengers
        .filter((p) => p.routeId === route.id && p.status === 'ACTIVE')
        .map((p) => p.id);
      setSelectedIds(currentAssigned);
    } else {
      setSelectedIds([]);
    }
    setError(null);
    setSearchQuery('');
  }, [route, allPassengers, isOpen]);

  if (!isOpen || !route) return null;

  // Filter passengers eligible for this route
  // If route belongs to a corporate client, prioritize or restrict to that client's passengers
  const eligiblePassengers = allPassengers.filter((p) => {
    if (route.clientId && p.clientId !== route.clientId) {
      return false; // must belong to same client
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.employeeId.toLowerCase().includes(q) ||
        p.pickupPoint.toLowerCase().includes(q) ||
        p.dropPoint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const vehicleCapacity = assignedVehicle?.capacity || 30;
  const isOverCapacity = selectedIds.length > vehicleCapacity;

  const togglePassenger = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((pid) => pid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAllFiltered = () => {
    const newIds = Array.from(new Set([...selectedIds, ...eligiblePassengers.map((p) => p.id)]));
    setSelectedIds(newIds);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (assignedVehicle && selectedIds.length > assignedVehicle.capacity) {
      setError(
        `Capacity limit exceeded: You have selected ${selectedIds.length} passengers, but vehicle ${assignedVehicle.vehicleNumber} only has ${assignedVehicle.capacity} seats.`
      );
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch(`/api/routes/${route.id}/assign-passengers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passengerIds: selectedIds }),
      });

      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res?.error || 'Failed to assign passengers.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while saving passenger assignments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Passenger Manifest Allocation — ${route.routeName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger" title="Allocation Error" message={error} />}

        {/* Capacity Warning Banner */}
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
            isOverCapacity
              ? 'bg-red-950/40 border-red-800 text-red-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {isOverCapacity ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>
              Assigned: <strong>{selectedIds.length}</strong> passengers | Max Vehicle Seats: <strong>{vehicleCapacity}</strong>
            </span>
          </div>
          {assignedVehicle && (
            <span className="text-slate-400 text-[11px]">
              Bus: {assignedVehicle.vehicleNumber} ({assignedVehicle.make})
            </span>
          )}
        </div>

        {/* Search and Quick Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Employee Name, ID, or Pickup stop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleSelectAllFiltered}>
            Select All
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleClearAll}>
            Clear
          </Button>
        </div>

        {/* Passenger Checklist */}
        <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800/80 bg-slate-950/50">
          {eligiblePassengers.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching employees found for this client/criteria.
            </div>
          ) : (
            eligiblePassengers.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePassenger(p.id)}
                  className={`p-2.5 flex items-center justify-between gap-3 cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-orange-500/10 hover:bg-orange-500/15' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 flex items-center gap-2">
                        {p.name}
                        <span className="font-mono text-[10px] text-orange-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          {p.employeeId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>📍 {p.pickupPoint}</span>
                        <span>→</span>
                        <span>{p.dropPoint}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    <span className="font-mono">{p.shift}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            {selectedIds.length} passenger(s) selected for route
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} disabled={isOverCapacity}>
              Save Manifest Allocation
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
