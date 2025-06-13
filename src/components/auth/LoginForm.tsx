
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Phone, Lock } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple dummy authentication - accept any phone number and password
      if (phoneNumber && password) {
        // Create a simple dummy user session
        const dummyUser = {
          id: `user-${phoneNumber}`,
          phone: phoneNumber,
          email: `${phoneNumber}@example.com`,
          created_at: new Date().toISOString(),
        };
        
        const dummySession = {
          user: dummyUser,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
        };

        // Store session in localStorage
        localStorage.setItem('dummy-auth-session', JSON.stringify(dummySession));
        
        toast({
          title: isSignUp ? "Account created successfully!" : "Login successful!",
          description: "Welcome to Mandi Mitra",
        });
        
        onSuccess();
      } else {
        throw new Error('Please enter both phone number and password');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isSignUp ? 'Join Mandi Mitra today' : 'Sign in to your account'}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          (Demo mode: Use any phone number like "1234" and password like "abc")
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1234"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="abc"
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </form>

      <div className="text-center mt-4">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-green-600 hover:text-green-700 text-sm"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
