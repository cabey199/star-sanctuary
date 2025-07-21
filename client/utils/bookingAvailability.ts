import {
  Business,
  Service,
  Provider,
  Booking,
  TimeBlock,
  BusinessHours,
} from "../../shared/types";

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  reason?: string; // Why it's not available
}

export interface AvailabilityOptions {
  business: Business;
  service: Service;
  provider: Provider;
  date: string; // YYYY-MM-DD
  existingBookings: Booking[];
  timeBlocks: TimeBlock[];
}

/**
 * Calculate available time slots for a specific service, provider, and date
 * Considers:
 * - Business hours
 * - Existing bookings
 * - Service duration
 * - Time blocks (day off, breaks, etc.)
 * - Buffer time between appointments
 */
export function calculateAvailableTimeSlots(
  options: AvailabilityOptions,
): TimeSlot[] {
  const { business, service, provider, date, existingBookings, timeBlocks } =
    options;

  const slots: TimeSlot[] = [];
  const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
    weekday: "lowercase",
  }) as keyof BusinessHours;
  const businessHours = business.businessHours[dayOfWeek];

  // If business is closed on this day
  if (
    !businessHours.isOpen ||
    !businessHours.openTime ||
    !businessHours.closeTime
  ) {
    return slots;
  }

  // Check if provider works on this day
  if (!provider.workingDays.includes(dayOfWeek)) {
    return slots;
  }

  // Get effective working hours (intersection of business and provider hours)
  const startTime = getLatestTime(
    businessHours.openTime,
    provider.workingHours.start,
  );
  const endTime = getEarliestTime(
    businessHours.closeTime,
    provider.workingHours.end,
  );

  // Generate time slots every 15 minutes
  const slotInterval = 15; // minutes
  const serviceDuration = service.duration;
  const bufferTime = 5; // 5-minute buffer between appointments

  let currentTime = parseTime(startTime);
  const endTimeMinutes = parseTime(endTime);

  while (currentTime + serviceDuration <= endTimeMinutes) {
    const slotTime = formatTime(currentTime);
    const slotEndTime = formatTime(currentTime + serviceDuration);

    const isAvailable = isTimeSlotAvailable({
      startTime: slotTime,
      endTime: slotEndTime,
      date,
      providerId: provider.id,
      businessId: business.id,
      existingBookings,
      timeBlocks,
      businessHours,
      bufferTime,
    });

    slots.push({
      time: slotTime,
      available: isAvailable.available,
      reason: isAvailable.reason,
    });

    currentTime += slotInterval;
  }

  return slots;
}

interface SlotAvailabilityCheck {
  startTime: string;
  endTime: string;
  date: string;
  providerId: string;
  businessId: string;
  existingBookings: Booking[];
  timeBlocks: TimeBlock[];
  businessHours: any;
  bufferTime: number;
}

function isTimeSlotAvailable(check: SlotAvailabilityCheck): {
  available: boolean;
  reason?: string;
} {
  const {
    startTime,
    endTime,
    date,
    providerId,
    businessId,
    existingBookings,
    timeBlocks,
    businessHours,
    bufferTime,
  } = check;

  // Check business lunch break
  if (businessHours.breakStart && businessHours.breakEnd) {
    if (
      timeOverlaps(
        startTime,
        endTime,
        businessHours.breakStart,
        businessHours.breakEnd,
      )
    ) {
      return { available: false, reason: "Lunch break" };
    }
  }

  // Check time blocks (day off, maintenance, etc.)
  for (const block of timeBlocks) {
    if (
      block.date === date &&
      (block.businessId === businessId || block.providerId === providerId) &&
      timeOverlaps(startTime, endTime, block.startTime, block.endTime)
    ) {
      return { available: false, reason: block.reason };
    }
  }

  // Check existing bookings with buffer time
  for (const booking of existingBookings) {
    if (
      booking.date === date &&
      booking.providerId === providerId &&
      booking.status !== "cancelled"
    ) {
      // Add buffer time before and after existing booking
      const bookingStartWithBuffer = formatTime(
        parseTime(booking.startTime) - bufferTime,
      );
      const bookingEndWithBuffer = formatTime(
        parseTime(booking.endTime) + bufferTime,
      );

      if (
        timeOverlaps(
          startTime,
          endTime,
          bookingStartWithBuffer,
          bookingEndWithBuffer,
        )
      ) {
        return { available: false, reason: "Already booked" };
      }
    }
  }

  // Check if it's in the past
  const now = new Date();
  const slotDateTime = new Date(`${date}T${startTime}`);

  if (slotDateTime <= now) {
    return { available: false, reason: "Past time" };
  }

  return { available: true };
}

/**
 * Check if two time ranges overlap
 */
function timeOverlaps(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const start1Minutes = parseTime(start1);
  const end1Minutes = parseTime(end1);
  const start2Minutes = parseTime(start2);
  const end2Minutes = parseTime(end2);

  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to time string (HH:MM)
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Get the latest of two times
 */
function getLatestTime(time1: string, time2: string): string {
  return parseTime(time1) > parseTime(time2) ? time1 : time2;
}

/**
 * Get the earliest of two times
 */
function getEarliestTime(time1: string, time2: string): string {
  return parseTime(time1) < parseTime(time2) ? time1 : time2;
}

/**
 * Real-time availability update after booking
 */
export function updateAvailabilityAfterBooking(
  existingSlots: TimeSlot[],
  newBooking: Booking,
  service: Service,
): TimeSlot[] {
  const bookingStart = parseTime(newBooking.startTime);
  const bookingEnd = parseTime(newBooking.endTime);
  const bufferTime = 5; // 5-minute buffer

  return existingSlots.map((slot) => {
    const slotTime = parseTime(slot.time);
    const slotEndTime = slotTime + service.duration;

    // Check if this slot conflicts with the new booking (including buffer)
    const conflictStart = bookingStart - bufferTime;
    const conflictEnd = bookingEnd + bufferTime;

    if (slotTime < conflictEnd && slotEndTime > conflictStart) {
      return {
        ...slot,
        available: false,
        reason: "Recently booked",
      };
    }

    return slot;
  });
}

/**
 * Get next available time slot for a service
 */
export function getNextAvailableSlot(
  business: Business,
  service: Service,
  provider: Provider,
  existingBookings: Booking[],
  timeBlocks: TimeBlock[],
  startDate?: string,
): { date: string; time: string } | null {
  const searchDate = startDate ? new Date(startDate) : new Date();
  const maxDaysToSearch = 30;

  for (let i = 0; i < maxDaysToSearch; i++) {
    const currentDate = new Date(searchDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate.toISOString().split("T")[0];

    const slots = calculateAvailableTimeSlots({
      business,
      service,
      provider,
      date: dateString,
      existingBookings,
      timeBlocks,
    });

    const firstAvailableSlot = slots.find((slot) => slot.available);

    if (firstAvailableSlot) {
      return {
        date: dateString,
        time: firstAvailableSlot.time,
      };
    }
  }

  return null; // No availability found in the next 30 days
}

/**
 * Validate if a proposed booking time is available
 */
export function validateBookingTime(options: {
  business: Business;
  service: Service;
  provider: Provider;
  date: string;
  startTime: string;
  existingBookings: Booking[];
  timeBlocks: TimeBlock[];
}): { valid: boolean; reason?: string } {
  const {
    business,
    service,
    provider,
    date,
    startTime,
    existingBookings,
    timeBlocks,
  } = options;

  const endTime = formatTime(parseTime(startTime) + service.duration);

  const slots = calculateAvailableTimeSlots({
    business,
    service,
    provider,
    date,
    existingBookings,
    timeBlocks,
  });

  const requestedSlot = slots.find((slot) => slot.time === startTime);

  if (!requestedSlot) {
    return { valid: false, reason: "Time slot not found" };
  }

  if (!requestedSlot.available) {
    return {
      valid: false,
      reason: requestedSlot.reason || "Time not available",
    };
  }

  return { valid: true };
}
