import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui-Standard-Helper. Fundament fuer kuenftige UI-Etappen.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
