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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Smartphone,
  Globe,
  RefreshCw,
  Settings,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  Clock,
  Users,
  Shield,
  Key,
  Link as LinkIcon,
  Zap,
  Bell,
  Plus,
} from "lucide-react";

interface CalendarProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  features: string[];
  authRequired: boolean;
  twoWaySync: boolean;
}

interface SyncSettings {
  enabled: boolean;
  provider: string;
  calendarId?: string;
  syncDirection: "one-way" | "two-way";
  eventPrefix: string;
  includeCustomerInfo: boolean;
  syncCancellations: boolean;
  syncReschedules: boolean;
  reminderMinutes: number;
  lastSync?: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  error?: string;
}

interface SyncedEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  provider: string;
  externalId: string;
  status: "synced" | "pending" | "error";
  lastUpdated: string;
}

const CalendarSync: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [syncSettings, setSyncSettings] = useState<
    Record<string, SyncSettings>
  >({
    google: {
      enabled: false,
      provider: "google",
      syncDirection: "two-way",
      eventPrefix: "[Booking]",
      includeCustomerInfo: true,
      syncCancellations: true,
      syncReschedules: true,
      reminderMinutes: 15,
      status: "disconnected",
    },
    outlook: {
      enabled: false,
      provider: "outlook",
      syncDirection: "two-way",
      eventPrefix: "[Booking]",
      includeCustomerInfo: true,
      syncCancellations: true,
      syncReschedules: true,
      reminderMinutes: 15,
      status: "disconnected",
    },
    apple: {
      enabled: false,
      provider: "apple",
      syncDirection: "one-way",
      eventPrefix: "[Booking]",
      includeCustomerInfo: false,
      syncCancellations: true,
      syncReschedules: true,
      reminderMinutes: 15,
      status: "disconnected",
    },
  });

  const [syncedEvents, setSyncedEvents] = useState<SyncedEvent[]>([
    {
      id: "1",
      title: "[Booking] Haircut - John Doe",
      start: "2024-01-25T10:00:00Z",
      end: "2024-01-25T10:45:00Z",
      provider: "google",
      externalId: "google_event_123",
      status: "synced",
      lastUpdated: "2024-01-24T15:30:00Z",
    },
    {
      id: "2",
      title: "[Booking] Spa Treatment - Jane Smith",
      start: "2024-01-25T14:00:00Z",
      end: "2024-01-25T15:30:00Z",
      provider: "outlook",
      externalId: "outlook_event_456",
      status: "synced",
      lastUpdated: "2024-01-24T16:00:00Z",
    },
  ]);

  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showApiSetup, setShowApiSetup] = useState(false);

  const calendarProviders: CalendarProvider[] = [
    {
      id: "google",
      name: "Google Calendar",
      icon: Calendar,
      color: "#4285F4",
      description:
        "Sync with Google Calendar for seamless integration across all Google services",
      features: [
        "Two-way sync",
        "Real-time updates",
        "Multiple calendar support",
        "Mobile app integration",
      ],
      authRequired: true,
      twoWaySync: true,
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      icon: Globe,
      color: "#0078D4",
      description:
        "Connect with Outlook Calendar for Microsoft 365 and Office integration",
      features: [
        "Two-way sync",
        "Office 365 integration",
        "Teams meeting links",
        "Enterprise features",
      ],
      authRequired: true,
      twoWaySync: true,
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: Smartphone,
      color: "#007AFF",
      description:
        "Sync with Apple Calendar via CalDAV for iOS and macOS devices",
      features: [
        "CalDAV protocol",
        "iOS/macOS integration",
        "iCloud sync",
        "Privacy focused",
      ],
      authRequired: true,
      twoWaySync: false,
    },
  ];

  const handleConnect = async (providerId: string) => {
    setIsConnecting(providerId);

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSyncSettings((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          enabled: true,
          status: "connected",
          lastSync: new Date().toISOString(),
        },
      }));

      // Simulate initial sync
      setTimeout(() => {
        setSyncSettings((prev) => ({
          ...prev,
          [providerId]: {
            ...prev[providerId],
            status: "connected",
          },
        }));
      }, 1000);
    } catch (error) {
      setSyncSettings((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          status: "error",
          error: "Failed to connect. Please try again.",
        },
      }));
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = (providerId: string) => {
    setSyncSettings((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        enabled: false,
        status: "disconnected",
        error: undefined,
      },
    }));
  };

  const handleSync = async (providerId: string) => {
    setSyncSettings((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        status: "syncing",
      },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setSyncSettings((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          status: "connected",
          lastSync: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setSyncSettings((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          status: "error",
          error: "Sync failed. Please check your connection.",
        },
      }));
    }
  };

  const updateSyncSettings = (
    providerId: string,
    updates: Partial<SyncSettings>,
  ) => {
    setSyncSettings((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        ...updates,
      },
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <Check className="h-4 w-4 text-green-500" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      connected:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      syncing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      disconnected:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };

    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.disconnected
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const connectedProviders = Object.values(syncSettings).filter(
    (settings) => settings.enabled,
  ).length;

  const totalSyncedEvents = syncedEvents.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Calendar Synchronization
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Keep your bookings in sync across all your calendar platforms
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowApiSetup(true)}
            className="flex items-center"
          >
            <Settings className="h-4 w-4 mr-2" />
            API Setup
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                    <LinkIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Connected Calendars
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {connectedProviders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                    <RefreshCw className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Synced Events
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {totalSyncedEvents}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Last Sync
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {syncSettings.google.lastSync
                        ? new Date(
                            syncSettings.google.lastSync,
                          ).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => {
                    Object.keys(syncSettings).forEach((provider) => {
                      if (syncSettings[provider].enabled) {
                        handleSync(provider);
                      }
                    });
                  }}
                >
                  <RefreshCw className="h-6 w-6" />
                  <span>Sync All Calendars</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab("providers")}
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Calendar</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-6 w-6" />
                  <span>Sync Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sync Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncedEvents.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: calendarProviders.find(
                            (p) => p.id === event.provider,
                          )?.color,
                        }}
                      ></div>
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(event.start).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(event.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendarProviders.map((provider) => {
              const settings = syncSettings[provider.id];
              const IconComponent = provider.icon;

              return (
                <Card key={provider.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${provider.color}20` }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: provider.color }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {provider.name}
                          </CardTitle>
                          {getStatusBadge(settings.status)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.description}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {provider.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {settings.error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{settings.error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex space-x-2">
                        {!settings.enabled ? (
                          <Button
                            onClick={() => handleConnect(provider.id)}
                            disabled={isConnecting === provider.id}
                            className="flex-1"
                            style={{ backgroundColor: provider.color }}
                          >
                            {isConnecting === provider.id ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <LinkIcon className="h-4 w-4 mr-2" />
                            )}
                            {isConnecting === provider.id
                              ? "Connecting..."
                              : "Connect"}
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => handleSync(provider.id)}
                              disabled={settings.status === "syncing"}
                              className="flex-1"
                            >
                              {settings.status === "syncing" ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Sync
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDisconnect(provider.id)}
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {Object.entries(syncSettings)
            .filter(([_, settings]) => settings.enabled)
            .map(([providerId, settings]) => {
              const provider = calendarProviders.find(
                (p) => p.id === providerId,
              );
              if (!provider) return null;

              const IconComponent = provider.icon;

              return (
                <Card key={providerId}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <IconComponent
                        className="h-5 w-5 mr-2"
                        style={{ color: provider.color }}
                      />
                      {provider.name} Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor={`${providerId}-direction`}>
                          Sync Direction
                        </Label>
                        <Select
                          value={settings.syncDirection}
                          onValueChange={(value: any) =>
                            updateSyncSettings(providerId, {
                              syncDirection: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-way">
                              One-way (To Calendar)
                            </SelectItem>
                            {provider.twoWaySync && (
                              <SelectItem value="two-way">
                                Two-way (Bidirectional)
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`${providerId}-prefix`}>
                          Event Prefix
                        </Label>
                        <Input
                          id={`${providerId}-prefix`}
                          value={settings.eventPrefix}
                          onChange={(e) =>
                            updateSyncSettings(providerId, {
                              eventPrefix: e.target.value,
                            })
                          }
                          placeholder="[Booking]"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`${providerId}-reminder`}>
                          Default Reminder (minutes)
                        </Label>
                        <Select
                          value={settings.reminderMinutes.toString()}
                          onValueChange={(value) =>
                            updateSyncSettings(providerId, {
                              reminderMinutes: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No reminder</SelectItem>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="1440">1 day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`${providerId}-customer-info`}>
                            Include Customer Information
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Add customer details to calendar events
                          </p>
                        </div>
                        <Switch
                          id={`${providerId}-customer-info`}
                          checked={settings.includeCustomerInfo}
                          onCheckedChange={(checked) =>
                            updateSyncSettings(providerId, {
                              includeCustomerInfo: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`${providerId}-cancellations`}>
                            Sync Cancellations
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Remove cancelled bookings from calendar
                          </p>
                        </div>
                        <Switch
                          id={`${providerId}-cancellations`}
                          checked={settings.syncCancellations}
                          onCheckedChange={(checked) =>
                            updateSyncSettings(providerId, {
                              syncCancellations: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={`${providerId}-reschedules`}>
                            Sync Reschedules
                          </Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Update calendar when bookings are rescheduled
                          </p>
                        </div>
                        <Switch
                          id={`${providerId}-reschedules`}
                          checked={settings.syncReschedules}
                          onCheckedChange={(checked) =>
                            updateSyncSettings(providerId, {
                              syncReschedules: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {Object.values(syncSettings).filter((s) => s.enabled).length ===
            0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Calendars Connected
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect a calendar provider to configure sync settings
                </p>
                <Button onClick={() => setActiveTab("providers")}>
                  Connect Calendar
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Activity Log</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track all calendar synchronization events
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncedEvents.map((event) => {
                  const provider = calendarProviders.find(
                    (p) => p.id === event.provider,
                  );
                  const IconComponent = provider?.icon || Calendar;

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: `${provider?.color}20`,
                          }}
                        >
                          <IconComponent
                            className="h-5 w-5"
                            style={{ color: provider?.color }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(event.start).toLocaleString()} -{" "}
                            {new Date(event.end).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last updated:{" "}
                            {new Date(event.lastUpdated).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(event.status)}
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Setup Dialog */}
      <Dialog open={showApiSetup} onOpenChange={setShowApiSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Calendar API Setup</DialogTitle>
            <DialogDescription>
              Configure API credentials for calendar providers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                API keys are required for calendar synchronization. These will
                be encrypted and stored securely.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div>
                <Label htmlFor="google-api">Google Calendar API Key</Label>
                <Input
                  id="google-api"
                  type="password"
                  placeholder="Enter Google API key"
                />
              </div>

              <div>
                <Label htmlFor="outlook-api">Microsoft Graph API Key</Label>
                <Input
                  id="outlook-api"
                  type="password"
                  placeholder="Enter Microsoft API key"
                />
              </div>

              <div>
                <Label htmlFor="apple-api">Apple CalDAV Credentials</Label>
                <Input
                  id="apple-api"
                  type="password"
                  placeholder="Enter CalDAV server details"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiSetup(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowApiSetup(false)}>
              Save Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarSync;
