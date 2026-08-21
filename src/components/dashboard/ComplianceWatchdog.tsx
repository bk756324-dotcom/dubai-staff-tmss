import React from 'react';
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { DocumentRecord } from '../../types/index.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { Badge } from '../ui/Badge.js';

interface ComplianceWatchdogProps {
  documents: DocumentRecord[];
  onNavigate?: (path: string) => void;
}

export const ComplianceWatchdog: React.FC<ComplianceWatchdogProps> = ({
  documents,
  onNavigate,
}) => {
  const expiringDocs = documents.filter(
    (d) => d.daysRemaining <= 30 || d.status === 'EXPIRING_SOON' || d.status === 'EXPIRED'
  );

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <CardTitle className="text-sm font-extrabold text-slate-900 font-heading uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>RTA & Compliance Watchdog</span>
          </CardTitle>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Automated monitoring for Dubai Mulkiya, RTA Permits & Insurance
          </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {expiringDocs.length} Action Items
        </span>
      </CardHeader>

      <CardContent className="pt-3 space-y-2.5">
        {expiringDocs.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="font-bold">All fleet Mulkiya and RTA permits are 100% compliant.</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">No expiries within the next 30 days.</p>
          </div>
        ) : (
          expiringDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                    doc.daysRemaining <= 10
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Target: <span className="font-semibold text-slate-700">{doc.ownerName}</span> • Auth: {doc.issuingAuthority}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {doc.notes || 'Tasjeel testing slot to be booked'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <div className="text-left sm:text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border ${
                      doc.daysRemaining <= 10
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {doc.daysRemaining} Days Left
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Exp: {doc.expiryDate}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-2.5"
                  onClick={() => onNavigate && onNavigate('/app/documents')}
                >
                  Renew
                </Button>
              </div>
            </div>
          ))
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Next Tasjeel Fleet Audit: 29 Aug 2026</span>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/app/documents')}
            className="text-orange-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <span>View All 28 Fleet Permits</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
