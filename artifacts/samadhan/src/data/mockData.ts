export interface TimelineEvent {
  stage: "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  timestamp: string;
  remarks?: string;
  author?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: "Hostel Maintenance" | "Mess Food" | "Water & Utilities" | "Academic & Administrative" | "Campus Infrastructure" | "Medical & Student Welfare";
  subCategory: string;
  location: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  dateFiled: string;
  assignedTo?: string;
  timeline: TimelineEvent[];
  attachments?: Attachment[];
}

export const COMPLAINTS: Complaint[] = [
  {
    id: "SMD-2024-04712",
    studentId: "24MF10006",
    studentName: "Harsh Raj Dubey",
    category: "Hostel Maintenance",
    subCategory: "Plumbing",
    location: "Azad Hall, D-Block, Room 214",
    title: "Leaking pipe in washroom",
    description: "The main water pipe in the D-block 2nd-floor washroom has been leaking continuously since yesterday. Water is pooling near the entrance, making it difficult to use.",
    priority: "High",
    status: "In Progress",
    dateFiled: "2024-03-12T08:30:00Z",
    assignedTo: "Mr. Verma (Estate Office)",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-12T08:30:00Z" },
      { stage: "Under Review", timestamp: "2024-03-12T10:15:00Z", remarks: "Noted, forwarding to Estate office.", author: "Dr. Sharma" },
      { stage: "Assigned", timestamp: "2024-03-12T14:20:00Z", remarks: "Assigned to D-block maintenance staff.", author: "Mr. Verma" },
      { stage: "In Progress", timestamp: "2024-03-13T09:00:00Z", remarks: "Staff is currently inspecting the leakage.", author: "Mr. Verma" }
    ]
  },
  {
    id: "SMD-2024-04713",
    studentId: "24AR10014",
    studentName: "Aayan Nawaz",
    category: "Mess Food",
    subCategory: "Food Quality",
    location: "Nehru Hall Mess",
    title: "Stale bread served during breakfast",
    description: "The bread served during today's breakfast had visible mold spots. Several students noticed it. This is a recurring issue.",
    priority: "Urgent",
    status: "Resolved",
    dateFiled: "2024-03-14T02:15:00Z",
    assignedTo: "Mrs. Gupta (Mess Committee)",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-14T02:15:00Z" },
      { stage: "Under Review", timestamp: "2024-03-14T03:00:00Z", remarks: "Flagged immediately to mess contractor.", author: "Mrs. Gupta" },
      { stage: "Assigned", timestamp: "2024-03-14T03:30:00Z", remarks: "Contractor asked to replace entire batch.", author: "Mrs. Gupta" },
      { stage: "In Progress", timestamp: "2024-03-14T04:00:00Z", remarks: "Fresh bread procured from alternative vendor.", author: "Mrs. Gupta" },
      { stage: "Resolved", timestamp: "2024-03-14T08:00:00Z", remarks: "Vendor penalized. Quality check added before serving.", author: "Mrs. Gupta" }
    ]
  },
  {
    id: "SMD-2024-04714",
    studentId: "24MF10031",
    studentName: "Harshita",
    category: "Water & Utilities",
    subCategory: "WiFi",
    location: "RK Hall",
    title: "No WiFi connectivity in C-wing",
    description: "The router in C-wing seems to be down since last night. Multiple students have reported being unable to connect to the campus network.",
    priority: "Medium",
    status: "Assigned",
    dateFiled: "2024-03-15T01:20:00Z",
    assignedTo: "CIC Network Team",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-15T01:20:00Z" },
      { stage: "Under Review", timestamp: "2024-03-15T09:00:00Z", remarks: "Checking switch status at CIC.", author: "CIC Admin" },
      { stage: "Assigned", timestamp: "2024-03-15T11:30:00Z", remarks: "Technician dispatched to check physical router.", author: "CIC Admin" }
    ]
  },
  {
    id: "SMD-2024-04715",
    studentId: "24MF10036",
    studentName: "Jatin Khubani",
    category: "Campus Infrastructure",
    subCategory: "Lighting",
    location: "Path from Vikramshila to Main Building",
    title: "Streetlights not working on main path",
    description: "Three consecutive streetlights on the path between Vikramshila and the Main Building are out. It gets very dark after 7 PM.",
    priority: "Low",
    status: "Submitted",
    dateFiled: "2024-03-16T15:45:00Z",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-16T15:45:00Z" }
    ]
  },
  {
    id: "SMD-2024-04716",
    studentId: "24MF10006",
    studentName: "Harsh Raj Dubey",
    category: "Academic & Administrative",
    subCategory: "Approvals",
    location: "Mechanical Dept",
    title: "Delay in No Dues clearance",
    description: "My No Dues application has been stuck at the department level for 2 weeks. Need this cleared urgently for my internship.",
    priority: "High",
    status: "Closed",
    dateFiled: "2024-02-28T04:10:00Z",
    assignedTo: "Dept Admin",
    timeline: [
      { stage: "Submitted", timestamp: "2024-02-28T04:10:00Z" },
      { stage: "Under Review", timestamp: "2024-02-28T10:00:00Z" },
      { stage: "Assigned", timestamp: "2024-02-29T11:00:00Z" },
      { stage: "In Progress", timestamp: "2024-03-01T09:00:00Z" },
      { stage: "Resolved", timestamp: "2024-03-02T14:00:00Z", remarks: "Clearance approved.", author: "Dept Admin" },
      { stage: "Closed", timestamp: "2024-03-03T10:00:00Z" }
    ]
  },
  {
    id: "SMD-2024-04717",
    studentId: "24AR10014",
    studentName: "Aayan Nawaz",
    category: "Medical & Student Welfare",
    subCategory: "Medical Facility",
    location: "BC Roy Technology Hospital",
    title: "Pharmacy ran out of basic allergy meds",
    description: "Visited the hospital pharmacy today, they are completely out of Cetirizine and other basic anti-allergens. Peak pollen season.",
    priority: "Medium",
    status: "Under Review",
    dateFiled: "2024-03-16T10:30:00Z",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-16T10:30:00Z" },
      { stage: "Under Review", timestamp: "2024-03-16T12:00:00Z", remarks: "Checking inventory status with pharmacy head.", author: "Dr. Roy" }
    ]
  },
  {
    id: "SMD-2024-04718",
    studentId: "24MF10031",
    studentName: "Harshita",
    category: "Hostel Maintenance",
    subCategory: "Furniture",
    location: "LLR Hall, Room 102",
    title: "Broken study table",
    description: "One leg of the study table provided in the room is broken. Needs replacement.",
    priority: "Low",
    status: "Closed",
    dateFiled: "2024-01-15T09:00:00Z",
    assignedTo: "Hall Manager",
    timeline: [
      { stage: "Submitted", timestamp: "2024-01-15T09:00:00Z" },
      { stage: "Under Review", timestamp: "2024-01-15T11:00:00Z" },
      { stage: "Assigned", timestamp: "2024-01-16T10:00:00Z" },
      { stage: "In Progress", timestamp: "2024-01-17T14:00:00Z" },
      { stage: "Resolved", timestamp: "2024-01-18T16:00:00Z", remarks: "Replaced with new table.", author: "Hall Manager" },
      { stage: "Closed", timestamp: "2024-01-20T10:00:00Z" }
    ]
  },
  {
    id: "SMD-2024-04719",
    studentId: "24MF10036",
    studentName: "Jatin Khubani",
    category: "Mess Food",
    subCategory: "Hygiene",
    location: "Patel Hall Mess",
    title: "Unclean plates in the mess",
    description: "Several plates in the clean stack still had food residue on them during dinner service.",
    priority: "High",
    status: "Resolved",
    dateFiled: "2024-03-10T14:30:00Z",
    assignedTo: "Mess Warden",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-10T14:30:00Z" },
      { stage: "Under Review", timestamp: "2024-03-11T09:00:00Z" },
      { stage: "Assigned", timestamp: "2024-03-11T10:30:00Z" },
      { stage: "In Progress", timestamp: "2024-03-11T16:00:00Z" },
      { stage: "Resolved", timestamp: "2024-03-12T11:00:00Z", remarks: "Dishwashing staff warned. Extra checks implemented.", author: "Mess Warden" }
    ]
  },
  {
    id: "SMD-2024-04720",
    studentId: "24MF10006",
    studentName: "Harsh Raj Dubey",
    category: "Water & Utilities",
    subCategory: "Drinking Water",
    location: "Vikramshila V2",
    title: "Water cooler not functioning",
    description: "The water cooler on the second floor of V-block is dispensing warm water.",
    priority: "Medium",
    status: "Assigned",
    dateFiled: "2024-03-15T08:00:00Z",
    assignedTo: "Estate Maintenance",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-15T08:00:00Z" },
      { stage: "Under Review", timestamp: "2024-03-15T11:00:00Z" },
      { stage: "Assigned", timestamp: "2024-03-16T09:00:00Z" }
    ]
  },
  {
    id: "SMD-2024-04721",
    studentId: "24AR10014",
    studentName: "Aayan Nawaz",
    category: "Campus Infrastructure",
    subCategory: "Sports Facilities",
    location: "Jnan Ghosh Stadium",
    title: "Torn nets on basketball court",
    description: "The nets on both hoops of the outdoor basketball court are completely torn.",
    priority: "Low",
    status: "In Progress",
    dateFiled: "2024-03-05T16:00:00Z",
    assignedTo: "Sports Officer",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-05T16:00:00Z" },
      { stage: "Under Review", timestamp: "2024-03-06T10:00:00Z" },
      { stage: "Assigned", timestamp: "2024-03-07T11:00:00Z" },
      { stage: "In Progress", timestamp: "2024-03-14T09:00:00Z", remarks: "Nets ordered, waiting for delivery.", author: "Sports Officer" }
    ]
  },
  {
    id: "SMD-2024-04722",
    studentId: "24MF10031",
    studentName: "Harshita",
    category: "Academic & Administrative",
    subCategory: "Scholarship",
    location: "Main Building",
    title: "MCM Scholarship disbursement delayed",
    description: "The MCM scholarship for last semester hasn't been credited yet despite document verification.",
    priority: "High",
    status: "Under Review",
    dateFiled: "2024-03-16T05:00:00Z",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-16T05:00:00Z" },
      { stage: "Under Review", timestamp: "2024-03-16T14:00:00Z", remarks: "Checking status with accounts department.", author: "Academic Section" }
    ]
  },
  {
    id: "SMD-2024-04723",
    studentId: "24MF10036",
    studentName: "Jatin Khubani",
    category: "Hostel Maintenance",
    subCategory: "Electrical",
    location: "LBS Hall, Room 304",
    title: "Fan regulator not working",
    description: "The fan in my room is stuck at maximum speed. The regulator knob is broken.",
    priority: "Low",
    status: "Submitted",
    dateFiled: "2024-03-17T02:00:00Z",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-17T02:00:00Z" }
    ]
  },
  {
    id: "SMD-2024-04724",
    studentId: "24MF10006",
    studentName: "Harsh Raj Dubey",
    category: "Mess Food",
    subCategory: "Menu",
    location: "SN/IG Hall Mess",
    title: "Lack of vegan options",
    description: "There are very limited vegan options in the standard menu. Most curries have paneer or ghee.",
    priority: "Low",
    status: "Closed",
    dateFiled: "2024-02-10T10:00:00Z",
    assignedTo: "Mess Committee",
    timeline: [
      { stage: "Submitted", timestamp: "2024-02-10T10:00:00Z" },
      { stage: "Under Review", timestamp: "2024-02-11T09:00:00Z" },
      { stage: "Assigned", timestamp: "2024-02-12T11:00:00Z" },
      { stage: "In Progress", timestamp: "2024-02-15T16:00:00Z" },
      { stage: "Resolved", timestamp: "2024-02-20T14:00:00Z", remarks: "Added soy/tofu alternatives on designated days.", author: "Mess Committee" },
      { stage: "Closed", timestamp: "2024-02-25T09:00:00Z" }
    ]
  },
  {
    id: "SMD-2024-04725",
    studentId: "24AR10014",
    studentName: "Aayan Nawaz",
    category: "Water & Utilities",
    subCategory: "Electricity",
    location: "MMM Hall",
    title: "Frequent power cuts during night",
    description: "Experiencing multiple power cuts between 1 AM and 4 AM for the past week.",
    priority: "High",
    status: "In Progress",
    dateFiled: "2024-03-12T04:30:00Z",
    assignedTo: "Power Distribution Team",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-12T04:30:00Z" },
      { stage: "Under Review", timestamp: "2024-03-12T09:00:00Z" },
      { stage: "Assigned", timestamp: "2024-03-12T11:30:00Z" },
      { stage: "In Progress", timestamp: "2024-03-13T10:00:00Z", remarks: "Investigating transformer load issues in the sector.", author: "Power Team" }
    ]
  },
  {
    id: "SMD-2024-04726",
    studentId: "24MF10031",
    studentName: "Harshita",
    category: "Medical & Student Welfare",
    subCategory: "Counseling",
    location: "Counseling Center",
    title: "Delay in getting appointment",
    description: "Requested an appointment online but haven't received a slot even after 4 days.",
    priority: "Urgent",
    status: "Resolved",
    dateFiled: "2024-03-14T06:00:00Z",
    assignedTo: "Counseling Head",
    timeline: [
      { stage: "Submitted", timestamp: "2024-03-14T06:00:00Z" },
      { stage: "Under Review", timestamp: "2024-03-14T07:00:00Z" },
      { stage: "Assigned", timestamp: "2024-03-14T08:00:00Z" },
      { stage: "In Progress", timestamp: "2024-03-14T09:00:00Z" },
      { stage: "Resolved", timestamp: "2024-03-14T11:00:00Z", remarks: "Priority slot allocated. System glitch fixed.", author: "Counseling Head" }
    ]
  }
];

export const CATEGORIES = {
  "Hostel Maintenance": ["Plumbing", "Electrical", "Furniture", "Drainage", "Washroom"],
  "Mess Food": ["Food Quality", "Hygiene", "Menu", "Portions"],
  "Water & Utilities": ["Water Supply", "Drinking Water", "WiFi", "Electricity"],
  "Academic & Administrative": ["Faculty Advisor", "Scholarship", "Examination", "Certificate", "Approvals"],
  "Campus Infrastructure": ["Roads", "Lighting", "Dustbins", "Sports Facilities", "Common Spaces"],
  "Medical & Student Welfare": ["Medical Facility", "Counseling", "Ambulance", "Accessibility"]
};

export const OFFICERS = [
  { id: 1, name: "Dr. Sharma", role: "Hall Warden", department: "Hostel Maintenance", active: 12, resolved: 145, status: "Active" },
  { id: 2, name: "Mr. Verma", role: "Estate Manager", department: "Estate Office", active: 24, resolved: 312, status: "Active" },
  { id: 3, name: "Mrs. Gupta", role: "Mess Committee Head", department: "Student Welfare", active: 5, resolved: 89, status: "Active" },
  { id: 4, name: "Dr. Roy", role: "Chief Medical Officer", department: "Hospital", active: 3, resolved: 210, status: "Active" },
  { id: 5, name: "Prof. Das", role: "Dean of Students", department: "Administration", active: 8, resolved: 176, status: "Away" }
];
