import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COMPLAINTS as INITIAL_COMPLAINTS, OFFICERS as INITIAL_OFFICERS, CATEGORIES } from '@/data/mockData';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'Submitted' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export type Category = 
  | 'Hostel Maintenance' 
  | 'Mess Food' 
  | 'Water & Utilities' 
  | 'Academic & Administrative' 
  | 'Campus Infrastructure' 
  | 'Medical & Student Welfare';

export interface TimelineEvent {
  stage: Status;
  timestamp: string;
  remarks?: string;
  author?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface Feedback {
  rating: number; // 1 to 5
  comment?: string;
  submittedAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: Category;
  subCategory: string;
  location: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dateFiled: string;
  assignedTo?: string;
  timeline: TimelineEvent[];
  attachments?: Attachment[];
  feedback?: Feedback;
}

export interface Officer {
  id: number;
  name: string;
  role: string;
  department: string;
  active: number;
  resolved: number;
  status: 'Active' | 'Away' | 'On Leave';
  email?: string;
  phone?: string;
}

export interface AppNotification {
  id: string;
  type: 'status' | 'remark' | 'assignment' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  complaintId?: string;
  targetRole?: 'student' | 'authority' | 'all';
}

export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'authority';
  rollNumber?: string;
  department?: string;
  email: string;
}

export const PRESET_USERS: UserProfile[] = [
  { id: '24MF10006', name: 'Harsh Raj Dubey', role: 'student', rollNumber: '24MF10006', department: 'Manufacturing Engineering', email: 'harsh.dubey@iitkgp.ac.in' },
  { id: '24AR10014', name: 'Aayan Nawaz', role: 'student', rollNumber: '24AR10014', department: 'Architecture & Regional Planning', email: 'aayan.nawaz@iitkgp.ac.in' },
  { id: '24MF10031', name: 'Harshita', role: 'student', rollNumber: '24MF10031', department: 'Manufacturing Engineering', email: 'harshita@iitkgp.ac.in' },
  { id: '24MF10036', name: 'Jatin Khubani', role: 'student', rollNumber: '24MF10036', department: 'Manufacturing Engineering', email: 'jatin.khubani@iitkgp.ac.in' },
  { id: 'OFF-1001', name: 'Dr. Sharma', role: 'authority', department: 'Hostel Administration', email: 'warden.sharma@iitkgp.ac.in' },
  { id: 'OFF-1002', name: 'Mr. Verma', role: 'authority', department: 'Estate Office', email: 'estate.verma@iitkgp.ac.in' }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'status',
    title: 'Complaint Resolved',
    message: 'Your complaint SMD-2024-04713 regarding "Stale bread served" has been marked as resolved.',
    time: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    complaintId: 'SMD-2024-04713',
    targetRole: 'student'
  },
  {
    id: 'notif-2',
    type: 'remark',
    title: 'New Official Remark',
    message: 'Mrs. Gupta added a remark: "Vendor penalized. Quality check added before serving."',
    time: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    read: false,
    complaintId: 'SMD-2024-04713',
    targetRole: 'student'
  },
  {
    id: 'notif-3',
    type: 'assignment',
    title: 'Technician Assigned',
    message: 'Your complaint SMD-2024-04712 has been assigned to Mr. Verma (Estate Office).',
    time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    complaintId: 'SMD-2024-04712',
    targetRole: 'student'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'System Notice',
    message: 'SAMADHAN digital portal upgraded with instant tracking & live updates.',
    time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    read: true,
    targetRole: 'all'
  }
];

const STORAGE_KEYS = {
  COMPLAINTS: 'samadhan_v3_complaints',
  OFFICERS: 'samadhan_v3_officers',
  NOTIFICATIONS: 'samadhan_v3_notifications',
  USER: 'samadhan_v3_current_user'
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error('Error reading localStorage key', key, err);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('samadhan-store-updated', { detail: { key } }));
  } catch (err) {
    console.error('Error writing localStorage key', key, err);
  }
}

interface StoreContextType {
  complaints: Complaint[];
  officers: Officer[];
  notifications: AppNotification[];
  currentUser: UserProfile;
  createComplaint: (data: {
    title: string;
    description: string;
    category: Category;
    subCategory: string;
    location: string;
    priority: Priority;
    attachments?: Attachment[];
  }) => string;
  updateStatus: (id: string, newStatus: Status, remarks?: string, author?: string, notifyStudent?: boolean) => void;
  assignOfficer: (id: string, officerName: string, remarks?: string, author?: string, notifyStudent?: boolean) => void;
  addRemark: (id: string, remarks: string, author: string, notifyStudent?: boolean) => void;
  confirmResolution: (id: string) => void;
  reopenComplaint: (id: string, reason: string) => void;
  submitFeedback: (id: string, rating: number, comment?: string) => void;
  bulkAssign: (ids: string[], officerName: string) => void;
  bulkUpdateStatus: (ids: string[], newStatus: Status) => void;
  deleteComplaint: (id: string) => void;
  addOfficer: (officer: Omit<Officer, 'id' | 'active' | 'resolved'>) => void;
  updateOfficer: (id: number, updates: Partial<Officer>) => void;
  deleteOfficer: (id: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  switchUser: (user: UserProfile) => void;
  exportToCSV: (complaintsToExport?: Complaint[]) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaintsState] = useState<Complaint[]>(() =>
    getStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS)
  );
  
  const [officers, setOfficersState] = useState<Officer[]>(() =>
    getStorage<Officer[]>(STORAGE_KEYS.OFFICERS, INITIAL_OFFICERS as Officer[])
  );

  const [notifications, setNotificationsState] = useState<AppNotification[]>(() =>
    getStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() =>
    getStorage<UserProfile>(STORAGE_KEYS.USER, PRESET_USERS[0])
  );

  // Sync state with localStorage
  const setComplaints = useCallback((updater: Complaint[] | ((prev: Complaint[]) => Complaint[])) => {
    setComplaintsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setStorage(STORAGE_KEYS.COMPLAINTS, next);
      return next;
    });
  }, []);

  const setOfficers = useCallback((updater: Officer[] | ((prev: Officer[]) => Officer[])) => {
    setOfficersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setStorage(STORAGE_KEYS.OFFICERS, next);
      return next;
    });
  }, []);

  const setNotifications = useCallback((updater: AppNotification[] | ((prev: AppNotification[]) => AppNotification[])) => {
    setNotificationsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setStorage(STORAGE_KEYS.NOTIFICATIONS, next);
      return next;
    });
  }, []);

  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user);
    setStorage(STORAGE_KEYS.USER, user);
  }, []);

  // Listen to cross-tab / window storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setComplaintsState(getStorage<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS));
      setOfficersState(getStorage<Officer[]>(STORAGE_KEYS.OFFICERS, INITIAL_OFFICERS as Officer[]));
      setNotificationsState(getStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
      setCurrentUserState(getStorage<UserProfile>(STORAGE_KEYS.USER, PRESET_USERS[0]));
    };

    window.addEventListener('samadhan-store-updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('samadhan-store-updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Recalculate officer workloads based on live complaints
  useEffect(() => {
    setOfficersState(prevOfficers => {
      const updated = prevOfficers.map(off => {
        const activeCount = complaints.filter(c => c.assignedTo?.includes(off.name) && !['Resolved', 'Closed'].includes(c.status)).length;
        const resolvedCount = complaints.filter(c => c.assignedTo?.includes(off.name) && ['Resolved', 'Closed'].includes(c.status)).length;
        return {
          ...off,
          active: activeCount + (off.active > 10 ? 5 : 0),
          resolved: resolvedCount + (off.resolved > 50 ? off.resolved : 10)
        };
      });
      return updated;
    });
  }, [complaints]);

  // Actions
  const createComplaint = useCallback((data: {
    title: string;
    description: string;
    category: Category;
    subCategory: string;
    location: string;
    priority: Priority;
    attachments?: Attachment[];
  }): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `SMD-2024-${randomNum}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: newId,
      studentId: currentUser.rollNumber || currentUser.id,
      studentName: currentUser.name,
      category: data.category,
      subCategory: data.subCategory,
      location: data.location,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'Submitted',
      dateFiled: now,
      attachments: data.attachments || [],
      timeline: [
        {
          stage: 'Submitted',
          timestamp: now,
          remarks: 'Complaint registered via student portal.',
          author: currentUser.name
        }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);

    // Create confirmation notification
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'status',
      title: 'Complaint Registered',
      message: `Your complaint "${data.title}" has been filed under ID ${newId}.`,
      time: now,
      read: false,
      complaintId: newId,
      targetRole: 'student'
    };

    setNotifications(prev => [newNotification, ...prev]);

    return newId;
  }, [currentUser, setComplaints, setNotifications]);

  const updateStatus = useCallback((
    id: string,
    newStatus: Status,
    remarks?: string,
    author?: string,
    notifyStudent: boolean = true
  ) => {
    const now = new Date().toISOString();
    const actor = author || currentUser.name;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const newTimeline = [
          ...c.timeline,
          {
            stage: newStatus,
            timestamp: now,
            remarks: remarks || `Status transitioned to ${newStatus}.`,
            author: actor
          }
        ];
        return {
          ...c,
          status: newStatus,
          timeline: newTimeline
        };
      })
    );

    if (notifyStudent) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'status',
        title: `Complaint Status: ${newStatus}`,
        message: remarks ? `Status updated to "${newStatus}": ${remarks}` : `Status for complaint ${id} is now ${newStatus}.`,
        time: now,
        read: false,
        complaintId: id,
        targetRole: 'student'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  }, [currentUser, setComplaints, setNotifications]);

  const assignOfficer = useCallback((
    id: string,
    officerName: string,
    remarks?: string,
    author?: string,
    notifyStudent: boolean = true
  ) => {
    const now = new Date().toISOString();
    const actor = author || currentUser.name;

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const newStatus: Status = c.status === 'Submitted' ? 'Assigned' : c.status;
        return {
          ...c,
          status: newStatus,
          assignedTo: officerName,
          timeline: [
            ...c.timeline,
            {
              stage: newStatus,
              timestamp: now,
              remarks: remarks || `Assigned to ${officerName}.`,
              author: actor
            }
          ]
        };
      })
    );

    if (notifyStudent) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'assignment',
        title: 'Officer Assigned',
        message: `Your complaint ${id} has been assigned to ${officerName}.`,
        time: now,
        read: false,
        complaintId: id,
        targetRole: 'student'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  }, [currentUser, setComplaints, setNotifications]);

  const addRemark = useCallback((
    id: string,
    remarks: string,
    author: string,
    notifyStudent: boolean = true
  ) => {
    const now = new Date().toISOString();

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          timeline: [
            ...c.timeline,
            {
              stage: c.status,
              timestamp: now,
              remarks,
              author
            }
          ]
        };
      })
    );

    if (notifyStudent) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'remark',
        title: 'New Official Remark',
        message: `${author}: "${remarks}"`,
        time: now,
        read: false,
        complaintId: id,
        targetRole: 'student'
      };
      setNotifications(prev => [notif, ...prev]);
    }
  }, [setComplaints, setNotifications]);

  const confirmResolution = useCallback((id: string) => {
    updateStatus(id, 'Closed', 'Student verified and confirmed resolution.', currentUser.name, false);
  }, [currentUser, updateStatus]);

  const reopenComplaint = useCallback((id: string, reason: string) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: 'Under Review',
          timeline: [
            ...c.timeline,
            {
              stage: 'Under Review',
              timestamp: now,
              remarks: `Reopened by student: "${reason}"`,
              author: currentUser.name
            }
          ]
        };
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'status',
      title: 'Complaint Reopened',
      message: `Complaint ${id} was reopened by student with note: "${reason}".`,
      time: now,
      read: false,
      complaintId: id,
      targetRole: 'authority'
    };
    setNotifications(prev => [notif, ...prev]);
  }, [currentUser, setComplaints, setNotifications]);

  const submitFeedback = useCallback((id: string, rating: number, comment?: string) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        return {
          ...c,
          feedback: {
            rating,
            comment,
            submittedAt: now
          }
        };
      })
    );
  }, [setComplaints]);

  const bulkAssign = useCallback((ids: string[], officerName: string) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (!ids.includes(c.id)) return c;
        return {
          ...c,
          status: c.status === 'Submitted' ? 'Assigned' : c.status,
          assignedTo: officerName,
          timeline: [
            ...c.timeline,
            {
              stage: c.status === 'Submitted' ? 'Assigned' : c.status,
              timestamp: now,
              remarks: `Bulk assigned to ${officerName}.`,
              author: currentUser.name
            }
          ]
        };
      })
    );
  }, [currentUser, setComplaints]);

  const bulkUpdateStatus = useCallback((ids: string[], newStatus: Status) => {
    const now = new Date().toISOString();
    setComplaints(prev =>
      prev.map(c => {
        if (!ids.includes(c.id)) return c;
        return {
          ...c,
          status: newStatus,
          timeline: [
            ...c.timeline,
            {
              stage: newStatus,
              timestamp: now,
              remarks: `Bulk status update to ${newStatus}.`,
              author: currentUser.name
            }
          ]
        };
      })
    );
  }, [currentUser, setComplaints]);

  const deleteComplaint = useCallback((id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  }, [setComplaints]);

  const addOfficer = useCallback((officerData: Omit<Officer, 'id' | 'active' | 'resolved'>) => {
    setOfficers(prev => {
      const nextId = Math.max(...prev.map(o => o.id), 0) + 1;
      const newOff: Officer = {
        ...officerData,
        id: nextId,
        active: 0,
        resolved: 0
      };
      return [...prev, newOff];
    });
  }, [setOfficers]);

  const updateOfficer = useCallback((id: number, updates: Partial<Officer>) => {
    setOfficers(prev =>
      prev.map(o => (o.id === id ? { ...o, ...updates } : o))
    );
  }, [setOfficers]);

  const deleteOfficer = useCallback((id: number) => {
    setOfficers(prev => prev.filter(o => o.id !== id));
  }, [setOfficers]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  const exportToCSV = useCallback((complaintsToExport?: Complaint[]) => {
    const data = complaintsToExport || complaints;
    const headers = ['ID', 'Title', 'Student Name', 'Student ID', 'Category', 'SubCategory', 'Location', 'Priority', 'Status', 'Date Filed', 'Assigned To'];
    
    const rows = data.map(c => [
      `"${c.id}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${(c.studentName || '').replace(/"/g, '""')}"`,
      `"${c.studentId}"`,
      `"${c.category}"`,
      `"${c.subCategory}"`,
      `"${(c.location || '').replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.dateFiled}"`,
      `"${(c.assignedTo || 'Unassigned').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samadhan_complaints_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [complaints]);

  const resetToDefaults = useCallback(() => {
    setComplaints(INITIAL_COMPLAINTS);
    setOfficers(INITIAL_OFFICERS as Officer[]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(PRESET_USERS[0]);
  }, [setComplaints, setOfficers, setNotifications, setCurrentUser]);

  return (
    <StoreContext.Provider
      value={{
        complaints,
        officers,
        notifications,
        currentUser,
        createComplaint,
        updateStatus,
        assignOfficer,
        addRemark,
        confirmResolution,
        reopenComplaint,
        submitFeedback,
        bulkAssign,
        bulkUpdateStatus,
        deleteComplaint,
        addOfficer,
        updateOfficer,
        deleteOfficer,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        switchUser: setCurrentUser,
        exportToCSV,
        resetToDefaults
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
