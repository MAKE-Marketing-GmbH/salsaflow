// Client-Typ + Fetch fuer den STATUS einer Buchung. Kein Personenbezug nach aussen; die
// Buchungs-ID ist der Zugriffsschluessel.
//
// `startCheckout()` (POST auf /api/public/bookings/:id/checkout) stand hier bis 2026-08-07 und
// war der einzige Weg, von der Website aus eine Zahlung zu starten. Nach dem Entfernen des
// /buchung/zahlen-Pfads hatte sie keinen Aufrufer mehr; sie ist geloescht statt liegengelassen,
// damit die Vorgabe "KEIN Payment im User-Flow" nicht an einem verfuegbaren Export haengt.
// Der Server-Endpunkt bleibt unangetastet (Admin/Backoffice).

import { api } from './api';

export type BookingPaymentStatus = {
  bookingStatus: string;
  paymentStatus: string | null;
  amountChf: string | null;
  method: string | null;
};

export function fetchBookingStatus(bookingId: string): Promise<BookingPaymentStatus> {
  return api.get<BookingPaymentStatus>(`/api/public/bookings/${bookingId}/status`);
}
