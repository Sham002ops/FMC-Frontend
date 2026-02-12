import { BackendUrl } from "@/Config";
import axios from "axios";
import { UserPlus, Check, AlertCircle, Package as PackageIcon, Coins, Calendar, Sparkles, Code } from "lucide-react";
import React, { useState, useEffect } from "react";

interface RegUserProps {
  setOpenUserModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUser?: () => void;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  registrationId: string;
  status: string;
  requestedAt: string;
}

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  userCoins: number;
  validityDays: number;
  features: string[];
}

const RegUser: React.FC<RegUserProps> = ({
  setOpenUserModel,
  refreshUser,
}) => {
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageName, setPackageName] = useState("");
  const [password, setPassword] = useState("");
  const [executiveRefode, setExecutiveRefode] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessful, setRegSuccessful] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationResponse | null>(null);

  // Package States
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState("");

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setPackagesError("Admin token is missing.");
          setPackagesLoading(false);
          return;
        }

        const response = await axios.get(
          `${BackendUrl}/package/admin/allpackages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📦 Packages fetched:", response.data);
        setPackages(response.data.packages || []);
        setPackagesError("");
      } catch (err: any) {
        console.error("❌ Error fetching packages:", err);
        setPackagesError("Failed to load packages. Please try again.");
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

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

      const selectedPackage = packages.find((pkg) => pkg.name === packageName);
      if (!selectedPackage) {
        setError("Selected package not found. Please try again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BackendUrl}/executive/register-user`,
        {
          name,
          email,
          password,
          executiveRefode: executiveRefode || undefined,
          packageName,
          userCoins: selectedPackage.userCoins,
          number: number || undefined,
          dateOfBirth: dateOfBirth || undefined,
          address: address || undefined,
          pinCode: pinCode || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRegistrationData(response.data);
      setRegSuccessful(true);
      if (refreshUser) refreshUser();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = packages.find((pkg) => pkg.name === packageName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-60" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
          aria-label="Close modal"
          onClick={() => setOpenUserModel(false)}
        >
          <span className="text-2xl font-bold flex justify-center items-center pb-1">×</span>
        </button>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-y-auto flex-1">
          {!regSuccessful ? (
            <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
              {/* Left Column - Form */}
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Register New User
                      </h2>
                      <p className="text-sm text-gray-600">
                        Submit user registration for admin approval
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-900">
                      Admin registration with direct approval workflow
                    </span>
                  </div>
                </div>

                {/* Error Messages */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                {packagesError && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800">{packagesError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Password & Phone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      placeholder="Street, City, State"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                      rows={2}
                    />
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      placeholder="400001"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      pattern="[0-9]{4,10}"
                    />
                  </div>

                  {/* Package Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Package *
                    </label>
                    <select
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-none bg-white"
                      required
                      disabled={packagesLoading}
                    >
                      <option value="" disabled>
                        {packagesLoading ? "Loading..." : packages.length === 0 ? "No packages available" : "Choose a package"}
                      </option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.name}>
                          {pkg.name} - ₹{pkg.priceInCoins} ({pkg.validityDays} days)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Executive Referral Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-600" />
                      Executive Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Enter executive referral code"
                      value={executiveRefode}
                      onChange={(e) => setExecutiveRefode(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Link this user to an executive for commission tracking
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || packagesLoading || packages.length === 0}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Submit Registration Request
                      </span>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Column - Package Preview */}
              <div className="hidden md:block">
                <div className="sticky top-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Package Preview
                  </h3>

                  {selectedPackage ? (
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 space-y-4">
                      {/* Package Header */}
                      <div className="flex items-center justify-between pb-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                            <PackageIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {selectedPackage.name}
                            </h4>
                            <p className="text-sm text-gray-600">Premium Package</p>
                          </div>
                        </div>
                      </div>

                      {/* Package Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Coins className="w-5 h-5 text-green-600" />
                            <span className="text-xs font-medium text-green-900">User Coins</span>
                          </div>
                          <p className="text-2xl font-bold text-green-700">
                            {selectedPackage.userCoins?.toLocaleString() || 0}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-medium text-blue-900">Validity</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-700">
                            {selectedPackage.validityDays || 0}
                            <span className="text-sm font-normal ml-1">days</span>
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4 border border-emerald-200">
                        <p className="text-sm text-emerald-900 mb-1">Package Price</p>
                        <p className="text-3xl font-bold text-emerald-700">
                          ₹{selectedPackage.priceInCoins?.toLocaleString() || 0}
                        </p>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Package Features:
                        </p>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedPackage.features?.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </li>
                          )) || <li className="text-sm text-gray-500">No features available</li>}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                      <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Select a package to view details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Success State
            <div className="p-8 text-center space-y-6 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Registration Submitted! 🎉
                </h2>
                <p className="text-gray-600">
                  The user registration request has been sent for admin approval
                </p>
              </div>

              {registrationData && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 space-y-3 text-left shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <span className="text-sm font-medium text-emerald-900">Registration ID</span>
                    <span className="text-sm font-mono text-emerald-700 bg-white px-3 py-1 rounded-lg">
                      {registrationData.registrationId.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-900">Status</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      {registrationData.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-900">Submitted At</span>
                    <span className="text-sm text-gray-700">
                      {new Date(registrationData.requestedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      <strong>Note:</strong> User will receive their credentials via email once
                      approved by the Super Admin.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setRegSuccessful(false);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setPackageName("");
                    setExecutiveRefode("");
                    setNumber("");
                    setAddress("");
                    setPinCode("");
                    setDateOfBirth("");
                  }}
                  className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition shadow-md"
                >
                  Register Another User
                </button>
                <button
                  onClick={() => setOpenUserModel(false)}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegUser;
