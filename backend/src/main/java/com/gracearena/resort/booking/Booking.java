package com.gracearena.resort.booking;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings", indexes = {
		@Index(name = "idx_bookings_room_dates", columnList = "roomId, checkIn, checkOut"),
		@Index(name = "idx_bookings_user", columnList = "userId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String reference;

	@Column(nullable = false)
	private Long roomId;

	/** The account that made the reservation. */
	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false)
	private String guestName;

	@Column(nullable = false)
	private String guestEmail;

	private String guestPhone;

	@Column(nullable = false)
	private LocalDate checkIn;

	@Column(nullable = false)
	private LocalDate checkOut;

	@Column(nullable = false)
	private int guests;

	@Column(length = 1000)
	private String specialRequests;

	/** Rate snapshot — the room's price can change after the booking is made. */
	@Column(nullable = false)
	private BigDecimal pricePerNight;

	@Column(nullable = false)
	private BigDecimal totalAmount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private BookingStatus status;

	@Column(nullable = false)
	private Instant createdAt;

	private Instant updatedAt;

	public int nights() {
		return (int) ChronoUnit.DAYS.between(checkIn, checkOut);
	}
}
