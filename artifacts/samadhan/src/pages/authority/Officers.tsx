import React, { useState } from 'react';
import { useStore, Officer } from '@/lib/store';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  CheckCircle2, 
  X,
  Phone,
  Mail,
  Building,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Officers() {
  const { officers, addOfficer, updateOfficer, deleteOfficer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDepartment, setFormDepartment] = useState('Hostel Maintenance');
  const [formStatus, setFormStatus] = useState<'Active' | 'Away' | 'On Leave'>('Active');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const filteredOfficers = officers.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormName('');
    setFormRole('');
    setFormDepartment('Hostel Maintenance');
    setFormStatus('Active');
    setFormEmail('');
    setFormPhone('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormName(officer.name);
    setFormRole(officer.role);
    setFormDepartment(officer.department);
    setFormStatus(officer.status);
    setFormEmail(officer.email || '');
    setFormPhone(officer.phone || '');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) return;

    addOfficer({
      name: formName.trim(),
      role: formRole.trim(),
      department: formDepartment,
      status: formStatus,
      email: formEmail.trim() || `${formName.toLowerCase().replace(/[^a-z]/g, '')}@iitkgp.ac.in`,
      phone: formPhone.trim() || '03222-280000'
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer || !formName.trim() || !formRole.trim()) return;

    updateOfficer(editingOfficer.id, {
      name: formName.trim(),
      role: formRole.trim(),
      department: formDepartment,
      status: formStatus,
      email: formEmail.trim(),
      phone: formPhone.trim()
    });

    setEditingOfficer(null);
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the authority officer directory?`)) {
      deleteOfficer(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Authority Directory</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage hall wardens, estate managers, mess committee heads, and technicians.
          </p>
        </div>

        <button 
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Officer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by officer name, department, or role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium"
          />
        </div>
      </div>

      {/* Officers Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Officer Profile</th>
                <th className="px-6 py-4 font-bold">Department & Role</th>
                <th className="px-6 py-4 font-bold text-center">Active Workload</th>
                <th className="px-6 py-4 font-bold text-center">Total Resolved</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {officer.name.replace('Dr. ', '').replace('Mr. ', '').replace('Mrs. ', '').replace('Prof. ', '').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{officer.name}</div>
                        <div className="text-xs text-slate-400 font-mono">OFF-{1000 + officer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-900">{officer.department}</div>
                    <div className="text-[11px] text-slate-500">{officer.role}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs border border-blue-200">
                      {officer.active} open
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700 text-xs">
                    {officer.resolved}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                      officer.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : officer.status === 'Away'
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}>
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        officer.status === 'Active' ? "bg-emerald-500" : officer.status === 'Away' ? "bg-amber-500" : "bg-slate-400"
                      )} />
                      {officer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleOpenEdit(officer)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                        title="Edit Officer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(officer.id, officer.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                        title="Remove Officer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOfficers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-xs">
                    No officers match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Officer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Add New Authority Personnel</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dr. A. K. Sen"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Role Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Hall Warden / Estate Mgr"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Department</label>
                  <select 
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="Hostel Maintenance">Hostel Maintenance</option>
                    <option value="Mess Food">Mess Food</option>
                    <option value="Water & Utilities">Water & Utilities</option>
                    <option value="Estate Office">Estate Office</option>
                    <option value="Hospital">Hospital / Medical</option>
                    <option value="Academic Section">Academic Section</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Away">Away</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Phone Helpline</label>
                  <input 
                    type="text" 
                    placeholder="03222-28XXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm"
                >
                  Add Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Officer Modal */}
      {editingOfficer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-lg font-bold text-slate-900">Edit Officer Profile</h3>
              <button onClick={() => setEditingOfficer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Role Title</label>
                  <input 
                    type="text" 
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Department</label>
                  <input 
                    type="text" 
                    required
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Status</label>
                <select 
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Away">Away</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
