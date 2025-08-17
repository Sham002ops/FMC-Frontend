import { BackendUrl } from "@/Config";
import axios from "axios";
import React, { useState } from "react";

interface RegExecutiveProps {
  setOpenExecutiveModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshExecutives?: () => void;
}

interface ExecutiveResponse {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  password?: string;
}

const RegisterExecutive: React.FC<RegExecutiveProps> = ({
  setOpenExecutiveModel,
  refreshExecutives,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [executiveData, setExecutiveData] = useState<ExecutiveResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${BackendUrl}/executive/register-executive`,
        { name, email, password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.executive;
      setExecutiveData({ ...data, password });
      setRegSuccessfull(true);
      if (refreshExecutives) refreshExecutives();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-2">
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden h-auto bg-orange-50 rounded-2xl shadow-xl flex flex-col items-center justify-center">
        {/* Gradient Decorations - hidden on mobile */}
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-orange-500 to-orange-700 rounded-full opacity-80" />
        <div className="hidden sm:block absolute bottom-0 -right-12 w-40 h-20 bg-gradient-to-tr from-orange-500 to-orange-700 rounded-full opacity-80" />

        {/* Header */}
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenExecutiveModel(false)}
        >
          ×
        </button>
        <div className="mt-10 mb-4 text-center">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-orange-900 to-orange-500 text-xl md:text-3xl">
            FINITE MARSHALL CLUB
          </div>
        </div>

        {/* Form & Success */}
        {!regSuccessfull ? (
          <div className="w-full px-4 pt-6 pb-10 max-w-sm mx-auto md:max-w-md">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-5">Register New Executive</h1>
            {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register Executive"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-sm mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-orange-800">Executive Registered Successfully 🎉</h1>
            {executiveData && (
              <div className="space-y-2 mb-6 text-left">
                <p>
                  <strong>Name:</strong> {executiveData.name}
                </p>
                <p>
                  <strong>Email:</strong> {executiveData.email}
                </p>
                <p>
                  <strong>Referral Code:</strong> {executiveData.referralCode}
                </p>
                <p>
                  <strong>Password:</strong> {executiveData.password}
                </p>
              </div>
            )}
            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={() => setOpenExecutiveModel(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterExecutive;
