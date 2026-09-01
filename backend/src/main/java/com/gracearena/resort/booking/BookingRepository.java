package com.gracearena.resort.booking;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	Optional<Booking> findByReference(String reference);

	List<Booking> findAllByOrderByCreatedAtDesc();

	List<Booking> findByUserIdOrderByCheckInDesc(Long userId);

	/**
	 * Two stays overlap when each starts before the other ends. Check-out day is not
	 * counted: a booking ending on the 10th does not block one starting on the 10th.
	 */
	@Query("""
			select count(b) from Booking b
			where b.roomId = :roomId
			  and b.status not in :excludedStatuses
			  and b.checkIn < :checkOut
			  and b.checkOut > :checkIn
			""")
	long countOverlapping(
			@Param("roomId") Long roomId,
			@Param("checkIn") LocalDate checkIn,
			@Param("checkOut") LocalDate checkOut,
			@Param("excludedStatuses") Collection<BookingStatus> excludedStatuses);

	/** Same overlap rule, for every room at once, so a search is a single query. */
	@Query("""
			select new com.gracearena.resort.booking.RoomOccupancy(b.roomId, count(b)) from Booking b
			where b.status not in :excludedStatuses
			  and b.checkIn < :checkOut
			  and b.checkOut > :checkIn
			group by b.roomId
			""")
	List<RoomOccupancy> countOverlappingByRoom(
			@Param("checkIn") LocalDate checkIn,
			@Param("checkOut") LocalDate checkOut,
			@Param("excludedStatuses") Collection<BookingStatus> excludedStatuses);
}
