package com.gracearena.resort.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gracearena.resort.common.BadRequestException;
import com.gracearena.resort.common.ResourceNotFoundException;
import com.gracearena.resort.email.BookingEmailDetails;
import com.gracearena.resort.email.EmailService;
import com.gracearena.resort.room.Room;
import com.gracearena.resort.room.RoomService;
import com.gracearena.resort.user.Role;
import com.gracearena.resort.user.User;

@Service
@Transactional(readOnly = true)
public class BookingService {

	/** Anything longer is a residency, and goes through the reservations desk. */
	private static final int MAX_NIGHTS = 30;

	/** Guards against typos like 2035 in a date field. */
	private static final int MAX_MONTHS_AHEAD = 18;

	private final BookingRepository bookingRepository;
	private final RoomService roomService;
	private final EmailService emailService;
	private final String frontendUrl;

	public BookingService(BookingRepository bookingRepository, RoomService roomService, EmailService emailService,
			@Value("${app.frontend-url}") String frontendUrl) {
		this.bookingRepository = bookingRepository;
		this.roomService = roomService;
		this.emailService = emailService;
		this.frontendUrl = frontendUrl;
	}

	@Transactional
	public BookingResponse create(User user, BookingRequest request) {
		// Locks the room row first: the overlap count below is only trustworthy if no
		// other transaction can insert a competing booking while we are deciding.
		Room room = roomService.requireByIdForBooking(request.roomId());

		validateStay(room, request);

		long taken = bookingRepository.countOverlapping(room.getId(), request.checkIn(), request.checkOut(),
				BookingStatus.RELEASES_ROOM);
		if (taken >= room.getTotalUnits()) {
			throw new BadRequestException("The %s is fully booked for those dates. Try different dates, or ask us about the other suites."
					.formatted(room.getName()));
		}

		int nights = (int) ChronoUnit.DAYS.between(request.checkIn(), request.checkOut());
		BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

		Booking booking = bookingRepository.save(Booking.builder()
				.reference(generateReference())
				.roomId(room.getId())
				.userId(user.getId())
				.guestName(orDefault(request.guestName(), user.fullName()))
				.guestEmail(user.getEmail())
				.guestPhone(orDefault(request.guestPhone(), user.getPhone()))
				.checkIn(request.checkIn())
				.checkOut(request.checkOut())
				.guests(request.guests())
				.specialRequests(blankToNull(request.specialRequests()))
				.pricePerNight(room.getPricePerNight())
				.totalAmount(total)
				.status(BookingStatus.PENDING)
				.createdAt(Instant.now())
				.build());

		emailService.sendBookingReceived(toEmailDetails(booking, room), manageUrl(booking));
		return BookingResponse.of(booking, room);
	}

	public List<BookingResponse> listForUser(User user) {
		return bookingRepository.findByUserIdOrderByCheckInDesc(user.getId()).stream()
				.map(this::withRoom)
				.toList();
	}

	public List<BookingResponse> listAll() {
		return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
				.map(this::withRoom)
				.toList();
	}

	/** A guest may only read their own reference; the reservations desk may read any. */
	public BookingResponse getByReference(String reference, User viewer) {
		return withRoom(requireVisible(reference, viewer));
	}

	@Transactional
	public BookingResponse cancel(String reference, User viewer) {
		Booking booking = requireVisible(reference, viewer);

		if (booking.getStatus() == BookingStatus.CANCELLED) {
			throw new BadRequestException("Booking " + reference + " is already cancelled.");
		}
		if (booking.getStatus() == BookingStatus.COMPLETED) {
			throw new BadRequestException("Booking " + reference + " has already been fulfilled.");
		}
		if (!booking.getCheckIn().isAfter(LocalDate.now())) {
			throw new BadRequestException(
					"Bookings can only be cancelled online before the arrival date. Please call the resort.");
		}

		booking.setStatus(BookingStatus.CANCELLED);
		booking.setUpdatedAt(Instant.now());
		return withRoom(booking);
	}

	/** Reservations desk: move a booking through its lifecycle. */
	@Transactional
	public BookingResponse updateStatus(String reference, BookingStatus status) {
		Booking booking = bookingRepository.findByReference(reference)
				.orElseThrow(() -> new ResourceNotFoundException("No booking found with reference " + reference));

		booking.setStatus(status);
		booking.setUpdatedAt(Instant.now());
		return withRoom(booking);
	}

	private void validateStay(Room room, BookingRequest request) {
		if (!room.isAvailable()) {
			throw new BadRequestException("The " + room.getName() + " is not taking bookings at the moment.");
		}
		if (!request.checkOut().isAfter(request.checkIn())) {
			throw new BadRequestException("The departure date must be after the arrival date.");
		}
		if (ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()) > MAX_NIGHTS) {
			throw new BadRequestException(
					"Stays longer than " + MAX_NIGHTS + " nights are arranged directly with our reservations desk.");
		}
		if (request.checkIn().isAfter(LocalDate.now().plusMonths(MAX_MONTHS_AHEAD))) {
			throw new BadRequestException(
					"We are not yet taking bookings that far ahead. Please choose a date within " + MAX_MONTHS_AHEAD
							+ " months.");
		}
		if (request.guests() > room.getCapacity()) {
			throw new BadRequestException("The %s sleeps %d. Please choose a larger suite or book a second room."
					.formatted(room.getName(), room.getCapacity()));
		}
	}

	private Booking requireVisible(String reference, User viewer) {
		Booking booking = bookingRepository.findByReference(reference)
				.orElseThrow(() -> new ResourceNotFoundException("No booking found with reference " + reference));

		if (viewer.getRole() != Role.ADMIN && !booking.getUserId().equals(viewer.getId())) {
			// Deliberately the same message as a miss, so references cannot be probed.
			throw new ResourceNotFoundException("No booking found with reference " + reference);
		}
		return booking;
	}

	private BookingResponse withRoom(Booking booking) {
		return BookingResponse.of(booking, roomService.requireById(booking.getRoomId()));
	}

	private BookingEmailDetails toEmailDetails(Booking booking, Room room) {
		return new BookingEmailDetails(booking.getReference(), booking.getGuestName(), booking.getGuestEmail(),
				booking.getGuestPhone(), room.getName(), booking.getCheckIn(), booking.getCheckOut(),
				booking.nights(), booking.getGuests(), booking.getTotalAmount(), booking.getSpecialRequests());
	}

	private String manageUrl(Booking booking) {
		return frontendUrl.replaceAll("/+$", "") + "/account/bookings/" + booking.getReference();
	}

	private String generateReference() {
		for (int attempt = 0; attempt < 5; attempt++) {
			String candidate = "GAR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
			if (bookingRepository.findByReference(candidate).isEmpty()) {
				return candidate;
			}
		}
		throw new IllegalStateException("Could not allocate a unique booking reference");
	}

	private static String orDefault(String value, String fallback) {
		return blankToNull(value) == null ? fallback : value.trim();
	}

	private static String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
