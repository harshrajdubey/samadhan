import React from 'react';
import { TimelineEvent, Status } from '@/lib/store';
import { 
  CheckCircle2, 
  Clock, 
  User, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STAGES: Status[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed'
];

interface ComplaintTimelineProps {
  timeline: TimelineEvent[];
  currentStatus: Status;
  isAuthorityView?: boolean;
  showProgressBar?: boolean;
}

export function ComplaintTimeline({ 
  timeline, 
  currentStatus, 
  isAuthorityView = false,
  showProgressBar = true 
}: ComplaintTimelineProps) {
  const currentStageIndex = Math.max(0, STAGES.indexOf(currentStatus));

  // Chronological timeline events (sorted newest first for activity log)
  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* 1. Visual Stage Progress Bar (Compact & Responsive) */}
      {showProgressBar && (
        <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Stage</span>
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
              {currentStageIndex + 1} of 6: {currentStatus}
            </span>
          </div>

          {/* Progress fill bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(12, ((currentStageIndex + 1) / STAGES.length) * 100)}%` }}
            />
          </div>

          {/* Stepper nodes */}
          <div className="flex items-center justify-between gap-1">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <div key={stage} className="flex flex-col items-center flex-1 min-w-0" title={`${idx + 1}. ${stage}`}>
                  <div 
                    className={cn(
                      "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shadow-2xs",
                      isCompleted ? "bg-indigo-600 text-white border-2 border-white ring-2 ring-indigo-500/20" : "",
                      isCurrent ? "bg-amber-500 text-white border-2 border-white ring-4 ring-amber-400/30 scale-110 animate-pulse" : "",
                      isPending ? "bg-white text-slate-400 border border-slate-300" : ""
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[9px] sm:text-[10px] font-semibold text-center mt-1.5 truncate max-w-full block",
                    isCurrent ? "text-amber-700 font-extrabold" : isCompleted ? "text-slate-700" : "text-slate-400"
                  )}>
                    {stage.replace('Under ', '').replace('In ', '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Detailed Audit Log Stream */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <span>Activity & Remarks ({timeline.length})</span>
        </h4>

        <div className="flow-root">
          <ul role="list" className="-mb-6">
            {sortedEvents.map((event, idx) => {
              const isLatest = idx === 0;
              const isAuthorityActor = event.author?.toLowerCase().includes('dr.') || 
                                       event.author?.toLowerCase().includes('mr.') || 
                                       event.author?.toLowerCase().includes('mrs.') || 
                                       event.author?.toLowerCase().includes('warden') ||
                                       event.author?.toLowerCase().includes('estate') ||
                                       event.author?.toLowerCase().includes('admin');

              return (
                <li key={`${event.timestamp}-${idx}`}>
                  <div className="relative pb-6">
                    {idx !== sortedEvents.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                        aria-hidden="true"
                      />
                    ) : null}

                    <div className="relative flex items-start space-x-3">
                      {/* Avatar Icon */}
                      <div className="relative">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border shadow-2xs text-xs font-bold shrink-0",
                          isAuthorityActor ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-100 border-slate-200 text-slate-700"
                        )}>
                          {isAuthorityActor ? (
                            <ShieldCheck className="h-4 w-4 text-indigo-600" />
                          ) : (
                            <User className="h-4 w-4 text-slate-600" />
                          )}
                        </div>
                      </div>

                      {/* Content Box */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {event.author || (isAuthorityActor ? 'Campus Authority' : 'Student')}
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {event.stage}
                            </span>
                            {isLatest && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Latest
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                            {format(new Date(event.timestamp), "MMM d, h:mm a")}
                          </span>
                        </div>

                        {event.remarks && (
                          <div className={cn(
                            "text-xs leading-relaxed p-3 rounded-xl border mt-1",
                            isAuthorityActor ? "bg-indigo-50/40 border-indigo-100 text-slate-800" : "bg-slate-50 border-slate-200/80 text-slate-700"
                          )}>
                            <p className="whitespace-pre-wrap">{event.remarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
