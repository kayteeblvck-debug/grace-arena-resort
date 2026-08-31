package com.gracearena.resort.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gracearena.resort.common.BadRequestException;
import com.gracearena.resort.common.ResourceNotFoundException;
import com.gracearena.resort.room.Room;
import com.gracearena.resort.room.RoomService;

@Service
@Transactional(readOnly = true)
public class BookingService {

	private final BookingRepository bookingRepository;
	private final RoomService roomService;

	public BookingService(BookingRepository bookingRepository, RoomService roomService) {
		this.bookingRepository = bookingRepository;
		this.roomService = roomService;
	}

	@Transactional
	public BookingResponse create(BookingRequest request) {
		Room room = roomService.requireById(request.roomId());

		if (!room.isAvailable()) {
			throw new BadRequestException("Room '" + room.getName() + "' is not currently available");
		}
		if (!request.checkOut().isAfter(request.checkIn())) {
			throw new BadRequestException("checkOut must be after checkIn");
		}
		if (request.guests() > room.getCapacity()) {
			throw new BadRequestException(
					"Room '" + room.getName() + "' sleeps a maximum of " + room.getCapacity() + " guests");
		}

		Booking booking = Booking.builder()
				.reference(generateReference())
				.roomId(room.getId())
				.guestName(request.guestName())
				.guestEmail(request.guestEmail())
				.guestPhone(request.guestPhone())
				.checkIn(request.checkIn())
				.checkOut(request.checkOut())
				.guests(request.guests())
				.status(BookingStatus.PENDING)
				.createdAt(Instant.now())
				.build();

		return toResponse(bookingRepository.save(booking), room);
	}

	public List<BookingResponse> listAll() {
		return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(booking -> toResponse(booking, roomService.requireById(booking.getRoomId())))
				.toList();
	}

	public BookingResponse getByReference(String reference) {
		Booking booking = bookingRepository.findByReference(reference)
				.orElseThrow(() -> new ResourceNotFoundException("No booking found with reference " + reference));
		return toResponse(booking, roomService.requireById(booking.getRoomId()));
	}

	private BookingResponse toResponse(Booking booking, Room room) {
		int nights = (int) ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
		BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

		return new BookingResponse(
				booking.getId(),
				booking.getReference(),
				room.getId(),
				room.getName(),
				booking.getGuestName(),
				booking.getGuestEmail(),
				booking.getGuestPhone(),
				booking.getCheckIn(),
				booking.getCheckOut(),
				nights,
				booking.getGuests(),
				totalPrice,
				booking.getStatus(),
				booking.getCreatedAt());
	}

	private String generateReference() {
		return "GAR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
	}
}
