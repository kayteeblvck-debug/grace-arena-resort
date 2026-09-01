package com.gracearena.resort.room;

import java.math.BigDecimal;
import java.util.List;

public record RoomResponse(
		Long id,
		String slug,
		String name,
		String tagline,
		String description,
		String longDescription,
		BigDecimal pricePerNight,
		int capacity,
		String bedType,
		Integer sizeSqm,
		String outlook,
		String imageUrl,
		List<String> gallery,
		List<String> amenities,
		int totalUnits,
		boolean available,
		boolean featured) {

	public static RoomResponse from(Room room) {
		return new RoomResponse(
				room.getId(),
				room.getSlug(),
				room.getName(),
				room.getTagline(),
				room.getDescription(),
				room.getLongDescription(),
				room.getPricePerNight(),
				room.getCapacity(),
				room.getBedType(),
				room.getSizeSqm(),
				room.getOutlook(),
				room.getImageUrl(),
				List.copyOf(room.getGallery()),
				List.copyOf(room.getAmenities()),
				room.getTotalUnits(),
				room.isAvailable(),
				room.isFeatured());
	}
}
