import "./global.css";
import "./utils/apiMock"; // Enable API mocking for development

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, ClientAuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SetupGuard from "./components/SetupGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import FirstTimeSetup from "./pages/FirstTimeSetup";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessManagement from "./pages/BusinessManagement";
import ClientBooking from "./pages/ClientBooking";
import ClientDashboard from "./pages/ClientDashboard";
import ClientDashboardLogin from "./pages/ClientDashboardLogin";
import Settings from "./pages/Settings";
import LegalPages from "./pages/LegalPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ClientAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SetupGuard>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/setup" element={<FirstTimeSetup />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route
                      path="/admin/business/:businessId"
                      element={<BusinessManagement />}
                    />
                    <Route
                      path="/:clientSlug/dashboard/login"
                      element={<ClientDashboardLogin />}
                    />
                    <Route
                      path="/:clientName/dashboard"
                      element={<ClientDashboard />}
                    />
                    <Route path="/legal/:page" element={<LegalPages />} />
                    <Route path="/:clientName" element={<ClientBooking />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SetupGuard>
              </BrowserRouter>
            </TooltipProvider>
          </ClientAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
