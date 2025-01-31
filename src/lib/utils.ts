import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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


export function getLocalTime(timezoneOffset, format = "full") {
  const now = new Date();
  const utcTime = now.getTime(); // Get milliseconds since epoch in UTC

  // Correctly apply the timezone offset (in milliseconds)
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  const options = {
    time: { hour: "2-digit", minute: "2-digit", hour12: true },
    date: { weekday: "long", day: "numeric", month: "short", year: "2-digit" },
    dateMonthYear: { day: "numeric", month: "short", year: "2-digit" },
    full: { weekday: "long", day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }
  };

  let formattedDate = new Intl.DateTimeFormat("en-GB", options[format]).format(localTime);
  if (format === "date" || format === "full") {
    formattedDate = formattedDate.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/, "$1,");
  }

  return formattedDate;
}