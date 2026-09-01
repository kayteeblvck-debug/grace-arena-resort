package com.gracearena.resort.user;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Single-use email confirmation token. Rows are kept after use so a replayed link
 * can be told apart from a link that never existed.
 */
@Entity
@Table(name = "email_verification_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 64)
	private String token;

	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false)
	private Instant expiresAt;

	private Instant usedAt;

	public boolean isUsed() {
		return usedAt != null;
	}

	public boolean isExpired() {
		return expiresAt.isBefore(Instant.now());
	}
}
