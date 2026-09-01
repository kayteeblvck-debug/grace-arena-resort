package com.gracearena.resort.room;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gracearena.resort.common.ResourceNotFoundException;

@Service
@Transactional(readOnly = true)
public class RoomService {

	private final RoomRepository roomRepository;

	public RoomService(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	public List<RoomResponse> listRooms(boolean availableOnly) {
		return rooms(availableOnly).stream().map(RoomResponse::from).toList();
	}

	public List<Room> rooms(boolean availableOnly) {
		return availableOnly
				? roomRepository.findByAvailableTrueOrderBySortOrderAscPricePerNightAsc()
				: roomRepository.findAllByOrderBySortOrderAscPricePerNightAsc();
	}

	public RoomResponse getBySlug(String slug) {
		return RoomResponse.from(requireBySlug(slug));
	}

	public Room requireBySlug(String slug) {
		return roomRepository.findBySlug(slug)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with slug '" + slug + "'"));
	}

	public Room requireById(Long id) {
		return roomRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with id " + id));
	}

	/**
	 * Loads a room with its row locked for the rest of the transaction. Call this
	 * before counting overlapping bookings so the count cannot go stale underneath.
	 */
	public Room requireByIdForBooking(Long id) {
		roomRepository.lockForBooking(id)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with id " + id));
		return requireById(id);
	}
}
