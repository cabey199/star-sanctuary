import { RequestHandler } from "express";
import { Business, CreateBusinessResponse } from "@shared/types";

// In production, these would be stored in Airtable/Supabase
let businesses: Business[] = [
  {
    id: "1",
    name: "Barber Zone",
    slug: "barber-zone",
    description: "Premium barbershop services",
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
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Ink Masters Tattoo",
    slug: "ink-masters",
    description: "Custom tattoo artistry",
    email: "studio@inkmasters.com",
    phone: "+251922987654",
    address: "Kazanchis Business District",
    city: "Addis Ababa",
    region: "Addis Ababa",
    businessType: "Tattoo Studio",
    businessHours: {
      monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      saturday: { isOpen: true, openTime: "09:00", closeTime: "17:00" },
      sunday: { isOpen: true, openTime: "12:00", closeTime: "20:00" },
    },
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

// GET /api/businesses - Get all businesses
export const getAllBusinesses: RequestHandler = (req, res) => {
  res.json({ businesses, success: true });
};

// GET /api/businesses/:slug - Get business by slug
export const getBusinessBySlug: RequestHandler = (req, res) => {
  const { slug } = req.params;
  const business = businesses.find((b) => b.slug === slug);

  if (!business) {
    return res.status(404).json({
      success: false,
      message: "Business not found",
    });
  }

  res.json({ business, success: true });
};

// POST /api/businesses - Create new business
export const createBusiness: RequestHandler = (req, res) => {
  const { name, description, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required",
    });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Check if slug already exists
  if (businesses.find((b) => b.slug === slug)) {
    return res.status(400).json({
      success: false,
      message: "Business name already exists",
    });
  }

  const newBusiness: Business = {
    id: Date.now().toString(),
    name,
    slug,
    description: description || "",
    email,
    phone: phone || "",
    address: address || "",
    city: "",
    region: "",
    businessType: "Other",
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

  businesses.push(newBusiness);

  // In production, this would trigger:
  // 1. Save to Airtable/Supabase
  // 2. Send welcome email via Zapier webhook

  const response: CreateBusinessResponse = {
    business: newBusiness,
    success: true,
    message: "Business created successfully",
  };

  res.status(201).json(response);
};

// PUT /api/businesses/:id - Update business
export const updateBusiness: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { name, description, email, phone, address } = req.body;

  const businessIndex = businesses.findIndex((b) => b.id === id);

  if (businessIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Business not found",
    });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  businesses[businessIndex] = {
    ...businesses[businessIndex],
    name: name || businesses[businessIndex].name,
    slug,
    description: description || businesses[businessIndex].description,
    email: email || businesses[businessIndex].email,
    phone: phone || businesses[businessIndex].phone,
    address: address || businesses[businessIndex].address,
    updatedAt: new Date(),
  };

  res.json({
    business: businesses[businessIndex],
    success: true,
    message: "Business updated successfully",
  });
};

// DELETE /api/businesses/:id - Delete business
export const deleteBusiness: RequestHandler = (req, res) => {
  const { id } = req.params;

  const businessIndex = businesses.findIndex((b) => b.id === id);

  if (businessIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Business not found",
    });
  }

  businesses.splice(businessIndex, 1);

  res.json({
    success: true,
    message: "Business deleted successfully",
  });
};
