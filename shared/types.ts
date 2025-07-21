// Shared types for the booking platform

// Authentication and User Management
export interface User {
  id: string;
  username: string;
  email: string;
  role: "mother_admin" | "subadmin" | "client";
  permissions: UserPermissions;
  createdBy?: string; // ID of user who created this user
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  language: "en" | "am" | "ar";
  theme: "light" | "dark";
  timezone: string;
}

export interface UserPermissions {
  // Core permissions
  canAddClients: boolean;
  canEditClients: boolean;
  canDeleteClients: boolean;
  canViewAnalytics: boolean;
  canManageEmailTemplates: boolean;
  canManageSettings: boolean;

  // Advanced permissions
  canAddAdmins: boolean;
  canEditAdmins: boolean;
  canViewAllClients: boolean;
  canAccessCalendarSync: boolean;
  canExportData: boolean;
  canManageLegalPages: boolean;
  canAccessPromotionTools: boolean;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}

// Client Dashboard Credentials
export interface ClientCredentials {
  clientId: string;
  username: string;
  hashedPassword: string;
  isActive: boolean;
  permissions: ClientPermissions;
  createdBy: string;
  lastLogin?: Date;
}

export interface ClientPermissions {
  canEditBusinessInfo: boolean;
  canManageServices: boolean;
  canManageStaff: boolean;
  canManageSchedule: boolean;
  canViewAnalytics: boolean;
  canEditBranding: boolean;
  canAccessPromotionTools: boolean;
}

export interface Business {
  id: string;
  name: string;
  slug: string; // URL-friendly version (e.g., "barber-zone")
  description: string;
  email: string; // Business owner email for notifications
  phone?: string;
  address?: string;
  city?: string;
  region?: string; // Ethiopian region
  businessType: string; // e.g., "Barber Shop", "Nail Salon", "Tattoo Studio"
  logo?: string;
  website?: string;
  locationLink?: string; // Google Maps or other location link
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    twitter?: string;
    messenger?: string;
  };
  businessHours: BusinessHours;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // New fields
  createdBy: string; // User ID who created this business
  images: BusinessImage[];
  branding: BusinessBranding;
  emailTemplates: EmailTemplates;
  seoSettings: SEOSettings;
  calendarSync: CalendarSyncSettings;
  reviewsEnabled: boolean;
  publicReviewsEnabled: boolean;
  promotionSettings: PromotionSettings;
}

export interface BusinessImage {
  id: string;
  url: string;
  alt: string;
  type: "logo" | "banner" | "gallery" | "service";
  order: number;
}

export interface BusinessBranding {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS?: string;
}

export interface EmailTemplates {
  bookingConfirmation: EmailTemplate;
  bookingReminder: EmailTemplate;
  bookingCancellation: EmailTemplate;
  flexibleServiceRequest: EmailTemplate;
  flexibleServiceConfirmation: EmailTemplate;
  rescheduleConfirmation: EmailTemplate;
  reviewRequest: EmailTemplate;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  isActive: boolean;
  variables: string[]; // Available template variables
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  customStructuredData?: string;
}

export interface CalendarSyncSettings {
  googleCalendar: {
    enabled: boolean;
    calendarId?: string;
    accessToken?: string;
  };
  outlookCalendar: {
    enabled: boolean;
    calendarId?: string;
    accessToken?: string;
  };
  appleCalendar: {
    enabled: boolean;
    calendarId?: string;
    accessToken?: string;
  };
}

export interface PromotionSettings {
  autoGeneratePosts: boolean;
  defaultCTAMessage: string;
  socialMediaTemplates: SocialMediaTemplate[];
}

export interface SocialMediaTemplate {
  platform:
    | "instagram"
    | "facebook"
    | "twitter"
    | "telegram"
    | "whatsapp"
    | "messenger";
  template: string;
  isActive: boolean;
}

export interface BusinessHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:MM
  closeTime?: string; // HH:MM
  breakStart?: string; // HH:MM
  breakEnd?: string; // HH:MM
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number; // in ETB
  category: string; // e.g., "Haircut", "Styling", "Treatment"
  isActive: boolean;
  requiresDeposit?: boolean;
  depositAmount?: number; // in ETB
  serviceType: "fixed" | "flexible"; // New: fixed duration vs flexible duration
  isOnlineBookable: boolean; // If false, requires manual confirmation
}

export interface Provider {
  id: string;
  businessId: string;
  name: string;
  bio?: string;
  avatar?: string;
  specialties: string[];
  phoneNumber?: string;
  email?: string;
  isActive: boolean;
  workingDays: string[]; // ["monday", "tuesday", "wednesday", etc.]
  workingHours: {
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

export interface TimeSlot {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  isBlocked?: boolean; // For days off
  blockReason?: string; // Holiday, sick day, etc.
}

// Enhanced time blocking for partial day support
export interface TimeBlock {
  id: string;
  businessId: string;
  providerId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  reason: string;
  type: "day_off" | "break" | "appointment" | "maintenance";
  isRecurring: boolean;
  recurringPattern?: {
    frequency: "weekly" | "monthly" | "yearly";
    interval: number;
    endDate?: string;
  };
  createdBy: string;
  createdAt: Date;
}

export interface DayOff {
  id: string;
  businessId: string;
  providerId?: string; // If null, applies to entire business
  date: string; // YYYY-MM-DD
  reason: string; // Holiday, maintenance, etc.
  isRecurring?: boolean;
  recurringPattern?: "weekly" | "monthly" | "yearly";
  createdAt: Date;
}

export interface Booking {
  id: string;
  businessId: string;
  serviceId: string;
  providerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status:
    | "confirmed"
    | "pending"
    | "cancelled"
    | "completed"
    | "no-show"
    | "to_be_confirmed";
  notes?: string;
  totalAmount: number; // in ETB
  depositPaid?: number; // in ETB
  reminderSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
  // New fields
  createdBy: string; // User ID who manages this client
  rescheduleToken?: string;
  location?: string; // For flexible services
  estimatedDuration?: number; // For flexible services
  review?: BookingReview;
  exportFormats?: ("csv" | "pdf" | "img")[];
}

// Review System
export interface BookingReview {
  id: string;
  bookingId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  isPublic: boolean;
  reviewerName: string;
  createdAt: Date;
  approved: boolean;
}

export interface PublicReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  serviceName: string;
  createdAt: Date;
}

export interface BookingRequest {
  businessId: string;
  serviceId: string;
  providerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime?: string;
  notes?: string;
}

// API Response types
export interface CreateBusinessResponse {
  business: Business;
  success: boolean;
  message: string;
}

export interface BookingResponse {
  booking: Booking;
  success: boolean;
  message: string;
}

export interface BusinessDetailsResponse {
  business: Business;
  services: Service[];
  providers: Provider[];
  success: boolean;
}

// Ethiopian specific data
export const ETHIOPIAN_REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "SNNP",
  "Somali",
  "Tigray",
] as const;

export const BUSINESS_TYPES = [
  "Barber Shop",
  "Hair Salon",
  "Nail Salon",
  "Beauty Salon",
  "Tattoo Studio",
  "Spa",
  "Massage Therapy",
  "Dental Clinic",
  "Medical Clinic",
  "Veterinary Clinic",
  "Auto Repair",
  "Restaurant",
  "Fitness Center",
  "Photography Studio",
  "Consulting",
  "Other",
] as const;

export const SERVICE_CATEGORIES = [
  "Haircut & Styling",
  "Hair Treatment",
  "Nail Care",
  "Facial & Skincare",
  "Massage",
  "Tattoo & Piercing",
  "Medical",
  "Consultation",
  "Repair & Maintenance",
  "Other",
] as const;

// Analytics
export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  popularServices: { serviceName: string; count: number; revenue: number }[];
  peakHours: { hour: string; count: number }[];
  monthlyTrends: { month: string; bookings: number; revenue: number }[];
  customerRetention: number;
  averageRating: number;
  totalReviews: number;
  period: {
    start: string;
    end: string;
  };
}

// Contact Us
export interface ContactUsSettings {
  heading: string;
  description: string;
  email: string;
  phone?: string;
  address?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
  customFields: ContactFormField[];
  isActive: boolean;
}

export interface ContactFormField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select";
  required: boolean;
  options?: string[]; // For select fields
  order: number;
}

// Legal Pages
export interface LegalPage {
  id: string;
  type: "privacy_policy" | "terms_of_service" | "contact_us";
  title: string;
  content: string;
  isActive: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

// Multi-language Support
export interface LanguageContent {
  [key: string]: {
    en: string;
    am: string; // Amharic
    ar: string; // Arabic
  };
}

export const SUPPORTED_LANGUAGES = {
  en: "English",
  am: "አማርኛ",
  ar: "العربية",
} as const;

// Export Formats
export interface ExportOptions {
  format: "csv" | "pdf" | "img";
  includeFields: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  customization?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    additionalText?: string;
  };
}

// Rescheduling
export interface RescheduleRequest {
  bookingId: string;
  newDate: string;
  newStartTime: string;
  reason?: string;
  customerEmail: string;
  rescheduleToken: string;
}

// Settings
export interface SystemSettings {
  siteName: string;
  adminEmail: string;
  defaultLanguage: "en" | "am" | "ar";
  defaultTimezone: string;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  securitySettings: {
    sessionTimeout: number; // in minutes
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowPasswordReset: boolean;
  };
  apiKeys: {
    googleMapsApiKey?: string;
    googleCalendarApiKey?: string;
    outlookApiKey?: string;
    appleApiKey?: string;
    socialMediaApiKeys?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}
