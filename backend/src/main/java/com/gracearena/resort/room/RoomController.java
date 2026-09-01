package com.gracearena.resort.room;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gracearena.resort.common.ApiResponse;

/**
 * The public catalogue. Whether a room is free on given dates is a different
 * question — see /v1/availability.
 */
@RestController
@RequestMapping("/v1/rooms")
public class RoomController {

	private final RoomService roomService;

	public RoomController(RoomService roomService) {
		this.roomService = roomService;
	}

	@GetMapping
	public ApiResponse<List<RoomResponse>> listRooms(
			@RequestParam(name = "availableOnly", defaultValue = "false") boolean availableOnly) {
		return ApiResponse.ok(roomService.listRooms(availableOnly));
	}

	@GetMapping("/{slug}")
	public ApiResponse<RoomResponse> getRoom(@PathVariable String slug) {
		return ApiResponse.ok(roomService.getBySlug(slug));
	}
}
