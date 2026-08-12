import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useStore, PRESET_USERS } from '@/lib/store';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Users, 
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Home,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthorityLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { currentUser, switchUser, notifications, complaints } = useStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const authorityUsers = PRESET_USERS.filter(u => u.role === 'authority');
  const unreadCount = notifications.filter(n => !n.read && (n.targetRole === 'authority' || n.targetRole === 'all')).length;

  const navItems = [
    { href: '/authority', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/authority/complaints', label: 'All Complaints', icon: Inbox, badge: complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length },
    { href: '/authority/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/authority/officers', label: 'Manage Officers', icon: Users },
  ];

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      const match = complaints.find(c => c.id.toLowerCase() === quickSearch.trim().toLowerCase());
      if (match) {
        setLocation(`/authority/complaints/${match.id}`);
      } else {
        setLocation(`/authority/complaints?search=${encodeURIComponent(quickSearch.trim())}`);
      }
      setQuickSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white">SAMADHAN</span>
            <span className="text-[10px] text-indigo-400 block -mt-1 font-medium">Authority Portal</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col md:min-h-screen z-20 border-r border-slate-800 transition-all",
        isMobileNavOpen ? "block fixed inset-0 z-50 overflow-y-auto" : "hidden md:flex md:sticky md:top-0"
      )}>
        {/* Brand Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 bg-indigo-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">SAMADHAN</h1>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 mt-1">Authority Portal</p>
            </div>
          </Link>
          {isMobileNavOpen && (
            <button onClick={() => setIsMobileNavOpen(false)} className="md:hidden text-slate-400 p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Officer Persona Switcher */}
        <div className="p-4 border-b border-slate-800/80 relative">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 px-1">
            Active Authority Account
          </label>
          
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full text-left p-3 bg-slate-900/90 hover:bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between transition-all group shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {currentUser.role === 'authority' ? currentUser.name.replace('Dr. ', '').replace('Mr. ', '').charAt(0) : 'DS'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {currentUser.role === 'authority' ? currentUser.name : 'Dr. Sharma'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.department || 'Hall Warden'}</p>
              </div>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform shrink-0", isUserMenuOpen ? "rotate-180" : "")} />
          </button>

          {/* Persona Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95">
              <p className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase">Switch Officer</p>
              {authorityUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user);
                    setIsUserMenuOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors",
                    currentUser.id === user.id ? "bg-indigo-600 text-white font-bold" : "text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <span className="truncate">{user.name} ({user.department})</span>
                  {currentUser.id === user.id && <Sparkles className="h-3 w-3 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/authority' && location.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                    isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400")} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="h-5 px-1.5 bg-amber-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link 
            href="/student"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <GraduationCap className="h-4 w-4 text-blue-400" />
            <span>Switch to Student Portal</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shrink-0 shadow-2xs">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-900 hidden sm:block">
              {navItems.find(i => i.href === location)?.label || 'Authority Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Quick Search */}
            <form onSubmit={handleQuickSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Jump to ID (e.g. 04712)..." 
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-48 sm:w-64 pl-8 pr-4 py-1.5 bg-slate-100/90 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </form>

            {/* Quick Stats Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{complaints.filter(c => ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(c.status)).length} Active Issues</span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Body */}
        <div className="flex-1 md:overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/60">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
