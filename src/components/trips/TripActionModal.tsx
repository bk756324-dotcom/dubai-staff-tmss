import React, { useState } from 'react';
import { Trip } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { AlertTriangle, XCircle, Clock } from 'lucide-react';

interface DelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  onSuccess: (updatedTrip: Trip) => void;
}

export const DelayTripModal: React.FC<DelayModalProps> = ({
  isOpen,
  onClose,
  trip,
  apiFetch,
  onSuccess,
}) => {
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [delayReason, setDelayReason] = useState('Heavy traffic congestion on Sheikh Zayed Road corridor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !trip) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await apiFetch(`/api/trips/${trip.id}/delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delayMinutes, delayReason }),
      });

      if (res && res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res?.error || 'Failed to update trip delay.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while reporting delay.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report Delay — Trip ${trip.tripNumber}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-950/40 text-red-300 text-xs rounded-lg border border-red-800">{error}</div>}

        <div className="bg-amber-950/20 p-3 rounded-lg border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            Logging a delay broadcasts a HIGH-PRIORITY alert to the Control Room and notifies corporate transport coordinators.
          </div>
        </div>

        <div>
          <Input
            label="Delay Duration (Minutes)"
            type="number"
            value={delayMinutes}
            onChange={(e) => setDelayMinutes(Number(e.target.value))}
            required
            min={1}
            max={180}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Delay Reason
          </label>
          <select
            value={delayReason}
            onChange={(e) => setDelayReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="Heavy traffic congestion on Sheikh Zayed Road corridor">Heavy traffic congestion on Sheikh Zayed Road (E11)</option>
            <option value="Severe delay on Al Khail Road / Mohammed Bin Zayed Road">Severe delay on Al Khail Road (E44) / MBZ Road (E311)</option>
            <option value="Adverse weather / fog speed reduction protocol">Adverse weather / Fog speed reduction protocol</option>
            <option value="Passenger boarding bottleneck at accommodation terminal">Passenger boarding bottleneck at accommodation terminal</option>
            <option value="Road diversion / construction near airport corridor">Road diversion / construction near airport corridor</option>
            <option value="Technical vehicle sensor alert / safety check">Technical vehicle sensor alert / safety check</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Broadcast Delay Alert
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
  onSuccess: (updatedTrip: Trip) => void;
}

export const CancelTripModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  trip,
  apiFetch,
  onSuccess,
}) => {
  const [cancellationReason, setCancellationReason] = useState('Client requested schedule change');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !trip) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await apiFetch(`/api/trips/${trip.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason }),
      });

      if (res && res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res?.error || 'Failed to cancel trip.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error occurred while cancelling trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Cancel Trip — ${trip.tripNumber}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-950/40 text-red-300 text-xs rounded-lg border border-red-800">{error}</div>}

        <div className="bg-red-950/30 p-3 rounded-lg border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
          <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            Cancelling will release assigned Bus <strong>{trip.vehicleNumber}</strong> and Captain <strong>{trip.driverName}</strong> back to the available pool.
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Cancellation Reason
          </label>
          <select
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="Client requested schedule change">Client requested schedule change</option>
            <option value="Public holiday / plant shutdown">Public holiday / plant shutdown</option>
            <option value="Consolidated with alternate corridor">Consolidated with alternate corridor</option>
            <option value="Emergency dispatch re-assignment">Emergency dispatch re-assignment</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Abort
          </Button>
          <Button type="submit" variant="danger" loading={loading}>
            Confirm Trip Cancellation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
