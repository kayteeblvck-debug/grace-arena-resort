package com.gracearena.resort.booking;

import java.util.EnumSet;
import java.util.Set;

public enum BookingStatus {
	/** Submitted by the guest, waiting on the reservations desk. */
	PENDING,
	CONFIRMED,
	CANCELLED,
	COMPLETED;

	/** Statuses that no longer hold a room, and so are ignored when counting overlaps. */
	public static final Set<BookingStatus> RELEASES_ROOM = EnumSet.of(CANCELLED);
}
