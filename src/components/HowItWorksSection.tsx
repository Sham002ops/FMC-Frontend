// src/components/HowItWorksSection.tsx
import React from 'react';
import { LucideSearch, LucideCalendarCheck2, LucideLaptop2 } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition">
    <div className="flex justify-center items-center w-12 h-12 mx-auto mb-4 text-indigo-600">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const HowItWorksSection: React.FC = () => {
  return (
    <section id='how-it-works' className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 mb-12">
          Our platform makes it easy to discover, register, and attend webinars that
          match your interests and goals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<LucideSearch size={32} />}
            title="Browse Webinars"
            description="Find webinars and seminars in your areas of interest like biotech, yoga, wellness, and more."
          />
          <FeatureCard
            icon={<LucideCalendarCheck2 size={32} />}
            title="Choose Package"
            description="Select from our Basic, Plus, or Premium packages to enjoy different levels of access and features."
          />
          <FeatureCard
            icon={<LucideLaptop2 size={32} />}
            title="Attend & Learn"
            description="Join live sessions, interact with experts, and enhance your skills with our interactive platform."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
