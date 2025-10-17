import { BackendUrl } from "@/Config";
import axios from "axios";
import { Send } from "lucide-react";
import React, { useState } from "react";

interface RegMentorProps {
  setOpenMentorModel: React.Dispatch<React.SetStateAction<boolean>>;
  refreshUser?: () => void;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const RegMentor: React.FC<RegMentorProps> = ({
  setOpenMentorModel,
  refreshUser,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [packageName, setPackageName] = useState("");
  const [password, setPassword] = useState("");
  const [executiveRefode, setExecutiveRefode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [UserData, setUserData] = useState<UserResponse | null>(null);

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
        `${BackendUrl}/admin/reg-mentor`,
        { name, email, password , role: 'MENTOR' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data.user;
      setUserData({ ...data, password });
      setRegSuccessfull(true);
      if (refreshUser) refreshUser();
    } catch (err) {
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
        <div className="hidden sm:block absolute top-0 -left-12 w-40 h-20 bg-gradient-to-tr from-purple-500 to-indigo-700 rounded-full opacity-80" />
        <div className="hidden sm:block absolute bottom-0 -right-12 w-40 h-20 bg-gradient-to-tr from-purple-500 to-indigo-700 rounded-full opacity-80" />

        {/* Header */}
        <button
          className="absolute top-4 right-6 text-3xl text-slate-700 hover:text-red-600 font-bold"
          aria-label="Close modal"
          onClick={() => setOpenMentorModel(false)}
        >
          ×
        </button>
        <div className="mt-10 mb-4 text-center">
          <div className="bg-clip-text text-transparent font-bold bg-gradient-to-tr from-indigo-500 to-purple-500 group text-xl md:text-3xl">
            FINITE MARSHALL CLUB
          </div>
        </div>

        {/* Form & Success */}
        {!regSuccessfull ? (
          <div className="w-full px-4 pt-6 pb-10 max-w-sm mx-auto md:max-w-md">
            <h1 className="text-xl md:text-2xl font-bold text-center mb-5">Register New User</h1>
            {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-tr from-indigo-500 to-purple-500 group hover:scale-105 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loading ? "Registering..." : " Register User"}
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full px-4 pt-10 pb-8 max-w-sm mx-auto text-center">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Mentor Registered Successfully 🎉</h1>
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
              </div>
            )}
            <button
              className="relative bg-gradient-to-tr from-indigo-500 to-purple-500  border-none overflow-hidden cursor-pointer rounded-md px-6 py-2 flex justify-center items-center gap-2 text-white hover:scale-105 transition"
              onClick={() => setOpenMentorModel(false)}
            >
              Mail Credentials <Send size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default RegMentor;
