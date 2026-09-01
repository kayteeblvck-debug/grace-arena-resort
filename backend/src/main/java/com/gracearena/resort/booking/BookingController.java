package com.gracearena.resort.booking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gracearena.resort.common.ApiResponse;
import com.gracearena.resort.user.User;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/v1/bookings")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	public record StatusUpdateRequest(@NotNull(message = "is required") BookingStatus status) {
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<BookingResponse> create(@AuthenticationPrincipal User user,
			@Valid @RequestBody BookingRequest request) {
		return ApiResponse.ok("Booking request received", bookingService.create(user, request));
	}

	/** The signed-in guest's own stays. */
	@GetMapping("/me")
	public ApiResponse<List<BookingResponse>> myBookings(@AuthenticationPrincipal User user) {
		return ApiResponse.ok(bookingService.listForUser(user));
	}

	@GetMapping("/{reference}")
	public ApiResponse<BookingResponse> getByReference(@AuthenticationPrincipal User user,
			@PathVariable String reference) {
		return ApiResponse.ok(bookingService.getByReference(reference, user));
	}

	@PostMapping("/{reference}/cancel")
	public ApiResponse<BookingResponse> cancel(@AuthenticationPrincipal User user, @PathVariable String reference) {
		return ApiResponse.ok("Booking cancelled", bookingService.cancel(reference, user));
	}

	/** Reservations desk. */
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<List<BookingResponse>> listAll() {
		return ApiResponse.ok(bookingService.listAll());
	}

	@PatchMapping("/{reference}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<BookingResponse> updateStatus(@PathVariable String reference,
			@Valid @RequestBody StatusUpdateRequest request) {
		return ApiResponse.ok("Booking updated", bookingService.updateStatus(reference, request.status()));
	}
}
