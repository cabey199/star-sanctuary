import React, { useState } from "react";
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
  Shield,
  CheckCircle,
  Calendar,
  Mail,
  User,
  Building,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SetupFormData {
  companyName: string;
  adminUsername: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  companyWebsite: string;
  companyPhone: string;
}

export default function FirstTimeSetup() {
  const [formData, setFormData] = useState<SetupFormData>({
    companyName: "",
    adminUsername: "",
    adminEmail: "",
    adminPassword: "",
    confirmPassword: "",
    companyWebsite: "",
    companyPhone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.companyName.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!formData.adminUsername.trim()) {
      setError("Admin username is required");
      return false;
    }
    if (formData.adminUsername.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.adminEmail.trim()) {
      setError("Admin email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.adminPassword) {
      setError("Password is required");
      return false;
    }
    if (formData.adminPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError("");
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check if system is already initialized
      const checkResponse = await fetch("/api/setup/status");
      const checkResult = await checkResponse.json();

      if (checkResult.initialized) {
        setError("System is already initialized. Please use the login page.");
        setIsLoading(false);
        return;
      }

      // Create the mother admin and initialize system
      const response = await fetch("/api/setup/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          adminUsername: formData.adminUsername,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
          companyWebsite: formData.companyWebsite,
          companyPhone: formData.companyPhone,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsComplete(true);

        // Auto-login the newly created admin
        if (result.token && result.user) {
          localStorage.setItem("authToken", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));
        }

        // Redirect to admin dashboard after 3 seconds
        setTimeout(() => {
          navigate("/admin");
        }, 3000);
      } else {
        setError(result.message || "Setup failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Setup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl text-green-800">
                  Setup Complete!
                </CardTitle>
                <CardDescription>
                  Your BookingWithCal system has been successfully initialized
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Welcome, {formData.adminUsername}!
                </h3>
                <p className="text-green-700 mb-4">
                  You are now the Mother Admin of{" "}
                  <strong>{formData.companyName}</strong>
                </p>
                <div className="text-sm text-green-600">
                  <p>✓ Admin account created</p>
                  <p>✓ System initialized</p>
                  <p>✓ Database configured</p>
                  <p>✓ Redirecting to dashboard...</p>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                You will be automatically redirected to the admin dashboard in a
                few seconds.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Setup BookingWithCal</CardTitle>
              <CardDescription>
                Welcome! Let's set up your booking platform and create your
                admin account
              </CardDescription>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-8 h-0.5 ${
                        step < currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSetup} className="space-y-4">
              {/* Step 1: Company & Admin Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium">
                      Company & Admin Information
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tell us about your business and admin account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        required
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminUsername">Admin Username *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminUsername"
                        name="adminUsername"
                        type="text"
                        value={formData.adminUsername}
                        onChange={handleInputChange}
                        placeholder="Choose admin username"
                        required
                        className="h-12 pl-10"
                        minLength={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminEmail"
                        name="adminEmail"
                        type="email"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        placeholder="Enter admin email address"
                        required
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Password Setup */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium">Secure Password</h3>
                    <p className="text-sm text-gray-600">
                      Create a strong password for your admin account
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password *</Label>
                    <div className="relative">
                      <Input
                        id="adminPassword"
                        name="adminPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.adminPassword}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        required
                        className="h-12 pr-12"
                        minLength={8}
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
                    <p className="text-xs text-gray-500">
                      Minimum 8 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        className="h-12 pr-12"
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-10 w-10"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Optional Company Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium">
                      Company Details (Optional)
                    </h3>
                    <p className="text-sm text-gray-600">
                      Additional information about your business
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="companyWebsite"
                        name="companyWebsite"
                        type="url"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                        placeholder="https://yourcompany.com"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      name="companyPhone"
                      type="tel"
                      value={formData.companyPhone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="h-12"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Review Your Information
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>Company:</strong> {formData.companyName}
                      </p>
                      <p>
                        <strong>Admin Username:</strong>{" "}
                        {formData.adminUsername}
                      </p>
                      <p>
                        <strong>Admin Email:</strong> {formData.adminEmail}
                      </p>
                      {formData.companyWebsite && (
                        <p>
                          <strong>Website:</strong> {formData.companyWebsite}
                        </p>
                      )}
                      {formData.companyPhone && (
                        <p>
                          <strong>Phone:</strong> {formData.companyPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Previous
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Setting up..."
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                By setting up BookingWithCal, you agree to our Terms of Service
                and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
