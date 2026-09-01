package com.gracearena.resort.email;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Everything under {@code app.mail}. Note this is separate from {@code spring.mail},
 * which configures the SMTP transport itself.
 */
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(
		String from,
		String fromName,
		String reservationsInbox,
		boolean exposeVerificationLink) {
}
