import React, { useState } from 'react'; 
import { useSignUp } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from '@/components/Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Processing } from '@/components/ui/icons/Processing';

const Register = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false,
    isAdmin: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleCheckbox = (field: 'termsAgreed' | 'isAdmin') => {
    setForm({ ...form, [field]: !form[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !form.termsAgreed) return;
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.update({
        unsafeMetadata: {
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.isAdmin ? 'admin' : 'user',
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setShowVerificationModal(true);
    } catch (err) {
      const message = err?.errors?.[0]?.message || err?.message || "Something went wrong.";
      console.error("Signup error:", message);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
        if (form.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setVerificationError("Verification failed. Try again.");
      }
    } catch (err) {
      setVerificationError(err.errors?.[0]?.message || "Invalid code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-green-500 py-10 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
         <div className=' flex justify-center items-center'>
           <Logo size="medium"  className=''/>
         </div>
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
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={form.termsAgreed} onCheckedChange={() => handleCheckbox('termsAgreed')} />
              <Label htmlFor="terms" className="text-sm font-normal leading-none">
                I agree to the <a href="/terms" className="text-event-primary hover:underline">Terms</a> and <a href="/privacy" className="text-event-primary hover:underline">Privacy Policy</a>
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="admin" checked={form.isAdmin} onCheckedChange={() => handleCheckbox('isAdmin')} />
              <Label htmlFor="admin" className="text-sm font-normal leading-none">
                I want to register as Admin
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-event-dark">
              {isLoading ? <Processing /> : <>Create Account</>}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">
            Already have an account? <Link to="/login" className="font-medium hover:underline">Sign In</Link>
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
