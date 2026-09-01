package com.gracearena.resort.enquiry;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gracearena.resort.common.ApiResponse;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryReceipt;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryRequest;
import com.gracearena.resort.enquiry.EnquiryDtos.EnquiryResponse;
import com.gracearena.resort.enquiry.EnquiryDtos.StatusUpdateRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/enquiries")
public class EnquiryController {

	private final EnquiryService enquiryService;

	public EnquiryController(EnquiryService enquiryService) {
		this.enquiryService = enquiryService;
	}

	/** Open to the public — this is the contact and events form. */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<EnquiryReceipt> submit(@Valid @RequestBody EnquiryRequest request) {
		return ApiResponse.ok("Thank you — we will be in touch shortly", enquiryService.submit(request));
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<List<EnquiryResponse>> listAll() {
		return ApiResponse.ok(enquiryService.listAll());
	}

	@PatchMapping("/{reference}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ApiResponse<EnquiryResponse> updateStatus(@PathVariable String reference,
			@Valid @RequestBody StatusUpdateRequest request) {
		return ApiResponse.ok("Enquiry updated", enquiryService.updateStatus(reference, request.status()));
	}
}
