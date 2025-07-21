import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Calendar,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordRecoverySystem from "../components/PasswordRecoverySystem";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormData {
  username: string;
  password: string;
}

interface PasswordResetData {
  email: string;
}

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [resetData, setResetData] = useState<PasswordResetData>({
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleResetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData({ email: e.target.value });
    setError("");
  };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use the AuthContext login method instead of direct fetch
      const success = await login(formData.username, formData.password);

      if (success) {
        setSuccess("Login successful! Redirecting...");

        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resetData),
      });

      const result = await response.json();

      if (result.success) {
        setResetEmailSent(true);
        setSuccess("Password reset link sent to your email!");
      } else {
        setError(result.message || "Failed to send reset email.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <PasswordRecoverySystem
          onRecoveryComplete={() => {
            setShowResetForm(false);
            setSuccess(
              "Password reset successfully! Please log in with your new password.",
            );
            setTimeout(() => setSuccess(""), 5000);
          }}
        />
      </div>
    );
  }

  // OLD RESET FORM (keeping as backup, but PasswordRecoverySystem is now used)
  if (false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you a reset link
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!resetEmailSent ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resetData.email}
                      onChange={handleResetInputChange}
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                      className="h-12"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Email Sent!
                    </h3>
                    <p className="text-green-700">
                      We've sent a password reset link to {resetData.email}.
                      Please check your email and follow the instructions.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResetForm(false);
                      setResetEmailSent(false);
                      setResetData({ email: "" });
                    }}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              )}

              {!resetEmailSent && (
                <Button
                  variant="ghost"
                  onClick={() => setShowResetForm(false)}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Sign in to access the BookingWithCal admin dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
                        {/* Demo Login Helper */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Access</h3>
              <p className="text-xs text-blue-700 mb-3">Use these credentials to access the demo system:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-gray-600">Username:</span> <strong>admin</strong>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-gray-600">Password:</span> <strong>admin</strong>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  setFormData({ username: "admin", password: "admin" });
                }}
              >
                Use Demo Credentials
              </Button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <Link to="/">
                <Button variant="ghost" className="text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Back to BookingWithCal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
