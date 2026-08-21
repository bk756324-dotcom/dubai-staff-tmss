import React, { useState, useEffect } from 'react';
import { Client, Passenger, Route } from '../../types/index.js';
import { Modal } from '../ui/Modal.js';
import { Badge, StatusBadge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Users,
  Route as RouteIcon,
  ShieldCheck,
  Edit,
  Clock,
} from 'lucide-react';

interface ClientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onEdit: (client: Client) => void;
  apiFetch: (url: string, options?: RequestInit) => Promise<any>;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  isOpen,
  onClose,
  client,
  onEdit,
  apiFetch,
}) => {
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      setLoading(true);
      apiFetch(`/api/clients/${client.id}`)
        .then((res) => {
          if (res && res.success) {
            setEnrichedData(res.data);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setEnrichedData(null);
    }
  }, [client, isOpen, apiFetch]);

  if (!client) return null;

  const getDaysRemaining = (endDateStr: string) => {
    if (!endDateStr) return 0;
    const target = new Date(endDateStr).getTime();
    const today = new Date().getTime();
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const daysToRenewal = getDaysRemaining(client.contractEndDate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Corporate Account: ${client.companyName}`}
      description={`Trade License: ${client.tradeLicenseNumber} • Sector: ${client.industry}`}
      maxWidth="xl"
    >
      <div className="space-y-5 pt-1">
        {/* Top Header Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-slate-700">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-heading tracking-tight">{client.companyName}</h3>
                <StatusBadge status={client.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                <span className="font-semibold text-orange-300">{client.industry}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {client.officeLocation}
                </span>
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10 text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-300">Annual Contract</div>
            <div className="text-base font-bold font-mono text-emerald-400">
              {client.contractValueAed ? `${client.contractValueAed.toLocaleString()} AED` : 'Custom Billing'}
            </div>
          </div>
        </div>

        {/* Quick KPI Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Transported Staff</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {enrichedData?.totalPassengersCount ?? client.totalPassengersCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-500">Registered Employees</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Dedicated Routes</div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
              {enrichedData?.activeRoutesCount ?? client.activeRoutesCount ?? 0}
            </div>
            <div className="text-[11px] text-slate-500">Active Shift Corridors</div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Contract End Date</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
              {client.contractEndDate}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              {daysToRenewal > 0 ? `${daysToRenewal} Days Active` : 'Expired'}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
            <div className="text-xs text-slate-500">Payment Terms</div>
            <div className="text-xs font-semibold text-slate-900 mt-0.5">
              {client.paymentTerms || 'Net 30 Days'}
            </div>
            <div className="text-[11px] text-slate-500">Corporate Invoicing</div>
          </div>
        </div>

        {/* Primary Contact Person Details */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-500" />
              <span>Key Account Manager & Transport Lead</span>
            </div>
            <Badge variant="navy">Account Admin</Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm">{client.contactPerson}</div>
              <div className="text-slate-500">{client.contactTitle}</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${client.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors font-mono font-medium"
              >
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                {client.phone}
              </a>
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors font-mono font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                {client.email}
              </a>
            </div>
          </div>
        </div>

        {/* Active Dedicated Routes */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <RouteIcon className="w-3.5 h-3.5 text-orange-500" />
              <span>Dedicated Staff Commute Routes</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {enrichedData?.routes?.length || 0} Routes Configured
            </span>
          </div>

          {enrichedData?.routes && enrichedData.routes.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {enrichedData.routes.map((r: Route) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 font-mono mr-2">{r.routeCode}</span>
                    <span className="font-medium text-slate-800">{r.routeName}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {r.origin} → {r.destination}
                    </div>
                  </div>
                  <Badge variant={r.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic py-2 text-center">
              No dedicated routes linked yet. Ad-hoc fleet allocation active.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="text-xs text-slate-400">
            Account Created: {new Date(client.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit(client);
              }}
            >
              <Edit className="w-3.5 h-3.5 mr-1" />
              Edit Account
            </Button>
            <Button size="sm" variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
