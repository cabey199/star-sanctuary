import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Globe,
  Key,
  Shield,
  Palette,
  Mail,
  Clock,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Lock,
  Unlock,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { SUPPORTED_LANGUAGES } from "../../shared/types";

interface SettingsData {
  profile: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    timezone: string;
    language: "en" | "am" | "ar";
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    bookingReminders: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    lastPasswordChange: string;
    activeSessions: number;
  };
  apiKeys: {
    googleMapsApiKey: string;
    googleCalendarApiKey: string;
    outlookApiKey: string;
    appleApiKey: string;
    socialMediaKeys: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  branding: {
    siteName: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    favicon: string;
  };
}

export default function Settings() {
  const { user, isMotherAdmin, isSubadmin } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      username: user?.username || "",
      email: user?.email || "",
      firstName: "",
      lastName: "",
      timezone: "Africa/Addis_Ababa",
      language: user?.language || "en",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      bookingReminders: true,
      systemUpdates: true,
      marketingEmails: false,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastPasswordChange: "2024-01-15",
      activeSession: 2,
    },
    apiKeys: {
      googleMapsApiKey: "",
      googleCalendarApiKey: "",
      outlookApiKey: "",
      appleApiKey: "",
      socialMediaKeys: {
        facebook: "",
        instagram: "",
        twitter: "",
      },
    },
    branding: {
      siteName: "BookingWithCal",
      primaryColor: "#8B5CF6",
      secondaryColor: "#3B82F6",
      logoUrl: "",
      favicon: "",
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const availableTimezones = [
    "Africa/Addis_Ababa",
    "Africa/Cairo",
    "Africa/Lagos",
    "Africa/Nairobi",
    "Europe/London",
    "Europe/Paris",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Dubai",
    "Asia/Riyadh",
  ];

  useEffect(() => {
    // Load user settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSettings({ ...settings, ...data });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (section: string, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SettingsData],
        [field]: value,
      },
    }));
  };

  const saveSettings = async (section?: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(
          section
            ? { [section]: settings[section as keyof SettingsData] }
            : settings,
        ),
      });

      if (response.ok) {
        setSuccess(
          `${section ? section.charAt(0).toUpperCase() + section.slice(1) : "Settings"} saved successfully!`,
        );
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to save settings");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const result = await response.json();
        setError(result.message || "Failed to change password");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = (type: string) => {
    const key = `bwc_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (type.includes(".")) {
      const [section, field] = type.split(".");
      handleSettingChange("apiKeys", section, {
        ...settings.apiKeys.socialMediaKeys,
        [field]: key,
      });
    } else {
      handleSettingChange("apiKeys", type, key);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Define which tabs are available based on user role
  const availableTabs = () => {
    const baseTabs = ["profile", "notifications"];

    if (isMotherAdmin) {
      return [...baseTabs, "security", "api-keys", "branding"];
    } else if (isSubadmin && user?.permissions.canManageSettings) {
      return [...baseTabs, "security"];
    }

    return baseTabs;
  };

  const canAccess = (section: string): boolean => {
    if (isMotherAdmin) return true;
    if (isSubadmin && user?.permissions.canManageSettings) {
      return ["profile", "notifications", "security"].includes(section);
    }
    return ["profile", "notifications"].includes(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your account and platform preferences
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant={isMotherAdmin ? "default" : "secondary"}>
                <Shield className="w-3 h-3 mr-1" />
                {isMotherAdmin ? "Master Admin" : "Subadmin"}
              </Badge>
              <ThemeToggle size="sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            className={`grid w-full grid-cols-${availableTabs().length}`}
          >
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {canAccess("security") && (
              <TabsTrigger value="security">Security</TabsTrigger>
            )}
            {canAccess("api-keys") && (
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            )}
            {canAccess("branding") && (
              <TabsTrigger value="branding">Branding</TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={settings.profile.username}
                      onChange={(e) =>
                        handleSettingChange(
                          "profile",
                          "username",
                          e.target.value,
                        )
                      }
                      disabled={!isMotherAdmin}
                    />
                    {!isMotherAdmin && (
                      <p className="text-xs text-gray-500">
                        Only Master Admin can change username
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) =>
                        handleSettingChange("profile", "email", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.profile.firstName}
                      onChange={(e) =>
                        handleSettingChange(
                          "profile",
                          "firstName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.profile.lastName}
                      onChange={(e) =>
                        handleSettingChange(
                          "profile",
                          "lastName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.profile.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("profile", "timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.profile.language}
                      onValueChange={(value: "en" | "am" | "ar") =>
                        handleSettingChange("profile", "language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SUPPORTED_LANGUAGES).map(
                          ([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings("profile")}
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password for security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-8 w-8"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={changePassword}
                    disabled={
                      isLoading ||
                      !passwordForm.currentPassword ||
                      !passwordForm.newPassword ||
                      !passwordForm.confirmPassword
                    }
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email Notifications",
                      description: "Receive notifications via email",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push Notifications",
                      description: "Receive browser push notifications",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS Notifications",
                      description: "Receive notifications via SMS",
                    },
                    {
                      key: "bookingReminders",
                      label: "Booking Reminders",
                      description: "Get reminded about upcoming bookings",
                    },
                    {
                      key: "systemUpdates",
                      label: "System Updates",
                      description: "Notifications about platform updates",
                    },
                    {
                      key: "marketingEmails",
                      label: "Marketing Emails",
                      description: "Receive promotional and feature updates",
                    },
                  ].map(({ key, label, description }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {description}
                        </div>
                      </div>
                      <Switch
                        checked={
                          settings.notifications[
                            key as keyof typeof settings.notifications
                          ]
                        }
                        onCheckedChange={(checked) =>
                          handleSettingChange("notifications", key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => saveSettings("notifications")}
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          {canAccess("security") && (
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <Switch
                        checked={settings.security.twoFactorEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange(
                            "security",
                            "twoFactorEnabled",
                            checked,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">
                        Session Timeout (minutes)
                      </Label>
                      <Select
                        value={settings.security.sessionTimeout.toString()}
                        onValueChange={(value) =>
                          handleSettingChange(
                            "security",
                            "sessionTimeout",
                            parseInt(value),
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="480">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium mb-1">
                          Last Password Change
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {settings.security.lastPasswordChange}
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium mb-1">
                          Active Sessions
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {settings.security.activeSession} devices
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => saveSettings("security")}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* API Keys Tab - Mother Admin Only */}
          {canAccess("api-keys") && (
            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys & Integrations
                  </CardTitle>
                  <CardDescription>
                    Manage API keys for external service integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Platform API Keys */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Platform Integrations
                      </h3>
                      {[
                        {
                          key: "googleMapsApiKey",
                          label: "Google Maps API Key",
                          description: "For location services and maps",
                        },
                        {
                          key: "googleCalendarApiKey",
                          label: "Google Calendar API Key",
                          description: "For calendar synchronization",
                        },
                        {
                          key: "outlookApiKey",
                          label: "Microsoft Outlook API Key",
                          description: "For Outlook calendar integration",
                        },
                        {
                          key: "appleApiKey",
                          label: "Apple Calendar API Key",
                          description: "For Apple calendar integration",
                        },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              value={
                                settings.apiKeys[
                                  key as keyof typeof settings.apiKeys
                                ] as string
                              }
                              onChange={(e) =>
                                handleSettingChange(
                                  "apiKeys",
                                  key,
                                  e.target.value,
                                )
                              }
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateApiKey(key)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  settings.apiKeys[
                                    key as keyof typeof settings.apiKeys
                                  ] as string,
                                )
                              }
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">{description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Social Media API Keys */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Social Media APIs
                      </h3>
                      {[
                        {
                          key: "facebook",
                          label: "Facebook API Key",
                          description: "For Facebook integration and sharing",
                        },
                        {
                          key: "instagram",
                          label: "Instagram API Key",
                          description: "For Instagram content sharing",
                        },
                        {
                          key: "twitter",
                          label: "Twitter/X API Key",
                          description: "For Twitter/X integration",
                        },
                      ].map(({ key, label, description }) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <div className="flex gap-2">
                            <Input
                              type="password"
                              value={
                                settings.apiKeys.socialMediaKeys[
                                  key as keyof typeof settings.apiKeys.socialMediaKeys
                                ]
                              }
                              onChange={(e) =>
                                handleSettingChange(
                                  "apiKeys",
                                  "socialMediaKeys",
                                  {
                                    ...settings.apiKeys.socialMediaKeys,
                                    [key]: e.target.value,
                                  },
                                )
                              }
                              placeholder={`Enter ${label.toLowerCase()}`}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                generateApiKey(`socialMediaKeys.${key}`)
                              }
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  settings.apiKeys.socialMediaKeys[
                                    key as keyof typeof settings.apiKeys.socialMediaKeys
                                  ],
                                )
                              }
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => saveSettings("apiKeys")}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save API Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Branding Tab - Mother Admin Only */}
          {canAccess("branding") && (
            <TabsContent value="branding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Platform Branding
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.branding.siteName}
                        onChange={(e) =>
                          handleSettingChange(
                            "branding",
                            "siteName",
                            e.target.value,
                          )
                        }
                        placeholder="BookingWithCal"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={settings.branding.primaryColor}
                            onChange={(e) =>
                              handleSettingChange(
                                "branding",
                                "primaryColor",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.branding.primaryColor}
                            onChange={(e) =>
                              handleSettingChange(
                                "branding",
                                "primaryColor",
                                e.target.value,
                              )
                            }
                            placeholder="#8B5CF6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={settings.branding.secondaryColor}
                            onChange={(e) =>
                              handleSettingChange(
                                "branding",
                                "secondaryColor",
                                e.target.value,
                              )
                            }
                            className="w-16 h-10"
                          />
                          <Input
                            value={settings.branding.secondaryColor}
                            onChange={(e) =>
                              handleSettingChange(
                                "branding",
                                "secondaryColor",
                                e.target.value,
                              )
                            }
                            placeholder="#3B82F6"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input
                          id="logoUrl"
                          value={settings.branding.logoUrl}
                          onChange={(e) =>
                            handleSettingChange(
                              "branding",
                              "logoUrl",
                              e.target.value,
                            )
                          }
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="favicon">Favicon URL</Label>
                        <Input
                          id="favicon"
                          value={settings.branding.favicon}
                          onChange={(e) =>
                            handleSettingChange(
                              "branding",
                              "favicon",
                              e.target.value,
                            )
                          }
                          placeholder="https://example.com/favicon.ico"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <h4 className="font-medium mb-3">Preview</h4>
                      <div
                        className="p-4 rounded-lg shadow-sm"
                        style={{
                          backgroundColor:
                            settings.branding.primaryColor + "20",
                          borderColor: settings.branding.primaryColor,
                        }}
                      >
                        <div
                          className="text-lg font-bold mb-2"
                          style={{ color: settings.branding.primaryColor }}
                        >
                          {settings.branding.siteName}
                        </div>
                        <div
                          className="text-sm"
                          style={{ color: settings.branding.secondaryColor }}
                        >
                          Your booking platform preview
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => saveSettings("branding")}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Branding
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
