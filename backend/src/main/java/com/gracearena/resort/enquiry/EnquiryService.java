package com.gracearena.resort.enquiry;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gracearena.resort.common.ResourceNotFoundException;
import com.gracearena.resort.email.EmailService;
import com.gracearena.resort.email.EnquiryEmailDetails;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryReceipt;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryRequest;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryResponse;

@Service
@Transactional(readOnly = true)
public class EnquiryService {

	private final EnquiryRepository enquiryRepository;
	private final EmailService emailService;

	public EnquiryService(EnquiryRepository enquiryRepository, EmailService emailService) {
		this.enquiryRepository = enquiryRepository;
		this.emailService = emailService;
	}

	@Transactional
	public EnquiryReceipt submit(EnquiryRequest request) {
		Enquiry enquiry = enquiryRepository.save(Enquiry.builder()
				.reference(generateReference())
				.name(request.name().trim())
				.email(request.email().trim().toLowerCase(Locale.ROOT))
				.phone(blankToNull(request.phone()))
				.type(request.type())
				.preferredDate(request.preferredDate())
				.expectedGuests(request.expectedGuests())
				.message(request.message().trim())
				.status(EnquiryStatus.NEW)
				.createdAt(Instant.now())
				.build());

		emailService.sendEnquiryReceived(new EnquiryEmailDetails(
				enquiry.getReference(), enquiry.getName(), enquiry.getEmail(), enquiry.getPhone(),
				label(enquiry.getType()), enquiry.getPreferredDate(), enquiry.getExpectedGuests(),
				enquiry.getMessage()));

		return new EnquiryReceipt(enquiry.getReference());
	}

	public List<EnquiryResponse> listAll() {
		return enquiryRepository.findAllByOrderByCreatedAtDesc().stream().map(EnquiryResponse::from).toList();
	}

	@Transactional
	public EnquiryResponse updateStatus(String reference, EnquiryStatus status) {
		Enquiry enquiry = enquiryRepository.findByReference(reference)
				.orElseThrow(() -> new ResourceNotFoundException("No enquiry found with reference " + reference));
		enquiry.setStatus(status);
		return EnquiryResponse.from(enquiry);
	}

	/** WEDDING -> "Wedding", CORPORATE_RETREAT -> "Corporate retreat". */
	private static String label(EnquiryType type) {
		String words = type.name().toLowerCase(Locale.ROOT).replace('_', ' ');
		return Character.toUpperCase(words.charAt(0)) + words.substring(1);
	}

	private String generateReference() {
		for (int attempt = 0; attempt < 5; attempt++) {
			String candidate = "GAE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
			if (enquiryRepository.findByReference(candidate).isEmpty()) {
				return candidate;
			}
		}
		throw new IllegalStateException("Could not allocate a unique enquiry reference");
	}

	private static String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
