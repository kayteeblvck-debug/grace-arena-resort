package com.gracearena.resort.booking;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * The guest's name, email and phone default to the signed-in account, so they are
 * only sent when the stay is being booked on someone else's behalf.
 */
public record BookingRequest(
		@NotNull(message = "is required") Long roomId,
		@NotNull(message = "is required") @FutureOrPresent(message = "cannot be in the past") LocalDate checkIn,
		@NotNull(message = "is required") @Future(message = "must be a future date") LocalDate checkOut,
		@Min(value = 1, message = "must be at least 1") @Max(value = 20,
				message = "is more than one room takes — please contact us") int guests,
		@Size(max = 100) String guestName,
		@Size(max = 30) String guestPhone,
		@Size(max = 1000, message = "must be under 1000 characters") String specialRequests) {
}
