package com.gracearena.resort.availability;

import java.math.BigDecimal;

import com.gracearena.resort.room.RoomResponse;

/**
 * A room priced and checked against one specific date range. {@code bookable} is
 * false when the type is sold out for those nights or too small for the party;
 * {@code reason} says which, so the UI can explain rather than just hide the room.
 */
public record RoomAvailability(
		RoomResponse room,
		int unitsLeft,
		boolean bookable,
		String reason,
		int nights,
		BigDecimal totalAmount) {
}
