package com.gracearena.resort.email;

import java.time.LocalDate;

/** Flat view of an event/general enquiry for the mailer. */
public record EnquiryEmailDetails(
		String reference,
		String name,
		String email,
		String phone,
		String subject,
		LocalDate preferredDate,
		Integer expectedGuests,
		String message) {
}
