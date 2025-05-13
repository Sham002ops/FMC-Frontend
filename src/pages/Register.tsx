import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from '@/components/Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Processing } from '@/components/ui/icons/Processing';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"; // Set this in .env

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleCheckbox = () => {
    setForm({ ...form, termsAgreed: !form.termsAgreed });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.termsAgreed) return;
console.log("just handleSubmit", form);

    setIsLoading(true);
   
    try {
      const sendVerificationMail = await axios.post(`${BACKEND_URL}/api/send-verification`, {
        email: form.email
      });
      console.log("just sendMail", sendVerificationMail.data);

      if (sendVerificationMail.data.message === "Verification code sent") {
        setShowVerificationModal(true);
        console.log(sendVerificationMail.data.message);
      } else {
        setVerificationError("Failed to send verification email.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setIsLoading(false);
      return;
    }
     finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/verify-email`, {
        email: form.email,
        code: verificationCode,
      });

      if (response.data.success) {
        try {
          const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            username: form.email.split('@')[0], // Default username logic
          });
          if (response.data.success) {
            navigate('/dashboard');
          } else {
            alert(response.data.message || "Signup failed.");
          }
        } catch (err) {
          console.error("Signup Error:", err);
          alert(err?.response?.data?.message || "Signup failed.");
        }
       
      } else {
        setVerificationError("Invalid verification code");
      }
    } catch (err) {
      setVerificationError(err?.response?.data?.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-event-gradient py-10 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="md" />
          <h1 className="text-2xl font-bold text-white mt-6">Create Your Account</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={handleChange} required />
              <p className="text-xs text-gray-500 mt-1">Must be strong with letters, numbers & symbols</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={form.termsAgreed} onCheckedChange={handleCheckbox} />
              <Label htmlFor="terms" className="text-sm font-normal leading-none">
                I agree to the <a href="/terms" className="text-event-primary hover:underline">Terms</a> and <a href="/privacy" className="text-event-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-event-primary hover:bg-event-dark">
              {isLoading ? <Processing /> : <>Create Account</>}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Already have an account? <a href="/login" className="font-medium hover:underline">Sign In</a>
          </p>
        </div>
      </div>

      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <p className="text-sm">We've sent a code to {form.email}. Enter it below to verify your account.</p>
          </DialogHeader>

          <Input
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          {verificationError && (
            <p className="text-sm text-red-500 mt-2">{verificationError}</p>
          )}

          <Button onClick={handleVerify} className="w-full mt-4 bg-event-primary hover:bg-event-dark">
            {isLoading ? <Processing /> : <>Verify Email</>}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
