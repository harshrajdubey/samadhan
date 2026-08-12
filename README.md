# SAMADHAN | Centralized Grievance Redressal System

Digital grievance redressal portal built for the IIT Kharagpur campus community. The application provides a 6-stage grievance resolution workflow for students and campus authorities with stage tracking, audit trails, and role-based management.

Repository: [https://github.com/harshrajdubey/samadhan.git](https://github.com/harshrajdubey/samadhan.git)  
Production Deployment: [https://samadhan.hrd.qzz.io](https://samadhan.hrd.qzz.io)

---

## Core Features

### Student Portal
- **Grievance Submission**: Form with category/sub-category dropdowns, location details, priority selection, and attachment support.
- **Ticket Generation**: Automated tracking ticket generation (e.g. `SMD-2024-04712`).
- **6-Stage Milestone Tracker**: Visual stage progression (`Submitted` -> `Under Review` -> `Assigned` -> `In Progress` -> `Resolved` -> `Closed`).
- **Audit Log & Remarks**: Timestamped activity stream showing actions and remarks by authorities.
- **Follow-up Comments**: Ability for students to post follow-up notes directly to the ticket timeline.
- **Verification & Reopening**: Students can confirm resolution to close the ticket or reopen it with comments if unsatisfied.
- **Feedback & Rating**: 5-star rating and review submission upon resolution.
- **Real-Time Notifications**: Unread notifications panel with direct navigation to updated tickets.

### Authority Portal
- **Dashboard & KPIs**: Overview of active grievances, pending reviews, urgent tickets, and departmental workload distribution.
- **Grievance Management**: Filter by category, status, and priority with keyword search and sorting.
- **Bulk Operations**: Bulk officer assignment and bulk status transitions across selected tickets.
- **Action Panel**: Update ticket status, delegate to officers, add official remarks, and trigger student notifications.
- **Officer Directory**: Workload metrics (active vs. resolved tickets) with Add, Edit, and Delete officer capabilities.
- **Institutional Analytics**: Chart visualisations for category volume, status breakdown, and throughput trends.
- **CSV Export**: Export filtered or all complaint records directly to CSV.

### Built-in Persona Switcher
Switch between different accounts directly from the sidebar:
- Harsh Raj Dubey (`24MF10006`) - Manufacturing Engineering
- Aayan Nawaz (`24AR10014`) - Architecture & Regional Planning
- Harshita (`24MF10031`) - Manufacturing Engineering
- Jatin Khubani (`24MF10036`) - Manufacturing Engineering
- Dr. Sharma - Hall Warden (Hostel Administration)
- Mr. Verma - Estate Manager (Estate Office)

---

## Tech Stack

- **Framework**: React 18, TypeScript, Vite 7
- **Routing**: Wouter
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **State Management**: React Context with LocalStorage persistence
- **Charts**: Recharts
- **Utilities**: date-fns, clsx, tailwind-merge

---

## Project Structure

```
Samadhan-Dashboard/
├── artifacts/
│   └── samadhan/              # React frontend application
│       ├── src/
│       │   ├── components/    # Badges, timeline, and shared UI components
│       │   ├── data/          # Seed data and category definitions
│       │   ├── lib/           # Persistent store and utilities
│       │   ├── pages/
│       │   │   ├── Landing.tsx
│       │   │   ├── student/   # Student dashboard, filing, and tracking
│       │   │   └── authority/ # Authority dashboard, queue, and analytics
│       │   ├── App.tsx
│       │   └── index.css
│       ├── package.json
│       └── vite.config.ts
├── vercel.json                # Vercel deployment configuration
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## Local Development

### Requirements
- Node.js >= 18.0.0
- pnpm >= 9.0.0

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/harshrajdubey/samadhan.git
   cd samadhan
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:5173/` in your browser.

4. Build for production:
   ```bash
   pnpm build
   ```

---

## Contributors

- Harsh Raj Dubey (`24MF10006`) - IIT Kharagpur
- Aayan Nawaz (`24AR10014`) - IIT Kharagpur
- Harshita (`24MF10031`) - IIT Kharagpur
- Jatin Khubani (`24MF10036`) - IIT Kharagpur

---

## License

MIT License. See `LICENSE` for details.

