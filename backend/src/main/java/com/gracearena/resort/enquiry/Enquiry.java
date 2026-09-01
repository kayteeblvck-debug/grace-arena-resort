package com.gracearena.resort.enquiry;

import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** An event or general enquiry sent from the contact and events pages. */
@Entity
@Table(name = "enquiries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enquiry {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String reference;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EnquiryType type;

	private LocalDate preferredDate;

	private Integer expectedGuests;

	@Column(nullable = false, length = 4000)
	private String message;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EnquiryStatus status;

	@Column(nullable = false)
	private Instant createdAt;
}
