package com.gracearena.resort.booking;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookingRequest(
		@NotNull(message = "is required") Long roomId,
		@NotBlank(message = "is required") String guestName,
		@NotBlank(message = "is required") @Email(message = "must be a valid email") String guestEmail,
		String guestPhone,
		@NotNull(message = "is required") @Future(message = "must be a future date") LocalDate checkIn,
		@NotNull(message = "is required") @Future(message = "must be a future date") LocalDate checkOut,
		@Min(value = 1, message = "must be at least 1") int guests) {
}
