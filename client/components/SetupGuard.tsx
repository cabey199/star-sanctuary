import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";

interface SetupGuardProps {
  children: React.ReactNode;
}

export default function SetupGuard({ children }: SetupGuardProps) {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        setIsLoading(true);

        // PUBLIC ROUTES THAT SHOULD NEVER BE BLOCKED
        const publicRoutes = [
          "/setup",
          "/login",
          "/legal",
          "/", // Homepage
        ];

        // Check if current path is a client booking page (/:clientName format)
        const isClientBookingPage =
          location.pathname.match(/^\/[^\/]+$/) &&
          !location.pathname.startsWith("/admin") &&
          !location.pathname.startsWith("/setup") &&
          !location.pathname.startsWith("/login") &&
          !location.pathname.startsWith("/legal");

        // Check if current path is client dashboard related
        const isClientDashboard = location.pathname.includes("/dashboard");

        // NEVER block public routes or client booking pages
        if (
          publicRoutes.some((route) => location.pathname.startsWith(route)) ||
          isClientBookingPage ||
          isClientDashboard
        ) {
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // Only check setup status for ADMIN routes
        if (location.pathname.startsWith("/admin")) {
          const response = await fetch("/api/setup/status", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          let result;
          if (response.ok) {
            result = await response.json();
          } else {
            result = { initialized: false };
          }

          setIsInitialized(result.initialized);

          // Only redirect admin routes to setup
          if (!result.initialized) {
            navigate("/setup", { replace: true });
          }
        } else {
          // For all other routes, assume system is ready
          setIsInitialized(true);
        }
      } catch (err) {
        console.error("Failed to check system status:", err);
        // On error, assume system is ready for public access
        setIsInitialized(true);
        setError("Could not verify system status. Proceeding with caution.");
      } finally {
        setIsLoading(false);
      }
    };

    checkSystemStatus();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Shield className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">Checking System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying BookingWithCal setup...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl">System Warning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              The application will continue to load, but some features may not
              work correctly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Always render children for public routes
  const publicRoutes = ["/setup", "/login", "/legal", "/"];
  const isClientBookingPage =
    location.pathname.match(/^\/[^\/]+$/) &&
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/setup") &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/legal");
  const isClientDashboard = location.pathname.includes("/dashboard");

  // NEVER block public routes, client booking pages, or client dashboards
  if (
    publicRoutes.some((route) => location.pathname.startsWith(route)) ||
    isClientBookingPage ||
    isClientDashboard
  ) {
    return <>{children}</>;
  }

  // Only check initialization for admin routes
  if (location.pathname.startsWith("/admin") && isInitialized === false) {
    return null; // Will redirect to setup
  }

  return <>{children}</>;
}
