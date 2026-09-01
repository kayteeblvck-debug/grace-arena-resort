package com.gracearena.resort.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.gracearena.resort.user.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

/** Issues and reads the HS256 bearer tokens the React client holds. */
@Service
public class JwtService {

	private static final Logger log = LoggerFactory.getLogger(JwtService.class);
	private static final String DEV_SECRET = "dev-only-secret-change-me-before-you-deploy-anything";

	private final JwtProperties properties;
	private final SecretKey key;

	public JwtService(JwtProperties properties) {
		this.properties = properties;
		byte[] secret = properties.secret().getBytes(StandardCharsets.UTF_8);
		if (secret.length < 32) {
			throw new IllegalStateException("app.jwt.secret must be at least 32 characters for HS256");
		}
		this.key = Keys.hmacShaKeyFor(secret);
	}

	@PostConstruct
	void warnAboutDevSecret() {
		if (DEV_SECRET.equals(properties.secret())) {
			log.warn("Using the built-in development JWT secret. Set APP_JWT_SECRET before deploying.");
		}
	}

	public String issue(User user) {
		Instant now = Instant.now();
		return Jwts.builder()
				.subject(String.valueOf(user.getId()))
				.claim("email", user.getEmail())
				.claim("role", user.getRole().name())
				.claim("name", user.fullName())
				.issuedAt(Date.from(now))
				.expiration(Date.from(now.plusMillis(properties.expirationMs())))
				.signWith(key)
				.compact();
	}

	/** Returns the user id in the token, or null when it is missing, expired or forged. */
	public Long readUserId(String token) {
		try {
			Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
			return Long.valueOf(claims.getSubject());
		} catch (JwtException | IllegalArgumentException ex) {
			log.debug("Rejected bearer token: {}", ex.getMessage());
			return null;
		}
	}

	public Duration lifetime() {
		return Duration.ofMillis(properties.expirationMs());
	}
}
