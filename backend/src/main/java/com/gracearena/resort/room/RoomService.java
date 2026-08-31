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
		List<Room> rooms = availableOnly ? roomRepository.findByAvailableTrue() : roomRepository.findAll();
		return rooms.stream().map(RoomResponse::from).toList();
	}

	public RoomResponse getBySlug(String slug) {
		return roomRepository.findBySlug(slug)
				.map(RoomResponse::from)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with slug '" + slug + "'"));
	}

	public Room requireById(Long id) {
		return roomRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("No room found with id " + id));
	}
}
