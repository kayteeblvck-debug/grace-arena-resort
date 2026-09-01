package com.gracearena.resort.booking;

/** How many units of one room type are already taken over a date range. */
public record RoomOccupancy(Long roomId, long bookedUnits) {
}
