import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Trash2,
  CheckCheck,
  Inbox,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearNotification 
  } = useStore();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.complaintId) {
      setLocation(`/student/complaints/${notif.complaintId}`);
    }
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case 'status':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-600',
          bg: 'bg-emerald-100/80'
        };
      case 'remark':
        return {
          icon: MessageSquare,
          color: 'text-blue-600',
          bg: 'bg-blue-100/80'
        };
      case 'assignment':
        return {
          icon: UserCheck,
          color: 'text-purple-600',
          bg: 'bg-purple-100/80'
        };
      case 'system':
      default:
        return {
          icon: AlertTriangle,
          color: 'text-amber-600',
          bg: 'bg-amber-100/80'
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time status updates, official warden remarks, and assignment alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            "text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors",
            filter === 'all' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            "text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
            filter === 'unread' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={cn("px-1.5 py-0.2 rounded-full text-[10px]", filter === 'unread' ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700")}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((notif) => {
              const iconConfig = getIconConfig(notif.type);
              const Icon = iconConfig.icon;

              return (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={cn(
                    "p-5 sm:p-6 flex gap-4 transition-all hover:bg-slate-50/80 cursor-pointer group relative",
                    !notif.read ? "bg-blue-50/30" : ""
                  )}
                >
                  <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs", iconConfig.bg)}>
                    <Icon className={cn("h-5 w-5", iconConfig.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={cn("text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors", !notif.read ? "font-extrabold" : "")}>
                        {notif.title}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
                        {format(new Date(notif.time), 'MMM d, h:mm a')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {notif.message}
                    </p>

                    {notif.complaintId && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                        <span>Ticket: {notif.complaintId}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                    {!notif.read && (
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-1 shadow-xs" title="Unread" />
                    )}
                    <button
                      type="button"
                      onClick={() => clearNotification(notif.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No notifications</h3>
            <p className="text-xs text-slate-500">
              {filter === 'unread' ? "You're all caught up! No unread alerts." : "No notification history yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
