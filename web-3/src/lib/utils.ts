import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArray(v: string | string[] | undefined): string[] {
  if (!v) {
    return [];
  }
  return Array.isArray(v) ? v : [v];
}
