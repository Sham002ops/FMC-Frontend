import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Linkedin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSignIn } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Processing } from "./ui/icons/Processing";
import { Label } from "./ui/label";

const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
     const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const result = await signIn!.create({
        identifier: email,
        password,
      });
      console.log("result", result);
      
      if (result.status === 'complete') {
        await setActive!({ session: result.createdSessionId });
        navigate('/admin-dashboard');
      } else {
        console.log(result);
      }
    } catch (err) {
      setErrorMsg(err.errors?.[0]?.message || 'Login failed');
    }
    finally{
      setIsLoading(false)
    }
  };


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulate login
//     setTimeout(() => {
//       setIsLoading(false);
//       if (email && password) {
//         toast({
//           title: "Login successful!",
//           description: "Welcome back, user!",
//         });
//       } else {
//         toast({
//           title: "Login failed",
//           description: "Please fill in all fields",
//           variant: "destructive",
//         });
//       }
//     }, 1500);
//   };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
        <p className="text-sm text-muted-foreground">
          Admin Access only
        </p>
      </div>
 <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email"> Admin Email</Label>
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
                <Label htmlFor="password">Admin Password</Label>
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
               {isLoading ? <Processing/> : <>Admin Login</>}
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
      
             
    </div>
  );
};

export default AdminLoginForm;