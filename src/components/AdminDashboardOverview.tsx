// src/components/AdminDashboardOverview.tsx
import React from "react";
import { BarChart3, CalendarCheck, Users2, Video } from "lucide-react";

const dashboardFeatures = [
  {
    icon: <CalendarCheck className="w-6 h-6 text-primary" />,
    title: "Schedule Webinars",
    description: "Create, edit, and publish upcoming webinars in just a few clicks.",
  },
  {
    icon: <Users2 className="w-6 h-6 text-primary" />,
    title: "Manage Attendees",
    description: "Track registrations, manage participants, and segment users.",
  },
  {
    icon: <Video className="w-6 h-6 text-primary" />,
    title: "Media Library",
    description: "Store and reuse webinar recordings and promotional assets.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: "Analytics Dashboard",
    description: "Get insights into attendee engagement and webinar performance.",
  },
];

const AdminDashboardOverview: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Admin Dashboard Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {dashboardFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 border rounded-2xl shadow-sm bg-white"
            >
              <div>{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardOverview;
