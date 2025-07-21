import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Shield,
  Key,
  Send,
  CheckCircle,
  ArrowLeft,
  Lock,
  AlertCircle,
  Clock,
} from "lucide-react";

interface RecoveryRequest {
  email: string;
  username: string;
  role: "mother_admin" | "subadmin";
  requestTime: string;
  status: "pending" | "sent" | "expired";
  resetToken?: string;
}

interface PasswordRecoverySystemProps {
  isMotherAdmin?: boolean;
  onRecoveryComplete?: () => void;
}

export default function PasswordRecoverySystem({
  isMotherAdmin = false,
  onRecoveryComplete,
}: PasswordRecoverySystemProps) {
  const [step, setStep] = useState<"request" | "verify" | "reset" | "complete">(
    "request",
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock recovery requests for demo
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([
    {
      email: "admin@bookingwithcal.com",
      username: "admin",
      role: "mother_admin",
      requestTime: "2024-01-28T10:30:00Z",
      status: "sent",
      resetToken: "token_12345",
    },
    {
      email: "sarah@company.com",
      username: "sarah_manager",
      role: "subadmin",
      requestTime: "2024-01-27T14:20:00Z",
      status: "expired",
    },
  ]);

  const handleRequestReset = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Validate input
      if (!email && !username) {
        setError("Please provide either email or username");
        setIsLoading(false);
        return;
      }

      // Mock API call to request password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate finding user
      const mockUser = {
        email: email || "user@example.com",
        username: username || "user",
        role: isMotherAdmin ? "mother_admin" : "subadmin",
      };

      // Create recovery request
      const newRequest: RecoveryRequest = {
        email: mockUser.email,
        username: mockUser.username,
        role: mockUser.role as "mother_admin" | "subadmin",
        requestTime: new Date().toISOString(),
        status: "sent",
        resetToken: `token_${Date.now()}`,
      };

      setRecoveryRequests((prev) => [...prev, newRequest]);
      setResetToken(newRequest.resetToken!);
      setSuccess(
        `Password reset link sent to ${mockUser.email}. Check your inbox and spam folder.`,
      );
      setStep("verify");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyToken = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!resetToken) {
        setError("Please enter the reset token from your email");
        setIsLoading(false);
        return;
      }

      // Mock token verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const request = recoveryRequests.find((r) => r.resetToken === resetToken);
      if (!request) {
        setError("Invalid or expired reset token");
        setIsLoading(false);
        return;
      }

      // Check if token is expired (simulate 24-hour expiry)
      const tokenAge = Date.now() - new Date(request.requestTime).getTime();
      if (tokenAge > 24 * 60 * 60 * 1000) {
        setError("Reset token has expired. Please request a new one.");
        setIsLoading(false);
        return;
      }

      setSuccess("Token verified successfully. Please set your new password.");
      setStep("reset");
    } catch (err) {
      setError("Token verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Validate passwords
      if (!newPassword || newPassword.length < 8) {
        setError("Password must be at least 8 characters long");
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Mock password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update recovery request status
      setRecoveryRequests((prev) =>
        prev.map((r) =>
          r.resetToken === resetToken ? { ...r, status: "pending" } : r,
        ),
      );

      setSuccess("Password reset successfully!");
      setStep("complete");

      // Auto close after 3 seconds
      setTimeout(() => {
        if (onRecoveryComplete) {
          onRecoveryComplete();
        }
      }, 3000);
    } catch (err) {
      setError("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep("request");
    setEmail("");
    setUsername("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const getStepTitle = () => {
    switch (step) {
      case "request":
        return "Password Recovery";
      case "verify":
        return "Verify Reset Token";
      case "reset":
        return "Set New Password";
      case "complete":
        return "Recovery Complete";
      default:
        return "Password Recovery";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "request":
        return "Enter your email or username to receive a password reset link";
      case "verify":
        return "Enter the reset token from your email";
      case "reset":
        return "Choose a strong new password for your account";
      case "complete":
        return "Your password has been reset successfully";
      default:
        return "";
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              {step === "complete" ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Key className="w-8 h-8 text-primary" />
              )}
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {getStepDescription()}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Request Reset */}
          {step === "request" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">- OR -</div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="pl-10"
                  />
                </div>
              </div>

              {isMotherAdmin && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    As Mother Admin, your password reset requires additional
                    security verification.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleRequestReset}
                disabled={isLoading || (!email && !username)}
                className="w-full"
              >
                {isLoading ? (
                  "Sending Reset Link..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Verify Token */}
          {step === "verify" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    Check your email for a reset link with a security token.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reset-token">Reset Token</Label>
                <Input
                  id="reset-token"
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter token from email"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Token expires in 24 hours
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handleVerifyToken}
                  disabled={isLoading || !resetToken}
                  className="w-full"
                >
                  {isLoading ? (
                    "Verifying Token..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Token
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Request
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10"
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Minimum 8 characters required
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10"
                    minLength={8}
                  />
                </div>
              </div>

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Passwords do not match</AlertDescription>
                  </Alert>
                )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleResetPassword}
                disabled={
                  isLoading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 8
                }
                className="w-full"
              >
                {isLoading ? (
                  "Resetting Password..."
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === "complete" && (
            <div className="space-y-4 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Password Reset Successful!
                </h3>
                <p className="text-green-700">
                  Your password has been updated. You can now log in with your
                  new credentials.
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                Redirecting to login in 3 seconds...
              </div>
            </div>
          )}

          {/* Recovery Requests History (for Mother Admin) */}
          {isMotherAdmin && step === "request" && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-gray-900 mb-3">
                Recent Recovery Requests
              </h4>
              <div className="space-y-2">
                {recoveryRequests.slice(0, 3).map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                  >
                    <div>
                      <p className="font-medium">{request.username}</p>
                      <p className="text-gray-600">{request.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          request.status === "sent"
                            ? "default"
                            : request.status === "expired"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {new Date(request.requestTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Badge component if not imported
function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "secondary";
  className?: string;
}) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
