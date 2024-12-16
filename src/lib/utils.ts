import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFlightLikeId(): string {
  const prefix = 'HT'; // HT por HotuMaTur
  const number = Math.floor(1000 + Math.random() * 9000); // Número entre 1000 y 9999
  return `${prefix}${number}`;
}
