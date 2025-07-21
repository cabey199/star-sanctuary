import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Send,
  Save,
  Edit,
} from "lucide-react";
import { ContactUsSettings, ContactFormField } from "../../shared/types";

interface ContactUsSectionProps {
  userRole: "mother_admin" | "subadmin";
  canEdit: boolean;
  initialSettings?: ContactUsSettings;
  onSave?: (settings: ContactUsSettings) => void;
}

export default function ContactUsSection({
  userRole,
  canEdit,
  initialSettings,
  onSave,
}: ContactUsSectionProps) {
  const [settings, setSettings] = useState<ContactUsSettings>(
    initialSettings || {
      heading: "Contact Us",
      description:
        "Get in touch with our team for any questions or support needs.",
      email: "support@bookingwithcal.com",
      phone: "+251 911 123 456",
      address: "Addis Ababa, Ethiopia",
      socialLinks: {
        facebook: "",
        instagram: "",
        telegram: "",
        whatsapp: "",
      },
      customFields: [
        {
          id: "1",
          label: "Name",
          type: "text",
          required: true,
          order: 1,
        },
        {
          id: "2",
          label: "Email",
          type: "email",
          required: true,
          order: 2,
        },
        {
          id: "3",
          label: "Subject",
          type: "text",
          required: true,
          order: 3,
        },
        {
          id: "4",
          label: "Message",
          type: "textarea",
          required: true,
          order: 4,
        },
      ],
      isActive: true,
    },
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (onSave) {
        await onSave(settings);
        setSuccess("Contact settings saved successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      setError("Failed to save contact settings");
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomField = () => {
    const newField: ContactFormField = {
      id: Date.now().toString(),
      label: "New Field",
      type: "text",
      required: false,
      order: settings.customFields.length + 1,
    };

    setSettings((prev) => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (
    fieldId: string,
    updates: Partial<ContactFormField>,
  ) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field,
      ),
    }));
  };

  const removeCustomField = (fieldId: string) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((field) => field.id !== fieldId),
    }));
  };

  const socialPlatforms = [
    { key: "facebook", label: "Facebook", icon: Facebook },
    { key: "instagram", label: "Instagram", icon: Instagram },
    { key: "telegram", label: "Telegram", icon: Send },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contact Us Section</h3>
          <p className="text-sm text-gray-600">
            Customize how users can contact your team
          </p>
        </div>
        {canEdit && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.isActive}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, isActive: checked }))
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
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

      {/* Contact Display */}
      <Card className={!settings.isActive ? "opacity-50" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {settings.heading}
              </CardTitle>
              <CardDescription>{settings.description}</CardDescription>
            </div>
            {!settings.isActive && <Badge variant="secondary">Disabled</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Contact Information</h4>
              <div className="space-y-3">
                {settings.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{settings.email}</span>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{settings.phone}</span>
                  </div>
                )}
                {settings.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{settings.address}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {Object.values(settings.socialLinks).some(Boolean) && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Follow Us</h4>
                  <div className="flex space-x-3">
                    {socialPlatforms.map(({ key, label, icon: Icon }) => {
                      const link =
                        settings.socialLinks[
                          key as keyof typeof settings.socialLinks
                        ];
                      return (
                        link && (
                          <a
                            key={key}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Icon className="w-4 h-4" />
                          </a>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Contact Form</h4>
              <div className="space-y-3">
                {settings.customFields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-sm">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          disabled
                          className="bg-gray-50"
                        />
                      ) : field.type === "select" ? (
                        <select
                          disabled
                          className="w-full p-2 border rounded-md bg-gray-50"
                        >
                          <option>Select {field.label.toLowerCase()}</option>
                          {field.options?.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          disabled
                          className="bg-gray-50"
                        />
                      )}
                    </div>
                  ))}
                <Button disabled className="w-full">
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contact Us Section</DialogTitle>
            <DialogDescription>
              Customize the contact information and form fields
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heading">Heading</Label>
                  <Input
                    id="heading"
                    value={settings.heading}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        heading: e.target.value,
                      }))
                    }
                    placeholder="Contact Us"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="support@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description about contacting your team"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+251 911 123 456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </Label>
                    <Input
                      id={key}
                      value={
                        settings.socialLinks[
                          key as keyof typeof settings.socialLinks
                        ] || ""
                      }
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          socialLinks: {
                            ...prev.socialLinks,
                            [key]: e.target.value,
                          },
                        }))
                      }
                      placeholder={`https://${key}.com/yourpage`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Form Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Form Fields</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {settings.customFields
                  .sort((a, b) => a.order - b.order)
                  .map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Field {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateCustomField(field.id, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Field label"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <select
                            value={field.type}
                            onChange={(e) =>
                              updateCustomField(field.id, {
                                type: e.target
                                  .value as ContactFormField["type"],
                              })
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Required</Label>
                          <div className="flex items-center h-10">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) =>
                                updateCustomField(field.id, {
                                  required: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="space-y-2">
                          <Label>Options (one per line)</Label>
                          <Textarea
                            value={(field.options || []).join("\n")}
                            onChange={(e) =>
                              updateCustomField(field.id, {
                                options: e.target.value
                                  .split("\n")
                                  .filter((opt) => opt.trim()),
                              })
                            }
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
