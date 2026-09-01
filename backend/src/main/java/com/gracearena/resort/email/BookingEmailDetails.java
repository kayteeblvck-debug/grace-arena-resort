package com.gracearena.resort.email;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Flat view of a booking for the mailer, so the email package does not depend on
 * the booking package.
 */
public record BookingEmailDetails(
		String reference,
		String guestName,
		String guestEmail,
		String guestPhone,
		String roomName,
		LocalDate checkIn,
		LocalDate checkOut,
		int nights,
		int guests,
		BigDecimal totalAmount,
		String specialRequests) {
}
