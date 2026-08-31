package com.gracearena.resort.booking;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gracearena.resort.common.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/bookings")
public class BookingController {

	private final BookingService bookingService;

	public BookingController(BookingService bookingService) {
		this.bookingService = bookingService;
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
		return ApiResponse.ok("Booking request received", bookingService.create(request));
	}

	@GetMapping
	public ApiResponse<List<BookingResponse>> listAll() {
		return ApiResponse.ok(bookingService.listAll());
	}

	@GetMapping("/{reference}")
	public ApiResponse<BookingResponse> getByReference(@PathVariable String reference) {
		return ApiResponse.ok(bookingService.getByReference(reference));
	}
}
