import { BackendUrl } from "@/Config";
import axios from "axios";
import { Send, X, User, Mail, Lock, Phone, MapPin, Hash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface RegMentorProps {
  setOpenMentorModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUser?: () => void;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  password?: string;
}

const RegMentor: React.FC<RegMentorProps> = ({
  setOpenMentorModel,
  refreshUser,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [userData, setUserData] = useState<UserResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token is missing. Please log in again.");
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BackendUrl}/admin/reg-mentor`,
        {
          name,
          email,
          password,
          role: "MENTOR",
          number: number || undefined,
          address: address || undefined,
          pinCode: pinCode || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data.user;
      setUserData({ ...data, password });
      setRegSuccessfull(true);
      toast.success("Mentor registered successfully!");
      if (refreshUser) refreshUser();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenMentorModel(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {regSuccessfull ? "Registration Successful" : "Register New Mentor"}
              </h2>
              <p className="text-purple-100 text-sm">
                {regSuccessfull ? "Credentials ready to share" : "Fill in the mentor details"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!regSuccessfull ? (
            <div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          placeholder="mentor@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          placeholder="Create password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                    Contact Information (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          placeholder="+91 9876543210"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <div className="relative">
                        <div className="absolute top-2 left-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          placeholder="Enter complete address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[70px]"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PIN / ZIP Code
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="400001"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          pattern="[0-9]{4,10}"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Registering..." : "Register Mentor"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-4">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Mentor Registered Successfully!
              </h3>

              {userData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="space-y-3 text-left">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm font-semibold text-gray-600">Name:</span>
                      <span className="col-span-2 text-sm text-gray-900">{userData.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm font-semibold text-gray-600">Email:</span>
                      <span className="col-span-2 text-sm text-gray-900 break-all">
                        {userData.email}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm font-semibold text-gray-600">Password:</span>
                      <span className="col-span-2 text-sm text-gray-900 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                        {userData.password}
                      </span>
                    </div>

                    {userData.number && (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                        <span className="text-sm font-semibold text-gray-600">Phone:</span>
                        <span className="col-span-2 text-sm text-gray-900">
                          {userData.number}
                        </span>
                      </div>
                    )}
                    {userData.address && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-semibold text-gray-600">Address:</span>
                        <span className="col-span-2 text-sm text-gray-900">
                          {userData.address}
                        </span>
                      </div>
                    )}
                    {userData.pinCode && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm font-semibold text-gray-600">PIN Code:</span>
                        <span className="col-span-2 text-sm text-gray-900">
                          {userData.pinCode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Mail Credentials
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Please share these credentials with the mentor securely
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegMentor;
