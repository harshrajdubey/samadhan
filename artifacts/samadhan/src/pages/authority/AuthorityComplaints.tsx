import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useStore, Category, Status, Priority } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  Download, 
  UserCheck, 
  CheckCircle2, 
  Trash2,
  Inbox,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AuthorityComplaints() {
  const [, setLocation] = useLocation();
  const { 
    complaints, 
    officers, 
    bulkAssign, 
    bulkUpdateStatus, 
    exportToCSV 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk actions state
  const [bulkOfficer, setBulkOfficer] = useState('');
  const [bulkStatus, setBulkStatus] = useState<Status | ''>('');

  // Check URL search param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');
      if (searchParam) {
        setSearchTerm(searchParam);
      }
    }
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.dateFiled).getTime() - new Date(a.dateFiled).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.dateFiled).getTime() - new Date(b.dateFiled).getTime();
    }
    if (sortBy === 'priority') {
      const pMap: Record<Priority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    }
    return 0;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredComplaints.length && filteredComplaints.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredComplaints.map(c => c.id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleApplyBulkAssign = () => {
    if (!bulkOfficer) return;
    bulkAssign(Array.from(selectedIds), bulkOfficer);
    setSelectedIds(new Set());
    setBulkOfficer('');
  };

  const handleApplyBulkStatus = () => {
    if (!bulkStatus) return;
    bulkUpdateStatus(Array.from(selectedIds), bulkStatus as Status);
    setSelectedIds(new Set());
    setBulkStatus('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Grievance Queue</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Displaying {filteredComplaints.length} of {complaints.length} total campus grievances.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => exportToCSV(filteredComplaints)}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-2xs"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Keyword Search */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, title, student, room..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium"
            />
          </div>
          
          {/* Status Filter */}
          <div className="lg:col-span-3 relative">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3 relative">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
            >
              <option value="All">All Categories</option>
              <option value="Hostel Maintenance">Hostel Maintenance</option>
              <option value="Mess Food">Mess Food</option>
              <option value="Water & Utilities">Water & Utilities</option>
              <option value="Academic & Administrative">Academic & Admin</option>
              <option value="Campus Infrastructure">Campus Infrastructure</option>
              <option value="Medical & Student Welfare">Medical & Welfare</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2 relative">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="priority">Sort: Priority</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl animate-in slide-in-from-bottom-2 border border-slate-800">
          <div className="flex items-center gap-2 pl-2">
            <span className="h-6 px-2 bg-indigo-500 rounded-full text-xs font-extrabold flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="text-xs font-bold">complaints selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Bulk Assign */}
            <div className="flex items-center gap-1.5">
              <select 
                value={bulkOfficer}
                onChange={(e) => setBulkOfficer(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- Assign to Officer --</option>
                {officers.map(o => (
                  <option key={o.id} value={o.name}>{o.name} ({o.department})</option>
                ))}
              </select>
              <button 
                onClick={handleApplyBulkAssign}
                disabled={!bulkOfficer}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                Assign
              </button>
            </div>

            {/* Bulk Status Update */}
            <div className="flex items-center gap-1.5">
              <select 
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value as Status)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="">-- Update Status --</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <button 
                onClick={handleApplyBulkStatus}
                disabled={!bulkStatus}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
              >
                Update
              </button>
            </div>

            <button 
              onClick={() => setSelectedIds(new Set())}
              className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Master Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                    checked={selectedIds.size === filteredComplaints.length && filteredComplaints.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 font-bold">Complaint Title & ID</th>
                <th className="px-4 py-4 font-bold">Student / Department</th>
                <th className="px-4 py-4 font-bold">Assigned Officer</th>
                <th className="px-4 py-4 font-bold">Filed On</th>
                <th className="px-4 py-4 font-bold">Status & Priority</th>
                <th className="px-4 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id} 
                    onClick={() => setLocation(`/authority/complaints/${complaint.id}`)}
                    className={cn(
                      "hover:bg-slate-50/80 transition-colors group cursor-pointer",
                      selectedIds.has(complaint.id) ? "bg-indigo-50/30" : ""
                    )}
                  >
                    <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                        checked={selectedIds.has(complaint.id)}
                        onChange={(e) => toggleSelect(complaint.id, e as any)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-0.5 max-w-[280px] truncate" title={complaint.title}>
                        {complaint.title}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {complaint.id} <span className="mx-1">•</span> <span className="font-medium text-slate-700">{complaint.category}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-bold text-slate-900">{complaint.studentName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{complaint.location}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-semibold text-indigo-700 truncate max-w-[160px]">
                        {complaint.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap font-medium">
                      {format(new Date(complaint.dateFiled), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap space-y-1">
                      <div><StatusBadge status={complaint.status} /></div>
                      <div><PriorityBadge priority={complaint.priority} /></div>
                    </td>
                    <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/authority/complaints/${complaint.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Inbox className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-slate-900">No complaints match your filters</h3>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the keyword search or category filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
