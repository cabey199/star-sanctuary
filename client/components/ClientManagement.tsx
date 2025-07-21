import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Lock,
  Unlock,
  Building2,
  Users,
  Calendar,
  Settings,
  Shield,
  AlertCircle,
  Check,
  X,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ClientCredentials {
  username: string;
  password: string;
  dashboardEnabled: boolean;
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
}

interface Client {
  id: string;
  businessName: string;
  businessSlug: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  businessType: string;
  status: "active" | "inactive" | "suspended";
  createdBy: string;
  createdAt: string;
  lastLogin: string | null;
  totalBookings: number;
  monthlyRevenue: number;
  credentials: ClientCredentials;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    customDomain: string;
    favicon: string;
  };
  emailSettings: {
    confirmationEmailEnabled: boolean;
    reminderEmailEnabled: boolean;
    customTemplate: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const ClientManagement: React.FC = () => {
  const { user, isMotherAdmin, isSubadmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [newClient, setNewClient] = useState<Partial<Client>>({
    businessName: "",
    businessSlug: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    businessType: "",
    status: "active",
    credentials: {
      username: "",
      password: "",
      dashboardEnabled: true,
      permissions: {
        canEditBranding: true,
        canManageServices: true,
        canViewAnalytics: false,
        canExportData: false,
        canManageBookings: true,
        canAccessSettings: false,
        canUploadImages: true,
        canManageReviews: true,
      },
    },
    branding: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logoUrl: "",
      customDomain: "",
      favicon: "",
    },
    emailSettings: {
      confirmationEmailEnabled: true,
      reminderEmailEnabled: true,
      customTemplate: "",
    },
    seoSettings: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  // Mock data for demonstration
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const mockClients: Client[] = [
          {
            id: "1",
            businessName: "Elite Barber Shop",
            businessSlug: "elite-barber",
            contactEmail: "contact@elitebarber.com",
            contactPhone: "+1234567890",
            description: "Premium barbering services in the heart of the city",
            businessType: "Beauty & Personal Care",
            status: "active",
            createdBy: isMotherAdmin ? "mother_admin" : user?.id || "",
            createdAt: "2024-01-15",
            lastLogin: "2024-01-20",
            totalBookings: 156,
            monthlyRevenue: 2450,
            credentials: {
              username: "elitebarber_admin",
              password: "SecurePass123!",
              dashboardEnabled: true,
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
            branding: {
              primaryColor: "#8b5a3c",
              secondaryColor: "#5d3a28",
              logoUrl: "",
              customDomain: "",
              favicon: "",
            },
            emailSettings: {
              confirmationEmailEnabled: true,
              reminderEmailEnabled: true,
              customTemplate: "",
            },
            seoSettings: {
              metaTitle: "Elite Barber Shop - Premium Barbering Services",
              metaDescription:
                "Book your appointment at Elite Barber Shop for premium haircuts and grooming services.",
              keywords: ["barber", "haircut", "grooming", "men's salon"],
            },
          },
          {
            id: "2",
            businessName: "Wellness Spa Center",
            businessSlug: "wellness-spa",
            contactEmail: "info@wellnessspa.com",
            contactPhone: "+1234567891",
            description: "Relaxation and wellness services for mind and body",
            businessType: "Health & Wellness",
            status: "active",
            createdBy: isMotherAdmin ? "mother_admin" : user?.id || "",
            createdAt: "2024-01-10",
            lastLogin: null,
            totalBookings: 89,
            monthlyRevenue: 1890,
            credentials: {
              username: "wellness_admin",
              password: "WellnessSecure456!",
              dashboardEnabled: true,
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
            branding: {
              primaryColor: "#059669",
              secondaryColor: "#047857",
              logoUrl: "",
              customDomain: "",
              favicon: "",
            },
            emailSettings: {
              confirmationEmailEnabled: true,
              reminderEmailEnabled: false,
              customTemplate: "",
            },
            seoSettings: {
              metaTitle: "Wellness Spa Center - Relaxation & Wellness Services",
              metaDescription:
                "Experience ultimate relaxation with our professional spa and wellness services.",
              keywords: ["spa", "wellness", "massage", "relaxation"],
            },
          },
        ];

        // Apply role-based filtering
        const userClients = isMotherAdmin
          ? mockClients
          : mockClients.filter((client) => client.createdBy === user?.id);

        setClients(userClients);
        setFilteredClients(userClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClients();
    }
  }, [user, isMotherAdmin]);

  // Filter clients based on search and status
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.contactEmail
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.businessType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const generatePassword = () => {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const generateUsername = (businessName: string) => {
    const baseUsername = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 12);
    return `${baseUsername}_admin`;
  };

  const handleCreateClient = async () => {
    try {
      if (!newClient.businessName) return;

      const clientData = {
        ...newClient,
        id: Date.now().toString(),
        createdBy: user?.id || "",
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: null,
        totalBookings: 0,
        monthlyRevenue: 0,
        businessSlug:
          newClient.businessSlug || generateSlug(newClient.businessName),
        credentials: {
          ...newClient.credentials!,
          username:
            newClient.credentials?.username ||
            generateUsername(newClient.businessName),
          password: newClient.credentials?.password || generatePassword(),
        },
        seoSettings: {
          metaTitle: `${newClient.businessName} - Book Online`,
          metaDescription: `Book your appointment at ${newClient.businessName}. ${newClient.description}`,
          keywords: [newClient.businessType || "", "booking", "appointment"],
        },
      };

      setClients([...clients, clientData as Client]);
      setIsCreateDialogOpen(false);

      // Reset form
      setNewClient({
        businessName: "",
        businessSlug: "",
        contactEmail: "",
        contactPhone: "",
        description: "",
        businessType: "",
        status: "active",
        credentials: {
          username: "",
          password: "",
          dashboardEnabled: true,
          permissions: {
            canEditBranding: true,
            canManageServices: true,
            canViewAnalytics: false,
            canExportData: false,
            canManageBookings: true,
            canAccessSettings: false,
            canUploadImages: true,
            canManageReviews: true,
          },
        },
        branding: {
          primaryColor: "#3b82f6",
          secondaryColor: "#1e40af",
          logoUrl: "",
          customDomain: "",
          favicon: "",
        },
        emailSettings: {
          confirmationEmailEnabled: true,
          reminderEmailEnabled: true,
          customTemplate: "",
        },
        seoSettings: {
          metaTitle: "",
          metaDescription: "",
          keywords: [],
        },
      });
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;

    try {
      const updatedClients = clients.map((client) =>
        client.id === selectedClient.id ? selectedClient : client,
      );
      setClients(updatedClients);
      setIsEditDialogOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  const toggleClientStatus = async (
    clientId: string,
    newStatus: "active" | "inactive" | "suspended",
  ) => {
    try {
      const updatedClients = clients.map((client) =>
        client.id === clientId ? { ...client, status: newStatus } : client,
      );
      setClients(updatedClients);
    } catch (error) {
      console.error("Failed to update client status:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canManageClient = (client: Client) => {
    return isMotherAdmin || client.createdBy === user?.id;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePasswordVisibility = (clientId: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Client Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isMotherAdmin
              ? "Manage all clients and their business accounts across the platform"
              : "Manage the clients and businesses you have added to the platform"}
          </p>
        </div>

        {(isMotherAdmin ||
          (isSubadmin && user?.permissions?.canAddClients)) && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Client Account</DialogTitle>
                <DialogDescription>
                  Set up a new client business with dashboard access and
                  permissions
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="credentials">Login</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={newClient.businessName}
                        onChange={(e) => {
                          const name = e.target.value;
                          setNewClient({
                            ...newClient,
                            businessName: name,
                            businessSlug: generateSlug(name),
                            credentials: {
                              ...newClient.credentials!,
                              username: generateUsername(name),
                            },
                          });
                        }}
                        placeholder="Elite Barber Shop"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessSlug">URL Slug *</Label>
                      <Input
                        id="businessSlug"
                        value={newClient.businessSlug}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            businessSlug: e.target.value,
                          })
                        }
                        placeholder="elite-barber-shop"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Public URL: /{newClient.businessSlug}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={newClient.contactEmail}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            contactEmail: e.target.value,
                          })
                        }
                        placeholder="contact@elitebarber.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={newClient.contactPhone}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            contactPhone: e.target.value,
                          })
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={newClient.description}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          description: e.target.value,
                        })
                      }
                      placeholder="Premium barbering services in the heart of the city"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select
                      value={newClient.businessType}
                      onValueChange={(value) =>
                        setNewClient({ ...newClient, businessType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beauty & Personal Care">
                          Beauty & Personal Care
                        </SelectItem>
                        <SelectItem value="Health & Wellness">
                          Health & Wellness
                        </SelectItem>
                        <SelectItem value="Professional Services">
                          Professional Services
                        </SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Home Services">
                          Home Services
                        </SelectItem>
                        <SelectItem value="Education & Training">
                          Education & Training
                        </SelectItem>
                        <SelectItem value="Food & Dining">
                          Food & Dining
                        </SelectItem>
                        <SelectItem value="Entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="credentials" className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Dashboard Login Credentials
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      These credentials will be used to access the client
                      dashboard at /{newClient.businessSlug}/dashboard
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="username">Dashboard Username</Label>
                    <Input
                      id="username"
                      value={newClient.credentials?.username}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          credentials: {
                            ...newClient.credentials!,
                            username: e.target.value,
                          },
                        })
                      }
                      placeholder="elitebarber_admin"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Dashboard Password</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="password"
                        type="password"
                        value={newClient.credentials?.password}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            credentials: {
                              ...newClient.credentials!,
                              password: e.target.value,
                            },
                          })
                        }
                        placeholder="Secure password"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setNewClient({
                            ...newClient,
                            credentials: {
                              ...newClient.credentials!,
                              password: generatePassword(),
                            },
                          })
                        }
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 characters with letters, numbers, and symbols
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="dashboardEnabled"
                      checked={newClient.credentials?.dashboardEnabled}
                      onCheckedChange={(checked) =>
                        setNewClient({
                          ...newClient,
                          credentials: {
                            ...newClient.credentials!,
                            dashboardEnabled: checked,
                          },
                        })
                      }
                    />
                    <Label htmlFor="dashboardEnabled">
                      Enable Dashboard Access
                    </Label>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-4">
                      Client Dashboard Permissions
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          key: "canEditBranding",
                          label: "Edit Branding & Colors",
                          description:
                            "Customize logo, colors, and visual identity",
                        },
                        {
                          key: "canManageServices",
                          label: "Manage Services",
                          description:
                            "Add, edit, and remove services and pricing",
                        },
                        {
                          key: "canViewAnalytics",
                          label: "View Analytics",
                          description:
                            "Access booking statistics and performance data",
                        },
                        {
                          key: "canExportData",
                          label: "Export Data",
                          description:
                            "Download booking data in CSV/PDF formats",
                        },
                        {
                          key: "canManageBookings",
                          label: "Manage Bookings",
                          description:
                            "View, confirm, cancel, and reschedule bookings",
                        },
                        {
                          key: "canAccessSettings",
                          label: "Access Settings",
                          description:
                            "Modify account settings and preferences",
                        },
                        {
                          key: "canUploadImages",
                          label: "Upload Images",
                          description:
                            "Add photos to gallery and service images",
                        },
                        {
                          key: "canManageReviews",
                          label: "Manage Reviews",
                          description:
                            "Respond to and moderate customer reviews",
                        },
                      ].map((permission) => (
                        <div
                          key={permission.key}
                          className="flex items-start space-x-3 p-3 border rounded-lg"
                        >
                          <Switch
                            id={permission.key}
                            checked={
                              newClient.credentials?.permissions?.[
                                permission.key as keyof typeof newClient.credentials.permissions
                              ]
                            }
                            onCheckedChange={(checked) =>
                              setNewClient({
                                ...newClient,
                                credentials: {
                                  ...newClient.credentials!,
                                  permissions: {
                                    ...newClient.credentials!.permissions,
                                    [permission.key]: checked,
                                  },
                                },
                              })
                            }
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={permission.key}
                              className="font-medium"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="branding" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={newClient.branding?.primaryColor}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              branding: {
                                ...newClient.branding!,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={newClient.branding?.primaryColor}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              branding: {
                                ...newClient.branding!,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="color"
                          value={newClient.branding?.secondaryColor}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              branding: {
                                ...newClient.branding!,
                                secondaryColor: e.target.value,
                              },
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={newClient.branding?.secondaryColor}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              branding: {
                                ...newClient.branding!,
                                secondaryColor: e.target.value,
                              },
                            })
                          }
                          placeholder="#1e40af"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={newClient.branding?.logoUrl}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          branding: {
                            ...newClient.branding!,
                            logoUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customDomain">
                      Custom Domain (Optional)
                    </Label>
                    <Input
                      id="customDomain"
                      value={newClient.branding?.customDomain}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          branding: {
                            ...newClient.branding!,
                            customDomain: e.target.value,
                          },
                        })
                      }
                      placeholder="booking.yourdomain.com"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={
                    !newClient.businessName ||
                    !newClient.contactEmail ||
                    !newClient.businessType
                  }
                >
                  Create Client Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search clients by name, email, or business type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client Cards */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Clients Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "No clients match your current filter criteria"
                : "You haven't added any clients yet. Create your first client to get started!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="hover:shadow-lg transition-shadow border"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {client.businessName}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {client.businessType}
                    </p>
                  </div>
                  {getStatusBadge(client.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Email:</strong> {client.contactEmail}
                    </p>
                    <p>
                      <strong>Phone:</strong> {client.contactPhone}
                    </p>
                    <p>
                      <strong>URL:</strong> /{client.businessSlug}
                    </p>
                    <p>
                      <strong>Dashboard:</strong> /{client.businessSlug}
                      /dashboard
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Login Credentials:
                    </p>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono">
                        {client.credentials.username}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(client.credentials.username)
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono">
                        {showPassword[client.id]
                          ? client.credentials.password
                          : "••••••••••••"}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(client.id)}
                        >
                          {showPassword[client.id] ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(client.credentials.password)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Total Bookings
                      </p>
                      <p className="font-medium">{client.totalBookings}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Monthly Revenue
                      </p>
                      <p className="font-medium">${client.monthlyRevenue}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <p>Created: {client.createdAt}</p>
                    <p>Last Login: {client.lastLogin || "Never"}</p>
                    {!isMotherAdmin && <p>Managed by you</p>}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`/${client.businessSlug}`, "_blank")
                      }
                      className="flex items-center"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Site
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/${client.businessSlug}/dashboard`,
                          "_blank",
                        )
                      }
                      className="flex items-center"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Dashboard
                    </Button>

                    {canManageClient(client) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            setIsEditDialogOpen(true);
                          }}
                          className="flex items-center"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Client Account
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "
                                {client.businessName}"? This will permanently
                                remove all data including bookings, reviews, and
                                settings. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClient(client.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>

                  {canManageClient(client) && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Quick Status:
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant={
                            client.status === "active" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleClientStatus(client.id, "active")
                          }
                          className="text-xs px-2 py-1"
                        >
                          Active
                        </Button>
                        <Button
                          variant={
                            client.status === "inactive" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleClientStatus(client.id, "inactive")
                          }
                          className="text-xs px-2 py-1"
                        >
                          Inactive
                        </Button>
                        <Button
                          variant={
                            client.status === "suspended"
                              ? "destructive"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            toggleClientStatus(client.id, "suspended")
                          }
                          className="text-xs px-2 py-1"
                        >
                          Suspend
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Client Dialog */}
      {selectedClient && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Edit Client: {selectedClient.businessName}
              </DialogTitle>
              <DialogDescription>
                Update client information, credentials, and permissions
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="credentials">Login</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-businessName">Business Name</Label>
                    <Input
                      id="edit-businessName"
                      value={selectedClient.businessName}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          businessName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-businessSlug">URL Slug</Label>
                    <Input
                      id="edit-businessSlug"
                      value={selectedClient.businessSlug}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          businessSlug: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-contactEmail">Contact Email</Label>
                    <Input
                      id="edit-contactEmail"
                      type="email"
                      value={selectedClient.contactEmail}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          contactEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-contactPhone">Contact Phone</Label>
                    <Input
                      id="edit-contactPhone"
                      value={selectedClient.contactPhone}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedClient.description}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-businessType">Business Type</Label>
                  <Select
                    value={selectedClient.businessType}
                    onValueChange={(value) =>
                      setSelectedClient({
                        ...selectedClient,
                        businessType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beauty & Personal Care">
                        Beauty & Personal Care
                      </SelectItem>
                      <SelectItem value="Health & Wellness">
                        Health & Wellness
                      </SelectItem>
                      <SelectItem value="Professional Services">
                        Professional Services
                      </SelectItem>
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Home Services">
                        Home Services
                      </SelectItem>
                      <SelectItem value="Education & Training">
                        Education & Training
                      </SelectItem>
                      <SelectItem value="Food & Dining">
                        Food & Dining
                      </SelectItem>
                      <SelectItem value="Entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Security Notice
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Only Mother Admin and authorized Subadmins can modify client
                    credentials. Clients cannot change their own login details.
                  </p>
                </div>

                <div>
                  <Label htmlFor="edit-username">Dashboard Username</Label>
                  <Input
                    id="edit-username"
                    value={selectedClient.credentials.username}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        credentials: {
                          ...selectedClient.credentials,
                          username: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="edit-password">Dashboard Password</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="edit-password"
                      type={
                        showPassword[selectedClient.id] ? "text" : "password"
                      }
                      value={selectedClient.credentials.password}
                      onChange={(e) =>
                        setSelectedClient({
                          ...selectedClient,
                          credentials: {
                            ...selectedClient.credentials,
                            password: e.target.value,
                          },
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        togglePasswordVisibility(selectedClient.id)
                      }
                    >
                      {showPassword[selectedClient.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setSelectedClient({
                          ...selectedClient,
                          credentials: {
                            ...selectedClient.credentials,
                            password: generatePassword(),
                          },
                        })
                      }
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-dashboardEnabled"
                    checked={selectedClient.credentials.dashboardEnabled}
                    onCheckedChange={(checked) =>
                      setSelectedClient({
                        ...selectedClient,
                        credentials: {
                          ...selectedClient.credentials,
                          dashboardEnabled: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="edit-dashboardEnabled">
                    Enable Dashboard Access
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-4">
                    Client Dashboard Permissions
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        key: "canEditBranding",
                        label: "Edit Branding & Colors",
                        description:
                          "Customize logo, colors, and visual identity",
                      },
                      {
                        key: "canManageServices",
                        label: "Manage Services",
                        description:
                          "Add, edit, and remove services and pricing",
                      },
                      {
                        key: "canViewAnalytics",
                        label: "View Analytics",
                        description:
                          "Access booking statistics and performance data",
                      },
                      {
                        key: "canExportData",
                        label: "Export Data",
                        description: "Download booking data in CSV/PDF formats",
                      },
                      {
                        key: "canManageBookings",
                        label: "Manage Bookings",
                        description:
                          "View, confirm, cancel, and reschedule bookings",
                      },
                      {
                        key: "canAccessSettings",
                        label: "Access Settings",
                        description: "Modify account settings and preferences",
                      },
                      {
                        key: "canUploadImages",
                        label: "Upload Images",
                        description: "Add photos to gallery and service images",
                      },
                      {
                        key: "canManageReviews",
                        label: "Manage Reviews",
                        description: "Respond to and moderate customer reviews",
                      },
                    ].map((permission) => (
                      <div
                        key={permission.key}
                        className="flex items-start space-x-3 p-3 border rounded-lg"
                      >
                        <Switch
                          id={`edit-${permission.key}`}
                          checked={
                            selectedClient.credentials.permissions[
                              permission.key as keyof typeof selectedClient.credentials.permissions
                            ]
                          }
                          onCheckedChange={(checked) =>
                            setSelectedClient({
                              ...selectedClient,
                              credentials: {
                                ...selectedClient.credentials,
                                permissions: {
                                  ...selectedClient.credentials.permissions,
                                  [permission.key]: checked,
                                },
                              },
                            })
                          }
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`edit-${permission.key}`}
                            className="font-medium"
                          >
                            {permission.label}
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="branding" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-primaryColor">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={selectedClient.branding.primaryColor}
                        onChange={(e) =>
                          setSelectedClient({
                            ...selectedClient,
                            branding: {
                              ...selectedClient.branding,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={selectedClient.branding.primaryColor}
                        onChange={(e) =>
                          setSelectedClient({
                            ...selectedClient,
                            branding: {
                              ...selectedClient.branding,
                              primaryColor: e.target.value,
                            },
                          })
                        }
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-secondaryColor">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        value={selectedClient.branding.secondaryColor}
                        onChange={(e) =>
                          setSelectedClient({
                            ...selectedClient,
                            branding: {
                              ...selectedClient.branding,
                              secondaryColor: e.target.value,
                            },
                          })
                        }
                        className="w-16 h-10"
                      />
                      <Input
                        value={selectedClient.branding.secondaryColor}
                        onChange={(e) =>
                          setSelectedClient({
                            ...selectedClient,
                            branding: {
                              ...selectedClient.branding,
                              secondaryColor: e.target.value,
                            },
                          })
                        }
                        placeholder="#1e40af"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-logoUrl">Logo URL</Label>
                  <Input
                    id="edit-logoUrl"
                    value={selectedClient.branding.logoUrl}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        branding: {
                          ...selectedClient.branding,
                          logoUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-customDomain">Custom Domain</Label>
                  <Input
                    id="edit-customDomain"
                    value={selectedClient.branding.customDomain}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        branding: {
                          ...selectedClient.branding,
                          customDomain: e.target.value,
                        },
                      })
                    }
                    placeholder="booking.yourdomain.com"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-favicon">Favicon URL</Label>
                  <Input
                    id="edit-favicon"
                    value={selectedClient.branding.favicon}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        branding: {
                          ...selectedClient.branding,
                          favicon: e.target.value,
                        },
                      })
                    }
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="edit-metaTitle">SEO Title</Label>
                  <Input
                    id="edit-metaTitle"
                    value={selectedClient.seoSettings.metaTitle}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        seoSettings: {
                          ...selectedClient.seoSettings,
                          metaTitle: e.target.value,
                        },
                      })
                    }
                    placeholder="Elite Barber Shop - Book Online"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedClient.seoSettings.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="edit-metaDescription">SEO Description</Label>
                  <Textarea
                    id="edit-metaDescription"
                    value={selectedClient.seoSettings.metaDescription}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        seoSettings: {
                          ...selectedClient.seoSettings,
                          metaDescription: e.target.value,
                        },
                      })
                    }
                    placeholder="Book your appointment at Elite Barber Shop for premium haircuts and grooming services."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedClient.seoSettings.metaDescription.length}/160
                    characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="edit-keywords">SEO Keywords</Label>
                  <Input
                    id="edit-keywords"
                    value={selectedClient.seoSettings.keywords.join(", ")}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        seoSettings: {
                          ...selectedClient.seoSettings,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter((k) => k),
                        },
                      })
                    }
                    placeholder="barber, haircut, grooming, men's salon"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateClient}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientManagement;
