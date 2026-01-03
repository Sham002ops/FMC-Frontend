import { BackendUrl } from "@/Config";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useState } from "react";

interface RegAdminProps {
  setOpenAdminModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshAdmin?: () => void;
}

interface AdminResponse {
  id: string;
  name: string;
  email: string;
  number?: string;      // ✅ ADD
  address?: string;     // ✅ ADD
  pinCode?: string;     // ✅ ADD
  password?: string;
}

const RegAdmin: React.FC<RegAdminProps> = ({
  setOpenAdminModel,
  refreshAdmin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");           // ✅ ADD
  const [address, setAddress] = useState("");         // ✅ ADD
  const [pinCode, setPinCode] = useState("");         // ✅ ADD
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [AdminData, setAdminData] = useState<AdminResponse | null>(null);

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

      // ✅ UPDATED: Include new fields
      const response = await axios.post(
        `${BackendUrl}/admin/registeradmin`,
        { 
          name, 
          email, 
          password, 
          role: "ADMIN",
          number: number || undefined,      // ✅ ADD
          address: address || undefined,    // ✅ ADD
          pinCode: pinCode || undefined     // ✅ ADD
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.user;
      setAdminData({ ...data, password });
      setRegSuccessfull(true);
      if (refreshAdmin) refreshAdmin();
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
        {/* Gradient Decorations - hidden on mobile */}
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-full opacity-80" />
        <div className="hidden sm:block absolute bottom-0 -right-12 w-40 h-20 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-full opacity-80" />

        {/* Header */}
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenAdminModel(false)}
        >
          ×
        </button>
        <div className="mt-10 mb-4 text-center">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-blue-900 to-blue-500 text-xl md:text-3xl">
            FINITE MARSHALL CLUB
          </div>
        </div>

        {/* Form & Success */}
        {!regSuccessfull ? (
          <div className="w-full px-4 pt-6 pb-10 max-w-sm mx-auto md:max-w-md max-h-[70vh] overflow-y-auto">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-5">
              Register New Admin
            </h1>
            {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* ✅ NEW: Contact Information Fields */}
              <input
                type="tel"
                placeholder="Phone Number (Optional)"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                title="Enter valid phone number (e.g., +91-890-768-7665)"
              />
              <textarea
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px]"
                rows={2}
              />
              <input
                type="text"
                placeholder="PIN Code (Optional)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                pattern="[0-9]{4,10}"
                title="Enter valid PIN code"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register Admin"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-sm mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-800">
              Admin Registered Successfully 🎉
            </h1>
            {AdminData && (
              <div className="space-y-2 mb-6 text-left">
                <p>
                  <strong>Name:</strong> {AdminData.name}
                </p>
                <p>
                  <strong>Email:</strong> {AdminData.email}
                </p>
                <p>
                  <strong>Password:</strong> {AdminData.password}
                </p>
                {/* ✅ ADD: Display contact info if provided */}
                {AdminData.number && (
                  <p>
                    <strong>Phone:</strong> {AdminData.number}
                  </p>
                )}
                {AdminData.address && (
                  <p>
                    <strong>Address:</strong> {AdminData.address}
                  </p>
                )}
                {AdminData.pinCode && (
                  <p>
                    <strong>PIN Code:</strong> {AdminData.pinCode}
                  </p>
                )}
              </div>
            )}
            <button
              className="relative bg-gradient-to-tr from-blue-600 to-blue-400 border-none overflow-hidden cursor-pointer rounded-md px-6 py-2 flex justify-center items-center gap-2 text-white hover:scale-105 transition"
              onClick={() => setOpenAdminModel(false)}
            >
              Mail Credentials <Send size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegAdmin;
