import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DateTime } from 'luxon'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15);
}

export function formatDate(date: Date, format: 'full' | 'time' | 'datetime' = 'full'): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  };

  if (format === 'time') {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  if (format === 'datetime') {
    return new Intl.DateTimeFormat('en-GB', {
      ...options,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  return new Intl.DateTimeFormat('en-GB', options).format(date);
}


export function getLocalTime(timezone: number, format: "time" | "date" | "datetime" | "dateMonthYear" | "full" = "full") {
  const now = DateTime.utc().plus({ seconds: timezone });
  const formatMap: Record<string, string> = {
    time: "hh:mm a",
    date: "EEEE, d MMM yy",
    dateMonthYear: "d MMM yy",
    datetime: "EEEE, d MMM yy, hh:mm a",
    full: "EEEE, d MMM yy, hh:mm:ss a 'UTC'Z"
  };
  const selectedFormat = formatMap[format] || formatMap["datetime"];
  const formattedDate = now.toFormat(selectedFormat);
  return formattedDate;
}

export function getLocalTimeFromUTC(utcTimestamp: number, timezoneOffset: number, format: 'time' | 'datetime' = 'datetime'): string {
  // Check if the timestamp is valid
  if (isNaN(utcTimestamp) || utcTimestamp <= 0) {
    return 'Invalid Date';
  }

  // Create a Luxon DateTime object from the UTC timestamp
  const dateTime = DateTime.fromSeconds(utcTimestamp).setZone(`UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset / 3600}`);

  // Check if the DateTime is valid
  if (!dateTime.isValid) {
    return 'Invalid Date';
  }

  // Define the format options
  const formatMap: Record<string, string> = {
    time: "hh:mm a",
    datetime: "EEEE, d MMM yy, hh:mm a"
  };

  // Get the selected format
  const selectedFormat = formatMap[format] || formatMap['datetime'];

  // Return the formatted date
  return dateTime.toFormat(selectedFormat);
}