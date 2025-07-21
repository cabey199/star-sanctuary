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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Edit,
  Eye,
  Send,
  Copy,
  RotateCcw,
  Settings,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { EmailTemplate, EmailTemplates } from "../../shared/types";

interface EmailTemplateEditorProps {
  businessId?: string;
  userRole: "mother_admin" | "subadmin" | "client";
  canEdit: boolean;
}

interface EmailTemplateFormData {
  subject: string;
  body: string;
  isActive: boolean;
  variables: string[];
}

const DEFAULT_TEMPLATES: { [key: string]: EmailTemplate } = {
  bookingConfirmation: {
    subject: "Booking Confirmed - {{businessName}}",
    body: `Dear {{customerName}},

Your booking has been confirmed!

Booking Details:
• Service: {{serviceName}}
• Provider: {{providerName}}
• Date: {{bookingDate}}
• Time: {{bookingTime}}
• Duration: {{serviceDuration}}
• Price: ETB {{servicePrice}}

Business Information:
{{businessName}}
{{businessAddress}}
{{businessPhone}}
{{businessEmail}}

Location: {{businessLocationLink}}

Thank you for choosing {{businessName}}!

Best regards,
{{businessName}} Team

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "providerName",
      "bookingDate",
      "bookingTime",
      "serviceDuration",
      "servicePrice",
      "businessAddress",
      "businessPhone",
      "businessEmail",
      "businessLocationLink",
    ],
  },
  bookingReminder: {
    subject: "Reminder: Your appointment tomorrow - {{businessName}}",
    body: `Dear {{customerName}},

This is a friendly reminder about your appointment:

Tomorrow's Appointment:
• Service: {{serviceName}}
• Provider: {{providerName}}
• Date: {{bookingDate}}
• Time: {{bookingTime}}
• Duration: {{serviceDuration}}

Please arrive 5 minutes early.

Location: {{businessAddress}}
{{businessLocationLink}}

Contact: {{businessPhone}}

Thank you!
{{businessName}}

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "providerName",
      "bookingDate",
      "bookingTime",
      "serviceDuration",
      "businessAddress",
      "businessPhone",
      "businessLocationLink",
    ],
  },
  bookingCancellation: {
    subject: "Booking Cancelled - {{businessName}}",
    body: `Dear {{customerName}},

Your booking has been cancelled as requested.

Cancelled Booking Details:
• Service: {{serviceName}}
• Provider: {{providerName}}
• Date: {{bookingDate}}
• Time: {{bookingTime}}

If you'd like to reschedule, please visit our booking page:
{{bookingPageUrl}}

Thank you for understanding.

Best regards,
{{businessName}}

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "providerName",
      "bookingDate",
      "bookingTime",
      "bookingPageUrl",
    ],
  },
  flexibleServiceRequest: {
    subject: "Service Request Received - {{businessName}}",
    body: `Dear {{customerName}},

We've received your service request!

Request Details:
• Service: {{serviceName}}
• Preferred Date: {{preferredDate}}
• Preferred Time: {{preferredTime}}
• Location: {{serviceLocation}}
• Description: {{serviceDescription}}

We'll review your request and get back to you within 24 hours with time estimates and confirmation.

Contact us: {{businessPhone}} | {{businessEmail}}

Thank you for choosing {{businessName}}!

Best regards,
{{businessName}} Team

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "preferredDate",
      "preferredTime",
      "serviceLocation",
      "serviceDescription",
      "businessPhone",
      "businessEmail",
    ],
  },
  flexibleServiceConfirmation: {
    subject: "Service Confirmed - {{businessName}}",
    body: `Dear {{customerName}},

Your flexible service has been confirmed!

Service Details:
• Service: {{serviceName}}
• Date: {{bookingDate}}
• Time: {{bookingTime}}
• Estimated Duration: {{estimatedDuration}}
• Location: {{serviceLocation}}
• Price: ETB {{servicePrice}}

Provider: {{providerName}}

Special Instructions:
{{specialInstructions}}

Contact: {{businessPhone}}

Thank you!
{{businessName}}

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "bookingDate",
      "bookingTime",
      "estimatedDuration",
      "serviceLocation",
      "servicePrice",
      "providerName",
      "specialInstructions",
      "businessPhone",
    ],
  },
  rescheduleConfirmation: {
    subject: "Booking Rescheduled - {{businessName}}",
    body: `Dear {{customerName}},

Your booking has been successfully rescheduled.

New Booking Details:
• Service: {{serviceName}}
• Provider: {{providerName}}
• New Date: {{newBookingDate}}
• New Time: {{newBookingTime}}
• Duration: {{serviceDuration}}

Previous booking ({{oldBookingDate}} at {{oldBookingTime}}) has been cancelled.

Location: {{businessAddress}}
{{businessLocationLink}}

Thank you for your flexibility!

Best regards,
{{businessName}}

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "providerName",
      "newBookingDate",
      "newBookingTime",
      "oldBookingDate",
      "oldBookingTime",
      "serviceDuration",
      "businessAddress",
      "businessLocationLink",
    ],
  },
  reviewRequest: {
    subject: "How was your experience? - {{businessName}}",
    body: `Dear {{customerName}},

Thank you for visiting {{businessName}}!

We hope you enjoyed your {{serviceName}} with {{providerName}} on {{bookingDate}}.

Your feedback helps us improve our services. Would you mind taking a moment to leave a review?

Rate your experience: {{reviewLink}}

What did you think of:
• Service quality
• Staff friendliness
• Cleanliness
• Overall experience

Thank you for choosing {{businessName}}!

Best regards,
{{businessName}} Team

---
Powered by BookingWithCal`,
    isActive: true,
    variables: [
      "businessName",
      "customerName",
      "serviceName",
      "providerName",
      "bookingDate",
      "reviewLink",
    ],
  },
};

export default function EmailTemplateEditor({
  businessId,
  userRole,
  canEdit,
}: EmailTemplateEditorProps) {
  const [templates, setTemplates] = useState<EmailTemplates | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [editingTemplate, setEditingTemplate] =
    useState<EmailTemplateFormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [testEmailData, setTestEmailData] = useState({
    recipientEmail: "",
    testData: {
      businessName: "Demo Business",
      customerName: "John Doe",
      serviceName: "Haircut",
      providerName: "Jane Smith",
      bookingDate: "2024-01-15",
      bookingTime: "2:00 PM",
      serviceDuration: "45 minutes",
      servicePrice: "1400",
      businessAddress: "123 Main St, Addis Ababa",
      businessPhone: "+251 911 123 456",
      businessEmail: "info@demobusiness.com",
      businessLocationLink: "https://maps.google.com/...",
    },
  });

  useEffect(() => {
    if (businessId) {
      fetchEmailTemplates();
    } else {
      // Load default templates for new businesses
      setTemplates(DEFAULT_TEMPLATES as EmailTemplates);
    }
  }, [businessId]);

  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/email-templates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || (DEFAULT_TEMPLATES as EmailTemplates));
      } else {
        setTemplates(DEFAULT_TEMPLATES as EmailTemplates);
      }
    } catch (err) {
      console.error("Failed to fetch email templates:", err);
      setTemplates(DEFAULT_TEMPLATES as EmailTemplates);
    }
  };

  const saveTemplate = async () => {
    if (!editingTemplate || !selectedTemplate) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/email-templates/${selectedTemplate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(editingTemplate),
        },
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("Email template saved successfully!");
        setTemplates((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [selectedTemplate]: editingTemplate,
          };
        });
        setEditingTemplate(null);
        setSelectedTemplate("");
      } else {
        setError(result.message || "Failed to save email template");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!selectedTemplate || !testEmailData.recipientEmail) {
      setError("Please select a template and enter recipient email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          businessId,
          templateType: selectedTemplate,
          recipientEmail: testEmailData.recipientEmail,
          testData: testEmailData.testData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Test email sent successfully!");
      } else {
        setError(result.message || "Failed to send test email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = (templateType: string) => {
    const defaultTemplate = DEFAULT_TEMPLATES[templateType];
    if (defaultTemplate) {
      setEditingTemplate(defaultTemplate);
    }
  };

  const renderTemplate = (template: string, data: any) => {
    let rendered = template;
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      rendered = rendered.replace(regex, value as string);
    });
    return rendered;
  };

  if (!templates) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Templates</h3>
          <p className="text-sm text-gray-600">
            Customize email notifications for different booking events
          </p>
        </div>
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Test Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Test Email</DialogTitle>
                <DialogDescription>
                  Send a test email to see how it looks
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(templates).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input
                    type="email"
                    value={testEmailData.recipientEmail}
                    onChange={(e) =>
                      setTestEmailData((prev) => ({
                        ...prev,
                        recipientEmail: e.target.value,
                      }))
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <Button
                  onClick={sendTestEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(templates).map(([key, template]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {template.subject}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={template.isActive ? "default" : "secondary"}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <Badge
                          key={variable}
                          variant="outline"
                          className="text-xs"
                        >
                          {variable}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(key);
                              setPreviewData(testEmailData.testData);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Preview Email Template</DialogTitle>
                            <DialogDescription>
                              Preview how the email will look to recipients
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <div className="border-b pb-2 mb-4">
                                <strong>Subject:</strong>{" "}
                                {renderTemplate(template.subject, previewData)}
                              </div>
                              <div className="whitespace-pre-wrap text-sm">
                                {renderTemplate(template.body, previewData)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {canEdit && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(key);
                                setEditingTemplate(template);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Email Template</DialogTitle>
                              <DialogDescription>
                                Customize this email template with dynamic
                                variables
                              </DialogDescription>
                            </DialogHeader>

                            {editingTemplate && (
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <Label>Subject</Label>
                                  <Input
                                    value={editingTemplate.subject}
                                    onChange={(e) =>
                                      setEditingTemplate((prev) =>
                                        prev
                                          ? { ...prev, subject: e.target.value }
                                          : null,
                                      )
                                    }
                                    placeholder="Email subject line"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Body</Label>
                                  <Textarea
                                    value={editingTemplate.body}
                                    onChange={(e) =>
                                      setEditingTemplate((prev) =>
                                        prev
                                          ? { ...prev, body: e.target.value }
                                          : null,
                                      )
                                    }
                                    placeholder="Email body content"
                                    rows={12}
                                    className="font-mono text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Available Variables</Label>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {editingTemplate.variables.map(
                                      (variable) => (
                                        <Button
                                          key={variable}
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            const textarea =
                                              document.querySelector(
                                                "textarea",
                                              ) as HTMLTextAreaElement;
                                            if (textarea) {
                                              const start =
                                                textarea.selectionStart;
                                              const end = textarea.selectionEnd;
                                              const newValue =
                                                editingTemplate.body.substring(
                                                  0,
                                                  start,
                                                ) +
                                                `{{${variable}}}` +
                                                editingTemplate.body.substring(
                                                  end,
                                                );
                                              setEditingTemplate((prev) =>
                                                prev
                                                  ? { ...prev, body: newValue }
                                                  : null,
                                              );
                                            }
                                          }}
                                          className="justify-start text-xs"
                                        >
                                          <Copy className="w-3 h-3 mr-1" />
                                          {variable}
                                        </Button>
                                      ),
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => resetToDefault(key)}
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset to Default
                                  </Button>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingTemplate(null);
                                        setSelectedTemplate("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={saveTemplate}
                                      disabled={isLoading}
                                    >
                                      {isLoading
                                        ? "Saving..."
                                        : "Save Template"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
