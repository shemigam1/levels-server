import { parse } from "path";

export function parseBookingDate(dateInput: string): Date | null {
  try {
    // Handle ISO strings or other formats
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return null;
    }

    // Normalize to start of day in local timezone
    date.setHours(0, 0, 0, 0);
    return date;
  } catch (error) {
    return null;
  }
}

export function formatDateString(input: string): string {
  const date = parseBookingDate(input);
  if (!date) {
    throw new Error("Invalid date format");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// not needed anymore thanks to Zod validation
//   export function isDateInPast(date: string): boolean {
//   const dateString = parseBookingDate(date);
//   if (!dateString) return true;
//   const today = getToday();
//   return dateString < today;
// }
