import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Search, MapPin, Tag, ArrowRight, ShieldCheck, Clock, CheckCircle2, FileText } from 'lucide-react';
import { ComplaintTimeline } from '@/components/ComplaintTimeline';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';
import { Link } from 'wouter';

export default function TrackComplaint() {
  const { complaints } = useStore();
  const [searchId, setSearchId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Check URL search param on load (e.g. from Landing page quick track)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('id');
      if (paramId) {
        setSearchId(paramId);
        setHasSearched(true);
      }
    }
  }, []);

  const trimmedQuery = searchId.trim().toUpperCase();
  const complaint = complaints.find(c => c.id.toUpperCase() === trimmedQuery || c.id.toUpperCase().includes(trimmedQuery));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setHasSearched(true);
    }
  };

  const recentIds = complaints.slice(0, 3).map(c => c.id);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="h-16 w-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <Search className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Grievance</h1>
        <p className="text-slate-500 text-sm">
          Enter any SAMADHAN ticket ID to view real-time resolution progress and authority remarks.
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-blue-500 rounded-2xl p-1.5 shadow-md focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <input 
            type="text" 
            placeholder="Enter ID (e.g. SMD-2024-04712)..." 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-4 pr-3 py-3 text-base font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none"
          />
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <span>Track</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!hasSearched && recentIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Recent sample tickets:</span>
            {recentIds.map(id => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSearchId(id);
                  setHasSearched(true);
                }}
                className="bg-white hover:bg-slate-50 text-blue-600 font-mono px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Results View */}
      {hasSearched && (
        <div className="animate-in slide-in-from-bottom-3 duration-400">
          {complaint ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              
              {/* Header Box */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Grievance Ticket</span>
                    <h2 className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{complaint.id}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-3">{complaint.title}</h3>
                
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    <span>{complaint.category} • {complaint.subCategory}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Filed: {format(new Date(complaint.dateFiled), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              {/* Timeline Progress */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-slate-900">Tracking Progress & Audit Trail</h3>
                  <Link 
                    href={`/student/complaints/${complaint.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Full Details & Actions</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <ComplaintTimeline 
                  timeline={complaint.timeline} 
                  currentStatus={complaint.status} 
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
              <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Ticket Not Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                No complaint matching "{searchId}" exists in the system. Double check the ID formatting (e.g. SMD-2024-XXXXX).
              </p>
              <button 
                onClick={() => setSearchId('')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Clear & Search Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
