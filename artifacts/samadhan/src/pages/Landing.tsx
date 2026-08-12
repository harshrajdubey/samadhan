import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useStore } from '@/lib/store';
import { 
  ShieldCheck, 
  GraduationCap, 
  ShieldAlert, 
  BarChart3, 
  Activity, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Sparkles,
  Layers,
  FileCheck2,
  Users,
  Compass
} from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { complaints } = useStore();
  const [quickTrackId, setQuickTrackId] = useState('');

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 94;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      setLocation(`/student/track?id=${encodeURIComponent(quickTrackId.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Soft Glows (Light Theme) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-2xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              SAMADHAN
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase">IIT Kharagpur Grievance Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/student"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span>Student Login</span>
          </Link>
          <Link 
            href="/authority"
            className="inline-flex items-center gap-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Authority Portal</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full relative z-10">
        
        <div className="text-center mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Centralized Digital Redressal System • IIT Kharagpur</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Track <span className="text-indigo-600 font-serif italic font-normal">x</span> Resolve <span className="text-indigo-600 font-serif italic font-normal">x</span> Improve
          </h2>

          <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            The transparent and accountable digital grievance redressal platform for the IIT Kharagpur campus. 
            Replace untracked emails with real-time, stage-by-stage audit resolution tracking.
          </p>

          {/* Quick Track Widget */}
          <form onSubmit={handleQuickTrack} className="max-w-lg mx-auto mb-10">
            <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl p-1.5 shadow-xl focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15 transition-all">
              <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Enter Complaint ID (e.g. SMD-2024-04712)..."
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
              />
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Track Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Key Metrics Chips */}
          <div className="flex flex-wrap justify-center gap-3.5 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{resolutionRate}% Resolution Rate</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <Activity className="h-4 w-4 text-blue-600" />
              <span>{totalComplaints} Grievances Processed</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <Clock className="h-4 w-4 text-amber-600" />
              <span>6-Stage Live Audit Trail</span>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Student/Faculty Portal */}
          <div className="bg-white border border-slate-200 hover:border-blue-500/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-all pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-100 transition-all shadow-2xs">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Student & Resident</h3>
                <p className="text-xs text-blue-600 font-semibold">Campus Resident Portal</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-1">
              File new complaints with photo attachments, monitor real-time audit logs, reopen unsatisfied resolutions, and confirm fixes.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Instant SMD tracking ticket generation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Real-time status updates & remark notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>5-Star resolution rating & feedback loop</span>
              </li>
            </ul>

            <Link 
              href="/student" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-600/25 group-hover:translate-y-[-2px]"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Authority Portal */}
          <div className="bg-white border border-slate-200 hover:border-indigo-500/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-all pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all shadow-2xs">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Authority & Admin</h3>
                <p className="text-xs text-indigo-600 font-semibold">Redressal Management</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed flex-1">
              Review assigned grievances, delegate to wardens & estate managers, broadcast official remarks, bulk update statuses, and analyze institutional metrics.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Multi-criteria filtering & CSV bulk export</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Officer assignment & workload balancing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Departmental volume & performance analytics</span>
              </li>
            </ul>

            <Link 
              href="/authority" 
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md shadow-indigo-600/25 group-hover:translate-y-[-2px]"
            >
              <span>Access Authority Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

        {/* Emergency Helpline Banner */}
        <div className="mt-12 w-full max-w-4xl bg-amber-50/90 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 bg-amber-100 border border-amber-200 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950">Emergency Helplines (24x7)</p>
              <p className="text-xs text-amber-800">For life-critical emergencies, contact the campus emergency control room directly.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-white border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-lg shadow-2xs">
              Hospital: 03222-282000
            </span>
            <span className="bg-white border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-lg shadow-2xs">
              Security: 03222-281001
            </span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2024-2026 Indian Institute of Technology Kharagpur. Digital Grievance Portal.</p>
      </footer>
    </div>
  );
}
