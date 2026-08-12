import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useStore, Category, Priority, Attachment } from '@/lib/store';
import { CATEGORIES } from '@/data/mockData';
import { 
  UploadCloud, 
  X, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  ShieldAlert,
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NewComplaint() {
  const [, setLocation] = useLocation();
  const { createComplaint, currentUser } = useStore();

  const [category, setCategory] = useState<Category | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [locationName, setLocationName] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type || 'application/octet-stream'
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const addSampleAttachment = () => {
    const samples: Attachment[] = [
      { name: 'photo_evidence_hall.jpg', size: '1.8 MB', type: 'image/jpeg' },
      { name: 'maintenance_receipt.pdf', size: '0.6 MB', type: 'application/pdf' }
    ];
    setAttachments(prev => [...prev, samples[prev.length % samples.length]]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subCategory || !locationName.trim() || !title.trim() || !description.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate brief network latency for rich feeling
    setTimeout(() => {
      const newId = createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        subCategory,
        location: locationName.trim(),
        priority,
        attachments
      });

      setIsSubmitting(false);
      setGeneratedId(newId);
      setIsSuccess(true);
    }, 800);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-6 animate-in zoom-in-95 duration-400">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl text-center relative overflow-hidden">
          <div className="mx-auto h-20 w-20 bg-emerald-100/80 border-4 border-emerald-50 rounded-3xl flex items-center justify-center mb-6 text-emerald-600 shadow-md">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
            Complaint Registered Successfully!
          </h2>
          
          <p className="text-slate-600 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Your grievance has been submitted into the SAMADHAN portal under your student roll <span className="font-semibold text-slate-900">{currentUser.rollNumber || currentUser.id}</span>. It is now queued for authority review.
          </p>
          
          {/* Generated ID Badge */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200 inline-block shadow-inner">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Tracking ID</p>
            <p className="text-3xl font-mono font-extrabold text-indigo-600 tracking-wider select-all">{generatedId}</p>
            <p className="text-[11px] text-slate-400 mt-1">Keep this ID handy to check real-time progress</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3.5">
            <button 
              onClick={() => setLocation(`/student/complaints/${generatedId}`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <span>Track Complaint Status</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => {
                setIsSuccess(false);
                setCategory('');
                setSubCategory('');
                setLocationName('');
                setTitle('');
                setDescription('');
                setAttachments([]);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              File Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">File New Grievance</h1>
        <p className="text-slate-500 text-sm mt-1">
          Submit details about your campus issue. Accurate details allow relevant hall wardens and estate officers to resolve it faster.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          
          {/* Section 1: Classification */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-base font-bold text-slate-900">Category & Location</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select 
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as Category;
                    setCategory(newCat);
                    setSubCategory('');
                  }}
                >
                  <option value="" disabled>-- Select a category --</option>
                  {Object.keys(CATEGORIES).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sub-Category <span className="text-rose-500">*</span>
                </label>
                <select 
                  required
                  disabled={!category}
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400 font-medium cursor-pointer"
                >
                  <option value="" disabled>-- Select sub-category --</option>
                  {category && CATEGORIES[category as keyof typeof CATEGORIES]?.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Exact Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Azad Hall, D-Block, Room 214"
                    className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Priority Level <span className="text-rose-500">*</span>
                </label>
                <select 
                  required
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                >
                  <option value="Low">Low - Minor inconvenience</option>
                  <option value="Medium">Medium - Normal workflow issue</option>
                  <option value="High">High - Impedes daily student activities</option>
                  <option value="Urgent">Urgent - Severe hazard / emergency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="text-base font-bold text-slate-900">Complaint Details</h3>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Summary Title <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue (e.g. Water pipe leakage in C-wing)"
                maxLength={120}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea 
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, when it started, and specific context to help the repair team..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none placeholder:text-slate-400 leading-relaxed font-normal"
              />
            </div>
          </div>

          {/* Section 3: Attachments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-base font-bold text-slate-900">Supporting Evidence (Optional)</h3>
              </div>
              <button 
                type="button" 
                onClick={addSampleAttachment}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Sample Photo</span>
              </button>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              multiple 
              className="hidden" 
              accept="image/*,.pdf"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group"
            >
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-blue-600 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 mb-0.5">Click to upload photos or documents</p>
              <p className="text-xs text-slate-500">Supports JPG, PNG, PDF (Up to 10MB per file)</p>
            </div>

            {/* Attached file list */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Attached Files ({attachments.length})</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-2xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-2 bg-blue-100/60 rounded-lg text-blue-600 shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500">{file.size}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3.5">
            <button 
              type="button"
              onClick={() => window.history.back()}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "px-8 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md flex items-center gap-2",
                isSubmitting ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/25 hover:scale-[1.02]"
              )}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Submitting Grievance...</span>
                </>
              ) : (
                <>
                  <span>Submit Complaint</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
