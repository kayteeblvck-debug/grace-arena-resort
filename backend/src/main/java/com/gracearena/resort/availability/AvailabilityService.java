package com.gracearena.resort.availability;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gracearena.resort.booking.BookingRepository;
import com.gracearena.resort.booking.BookingStatus;
import com.gracearena.resort.booking.RoomOccupancy;
import com.gracearena.resort.common.BadRequestException;
import com.gracearena.resort.room.Room;
import com.gracearena.resort.room.RoomResponse;
import com.gracearena.resort.room.RoomService;

/**
 * Answers "what can I actually book on these dates" in one query per search, rather
 * than one per room.
 */
@Service
@Transactional(readOnly = true)
public class AvailabilityService {

	private static final int MAX_NIGHTS = 30;

	private final RoomService roomService;
	private final BookingRepository bookingRepository;

	public AvailabilityService(RoomService roomService, BookingRepository bookingRepository) {
		this.roomService = roomService;
		this.bookingRepository = bookingRepository;
	}

	public List<RoomAvailability> search(LocalDate checkIn, LocalDate checkOut, int guests) {
		validate(checkIn, checkOut);

		int nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);

		Map<Long, Long> booked = bookingRepository
				.countOverlappingByRoom(checkIn, checkOut, BookingStatus.RELEASES_ROOM).stream()
				.collect(Collectors.toMap(RoomOccupancy::roomId, RoomOccupancy::bookedUnits));

		return roomService.rooms(true).stream()
				.map(room -> describe(room, booked.getOrDefault(room.getId(), 0L), guests, nights))
				.toList();
	}

	private RoomAvailability describe(Room room, long bookedUnits, int guests, int nights) {
		int unitsLeft = Math.max(0, room.getTotalUnits() - (int) bookedUnits);

		String reason = null;
		if (unitsLeft == 0) {
			reason = "Fully booked for these dates";
		} else if (guests > room.getCapacity()) {
			reason = "Sleeps up to " + room.getCapacity()
					+ (room.getCapacity() == 1 ? " guest" : " guests");
		}

		return new RoomAvailability(
				RoomResponse.from(room),
				unitsLeft,
				reason == null,
				reason,
				nights,
				room.getPricePerNight().multiply(BigDecimal.valueOf(nights)));
	}

	private void validate(LocalDate checkIn, LocalDate checkOut) {
		if (checkIn.isBefore(LocalDate.now())) {
			throw new BadRequestException("The arrival date cannot be in the past.");
		}
		if (!checkOut.isAfter(checkIn)) {
			throw new BadRequestException("The departure date must be after the arrival date.");
		}
		if (ChronoUnit.DAYS.between(checkIn, checkOut) > MAX_NIGHTS) {
			throw new BadRequestException(
					"Please search a stay of " + MAX_NIGHTS + " nights or fewer, or contact our reservations desk.");
		}
	}
}
