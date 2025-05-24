import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date using the specified format string
 * Format codes:
 * - yyyy: full year (e.g., 2023)
 * - MM: month number with leading zero (01-12)
 * - dd: day of the month with leading zero (01-31)
 * - HH: hours in 24-hour format with leading zero (00-23)
 * - mm: minutes with leading zero (00-59)
 * - ss: seconds with leading zero (00-59)
 */
export function formatDate(date: Date, format: string = 'dd/MM/yyyy'): string {
  try {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return format
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}
