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

const MentorLoginForm = () => {
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

    try {
      const response = await axios.post(`${BackendUrl}/auth/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // Verify mentor role
      if (user.role !== "MENTOR") {
        setErrorMsg("Access denied. Mentor credentials required.");
        localStorage.clear();
        setTimeout(() => navigate("/unauthorized"), 1500);
        return;
      }

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");

      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}!`,
      });

      navigate("/Mentor-dashboard");

    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.isBanned) {
        setShowBannedModal(true);
        return;
      }

      setErrorMsg(
        "Login failed. Please check your credentials."
      );

      if(err.response?.data?.error){
        alert("Login failed. Please check credentials or try different Role Ex: User/Admin/Executive")
      }

      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Mentor Login</h2>
        <p className="text-sm text-muted-foreground">
          Access your mentor account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mentor@finitemarshallclub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
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
            {isLoading ? <Processing /> : "Sign In"}
          </Button>
        </div>
      </form>

      <BannedModal
        isOpen={showBannedModal}
        onClose={() => setShowBannedModal(false)}
      />
    </div>
  );
};

export default MentorLoginForm;
