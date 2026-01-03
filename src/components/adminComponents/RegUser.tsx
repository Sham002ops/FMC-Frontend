import { BackendUrl } from "@/Config";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useState, useEffect } from "react";

interface RegUserProps {
  setOpenUserModel: React.Dispatch<React.SetStateAction<boolean>>;
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

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  userCoins: number; // ✅ ADD THIS
  validityDays: number;
  features: string[];
  _count?: {
    users: number;
    userPackages: number;
    webinars: number;
  };
}

const RegUser: React.FC<RegUserProps> = ({
  setOpenUserModel,
  refreshUser,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageName, setPackageName] = useState("");
  const [password, setPassword] = useState("");
  const [executiveRefode, setExecutiveRefode] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [UserData, setUserData] = useState<UserResponse | null>(null);

  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
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

        setPackages(response.data.packages || []);
        setPackagesLoading(false);
      } catch (err: any) {
        console.error("Error fetching packages:", err);
        setPackagesError("Failed to load packages");
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

      // ✅ FIND THE SELECTED PACKAGE AND GET userCoins
      const selectedPackage = packages.find((pkg) => pkg.name === packageName);
      
      if (!selectedPackage) {
        setError("Selected package not found. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ SEND userCoins TO BACKEND
      const response = await axios.post(
        `${BackendUrl}/executive/register-user`,
        {
          name,
          email,
          password,
          executiveRefode,
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
      
      const data = response.data.user;
      setUserData({ ...data, password });
      setRegSuccessfull(true);
      if (refreshUser) refreshUser();
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
      <div className="relative w-full max-w-md md:max-w-xl xl:max-w-2xl overflow-hidden h-auto bg-gray-100 rounded-2xl shadow-xl flex flex-col items-center justify-center">
        {/* Gradient Decorations */}
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-teal-500 to-teal-700 rounded-full opacity-80" />
        <div className="hidden sm:block absolute bottom-0 -right-12 w-40 h-20 bg-gradient-to-tr from-teal-500 to-teal-700 rounded-full opacity-80" />

        {/* Header */}
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenUserModel(false)}
        >
          ×
        </button>
        <div className="mt-10 mb-4 text-center">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-teal-900 to-teal-500 text-xl md:text-3xl">
            FINITE MARSHALL CLUB
          </div>
        </div>

        {/* Form & Success */}
        {!regSuccessfull ? (
          <div className="w-full px-4 pt-6 pb-10 max-w-sm mx-auto md:max-w-md max-h-[70vh] overflow-y-auto">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-5">
              Register New User
            </h1>
            {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
            {packagesError && (
              <p className="text-orange-600 mb-3 text-center text-sm">
                {packagesError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                title="Enter valid phone number"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="Select your date of birth"
              />
              <textarea
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[60px]"
                rows={2}
              />
              <input
                type="text"
                placeholder="PIN Code (Optional)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                pattern="[0-9]{4,10}"
                title="Enter valid PIN code"
              />

              {/* ✅ Package Dropdown */}
              <div className="relative">
                <select
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none bg-white"
                  required
                  disabled={packagesLoading}
                >
                  <option value="" disabled>
                    {packagesLoading ? "Loading packages..." : "Select Package"}
                  </option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} - ₹{pkg.priceInCoins} ({pkg.validityDays} days)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              {/* ✅ Show Package Details INCLUDING userCoins */}
              {packageName && (
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-md text-sm">
                  {packages.find((pkg) => pkg.name === packageName) && (
                    <>
                      <p className="font-semibold text-teal-800 mb-1">
                        Package Details:
                      </p>
                      <p className="text-gray-700">
                        • Price:{" "}
                        ₹{packages.find((pkg) => pkg.name === packageName)?.priceInCoins}
                      </p>
                      <p className="text-gray-700">
                        • User Coins:{" "}
                        {packages.find((pkg) => pkg.name === packageName)?.userCoins} 🪙
                      </p>
                      <p className="text-gray-700">
                        • Validity:{" "}
                        {packages.find((pkg) => pkg.name === packageName)?.validityDays}{" "}
                        days
                      </p>
                      <p className="text-gray-700">
                        • Features:{" "}
                        {packages
                          .find((pkg) => pkg.name === packageName)
                          ?.features.join(", ")}
                      </p>
                    </>
                  )}
                </div>
              )}

              <input
                type="text"
                placeholder="Referral Code (Optional)"
                value={executiveRefode}
                onChange={(e) => setExecutiveRefode(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              <button
                type="submit"
                disabled={loading || packagesLoading}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register User"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-sm mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-teal-800">
              User Registered Successfully 🎉
            </h1>
            {UserData && (
              <div className="space-y-2 mb-6 text-left">
                <p>
                  <strong>Name:</strong> {UserData.name}
                </p>
                <p>
                  <strong>Email:</strong> {UserData.email}
                </p>
                <p>
                  <strong>Password:</strong> {UserData.password}
                </p>
                {UserData.number && (
                  <p>
                    <strong>Phone:</strong> {UserData.number}
                  </p>
                )}
                {UserData.address && (
                  <p>
                    <strong>Address:</strong> {UserData.address}
                  </p>
                )}
                {UserData.pinCode && (
                  <p>
                    <strong>PIN Code:</strong> {UserData.pinCode}
                  </p>
                )}
              </div>
            )}
            <button
              className="relative bg-gradient-to-tr from-teal-600 to-teal-400 border-none overflow-hidden cursor-pointer rounded-md px-6 py-2 flex justify-center items-center gap-2 text-white hover:scale-105 transition"
              onClick={() => setOpenUserModel(false)}
            >
              Mail Credentials <Send size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegUser;
