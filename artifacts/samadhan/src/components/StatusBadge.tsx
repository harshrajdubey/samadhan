import React from 'react';
import { Status, Priority } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  FileText, 
  Archive,
  Flame,
  AlertTriangle,
  ArrowDown,
  Minus
} from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-slate-100/90 text-slate-700 border-slate-300/80',
          icon: FileText,
          pulse: false
        };
      case 'Under Review':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200/90',
          icon: Clock,
          pulse: false
        };
      case 'Assigned':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200/90',
          icon: UserCheck,
          pulse: false
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300/80',
          icon: Clock,
          pulse: true
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
          icon: CheckCircle2,
          pulse: false
        };
      case 'Closed':
        return {
          bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          icon: Archive,
          pulse: false
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: FileText,
          pulse: false
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs transition-all",
        config.bg,
        className
      )}
    >
      {showIcon && (
        <span className="relative flex items-center justify-center">
          {config.pulse && (
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75" />
          )}
          <Icon className="h-3.5 w-3.5 shrink-0" />
        </span>
      )}
      <span>{status}</span>
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority | string;
  className?: string;
  showIcon?: boolean;
}

export function PriorityBadge({ priority, className, showIcon = true }: PriorityBadgeProps) {
  const getPriorityConfig = (p: string) => {
    switch (p) {
      case 'Urgent':
        return {
          style: 'bg-rose-50 text-rose-700 border-rose-300/90 shadow-rose-100',
          icon: Flame,
          dotColor: 'bg-rose-600',
          pulse: true
        };
      case 'High':
        return {
          style: 'bg-orange-50 text-orange-700 border-orange-200 shadow-orange-100',
          icon: AlertTriangle,
          dotColor: 'bg-orange-500',
          pulse: false
        };
      case 'Medium':
        return {
          style: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Minus,
          dotColor: 'bg-amber-500',
          pulse: false
        };
      case 'Low':
        return {
          style: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: ArrowDown,
          dotColor: 'bg-slate-400',
          pulse: false
        };
      default:
        return {
          style: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Minus,
          dotColor: 'bg-slate-400',
          pulse: false
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border shadow-2xs",
        config.style,
        className
      )}
    >
      {showIcon && (
        <span className="relative flex items-center justify-center">
          {config.pulse && (
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75" />
          )}
          <Icon className="h-3 w-3 shrink-0" />
        </span>
      )}
      <span>{priority}</span>
    </span>
  );
}
