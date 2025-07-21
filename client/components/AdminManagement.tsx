import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  Settings,
  Key,
  Shield,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Check,
  X,
  Lock,
  Users,
  Building2,
  BarChart3,
  Mail,
  Palette,
  Calendar,
  FileText,
  Megaphone,
  RefreshCw,
  Copy,
} from "lucide-react";
import { User, UserPermissions } from "../../shared/types";

interface AdminManagementProps {
  isMotherAdmin: boolean;
}

interface SubadminFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  permissions: UserPermissions;
}

interface ClientCredentialData {
  businessId: string;
  businessName: string;
  username: string;
  password: string;
  permissions: {
    canEditBusinessInfo: boolean;
    canManageServices: boolean;
    canManageStaff: boolean;
    canManageSchedule: boolean;
    canViewAnalytics: boolean;
    canEditBranding: boolean;
    canAccessPromotionTools: boolean;
  };
}

export default function AdminManagement({
  isMotherAdmin,
}: AdminManagementProps) {
  const [showSubadminDialog, setShowSubadminDialog] = useState(false);
  const [showClientCredentialsDialog, setShowClientCredentialsDialog] =
    useState(false);
  const [subadmins, setSubadmins] = useState<User[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientCredentials, setClientCredentials] = useState<
    ClientCredentialData[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [subadminForm, setSubadminForm] = useState<SubadminFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    permissions: {
      canAddClients: false,
      canEditClients: false,
      canDeleteClients: false,
      canViewAnalytics: false,
      canManageEmailTemplates: false,
      canManageSettings: false,
      canAddAdmins: false,
      canEditAdmins: false,
      canViewAllClients: false,
      canAccessCalendarSync: false,
      canExportData: false,
      canManageLegalPages: false,
      canAccessPromotionTools: false,
    },
  });

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientCredentialForm, setClientCredentialForm] =
    useState<ClientCredentialData>({
      businessId: "",
      businessName: "",
      username: "",
      password: "",
      permissions: {
        canEditBusinessInfo: true,
        canManageServices: true,
        canManageStaff: true,
        canManageSchedule: true,
        canViewAnalytics: false,
        canEditBranding: false,
        canAccessPromotionTools: false,
      },
    });

  const [showPasswordFields, setShowPasswordFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [editingSubadmin, setEditingSubadmin] = useState<User | null>(null);
  const [showEditSubadminDialog, setShowEditSubadminDialog] = useState(false);

  useEffect(() => {
    if (isMotherAdmin) {
      fetchSubadmins();
      fetchClients();
      fetchClientCredentials();
    }
  }, [isMotherAdmin]);

  const fetchSubadmins = async () => {
    try {
      const response = await fetch("/api/admin/subadmins", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubadmins(data.subadmins || []);
      }
    } catch (err) {
      console.error("Failed to fetch subadmins:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/businesses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data.businesses || []);
      }
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchClientCredentials = async () => {
    try {
      const response = await fetch("/api/admin/client-credentials", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClientCredentials(data.credentials || []);
      }
    } catch (err) {
      console.error("Failed to fetch client credentials:", err);
    }
  };

  const handleSubadminFormChange = (field: string, value: any) => {
    setSubadminForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (
    permission: keyof UserPermissions,
    value: boolean,
  ) => {
    setSubadminForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }));
  };

  const handleClientPermissionChange = (permission: string, value: boolean) => {
    setClientCredentialForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }));
  };

  const createSubadmin = async () => {
    if (subadminForm.password !== subadminForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/create-subadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          username: subadminForm.username,
          email: subadminForm.email,
          password: subadminForm.password,
          permissions: subadminForm.permissions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Subadmin created successfully!");
        setShowSubadminDialog(false);
        setSubadminForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          permissions: {
            canAddClients: false,
            canEditClients: false,
            canDeleteClients: false,
            canViewAnalytics: false,
            canManageEmailTemplates: false,
            canManageSettings: false,
            canAddAdmins: false,
            canEditAdmins: false,
            canViewAllClients: false,
            canAccessCalendarSync: false,
            canExportData: false,
            canManageLegalPages: false,
            canAccessPromotionTools: false,
          },
        });
        fetchSubadmins();
      } else {
        setError(result.message || "Failed to create subadmin");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const createClientCredentials = async () => {
    if (!selectedClient) {
      setError("Please select a client");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/create-client-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          businessId: selectedClient.id,
          username: clientCredentialForm.username,
          password: clientCredentialForm.password,
          permissions: clientCredentialForm.permissions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Client credentials created successfully!");
        setShowClientCredentialsDialog(false);
        setSelectedClient(null);
        setClientCredentialForm({
          businessId: "",
          businessName: "",
          username: "",
          password: "",
          permissions: {
            canEditBusinessInfo: true,
            canManageServices: true,
            canManageStaff: true,
            canManageSchedule: true,
            canViewAnalytics: false,
            canEditBranding: false,
            canAccessPromotionTools: false,
          },
        });
        fetchClientCredentials();
      } else {
        setError(result.message || "Failed to create client credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateUsername = (businessName: string) => {
    return businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const editSubadmin = (subadmin: User) => {
    setEditingSubadmin(subadmin);
    setSubadminForm({
      username: subadmin.username,
      email: subadmin.email,
      password: "",
      confirmPassword: "",
      permissions: subadmin.permissions,
    });
    setShowEditSubadminDialog(true);
  };

  const updateSubadmin = async () => {
    if (!editingSubadmin) return;

    if (
      subadminForm.password &&
      subadminForm.password !== subadminForm.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const updateData: any = {
        username: subadminForm.username,
        email: subadminForm.email,
        permissions: subadminForm.permissions,
      };

      if (subadminForm.password) {
        updateData.password = subadminForm.password;
      }

      const response = await fetch(
        `/api/admin/subadmins/${editingSubadmin.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("Subadmin updated successfully!");
        setShowEditSubadminDialog(false);
        setEditingSubadmin(null);
        setSubadminForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          permissions: {
            canAddClients: false,
            canEditClients: false,
            canDeleteClients: false,
            canViewAnalytics: false,
            canManageEmailTemplates: false,
            canManageSettings: false,
            canAddAdmins: false,
            canEditAdmins: false,
            canViewAllClients: false,
            canAccessCalendarSync: false,
            canExportData: false,
            canManageLegalPages: false,
            canAccessPromotionTools: false,
          },
        });
        fetchSubadmins();
      } else {
        setError(result.message || "Failed to update subadmin");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubadmin = async (subadminId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this subadmin? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/subadmins/${subadminId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Subadmin deleted successfully!");
        fetchSubadmins();
      } else {
        setError(result.message || "Failed to delete subadmin");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMotherAdmin) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Master Admin Control Panel
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage subadmins, client credentials, and platform settings with full
          control
        </p>
      </div>

      {/* Status Messages */}
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

      {/* Admin Management Section */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Subadmin Management
          </CardTitle>
          <CardDescription>
            Create and manage subadmin accounts with custom permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Subadmin Button */}
          <Dialog
            open={showSubadminDialog}
            onOpenChange={setShowSubadminDialog}
          >
            <DialogTrigger asChild>
              <Button className="w-full lg:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Create New Subadmin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Subadmin</DialogTitle>
                <DialogDescription>
                  Add a new subadmin with customizable permissions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subadmin-username">Username</Label>
                    <Input
                      id="subadmin-username"
                      value={subadminForm.username}
                      onChange={(e) =>
                        handleSubadminFormChange("username", e.target.value)
                      }
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subadmin-email">Email</Label>
                    <Input
                      id="subadmin-email"
                      type="email"
                      value={subadminForm.email}
                      onChange={(e) =>
                        handleSubadminFormChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subadmin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="subadmin-password"
                        type={showPasswordFields.subadmin ? "text" : "password"}
                        value={subadminForm.password}
                        onChange={(e) =>
                          handleSubadminFormChange("password", e.target.value)
                        }
                        placeholder="Enter password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => togglePasswordVisibility("subadmin")}
                      >
                        {showPasswordFields.subadmin ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subadmin-confirm-password">
                      Confirm Password
                    </Label>
                    <Input
                      id="subadmin-confirm-password"
                      type="password"
                      value={subadminForm.confirmPassword}
                      onChange={(e) =>
                        handleSubadminFormChange(
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "canAddClients",
                        label: "Add Clients",
                        icon: Building2,
                      },
                      {
                        key: "canEditClients",
                        label: "Edit Clients",
                        icon: Edit,
                      },
                      {
                        key: "canDeleteClients",
                        label: "Delete Clients",
                        icon: Trash2,
                      },
                      {
                        key: "canViewAnalytics",
                        label: "View Analytics",
                        icon: BarChart3,
                      },
                      {
                        key: "canManageEmailTemplates",
                        label: "Email Templates",
                        icon: Mail,
                      },
                      {
                        key: "canManageSettings",
                        label: "Manage Settings",
                        icon: Settings,
                      },
                      {
                        key: "canAccessCalendarSync",
                        label: "Calendar Sync",
                        icon: Calendar,
                      },
                      {
                        key: "canExportData",
                        label: "Export Data",
                        icon: FileText,
                      },
                      {
                        key: "canAccessPromotionTools",
                        label: "Promotion Tools",
                        icon: Megaphone,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Switch
                          checked={
                            subadminForm.permissions[
                              key as keyof UserPermissions
                            ]
                          }
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              key as keyof UserPermissions,
                              checked,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubadminDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createSubadmin} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Subadmin"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Subadmin Dialog */}
          <Dialog
            open={showEditSubadminDialog}
            onOpenChange={setShowEditSubadminDialog}
          >
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Subadmin</DialogTitle>
                <DialogDescription>
                  Update subadmin information and permissions
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-subadmin-username">Username</Label>
                    <Input
                      id="edit-subadmin-username"
                      value={subadminForm.username}
                      onChange={(e) =>
                        handleSubadminFormChange("username", e.target.value)
                      }
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-subadmin-email">Email</Label>
                    <Input
                      id="edit-subadmin-email"
                      type="email"
                      value={subadminForm.email}
                      onChange={(e) =>
                        handleSubadminFormChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-subadmin-password">
                      New Password (optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="edit-subadmin-password"
                        type={
                          showPasswordFields.editSubadmin ? "text" : "password"
                        }
                        value={subadminForm.password}
                        onChange={(e) =>
                          handleSubadminFormChange("password", e.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() => togglePasswordVisibility("editSubadmin")}
                      >
                        {showPasswordFields.editSubadmin ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-subadmin-confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="edit-subadmin-confirm-password"
                      type="password"
                      value={subadminForm.confirmPassword}
                      onChange={(e) =>
                        handleSubadminFormChange(
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Permissions</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: "canAddClients",
                        label: "Add Clients",
                        icon: Building2,
                      },
                      {
                        key: "canEditClients",
                        label: "Edit Clients",
                        icon: Edit,
                      },
                      {
                        key: "canDeleteClients",
                        label: "Delete Clients",
                        icon: Trash2,
                      },
                      {
                        key: "canViewAnalytics",
                        label: "View Analytics",
                        icon: BarChart3,
                      },
                      {
                        key: "canManageEmailTemplates",
                        label: "Email Templates",
                        icon: Mail,
                      },
                      {
                        key: "canManageSettings",
                        label: "Manage Settings",
                        icon: Settings,
                      },
                      {
                        key: "canAccessCalendarSync",
                        label: "Calendar Sync",
                        icon: Calendar,
                      },
                      {
                        key: "canExportData",
                        label: "Export Data",
                        icon: FileText,
                      },
                      {
                        key: "canAccessPromotionTools",
                        label: "Promotion Tools",
                        icon: Megaphone,
                      },
                    ].map(({ key, label, icon: Icon }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Switch
                          checked={
                            subadminForm.permissions[
                              key as keyof UserPermissions
                            ]
                          }
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              key as keyof UserPermissions,
                              checked,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditSubadminDialog(false);
                      setEditingSubadmin(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateSubadmin} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Subadmin"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Subadmins Table */}
          {subadmins.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subadmins.map((subadmin) => (
                    <TableRow key={subadmin.id}>
                      <TableCell className="font-medium">
                        {subadmin.username}
                      </TableCell>
                      <TableCell>{subadmin.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={subadmin.isActive ? "default" : "secondary"}
                        >
                          {subadmin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(subadmin.permissions)
                            .filter(([_, value]) => value)
                            .slice(0, 3)
                            .map(([key]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs"
                              >
                                {key
                                  .replace("can", "")
                                  .replace(/([A-Z])/g, " $1")}
                              </Badge>
                            ))}
                          {Object.values(subadmin.permissions).filter(Boolean)
                            .length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +
                              {Object.values(subadmin.permissions).filter(
                                Boolean,
                              ).length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(subadmin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editSubadmin(subadmin)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteSubadmin(subadmin.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Credentials Management */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Client Dashboard Credentials
          </CardTitle>
          <CardDescription>
            Manage client dashboard access with auto-generated usernames and
            custom passwords
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Client Credentials Button */}
          <Dialog
            open={showClientCredentialsDialog}
            onOpenChange={setShowClientCredentialsDialog}
          >
            <DialogTrigger asChild>
              <Button className="w-full lg:w-auto">
                <Lock className="w-4 h-4 mr-2" />
                Setup Client Credentials
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Setup Client Dashboard Credentials</DialogTitle>
                <DialogDescription>
                  Create login credentials for a client's dashboard access
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Client Selection */}
                <div className="space-y-2">
                  <Label>Select Client Business</Label>
                  <Select
                    value={selectedClient?.id || ""}
                    onValueChange={(value) => {
                      const client = clients.find((c) => c.id === value);
                      setSelectedClient(client);
                      if (client) {
                        setClientCredentialForm((prev) => ({
                          ...prev,
                          businessId: client.id,
                          businessName: client.name,
                          username: generateUsername(client.name),
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a client business" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients
                        .filter(
                          (client) =>
                            !clientCredentials.find(
                              (cc) => cc.businessId === client.id,
                            ),
                        )
                        .map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedClient && (
                  <>
                    {/* Credentials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-username">
                          Username (Auto-generated)
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="client-username"
                            value={clientCredentialForm.username}
                            onChange={(e) =>
                              setClientCredentialForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setClientCredentialForm((prev) => ({
                                ...prev,
                                username: generateUsername(selectedClient.name),
                              }))
                            }
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client-password">Password</Label>
                        <div className="flex gap-2">
                          <Input
                            id="client-password"
                            type={
                              showPasswordFields.client ? "text" : "password"
                            }
                            value={clientCredentialForm.password}
                            onChange={(e) =>
                              setClientCredentialForm((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            placeholder="Enter password"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => togglePasswordVisibility("client")}
                          >
                            {showPasswordFields.client ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setClientCredentialForm((prev) => ({
                                ...prev,
                                password: generatePassword(),
                              }))
                            }
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard URL */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Label className="text-sm font-medium">
                        Dashboard URL
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-white rounded border text-sm">
                          {window.location.origin}/{selectedClient.slug}
                          /dashboard
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              `${window.location.origin}/${selectedClient.slug}/dashboard`,
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Client Permissions */}
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold">
                        Client Dashboard Permissions
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            key: "canEditBusinessInfo",
                            label: "Edit Business Info",
                            icon: Building2,
                          },
                          {
                            key: "canManageServices",
                            label: "Manage Services",
                            icon: Settings,
                          },
                          {
                            key: "canManageStaff",
                            label: "Manage Staff",
                            icon: Users,
                          },
                          {
                            key: "canManageSchedule",
                            label: "Manage Schedule",
                            icon: Calendar,
                          },
                          {
                            key: "canViewAnalytics",
                            label: "View Analytics",
                            icon: BarChart3,
                          },
                          {
                            key: "canEditBranding",
                            label: "Edit Branding",
                            icon: Palette,
                          },
                          {
                            key: "canAccessPromotionTools",
                            label: "Promotion Tools",
                            icon: Megaphone,
                          },
                        ].map(({ key, label, icon: Icon }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </div>
                            <Switch
                              checked={
                                clientCredentialForm.permissions[
                                  key as keyof typeof clientCredentialForm.permissions
                                ]
                              }
                              onCheckedChange={(checked) =>
                                handleClientPermissionChange(key, checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowClientCredentialsDialog(false);
                      setSelectedClient(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createClientCredentials}
                    disabled={isLoading || !selectedClient}
                  >
                    {isLoading ? "Creating..." : "Create Credentials"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Client Credentials Table */}
          {clientCredentials.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Dashboard URL</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientCredentials.map((credential) => (
                    <TableRow key={credential.businessId}>
                      <TableCell className="font-medium">
                        {credential.businessName}
                      </TableCell>
                      <TableCell>{credential.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            /
                            {
                              clients.find(
                                (c) => c.id === credential.businessId,
                              )?.slug
                            }
                            /dashboard
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const client = clients.find(
                                (c) => c.id === credential.businessId,
                              );
                              if (client) {
                                copyToClipboard(
                                  `${window.location.origin}/${client.slug}/dashboard`,
                                );
                              }
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(credential.permissions)
                            .filter(([_, value]) => value)
                            .slice(0, 2)
                            .map(([key]) => (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs"
                              >
                                {key
                                  .replace("can", "")
                                  .replace(/([A-Z])/g, " $1")}
                              </Badge>
                            ))}
                          {Object.values(credential.permissions).filter(Boolean)
                            .length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +
                              {Object.values(credential.permissions).filter(
                                Boolean,
                              ).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
