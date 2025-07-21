import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Settings,
  UserPlus,
  Key,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminManagement from "../components/AdminManagement";
import { Button as LoginButton } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../../shared/types";

export default function Index() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: authLoading,
  } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(loginForm.username, loginForm.password);

    if (success) {
      setShowLoginForm(false);
      setLoginForm({ username: "", password: "" });
      setSuccess("Login successful!");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Login failed. Please check your credentials.");
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setSuccess("Logged out successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const isMotherAdmin = user?.role === "mother_admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            BookingWithCal
          </h1>
          <p className="text-xl leading-8 text-gray-600 mb-8">
            The complete multi-client booking platform for small businesses.
            Create unlimited booking pages for barbers, salons, tattoo studios,
            and more.
          </p>
          <div className="flex items-center justify-center gap-4">
            {isAuthenticated && user ? (
              <Link to="/admin">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Building2 className="w-5 h-5 mr-2" />
                  Access Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowLoginForm(true)}
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Login
              </Button>
            )}
            <Link to="/elite-barber">
              <Button variant="outline" size="lg">
                Try Demo Booking
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage bookings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scale from 1 to 100+ client businesses with our powerful booking
            platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="dark:text-white">
                Beautiful Booking Pages
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Each client gets a custom branded booking page with service
                selection, provider choice, and seamless scheduling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="dark:text-white">
                Secure Dashboards
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Business owners get private dashboards to view bookings, manage
                schedules, and track their business
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="dark:text-white">
                Automated Notifications
              </CardTitle>
              <CardDescription className="dark:text-gray-300">
                Automatic email notifications to business owners when bookings
                are made, with customer details and scheduling info
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Platform Stats */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                Unlimited
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Client Businesses
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                White Label
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                Real-time
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Booking Updates
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                Multi-tenant
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Architecture
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Section - Only for Mother Admin */}
      {isMotherAdmin && (
        <div className="container mx-auto px-6 py-16">
          <AdminManagement isMotherAdmin={isMotherAdmin} />
        </div>
      )}

      {/* Master Admin Login Section */}
      {!isAuthenticated && (
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle>Master Admin Access</CardTitle>
                <CardDescription>
                  Secure login for platform administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showLoginForm ? (
                  <Button
                    onClick={() => setShowLoginForm(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Controls
                  </Button>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-username">Username</Label>
                      <Input
                        id="admin-username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="Enter username"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter password"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowLoginForm(false);
                          setError("");
                          setLoginForm({ username: "", password: "" });
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Admin Status Display */}
      {isAuthenticated && (
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">
                        Welcome, {user?.username}
                      </p>
                      <p className="text-sm text-green-600">
                        {user?.role === "mother_admin"
                          ? "Master Admin"
                          : "Subadmin"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-md mx-auto">
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to scale your booking business?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses using BookingWithCal to manage their
            appointments and grow their customer base.
          </p>
          <Link to="/admin">
            <Button size="lg" variant="secondary">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                BookingWithCal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The comprehensive booking platform that streamlines appointment
                scheduling for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/legal/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/legal/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:support@bookingwithcal.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Email Support
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+15551234567"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Phone Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; 2024 BookingWithCal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
