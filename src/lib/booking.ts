// Client-Typen + Fetch fuer die oeffentliche Buchung (Etappe 8). Spiegel von
// server/booking-routes.ts. Keine Personenbezuege in der Verfuegbarkeit.
// Preise duerfen seit dem Beschluss 2026-07-21 im Buchungsschritt gezeigt werden
// (nicht auf der Kurs-Karte — die bleibt preislos).

import { api } from './api';

export type CourseAvailability = {
  courseId: string;
  bookingType: 'leader_follower' | 'open';
  bookable: boolean;
  freeLeader: number;
  freeFollower: number;
  freeOpen: number;
  capacity: number;
  free: number;
  tariffs: { key: string; nameDe: string; nameEn: string; seats: number; amountChf: string | null }[];
};

export type BookingPerson = { firstName: string; lastName: string; email: string; phone?: string };

export type CreateBookingInput = {
  courseId: string;
  role: 'leader' | 'follower' | null;
  mode: 'solo' | 'couple';
  participant: BookingPerson;
  partner?: BookingPerson | null;
  tariffKey?: string;
  needsAushilfe?: boolean;
  language?: 'de' | 'en';
  notes?: string;
};

export type CreateBookingResult = {
  bookingId: string;
  status: 'waitlisted' | 'confirmed';
  role: 'leader' | 'follower' | null;
  mode: 'solo' | 'couple';
  waitlistPosition: number | null;
  amountChf: string;
};

export function fetchAvailability(courseId: string): Promise<CourseAvailability> {
  return api.get<CourseAvailability>(`/api/public/courses/${courseId}/availability`);
}

export function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  return api.post<CreateBookingResult>('/api/public/bookings', input);
}
