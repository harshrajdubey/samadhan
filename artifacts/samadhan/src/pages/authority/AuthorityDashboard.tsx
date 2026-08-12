import React from 'react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  ArrowRight, 
  Activity, 
  Download,
  Users,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function AuthorityDashboard() {
  const { complaints, exportToCSV } = useStore();

  // Aggregate live statistics
  const totalActive = complaints.filter(c => !['Resolved', 'Closed'].includes(c.status)).length;
  const pendingAction = complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length;
  const resolvedTotal = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const urgentCount = complaints.filter(c => c.priority === 'Urgent' && !['Resolved', 'Closed'].includes(c.status)).length;

  // Urgent action queue (Urgent & High priority, pending resolution)
  const urgentComplaints = complaints
    .filter(c => ['Urgent', 'High'].includes(c.priority) && !['Resolved', 'Closed'].includes(c.status))
    .sort((a, b) => new Date(a.dateFiled).getTime() - new Date(b.dateFiled).getTime())
    .slice(0, 5);

  // Department counts
  const categoriesList = [
    'Hostel Maintenance',
    'Mess Food',
    'Water & Utilities',
    'Campus Infrastructure',
    'Academic & Administrative',
    'Medical & Student Welfare'
  ];

  const deptCounts = categoriesList.map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat && !['Resolved', 'Closed'].includes(c.status)).length
  }));

  const maxDeptCount = Math.max(...deptCounts.map(d => d.count), 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Top Bar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>IIT Kharagpur Grievance Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Institutional Oversight
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time status monitoring, delegation queue, and operational health metrics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => exportToCSV()}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <Link 
            href="/authority/complaints"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Manage All Complaints</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalActive}</h3>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Currently in workflow</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow ring-1 ring-amber-500/20 bg-gradient-to-br from-white to-amber-50/20">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Review</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{pendingAction}</h3>
            </div>
            <div className="p-3 bg-amber-100/70 border border-amber-200 rounded-2xl text-amber-700">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-amber-700 font-medium">Needs immediate assignment</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Resolved</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{resolvedTotal}</h3>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Resolved & verified</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgent Attention</p>
              <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{urgentCount}</h3>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-rose-600 font-medium">High/Urgent priority tickets</p>
        </div>

      </div>

      {/* Main Grid: Priority Queue & Department Snapshot */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Action Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Priority Action Queue</h2>
            </div>
            <Link 
              href="/authority/complaints" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>View All Queue</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {urgentComplaints.length > 0 ? (
              urgentComplaints.map(complaint => (
                <div 
                  key={complaint.id} 
                  className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-extrabold text-slate-900">{complaint.id}</span>
                      <PriorityBadge priority={complaint.priority} />
                      <StatusBadge status={complaint.status} />
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                      {complaint.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{complaint.studentName}</span>
                      <span>•</span>
                      <span>{complaint.category}</span>
                      <span>•</span>
                      <span className="truncate max-w-xs">{complaint.location}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">
                        Filed {format(new Date(complaint.dateFiled), 'MMM d')}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={`/authority/complaints/${complaint.id}`}
                    className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <span>Take Action</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Priority Queue Clear</h3>
                <p className="text-xs text-slate-500">No urgent or high-priority complaints pending action!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Department Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Department Workload</h2>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Tickets by Dept</p>
            
            <div className="space-y-4">
              {deptCounts.map(dept => {
                const percent = Math.round((dept.count / maxDeptCount) * 100);
                return (
                  <div key={dept.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 truncate max-w-[180px]">{dept.name}</span>
                      <span className="font-bold text-slate-900">{dept.count} open</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(8, percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Link 
              href="/authority/analytics" 
              className="mt-6 block text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-xl transition-colors"
            >
              View Full Analytics Breakdown
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
