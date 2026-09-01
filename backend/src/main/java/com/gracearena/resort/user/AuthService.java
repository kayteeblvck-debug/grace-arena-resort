package com.gracearena.resort.user;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import com.gracearena.resort.common.BadRequestException;
import com.gracearena.resort.common.EmailNotVerifiedException;
import com.gracearena.resort.email.EmailService;
import com.gracearena.resort.email.MailProperties;
import com.gracearena.resort.security.JwtService;
import com.gracearena.resort.user.AuthDtos.AuthResponse;
import com.gracearena.resort.user.AuthDtos.LoginRequest;
import com.gracearena.resort.user.AuthDtos.RegisterRequest;
import com.gracearena.resort.user.AuthDtos.RegistrationResponse;
import com.gracearena.resort.user.AuthDtos.UserResponse;

/**
 * Registration, email confirmation and sign-in.
 *
 * Emails are sent inside the transaction; {@code EmailSender} implementations never
 * throw, so a mail outage degrades to a log line rather than a failed signup.
 */
@Service
@Transactional(readOnly = true)
public class AuthService {

	private static final Logger log = LoggerFactory.getLogger(AuthService.class);
	private static final SecureRandom RANDOM = new SecureRandom();

	private final UserRepository userRepository;
	private final EmailVerificationTokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final EmailService emailService;
	private final MailProperties mailProperties;
	private final String frontendUrl;
	private final int tokenTtlHours;

	public AuthService(UserRepository userRepository, EmailVerificationTokenRepository tokenRepository,
			PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService,
			MailProperties mailProperties,
			@Value("${app.frontend-url}") String frontendUrl,
			@Value("${app.verification.token-ttl-hours}") int tokenTtlHours) {
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.emailService = emailService;
		this.mailProperties = mailProperties;
		this.frontendUrl = frontendUrl;
		this.tokenTtlHours = tokenTtlHours;

		if (mailProperties.exposeVerificationLink()) {
			log.warn("app.mail.expose-verification-link is ON — verification links are returned in API "
					+ "responses. Development only; turn this off before deploying.");
		}
	}

	@Transactional
	public RegistrationResponse register(RegisterRequest request) {
		String email = normalise(request.email());
		if (userRepository.existsByEmail(email)) {
			throw new BadRequestException("An account already exists for " + email + ". Try signing in instead.");
		}

		User user = userRepository.save(User.builder()
				.firstName(request.firstName().trim())
				.lastName(request.lastName().trim())
				.email(email)
				.phone(blankToNull(request.phone()))
				.passwordHash(passwordEncoder.encode(request.password()))
				.role(Role.GUEST)
				.emailVerified(false)
				.createdAt(Instant.now())
				.build());

		String verificationUrl = issueVerificationLink(user);
		return new RegistrationResponse(UserResponse.from(user),
				mailProperties.exposeVerificationLink() ? verificationUrl : null);
	}

	/** Confirms the address and signs the guest straight in. */
	@Transactional
	public AuthResponse verifyEmail(String rawToken) {
		EmailVerificationToken token = tokenRepository.findByToken(rawToken.trim())
				.orElseThrow(() -> new BadRequestException(
						"That confirmation link is not valid. Request a new one below."));

		if (token.isUsed()) {
			throw new BadRequestException("That confirmation link has already been used. Please sign in.");
		}
		if (token.isExpired()) {
			throw new BadRequestException("That confirmation link has expired. Request a new one below.");
		}

		User user = userRepository.findById(token.getUserId())
				.orElseThrow(() -> new BadRequestException("That confirmation link is no longer valid."));

		token.setUsedAt(Instant.now());
		user.setEmailVerified(true);
		user.setEmailVerifiedAt(Instant.now());

		emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName(), link("/sign-in"));
		return authResponse(user);
	}

	/**
	 * Always reports success — whether an address has an account is not something an
	 * unauthenticated caller should be able to probe.
	 */
	@Transactional
	public void resendVerification(String rawEmail) {
		userRepository.findByEmail(normalise(rawEmail))
				.filter(user -> !user.isEmailVerified())
				.ifPresent(this::issueVerificationLink);
	}

	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(normalise(request.email()))
				.filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
				.orElseThrow(() -> new BadRequestException("That email and password combination is not recognised."));

		if (!user.isEmailVerified()) {
			throw new EmailNotVerifiedException(
					"Please confirm your email address before signing in. We can send the link again.");
		}

		return authResponse(user);
	}

	private String issueVerificationLink(User user) {
		tokenRepository.deleteUnusedByUserId(user.getId());

		EmailVerificationToken token = tokenRepository.save(EmailVerificationToken.builder()
				.token(randomToken())
				.userId(user.getId())
				.expiresAt(Instant.now().plus(Duration.ofHours(tokenTtlHours)))
				.build());

		String url = UriComponentsBuilder.fromUriString(link("/verify-email"))
				.queryParam("token", token.getToken())
				.build()
				.toUriString();

		emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), url, tokenTtlHours);
		return url;
	}

	private AuthResponse authResponse(User user) {
		return new AuthResponse(jwtService.issue(user), jwtService.lifetime().toSeconds(), UserResponse.from(user));
	}

	private String link(String path) {
		return frontendUrl.replaceAll("/+$", "") + path;
	}

	private static String randomToken() {
		byte[] bytes = new byte[32];
		RANDOM.nextBytes(bytes);
		return new String(Base64.getUrlEncoder().withoutPadding().encode(bytes), StandardCharsets.US_ASCII);
	}

	private static String normalise(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private static String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
