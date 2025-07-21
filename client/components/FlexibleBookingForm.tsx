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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Camera,
  Home,
  Building,
} from "lucide-react";
import { Service, Business, Provider } from "../../shared/types";

interface FlexibleBookingFormProps {
  service: Service;
  business: Business;
  providers: Provider[];
  onSubmit: (bookingData: FlexibleBookingData) => void;
  isLoading: boolean;
}

interface FlexibleBookingData {
  serviceId: string;
  providerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  preferredTimeRange: string;
  serviceLocation: string;
  serviceDescription: string;
  specialNotes: string;
  estimatedBudget?: string;
}

const TIME_RANGES = [
  "Morning (8:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 5:00 PM)",
  "Evening (5:00 PM - 8:00 PM)",
  "Flexible - Any time",
  "Specific time (please specify in notes)",
];

const LOCATION_TYPES = [
  { value: "business", label: "At Business Location", icon: Building },
  { value: "customer", label: "At My Location", icon: Home },
  { value: "outdoor", label: "Outdoor Location", icon: MapPin },
  { value: "virtual", label: "Virtual/Online", icon: Camera },
  { value: "other", label: "Other (specify below)", icon: MapPin },
];

export default function FlexibleBookingForm({
  service,
  business,
  providers,
  onSubmit,
  isLoading,
}: FlexibleBookingFormProps) {
  const [formData, setFormData] = useState<FlexibleBookingData>({
    serviceId: service.id,
    providerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    preferredDate: "",
    preferredTimeRange: "",
    serviceLocation: "",
    serviceDescription: "",
    specialNotes: "",
    estimatedBudget: "",
  });

  const [locationDetail, setLocationDetail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    }

    if (!formData.providerId) {
      newErrors.providerId = "Please select a provider";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    }

    if (!formData.preferredTimeRange) {
      newErrors.preferredTimeRange = "Please select a time range";
    }

    if (!formData.serviceLocation) {
      newErrors.serviceLocation = "Please specify service location";
    }

    if (!formData.serviceDescription.trim()) {
      newErrors.serviceDescription = "Service description is required";
    }

    // Check if preferred date is in the future
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Combine location type with detail if needed
    let finalLocation = formData.serviceLocation;
    if (formData.serviceLocation === "other" && locationDetail) {
      finalLocation = locationDetail;
    } else if (
      formData.serviceLocation === "customer" ||
      formData.serviceLocation === "outdoor"
    ) {
      if (locationDetail) {
        finalLocation = `${
          LOCATION_TYPES.find((lt) => lt.value === formData.serviceLocation)
            ?.label
        }: ${locationDetail}`;
      }
    }

    const submitData = {
      ...formData,
      serviceLocation: finalLocation,
    };

    onSubmit(submitData);
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">{service.name}</CardTitle>
        <CardDescription className="text-lg">
          Flexible Duration - Time To Be Confirmed
        </CardDescription>
        <Badge variant="outline" className="w-fit mx-auto mt-2">
          ETB {service.price} (Starting Price)
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Service Info Alert */}
          <Alert className="bg-orange-50 border-orange-200">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              This service requires manual scheduling. We'll review your request
              and confirm the exact time and final pricing within 24 hours.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange("customerName", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className={errors.customerName ? "border-red-500" : ""}
                  />
                  {errors.customerName && (
                    <p className="text-sm text-red-600">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleInputChange("customerEmail", e.target.value)
                    }
                    placeholder="your.email@example.com"
                    className={errors.customerEmail ? "border-red-500" : ""}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-600">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    handleInputChange("customerPhone", e.target.value)
                  }
                  placeholder="+251 911 123 456"
                  className={errors.customerPhone ? "border-red-500" : ""}
                />
                {errors.customerPhone && (
                  <p className="text-sm text-red-600">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>Preferred Provider *</Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) =>
                  handleInputChange("providerId", value)
                }
              >
                <SelectTrigger
                  className={errors.providerId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex items-center gap-2">
                        <span>{provider.name}</span>
                        {provider.specialties.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {provider.specialties[0]}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.providerId && (
                <p className="text-sm text-red-600">{errors.providerId}</p>
              )}
            </div>

            {/* Scheduling Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scheduling Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      handleInputChange("preferredDate", e.target.value)
                    }
                    min={minDate}
                    className={errors.preferredDate ? "border-red-500" : ""}
                  />
                  {errors.preferredDate && (
                    <p className="text-sm text-red-600">
                      {errors.preferredDate}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Preferred Time Range *</Label>
                  <Select
                    value={formData.preferredTimeRange}
                    onValueChange={(value) =>
                      handleInputChange("preferredTimeRange", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        errors.preferredTimeRange ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredTimeRange && (
                    <p className="text-sm text-red-600">
                      {errors.preferredTimeRange}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Service Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LOCATION_TYPES.map(({ value, label, icon: Icon }) => (
                  <div
                    key={value}
                    className={`
                      relative cursor-pointer rounded-lg border-2 p-4 transition-all
                      ${
                        formData.serviceLocation === value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                    onClick={() => handleInputChange("serviceLocation", value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{label}</span>
                    </div>
                    {formData.serviceLocation === value && (
                      <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>

              {(formData.serviceLocation === "customer" ||
                formData.serviceLocation === "outdoor" ||
                formData.serviceLocation === "other") && (
                <div className="space-y-2">
                  <Label htmlFor="locationDetail">
                    {formData.serviceLocation === "customer"
                      ? "Your Address"
                      : formData.serviceLocation === "outdoor"
                        ? "Outdoor Location"
                        : "Location Details"}
                    *
                  </Label>
                  <Textarea
                    id="locationDetail"
                    value={locationDetail}
                    onChange={(e) => setLocationDetail(e.target.value)}
                    placeholder={
                      formData.serviceLocation === "customer"
                        ? "Please provide your full address"
                        : formData.serviceLocation === "outdoor"
                          ? "Describe the outdoor location"
                          : "Please specify the location"
                    }
                    rows={2}
                  />
                </div>
              )}

              {errors.serviceLocation && (
                <p className="text-sm text-red-600">{errors.serviceLocation}</p>
              )}
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">
                    Detailed Service Description *
                  </Label>
                  <Textarea
                    id="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={(e) =>
                      handleInputChange("serviceDescription", e.target.value)
                    }
                    placeholder="Please describe exactly what you need. Include specific requirements, style preferences, and any details that help us provide accurate timing and pricing."
                    rows={4}
                    className={
                      errors.serviceDescription ? "border-red-500" : ""
                    }
                  />
                  {errors.serviceDescription && (
                    <p className="text-sm text-red-600">
                      {errors.serviceDescription}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedBudget">
                    Estimated Budget (Optional)
                  </Label>
                  <Input
                    id="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={(e) =>
                      handleInputChange("estimatedBudget", e.target.value)
                    }
                    placeholder="ETB 2000 - 5000 (optional)"
                  />
                  <p className="text-xs text-gray-600">
                    This helps us provide more accurate estimates
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialNotes">
                    Special Notes or Requirements
                  </Label>
                  <Textarea
                    id="specialNotes"
                    value={formData.specialNotes}
                    onChange={(e) =>
                      handleInputChange("specialNotes", e.target.value)
                    }
                    placeholder="Any special requirements, allergies, accessibility needs, or other important information"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="pt-4">
                <h4 className="font-semibold mb-3">Business Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{business.name}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{business.phone}</span>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{business.email}</span>
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{business.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                "Submitting Request..."
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Service Request
                </>
              )}
            </Button>

            <p className="text-xs text-gray-600 text-center">
              After submitting, we'll review your request and contact you within
              24 hours with timing confirmation and final pricing.
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
