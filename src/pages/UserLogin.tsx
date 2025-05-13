import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { SignInButton } from '@clerk/clerk-react';
import { Processing } from '@/components/ui/icons/Processing';

const UserLogin = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLiding , setIsLiding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setIsLiding(true);

    try {
      const result = await signIn!.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive!({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        console.log(result);
      }
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || 'Login failed');
    }
    finally{
      setIsLiding(false)
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn!.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
        redirectUrlComplete: '/dashboard',
      });

      console.log(result);
    } catch (err: any) {
      setErrorMsg(err.errors?.[0]?.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-event-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo size="md" />
          <h1 className="text-2xl font-bold text-white mt-6">User Login</h1>
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

            <Button type="submit" className="w-full bg-event-primary hover:bg-event-dark">
              Sign In {isLiding ? <Processing/> : <></>}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-white">or</p>
        </div>

        <div className="mt-4 flex justify-center">
         
          
          <Button variant="outline" onClick={handleGoogle} className="w-full">
              Continue with Google
            </Button>
        </div>

        <div className="text-center mt-6">
          <p className="text-white">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium hover:underline">
              Join Now
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/login" className="text-white/80 hover:text-white text-sm">
            ← Back to all login options
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
