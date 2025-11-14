import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="text-gray-700 mb-4">
          This Privacy Policy explains how Finite Marshall Club (“FMC”, “we”,
          “our”) collects, uses, and protects your information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="text-gray-700 mb-4">
          We collect only the information necessary for login, booking, and
          providing our services:
        </p>

        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Login history</li>
          <li>Webinar / seminar interactions</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. No Financial Information Collected
        </h2>
        <p className="text-gray-700 mb-4">
          FMC does <strong>not collect or process</strong> any financial data.
          No debit/credit card details, UPI, banking information, or online
          payment records are handled by the website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. How We Use Your Information
        </h2>

        <ul className="list-disc ml-6 text-gray-700 mb-4">
          <li>To create and manage your account</li>
          <li>To allow booking of sessions</li>
          <li>To send email notifications (via AWS SES)</li>
          <li>To improve the platform</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Email Sending & AWS SES
        </h2>
        <p className="text-gray-700 mb-4">
          Transactional and login-related emails are sent using AWS Simple Email
          Service (SES). We do not sell or share your email with third parties.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Data Storage & Security
        </h2>
        <p className="text-gray-700 mb-4">
          All data is stored securely on our servers and protected by industry
          standard measures. We do not store sensitive personal information.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Cookies & Analytics
        </h2>
        <p className="text-gray-700 mb-4">
          FMC may use basic cookies for session management. No tracking,
          marketing, or advertisement cookies are used.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          7. Third-Party Sharing
        </h2>
        <p className="text-gray-700 mb-4">
          We do not sell user data. Information may be shared only with trusted
          partners for essential operations (e.g., AWS SES for email delivery).
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
        <p className="text-gray-700">
          For privacy-related questions, email us at: <br />
          <strong>finitemarshallclub@outlook.com</strong>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
