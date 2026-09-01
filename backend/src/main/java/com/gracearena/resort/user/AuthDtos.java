package com.gracearena.resort.user;

import java.time.Instant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request and response shapes for the account endpoints, grouped in one file
 * because they are only ever used together.
 */
public final class AuthDtos {

	private AuthDtos() {
	}

	public record RegisterRequest(
			@NotBlank(message = "is required") @Size(max = 60) String firstName,
			@NotBlank(message = "is required") @Size(max = 60) String lastName,
			@NotBlank(message = "is required") @Email(message = "must be a valid email") String email,
			@Size(max = 30) String phone,
			@NotBlank(message = "is required") @Size(min = 8, max = 100,
					message = "must be at least 8 characters") String password) {
	}

	public record LoginRequest(
			@NotBlank(message = "is required") @Email(message = "must be a valid email") String email,
			@NotBlank(message = "is required") String password) {
	}

	public record VerifyEmailRequest(@NotBlank(message = "is required") String token) {
	}

	public record EmailRequest(
			@NotBlank(message = "is required") @Email(message = "must be a valid email") String email) {
	}

	public record UserResponse(
			Long id,
			String firstName,
			String lastName,
			String email,
			String phone,
			Role role,
			boolean emailVerified,
			Instant createdAt) {

		public static UserResponse from(User user) {
			return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
					user.getPhone(), user.getRole(), user.isEmailVerified(), user.getCreatedAt());
		}
	}

	/** Successful sign-in or email confirmation: a bearer token plus who it belongs to. */
	public record AuthResponse(String token, long expiresInSeconds, UserResponse user) {
	}

	/**
	 * Registration deliberately does not return a token — the account is unusable
	 * until the address is confirmed. {@code verificationUrl} is only populated when
	 * app.mail.expose-verification-link is on, which is a development convenience.
	 */
	public record RegistrationResponse(UserResponse user, String verificationUrl) {
	}
}
