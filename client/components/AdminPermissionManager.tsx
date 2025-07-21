import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  UserPlus,
  Users,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Key,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  FileText,
  Database,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: "mother_admin" | "subadmin";
  permissions: {
    addClients: boolean;
    editClients: boolean;
    deleteClients: boolean;
    viewAnalytics: boolean;
    manageEmailTemplates: boolean;
    exportData: boolean;
    manageSettings: boolean;
    viewAllBookings: boolean;
    manageSubadmins: boolean;
    accessLegalPages: boolean;
  };
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  clientsCount: number;
  createdBy?: string; // For subadmins
}

interface NewAdminForm {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  permissions: AdminUser["permissions"];
}

export default function AdminPermissionManager() {
  const { user, isMotherAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newAdmin, setNewAdmin] = useState<NewAdminForm>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    permissions: {
      addClients: true,
      editClients: true,
      deleteClients: false,
      viewAnalytics: true,
      manageEmailTemplates: true,
      exportData: true,
      manageSettings: false,
      viewAllBookings: true,
      manageSubadmins: false,
      accessLegalPages: false,
    },
  });

  // Mock data for demo
  useEffect(() => {
    const mockAdmins: AdminUser[] = [
      {
        id: "mother_1",
        username: "admin",
        email: "admin@bookingwithcal.com",
        phone: "+1 555 0100",
        role: "mother_admin",
        permissions: {
          addClients: true,
          editClients: true,
          deleteClients: true,
          viewAnalytics: true,
          manageEmailTemplates: true,
          exportData: true,
          manageSettings: true,
          viewAllBookings: true,
          manageSubadmins: true,
          accessLegalPages: true,
        },
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-28T10:30:00Z",
        isActive: true,
        clientsCount: 25,
      },
      {
        id: "sub_1",
        username: "sarah_manager",
        email: "sarah@company.com",
        phone: "+1 555 0101",
        role: "subadmin",
        permissions: {
          addClients: true,
          editClients: true,
          deleteClients: false,
          viewAnalytics: true,
          manageEmailTemplates: true,
          exportData: true,
          manageSettings: false,
          viewAllBookings: false,
          manageSubadmins: false,
          accessLegalPages: false,
        },
        createdAt: "2024-01-15T00:00:00Z",
        lastLogin: "2024-01-27T14:20:00Z",
        isActive: true,
        clientsCount: 8,
        createdBy: "mother_1",
      },
      {
        id: "sub_2",
        username: "mike_sales",
        email: "mike@company.com",
        phone: "+1 555 0102",
        role: "subadmin",
        permissions: {
          addClients: true,
          editClients: false,
          deleteClients: false,
          viewAnalytics: false,
          manageEmailTemplates: false,
          exportData: false,
          manageSettings: false,
          viewAllBookings: false,
          manageSubadmins: false,
          accessLegalPages: false,
        },
        createdAt: "2024-01-20T00:00:00Z",
        lastLogin: "2024-01-26T09:15:00Z",
        isActive: true,
        clientsCount: 3,
        createdBy: "mother_1",
      },
    ];

    setAdmins(mockAdmins);
  }, []);

  const validateForm = (): boolean => {
    if (!newAdmin.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (newAdmin.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (!newAdmin.email.trim() || !newAdmin.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!newAdmin.password || newAdmin.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (admins.some((admin) => admin.username === newAdmin.username)) {
      setError("Username already exists");
      return false;
    }
    if (admins.some((admin) => admin.email === newAdmin.email)) {
      setError("Email already exists");
      return false;
    }
    return true;
  };

  const handleCreateAdmin = () => {
    setError("");
    if (!validateForm()) return;

    const adminToCreate: AdminUser = {
      id: `sub_${Date.now()}`,
      username: newAdmin.username,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: "subadmin",
      permissions: newAdmin.permissions,
      createdAt: new Date().toISOString(),
      isActive: true,
      clientsCount: 0,
      createdBy: user?.id,
    };

    setAdmins((prev) => [...prev, adminToCreate]);
    setSuccess(`Subadmin "${newAdmin.username}" created successfully`);
    setIsCreateDialogOpen(false);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const resetForm = () => {
    setNewAdmin({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      permissions: {
        addClients: true,
        editClients: true,
        deleteClients: false,
        viewAnalytics: true,
        manageEmailTemplates: true,
        exportData: true,
        manageSettings: false,
        viewAllBookings: true,
        manageSubadmins: false,
        accessLegalPages: false,
      },
    });
    setError("");
  };

  const handleTogglePermission = (
    adminId: string,
    permission: keyof AdminUser["permissions"],
  ) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminId
          ? {
              ...admin,
              permissions: {
                ...admin.permissions,
                [permission]: !admin.permissions[permission],
              },
            }
          : admin,
      ),
    );
  };

  const handleToggleActive = (adminId: string) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === adminId ? { ...admin, isActive: !admin.isActive } : admin,
      ),
    );
  };

  const handleDeleteAdmin = (adminId: string) => {
    const admin = admins.find((a) => a.id === adminId);
    if (admin?.clientsCount > 0) {
      setError(
        `Cannot delete admin with ${admin.clientsCount} clients. Transfer clients first.`,
      );
      setTimeout(() => setError(""), 5000);
      return;
    }
    setAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
    setSuccess("Subadmin deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getPermissionIcon = (permission: keyof AdminUser["permissions"]) => {
    const icons = {
      addClients: UserPlus,
      editClients: Edit,
      deleteClients: Trash2,
      viewAnalytics: BarChart3,
      manageEmailTemplates: Mail,
      exportData: Database,
      manageSettings: Settings,
      viewAllBookings: Calendar,
      manageSubadmins: Users,
      accessLegalPages: FileText,
    };
    return icons[permission];
  };

  const getPermissionLabel = (permission: keyof AdminUser["permissions"]) => {
    const labels = {
      addClients: "Add Clients",
      editClients: "Edit Clients",
      deleteClients: "Delete Clients",
      viewAnalytics: "View Analytics",
      manageEmailTemplates: "Email Templates",
      exportData: "Export Data",
      manageSettings: "Manage Settings",
      viewAllBookings: "View All Bookings",
      manageSubadmins: "Manage Subadmins",
      accessLegalPages: "Legal Pages",
    };
    return labels[permission];
  };

  // Only Mother Admin can access this component
  if (!isMotherAdmin) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Only Mother Admin can manage admin permissions.
        </AlertDescription>
      </Alert>
    );
  }

  const subadmins = admins.filter((admin) => admin.role === "subadmin");
  const activeSubadmins = subadmins.filter((admin) => admin.isActive);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage subadmins and their permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Subadmin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Subadmin</DialogTitle>
              <DialogDescription>
                Add a new subadmin with custom permissions
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newAdmin.username}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="john_doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newAdmin.phone}
                  onChange={(e) =>
                    setNewAdmin((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+1 555 123 4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Minimum 8 characters"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8"
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
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) =>
                      setNewAdmin((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {Object.entries(newAdmin.permissions).map(
                    ([permission, enabled]) => {
                      const Icon = getPermissionIcon(
                        permission as keyof AdminUser["permissions"],
                      );
                      return (
                        <div
                          key={permission}
                          className="flex items-center space-x-2"
                        >
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) =>
                              setNewAdmin((prev) => ({
                                ...prev,
                                permissions: {
                                  ...prev.permissions,
                                  [permission]: checked,
                                },
                              }))
                            }
                          />
                          <Icon className="w-4 h-4" />
                          <Label className="text-sm">
                            {getPermissionLabel(
                              permission as keyof AdminUser["permissions"],
                            )}
                          </Label>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAdmin}>Create Subadmin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Subadmins
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {subadmins.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubadmins.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Total Clients
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {subadmins.reduce(
                    (sum, admin) => sum + admin.clientsCount,
                    0,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Last Login</p>
                <p className="text-sm font-bold text-gray-900">
                  {subadmins
                    .filter((admin) => admin.lastLogin)
                    .sort(
                      (a, b) =>
                        new Date(b.lastLogin!).getTime() -
                        new Date(a.lastLogin!).getTime(),
                    )[0]
                    ?.lastLogin?.split("T")[0] || "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subadmins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subadmin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Admin</th>
                  <th className="text-left p-3">Contact</th>
                  <th className="text-left p-3">Clients</th>
                  <th className="text-left p-3">Last Login</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Permissions</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subadmins.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium">{admin.username}</p>
                          <p className="text-sm text-gray-600">
                            Created {admin.createdAt.split("T")[0]}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-sm">{admin.email}</p>
                        {admin.phone && (
                          <p className="text-sm text-gray-600">{admin.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{admin.clientsCount}</Badge>
                    </td>
                    <td className="p-3">
                      <p className="text-sm">
                        {admin.lastLogin
                          ? admin.lastLogin.split("T")[0]
                          : "Never"}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={admin.isActive}
                          onCheckedChange={() => handleToggleActive(admin.id)}
                        />
                        <Badge
                          variant={admin.isActive ? "default" : "secondary"}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(admin.permissions)
                          .filter(([_, enabled]) => enabled)
                          .slice(0, 3)
                          .map(([permission]) => {
                            const Icon = getPermissionIcon(
                              permission as keyof AdminUser["permissions"],
                            );
                            return (
                              <Badge
                                key={permission}
                                variant="outline"
                                className="text-xs"
                              >
                                <Icon className="w-3 h-3 mr-1" />
                                {
                                  getPermissionLabel(
                                    permission as keyof AdminUser["permissions"],
                                  ).split(" ")[0]
                                }
                              </Badge>
                            );
                          })}
                        {Object.values(admin.permissions).filter(Boolean)
                          .length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +
                            {Object.values(admin.permissions).filter(Boolean)
                              .length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Permissions</DialogTitle>
                              <DialogDescription>
                                Modify permissions for {admin.username}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(admin.permissions).map(
                                ([permission, enabled]) => {
                                  const Icon = getPermissionIcon(
                                    permission as keyof AdminUser["permissions"],
                                  );
                                  return (
                                    <div
                                      key={permission}
                                      className="flex items-center space-x-2"
                                    >
                                      <Switch
                                        checked={enabled}
                                        onCheckedChange={() =>
                                          handleTogglePermission(
                                            admin.id,
                                            permission as keyof AdminUser["permissions"],
                                          )
                                        }
                                      />
                                      <Icon className="w-4 h-4" />
                                      <Label className="text-sm">
                                        {getPermissionLabel(
                                          permission as keyof AdminUser["permissions"],
                                        )}
                                      </Label>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Subadmin
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {admin.username}
                                ? This action cannot be undone.
                                {admin.clientsCount > 0 &&
                                  ` This admin has ${admin.clientsCount} clients that will need to be transferred.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
