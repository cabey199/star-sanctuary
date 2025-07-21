import { RequestHandler } from "express";
import { Booking, BookingRequest, BookingResponse } from "@shared/types";

// In production, these would be stored in Airtable/Supabase
let bookings: Booking[] = [
  {
    id: "1",
    businessId: "1",
    serviceId: "1",
    providerId: "1",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    customerPhone: "(555) 234-5678",
    date: "2024-01-20",
    startTime: "10:00",
    endTime: "10:45",
    status: "confirmed",
    notes: "First time customer",
    totalAmount: 1400,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "2",
    businessId: "2",
    serviceId: "2",
    providerId: "2",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    customerPhone: "(555) 345-6789",
    date: "2024-01-21",
    startTime: "14:00",
    endTime: "16:00",
    status: "confirmed",
    totalAmount: 2200,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
];

// GET /api/bookings - Get all bookings (admin only)
export const getAllBookings: RequestHandler = (req, res) => {
  res.json({ bookings, success: true });
};

// GET /api/bookings/business/:businessId - Get bookings for specific business
export const getBookingsByBusiness: RequestHandler = (req, res) => {
  const { businessId } = req.params;
  const businessBookings = bookings.filter(
    (booking) => booking.businessId === businessId,
  );

  res.json({ bookings: businessBookings, success: true });
};

// POST /api/bookings - Create new booking
export const createBooking: RequestHandler = (req, res) => {
  const bookingData: BookingRequest = req.body;

  const {
    businessId,
    serviceId,
    providerId,
    customerName,
    customerEmail,
    customerPhone,
    date,
    startTime,
    notes,
  } = bookingData;

  // Validate required fields
  if (
    !businessId ||
    !serviceId ||
    !providerId ||
    !customerName ||
    !customerEmail ||
    !customerPhone ||
    !date ||
    !startTime
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required booking information",
    });
  }

  // Calculate end time (assuming 45 minutes for now)
  const [hours, minutes] = startTime.split(":").map(Number);
  const endTime = `${String(hours + 1).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  const newBooking: Booking = {
    id: Date.now().toString(),
    businessId,
    serviceId,
    providerId,
    customerName,
    customerEmail,
    customerPhone,
    date,
    startTime,
    endTime,
    status: "confirmed",
    notes: notes || "",
    totalAmount: 0, // Will be calculated based on service
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  bookings.push(newBooking);

  // In production, this would trigger:
  // 1. Save to Airtable/Supabase
  // 2. Send email notifications via Zapier webhook or email service

  console.log(`📧 EMAIL NOTIFICATIONS SENT FOR BOOKING ${newBooking.id}:`);
  console.log(`1. Customer (${customerEmail}): Booking confirmation`);
  console.log(`2. Business Owner: New booking alert`);
  console.log(`3. Platform Admin: New booking notification`);

  // Simulate email notification payload (for Zapier integration)
  const emailNotifications = {
    customer: {
      to: customerEmail,
      subject: `Booking Confirmed - ${businessId}`,
      template: "customer_confirmation",
      data: {
        customerName,
        businessName: businessId, // Would be actual business name
        service: serviceId, // Would be actual service name
        provider: providerId, // Would be actual provider name
        date,
        startTime,
        totalAmount: newBooking.totalAmount,
      },
    },
    businessOwner: {
      to: "business@example.com", // Would be actual business email
      subject: `New Booking Received`,
      template: "business_notification",
      data: {
        customerName,
        customerEmail,
        customerPhone,
        service: serviceId,
        provider: providerId,
        date,
        startTime,
        notes: notes || "No special requests",
      },
    },
    platformAdmin: {
      to: "admin@bookingwithcal.com",
      subject: `New Booking on Platform`,
      template: "admin_notification",
      data: {
        businessId,
        customerName,
        customerEmail,
        totalAmount: newBooking.totalAmount,
        date,
        startTime,
      },
    },
  };

  console.log("Email notification data prepared:", emailNotifications);

  const response: BookingResponse = {
    booking: newBooking,
    success: true,
    message: "Booking created successfully",
  };

  res.status(201).json(response);
};

// PUT /api/bookings/:id/status - Update booking status
export const updateBookingStatus: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["confirmed", "pending", "cancelled", "completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking status",
    });
  }

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status: status as Booking["status"],
    updatedAt: new Date(),
  };

  res.json({
    booking: bookings[bookingIndex],
    success: true,
    message: "Booking status updated",
  });
};

// DELETE /api/bookings/:id - Delete booking
export const deleteBooking: RequestHandler = (req, res) => {
  const { id } = req.params;

  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  bookings.splice(bookingIndex, 1);

  res.json({
    success: true,
    message: "Booking deleted successfully",
  });
};
