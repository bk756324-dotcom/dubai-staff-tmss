import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button.js';

export const LoadingSpinner: React.FC<{ message?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  message = 'Loading operational telemetry...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Loader2 className={`${sizeMap[size]} text-orange-500 animate-spin mb-3`} />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-lg w-full" />
      ))}
    </div>
  );
};

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
      <div className="p-3 bg-white rounded-full shadow-xs border border-slate-200 text-slate-400 mb-3.5">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-semibold text-slate-900 font-heading">{title}</h4>
      {description && <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  error?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  error = 'A network or server error occurred while retrieving resources.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-red-200 bg-red-50/40">
      <div className="p-3 bg-red-100 text-red-600 rounded-full mb-3.5">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-red-950 font-heading">{title}</h4>
      <p className="text-xs sm:text-sm text-red-700 max-w-md mt-1 mb-4">{error}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
