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
  password?: string; // not usually returned, but you can keep for UI
}

const RegAdmin: React.FC<RegAdminProps> = ({
  setOpenAdminModel,
  refreshAdmin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regSuccessfull, setRegSuccessfull] = useState(false);
  const [AdminData, setAdminData] = useState<AdminResponse | null>(
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

      const response = await axios.post(`${BackendUrl}/admin/registeradmin`,
        { name, email, password, role:"ADMIN" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data.user;
      console.log(" data: ", response.data.user);
      

      setAdminData({
        ...data,
        password, // keep original password for display
      });

      setRegSuccessfull(true);
      if (refreshAdmin) refreshAdmin();
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
        <div className="bg-gray-300 relative w-[1000px] h-[600px] rounded-lg overflow-hidden flex items-center justify-center">
            <div className=" absolute top-0 -left-8  w-64 h-20 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-full "> </div>
            <div className=" bg-clip-text text-transparent font-bold bg-gradient-to-tr from-blue-800  to-blue-500 text-3xl absolute top-6 left-[330px] text" >FINITE MARSHALL CLUB</div>
             <button
                        className="cursor-pointer absolute top-4 right-6  hover:text-red-600 text-4xl text-slate-700"
                        onClick={() => setOpenAdminModel(false)}
                    >
                        ×
                    </button>
            {!regSuccessfull ? (
                <div className=" rounded-md w-full max-w-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Register New Admin</h1>
                    <button
                        className="cursor-pointer hover:text-red-600 text-xl text-slate-700"
                        onClick={() => setOpenAdminModel(false)}
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
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register Admin"}
                    </button>
                    </form>
                </div>
                </div>
            ) : (
                <div className="bg-gray-200 border-2 shadow-xl  rounded-md w-full max-w-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-blue-800">
                    Admin Registered Successfully 🎉
                </h1>
                {AdminData && (
                    <div className="space-y-2">
                    <p>
                        <strong>Name:</strong> {AdminData.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {AdminData.email}
                    </p>
                   
                    <p>
                        <strong>Password:</strong> {AdminData.password}
                    </p>
                    </div>
                )}
                    <div className="flex justify-end items-center">
                        <button
                            className="mt-4 relative bg-black group border-none overflow-hidden cursor-pointer  rounded "
                            onClick={() => setOpenAdminModel(false)}
                        >
                            <div className=" absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out "></div>
                            <span className=" flex justify-center items-center gap-2  px-4 py-2  relative text-white group-hover:text-white transition-colors duration-300"> Mail Credentials <Send size={20} /></span>
                        </button>
                    </div>
                </div>
            )}
        <div className=" absolute bottom-0 -right-8  w-64 h-20 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-full"></div>
        </div>
    </div>
  );
};

export default RegAdmin;
