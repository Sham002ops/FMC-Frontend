import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Linkedin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Processing } from "./ui/icons/Processing";
import { Label } from "./ui/label";
import axios from "axios";
import { log } from "console";
import { BackendUrl } from "@/Config";
import BannedModal from "./BannedModal";

const ExecutiveLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [showBannedModal, setShowBannedModal] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    
    

    try {
      const response = await axios.post(
        `${BackendUrl}/executive/executivelogin`,
        { email, password }
        
      );
      console.log("Submitting login form", { email, password });
    console.log("Backend URL:", BackendUrl);

      const jwt = response.data.token
        
        if(response.data.token !== undefined){
          localStorage.setItem("token", jwt);
          localStorage.setItem("loggedIn", "true");
          navigate("/exexutive-dashboard")
        }else{
          alert(response.data.message)
        }

        const executive = response.data.executive
        console.log(" role at ex login : ", response.data.executive.role);
        
        if (executive.role !== "EXECUTIVE") {
          navigate("/unauthorized");
        }

      if (response.status === 200 && response.data.executive) {
        toast({
          title: "Login successful!",
          description: `Welcome back, ${response.data.executive.name}!`,
        });
        navigate("/exexutive-dashboard");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error || "Login failed. Please check your credentials."
      );
      if (err.response?.status === 403 && err.response?.data?.isBanned) {
          setShowBannedModal(true); // ✅ Show modal
          return;
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Executive Login</h2>
        <p className="text-sm text-muted-foreground">
          Access your personal account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-sm text-event-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Sign In {isLoading ? <Processing /> : <></>}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>

      {/* <div className="flex justify-center space-x-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <Facebook className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Github className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <Linkedin className="h-5 w-5" />
        </Button>
      </div> */}

      <div className="text-center mt-6">
        <p className="text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary  hover:underline">
            Join Now
          </Link>
        </p>
      </div>
      <div>
        <BannedModal 
        isOpen={showBannedModal} 
        onClose={() => setShowBannedModal(false)} 
      />
      </div>
    </div>
  );
};

export default ExecutiveLoginForm;
