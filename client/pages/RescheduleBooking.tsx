import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  User,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  Business,
  Booking,
  Service,
  Provider,
  RescheduleRequest,
} from "../../shared/types";
import {
  calculateAvailableTimeSlots,
  TimeSlot,
} from "../utils/bookingAvailability";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";

export default function RescheduleBooking() {
  const { businessSlug } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking");
  const token = searchParams.get("token");
  const { t, isRTL } = useLanguage();

  const [business, setBusiness] = useState<Business | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<
    "verify" | "select" | "confirm" | "complete"
  >("verify");

  useEffect(() => {
    if (bookingId && token) {
      fetchBookingDetails();
    } else {
      setError("Invalid reschedule link. Please check your email.");
      setIsLoading(false);
    }
  }, [bookingId, token]);

  useEffect(() => {
    if (selectedDate && service && provider && business) {
      fetchAvailableSlots();
    }
  }, [selectedDate, service, provider, business]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(
        `/api/bookings/${bookingId}/reschedule?token=${token}`,
      );

      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        setBooking(data.booking);
        setService(data.service);
        setProvider(data.provider);
        setCustomerEmail(data.booking.customerEmail);
        setStep("select");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Invalid or expired reschedule link. Please contact the business.",
        );
      }
    } catch (err) {
      setError("Failed to load booking details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!business || !service || !provider || !selectedDate) return;

    try {
      const response = await fetch(
        `/api/businesses/${business.id}/availability?date=${selectedDate}&serviceId=${service.id}&providerId=${provider.id}`,
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.slots || []);
      }
    } catch (err) {
      console.error("Failed to fetch available slots:", err);
    }
  };

  const submitReschedule = async () => {
    if (!selectedDate || !selectedTime || !customerEmail) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const rescheduleData: RescheduleRequest = {
      bookingId: booking!.id,
      newDate: selectedDate,
      newStartTime: selectedTime,
      reason: rescheduleReason,
      customerEmail,
      rescheduleToken: token!,
    };

    try {
      const response = await fetch("/api/bookings/reschedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rescheduleData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Booking rescheduled successfully!");
        setStep("complete");
      } else {
        setError(result.message || "Failed to reschedule booking");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60); // 60 days in advance
    return maxDate.toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {t("message.loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error && step === "verify") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("message.error")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please contact the business directly for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Reschedule Appointment
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {business?.name}
                </p>
              </div>
            </div>
            <LanguageSelector variant="compact" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {step === "complete" ? (
          // Success Step
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Booking Rescheduled Successfully!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Your appointment has been moved to{" "}
                  <strong>
                    {new Date(selectedDate).toLocaleDateString()} at{" "}
                    {selectedTime}
                  </strong>
                </p>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Confirmation emails have been sent to all parties</li>
                    <li>• Your calendar will be updated automatically</li>
                    <li>• The business has been notified of the change</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => window.open(`/${business?.slug}`, "_blank")}
                    className="w-full"
                  >
                    Visit {business?.name}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Bookmark this page for future reference
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Main Reschedule Flow
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div
                  className={`flex items-center ${
                    step === "select" ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "select"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Select New Time
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div
                  className={`flex items-center ${
                    step === "confirm" ? "text-primary" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "confirm"
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Confirm Details
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Current Booking Info */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Current Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {booking && service && provider && (
                      <>
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-300">
                            Service
                          </Label>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.duration} minutes • ETB {service.price}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-300">
                            Provider
                          </Label>
                          <p className="font-medium">{provider.name}</p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-300">
                            Current Date & Time
                          </Label>
                          <p className="font-medium">
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.startTime} - {booking.endTime}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-300">
                            Customer
                          </Label>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {booking.customerEmail}
                          </p>
                        </div>

                        {business && (
                          <div className="pt-4 border-t">
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{business.address}</span>
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
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Reschedule Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      {step === "select"
                        ? "Select New Date & Time"
                        : "Confirm Reschedule"}
                    </CardTitle>
                    <CardDescription>
                      {step === "select"
                        ? "Choose a new date and time for your appointment"
                        : "Review your new appointment details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {step === "select" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-date">New Date</Label>
                            <Input
                              id="new-date"
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              min={getMinDate()}
                              max={getMaxDate()}
                              className={
                                errors.preferredDate ? "border-red-500" : ""
                              }
                            />
                            <p className="text-xs text-gray-500">
                              Select from tomorrow up to 60 days in advance
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-time">New Time</Label>
                            <Select
                              value={selectedTime}
                              onValueChange={setSelectedTime}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSlots.length === 0 &&
                                  selectedDate && (
                                    <SelectItem value="" disabled>
                                      No available times
                                    </SelectItem>
                                  )}
                                {availableSlots
                                  .filter((slot) => slot.available)
                                  .map((slot) => (
                                    <SelectItem
                                      key={slot.time}
                                      value={slot.time}
                                    >
                                      {slot.time}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {selectedDate && availableSlots.length === 0 && (
                              <p className="text-xs text-red-600">
                                No available time slots for this date
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reason">
                            Reason for Rescheduling (Optional)
                          </Label>
                          <Textarea
                            id="reason"
                            value={rescheduleReason}
                            onChange={(e) =>
                              setRescheduleReason(e.target.value)
                            }
                            placeholder="Let us know why you need to reschedule..."
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Confirm Your Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            readOnly
                            className="bg-gray-50 dark:bg-gray-800"
                          />
                          <p className="text-xs text-gray-500">
                            Confirmation will be sent to this email
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={() => setStep("confirm")}
                            disabled={
                              !selectedDate || !selectedTime || !customerEmail
                            }
                          >
                            Continue to Confirmation
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    )}

                    {step === "confirm" && (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                            New Appointment Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-blue-700 dark:text-blue-300">
                                Date
                              </Label>
                              <p className="font-medium text-blue-900 dark:text-blue-100">
                                {new Date(selectedDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-blue-700 dark:text-blue-300">
                                Time
                              </Label>
                              <p className="font-medium text-blue-900 dark:text-blue-100">
                                {selectedTime} ({service?.duration} minutes)
                              </p>
                            </div>
                          </div>
                        </div>

                        {rescheduleReason && (
                          <div>
                            <Label className="text-sm text-gray-600 dark:text-gray-300">
                              Reason for Rescheduling
                            </Label>
                            <p className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                              {rescheduleReason}
                            </p>
                          </div>
                        )}

                        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>
                            <strong>Important:</strong> Once confirmed, your
                            original appointment will be cancelled and replaced
                            with the new time. All parties will be notified via
                            email.
                          </AlertDescription>
                        </Alert>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => setStep("select")}
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Select Time
                          </Button>
                          <Button
                            onClick={submitReschedule}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              "Rescheduling..."
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Reschedule
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            {t("footer.powered.by")}{" "}
            <span className="font-semibold text-primary">BookingWithCal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
