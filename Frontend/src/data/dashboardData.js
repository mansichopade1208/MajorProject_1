import {
  FileText,
  HeartPulse,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

export const quickAccessItems = [
  {
    title: "My Documents",
    description: "Upload and view medical reports",
    icon: FileText,
    iconBg: "bg-[#D9EEE4]",
    iconColor: "text-[#216B5C]",
    path: "/patient/documents",
  },
  {
    title: "Medical History",
    description: "Add your past conditions & medicines",
    icon: HeartPulse,
    iconBg: "bg-[#F5E7DC]",
    iconColor: "text-[#B87953]",
    path: "/patient/history",
  },
  {
    title: "My Complaints",
    description: "Describe your current symptoms",
    icon: MessageSquare,
    iconBg: "bg-[#D9EEE4]",
    iconColor: "text-[#216B5C]",
    path: "/patient/complaints",
  },
  {
    title: "My Consultations",
    description: "Check submission status",
    icon: ClipboardCheck,
    iconBg: "bg-[#EAE4F5]",
    iconColor: "text-[#7560A5]",
    path: "/patient/consultations",
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "Your consultation was submitted",
    date: "20 Oct 2026 · 11:45 AM",
    status: "Submitted",
    type: "consultation",
  },
  {
    id: 2,
    title: "Medical report uploaded",
    date: "18 Oct 2026 · 04:20 PM",
    status: "Uploaded",
    type: "document",
  },
  {
    id: 3,
    title: "Account created",
    date: "15 Oct 2026 · 10:30 AM",
    status: "Completed",
    type: "account",
  },
];