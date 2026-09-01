package com.gracearena.resort.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Development fallback used when no SMTP host is configured. Prints the plain-text
 * body to the log so verification links can still be followed locally.
 */
public class LoggingEmailSender implements EmailSender {

	private static final Logger log = LoggerFactory.getLogger(LoggingEmailSender.class);

	@Override
	public void send(EmailMessage message) {
		log.info("""

				──────────── EMAIL (not sent — no SMTP host configured) ────────────
				To:      {}
				Subject: {}

				{}
				────────────────────────────────────────────────────────────────────
				""", message.to(), message.subject(), message.text());
	}
}
