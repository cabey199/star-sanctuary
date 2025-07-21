import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Calendar,
  Users,
  Building2,
  ArrowRight,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Business,
  Booking,
  ETHIOPIAN_REGIONS,
  BUSINESS_TYPES,
  BusinessHours,
  DaySchedule,
} from "../../shared/types";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import ClientManagement from "../components/ClientManagement";
import AdminPermissionManager from "../components/AdminPermissionManager";
import FlexibleBookingManager from "../components/FlexibleBookingManager";

export default function AdminDashboard() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    isMotherAdmin,
    isSubadmin,
    logout,
  } = useAuth();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [activeSection, setActiveSection] = useState("businesses");

  const defaultBusinessHours: BusinessHours = {
    monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
    saturday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
    sunday: { isOpen: false },
  };

  const [newBusiness, setNewBusiness] = useState({
    name: "",
    slug: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    businessType: "",
    website: "",
    socialMedia: {},
    businessHours: defaultBusinessHours,
  });

  // Filter businesses based on user role - CRITICAL for subadmin independence
  const filteredBusinesses = isMotherAdmin
    ? businesses // Mother admin sees all businesses
    : businesses.filter((business) => business.createdBy === user?.id); // Subadmin only sees their own

  // ALL useEffect HOOKS MUST BE CALLED BEFORE CONDITIONAL RETURNS
  useEffect(() => {
    if (!user) return;

    // Fetch businesses with proper filtering
    const fetchBusinesses = async () => {
      try {
        const endpoint = isMotherAdmin
          ? "/api/businesses" // Get all businesses for mother admin
          : `/api/businesses/created-by/${user.id}`; // Get only subadmin's businesses

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBusinesses(data.businesses || []);
        } else {
          // Fallback to mock data for demo
          setMockData();
        }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        // Fallback to mock data
        setMockData();
      } finally {
        setIsLoading(false);
      }
    };

    const setMockData = () => {
      const mockBusinesses: Business[] = [
        {
          id: "1",
          name: "Elite Barber Zone",
          slug: "elite-barber-zone",
          description: "Premium barbering services in the heart of Addis Ababa",
          email: "info@elitebarbershop.com",
          phone: "+251 911 123 456",
          address: "Bole Road, Addis Ababa",
          city: "Addis Ababa",
          region: "Addis Ababa",
          businessType: "Barber Shop",
          isActive: true,
          businessHours: defaultBusinessHours,
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          createdBy: isMotherAdmin ? "mother_admin" : user?.id || "",
          images: [],
          branding: {
            primaryColor: "#8B5CF6",
            secondaryColor: "#3B82F6",
            fontFamily: "modern",
          },
          emailTemplates: {} as any,
          seoSettings: {
            metaTitle: "Elite Barber Zone - Premium Barbering Services",
            metaDescription: "Professional barbering services in Addis Ababa",
            keywords: ["barber", "haircut", "addis ababa"],
          },
          calendarSync: {
            googleCalendar: { enabled: false },
            outlookCalendar: { enabled: false },
            appleCalendar: { enabled: false },
          },
          reviewsEnabled: true,
          publicReviewsEnabled: true,
          promotionSettings: {
            autoGeneratePosts: true,
            defaultCTAMessage: "Book your haircut now!",
            socialMediaTemplates: [],
          },
        },
        {
          id: "2",
          name: "Glamour Nail Studio",
          slug: "glamour-nail-studio",
          description: "Professional nail care and beauty services",
          email: "booking@glamournails.com",
          phone: "+251 911 567 890",
          address: "Kazanchis, Addis Ababa",
          city: "Addis Ababa",
          region: "Addis Ababa",
          businessType: "Nail Salon",
          isActive: true,
          businessHours: defaultBusinessHours,
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20"),
          createdBy: isSubadmin ? user?.id || "" : "other_subadmin", // Different creator for demo
          images: [],
          branding: {
            primaryColor: "#EC4899",
            secondaryColor: "#8B5CF6",
            fontFamily: "elegant",
          },
          emailTemplates: {} as any,
          seoSettings: {
            metaTitle: "Glamour Nail Studio - Professional Nail Care",
            metaDescription: "Professional nail care services in Addis Ababa",
            keywords: ["nails", "manicure", "pedicure", "addis ababa"],
          },
          calendarSync: {
            googleCalendar: { enabled: false },
            outlookCalendar: { enabled: false },
            appleCalendar: { enabled: false },
          },
          reviewsEnabled: true,
          publicReviewsEnabled: false,
          promotionSettings: {
            autoGeneratePosts: false,
            defaultCTAMessage: "Book your nail appointment!",
            socialMediaTemplates: [],
          },
        },
      ];

      const mockBookings: Booking[] = [
        {
          id: "1",
          businessId: "1",
          serviceId: "service1",
          providerId: "provider1",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+251 911 111 111",
          date: "2024-01-25",
          startTime: "14:00",
          endTime: "14:45",
          status: "confirmed",
          totalAmount: 1400,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: isMotherAdmin ? "mother_admin" : user?.id || "",
        },
      ];

      setBusinesses(mockBusinesses);
      setAllBookings(mockBookings);
    };

    fetchBusinesses();
  }, [user, isMotherAdmin, isSubadmin]);

  // CONDITIONAL RETURNS AFTER ALL HOOKS
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (!isMotherAdmin && !isSubadmin)) {
    return <Navigate to="/" replace />;
  }

  const stats = {
    totalBusinesses: filteredBusinesses.length, // Use filtered businesses
    totalBookings: allBookings.filter((booking) =>
      isMotherAdmin
        ? true
        : filteredBusinesses.some((b) => b.id === booking.businessId),
    ).length,
    activeClients: filteredBusinesses.filter((b) => b.isActive).length,
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCreateBusiness = () => {
    if (!user?.permissions.canAddClients && !isMotherAdmin) {
      alert("You don't have permission to add clients");
      return;
    }

    const slug = generateSlug(newBusiness.name);
    const business: Business = {
      id: Date.now().toString(),
      ...newBusiness,
      slug,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.id || "", // Track who created this business
      images: [],
      branding: {
        primaryColor: "#8B5CF6",
        secondaryColor: "#3B82F6",
        fontFamily: "modern",
      },
      emailTemplates: {} as any,
      seoSettings: {
        metaTitle: newBusiness.name,
        metaDescription: newBusiness.description,
        keywords: [],
      },
      calendarSync: {
        googleCalendar: { enabled: false },
        outlookCalendar: { enabled: false },
        appleCalendar: { enabled: false },
      },
      reviewsEnabled: true,
      publicReviewsEnabled: true,
      promotionSettings: {
        autoGeneratePosts: true,
        defaultCTAMessage: `Book with ${newBusiness.name} now!`,
        socialMediaTemplates: [],
      },
    };

    setBusinesses([...businesses, business]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewBusiness({
      name: "",
      slug: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      businessType: "",
      website: "",
      socialMedia: {},
      businessHours: defaultBusinessHours,
    });
  };

  const handleDeleteBusiness = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);

    // Check permissions - subadmins can only delete their own businesses
    if (!isMotherAdmin && business?.createdBy !== user?.id) {
      alert("You can only delete businesses you created");
      return;
    }

    if (!user?.permissions.canDeleteClients && !isMotherAdmin) {
      alert("You don't have permission to delete clients");
      return;
    }

    setBusinesses(businesses.filter((b) => b.id !== businessId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isMotherAdmin ? "Master Admin Dashboard" : "Admin Dashboard"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {isMotherAdmin
                    ? "Full platform control and oversight"
                    : `Managing ${filteredBusinesses.length} client${filteredBusinesses.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant={isMotherAdmin ? "default" : "secondary"}
                className="flex items-center gap-2"
              >
                <Shield className="w-3 h-3" />
                {isMotherAdmin ? "Master Admin" : "Subadmin"}
              </Badge>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.username}
              </div>
              {isMotherAdmin && (
                <>
                  <Link to="/admin/settings">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Link to="/legal/contact">
                    <Button variant="outline" size="sm">
                      Legal Pages
                    </Button>
                  </Link>
                </>
              )}
              <ThemeToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {isMotherAdmin ? "Total Businesses" : "Your Businesses"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBusinesses}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                  <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBookings}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Active Clients
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.activeClients}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Management Section */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl dark:text-white">
                  {isMotherAdmin
                    ? "All Client Businesses"
                    : "Your Client Businesses"}
                </CardTitle>
                <CardDescription className="dark:text-gray-300">
                  {isMotherAdmin
                    ? "Manage all businesses on the platform"
                    : "Manage the businesses you've added to the platform"}
                </CardDescription>
              </div>

              {(user?.permissions.canAddClients || isMotherAdmin) && (
                <Dialog
                  open={isCreateModalOpen}
                  onOpenChange={setIsCreateModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Business
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Business</DialogTitle>
                      <DialogDescription>
                        Add a new business to the BookingWithCal platform
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business-name">Business Name</Label>
                          <Input
                            id="business-name"
                            value={newBusiness.name}
                            onChange={(e) =>
                              setNewBusiness({
                                ...newBusiness,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Elite Barber Shop"
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-type">Business Type</Label>
                          <Select
                            value={newBusiness.businessType}
                            onValueChange={(value) =>
                              setNewBusiness({
                                ...newBusiness,
                                businessType: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {BUSINESS_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="business-description">
                          Description
                        </Label>
                        <Textarea
                          id="business-description"
                          value={newBusiness.description}
                          onChange={(e) =>
                            setNewBusiness({
                              ...newBusiness,
                              description: e.target.value,
                            })
                          }
                          placeholder="Brief description of the business..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business-email">Email</Label>
                          <Input
                            id="business-email"
                            type="email"
                            value={newBusiness.email}
                            onChange={(e) =>
                              setNewBusiness({
                                ...newBusiness,
                                email: e.target.value,
                              })
                            }
                            placeholder="business@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-phone">Phone</Label>
                          <Input
                            id="business-phone"
                            value={newBusiness.phone}
                            onChange={(e) =>
                              setNewBusiness({
                                ...newBusiness,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+251 911 123 456"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="business-city">City</Label>
                          <Input
                            id="business-city"
                            value={newBusiness.city}
                            onChange={(e) =>
                              setNewBusiness({
                                ...newBusiness,
                                city: e.target.value,
                              })
                            }
                            placeholder="Addis Ababa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="business-region">Region</Label>
                          <Select
                            value={newBusiness.region}
                            onValueChange={(value) =>
                              setNewBusiness({
                                ...newBusiness,
                                region: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {ETHIOPIAN_REGIONS.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="business-address">Address</Label>
                        <Input
                          id="business-address"
                          value={newBusiness.address}
                          onChange={(e) =>
                            setNewBusiness({
                              ...newBusiness,
                              address: e.target.value,
                            })
                          }
                          placeholder="Street address"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateBusiness}
                        disabled={
                          !newBusiness.name ||
                          !newBusiness.email ||
                          !newBusiness.businessType
                        }
                      >
                        Create Business
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isMotherAdmin
                    ? "No businesses yet"
                    : "No businesses added yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {isMotherAdmin
                    ? "Start by creating your first business on the platform"
                    : "Add your first client business to get started"}
                </p>
                {(user?.permissions.canAddClients || isMotherAdmin) && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Business
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <Card
                    key={business.id}
                    className="border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {business.name}
                          </h3>
                          <Badge variant="outline" className="text-xs mb-2">
                            {business.businessType}
                          </Badge>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {business.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {business.city}, {business.region}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {business.isActive ? (
                            <Badge variant="default" className="text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        {!isMotherAdmin && (
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            <Badge variant="outline" className="text-xs">
                              Your Business
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Link to={`/admin/business/${business.id}`}>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-1" />
                              Manage
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(`/${business.slug}`, "_blank")
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>

                        {(user?.permissions.canDeleteClients ||
                          isMotherAdmin) &&
                          (isMotherAdmin ||
                            business.createdBy === user?.id) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Business
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {business.name}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteBusiness(business.id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-8">
          <CardContent className="p-6">
            <Tabs
              value={activeSection}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="businesses" className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Overview
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Client Management
                </TabsTrigger>
                {isMotherAdmin && (
                  <TabsTrigger value="admins" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Management
                  </TabsTrigger>
                )}
                <TabsTrigger value="services" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Service Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="businesses" className="mt-6">
                <div className="text-center py-8">
                  <Building2 className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Business Overview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your business overview is displayed above. Use this section
                    to manage individual client accounts.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="clients" className="mt-6">
                <ClientManagement />
              </TabsContent>

              {isMotherAdmin && (
                <TabsContent value="admins" className="mt-6">
                  <AdminPermissionManager />
                </TabsContent>
              )}

              <TabsContent value="services" className="mt-6">
                <FlexibleBookingManager businessId="platform" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
