import React from 'react';
import {
  X,
  FileCheck2,
  Bus,
  UserCheck,
  Building2,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Download,
  ExternalLink,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { DocumentRecord } from '../../types/index.js';

interface DocumentPreviewModalProps {
  document: DocumentRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !document) return null;

  const isExpired = document.status === 'EXPIRED';
  const isExpiringSoon = document.status === 'EXPIRING_SOON';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Document Inspector</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isExpired
                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'
                      : isExpiringSoon
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {document.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {document.documentNumber} • {document.documentType.replace(/_/g, ' ')}
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

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Certificate Card Simulation */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-[#0A192F] shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black text-xs">
                  DXB
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Government of Dubai • Official Permit
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {document.issuingAuthority}
                  </div>
                </div>
              </div>

              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 p-1 flex items-center justify-center">
                <QrCode className="w-9 h-9 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Document Classification
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {document.title || document.documentType.replace(/_/g, ' ')}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Certificate Number
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {document.documentNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Associated Entity
                </span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  {document.entityType === 'VEHICLE' && <Bus className="w-3.5 h-3.5 text-orange-500" />}
                  {document.entityType === 'DRIVER' && <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
                  {document.entityType === 'CORPORATE' && <Building2 className="w-3.5 h-3.5 text-sky-500" />}
                  <span>{document.entityName || document.entityId}</span>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Days Remaining
                </span>
                <span
                  className={`font-bold font-mono ${
                    (document.daysUntilExpiry ?? 0) <= 0
                      ? 'text-rose-500'
                      : (document.daysUntilExpiry ?? 0) <= 30
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {(document.daysUntilExpiry ?? 0) <= 0
                    ? `Expired by ${Math.abs(document.daysUntilExpiry ?? 0)} days`
                    : `${document.daysUntilExpiry} days valid`}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Issue Date
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {document.issueDate}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Expiry Date
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {document.expiryDate}
                </span>
              </div>
            </div>

            {document.notes && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Notes: </span>
                {document.notes}
              </div>
            )}
          </div>

          {/* Regulatory Verification Status */}
          <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="font-bold">Tasjeel & RTA Verification</span>
              <p className="text-[11px] mt-0.5 text-emerald-900/80 dark:text-emerald-200/80">
                Digital record cryptographically synchronized with Dubai Fleet Compliance standards.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Permit</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
