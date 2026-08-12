import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useStore, Status, Priority } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { ComplaintTimeline } from '@/components/ComplaintTimeline';
import { 
  ArrowLeft, 
  User, 
  Paperclip, 
  AlertCircle, 
  Save, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText,
  Star,
  MapPin,
  Tag,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STAGES: Status[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed'
];

export default function AuthorityComplaintDetail() {
  const [, params] = useRoute('/authority/complaints/:id');
  const id = params?.id;
  const { toast } = useToast();
  
  const { 
    complaints, 
    officers, 
    updateStatus, 
    assignOfficer, 
    addRemark,
    currentUser 
  } = useStore();

  const complaint = complaints.find(c => c.id.toLowerCase() === id?.toLowerCase());

  const [currentStatus, setCurrentStatus] = useState<Status>(complaint?.status || 'Submitted');
  const [assignedOfficer, setAssignedOfficer] = useState(complaint?.assignedTo || '');
  const [remark, setRemark] = useState('');
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if complaint changes
  React.useEffect(() => {
    if (complaint) {
      setCurrentStatus(complaint.status);
      setAssignedOfficer(complaint.assignedTo || '');
    }
  }, [complaint]);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-200 p-12 text-center">
        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Record Not Found</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-6 max-w-sm">
          The complaint ID {id} does not exist in the institutional database.
        </p>
        <Link 
          href="/authority/complaints" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          Return to All Complaints
        </Link>
      </div>
    );
  }

  const currentStageIndex = Math.max(0, STAGES.indexOf(complaint.status));

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const actor = currentUser.role === 'authority' ? currentUser.name : 'Authority Officer';

      // 1. If assigned officer changed
      if (assignedOfficer !== (complaint.assignedTo || '')) {
        assignOfficer(complaint.id, assignedOfficer, `Reassigned to ${assignedOfficer}`, actor, notifyStudent);
      }

      // 2. If status changed
      if (currentStatus !== complaint.status) {
        updateStatus(complaint.id, currentStatus, remark || `Status updated to ${currentStatus}`, actor, notifyStudent);
      } else if (remark.trim()) {
        // Just adding a remark
        addRemark(complaint.id, remark.trim(), actor, notifyStudent);
      }

      setIsSaving(false);
      setRemark('');

      toast({
        title: "Action Saved Successfully",
        description: `Complaint ${complaint.id} was updated. Status: ${currentStatus}.`,
      });
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Header Back & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/authority/complaints" 
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
              Registered by {complaint.studentName} on {format(new Date(complaint.dateFiled), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Milestone Stage Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Institutional Stage Tracker</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Stage {currentStageIndex + 1} of 6: {complaint.status}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}% Completed
          </span>
        </div>

        <div className="relative">
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
        
        {/* Left 2 Columns: Complaint Data, Evidence, Student Context & Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
            
            {/* Student Persona Pill */}
            <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
              <div className="h-11 w-11 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                {complaint.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{complaint.studentName}</h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    <User className="h-3 w-3" /> Student
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Roll ID: {complaint.studentId} • Room / Hall: {complaint.location}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">{complaint.title}</h2>
            
            {/* Classification Grid */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</span>
                <span className="font-bold text-slate-900">{complaint.category}</span>
                <span className="text-slate-500 block">{complaint.subCategory}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Location Details</span>
                <span className="font-bold text-slate-900">{complaint.location}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Current Assignee</span>
                <span className="font-bold text-indigo-700">{complaint.assignedTo || 'Unassigned'}</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Issue</h3>
              <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                {complaint.description}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Supporting Files ({complaint.attachments?.length || 0})</span>
              </h3>
              
              {complaint.attachments && complaint.attachments.length > 0 ? (
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
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-center text-xs text-slate-400">
                  No photographic or documentary attachments provided by student.
                </div>
              )}
            </div>

            {/* Student Feedback (If resolved/closed) */}
            {complaint.feedback && (
              <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-900">Student Satisfaction Feedback</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={cn("h-4 w-4", s <= complaint.feedback!.rating ? "fill-amber-400" : "text-slate-300")} />
                    ))}
                  </div>
                </div>
                {complaint.feedback.comment && (
                  <p className="text-xs text-amber-800 italic">"{complaint.feedback.comment}"</p>
                )}
              </div>
            )}
          </div>
          
          {/* Complete Audit Trail */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <ComplaintTimeline 
              timeline={complaint.timeline} 
              currentStatus={complaint.status} 
              isAuthorityView={true}
              showProgressBar={false}
            />
          </div>
        </div>

        {/* Right Column: Authority Action Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sticky top-20">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Action Control Panel</h3>
            </div>
            
            <form onSubmit={handleSaveChanges} className="space-y-4">
              
              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Resolution Status
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as Status)}
                >
                  <option value="Submitted">Submitted (New)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned to Officer</option>
                  <option value="In Progress">In Progress (Active Work)</option>
                  <option value="Resolved">Resolved (Work Done)</option>
                  <option value="Closed">Closed (Confirmed by Student)</option>
                </select>
              </div>

              {/* Officer Delegation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assign / Delegate Officer
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                >
                  <option value="">-- Select Officer --</option>
                  {officers.map(officer => (
                    <option key={officer.id} value={`${officer.name} (${officer.department})`}>
                      {officer.name} - {officer.role} ({officer.department})
                    </option>
                  ))}
                  <option value="CIC Network Team">CIC Network Team</option>
                  <option value="Power Distribution Team">Power Distribution Team</option>
                  <option value="Estate Maintenance Office">Estate Maintenance Office</option>
                </select>
              </div>

              {/* Action Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Add Official Remark / Notes
                </label>
                <textarea 
                  rows={4}
                  placeholder="Record action taken, technician dispatch details, or instructions for the student..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-normal"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              {/* Student Notification Toggle */}
              <label className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  checked={notifyStudent}
                  onChange={(e) => setNotifyStudent(e.target.checked)}
                />
                <div className="flex-1 text-xs">
                  <span className="font-bold text-slate-800 block">Notify Student</span>
                  <span className="text-slate-500 text-[10px]">Pushes alert to student notification inbox</span>
                </div>
                <Send className="h-3.5 w-3.5 text-slate-400" />
              </label>

              {/* Save Button */}
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 hover:scale-[1.02]"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving Updates...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save & Publish Update</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
