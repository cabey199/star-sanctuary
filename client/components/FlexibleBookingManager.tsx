import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Settings,
  Mail,
  MapPin,
  MessageSquare,
  Timer,
  Zap,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

interface FlexibleBookingRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  desiredDate: string;
  preferredTimeRange: string;
  serviceDescription: string;
  location?: string;
  specialNotes?: string;
  status: "pending" | "confirmed" | "rejected";
  estimatedDuration?: number;
  confirmedStartTime?: string;
  confirmedEndTime?: string;
  createdAt: string;
}

interface Service {
  id: string;
  name: string;
  type: "fixed" | "flexible";
  duration?: number; // Only for fixed services
  price: number;
  description: string;
  category: string;
  isActive: boolean;
}

interface FlexibleBookingManagerProps {
  businessId: string;
  isReadOnly?: boolean;
}

export default function FlexibleBookingManager({
  businessId,
  isReadOnly = false,
}: FlexibleBookingManagerProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [bookingRequests, setBookingRequests] = useState<
    FlexibleBookingRequest[]
  >([]);
  const [selectedRequest, setSelectedRequest] =
    useState<FlexibleBookingRequest | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [confirmedDate, setConfirmedDate] = useState("");
  const [confirmedStartTime, setConfirmedStartTime] = useState("");
  const [activeTab, setActiveTab] = useState("requests");

  // Sample data
  useEffect(() => {
    const mockServices: Service[] = [
      {
        id: "1",
        name: "Standard Haircut",
        type: "fixed",
        duration: 45,
        price: 25,
        description: "Professional haircut and styling",
        category: "Hair Services",
        isActive: true,
      },
      {
        id: "2",
        name: "Home Photography Session",
        type: "flexible",
        price: 150,
        description: "Professional photography at your location",
        category: "Photography",
        isActive: true,
      },
      {
        id: "3",
        name: "Business Consultation",
        type: "flexible",
        price: 100,
        description: "Strategic business planning session",
        category: "Consulting",
        isActive: true,
      },
      {
        id: "4",
        name: "Massage Therapy",
        type: "fixed",
        duration: 60,
        price: 80,
        description: "Relaxing full-body massage",
        category: "Wellness",
        isActive: true,
      },
    ];

    const mockRequests: FlexibleBookingRequest[] = [
      {
        id: "req_1",
        customerName: "Sarah Johnson",
        customerEmail: "sarah@example.com",
        customerPhone: "+1 555 0123",
        serviceId: "2",
        serviceName: "Home Photography Session",
        desiredDate: "2024-02-15",
        preferredTimeRange: "Morning (9AM-12PM)",
        serviceDescription:
          "Family portrait session for 4 people. Need outdoor and indoor shots. Have 2 young children.",
        location: "123 Oak Street, Downtown",
        specialNotes: "Please bring props for children",
        status: "pending",
        createdAt: "2024-01-28T10:30:00Z",
      },
      {
        id: "req_2",
        customerName: "Michael Chen",
        customerEmail: "michael@example.com",
        customerPhone: "+1 555 0124",
        serviceId: "3",
        serviceName: "Business Consultation",
        desiredDate: "2024-02-20",
        preferredTimeRange: "Afternoon (2PM-5PM)",
        serviceDescription:
          "Need help with business expansion strategy. Looking to open 2 new locations.",
        location: "Downtown office - Zoom also acceptable",
        specialNotes: "Have financial documents ready",
        status: "confirmed",
        estimatedDuration: 120,
        confirmedStartTime: "14:00",
        confirmedEndTime: "16:00",
        createdAt: "2024-01-25T14:15:00Z",
      },
    ];

    setServices(mockServices);
    setBookingRequests(mockRequests);
  }, [businessId]);

  const handleConfirmBooking = () => {
    if (!selectedRequest || !confirmedDate || !confirmedStartTime) return;

    const endTime = new Date(`${confirmedDate}T${confirmedStartTime}`);
    endTime.setMinutes(endTime.getMinutes() + estimatedDuration);

    const updatedRequest: FlexibleBookingRequest = {
      ...selectedRequest,
      status: "confirmed",
      estimatedDuration,
      confirmedStartTime,
      confirmedEndTime: endTime.toTimeString().slice(0, 5),
    };

    setBookingRequests((prev) =>
      prev.map((req) => (req.id === selectedRequest.id ? updatedRequest : req)),
    );

    // Send confirmation emails (mock)
    console.log("Sending confirmation emails to:", {
      customer: selectedRequest.customerEmail,
      business: "business@example.com",
      admin: "admin@bookingwithcal.com",
    });

    setIsConfirmDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleRejectBooking = (requestId: string) => {
    setBookingRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const flexibleServices = services.filter((s) => s.type === "flexible");
  const fixedServices = services.filter((s) => s.type === "fixed");
  const pendingRequests = bookingRequests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Service Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage fixed-duration and flexible booking services
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {pendingRequests.length} pending
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fixed Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="w-5 h-5 mr-2 text-blue-600" />
              Fixed Duration Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fixedServices.map((service) => (
                <div
                  key={service.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.duration} minutes • ${service.price}
                      </p>
                    </div>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flexible Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              Flexible Duration Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flexibleServices.map((service) => (
                <div
                  key={service.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Time TBC • ${service.price}
                      </p>
                    </div>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
              Booking Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookingRequests.slice(0, 3).map((request) => (
                <div
                  key={request.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">
                        {request.customerName}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {request.serviceName}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {request.desiredDate} • {request.preferredTimeRange}
                  </p>
                  {request.status === "pending" && !isReadOnly && (
                    <div className="flex space-x-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setConfirmedDate(request.desiredDate);
                          setIsConfirmDialogOpen(true);
                        }}
                        className="flex-1 text-xs"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectBooking(request.id)}
                        className="flex-1 text-xs"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Booking Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Service</th>
                  <th className="text-left p-2">Requested Date</th>
                  <th className="text-left p-2">Time Range</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{request.customerName}</p>
                        <p className="text-sm text-gray-600">
                          {request.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{request.serviceName}</p>
                        <p className="text-sm text-gray-600">
                          {request.serviceDescription.slice(0, 50)}...
                        </p>
                      </div>
                    </td>
                    <td className="p-2">{request.desiredDate}</td>
                    <td className="p-2">{request.preferredTimeRange}</td>
                    <td className="p-2">{getStatusBadge(request.status)}</td>
                    <td className="p-2">
                      {request.status === "pending" && !isReadOnly && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setConfirmedDate(request.desiredDate);
                              setIsConfirmDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectBooking(request.id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Booking Request</DialogTitle>
            <DialogDescription>
              Set the duration and time for this flexible booking
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium">{selectedRequest.customerName}</h4>
                <p className="text-sm text-gray-600">
                  {selectedRequest.serviceName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRequest.serviceDescription}
                </p>
                {selectedRequest.location && (
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedRequest.location}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="confirmed-date">Confirmed Date</Label>
                  <Input
                    id="confirmed-date"
                    type="date"
                    value={confirmedDate}
                    onChange={(e) => setConfirmedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmed-time">Start Time</Label>
                  <Input
                    id="confirmed-time"
                    type="time"
                    value={confirmedStartTime}
                    onChange={(e) => setConfirmedStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Select
                  value={estimatedDuration.toString()}
                  onValueChange={(value) =>
                    setEstimatedDuration(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
