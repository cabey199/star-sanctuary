import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ExternalLink,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  DollarSign,
  Users,
  CalendarDays,
  CheckCircle,
  X,
  Palette,
  Upload,
  Share2,
  Copy,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  Search,
  Lock,
} from "lucide-react";
import {
  Business,
  Booking,
  Service,
  Provider,
  SERVICE_CATEGORIES,
} from "../../shared/types";
import ThemeToggle from "../components/ThemeToggle";
import PromotionTools from "../components/PromotionTools";
import ImageUploadSystem from "../components/ImageUploadSystem";
import CalendarSync from "../components/CalendarSync";

export default function ClientDashboard() {
  const { clientName } = useParams<{ clientName: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasEditAccess, setHasEditAccess] = useState(true); // This would be controlled by admin
  const [activeTab, setActiveTab] = useState("dashboard");

  // Edit modals
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  // Form states
  const [businessForm, setBusinessForm] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    locationLink: "",
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "",
    duration: 30,
    price: 0,
    requiresDeposit: false,
    depositAmount: 0,
  });

  const [providerForm, setProviderForm] = useState({
    name: "",
    bio: "",
    specialties: [] as string[],
    phoneNumber: "",
    email: "",
    workingDays: [] as string[],
    workingHours: { start: "09:00", end: "17:00" },
  });

  // Availability management state
  const [blockedDays, setBlockedDays] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [businessHours, setBusinessHours] = useState(
    business?.businessHours || {
      monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      saturday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
      sunday: { isOpen: false },
    },
  );

  useEffect(() => {
    // Authentication will be handled by the login form instead of prompt

    // Mock data - will connect to backend later
    const mockBusiness: Business = {
      id: "1",
      name: "Barber Zone",
      slug: "barber-zone",
      description: "Premium barbershop services in the heart of Addis Ababa",
      email: "owner@barberzone.com",
      phone: "+251911123456",
      address: "Bole Road, near Edna Mall",
      city: "Addis Ababa",
      region: "Addis Ababa",
      businessType: "Barber Shop",
      businessHours: {
        monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
        saturday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
        sunday: { isOpen: false },
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockServices: Service[] = [
      {
        id: "1",
        businessId: "1",
        name: "Classic Haircut",
        description: "Traditional men's haircut with styling",
        category: "Haircut & Styling",
        duration: 45,
        price: 1400,
        isActive: true,
        requiresDeposit: false,
      },
      {
        id: "2",
        businessId: "1",
        name: "Beard Trim",
        description: "Professional beard grooming and shaping",
        category: "Haircut & Styling",
        duration: 30,
        price: 1000,
        isActive: true,
        requiresDeposit: false,
      },
      {
        id: "3",
        businessId: "1",
        name: "Full Service",
        description: "Haircut + beard trim + hot towel treatment",
        category: "Haircut & Styling",
        duration: 75,
        price: 2200,
        isActive: true,
        requiresDeposit: true,
        depositAmount: 500,
      },
    ];

    const mockProviders: Provider[] = [
      {
        id: "1",
        businessId: "1",
        name: "Mike Johnson",
        bio: "Master barber with 15+ years experience",
        specialties: ["Classic cuts", "Beard styling", "Hot towel"],
        phoneNumber: "+251911111111",
        email: "mike@barberzone.com",
        isActive: true,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: { start: "09:00", end: "17:00" },
      },
      {
        id: "2",
        businessId: "1",
        name: "Sarah Chen",
        bio: "Modern styling specialist",
        specialties: ["Modern cuts", "Hair treatments", "Styling"],
        phoneNumber: "+251922222222",
        email: "sarah@barberzone.com",
        isActive: true,
        workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
        workingHours: { start: "10:00", end: "18:00" },
      },
    ];

    const mockBookings: Booking[] = [
      {
        id: "1",
        businessId: "1",
        serviceId: "1",
        providerId: "1",
        customerName: "John Smith",
        customerEmail: "john@example.com",
        customerPhone: "+251911234567",
        date: "2024-01-20",
        startTime: "10:00",
        endTime: "10:45",
        status: "confirmed",
        notes: "First time customer",
        totalAmount: 1400,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
      },
      {
        id: "2",
        businessId: "1",
        serviceId: "2",
        providerId: "2",
        customerName: "Mike Johnson",
        customerEmail: "mike@example.com",
        customerPhone: "+251922345678",
        date: "2024-01-21",
        startTime: "14:00",
        endTime: "14:30",
        status: "pending",
        totalAmount: 1000,
        createdAt: new Date("2024-01-19"),
        updatedAt: new Date("2024-01-19"),
      },
      {
        id: "3",
        businessId: "1",
        serviceId: "3",
        providerId: "1",
        customerName: "David Wilson",
        customerEmail: "david@example.com",
        customerPhone: "+251933456789",
        date: "2024-01-22",
        startTime: "16:00",
        endTime: "17:15",
        status: "confirmed",
        notes: "Regular customer - usual style",
        totalAmount: 2200,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
    ];

    setTimeout(() => {
      setBusiness(mockBusiness);
      setServices(mockServices);
      setProviders(mockProviders);
      setBookings(mockBookings);
      setIsLoading(false);

      if (mockBusiness) {
        setBusinessForm({
          name: mockBusiness.name,
          description: mockBusiness.description,
          email: mockBusiness.email,
          phone: mockBusiness.phone || "",
          address: mockBusiness.address || "",
          city: mockBusiness.city || "",
          region: mockBusiness.region || "",
          locationLink: mockBusiness.locationLink || "",
        });
      }
    }, 500);
  }, [clientName]);

  // Service management functions
  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      businessId: business!.id,
      ...serviceForm,
      isActive: true,
    };
    setServices([...services, service]);
    setIsAddServiceOpen(false);
    resetServiceForm();
  };

  const handleUpdateService = () => {
    if (!editingService) return;
    const updatedServices = services.map((s) =>
      s.id === editingService.id ? { ...s, ...serviceForm } : s,
    );
    setServices(updatedServices);
    setEditingService(null);
    resetServiceForm();
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId));
  };

  // Provider management functions
  const handleAddProvider = () => {
    const provider: Provider = {
      id: Date.now().toString(),
      businessId: business!.id,
      ...providerForm,
      isActive: true,
    };
    setProviders([...providers, provider]);
    setIsAddProviderOpen(false);
    resetProviderForm();
  };

  const handleUpdateProvider = () => {
    if (!editingProvider) return;
    const updatedProviders = providers.map((p) =>
      p.id === editingProvider.id ? { ...p, ...providerForm } : p,
    );
    setProviders(updatedProviders);
    setEditingProvider(null);
    resetProviderForm();
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter((p) => p.id !== providerId));
  };

  // Helper functions
  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      description: "",
      category: "",
      duration: 30,
      price: 0,
      requiresDeposit: false,
      depositAmount: 0,
    });
  };

  const resetProviderForm = () => {
    setProviderForm({
      name: "",
      bio: "",
      specialties: [],
      phoneNumber: "",
      email: "",
      workingDays: [],
      workingHours: { start: "09:00", end: "17:00" },
    });
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !providerForm.specialties.includes(specialty)) {
      setProviderForm({
        ...providerForm,
        specialties: [...providerForm.specialties, specialty],
      });
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProviderForm({
      ...providerForm,
      specialties: providerForm.specialties.filter((s) => s !== specialty),
    });
  };

  const toggleWorkingDay = (day: string) => {
    const workingDays = providerForm.workingDays.includes(day)
      ? providerForm.workingDays.filter((d) => d !== day)
      : [...providerForm.workingDays, day];
    setProviderForm({ ...providerForm, workingDays });
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      requiresDeposit: service.requiresDeposit || false,
      depositAmount: service.depositAmount || 0,
    });
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setProviderForm({
      name: provider.name,
      bio: provider.bio || "",
      specialties: provider.specialties,
      phoneNumber: provider.phoneNumber || "",
      email: provider.email || "",
      workingDays: provider.workingDays,
      workingHours: provider.workingHours,
    });
  };

  // Availability management functions
  const handleDayClick = (dateStr: string) => {
    if (blockedDays[dateStr]) {
      // Unblock the day
      const newBlockedDays = { ...blockedDays };
      delete newBlockedDays[dateStr];
      setBlockedDays(newBlockedDays);
    } else {
      // Set the date for blocking
      setSelectedDate(dateStr);
    }
  };

  const blockSelectedDay = () => {
    if (selectedDate && blockReason.trim()) {
      setBlockedDays({
        ...blockedDays,
        [selectedDate]: blockReason.trim(),
      });
      setSelectedDate(null);
      setBlockReason("");
    }
  };

  const unblockDay = (dateStr: string) => {
    const newBlockedDays = { ...blockedDays };
    delete newBlockedDays[dateStr];
    setBlockedDays(newBlockedDays);
  };

  const updateBusinessHours = (day: string, field: string, value: any) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: value,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Business Dashboard Access
            </CardTitle>
            <CardDescription>
              Please enter your password to access your business dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter dashboard password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const password = e.currentTarget.value;
                      if (password === "demo123") {
                        setIsAuthenticated(true);
                      } else {
                        alert("Incorrect password");
                      }
                    }
                  }}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  const passwordInput = document.getElementById(
                    "password",
                  ) as HTMLInputElement;
                  const password = passwordInput?.value;
                  if (password === "demo123") {
                    setIsAuthenticated(true);
                  } else {
                    alert("Incorrect password");
                  }
                }}
              >
                Access Dashboard
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Demo password: demo123
              </p>
            </div>
          </CardContent>
        </Card>
        {/* BookingWithCal Watermark */}
        <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none">
          <div className="text-xs text-gray-400 font-medium">
            Powered by BookingWithCal
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Business Not Found
          </h1>
          <p className="text-gray-600">
            The dashboard you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.date) >= new Date(),
  );
  const todayBookings = bookings.filter(
    (booking) => booking.date === new Date().toISOString().split("T")[0],
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* BookingWithCal Watermark */}
      <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none z-10">
        <div className="text-xs text-gray-400 font-medium">
          Powered by BookingWithCal
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {business.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Business Management Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${business.slug}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Page
              </Button>
              {hasEditAccess && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  ✓ Edit Access
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-1">
            <TabsTrigger value="dashboard" className="text-xs md:text-sm">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs md:text-sm">
              Business
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs md:text-sm">
              Services ({services.length})
            </TabsTrigger>
            <TabsTrigger value="staff" className="text-xs md:text-sm">
              Staff ({providers.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs md:text-sm">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="promotion" className="text-xs md:text-sm">
              Promotion
            </TabsTrigger>
            <TabsTrigger value="images" className="text-xs md:text-sm">
              Images
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs md:text-sm">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="customize" className="text-xs md:text-sm">
              Customize
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Today's Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-primary mr-3" />
                    <span className="text-3xl font-bold text-gray-900">
                      {todayBookings.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Upcoming Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-emerald-500 mr-3" />
                    <span className="text-3xl font-bold text-gray-900">
                      {upcomingBookings.length}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
                    <span className="text-3xl font-bold text-gray-900">
                      {services.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Bookings</span>
                  <Badge variant="secondary">{bookings.length} total</Badge>
                </CardTitle>
                <CardDescription>
                  Latest customer bookings and appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600">
                      Your customer bookings will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => {
                      const service = services.find(
                        (s) => s.id === booking.serviceId,
                      );
                      const provider = providers.find(
                        (p) => p.id === booking.providerId,
                      );
                      return (
                        <div
                          key={booking.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {booking.customerName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {booking.customerEmail}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={getStatusColor(booking.status)}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Service:</span>{" "}
                              {service?.name}
                            </div>
                            <div>
                              <span className="font-medium">Staff:</span>{" "}
                              {provider?.name}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span>{" "}
                              {booking.date}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span>{" "}
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </div>
                          {booking.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="font-medium">Notes:</span>{" "}
                              {booking.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Info Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Business Information
                </CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasEditAccess ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Business Name</Label>
                        <Input
                          value={businessForm.name}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="Your business name"
                        />
                      </div>
                      <div>
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          value={businessForm.email}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              email: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="contact@yourbusiness.com"
                        />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input
                          value={businessForm.phone}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              phone: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="+251911234567"
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={businessForm.city}
                          onChange={(e) =>
                            setBusinessForm({
                              ...businessForm,
                              city: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="Addis Ababa"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        value={businessForm.address}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            address: e.target.value,
                          })
                        }
                        className="mt-1"
                        placeholder="Bole Road, near Edna Mall"
                      />
                    </div>
                    <div>
                      <Label>Location Link (Google Maps, etc.)</Label>
                      <Input
                        value={businessForm.locationLink || ""}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            locationLink: e.target.value,
                          })
                        }
                        className="mt-1"
                        placeholder="https://maps.google.com/your-location"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Add a Google Maps link or any location link for
                        customers to find you easily
                      </p>
                    </div>
                    <div>
                      <Label>Business Description</Label>
                      <Textarea
                        value={businessForm.description}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            description: e.target.value,
                          })
                        }
                        className="mt-1"
                        placeholder="Describe your business, services, and what makes you special..."
                        rows={3}
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
                      <p className="text-sm text-blue-700">
                        Keep your business information up to date. This
                        information appears on your public booking page and
                        helps customers find and contact you.
                      </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Business Information
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Edit Access Required
                    </h3>
                    <p className="text-gray-600">
                      Contact your platform administrator to request edit access
                      for your business information.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Services</CardTitle>
                    <CardDescription>
                      Manage the services you offer to customers
                    </CardDescription>
                  </div>
                  {hasEditAccess && (
                    <Dialog
                      open={isAddServiceOpen}
                      onOpenChange={setIsAddServiceOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add New Service</DialogTitle>
                          <DialogDescription>
                            Create a new service for your business
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Service Name</Label>
                              <Input
                                value={serviceForm.name}
                                onChange={(e) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Classic Haircut"
                              />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Select
                                value={serviceForm.category}
                                onValueChange={(value) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    category: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {SERVICE_CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={serviceForm.description}
                              onChange={(e) =>
                                setServiceForm({
                                  ...serviceForm,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe your service..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Duration (minutes)</Label>
                              <Input
                                type="number"
                                value={serviceForm.duration}
                                onChange={(e) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    duration: parseInt(e.target.value) || 0,
                                  })
                                }
                                placeholder="30"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                How long does this service take?
                              </p>
                            </div>
                            <div>
                              <Label>Price (ETB)</Label>
                              <Input
                                type="number"
                                value={serviceForm.price}
                                onChange={(e) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    price: parseInt(e.target.value) || 0,
                                  })
                                }
                                placeholder="1000"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={serviceForm.requiresDeposit}
                              onCheckedChange={(checked) =>
                                setServiceForm({
                                  ...serviceForm,
                                  requiresDeposit: checked,
                                })
                              }
                            />
                            <Label>Requires Deposit</Label>
                          </div>
                          {serviceForm.requiresDeposit && (
                            <div>
                              <Label>Deposit Amount (ETB)</Label>
                              <Input
                                type="number"
                                value={serviceForm.depositAmount}
                                onChange={(e) =>
                                  setServiceForm({
                                    ...serviceForm,
                                    depositAmount:
                                      parseInt(e.target.value) || 0,
                                  })
                                }
                                placeholder="500"
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddServiceOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddService}
                            disabled={
                              !serviceForm.name ||
                              !serviceForm.category ||
                              serviceForm.price <= 0
                            }
                          >
                            Add Service
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No services yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add services that you offer to customers
                    </p>
                    {hasEditAccess && (
                      <Button onClick={() => setIsAddServiceOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Service
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                {service.name}
                              </h3>
                              <Badge variant="outline">
                                {service.category}
                              </Badge>
                              {service.requiresDeposit && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 bg-yellow-100 text-yellow-800"
                                >
                                  Deposit Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration} minutes
                              </span>
                              <span className="flex items-center text-green-600 font-medium">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ETB {service.price}
                              </span>
                              {service.requiresDeposit && (
                                <span className="text-yellow-600">
                                  Deposit: ETB {service.depositAmount}
                                </span>
                              )}
                            </div>
                          </div>
                          {hasEditAccess && (
                            <div className="flex items-center space-x-2">
                              <Dialog
                                open={editingService?.id === service.id}
                                onOpenChange={(open) =>
                                  !open && setEditingService(null)
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditService(service)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Service</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Service Name</Label>
                                        <Input
                                          value={serviceForm.name}
                                          onChange={(e) =>
                                            setServiceForm({
                                              ...serviceForm,
                                              name: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Category</Label>
                                        <Select
                                          value={serviceForm.category}
                                          onValueChange={(value) =>
                                            setServiceForm({
                                              ...serviceForm,
                                              category: value,
                                            })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {SERVICE_CATEGORIES.map(
                                              (category) => (
                                                <SelectItem
                                                  key={category}
                                                  value={category}
                                                >
                                                  {category}
                                                </SelectItem>
                                              ),
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Description</Label>
                                      <Textarea
                                        value={serviceForm.description}
                                        onChange={(e) =>
                                          setServiceForm({
                                            ...serviceForm,
                                            description: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Duration (minutes)</Label>
                                        <Input
                                          type="number"
                                          value={serviceForm.duration}
                                          onChange={(e) =>
                                            setServiceForm({
                                              ...serviceForm,
                                              duration:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                          Time needed for this service
                                        </p>
                                      </div>
                                      <div>
                                        <Label>Price (ETB)</Label>
                                        <Input
                                          type="number"
                                          value={serviceForm.price}
                                          onChange={(e) =>
                                            setServiceForm({
                                              ...serviceForm,
                                              price:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={serviceForm.requiresDeposit}
                                        onCheckedChange={(checked) =>
                                          setServiceForm({
                                            ...serviceForm,
                                            requiresDeposit: checked,
                                          })
                                        }
                                      />
                                      <Label>Requires Deposit</Label>
                                    </div>
                                    {serviceForm.requiresDeposit && (
                                      <div>
                                        <Label>Deposit Amount (ETB)</Label>
                                        <Input
                                          type="number"
                                          value={serviceForm.depositAmount}
                                          onChange={(e) =>
                                            setServiceForm({
                                              ...serviceForm,
                                              depositAmount:
                                                parseInt(e.target.value) || 0,
                                            })
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingService(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateService}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Service
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {service.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteService(service.id)
                                      }
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Staff</CardTitle>
                    <CardDescription>
                      Manage staff members and their schedules
                    </CardDescription>
                  </div>
                  {hasEditAccess && (
                    <Dialog
                      open={isAddProviderOpen}
                      onOpenChange={setIsAddProviderOpen}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Staff Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[700px]">
                        <DialogHeader>
                          <DialogTitle>Add New Staff Member</DialogTitle>
                          <DialogDescription>
                            Add a new team member who will provide services
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Full Name</Label>
                              <Input
                                value={providerForm.name}
                                onChange={(e) =>
                                  setProviderForm({
                                    ...providerForm,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Mike Johnson"
                              />
                            </div>
                            <div>
                              <Label>Phone Number</Label>
                              <Input
                                value={providerForm.phoneNumber}
                                onChange={(e) =>
                                  setProviderForm({
                                    ...providerForm,
                                    phoneNumber: e.target.value,
                                  })
                                }
                                placeholder="+251911234567"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Email (Optional)</Label>
                            <Input
                              type="email"
                              value={providerForm.email}
                              onChange={(e) =>
                                setProviderForm({
                                  ...providerForm,
                                  email: e.target.value,
                                })
                              }
                              placeholder="email@example.com"
                            />
                          </div>
                          <div>
                            <Label>Bio</Label>
                            <Textarea
                              value={providerForm.bio}
                              onChange={(e) =>
                                setProviderForm({
                                  ...providerForm,
                                  bio: e.target.value,
                                })
                              }
                              placeholder="Brief description of experience and expertise..."
                            />
                          </div>
                          <div>
                            <Label>Specialties</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {providerForm.specialties.map((specialty) => (
                                <Badge
                                  key={specialty}
                                  variant="secondary"
                                  className="cursor-pointer"
                                  onClick={() => removeSpecialty(specialty)}
                                >
                                  {specialty} ×
                                </Badge>
                              ))}
                            </div>
                            <Input
                              placeholder="Add specialty and press Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addSpecialty(e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }
                              }}
                            />
                          </div>
                          <div>
                            <Label>Working Days</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {[
                                "monday",
                                "tuesday",
                                "wednesday",
                                "thursday",
                                "friday",
                                "saturday",
                                "sunday",
                              ].map((day) => (
                                <div
                                  key={day}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={day}
                                    checked={providerForm.workingDays.includes(
                                      day,
                                    )}
                                    onChange={() => toggleWorkingDay(day)}
                                  />
                                  <Label htmlFor={day} className="capitalize">
                                    {day.slice(0, 3)}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Time</Label>
                              <Input
                                type="time"
                                value={providerForm.workingHours.start}
                                onChange={(e) =>
                                  setProviderForm({
                                    ...providerForm,
                                    workingHours: {
                                      ...providerForm.workingHours,
                                      start: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>End Time</Label>
                              <Input
                                type="time"
                                value={providerForm.workingHours.end}
                                onChange={(e) =>
                                  setProviderForm({
                                    ...providerForm,
                                    workingHours: {
                                      ...providerForm.workingHours,
                                      end: e.target.value,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddProviderOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddProvider}
                            disabled={
                              !providerForm.name ||
                              providerForm.workingDays.length === 0
                            }
                          >
                            Add Staff Member
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {providers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No staff members yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Add team members who will provide services
                    </p>
                    {hasEditAccess && (
                      <Button onClick={() => setIsAddProviderOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Staff Member
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providers.map((provider) => (
                      <div
                        key={provider.id}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                                {provider.name}
                              </h3>
                              <Badge
                                variant={
                                  provider.isActive ? "default" : "secondary"
                                }
                              >
                                {provider.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {provider.bio && (
                              <p className="text-gray-600 mb-2">
                                {provider.bio}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {provider.specialties.map((specialty) => (
                                <Badge key={specialty} variant="outline">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>
                                📞 {provider.phoneNumber} |{" "}
                                {provider.email && `📧 ${provider.email}`}
                              </div>
                              <div>
                                🗓️ {provider.workingDays.join(", ")} |{" "}
                                {provider.workingHours.start} -{" "}
                                {provider.workingHours.end}
                              </div>
                            </div>
                          </div>
                          {hasEditAccess && (
                            <div className="flex items-center space-x-2">
                              <Dialog
                                open={editingProvider?.id === provider.id}
                                onOpenChange={(open) =>
                                  !open && setEditingProvider(null)
                                }
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditProvider(provider)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[700px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Staff Member</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Full Name</Label>
                                        <Input
                                          value={providerForm.name}
                                          onChange={(e) =>
                                            setProviderForm({
                                              ...providerForm,
                                              name: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Phone Number</Label>
                                        <Input
                                          value={providerForm.phoneNumber}
                                          onChange={(e) =>
                                            setProviderForm({
                                              ...providerForm,
                                              phoneNumber: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <Input
                                        type="email"
                                        value={providerForm.email}
                                        onChange={(e) =>
                                          setProviderForm({
                                            ...providerForm,
                                            email: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Bio</Label>
                                      <Textarea
                                        value={providerForm.bio}
                                        onChange={(e) =>
                                          setProviderForm({
                                            ...providerForm,
                                            bio: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Specialties</Label>
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {providerForm.specialties.map(
                                          (specialty) => (
                                            <Badge
                                              key={specialty}
                                              variant="secondary"
                                              className="cursor-pointer"
                                              onClick={() =>
                                                removeSpecialty(specialty)
                                              }
                                            >
                                              {specialty} ×
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                      <Input
                                        placeholder="Add specialty and press Enter"
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSpecialty(e.currentTarget.value);
                                            e.currentTarget.value = "";
                                          }
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Label>Working Days</Label>
                                      <div className="grid grid-cols-4 gap-2 mt-2">
                                        {[
                                          "monday",
                                          "tuesday",
                                          "wednesday",
                                          "thursday",
                                          "friday",
                                          "saturday",
                                          "sunday",
                                        ].map((day) => (
                                          <div
                                            key={day}
                                            className="flex items-center space-x-2"
                                          >
                                            <input
                                              type="checkbox"
                                              id={`edit-${day}`}
                                              checked={providerForm.workingDays.includes(
                                                day,
                                              )}
                                              onChange={() =>
                                                toggleWorkingDay(day)
                                              }
                                            />
                                            <Label
                                              htmlFor={`edit-${day}`}
                                              className="capitalize"
                                            >
                                              {day.slice(0, 3)}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Start Time</Label>
                                        <Input
                                          type="time"
                                          value={
                                            providerForm.workingHours.start
                                          }
                                          onChange={(e) =>
                                            setProviderForm({
                                              ...providerForm,
                                              workingHours: {
                                                ...providerForm.workingHours,
                                                start: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>End Time</Label>
                                        <Input
                                          type="time"
                                          value={providerForm.workingHours.end}
                                          onChange={(e) =>
                                            setProviderForm({
                                              ...providerForm,
                                              workingHours: {
                                                ...providerForm.workingHours,
                                                end: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingProvider(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateProvider}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove Staff Member
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove "
                                      {provider.name}" from the staff? This
                                      action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteProvider(provider.id)
                                      }
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            {hasEditAccess ? (
              <>
                {/* Day-Off Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Block Days Off
                    </CardTitle>
                    <CardDescription>
                      Block specific days when you're unavailable (emergencies,
                      holidays, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Calendar Grid */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Select Days to Block
                        </h3>
                        <div className="border rounded-lg p-4">
                          <div className="mb-4">
                            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                              <div>Sun</div>
                              <div>Mon</div>
                              <div>Tue</div>
                              <div>Wed</div>
                              <div>Thu</div>
                              <div>Fri</div>
                              <div>Sat</div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {Array.from({ length: 35 }, (_, i) => {
                                const today = new Date();
                                const firstDayOfMonth = new Date(
                                  today.getFullYear(),
                                  today.getMonth(),
                                  1,
                                );
                                const startDate = new Date(firstDayOfMonth);
                                startDate.setDate(
                                  startDate.getDate() -
                                    firstDayOfMonth.getDay(),
                                );

                                const currentDate = new Date(startDate);
                                currentDate.setDate(currentDate.getDate() + i);

                                const isCurrentMonth =
                                  currentDate.getMonth() === today.getMonth();
                                const isToday =
                                  currentDate.toDateString() ===
                                  today.toDateString();
                                const isPast = currentDate < today && !isToday;
                                const dateStr = currentDate
                                  .toISOString()
                                  .split("T")[0];
                                const isBlocked = blockedDays[dateStr];

                                return (
                                  <button
                                    key={i}
                                    disabled={isPast}
                                    className={`
                                      aspect-square p-2 text-sm rounded-md transition-colors
                                      ${isCurrentMonth ? "text-gray-900" : "text-gray-300"}
                                      ${isToday ? "bg-primary text-white font-bold" : ""}
                                      ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}
                                      ${isBlocked ? "bg-red-100 text-red-700 border border-red-300" : ""}
                                      ${!isPast && !isToday && !isBlocked ? "hover:bg-blue-50" : ""}
                                    `}
                                    onClick={() => {
                                      if (!isPast) {
                                        handleDayClick(dateStr);
                                      }
                                    }}
                                  >
                                    {currentDate.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <div className="text-sm space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-primary rounded"></div>
                                <span>Today</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                <span>Blocked Days</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                <span>Available Days</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Blocked Days List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Currently Blocked Days
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(blockedDays).map(([date, reason]) => (
                            <div
                              key={date}
                              className="border rounded-lg p-4 bg-red-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-red-900">
                                    {new Date(date).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      },
                                    )}
                                  </div>
                                  <div className="text-sm text-red-700">
                                    {reason}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-300"
                                  onClick={() => unblockDay(date)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          {Object.keys(blockedDays).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No blocked days yet</p>
                              <p className="text-sm">
                                Click on calendar dates to block days
                              </p>
                            </div>
                          )}

                          {selectedDate && (
                            <div className="border rounded-lg p-4 bg-blue-50">
                              <h4 className="font-medium text-blue-900 mb-2">
                                Block{" "}
                                {new Date(selectedDate).toLocaleDateString()}
                              </h4>
                              <div className="space-y-3">
                                <Input
                                  placeholder="Reason for blocking (e.g., Emergency, Holiday, Maintenance)"
                                  value={blockReason}
                                  onChange={(e) =>
                                    setBlockReason(e.target.value)
                                  }
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={blockSelectedDay}
                                    disabled={!blockReason.trim()}
                                  >
                                    Block Day
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDate(null);
                                      setBlockReason("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Hours Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Business Hours
                    </CardTitle>
                    <CardDescription>
                      Set your regular operating hours for each day of the week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(businessHours).map(([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center space-x-4 p-4 border rounded-lg"
                        >
                          <div className="w-24">
                            <span className="capitalize font-medium">
                              {day}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={hours.isOpen}
                              onCheckedChange={(checked) =>
                                updateBusinessHours(day, "isOpen", checked)
                              }
                            />
                            <Label className="text-sm">Open</Label>
                          </div>
                          {hours.isOpen && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Label className="text-sm">From:</Label>
                                <Input
                                  type="time"
                                  value={hours.openTime}
                                  onChange={(e) =>
                                    updateBusinessHours(
                                      day,
                                      "openTime",
                                      e.target.value,
                                    )
                                  }
                                  className="w-32"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Label className="text-sm">To:</Label>
                                <Input
                                  type="time"
                                  value={hours.closeTime}
                                  onChange={(e) =>
                                    updateBusinessHours(
                                      day,
                                      "closeTime",
                                      e.target.value,
                                    )
                                  }
                                  className="w-32"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      <Button className="bg-primary hover:bg-primary/90">
                        <Save className="w-4 h-4 mr-2" />
                        Save Business Hours
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Management</CardTitle>
                  <CardDescription>
                    View your current business schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      View-Only Mode
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Contact your platform administrator to request edit access
                      for schedule management.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Current Business Hours
                      </h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        {Object.entries(business.businessHours).map(
                          ([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}:</span>
                              <span>
                                {hours.isOpen
                                  ? `${hours.openTime} - ${hours.closeTime}`
                                  : "Closed"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Promotion Tab */}
          <TabsContent value="promotion" className="space-y-6">
            {hasEditAccess ? (
              <PromotionTools />
            ) : (
              <Card>
                <CardContent className="p-4 md:p-8 text-center">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Promotion Tools Access Restricted
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contact your administrator to enable promotion tools access.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            {hasEditAccess ? (
              <ImageUploadSystem />
            ) : (
              <Card>
                <CardContent className="p-4 md:p-8 text-center">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Image Management Access Restricted
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contact your administrator to enable image upload access.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {hasEditAccess ? (
              <CalendarSync />
            ) : (
              <Card>
                <CardContent className="p-4 md:p-8 text-center">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Calendar Sync Access Restricted
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Contact your administrator to enable calendar sync access.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            {hasEditAccess ? (
              <>
                {/* Branding Customization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="w-5 h-5 mr-2" />
                      Branding & Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize your booking page colors, fonts, and images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="primary-color">Primary Color</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value="#8B5CF6"
                              className="w-16 h-10"
                            />
                            <Input
                              value="#8B5CF6"
                              placeholder="#8B5CF6"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="secondary-color">
                            Secondary Color
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="secondary-color"
                              type="color"
                              value="#3B82F6"
                              className="w-16 h-10"
                            />
                            <Input
                              value="#3B82F6"
                              placeholder="#3B82F6"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="font-family">Font Style</Label>
                          <Select defaultValue="modern">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">
                                Modern Sans-serif
                              </SelectItem>
                              <SelectItem value="classic">
                                Classic Serif
                              </SelectItem>
                              <SelectItem value="elegant">
                                Elegant Script
                              </SelectItem>
                              <SelectItem value="bold">Bold Display</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="logo-upload">Business Logo</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 mx-auto text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <span className="text-primary">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </div>
                              <div className="text-xs text-gray-500">
                                PNG, JPG up to 2MB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium mb-3">Preview</h4>
                          <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                            <div className="h-4 bg-purple-500 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="flex space-x-2">
                              <div className="h-8 bg-purple-500 rounded w-20"></div>
                              <div className="h-8 bg-blue-500 rounded w-20"></div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Gallery Images</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="aspect-square bg-gray-200 rounded-lg"></div>
                            <div className="aspect-square bg-gray-200 rounded-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline">Reset to Default</Button>
                      <Button>Save Branding</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Media Promotion */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Share2 className="w-5 h-5 mr-2" />
                      Social Media Promotion
                    </CardTitle>
                    <CardDescription>
                      Share your booking page and generate promotional content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Your Booking Page URL</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={`${window.location.origin}/${business?.slug}`}
                              readOnly
                              className="flex-1"
                            />
                            <Button variant="outline" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="promo-message">
                            Custom Promotional Message
                          </Label>
                          <Textarea
                            id="promo-message"
                            placeholder="Book your appointment with me now! Limited slots available!"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label>Quick Share</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Button variant="outline" className="justify-start">
                              <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                              Instagram
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                              Facebook
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                              WhatsApp
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Send className="w-4 h-4 mr-2 text-blue-500" />
                              Telegram
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50">
                          <h4 className="font-medium mb-3">
                            Generated Post Preview
                          </h4>
                          <div className="bg-white rounded-lg p-3 text-sm">
                            <div className="font-medium text-gray-900 mb-2">
                              📅 Book your appointment with {business?.name}{" "}
                              now!
                            </div>
                            <div className="text-gray-600 mb-2">
                              ✨ Professional services at your convenience
                            </div>
                            <div className="text-blue-600">
                              👉 {window.location.origin}/{business?.slug}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Post Templates</Label>
                          <div className="space-y-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left"
                            >
                              �� "Limited slots available this week!"
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left"
                            >
                              ⏰ "Book now for same-day service!"
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left"
                            >
                              💫 "New customer? Get 10% off!"
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline">Create QR Code</Button>
                      <Button>Generate Promotional Content</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO & Visibility */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      SEO & Online Visibility
                    </CardTitle>
                    <CardDescription>
                      Optimize your booking page for search engines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="meta-title">Page Title</Label>
                        <Input
                          id="meta-title"
                          placeholder="Book appointments with [Business Name] - Professional services in [City]"
                          value={`Book appointments with ${business?.name} - Professional services in ${business?.city}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="meta-description">
                          Page Description
                        </Label>
                        <Textarea
                          id="meta-description"
                          placeholder="Professional [service type] services in [city]. Book online 24/7, experienced staff, convenient location."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                          id="keywords"
                          placeholder="barber, haircut, Addis Ababa, professional, booking"
                        />
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">
                          🎯 SEO Tips
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>
                            • Include your location and services in titles
                          </li>
                          <li>• Add high-quality images to your gallery</li>
                          <li>• Encourage customers to leave reviews</li>
                          <li>• Keep your business information up to date</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline">Check SEO Score</Button>
                      <Button>Save SEO Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Customization Access Required
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Contact your admin to enable customization features for your
                    dashboard.
                  </p>
                  <Badge variant="outline">Permission Required</Badge>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
