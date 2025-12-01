// src/components/RealTimeFeaturesSection.tsx
import React from "react";
import { 
  Trophy, 
  Calendar, 
  Gift, 
  Users, 
  GraduationCap, 
  Coins,
  Award,
  Package
} from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    title: "Live Webinars",
    description: "Attend exclusive webinars hosted by expert mentors and earn coins for participation.",
  },
  {
    icon: <Coins className="w-6 h-6 text-primary" />,
    title: "Coin Rewards System",
    description: "Earn coins by attending webinars, referring friends, and completing activities.",
  },
  {
    icon: <Gift className="w-6 h-6 text-primary" />,
    title: "Redeem Products",
    description: "Use your earned coins to redeem amazing products and exclusive rewards.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Referral Program",
    description: "Executives can refer new users with unique codes and track their network growth.",
  },
  {
    icon: <Package className="w-6 h-6 text-primary" />,
    title: "Premium Packages",
    description: "Subscribe to premium packages for extended access and exclusive benefits.",
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Webinar Scheduling",
    description: "Browse upcoming webinars, register instantly, and never miss a session.",
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Achievement Tracking",
    description: "Track your webinar attendance, coin earnings, and learning progress over time.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-primary" />,
    title: "Multiple User Roles",
    description: "Join as a User, Executive, Mentor, or Admin with role-specific dashboards.",
  },
];

const RealTimeFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to learn, earn, and grow in the Finite Marshall Club community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealTimeFeaturesSection;
