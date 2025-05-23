// src/components/RealTimeFeaturesSection.tsx
import React from "react";
import { MessageCircle, RefreshCw, Users, Zap } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Instant Updates",
    description: "Webinar data syncs live across all devices in real-time.",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: "Live Chat",
    description: "Participants can interact with speakers and each other instantly.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Audience Polls",
    description: "Engage users with live polls and get real-time feedback.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-primary" />,
    title: "Auto Refresh",
    description: "No need to reload — content updates automatically.",
  },
];

const RealTimeFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Real-Time Features
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 border rounded-2xl shadow-sm"
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

export default RealTimeFeaturesSection;
