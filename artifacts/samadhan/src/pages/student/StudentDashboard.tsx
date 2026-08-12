import React from 'react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { complaints, currentUser } = useStore();

  const myComplaints = complaints.filter(c => 
    c.studentId === currentUser.rollNumber || c.studentId === currentUser.id || c.studentName === currentUser.name
  );
  
  const total = myComplaints.length;
  const inProgress = myComplaints.filter(c => ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)).length;
  const resolved = myComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const awaitingFeedback = myComplaints.filter(c => c.status === 'Resolved' && !c.feedback).length;

  const recentComplaints = [...myComplaints].sort((a, b) => 
    new Date(b.dateFiled).getTime() - new Date(a.dateFiled).getTime()
  ).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Sparkles className="h-3 w-3" />
            <span>Logged in as {currentUser.rollNumber || 'Student'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Track real-time progress on your filed complaints or submit a new grievance for immediate review.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <Link 
            href="/student/new" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>File Complaint</span>
          </Link>
          <Link 
            href="/student/track" 
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 transition-all"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>Track by ID</span>
          </Link>
        </div>
      </div>

      {/* Awaiting Confirmation Banner */}
      {awaitingFeedback > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Action Needed: {awaitingFeedback} Resolved Grievance(s)</h3>
              <p className="text-xs text-emerald-800 mt-0.5">Please verify if the resolution was satisfactory and close the ticket.</p>
            </div>
          </div>
          <Link 
            href="/student/complaints" 
            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Filed</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{total}</p>
            <p className="text-xs text-slate-400 mt-1">Across all categories</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl text-blue-600">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{inProgress}</p>
            <p className="text-xs text-slate-400 mt-1">Currently being handled</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-2xl text-amber-600">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{resolved}</p>
            <p className="text-xs text-slate-400 mt-1">Successfully resolved</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Recent Complaints Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <Inbox className="h-5 w-5 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
          </div>
          <Link 
            href="/student/complaints" 
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All ({myComplaints.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        
        {recentComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Complaint Title & ID</th>
                  <th className="px-6 py-3.5 font-bold">Category</th>
                  <th className="px-6 py-3.5 font-bold">Date Filed</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                  <th className="px-6 py-3.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link 
                        href={`/student/complaints/${complaint.id}`}
                        className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate max-w-xs"
                      >
                        {complaint.title}
                      </Link>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{complaint.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap font-medium">
                      {format(new Date(complaint.dateFiled), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/student/complaints/${complaint.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-slate-100 h-16 w-16 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No complaints recorded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              You haven't filed any complaints under your current student profile.
            </p>
            <Link 
              href="/student/new" 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Submit First Complaint</span>
            </Link>
          </div>
        )}
      </div>
      
      {/* Emergency Helpline Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-amber-950 text-sm">Emergency Hotlines (IIT Kharagpur)</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              For urgent safety, medical, or electrical hazards, contact campus control lines immediately.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 text-xs font-bold">
          <span className="bg-white text-amber-900 px-3.5 py-1.5 rounded-lg shadow-2xs border border-amber-200">
            BC Roy Hospital: 03222-282000
          </span>
          <span className="bg-white text-amber-900 px-3.5 py-1.5 rounded-lg shadow-2xs border border-amber-200">
            Security Control: 03222-281001
          </span>
        </div>
      </div>
    </div>
  );
}
