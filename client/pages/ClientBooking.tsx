import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle } from "lucide-react";
import {
  Business,
  Service,
  Provider,
  BookingRequest,
} from "../../shared/types";
import PublicReviews from "../components/PublicReviews";

interface BookingStep {
  id: string;
  title: string;
  description: string;
}

const steps: BookingStep[] = [
  {
    id: "service",
    title: "Choose Service",
    description: "Select your service",
  },
  { id: "provider", title: "Choose Provider", description: "Pick your expert" },
  { id: "datetime", title: "Date & Time", description: "Schedule your visit" },
  { id: "details", title: "Your Details", description: "Contact information" },
  { id: "confirm", title: "Confirm", description: "Review & book" },
];

export default function ClientBooking() {
  const { clientName } = useParams<{ clientName: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<Partial<BookingRequest>>({});

  useEffect(() => {
    // Mock data - will connect to backend later
    const mockBusiness: Business = {
      id: "1",
      name: "Barber Zone",
      slug: "barber-zone",
      description: "Premium barbershop services in the heart of downtown",
      email: "owner@barberzone.com",
      phone: "+251911123456",
      address: "Bole Road, near Edna Mall",
      city: "Addis Ababa",
      region: "Addis Ababa",
      businessType: "Barber Shop",
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockServices: Service[] = [
      {
        id: "1",
        businessId: "1",
        name: "Classic Haircut",
        description: "Traditional men's haircut with styling",
        category: "Haircut & Styling",
        duration: 45,
        price: 1400, // ETB equivalent
        isActive: true,
      },
      {
        id: "2",
        businessId: "1",
        name: "Beard Trim",
        description: "Professional beard grooming and shaping",
        category: "Haircut & Styling",
        duration: 30,
        price: 1000, // ETB equivalent
        isActive: true,
      },
      {
        id: "3",
        businessId: "1",
        name: "Full Service",
        description: "Haircut + beard trim + hot towel treatment",
        category: "Haircut & Styling",
        duration: 75,
        price: 2200, // ETB equivalent
        isActive: true,
      },
    ];

    const mockProviders: Provider[] = [
      {
        id: "1",
        businessId: "1",
        name: "Mike Johnson",
        bio: "Master barber with 15+ years experience",
        specialties: ["Classic cuts", "Beard styling"],
        isActive: true,
        workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        workingHours: { start: "09:00", end: "17:00" },
      },
      {
        id: "2",
        businessId: "1",
        name: "Sarah Chen",
        bio: "Modern styling specialist",
        specialties: ["Modern cuts", "Hair treatments"],
        isActive: true,
        workingDays: ["tuesday", "wednesday", "thursday", "friday", "saturday"],
        workingHours: { start: "10:00", end: "18:00" },
      },
    ];

    setTimeout(() => {
      setBusiness(mockBusiness);
      setServices(mockServices);
      setProviders(mockProviders);
      setIsLoading(false);
    }, 500);
  }, [clientName]);

  const selectedService = services.find((s) => s.id === booking.serviceId);
  const selectedProvider = providers.find((p) => p.id === booking.providerId);

  // Function to calculate available time slots based on service duration and existing bookings
  const getAvailableTimeSlots = (
    date: string,
    providerId: string,
    serviceDuration: number,
  ) => {
    if (!date || !providerId) return [];

    // Get business hours (simplified - using 9 AM to 6 PM)
    const startHour = 9;
    const endHour = 18;
    const slotInterval = 15; // 15-minute intervals

    // Get existing bookings for this provider on this date
    const existingBookings = [
      // Mock existing bookings - in production this would come from the server
      { startTime: "10:00", endTime: "10:45" },
      { startTime: "14:30", endTime: "15:00" },
    ];

    const availableSlots = [];

    // Generate all possible time slots
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const slotStart = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const slotStartTime = new Date(`2024-01-01 ${slotStart}`);
        const slotEndTime = new Date(
          slotStartTime.getTime() + serviceDuration * 60000,
        );
        const slotEnd = `${slotEndTime.getHours().toString().padStart(2, "0")}:${slotEndTime.getMinutes().toString().padStart(2, "0")}`;

        // Check if slot end time is within business hours
        if (slotEndTime.getHours() > endHour) continue;

        // Check if this slot conflicts with existing bookings
        const hasConflict = existingBookings.some((booking) => {
          const bookingStart = new Date(`2024-01-01 ${booking.startTime}`);
          const bookingEnd = new Date(`2024-01-01 ${booking.endTime}`);

          // Check for overlap
          return slotStartTime < bookingEnd && slotEndTime > bookingStart;
        });

        if (!hasConflict) {
          const displayTime = slotStartTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          availableSlots.push({
            value: slotStart,
            label: `${displayTime} (${serviceDuration} min)`,
            endTime: slotEnd,
          });
        }
      }
    }

    return availableSlots;
  };

  // Get available time slots for the selected service and provider
  const availableTimeSlots =
    selectedService && selectedProvider && booking.date
      ? getAvailableTimeSlots(
          booking.date,
          selectedProvider.id,
          selectedService.duration,
        )
      : [];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!booking.serviceId;
      case 1:
        return !!booking.providerId;
      case 2:
        return !!booking.date && !!booking.startTime;
      case 3:
        return !!(
          booking.customerName &&
          booking.customerEmail &&
          booking.customerPhone
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // Create booking request
      const bookingRequest = {
        businessId: business!.id,
        serviceId: booking.serviceId!,
        providerId: booking.providerId!,
        customerName: booking.customerName!,
        customerEmail: booking.customerEmail!,
        customerPhone: booking.customerPhone!,
        date: booking.date!,
        startTime: booking.startTime!,
        notes: booking.notes || "",
      };

      // Send booking request to server
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequest),
      });

      if (response.ok) {
        const result = await response.json();

        // Show success message
        alert(`
Booking Confirmed! 🎉

Your appointment has been booked successfully.

📧 Confirmation emails have been sent to:
• You (${booking.customerEmail})
• ${business!.name} (${business!.email})
• Platform Administrator

Thank you for choosing ${business!.name}!
        `);

        // Reset form
        setCurrentStep(0);
        setBooking({});

        // Log email notifications (in production, these would be sent by the server)
        console.log("📧 EMAIL NOTIFICATIONS SENT:");
        console.log("1. Customer notification to:", booking.customerEmail);
        console.log("2. Business owner notification to:", business!.email);
        console.log(
          "3. Platform owner notification to: admin@bookingwithcal.com",
        );
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(
        "Sorry, there was an error creating your booking. Please try again.",
      );
    }
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
          <p className="text-gray-600">
            The booking page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* BookingWithCal Watermark */}
      <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none z-10">
        <div className="text-xs text-gray-400 font-medium">
          Powered by BookingWithCal
        </div>
      </div>
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {business.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{business.description}</p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span>📧 {business.email}</span>
              <span>📞 {business.phone}</span>
              <span>📍 {business.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      index <= currentStep
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        index < currentStep ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div key={step.id} className="text-center">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {steps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 0: Service Selection */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        booking.serviceId === service.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setBooking({ ...booking, serviceId: service.id })
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}min
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            ETB {service.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Provider Selection */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        booking.providerId === provider.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setBooking({ ...booking, providerId: provider.id })
                      }
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {provider.bio}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {provider.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Date & Time Selection */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date">Select Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={booking.date || ""}
                        onChange={(e) =>
                          setBooking({ ...booking, date: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Select Time</Label>
                      <Select
                        value={booking.startTime || ""}
                        onValueChange={(value) => {
                          const selectedSlot = availableTimeSlots.find(
                            (slot) => slot.value === value,
                          );
                          setBooking({
                            ...booking,
                            startTime: value,
                            endTime: selectedSlot?.endTime,
                          });
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue
                            placeholder={
                              availableTimeSlots.length > 0
                                ? "Choose available time"
                                : selectedService && selectedProvider
                                  ? "No available slots"
                                  : "Select service and provider first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.length > 0 ? (
                            availableTimeSlots.map((slot) => (
                              <SelectItem key={slot.value} value={slot.value}>
                                {slot.label}
                              </SelectItem>
                            ))
                          ) : selectedService &&
                            selectedProvider &&
                            booking.date ? (
                            <div className="p-2 text-sm text-gray-500">
                              No available time slots for this date
                            </div>
                          ) : (
                            <div className="p-2 text-sm text-gray-500">
                              Please select a service and provider first
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      {selectedService && (
                        <p className="text-xs text-gray-500 mt-1">
                          Service duration: {selectedService.duration} minutes
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Customer Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={booking.customerName || ""}
                        onChange={(e) =>
                          setBooking({
                            ...booking,
                            customerName: e.target.value,
                          })
                        }
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={booking.customerPhone || ""}
                        onChange={(e) =>
                          setBooking({
                            ...booking,
                            customerPhone: e.target.value,
                          })
                        }
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={booking.customerEmail || ""}
                      onChange={(e) =>
                        setBooking({
                          ...booking,
                          customerEmail: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={booking.notes || ""}
                      onChange={(e) =>
                        setBooking({ ...booking, notes: e.target.value })
                      }
                      placeholder="Any special requests or notes..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Booking Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium">
                          {selectedService?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider:</span>
                        <span className="font-medium">
                          {selectedProvider?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-medium">
                          {booking.date} at {booking.startTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {selectedService?.duration} minutes
                        </span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-primary">
                          ETB {selectedService?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    By confirming this booking, you agree to our terms and
                    conditions. You'll receive a confirmation email shortly.
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={!canProceed()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Confirm Booking
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Public Reviews Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PublicReviews
            businessSlug={clientName || ""}
            showTitle={true}
            maxReviews={6}
            layout="detailed"
            enableFiltering={true}
            enableSharing={false}
          />
        </div>
      </div>

      <footer className="border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                BookingWithCal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Professional booking platform for businesses.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/legal/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:support@bookingwithcal.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                  >
                    Back to Home
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; 2024 BookingWithCal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
