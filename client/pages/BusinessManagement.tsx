import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  ExternalLink,
  Clock,
  Users,
  DollarSign,
  Settings,
  Calendar,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  Business,
  Service,
  Provider,
  ETHIOPIAN_REGIONS,
  BUSINESS_TYPES,
  SERVICE_CATEGORIES,
  BusinessHours,
} from "../../shared/types";
import ThemeToggle from "../components/ThemeToggle";

export default function BusinessManagement() {
  const { businessId } = useParams<{ businessId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [blockedDays, setBlockedDays] = useState<{ [key: string]: string }>({
    "2024-01-25": "Emergency maintenance",
    "2024-02-14": "Holiday",
  });
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

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    category: "",
    duration: 30,
    price: 0,
    requiresDeposit: false,
    depositAmount: 0,
    serviceType: "fixed" as "fixed" | "flexible",
    isOnlineBookable: true,
  });

  const [newProvider, setNewProvider] = useState({
    name: "",
    bio: "",
    specialties: [] as string[],
    phoneNumber: "",
    email: "",
    workingDays: [] as string[],
    workingHours: { start: "09:00", end: "17:00" },
  });

  useEffect(() => {
    // Mock data - in production this would fetch from API
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
      website: "www.barberzone.et",
      socialMedia: {
        instagram: "@barberzoneaa",
        telegram: "@barberzoneofficial",
      },
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
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
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

    setTimeout(() => {
      setBusiness(mockBusiness);
      setServices(mockServices);
      setProviders(mockProviders);
      setBusinessHours(mockBusiness.businessHours);
      setIsLoading(false);
    }, 500);
  }, [businessId]);

  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      businessId: businessId!,
      ...newService,
      isActive: true,
    };

    setServices([...services, service]);
    setIsAddServiceOpen(false);
    resetServiceForm();
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      requiresDeposit: service.requiresDeposit || false,
      depositAmount: service.depositAmount || 0,
      serviceType: service.serviceType || "fixed",
      isOnlineBookable: service.isOnlineBookable !== false,
    });
  };

  const handleUpdateService = () => {
    if (!editingService) return;

    const updatedServices = services.map((s) =>
      s.id === editingService.id ? { ...s, ...newService } : s,
    );

    setServices(updatedServices);
    setEditingService(null);
    resetServiceForm();
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId));
  };

  const handleAddProvider = () => {
    const provider: Provider = {
      id: Date.now().toString(),
      businessId: businessId!,
      ...newProvider,
      isActive: true,
    };

    setProviders([...providers, provider]);
    setIsAddProviderOpen(false);
    resetProviderForm();
  };

  const handleEditProvider = (provider: Provider) => {
    setEditingProvider(provider);
    setNewProvider({
      name: provider.name,
      bio: provider.bio || "",
      specialties: provider.specialties,
      phoneNumber: provider.phoneNumber || "",
      email: provider.email || "",
      workingDays: provider.workingDays,
      workingHours: provider.workingHours,
    });
  };

  const handleUpdateProvider = () => {
    if (!editingProvider) return;

    const updatedProviders = providers.map((p) =>
      p.id === editingProvider.id ? { ...p, ...newProvider } : p,
    );

    setProviders(updatedProviders);
    setEditingProvider(null);
    resetProviderForm();
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter((p) => p.id !== providerId));
  };

  const resetServiceForm = () => {
    setNewService({
      name: "",
      description: "",
      category: "",
      duration: 30,
      price: 0,
      requiresDeposit: false,
      depositAmount: 0,
      serviceType: "fixed" as "fixed" | "flexible",
      isOnlineBookable: true,
    });
  };

  const resetProviderForm = () => {
    setNewProvider({
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
    if (specialty && !newProvider.specialties.includes(specialty)) {
      setNewProvider({
        ...newProvider,
        specialties: [...newProvider.specialties, specialty],
      });
    }
  };

  const removeSpecialty = (specialty: string) => {
    setNewProvider({
      ...newProvider,
      specialties: newProvider.specialties.filter((s) => s !== specialty),
    });
  };

  const toggleWorkingDay = (day: string) => {
    const workingDays = newProvider.workingDays.includes(day)
      ? newProvider.workingDays.filter((d) => d !== day)
      : [...newProvider.workingDays, day];

    setNewProvider({ ...newProvider, workingDays });
  };

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
          <Link to="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage {business.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  Edit all aspects of this business's booking page
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${business.slug}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(`/${business.slug}/dashboard`, "_blank")
                }
              >
                Client Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">
              Services ({services.length})
            </TabsTrigger>
            <TabsTrigger value="providers">
              Staff ({providers.length})
            </TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {services.length}
                  </div>
                  <p className="text-sm text-gray-600">
                    Average: ETB{" "}
                    {services.length > 0
                      ? Math.round(
                          services.reduce((sum, s) => sum + s.price, 0) /
                            services.length,
                        )
                      : 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    Staff Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {providers.length}
                  </div>
                  <p className="text-sm text-gray-600">
                    {providers.filter((p) => p.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-purple-500" />
                    Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {providers.length * 8}
                  </div>
                  <p className="text-sm text-gray-600">
                    Slots per day (estimated)
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Basic information about {business.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input value={business.name} className="mt-1" readOnly />
                  </div>
                  <div>
                    <Label>Business Type</Label>
                    <Input
                      value={business.businessType}
                      className="mt-1"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={business.email} className="mt-1" readOnly />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={business.phone} className="mt-1" readOnly />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={business.city} className="mt-1" readOnly />
                  </div>
                  <div>
                    <Label>Region</Label>
                    <Input value={business.region} className="mt-1" readOnly />
                  </div>
                </div>
                <div>
                  <Label>Location Link</Label>
                  <Input
                    value={business.locationLink || "Not set"}
                    className="mt-1"
                    readOnly
                    placeholder="Google Maps or location link"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Location link for customers to find the business
                  </p>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={business.description}
                    className="mt-1"
                    readOnly
                  />
                </div>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Services Management</CardTitle>
                    <CardDescription>
                      Manage all services offered by {business.name}
                    </CardDescription>
                  </div>
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
                          Create a new service for this business
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="service-name">Service Name</Label>
                            <Input
                              id="service-name"
                              value={newService.name}
                              onChange={(e) =>
                                setNewService({
                                  ...newService,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Classic Haircut"
                            />
                          </div>
                          <div>
                            <Label htmlFor="service-category">Category</Label>
                            <Select
                              value={newService.category}
                              onValueChange={(value) =>
                                setNewService({
                                  ...newService,
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

                        {/* Service Type Selection */}
                        <div>
                          <Label htmlFor="service-type">Service Type</Label>
                          <Select
                            value={newService.serviceType || "fixed"}
                            onValueChange={(value: "fixed" | "flexible") =>
                              setNewService({
                                ...newService,
                                serviceType: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">
                                📏 Fixed Duration - Standard booking with exact
                                time
                              </SelectItem>
                              <SelectItem value="flexible">
                                ⏳ Flexible Duration - Time to be confirmed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-sm text-gray-600 mt-1">
                            {newService.serviceType === "flexible" ? (
                              <span className="text-orange-600">
                                ⚠️ Flexible services require manual confirmation
                              </span>
                            ) : (
                              <span className="text-green-600">
                                ✅ Fixed services allow direct booking
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="service-description">
                            Description
                          </Label>
                          <Textarea
                            id="service-description"
                            value={newService.description}
                            onChange={(e) =>
                              setNewService({
                                ...newService,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the service..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="service-duration">
                              Duration (minutes)
                            </Label>
                            <Input
                              id="service-duration"
                              type="number"
                              value={newService.duration}
                              onChange={(e) =>
                                setNewService({
                                  ...newService,
                                  duration: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="service-price">Price (ETB)</Label>
                            <Input
                              id="service-price"
                              type="number"
                              value={newService.price}
                              onChange={(e) =>
                                setNewService({
                                  ...newService,
                                  price: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="requires-deposit"
                            checked={newService.requiresDeposit}
                            onCheckedChange={(checked) =>
                              setNewService({
                                ...newService,
                                requiresDeposit: checked,
                              })
                            }
                          />
                          <Label htmlFor="requires-deposit">
                            Requires Deposit
                          </Label>
                        </div>
                        {newService.requiresDeposit && (
                          <div>
                            <Label htmlFor="deposit-amount">
                              Deposit Amount (ETB)
                            </Label>
                            <Input
                              id="deposit-amount"
                              type="number"
                              value={newService.depositAmount}
                              onChange={(e) =>
                                setNewService({
                                  ...newService,
                                  depositAmount: parseInt(e.target.value) || 0,
                                })
                              }
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
                            !newService.name ||
                            !newService.category ||
                            newService.price <= 0
                          }
                        >
                          Add Service
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      Add services that this business offers
                    </p>
                    <Button onClick={() => setIsAddServiceOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Service
                    </Button>
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
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration} min
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                ETB {service.price}
                              </span>
                              {service.requiresDeposit && (
                                <span>
                                  Deposit: ETB {service.depositAmount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  service.serviceType === "flexible"
                                    ? "secondary"
                                    : "default"
                                }
                                className={
                                  service.serviceType === "flexible"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {service.serviceType === "flexible"
                                  ? "⏳ Flexible Duration"
                                  : "📏 Fixed Duration"}
                              </Badge>
                              {service.serviceType === "flexible" && (
                                <Badge variant="outline" className="text-xs">
                                  Manual Confirmation Required
                                </Badge>
                              )}
                            </div>
                          </div>
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
                                  <DialogDescription>
                                    Update service information
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Service Name</Label>
                                      <Input
                                        value={newService.name}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Category</Label>
                                      <Select
                                        value={newService.category}
                                        onValueChange={(value) =>
                                          setNewService({
                                            ...newService,
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
                                      value={newService.description}
                                      onChange={(e) =>
                                        setNewService({
                                          ...newService,
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
                                        value={newService.duration}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            duration:
                                              parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Price (ETB)</Label>
                                      <Input
                                        type="number"
                                        value={newService.price}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
                                            price:
                                              parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={newService.requiresDeposit}
                                      onCheckedChange={(checked) =>
                                        setNewService({
                                          ...newService,
                                          requiresDeposit: checked,
                                        })
                                      }
                                    />
                                    <Label>Requires Deposit</Label>
                                  </div>
                                  {newService.requiresDeposit && (
                                    <div>
                                      <Label>Deposit Amount (ETB)</Label>
                                      <Input
                                        type="number"
                                        value={newService.depositAmount}
                                        onChange={(e) =>
                                          setNewService({
                                            ...newService,
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
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Staff Management</CardTitle>
                    <CardDescription>
                      Manage staff members and their schedules
                    </CardDescription>
                  </div>
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
                          Add a new staff member to provide services
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Full Name</Label>
                            <Input
                              value={newProvider.name}
                              onChange={(e) =>
                                setNewProvider({
                                  ...newProvider,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Mike Johnson"
                            />
                          </div>
                          <div>
                            <Label>Phone Number</Label>
                            <Input
                              value={newProvider.phoneNumber}
                              onChange={(e) =>
                                setNewProvider({
                                  ...newProvider,
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
                            value={newProvider.email}
                            onChange={(e) =>
                              setNewProvider({
                                ...newProvider,
                                email: e.target.value,
                              })
                            }
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <Label>Bio</Label>
                          <Textarea
                            value={newProvider.bio}
                            onChange={(e) =>
                              setNewProvider({
                                ...newProvider,
                                bio: e.target.value,
                              })
                            }
                            placeholder="Brief description of experience and expertise..."
                          />
                        </div>
                        <div>
                          <Label>Specialties</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {newProvider.specialties.map((specialty) => (
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
                                  checked={newProvider.workingDays.includes(
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
                              value={newProvider.workingHours.start}
                              onChange={(e) =>
                                setNewProvider({
                                  ...newProvider,
                                  workingHours: {
                                    ...newProvider.workingHours,
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
                              value={newProvider.workingHours.end}
                              onChange={(e) =>
                                setNewProvider({
                                  ...newProvider,
                                  workingHours: {
                                    ...newProvider.workingHours,
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
                            !newProvider.name ||
                            newProvider.workingDays.length === 0
                          }
                        >
                          Add Staff Member
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      Add staff members who will provide services
                    </p>
                    <Button onClick={() => setIsAddProviderOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Staff Member
                    </Button>
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
                                  <DialogDescription>
                                    Update staff member information
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                                  {/* Same form fields as add provider */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Full Name</Label>
                                      <Input
                                        value={newProvider.name}
                                        onChange={(e) =>
                                          setNewProvider({
                                            ...newProvider,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Phone Number</Label>
                                      <Input
                                        value={newProvider.phoneNumber}
                                        onChange={(e) =>
                                          setNewProvider({
                                            ...newProvider,
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
                                      value={newProvider.email}
                                      onChange={(e) =>
                                        setNewProvider({
                                          ...newProvider,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Bio</Label>
                                    <Textarea
                                      value={newProvider.bio}
                                      onChange={(e) =>
                                        setNewProvider({
                                          ...newProvider,
                                          bio: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Specialties</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {newProvider.specialties.map(
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
                                            checked={newProvider.workingDays.includes(
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
                                        value={newProvider.workingHours.start}
                                        onChange={(e) =>
                                          setNewProvider({
                                            ...newProvider,
                                            workingHours: {
                                              ...newProvider.workingHours,
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
                                        value={newProvider.workingHours.end}
                                        onChange={(e) =>
                                          setNewProvider({
                                            ...newProvider,
                                            workingHours: {
                                              ...newProvider.workingHours,
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
                                    Delete Staff Member
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove "
                                    {provider.name}" from the staff? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Day-Off Management
                </CardTitle>
                <CardDescription>
                  Block specific days when the business is unavailable
                  (emergencies, holidays, etc.)
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
                              startDate.getDate() - firstDayOfMonth.getDay(),
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
                                {new Date(date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
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
                            Block {new Date(selectedDate).toLocaleDateString()}
                          </h4>
                          <div className="space-y-3">
                            <Input
                              placeholder="Reason for blocking (e.g., Emergency, Holiday, Maintenance)"
                              value={blockReason}
                              onChange={(e) => setBlockReason(e.target.value)}
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

                      <div className="text-center py-4 text-gray-500 text-sm">
                        <p>
                          <strong>How to use:</strong>
                        </p>
                        <p>• Click on any future date to block it</p>
                        <p>• Click on a blocked date (red) to unblock it</p>
                        <p>
                          • Perfect for emergencies, holidays, or maintenance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Time-Off Feature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                  Emergency Time-Off
                </CardTitle>
                <CardDescription>
                  Quickly block specific hours for emergencies, breaks, or
                  unexpected events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergency-date">Select Date</Label>
                      <Input
                        id="emergency-date"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergency-start-time">Start Time</Label>
                        <Input
                          id="emergency-start-time"
                          type="time"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency-end-time">End Time</Label>
                        <Input
                          id="emergency-end-time"
                          type="time"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emergency-reason">Reason</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">
                            🚨 Emergency
                          </SelectItem>
                          <SelectItem value="sick">🤒 Sick Leave</SelectItem>
                          <SelectItem value="break">
                            ☕ Extended Break
                          </SelectItem>
                          <SelectItem value="appointment">
                            👩‍⚕️ Personal Appointment
                          </SelectItem>
                          <SelectItem value="maintenance">
                            🔧 Equipment Maintenance
                          </SelectItem>
                          <SelectItem value="other">❓ Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="emergency-description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="emergency-description"
                        placeholder="Additional details about the time-off..."
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Clock className="w-4 h-4 mr-2" />
                        Block Time
                      </Button>
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear Form
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Today's Time Blocks</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {/* Example time blocks - these would come from state */}
                      <div className="border rounded-lg p-3 bg-orange-50 border-orange-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-orange-900">
                              2:00 PM - 3:30 PM
                            </div>
                            <div className="text-sm text-orange-700">
                              🚨 Emergency - Equipment breakdown
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-blue-900">
                              12:00 PM - 1:00 PM
                            </div>
                            <div className="text-sm text-blue-700">
                              ☕ Extended Break - Lunch with client
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-center py-4 text-gray-500 text-sm">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No time blocks for today</p>
                        <p className="text-xs">Add emergency time-offs above</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h5 className="font-medium text-yellow-900 mb-2">
                        ⚡ Quick Actions
                      </h5>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Block Next 30 Minutes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Block Next Hour
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Block Rest of Day
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Business Hours Management
                </CardTitle>
                <CardDescription>
                  Set operating hours for {business?.name} - these will apply to
                  customer bookings
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
                        <span className="capitalize font-medium">{day}</span>
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
                  <div className="flex space-x-4">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Business Hours
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Reset to original business hours
                        if (business?.businessHours) {
                          setBusinessHours(business.businessHours);
                        }
                      }}
                    >
                      Reset to Original
                    </Button>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Admin Tip
                    </h4>
                    <p className="text-sm text-blue-700">
                      These hours control when customers can book appointments.
                      Changes here will affect the available time slots on the
                      booking page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Client Dashboard Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Client Dashboard Access
                </CardTitle>
                <CardDescription>
                  Manage login credentials and access permissions for{" "}
                  {business?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="font-medium text-yellow-800">
                      Dashboard Access Status
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Dashboard access is currently <strong>ENABLED</strong>. The
                    business owner can access their dashboard with the
                    credentials below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Login Credentials</h3>

                    <div>
                      <Label>Username</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          value="barber_zone_admin"
                          className="flex-1"
                          readOnly
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Password</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          type="password"
                          value="demo123"
                          className="flex-1"
                          readOnly
                        />
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">
                        Dashboard URL
                      </h4>
                      <code className="text-sm text-blue-700 break-all">
                        {window.location.origin}/{business?.slug}/dashboard
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/${business?.slug}/dashboard`,
                          );
                          alert("Dashboard URL copied!");
                        }}
                      >
                        Copy Dashboard URL
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Access Permissions
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Edit Business Info</div>
                          <div className="text-sm text-gray-600">
                            Update business details and contact info
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Manage Services</div>
                          <div className="text-sm text-gray-600">
                            Add, edit, and delete services
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Manage Staff</div>
                          <div className="text-sm text-gray-600">
                            Add, edit, and remove staff members
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Schedule Management</div>
                          <div className="text-sm text-gray-600">
                            Block days and manage availability
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">View Analytics</div>
                          <div className="text-sm text-gray-600">
                            Access booking statistics and reports
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex space-x-4">
                    <Button className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Save Access Settings
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Change Credentials
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Login Credentials</DialogTitle>
                          <DialogDescription>
                            Change the username and password for{" "}
                            {business?.name} dashboard access
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <Label>New Username</Label>
                            <Input placeholder="Enter new username" />
                          </div>
                          <div>
                            <Label>New Password</Label>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <Label>Confirm Password</Label>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Update Credentials</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="destructive">
                      Disable Dashboard Access
                    </Button>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">
                    ⚠️ Important Security Notes
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>
                      • Only share dashboard credentials with trusted business
                      owners
                    </li>
                    <li>• Change passwords regularly for security</li>
                    <li>• You can disable access at any time</li>
                    <li>• All dashboard activity is logged and monitored</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Business Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Business Configuration</CardTitle>
                <CardDescription>
                  Additional settings and configuration options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Public Booking Page</div>
                      <div className="text-sm text-gray-600">
                        Allow customers to book appointments online
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">
                        Send booking confirmations and reminders
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Online Payments</div>
                      <div className="text-sm text-gray-600">
                        Accept payments through the booking system
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button className="mt-6 bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
