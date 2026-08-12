import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useStore, Status, Priority } from '@/lib/store';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronRight, 
  PlusCircle, 
  Inbox,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function ComplaintsList() {
  const [, setLocation] = useLocation();
  const { complaints, currentUser } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  
  const myComplaints = complaints.filter(c => 
    c.studentId === currentUser.rollNumber || c.studentId === currentUser.id || c.studentName === currentUser.name
  );
  
  const filteredComplaints = myComplaints.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Complaints</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Tracking {myComplaints.length} grievances filed under student ID <span className="font-semibold text-slate-800">{currentUser.rollNumber || currentUser.id}</span>
          </p>
        </div>

        <Link 
          href="/student/new" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/25 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>File New Complaint</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, title, keyword, or room location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
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

          {/* Priority Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative flex-1 sm:flex-none">
            <select 
              className="w-full appearance-none pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredComplaints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">Complaint Title & ID</th>
                  <th className="px-6 py-4 font-bold">Category & Location</th>
                  <th className="px-6 py-4 font-bold">Filed On</th>
                  <th className="px-6 py-4 font-bold">Status & Priority</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id} 
                    onClick={() => setLocation(`/student/complaints/${complaint.id}`)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors max-w-sm truncate">
                        {complaint.title}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{complaint.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-xs">{complaint.category}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{complaint.location}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap font-medium">
                      {format(new Date(complaint.dateFiled), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-y-1">
                      <div><StatusBadge status={complaint.status} /></div>
                      <div><PriorityBadge priority={complaint.priority} /></div>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link 
                        href={`/student/complaints/${complaint.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No matching complaints</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {searchTerm || statusFilter !== 'All' || priorityFilter !== 'All' 
                ? 'Try clearing your filters or search keywords.' 
                : 'You have not submitted any complaints yet.'}
            </p>
            {(searchTerm || statusFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setPriorityFilter('All');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
