package com.gracearena.resort.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(
		Long id,
		String reference,
		Long roomId,
		String roomName,
		String guestName,
		String guestEmail,
		String guestPhone,
		LocalDate checkIn,
		LocalDate checkOut,
		int nights,
		int guests,
		BigDecimal totalPrice,
		BookingStatus status,
		Instant createdAt) {
}
