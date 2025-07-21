import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  ExternalLink,
  Shield,
  Calendar,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

interface ClientAuth {
  clientId: string;
  businessName: string;
  businessSlug: string;
  username: string;
  isAuthenticated: boolean;
  permissions: {
    canEditBranding: boolean;
    canManageServices: boolean;
    canViewAnalytics: boolean;
    canExportData: boolean;
    canManageBookings: boolean;
    canAccessSettings: boolean;
    canUploadImages: boolean;
    canManageReviews: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
  };
}

const ClientDashboardLogin: React.FC = () => {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [authData, setAuthData] = useState<ClientAuth | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const [supportRequest, setSupportRequest] = useState({
    email: "",
    phone: "",
    message: "",
  });

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem(`client_auth_${clientSlug}`);
      const userData = localStorage.getItem(`client_data_${clientSlug}`);

      if (authToken && userData) {
        try {
          const parsedAuth = JSON.parse(userData);
          setAuthData(parsedAuth);
        } catch (err) {
          console.error("Failed to parse client auth data:", err);
          localStorage.removeItem(`client_auth_${clientSlug}`);
          localStorage.removeItem(`client_data_${clientSlug}`);
        }
      }
    };

    checkAuth();
  }, [clientSlug]);

  // Load client info
  useEffect(() => {
    const loadClientInfo = async () => {
      try {
        // Mock client data - in real implementation, this would be an API call
        const mockClients = {
          "elite-barber": {
            id: "1",
            businessName: "Elite Barber Shop",
            businessSlug: "elite-barber",
            description: "Premium barbering services in the heart of the city",
            contactEmail: "contact@elitebarber.com",
            contactPhone: "+1 (555) 123-4567",
            businessType: "Beauty & Personal Care",
            credentials: {
              username: "elitebarber_admin",
              password: "SecurePass123!",
            },
            branding: {
              primaryColor: "#8b5a3c",
              secondaryColor: "#5d3a28",
              logoUrl: "",
            },
            permissions: {
              canEditBranding: true,
              canManageServices: true,
              canViewAnalytics: true,
              canExportData: false,
              canManageBookings: true,
              canAccessSettings: false,
              canUploadImages: true,
              canManageReviews: true,
            },
          },
          "wellness-spa": {
            id: "2",
            businessName: "Wellness Spa Center",
            businessSlug: "wellness-spa",
            description: "Relaxation and wellness services for mind and body",
            contactEmail: "info@wellnessspa.com",
            contactPhone: "+1 (555) 987-6543",
            businessType: "Health & Wellness",
            credentials: {
              username: "wellness_admin",
              password: "WellnessSecure456!",
            },
            branding: {
              primaryColor: "#059669",
              secondaryColor: "#047857",
              logoUrl: "",
            },
            permissions: {
              canEditBranding: true,
              canManageServices: true,
              canViewAnalytics: false,
              canExportData: false,
              canManageBookings: true,
              canAccessSettings: true,
              canUploadImages: true,
              canManageReviews: false,
            },
          },
        };

        if (clientSlug && mockClients[clientSlug as keyof typeof mockClients]) {
          setClientInfo(mockClients[clientSlug as keyof typeof mockClients]);
        }
      } catch (error) {
        console.error("Failed to load client info:", error);
      }
    };

    if (clientSlug) {
      loadClientInfo();
    }
  }, [clientSlug]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate credentials
      if (
        !clientInfo ||
        loginForm.username !== clientInfo.credentials.username ||
        loginForm.password !== clientInfo.credentials.password
      ) {
        throw new Error("Invalid username or password");
      }

      // Create auth data
      const authData: ClientAuth = {
        clientId: clientInfo.id,
        businessName: clientInfo.businessName,
        businessSlug: clientInfo.businessSlug,
        username: loginForm.username,
        isAuthenticated: true,
        permissions: clientInfo.permissions,
        branding: clientInfo.branding,
      };

      // Store authentication
      const authToken = btoa(
        JSON.stringify({
          clientId: clientInfo.id,
          timestamp: Date.now(),
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }),
      );

      localStorage.setItem(`client_auth_${clientSlug}`, authToken);
      localStorage.setItem(
        `client_data_${clientSlug}`,
        JSON.stringify(authData),
      );

      setAuthData(authData);
      setSuccess("Login successful! Redirecting to dashboard...");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = `/${clientSlug}/dashboard`;
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock support request submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(
        "Support request submitted successfully. You will receive a response within 24 hours.",
      );
      setSupportRequest({ email: "", phone: "", message: "" });
      setActiveTab("login");
    } catch (error) {
      setError("Failed to submit support request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated, redirect to dashboard
  if (authData?.isAuthenticated) {
    return <Navigate to={`/${clientSlug}/dashboard`} replace />;
  }

  // If client not found
  if (clientSlug && !clientInfo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Business Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The business "{clientSlug}" does not exist or has been
                deactivated.
              </p>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      style={{
        background: clientInfo?.branding?.primaryColor
          ? `linear-gradient(135deg, ${clientInfo.branding.primaryColor}15 0%, ${clientInfo.branding.secondaryColor}15 100%)`
          : undefined,
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {clientInfo?.branding?.logoUrl ? (
              <img
                src={clientInfo.branding.logoUrl}
                alt={clientInfo.businessName}
                className="h-12 w-auto"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{
                  backgroundColor:
                    clientInfo?.branding?.primaryColor || "#3b82f6",
                }}
              >
                {clientInfo?.businessName?.charAt(0) || "B"}
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {clientInfo?.businessName || "Business Dashboard"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {clientInfo?.description || "Access your business dashboard"}
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Dashboard Access
              </CardTitle>
              <ThemeToggle size="sm" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            username: e.target.value,
                          })
                        }
                        placeholder="Enter your username"
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
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    style={{
                      backgroundColor: clientInfo?.branding?.primaryColor,
                    }}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900 dark:text-amber-100 text-sm">
                          Secure Access
                        </h4>
                        <p className="text-amber-800 dark:text-amber-200 text-xs mt-1">
                          Your login credentials are managed by your platform
                          administrator. Contact support if you need assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="support" className="mt-6">
                <form onSubmit={handleSupportRequest} className="space-y-4">
                  <div>
                    <Label htmlFor="support-email">Your Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="support-email"
                        type="email"
                        value={supportRequest.email}
                        onChange={(e) =>
                          setSupportRequest({
                            ...supportRequest,
                            email: e.target.value,
                          })
                        }
                        placeholder="your.email@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="support-phone"
                        type="tel"
                        value={supportRequest.phone}
                        onChange={(e) =>
                          setSupportRequest({
                            ...supportRequest,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="support-message">
                      Message / Issue Description *
                    </Label>
                    <textarea
                      id="support-message"
                      value={supportRequest.message}
                      onChange={(e) =>
                        setSupportRequest({
                          ...supportRequest,
                          message: e.target.value,
                        })
                      }
                      placeholder="Please describe your issue or request..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      rows={4}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    style={{
                      backgroundColor: clientInfo?.branding?.primaryColor,
                    }}
                  >
                    {isLoading ? "Submitting..." : "Submit Support Request"}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Need immediate assistance?
                  </p>
                  <div className="flex justify-center space-x-4 mt-2">
                    <a
                      href={`mailto:${clientInfo?.contactEmail}`}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {clientInfo?.contactEmail}
                    </a>
                    <a
                      href={`tel:${clientInfo?.contactPhone}`}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {clientInfo?.contactPhone}
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = `/${clientSlug}`)}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Book Appointment
            </Button>
            <span>•</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="flex items-center"
            >
              <Building2 className="h-4 w-4 mr-1" />
              Main Site
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Powered by BookingWithCal • Secure Dashboard Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardLogin;
