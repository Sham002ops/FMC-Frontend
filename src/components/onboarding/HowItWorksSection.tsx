// src/components/HowItWorksSection.tsx
import React from 'react';
import {
  LucideUserCircle,
  LucideBookOpen,
  LucideFlaskConical,
  LucideZap,
  LucideTrendingUp,
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  color: string;
  shadowClass: string;
  borderClass: string;
  bgClass: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  tagline,
  description,
  color,
  shadowClass,
  borderClass,
  bgClass,
}) => (
  <div
    className={`rounded-2xl p-6 text-left shadow-md border-2 transition-all duration-300
    ${bgClass} ${borderClass} hover:${shadowClass} hover:scale-[1.02]`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className={`text-xs font-semibold uppercase text-${color}-500`}>{tagline}</p>
      </div>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-10 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
         <h1 className="text-transparent text-6xl mb-4 font-extrabold bg-clip-text bg-gradient-to-r from-blue-700 to-green-400">
             Find Seminars-Near You
            </h1>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Each branch represents a key area of holistic development — blending ancient wisdom with modern innovation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <FeatureCard
            icon={<LucideUserCircle size={28} />}
            title="Yoga"
            tagline="Balance the Inner Self"
            description="Explore harmony through mindful movement, breathwork, and spiritual alignment. Yoga nurtures your body, mind, and soul."
            color="green"
            shadowClass="shadow-green-300"
            borderClass="border-green-200 hover:border-green-400"
            bgClass="bg-green-50"
          />
          <FeatureCard
            icon={<LucideBookOpen size={28} />}
            title="Education"
            tagline="Learn. Lead. Transform."
            description="Lifelong learning powered by innovative curricula, empowering individuals to lead with clarity and purpose."
            color="blue"
            shadowClass="shadow-blue-300"
            borderClass="border-blue-200 hover:border-blue-400"
            bgClass="bg-blue-50"
          />
          <FeatureCard
            icon={<LucideFlaskConical size={28} />}
            title="Biotech"
            tagline="Science for Life"
            description="Cutting-edge advancements in life sciences, agriculture, and health — inspiring sustainable solutions for future generations."
            color="purple"
            shadowClass="shadow-purple-300"
            borderClass="border-purple-200 hover:border-purple-400"
            bgClass="bg-purple-50"
          />
          <FeatureCard
            icon={<LucideZap size={28} />}
            title="Power"
            tagline="Empowering Tomorrow"
            description="Green energy, solar innovation, and conscious power generation — shaping a self-reliant and sustainable future."
            color="yellow"
            shadowClass="shadow-yellow-300"
            borderClass="border-yellow-200 hover:border-yellow-400"
            bgClass="bg-yellow-50"
          />
          <FeatureCard
            icon={<LucideTrendingUp size={28} />}
            title="Wealth"
            tagline="Prosperity Through Purpose"
            description="Smart finance, digital tools, and purposeful growth that help individuals and communities thrive holistically."
            color="orange"
            shadowClass="shadow-orange-300"
            borderClass="border-orange-200 hover:border-orange-400"
            bgClass="bg-orange-50"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
