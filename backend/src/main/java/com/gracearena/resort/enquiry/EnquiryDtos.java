package com.gracearena.resort.enquiry;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class EnquiryDtos {

	private EnquiryDtos() {
	}

	public record EnquiryRequest(
			@NotBlank(message = "is required") @Size(max = 120) String name,
			@NotBlank(message = "is required") @Email(message = "must be a valid email") String email,
			@Size(max = 30) String phone,
			@NotNull(message = "is required") EnquiryType type,
			LocalDate preferredDate,
			@Min(value = 1, message = "must be at least 1") @Max(value = 5000,
					message = "is larger than the Arena holds — please call us") Integer expectedGuests,
			@NotBlank(message = "is required") @Size(max = 4000,
					message = "must be under 4000 characters") String message) {
	}

	public record EnquiryResponse(
			Long id,
			String reference,
			String name,
			String email,
			String phone,
			EnquiryType type,
			LocalDate preferredDate,
			Integer expectedGuests,
			String message,
			EnquiryStatus status,
			Instant createdAt) {

		public static EnquiryResponse from(Enquiry enquiry) {
			return new EnquiryResponse(enquiry.getId(), enquiry.getReference(), enquiry.getName(),
					enquiry.getEmail(), enquiry.getPhone(), enquiry.getType(), enquiry.getPreferredDate(),
					enquiry.getExpectedGuests(), enquiry.getMessage(), enquiry.getStatus(), enquiry.getCreatedAt());
		}
	}

	/** What the public form gets back — just enough to show a confirmation. */
	public record EnquiryReceipt(String reference) {
	}

	public record StatusUpdateRequest(@NotNull(message = "is required") EnquiryStatus status) {
	}
}
