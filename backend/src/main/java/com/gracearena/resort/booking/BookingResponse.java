package com.gracearena.resort.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.gracearena.resort.room.Room;

public record BookingResponse(
		Long id,
		String reference,
		Long roomId,
		String roomSlug,
		String roomName,
		String roomImageUrl,
		String guestName,
		String guestEmail,
		String guestPhone,
		LocalDate checkIn,
		LocalDate checkOut,
		int nights,
		int guests,
		String specialRequests,
		BigDecimal pricePerNight,
		BigDecimal totalAmount,
		BookingStatus status,
		boolean cancellable,
		Instant createdAt) {

	public static BookingResponse of(Booking booking, Room room) {
		return new BookingResponse(
				booking.getId(),
				booking.getReference(),
				room.getId(),
				room.getSlug(),
				room.getName(),
				room.getImageUrl(),
				booking.getGuestName(),
				booking.getGuestEmail(),
				booking.getGuestPhone(),
				booking.getCheckIn(),
				booking.getCheckOut(),
				booking.nights(),
				booking.getGuests(),
				booking.getSpecialRequests(),
				booking.getPricePerNight(),
				booking.getTotalAmount(),
				booking.getStatus(),
				isCancellable(booking),
				booking.getCreatedAt());
	}

	/** A stay can be called off any time before the arrival date. */
	private static boolean isCancellable(Booking booking) {
		return (booking.getStatus() == BookingStatus.PENDING || booking.getStatus() == BookingStatus.CONFIRMED)
				&& booking.getCheckIn().isAfter(LocalDate.now());
	}
}
