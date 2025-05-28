'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car } from 'lucide-react';
import Link from 'next/link';
import api from '@/app/api/config/axios';
import {
  FORGOT_PASSWORD,
  LOGIN_WITH_CREDENTIALS,
  RESET_PASSWORD,
  SIGNUP_WITH_DETAILS,
} from '@/app/api/config/API_Endpoints';
import { decodeJwt } from 'jose';
import Loader from '@/app/loading';
import { useAppStore, UserData } from '@/components/state-store';
import Modal from '@/components/ui/modal';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // SignIn States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // SignUp States
  const [suUserName, setSUUserName] = useState('');
  const [suEmail, setSUEmail] = useState('');
  const [suPass, setSUPass] = useState('');
  const [suConfPass, setSUConfPass] = useState('');

  // Reset States
  const [resetTab, setResetTab] = useState(1);
  const [resEmail, setResEmail] = useState('');
  const [resPass, setResPass] = useState('');
  const [resConfPass, setResConfPass] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Error States
  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorText, setErrorText] = useState('');

  // Success States
  const [success, setSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [successText, setSuccessText] = useState('');

  useEffect(() => {
    // resetting states on tab switch

    //reset states
    setResetTab(1);
    setResEmail('');
    setResPass('');
    setResConfPass('');
    setResetToken('');
    //sign up states
    setSUUserName('');
    setSUEmail('');
    setSUPass('');
    setSUConfPass('');
    // sign in states
    setPassword('');
  }, [activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.length || !password.length) {
      setError(true);
      setErrorTitle('Missing Information');
      setErrorText('Please enter both your email and password to continue.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        LOGIN_WITH_CREDENTIALS,
        JSON.stringify({ email, password })
      );

      if (data.access_token) {
        const payload = decodeJwt(data.access_token);
        if (payload) {
          setLoading(false);
          // const parsedData = JSON.stringify(payload);
          // console.log(payload.user_id);

          const now = Date.now();
          const EXPIRATION_TIMESTAMP = payload.exp * 1000;

          if (now >= EXPIRATION_TIMESTAMP) {
            // Already expired
            setError(true);
            setErrorTitle('Session Expired');
            setErrorText(
              'Your session has expired. Please log in again to continue.'
            );
            console.log('Expired Login');
            return;
          }

          const userDetails = {
            user_id: payload.user_id,
            exp: payload.exp,
          } as UserData;
          localStorage.setItem(
            'user',
            JSON.stringify({ ...userDetails, access_token: data.access_token })
          );
          useAppStore
            .getState()
            .setUserData({ ...userDetails, access_token: data.access_token });
          router.push('/');
        } else {
          setError(true);
          setErrorTitle('Something Went Wrong');
          setErrorText('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      if (
        error?.status == 401 &&
        error.code == 'ERR_BAD_REQUEST' &&
        error.response.data.detail == 'Invalid credentials'
      ) {
        // console.log(error);
        setError(true);
        setErrorTitle('Invalid Credentials');
        setErrorText(
          'The email or password you entered is incorrect. Please try again.'
        );
        console.log('Invalid Credentials');
      } else if (error.code == 'ERR_NETWORK') {
        setError(true);
        setErrorTitle('No Internet Connection');
        setErrorText(
          'You’re offline. Please check your internet connection and try again.'
        );
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      !suEmail.length ||
      !suPass.length ||
      !suConfPass.length ||
      !suUserName.length
    ) {
      setError(true);
      setErrorTitle('Missing Information');
      setErrorText(
        'Required information is missing. Please fill in all necessary fields to proceed.'
      );
      setLoading(false);
      return;
    }

    if (suPass !== suConfPass) {
      setError(true);
      setErrorTitle('Passwords Don’t Match');
      setErrorText(
        'The passwords you entered do not match. Please check and try again.'
      );
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(
        SIGNUP_WITH_DETAILS,
        JSON.stringify({
          user_name: suUserName,
          email: suEmail,
          password: suPass,
        })
      );

      if (data.message && data.message == 'User created') {
        setSuccess(true);
        setSuccessTitle('Sign-Up Complete');
        setSuccessText(
          'Your account has been created successfully. Please log in to continue.'
        );
        setActiveTab('login');
        setEmail(suEmail);
        setSUUserName('');
        setSUEmail('');
        setSUPass('');
        setSUConfPass('');
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      if (error.code == 'ERR_NETWORK') {
        setError(true);
        setErrorTitle('No Internet Connection');
        setErrorText(
          'You’re offline. Please check your internet connection and try again.'
        );
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!resEmail.length) {
      setError(true);
      setErrorTitle('Missing Information');
      setErrorText('Please enter your email to continue.');
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.post(
        FORGOT_PASSWORD,
        JSON.stringify({
          email: resEmail,
        })
      );

      if (
        data.message &&
        data.reset_token &&
        data.message == 'Password reset token generated.'
      ) {
        setResetToken(data.reset_token);
        setResetTab(2);
        setResEmail('');
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      if (
        error?.status == 404 &&
        error.code == 'ERR_BAD_REQUEST' &&
        error.response.data.detail == 'Email not found.'
      ) {
        setError(true);
        setErrorTitle('Email Not Found');
        setErrorText(
          'We couldn’t find an account with that email address. Please check or sign up.'
        );
      } else if (error.code == 'ERR_NETWORK') {
        setError(true);
        setErrorTitle('No Internet Connection');
        setErrorText(
          'You’re offline. Please check your internet connection and try again.'
        );
      } else {
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!resetToken.length) {
      setResetTab(1);
      setResPass('');
      setResConfPass('');
      setError(true);
      setErrorTitle('Something Went Wrong');
      setErrorText('An unexpected error occurred. Please try again later.');
      setLoading(false);
      return;
    }

    if (!resPass.length || !resConfPass.length) {
      setError(true);
      setErrorTitle('Missing Information');
      setErrorText(
        'Please make sure to fill both password fields to continue.'
      );
      setLoading(false);
      return;
    }

    if (resPass !== resConfPass) {
      setError(true);
      setErrorTitle('Passwords Don’t Match');
      setErrorText(
        'The passwords you entered do not match. Please check and try again.'
      );
      setResPass('');
      setResConfPass('');
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.post(
        RESET_PASSWORD,
        JSON.stringify({
          token: resetToken,
          new_password: resPass,
        })
      );

      if (data.message && data.message == 'Password reset successful.') {
        setSuccess(true);
        setSuccessTitle('Password Updated');
        setSuccessText(
          'Your password has been changed. Please log in again to continue.'
        );
        setResetToken('');
        setResetTab(1);
        setActiveTab('login');
      } else {
        setResetToken('');
        setResetTab(1);
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      if (
        error?.status == 400 &&
        error.code == 'ERR_BAD_REQUEST' &&
        error.response.data.detail == 'Invalid or expired token.'
      ) {
        setResetToken('');
        setResetTab(1);
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      } else if (error.code == 'ERR_NETWORK') {
        setError(true);
        setErrorTitle('No Internet Connection');
        setErrorText(
          'You’re offline. Please check your internet connection and try again.'
        );
        setResPass('');
        setResConfPass('');
      } else {
        setResetToken('');
        setResetTab(1);
        setError(true);
        setErrorTitle('Something Went Wrong');
        setErrorText('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setResPass('');
      setResConfPass('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {loading && <Loader />}

      {(error || success) && (
        <Modal
          isOpen={error || success}
          onClose={() => {
            setError(false);
            setErrorText('');
            setErrorTitle('');
            setSuccess(false);
            setSuccessTitle('');
            setSuccessText('');
          }}
        >
          {error && (
            <div className="flex gap-3 p-4 max-w-md items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-red-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
                />
              </svg>
              {/* <div className="text-2xl mt-1 mr-2">🛑</div> */}
              <div>
                <h2 className="text-lg font-semibold">{errorTitle}</h2>
                <p className="mt-1">{errorText}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="flex gap-3 p-4 max-w-md items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-green-600 mt-1 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2l4-4"
                />
              </svg>
              {/* <div className="text-2xl mt-1 mr-2">🛑</div> */}
              <div>
                <h2 className="text-lg font-semibold">{successTitle}</h2>
                <p className="mt-1">{successText}</p>
              </div>
            </div>
          )}

          {/* <h2 className="text-xl font-bold text-center">{errorTitle}</h2>
          <p className="text-center">{errorText}</p> */}
        </Modal>
      )}
      {!loading && (
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Car className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Car Finder</h1>
            </div>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="forgot">Reset</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        variant="link"
                        className="px-0 text-xs"
                        onClick={() => setActiveTab('forgot')}
                        type="button"
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="***********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form className="space-y-4 mt-4" onSubmit={handleSignUp}>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={suUserName}
                      onChange={(e) => setSUUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={suEmail}
                      onChange={(e) => setSUEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={suPass}
                      onChange={(e) => setSUPass(e.target.value)}
                      required
                      placeholder="***********"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      value={suConfPass}
                      onChange={(e) => setSUConfPass(e.target.value)}
                      required
                      placeholder="***********"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              {/* Forgot Password Form */}
              {resetTab == 1 && (
                <TabsContent value="forgot">
                  <form className="space-y-4 mt-4" onSubmit={handleForgot}>
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="name@example.com"
                        value={resEmail}
                        onChange={(e) => setResEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Reset Link
                    </Button>
                  </form>
                </TabsContent>
              )}
              {resetTab == 2 && (
                <TabsContent value="forgot">
                  <form className="space-y-4 mt-4" onSubmit={handleReset}>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-password">Password</Label>
                      <Input
                        id="forgot-password"
                        type="password"
                        value={resPass}
                        onChange={(e) => setResPass(e.target.value)}
                        required
                        placeholder="***********"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-confirm">Confirm Password</Label>
                      <Input
                        id="forgot-confirm"
                        type="password"
                        value={resConfPass}
                        onChange={(e) => setResConfPass(e.target.value)}
                        required
                        placeholder="***********"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Set New Password
                    </Button>
                  </form>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {activeTab === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab('signup')}
                  >
                    Sign up
                  </Button>
                </span>
              ) : activeTab === 'signup' ? (
                <span>
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </Button>
                </span>
              ) : resetTab == 1 ? (
                <span>
                  Remember your password?{' '}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab('login')}
                  >
                    Login
                  </Button>
                </span>
              ) : (
                <></>
              )}
            </div>
            <div className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{' '}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
