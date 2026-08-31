package com.gracearena.resort.room;

import java.math.BigDecimal;

public record RoomResponse(
		Long id,
		String slug,
		String name,
		String description,
		BigDecimal pricePerNight,
		int capacity,
		String imageUrl,
		boolean available) {

	public static RoomResponse from(Room room) {
		return new RoomResponse(
				room.getId(),
				room.getSlug(),
				room.getName(),
				room.getDescription(),
				room.getPricePerNight(),
				room.getCapacity(),
				room.getImageUrl(),
				room.isAvailable());
	}
}
