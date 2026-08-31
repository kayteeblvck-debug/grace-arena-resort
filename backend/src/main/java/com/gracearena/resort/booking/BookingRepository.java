package com.gracearena.resort.booking;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	Optional<Booking> findByReference(String reference);

	List<Booking> findAllByOrderByCreatedAtDesc();
}
