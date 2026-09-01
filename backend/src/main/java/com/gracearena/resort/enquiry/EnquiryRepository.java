package com.gracearena.resort.enquiry;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

	Optional<Enquiry> findByReference(String reference);

	List<Enquiry> findAllByOrderByCreatedAtDesc();
}
