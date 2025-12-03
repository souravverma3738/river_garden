import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { Navbar } from './Component/layout/Navbar';
import { Footer } from './Component/layout/Footer';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { Certificates } from './pages/Certificates';
import { TeamDashboard } from './pages/TeamDashboard';
import { Button } from './Component/ui/button';
import { Input } from './Component/ui/input';
import { Label } from './Component/ui/label';
import { AssignSupervisor } from './pages/AssignSupervisor';
import { UnassignSupervisor } from './pages/UnassignSupervisor';
import { CoursePlayer } from './pages/CoursePlayer'; // ⭐ NEW

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './Component/ui/card';
import './App.css';

// ====================================================
// 🔐 LOGIN COMPONENT
// ====================================================

const Login = ({ onLogin }) => {
  const navigate = require('react-router-dom').useNavigate();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [signupCredentials, setSignupCredentials] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Carer',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupCredentials({ ...signupCredentials, [name]: value });
  };

  // ✅ SIGNUP WITH DEBUG LOGGING
 const handleSignup = async (e) => {
  e.preventDefault();
  setSignupMessage('🔄 Signing up...');

  console.log('🔵 [SIGNUP] Starting signup with role:', signupCredentials.role);

  try {
    const formData = new URLSearchParams({
      name: signupCredentials.username,
      email: signupCredentials.email,
      password: signupCredentials.password,
      role: signupCredentials.role,
    });

    console.log('🔵 [SIGNUP] Sending request...');

    const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    console.log('🟢 [SIGNUP] Response received, status:', res.status);

    let data;
    try {
      data = await res.json();
      console.log('🟢 [SIGNUP] Response data:', data);
    } catch (parseErr) {
      console.error('❌ [SIGNUP] Failed to parse JSON:', parseErr);
      setSignupMessage('❌ Server error: Invalid response format');
      return;
    }

    if (res.ok) {
      console.log('✅ [SIGNUP] Registration successful!');
      setSignupMessage('✅ Account created! Please login.');
      setSignupCredentials({ username: '', email: '', password: '', role: 'Carer' });

      setTimeout(() => {
        setIsSigningUp(false);
      }, 2000);
    } else {
      console.error('❌ [SIGNUP] Registration failed:', data);
      setSignupMessage('❌ ' + (data.detail || 'Signup failed.'));
    }
  } catch (err) {
    console.error('❌ [SIGNUP] Catch block - Error:', err);
    setSignupMessage('❌ Could not connect to server: ' + err.message);
  }
};

  // ✅ LOGIN WITH DEBUG LOGGING
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔵 [LOGIN] Starting login process...');
    console.log('🔵 [LOGIN] Data:', {
      email: credentials.email,
      password: '****',
    });

    try {
      const formData = new URLSearchParams({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('🔵 [LOGIN] Sending request to: http://127.0.0.1:8000/api/auth/login');

      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      console.log('🟢 [LOGIN] Response received');
      console.log('🟢 [LOGIN] Status:', res.status, res.statusText);

      let data;
      try {
        data = await res.json();
        console.log('🟢 [LOGIN] Response data:', data);
      } catch (parseErr) {
        console.error('❌ [LOGIN] Failed to parse JSON:', parseErr);
        alert('❌ Server error: Invalid response format');
        return;
      }

      if (res.ok) {
        console.log('✅ [LOGIN] Login successful!');
        console.log('✅ [LOGIN] Token:', data.access_token);

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`✅ Welcome ${data.user.name || 'User'}!`);
        onLogin(data.user);
        navigate('/dashboard');
      } else {
        console.error('❌ [LOGIN] Login failed:', data);
        alert('❌ ' + (data.detail || 'Login failed. Check your credentials.'));
      }
    } catch (err) {
      console.error('❌ [LOGIN] Catch block - Error:', err);
      console.error('❌ [LOGIN] Error message:', err.message);
      console.error('❌ [LOGIN] Error stack:', err.stack);
      alert('❌ Could not connect to server: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden lg:block space-y-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">River Garden Training</h1>
              <p className="text-muted-foreground">Empowering Care Professionals</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p>✓ 100+ Professional Courses</p>
            <p>✓ Instant Digital Certificates</p>
            <p>✓ CQC Compliant Training</p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1624727828489-a1e03b79bba8"
            alt="Healthcare professional"
            className="rounded-2xl shadow-2xl"
          />
        </div>

        {/* Right Side */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl">
              {isSigningUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription>
              {isSigningUp
                ? 'Fill out your details to create an account'
                : 'Enter your credentials to access your dashboard'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isSigningUp ? (
              <>
                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>

                <p className="mt-4 text-center">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsSigningUp(true)}
                  >
                    Sign up
                  </button>
                </p>
              </>
            ) : (
              <>
              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={signupCredentials.username}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={signupCredentials.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={signupCredentials.password}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={signupCredentials.role}
                    onChange={handleSignupChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="Carer">Carer</option>
                    <option value="Office Staff">Office Staff</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Admin">Admin</option>
                    <option value="Driver">Driver</option>

                    </select>
                </div>

                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </form>

              {signupMessage && (
                <p className="mt-2 text-center text-sm">{signupMessage}</p>
              )}

              <p className="mt-4 text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsSigningUp(false)}
                >
                  Login
                </button>
              </p>
            </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ====================================================
// 🎯 MAIN APP COMPONENT
// ====================================================

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        console.log('✅ User restored from localStorage:', JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('✅ User logged in:', userData);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    console.log('🔓 User logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar user={currentUser} onLogout={handleLogout} />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                currentUser ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {currentUser.role === 'Team Leader' || currentUser.role === 'Care Manager' ? (
                      <TeamDashboard />
                    ) : (
                      <Dashboard userRole={currentUser.role} />
                    )}
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/courses"
              element={
                currentUser ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <Courses />
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
             {/* ⭐ NEW: Course player route */}
            <Route
              path="/courses/:courseId"
              element={
                currentUser ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <CoursePlayer />
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/certificates"
              element={
                currentUser ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <Certificates />
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/assign"
              element={
                currentUser && currentUser.role === 'Admin' ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <AssignSupervisor />
                  </div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/admin/unassign"
              element={
                currentUser && currentUser.role === 'Admin' ? (
                  <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <UnassignSupervisor />
                  </div>
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;