package com.gracearena.resort.room;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findByAvailableTrueOrderBySortOrderAscPricePerNightAsc();

	List<Room> findAllByOrderBySortOrderAscPricePerNightAsc();

	Optional<Room> findBySlug(String slug);

	/**
	 * Takes a write lock on the room row so two simultaneous booking attempts for the
	 * same room type are serialised rather than both seeing the last free unit.
	 * Selects the id only: a scalar projection keeps the eagerly fetched collections
	 * out of the {@code for update} statement.
	 */
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("select r.id from Room r where r.id = :id")
	Optional<Long> lockForBooking(@Param("id") Long id);
}
