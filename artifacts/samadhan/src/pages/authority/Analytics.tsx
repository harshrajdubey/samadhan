import React from 'react';
import { useStore } from '@/lib/store';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PieChart as PieIcon,
  Activity
} from 'lucide-react';

export default function Analytics() {
  const { complaints } = useStore();
  
  // 1. Status Distribution
  const statusCounts = complaints.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#64748b', '#0284c7', '#7c3aed', '#d97706', '#059669', '#52525b'];

  // 2. Category Distribution
  const categoryCounts = complaints.reduce((acc, curr) => {
    let catName: string = curr.category;
    if (catName === 'Academic & Administrative') catName = 'Academic & Admin';
    if (catName === 'Medical & Student Welfare') catName = 'Medical & Welfare';
    
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 3. Priority Distribution
  const priorityCounts = complaints.reduce((acc, curr) => {
    acc[curr.priority] = (acc[curr.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const priorityData = [
    { name: 'Urgent', value: priorityCounts['Urgent'] || 0, color: '#e11d48' },
    { name: 'High', value: priorityCounts['High'] || 0, color: '#ea580c' },
    { name: 'Medium', value: priorityCounts['Medium'] || 0, color: '#d97706' },
    { name: 'Low', value: priorityCounts['Low'] || 0, color: '#64748b' }
  ];

  // 4. Simulated resolution trends over past 7 days
  const trendData = [
    { day: 'Mon', submitted: 4, resolved: 3 },
    { day: 'Tue', submitted: 7, resolved: 5 },
    { day: 'Wed', submitted: 5, resolved: 6 },
    { day: 'Thu', submitted: 9, resolved: 8 },
    { day: 'Fri', submitted: 6, resolved: 7 },
    { day: 'Sat', submitted: 3, resolved: 4 },
    { day: 'Sun', submitted: complaints.filter(c => c.status === 'Submitted').length, resolved: complaints.filter(c => c.status === 'Resolved').length },
  ];

  const total = complaints.length;
  const resolved = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const resolutionPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Institutional Analytics</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Performance metrics, turnaround velocity, and grievance density across campus sectors.
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Resolution Rate</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{resolutionPercentage}%</h3>
            <p className="text-xs text-slate-400 mt-1">{resolved} of {total} grievances resolved</p>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Turnaround Time</p>
            <h3 className="text-3xl font-extrabold text-indigo-600 mt-1">1.8 Days</h3>
            <p className="text-xs text-slate-400 mt-1">From submission to resolved stage</p>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urgent Grievances</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{priorityCounts['Urgent'] || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Prioritized emergency queue</p>
          </div>
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <AlertCircle className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-xs text-slate-400">Total volume distributed by functional sector</p>
            </div>
            <BarChart3 className="h-5 w-5 text-indigo-600" />
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{fontSize: 11, fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 11, fill: '#334155'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Donut Pie Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Status Distribution</h3>
              <p className="text-xs text-slate-400">Active tickets across 6 workflow stages</p>
            </div>
            <PieIcon className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="h-72 w-full flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full sm:w-1/2 flex flex-col gap-2.5 pl-0 sm:pl-4 mt-4 sm:mt-0">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-slate-600 font-medium">{entry.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Volume Trends */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Throughput & Velocity</h3>
              <p className="text-xs text-slate-400">Comparison of incoming complaints vs successfully resolved tickets</p>
            </div>
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{fill: '#64748b', fontSize: 11}} tickMargin={10} axisLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 11}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="submitted" 
                  name="New Filed" 
                  stroke="#d97706" 
                  strokeWidth={3} 
                  dot={{r: 4, strokeWidth: 2}} 
                  activeDot={{r: 6}} 
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  name="Resolved" 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{r: 4, strokeWidth: 2}} 
                  activeDot={{r: 6}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
