import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getAllBusinesses,
  getBusinessBySlug,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "./routes/businesses";
import {
  getAllBookings,
  getBookingsByBusiness,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from "./routes/bookings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from BookingWithCal server!" });
  });

  app.get("/api/demo", handleDemo);

  // Business management routes
  app.get("/api/businesses", getAllBusinesses);
  app.get("/api/businesses/:slug", getBusinessBySlug);
  app.post("/api/businesses", createBusiness);
  app.put("/api/businesses/:id", updateBusiness);
  app.delete("/api/businesses/:id", deleteBusiness);

  // Booking management routes
  app.get("/api/bookings", getAllBookings);
  app.get("/api/bookings/business/:businessId", getBookingsByBusiness);
  app.post("/api/bookings", createBooking);
  app.put("/api/bookings/:id/status", updateBookingStatus);
  app.delete("/api/bookings/:id", deleteBooking);

  return app;
}
