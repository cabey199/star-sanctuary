import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Lock, Building2, ArrowLeft, Shield } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface ClientLoginFormData {
  username: string;
  password: string;
}

export default function ClientLogin() {
  const [formData, setFormData] = useState<ClientLoginFormData>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [businessInfo, setBusinessInfo] = useState<any>(null);

  const navigate = useNavigate();
  const { clientName } = useParams();

  useEffect(() => {
    // Fetch business info for branding
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`/api/businesses/slug/${clientName}`);
        if (response.ok) {
          const business = await response.json();
          setBusinessInfo(business);
        }
      } catch (err) {
        console.error("Failed to fetch business info:", err);
      }
    };

    if (clientName) {
      fetchBusinessInfo();
    }
  }, [clientName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/auth/client-login/${clientName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Store client auth token
        localStorage.setItem("clientAuthToken", result.token);
        localStorage.setItem("clientUser", JSON.stringify(result.client));

        setSuccess("Login successful! Redirecting to dashboard...");

        // Redirect to client dashboard
        setTimeout(() => {
          navigate(`/${clientName}/dashboard`);
        }, 1000);
      } else {
        setError(
          result.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                {businessInfo?.logo ? (
                  <img
                    src={businessInfo.logo}
                    alt={businessInfo.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">
                {businessInfo?.name || "Business"} Dashboard
              </CardTitle>
              <CardDescription>
                Sign in to manage your business dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
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
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600">
                <Shield className="w-4 h-4 inline mr-1" />
                Credentials are managed by your platform administrator
              </div>

              <div className="pt-4 border-t space-y-2">
                <Link to={`/${clientName}`}>
                  <Button variant="ghost" className="text-sm w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Booking Page
                  </Button>
                </Link>

                <div className="text-xs text-gray-500">
                  Powered by{" "}
                  <Link to="/" className="text-primary hover:underline">
                    BookingWithCal
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
