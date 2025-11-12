import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Processing } from "./ui/icons/Processing";
import { Label } from "./ui/label";
import axios from "axios";
import { BackendUrl } from "@/Config";
import BannedModal from "./BannedModal";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [showBannedModal, setShowBannedModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Input validation
    if (!email || !password) {
      setErrorMsg("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BackendUrl}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user, message } = response.data;

      // Validate response structure
      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // CRITICAL: Verify role before saving anything
      if (user.role !== "ADMIN") {
        setErrorMsg("Access denied. Admin credentials required.");
        // Clear any existing auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loggedIn");
        setTimeout(() => navigate("/unauthorized"), 1500);
        return;
      }

      // Save to localStorage (only after role verification)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      // Success toast
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`,
      });

      // Navigate to admin dashboard
      navigate("/admin-dashboard");

    } catch (err) {
      console.error("Login error:", err);

      // Handle banned users
      if (err.response?.status === 403 && err.response?.data?.isBanned) {
        setShowBannedModal(true);
        return;
      }

      // Handle other errors
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setErrorMsg(errorMessage);

      // Clear localStorage on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loggedIn");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
        <p className="text-sm text-muted-foreground">Admin Access only</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@finitemarshallclub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Admin Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-event-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 text-center">{errorMsg}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? <Processing /> : "Admin Login"}
          </Button>
        </div>
      </form>

      <BannedModal
        isOpen={showBannedModal}
        onClose={() => setShowBannedModal(false)}
      />

      <div className="text-center mt-6">
        <p className="text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
