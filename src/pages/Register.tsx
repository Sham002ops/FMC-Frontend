import React, { useState } from 'react';
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

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAgreed: false,
    isAdmin: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false); // optional if email verification needed

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleCheckbox = (field: 'termsAgreed' | 'isAdmin') => {
    setForm({ ...form, [field]: !form[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.termsAgreed) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          password: form.password,
          role: form.isAdmin ? 'admin' : 'user',
          // optionally: executiveId: 'someExecutiveId'
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Registration failed');

      // ✅ Registration successful
      setShowVerificationModal(true); // or redirect
      navigate(form.isAdmin ? '/admin-dashboard' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-green-500 py-10 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className='flex justify-center items-center'>
            <Logo size="medium" />
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

            {errorMsg && <p className="text-sm text-red-600 text-center">{errorMsg}</p>}

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
            <DialogTitle>Account Created</DialogTitle>
            <p className="text-sm">Your account has been successfully created.</p>
          </DialogHeader>
          <Button onClick={() => navigate('/login')} className="w-full mt-4 bg-event-primary hover:bg-event-dark">
            Go to Login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
