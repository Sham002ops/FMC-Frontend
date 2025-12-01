// src/components/PricingPlansSection.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Plan {
  name: string;
  price: string;
  validity: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Infa",
    price: "₹12,000 / year (20 years)",
    validity: "50 Years",
    features: [
      "Education",
      "Health",
      "Wealth",
    ],
  },
  {
    name: "Gold",
    price: "₹1,20,000 / lifetime",
    validity: "50 Years",
    highlighted: true,
    features: [
      "Education",
      "Health",
      "Wealth",
      "Power",
      "AI",
      "Entertainment",
    ],
  },
  {
    name: "Gold+",
    price: "₹5,00,000 / lifetime",
    validity: "50 Years",
    features: [
      "Gold features",
      "Extra premium events & mentorship",
    ],
  },
  {
    name: "Elite",
    price: "₹10,00,000 / lifetime",
    validity: "50 Years",
    features: [
      "Gold+ features",
      "Exclusive access to leadership programs",
    ],
  },
  {
    name: "Supreme",
    price: "₹1,00,00,000 / lifetime",
    validity: "50 Years",
    features: [
      "Elite features",
      "Private consultations & custom programs",
    ],
  },
];

const PricingPlansSection: React.FC = () => {

  const navigate = useNavigate();
  
  const handleRegister = () => {
    navigate("/login")
  }
  return (
    <section id='packages' className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
        <p className="text-gray-600 mb-12 text-sm md:text-base">
          Choose a plan that fits your learning and lifestyle goals. Upgrade anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-2xl p-6 shadow-sm flex flex-col justify-between ${
                plan.highlighted ? "border-blue-600 shadow-lg" : "border-gray-200"
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-2xl md:text-3xl font-bold text-blue-700 mb-2">{plan.price}</p>
                <p className="text-sm text-gray-500 mb-4">Validity: {plan.validity}</p>
                <ul className="text-left space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={handleRegister}
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full border-2 hover:bg-blue-700 hover:text-white border-blue-700"
              >
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
