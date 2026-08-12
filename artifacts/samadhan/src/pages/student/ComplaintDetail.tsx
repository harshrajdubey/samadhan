import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useStore, Status } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { ComplaintTimeline } from '@/components/ComplaintTimeline';
import { 
  ArrowLeft, 
  Paperclip, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  FileText, 
  CheckCircle2, 
  RotateCcw,
  Star,
  Send,
  Sparkles,
  MapPin,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STAGES: Status[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed'
];

export default function ComplaintDetail() {
  const [, params] = useRoute('/student/complaints/:id');
  const id = params?.id;
  
  const { 
    complaints, 
    confirmResolution, 
    reopenComplaint, 
    submitFeedback, 
    addRemark,
    currentUser 
  } = useStore();

  const complaint = complaints.find(c => c.id.toLowerCase() === id?.toLowerCase());

  // Modal / Interaction states
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [rating, setRating] = useState<number>(complaint?.feedback?.rating || 5);
  const [feedbackComment, setFeedbackComment] = useState(complaint?.feedback?.comment || '');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(!!complaint?.feedback);

  const [studentReply, setStudentReply] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm mb-6">
          The complaint ID "{id}" does not exist or may have been removed.
        </p>
        <Link 
          href="/student/complaints" 
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Return to My Complaints
        </Link>
      </div>
    );
  }

  const isResolved = complaint.status === 'Resolved';
  const isClosed = complaint.status === 'Closed';
  const currentStageIndex = Math.max(0, STAGES.indexOf(complaint.status));

  const handleReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    reopenComplaint(complaint.id, reopenReason.trim());
    setIsReopenModalOpen(false);
    setReopenReason('');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(complaint.id, rating, feedbackComment.trim());
    setIsFeedbackSubmitted(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentReply.trim()) return;
    setIsSubmittingReply(true);
    setTimeout(() => {
      addRemark(complaint.id, studentReply.trim(), `${currentUser.name} (Student)`, true);
      setStudentReply('');
      setIsSubmittingReply(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header Back & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/student/complaints" 
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors text-slate-600 hover:text-slate-900 shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold text-slate-900 tracking-tight">
                {complaint.id}
              </h1>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <p className="text-slate-500 text-xs font-medium">
              Filed on {format(new Date(complaint.dateFiled), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        {isResolved && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => confirmResolution(complaint.id)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Close</span>
            </button>
            <button 
              onClick={() => setIsReopenModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reopen</span>
            </button>
          </div>
        )}
      </div>

      {/* Full-width Milestone Stage Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Live Stage Tracker</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Stage {currentStageIndex + 1} of 6: {complaint.status}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}% Progress
          </span>
        </div>

        {/* Stepper with plenty of horizontal space */}
        <div className="relative">
          {/* Background line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0" />
          <div 
            className="absolute top-4 left-6 h-1 bg-indigo-600 transition-all duration-500 -z-0" 
            style={{ width: `calc(${Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)}% - 24px)` }}
          />

          <div className="relative z-10 grid grid-cols-6 gap-2">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isPending = idx > currentStageIndex;

              return (
                <div key={stage} className="flex flex-col items-center text-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs",
                      isCompleted ? "bg-indigo-600 text-white border-2 border-white ring-2 ring-indigo-500/20" : "",
                      isCurrent ? "bg-amber-500 text-white border-2 border-white ring-4 ring-amber-400/30 scale-110 animate-pulse" : "",
                      isPending ? "bg-white text-slate-400 border-2 border-slate-200" : ""
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px] sm:text-xs mt-2 font-medium leading-tight",
                    isCurrent ? "text-amber-700 font-extrabold" : isCompleted ? "text-slate-800 font-semibold" : "text-slate-400"
                  )}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details, Attachments, Resolution Action & Replies */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{complaint.title}</h2>
            
            {/* Meta Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</span>
                <span className="font-bold text-slate-900">{complaint.category}</span>
                <span className="text-slate-500 block">{complaint.subCategory}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Location</span>
                <span className="font-bold text-slate-900">{complaint.location}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Assigned Officer</span>
                <span className="font-bold text-indigo-700">{complaint.assignedTo || 'Pending Assignment'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {complaint.description}
              </div>
            </div>

            {/* Attachments */}
            {complaint.attachments && complaint.attachments.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>Attachments ({complaint.attachments.length})</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {complaint.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{file.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resolved Action & Feedback Box */}
          {(isResolved || isClosed) && (
            <div className={cn(
              "rounded-3xl border p-6 sm:p-8 shadow-sm transition-all",
              isClosed ? "bg-slate-50 border-slate-200" : "bg-emerald-50/60 border-emerald-200"
            )}>
              <div className="flex items-start gap-4 mb-6">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                  isClosed ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"
                )}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isClosed ? 'Resolution Confirmed & Ticket Closed' : 'Authority Marked Issue as Resolved'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {isClosed 
                      ? 'You have confirmed the resolution. If the problem recurs, you may reopen this ticket anytime.' 
                      : 'Please inspect the repair or resolution. If satisfied, confirm and rate the service below.'}
                  </p>
                </div>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Satisfaction Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        disabled={isFeedbackSubmitted && isClosed}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star className={cn(
                          "h-5 w-5",
                          star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                        )} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea 
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Optional comments regarding the speed or quality of resolution..."
                  disabled={isFeedbackSubmitted && isClosed}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none font-normal"
                />

                {!isFeedbackSubmitted && (
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
                {isFeedbackSubmitted && (
                  <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Feedback recorded. Thank you for helping IIT Kharagpur improve!</span>
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Student Follow-Up / Reply Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Send Follow-Up Note / Additional Info</span>
            </h3>
            
            <form onSubmit={handleSendReply} className="space-y-3">
              <textarea 
                rows={3}
                value={studentReply}
                onChange={(e) => setStudentReply(e.target.value)}
                placeholder="Type additional information or follow-up questions for the handling officer..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed font-normal"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!studentReply.trim() || isSubmittingReply}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmittingReply ? 'Posting...' : 'Post Follow-Up'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column: Live Tracking Timeline & Remarks */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <ComplaintTimeline 
              timeline={complaint.timeline} 
              currentStatus={complaint.status}
              showProgressBar={false}
            />
          </div>
        </div>

      </div>

      {/* Reopen Modal */}
      {isReopenModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95">
            <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <RotateCcw className="h-6 w-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reopen Complaint {complaint.id}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Please explain why the resolution was unsatisfactory so the authority can take corrective action.
            </p>

            <form onSubmit={handleReopen} className="space-y-4">
              <textarea 
                required
                rows={4}
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. The leak started again today after water pressure was turned on..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none font-normal"
              />

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReopenModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm"
                >
                  Reopen Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
