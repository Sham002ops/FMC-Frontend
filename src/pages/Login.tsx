import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserLoginForm from "@/components/UserLoginForm";
import AdminLoginForm from "@/components/AdminLoginForm";
import LoginBackground from "@/components/LoginBackground";
import Logo from "@/components/Logo";


const Login1 = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [sliding, setSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleTabChange = (tab: 'user' | 'admin') => {
    if (tab === activeTab || animating) return;
    
    setSliding(true);
    setAnimating(true);
    setSlideDirection(tab === 'user' ? 'left' : 'right');
    
    setTimeout(() => {
      setActiveTab(tab);
      setSliding(false);
      
      setTimeout(() => {
        setAnimating(false);
      }, 20);
    }, 10);
  };

  useEffect(() => {
    // Add wave animation to logo when page loads
    const logoLetters = document.querySelectorAll('.logo-letter');
    logoLetters.forEach((letter, index) => {
      (letter as HTMLElement).style.setProperty('--index', `${index}`);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 overflow-hidden">
      <LoginBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Logo size="medium" className="animate-fade-in" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 flex justify-center">
            {[
              "F", "i", "n", "i", "t", "e", " ", "M", "a", "r", "s", "h", "a", "l", "l", " ", "C", "l", "u", "b"
            ].map((char, idx) => (
              <span
                key={idx}
                className="wave-group logo-letter inline-block animate-wave"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="text-white/80 mb-8 animate-fade-in">Login to your account</p>
          
          <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm inline-flex mb-6">
            <Button
              variant="ghost"
              className={cn(
                "rounded-full px-6 transition-all",
                activeTab === 'user' ? "bg-white text-primary shadow-md" : "text-white hover:bg-white/10"
              )}
              onClick={() => handleTabChange('user')}
            >
              User
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "rounded-full px-6 transition-all",
                activeTab === 'admin' ? "bg-white text-blue-500 shadow-md" : "text-white hover:bg-white/10"
              )}
              onClick={() => handleTabChange('admin')}
            >
              Admin
            </Button>
          </div>
        </div>
        
        <div className="relative h-[500px]">
          <div
            className={cn(
              "absolute w-full rounded-2xl bg-white login-card overflow-hidden transition-all duration-500 ease-in-out",
              sliding && activeTab === 'user' ? 'animate-slide-out-right' : 
              !sliding && activeTab === 'user' ? 'animate-slide-in-left' : 'opacity-0 translate-x-full'
            )}
            style={{ visibility: (activeTab === 'user' || sliding) ? 'visible' : 'hidden' }}
          >
            <UserLoginForm />
          </div>
          
          <div
            className={cn(
              "absolute w-full rounded-2xl bg-white login-card overflow-hidden transition-all duration-500 ease-in-out",
              sliding && activeTab === 'admin' ? 'animate-slide-out-left' : 
              !sliding && activeTab === 'admin' ? 'animate-slide-in-right' : 'opacity-0 -translate-x-full'
            )}
            style={{ visibility: (activeTab === 'admin' || sliding) ? 'visible' : 'hidden' }}
          >
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login1;