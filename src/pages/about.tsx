import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">About Finite Marshall Club</h1>

        <p className="text-gray-700 mb-4">
          Finite Marshall Club (FMC) is a platform that connects users with
          impactful seminars, webinars, and educational programs across areas
          such as Yoga, Education, Biotech, Power, and Wealth.
        </p>

        <p className="text-gray-700 mb-4">
          Our mission is to enable <strong>Holistic Progress Through
          Innovation</strong> by offering structured, high-quality learning
          sessions to students, professionals, and individuals seeking personal
          growth.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          What FMC Provides
        </h2>

        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Easy seminar & webinar booking</li>
          <li>Full yearly yoga schedules</li>
          <li>Membership-based access (Elite, Gold, Premium)</li>
          <li>User dashboard for tracking sessions</li>
          <li>Executive dashboard for managing referrals</li>
          <li>Admin portal for complete platform control</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Our Process</h2>
        <p className="text-gray-700 mb-4">
          Course and package purchases are handled offline through certified FMC
          executives. The platform does not operate a payment gateway, ensuring
          simplicity and accessibility.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p className="text-gray-700">
          For all inquiries, support, collaborations, or assistance: <br />
          <strong>finitemarshallclub@outlook.com</strong>
        </p>
      </div>
    </div>
  );
};

export default About;
