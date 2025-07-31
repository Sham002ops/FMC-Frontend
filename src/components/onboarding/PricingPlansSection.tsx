// src/components/PricingPlansSection.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Elite",
    price: "₹1999",
    features: [
      "2  Webinar/week",
      "Access to Community",
      "Limited Support",
      "Topics covered : ",
      "Yoga, Career development, health and wellness",
    ],
  },
  {
    name: "Gold",
    price: "₹4999",
    highlighted: true,
    features: [
      "5 Webinars/week",
      "Priority Support",
      "Webinar Replays",
      "Topics covered : ",
      "Basic + digital marketing, Biotechnology,",
      "Access to Community",
    ],
  },
  {
    name: "Premium",
    price: "₹9999",
    features: [
      "All Upcoming Webinars",
      "1-on-1 Mentoring",
      "Topics covered : ",
      "Elite +  AI, ML, product demonstrations",
      "Recorded Sessions",
      "All Plus Features",

    ],
  },
];

const PricingPlansSection: React.FC = () => {
  return (
    <section id='packages' className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-gray-600 mb-12">
          Choose a plan that fits your learning goals. Upgrade anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 shadow-sm ${
                plan.highlighted ? "border-primary shadow-md" : "border-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
              <ul className="text-left space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlighted ? "default" : "outline"} className="w-full border-2 hover:bg-blue-700 hover:text-white border-blue-700">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlansSection;
