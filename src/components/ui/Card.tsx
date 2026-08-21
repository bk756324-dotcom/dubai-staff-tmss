import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'navy' | 'flat';
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const variantStyles = {
    default: 'bg-white border-slate-200 text-slate-900 shadow-sm',
    navy: 'bg-[#0A192F] border-slate-800 text-white shadow-md',
    flat: 'bg-slate-50 border-slate-200 text-slate-900',
  };

  return (
    <div className={`rounded-xl border p-5 ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`flex items-center justify-between pb-4 border-b border-slate-100 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-base font-semibold text-slate-900 font-heading tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
