// src/components/TestimonialsSection.tsx
import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Verma",
    role: "Marketing Lead @ BrandBoost",
    feedback:
      "WebinarHub has made hosting and managing webinars a breeze. Our engagement rates have doubled!",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "John Carter",
    role: "Product Manager @ SaaSPro",
    feedback:
      "I love the analytics dashboard — it's detailed, easy to use, and gives us exactly what we need.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Priya Reddy",
    role: "Founder @ EduLaunch",
    feedback:
      "The real-time chat and Q&A features are game changers for live sessions. Highly recommend!",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-14">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 border rounded-2xl shadow-md bg-gray-50 flex flex-col items-center text-left"
            >
              <Quote className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-700 text-sm mb-6 italic">
                “{testimonial.feedback}”
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
