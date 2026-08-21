import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange' | 'navy';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    navy: 'bg-slate-900 text-slate-100 border-slate-700',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
    orange: 'bg-orange-500',
    navy: 'bg-orange-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'AVAILABLE':
    case 'ACTIVE':
    case 'VALID':
    case 'COMPLETED':
      return <Badge variant="success" dot>{status.replace('_', ' ')}</Badge>;
    case 'ON_TRIP':
    case 'IN_PROGRESS':
      return <Badge variant="orange" dot>{status.replace('_', ' ')}</Badge>;
    case 'MAINTENANCE':
    case 'EXPIRING_SOON':
    case 'SCHEDULED':
    case 'PENDING':
    case 'BOARDING':
      return <Badge variant="warning" dot>{status.replace('_', ' ')}</Badge>;
    case 'INACTIVE':
    case 'OFF_DUTY':
    case 'ON_LEAVE':
    case 'ARCHIVED':
      return <Badge variant="neutral">{status.replace('_', ' ')}</Badge>;
    case 'EXPIRED':
    case 'SUSPENDED':
    case 'CANCELLED':
    case 'DELAYED':
      return <Badge variant="danger" dot>{status.replace('_', ' ')}</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
