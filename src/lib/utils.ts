import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

let counter = 0;

export function generateFlightLikeId(): string {
  const prefix = 'HT';
  const timestamp = Date.now().toString().slice(-4);
  counter = (counter + 1) % 10000;
  const sequence = counter.toString().padStart(4, '0');
  return `${prefix}${timestamp}${sequence}`;
}
