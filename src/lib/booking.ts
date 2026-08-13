// Client-Typen + Fetch fuer die Reservierung unter /buchung.
//
// Beschluss 13.08.2026: Die Website verkauft nicht. Sie nimmt eine Reservierung entgegen.
// Darum gibt es hier keine Preise, keine Tarife und keine Platzzahlen mehr. Eine Reservierung
// erzeugt eine Mail an das Studio; bezahlt wird vor Ort. Spiegel von server/reservation-routes.ts.

import { api } from './api';

export type CourseAvailability = {
  courseId: string;
  mode: 'reservation';
  /** Reservieren geht immer — auch bei vollem Kurs, dann als Warteliste. */
  bookable: boolean;
  full: boolean;
  status: string;
};

export type BookingPerson = { firstName: string; lastName: string; email: string; phone?: string };

export type CreateBookingInput = {
  courseId: string;
  role: 'leader' | 'follower' | null;
  mode: 'solo' | 'couple';
  participant: BookingPerson;
  partner?: BookingPerson | null;
  needsAushilfe?: boolean;
  language?: 'de' | 'en';
  notes?: string;
};

export type CreateBookingResult = {
  ok: boolean;
  status: 'waitlisted' | 'reserved';
  courseId: string;
};

export function fetchAvailability(courseId: string): Promise<CourseAvailability> {
  return api.get<CourseAvailability>(`/api/public/courses/${courseId}/availability`);
}

export function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  return api.post<CreateBookingResult>('/api/public/reservations', input);
}
