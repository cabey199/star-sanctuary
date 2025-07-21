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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Table,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Settings,
} from "lucide-react";
import { Booking, Business, ExportOptions } from "../../shared/types";

interface BookingExportProps {
  bookings: Booking[];
  business?: Business;
  userRole: "customer" | "client" | "subadmin" | "mother_admin";
  onExport?: (format: string, options: ExportOptions) => void;
}

export default function BookingExport({
  bookings,
  business,
  userRole,
  onExport,
}: BookingExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    includeFields: [
      "customerName",
      "customerEmail",
      "customerPhone",
      "date",
      "startTime",
      "endTime",
      "serviceName",
      "providerName",
      "totalAmount",
      "status",
    ],
    dateRange: {
      start: "",
      end: "",
    },
    customization: {
      colors: {
        primary: "#8B5CF6",
        secondary: "#3B82F6",
      },
      additionalText: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableFields = [
    { key: "customerName", label: "Customer Name", icon: User },
    { key: "customerEmail", label: "Email", icon: Mail },
    { key: "customerPhone", label: "Phone", icon: Phone },
    { key: "date", label: "Date", icon: Calendar },
    { key: "startTime", label: "Start Time", icon: Clock },
    { key: "endTime", label: "End Time", icon: Clock },
    { key: "serviceName", label: "Service", icon: Settings },
    { key: "providerName", label: "Provider", icon: User },
    { key: "totalAmount", label: "Amount", icon: DollarSign },
    { key: "status", label: "Status", icon: Badge },
    { key: "notes", label: "Notes", icon: FileText },
    { key: "createdAt", label: "Booking Date", icon: Calendar },
  ];

  const exportFormats = [
    {
      key: "csv",
      label: "CSV File",
      description: "Spreadsheet format for data analysis",
      icon: Table,
    },
    {
      key: "pdf",
      label: "PDF Document",
      description: "Professional formatted document",
      icon: FileText,
    },
    {
      key: "img",
      label: "Image (PNG)",
      description: "Visual summary for sharing",
      icon: ImageIcon,
    },
  ];

  const handleFieldToggle = (fieldKey: string, checked: boolean) => {
    setExportOptions((prev) => ({
      ...prev,
      includeFields: checked
        ? [...prev.includeFields, fieldKey]
        : prev.includeFields.filter((f) => f !== fieldKey),
    }));
  };

  const handleExport = async () => {
    if (exportOptions.includeFields.length === 0) {
      setError("Please select at least one field to export");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (onExport) {
        await onExport(exportOptions.format, exportOptions);
        setSuccess(`${exportOptions.format.toUpperCase()} export started!`);
      } else {
        // Direct download implementation
        await generateAndDownloadExport();
        setSuccess("Export downloaded successfully!");
      }
    } catch (err) {
      setError("Failed to export data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndDownloadExport = async () => {
    const filteredBookings = filterBookings();

    switch (exportOptions.format) {
      case "csv":
        downloadCSV(filteredBookings);
        break;
      case "pdf":
        await downloadPDF(filteredBookings);
        break;
      case "img":
        await downloadImage(filteredBookings);
        break;
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (exportOptions.dateRange?.start && exportOptions.dateRange?.end) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date);
        const startDate = new Date(exportOptions.dateRange!.start);
        const endDate = new Date(exportOptions.dateRange!.end);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    return filtered;
  };

  const downloadCSV = (data: Booking[]) => {
    const headers = exportOptions.includeFields.map((field) => {
      const fieldInfo = availableFields.find((f) => f.key === field);
      return fieldInfo?.label || field;
    });

    const csvContent = [
      headers.join(","),
      ...data.map((booking) =>
        exportOptions.includeFields
          .map((field) => {
            let value = booking[field as keyof Booking] || "";
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value}"`;
            }
            return value;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = async (data: Booking[]) => {
    // This would integrate with a PDF library like jsPDF
    // For now, creating a simple HTML-to-PDF approach
    const htmlContent = generatePDFHTML(data);

    // In a real implementation, you'd use jsPDF or similar
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePDFHTML = (data: Booking[]) => {
    const businessName = business?.name || "Business";
    const exportDate = new Date().toLocaleDateString();

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Export - ${businessName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid ${exportOptions.customization?.colors?.primary || "#8B5CF6"}; padding-bottom: 10px; }
          .title { color: ${exportOptions.customization?.colors?.primary || "#8B5CF6"}; margin: 0; }
          .subtitle { color: #666; margin: 5px 0; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: ${exportOptions.customization?.colors?.primary || "#8B5CF6"}; color: white; }
          .table tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${businessName} - Booking Export</h1>
          <p class="subtitle">Generated on ${exportDate}</p>
          ${exportOptions.customization?.additionalText ? `<p>${exportOptions.customization.additionalText}</p>` : ""}
        </div>
        
        <table class="table">
          <thead>
            <tr>
              ${exportOptions.includeFields
                .map((field) => {
                  const fieldInfo = availableFields.find(
                    (f) => f.key === field,
                  );
                  return `<th>${fieldInfo?.label || field}</th>`;
                })
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (booking) => `
              <tr>
                ${exportOptions.includeFields
                  .map((field) => {
                    let value = booking[field as keyof Booking] || "";
                    if (field === "totalAmount") {
                      value = `ETB ${value}`;
                    } else if (field === "date") {
                      value = new Date(value as string).toLocaleDateString();
                    }
                    return `<td>${value}</td>`;
                  })
                  .join("")}
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Total Bookings: ${data.length} | Exported by BookingWithCal</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadImage = async (data: Booking[]) => {
    // Create a canvas for image generation
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = exportOptions.customization?.colors?.primary || "#8B5CF6";
    ctx.fillRect(0, 0, canvas.width, 80);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${business?.name || "Business"} - Bookings`,
      canvas.width / 2,
      35,
    );

    ctx.font = "14px Arial";
    ctx.fillText(
      `Exported on ${new Date().toLocaleDateString()}`,
      canvas.width / 2,
      60,
    );

    // Summary stats
    ctx.fillStyle = "#333333";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Total Bookings: ${data.length}`, 50, 120);

    const confirmedBookings = data.filter((b) => b.status === "confirmed");
    ctx.fillText(`Confirmed: ${confirmedBookings.length}`, 50, 150);

    const totalRevenue = data.reduce((sum, b) => sum + b.totalAmount, 0);
    ctx.fillText(`Total Revenue: ETB ${totalRevenue}`, 50, 180);

    // Booking list (first 10)
    ctx.font = "12px Arial";
    const maxBookings = Math.min(data.length, 10);
    for (let i = 0; i < maxBookings; i++) {
      const booking = data[i];
      const y = 220 + i * 25;

      ctx.fillText(
        `${booking.customerName} - ${booking.date} ${booking.startTime}`,
        50,
        y,
      );
      ctx.fillText(`ETB ${booking.totalAmount}`, 600, y);
    }

    if (data.length > 10) {
      ctx.fillText(`... and ${data.length - 10} more bookings`, 50, 470);
    }

    // Footer
    ctx.fillStyle = "#666666";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Powered by BookingWithCal", canvas.width / 2, 580);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bookings-summary-${new Date().toISOString().split("T")[0]}.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  const getDefaultDateRange = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return {
      start: thirtyDaysAgo.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    };
  };

  const previewData = filterBookings().slice(0, 3);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Booking Data
          </DialogTitle>
          <DialogDescription>
            Choose format and customize your booking data export
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Options */}
          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Export Format</Label>
              <div className="grid gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.key}
                      className={`
                        cursor-pointer rounded-lg border-2 p-4 transition-all
                        ${
                          exportOptions.format === format.key
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      onClick={() =>
                        setExportOptions((prev) => ({
                          ...prev,
                          format: format.key as "csv" | "pdf" | "img",
                        }))
                      }
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-gray-600">
                            {format.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Date Range</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={exportOptions.dateRange?.start || ""}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          start: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={exportOptions.dateRange?.end || ""}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          end: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const defaultRange = getDefaultDateRange();
                  setExportOptions((prev) => ({
                    ...prev,
                    dateRange: defaultRange,
                  }));
                }}
              >
                Last 30 Days
              </Button>
            </div>

            {/* Fields Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Include Fields</Label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {availableFields.map((field) => {
                  const Icon = field.icon;
                  const isChecked = exportOptions.includeFields.includes(
                    field.key,
                  );

                  return (
                    <div
                      key={field.key}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      <Checkbox
                        id={field.key}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleFieldToggle(field.key, checked as boolean)
                        }
                      />
                      <Icon className="w-4 h-4 text-gray-500" />
                      <Label
                        htmlFor={field.key}
                        className="text-sm cursor-pointer"
                      >
                        {field.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customization */}
            {(exportOptions.format === "pdf" ||
              exportOptions.format === "img") && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Customization</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={
                            exportOptions.customization?.colors?.primary ||
                            "#8B5CF6"
                          }
                          onChange={(e) =>
                            setExportOptions((prev) => ({
                              ...prev,
                              customization: {
                                ...prev.customization,
                                colors: {
                                  ...prev.customization?.colors,
                                  primary: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-12 h-10"
                        />
                        <Input
                          value={
                            exportOptions.customization?.colors?.primary ||
                            "#8B5CF6"
                          }
                          onChange={(e) =>
                            setExportOptions((prev) => ({
                              ...prev,
                              customization: {
                                ...prev.customization,
                                colors: {
                                  ...prev.customization?.colors,
                                  primary: e.target.value,
                                },
                              },
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={
                            exportOptions.customization?.colors?.secondary ||
                            "#3B82F6"
                          }
                          onChange={(e) =>
                            setExportOptions((prev) => ({
                              ...prev,
                              customization: {
                                ...prev.customization,
                                colors: {
                                  ...prev.customization?.colors,
                                  secondary: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-12 h-10"
                        />
                        <Input
                          value={
                            exportOptions.customization?.colors?.secondary ||
                            "#3B82F6"
                          }
                          onChange={(e) =>
                            setExportOptions((prev) => ({
                              ...prev,
                              customization: {
                                ...prev.customization,
                                colors: {
                                  ...prev.customization?.colors,
                                  secondary: e.target.value,
                                },
                              },
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-text">Additional Text</Label>
                    <Textarea
                      id="additional-text"
                      value={exportOptions.customization?.additionalText || ""}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          customization: {
                            ...prev.customization,
                            additionalText: e.target.value,
                          },
                        }))
                      }
                      placeholder="Add custom text to the export..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Export Preview</Label>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {business?.name || "Business"} - Booking Export
                </CardTitle>
                <CardDescription className="text-xs">
                  {previewData.length} of {filterBookings().length} bookings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {previewData.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No bookings found for the selected date range
                  </p>
                ) : (
                  previewData.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="text-xs border-b pb-2 last:border-b-0"
                    >
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-gray-600">
                        {booking.date} at {booking.startTime}
                      </div>
                      <div className="text-gray-600">
                        ETB {booking.totalAmount}
                      </div>
                    </div>
                  ))
                )}

                {previewData.length > 0 &&
                  previewData.length < filterBookings().length && (
                    <div className="text-xs text-gray-500 text-center pt-2">
                      ... and {filterBookings().length - previewData.length}{" "}
                      more bookings
                    </div>
                  )}
              </CardContent>
            </Card>

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

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={
                isLoading ||
                exportOptions.includeFields.length === 0 ||
                filterBookings().length === 0
              }
              className="w-full"
            >
              {isLoading ? (
                "Exporting..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export {exportOptions.format.toUpperCase()}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Export will include {filterBookings().length} booking
              {filterBookings().length !== 1 ? "s" : ""} with{" "}
              {exportOptions.includeFields.length} field
              {exportOptions.includeFields.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
