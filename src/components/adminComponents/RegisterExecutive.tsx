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
  password?: string; // not usually returned, but you can keep for UI
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
  const [executiveData, setExecutiveData] = useState<ExecutiveResponse | null>(
    null
  );

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

      const response = await axios.post(`${BackendUrl}/executive/register-executive`,
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data.executive;
      console.log(" data: ", response.data.executive);
      

      setExecutiveData({
        ...data,
        password, // keep original password for display
      });

      setRegSuccessfull(true);
      if (refreshExecutives) refreshExecutives();
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed  inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-red-100 relative w-[1000px] h-[600px] rounded-lg overflow-hidden flex items-center justify-center">
            <div className=" absolute top-0 -left-8  w-64 h-20 bg-gradient-to-tr from-orange-500 to-orange-700 rounded-full"></div>
             <button
                        className="cursor-pointer absolute top-4 right-6  hover:text-red-600 text-4xl text-slate-700"
                        onClick={() => setOpenExecutiveModel(false)}
                    >
                        ×
                    </button>
            {!regSuccessfull ? (
                <div className=" rounded-md w-full max-w-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Register New Executive</h1>
                    <button
                        className="cursor-pointer hover:text-red-600 text-xl text-slate-700"
                        onClick={() => setOpenExecutiveModel(false)}
                    >
                        
                    </button>
                    </div>

                    {error && <p className="text-red-600 mb-2">{error}</p>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border rounded"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register Executive"}
                    </button>
                    </form>
                </div>
                </div>
            ) : (
                <div className="bg-orange-200 border-2  rounded-md w-full max-w-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-orange-800">
                    Executive Registered Successfully 🎉
                </h1>
                {executiveData && (
                    <div className="space-y-2">
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
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setOpenExecutiveModel(false)}
                >
                    Close
                </button>
                </div>
            )}
        <div className=" absolute bottom-0 -right-8  w-64 h-20 bg-gradient-to-tr from-orange-500 to-orange-700 rounded-full"></div>
        </div>
    </div>
  );
};

export default RegisterExecutive;
